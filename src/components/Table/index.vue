<template>
    <div class="table-container">
        <el-table :data="data" :border="setBorder" v-bind="$attrs" row-key="id" stripe style="width: 100%"
            highlight-current-row v-loading="config.loading" @selection-change="onSelectionChange">
            <el-table-column type="selection" :reserve-selection="true" width="30" v-if="config.isSelection" />
            <el-table-column type="index" label="序号" width="60" v-if="config.isSerialNo" align="center" />
            <el-table-column v-for="(item, index) in setHeader" :key="index" show-overflow-tooltip :prop="item.key"
                :width="item.colWidth" :label="item.title" align="center">
                <template v-slot="scope">
                    <template v-if="item.type === 'image'">
                        <img :src="scope.row[item.key]" :width="item.width" :height="item.height" />
                    </template>
                    <template v-else-if="item.type === 'slot'">
                        <slot :row="scope.row" :name="item.slotName"></slot>
                    </template>
                    <template v-else>
                        {{ scope.row[item.key] }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" v-if="config.isOperate" align="center">
                <template v-slot="scope">
                    <slot :row="scope.row" name="edit-btn"></slot>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="暂无数据" />
            </template>
        </el-table>
        <div class="table-footer mt15">
            <el-pagination v-model:current-page="state.page.pageNum" v-model:page-size="state.page.pageSize"
                hide-on-single-page :total="config.total" layout="total, prev, pager, next, jumper" background
                @current-change="onHandleCurrentChange">
            </el-pagination>
            <div class="table-footer-tool" v-if="config.isTools">
                <SvgIcon name="iconfont icon-yunxiazai_o" :size="22" title="导出" @click="onImportTable" />
                <SvgIcon name="iconfont icon-shuaxin" :size="22" title="刷新" @click="onRefreshTable" />
                <el-popover placement="top-end" trigger="click" transition="el-zoom-in-top" popper-class="table-tool-popper"
                    :width="300" :persistent="false" @show="onSetTable">
                    <template #reference>
                        <SvgIcon name="iconfont icon-quanjushezhi_o" :size="22" title="设置" />
                    </template>
                    <template #default>
                        <div class="tool-box">
                            <el-tooltip content="拖动进行排序" placement="top-start">
                                <SvgIcon name="fa fa-question-circle-o" :size="17" class="ml11" color="#909399" />
                            </el-tooltip>
                            <el-checkbox v-model="state.checkListAll" :indeterminate="state.checkListIndeterminate"
                                class="ml10 mr1" label="列显示" @change="onCheckAllChange" />
                            <el-checkbox v-model="getConfig.isSerialNo" class="ml12 mr1" label="序号" />
                            <el-checkbox v-model="getConfig.isSelection" class="ml12 mr1" label="多选" />
                        </div>
                        <el-scrollbar>
                            <div ref="toolSetRef" class="tool-sortable">
                                <div class="tool-sortable-item" v-for="v in header" :key="v.key" :data-key="v.key">
                                    <i class="fa fa-arrows-alt handle cursor-pointer"></i>
                                    <el-checkbox v-model="v.isCheck" size="default" class="ml12 mr8" :label="v.title"
                                        @change="onCheckChange" />
                                </div>
                            </div>
                        </el-scrollbar>
                    </template>
                </el-popover>
            </div>
        </div>
    </div>
</template>

<script setup name="netxTable">
import { reactive, computed, nextTick, ref } from 'vue';
import { ElMessage } from 'element-plus';
// import Sortable from 'sortablejs';
import { storeToRefs } from 'pinia';

// 定义父组件传过来的值
const props = defineProps({
    // 列表内容
    data: {
        type: Array,
        default: () => [],
    },
    // 表头内容
    header: {
        type: Array,
        default: () => [],
    },
    // 配置项
    config: {
        type: Object,
        default: () => ({
            total: 0, // 列表总数
            loading: true, // loading 加载
            isBorder: false, // 是否显示表格边框
            isSerialNo: true, // 是否显示表格序号
            isSelection: true, // 是否显示表格多选
            isOperate: true, // 是否显示表格操作栏
            isTools: false,    // 是否显示工具栏
            isPagination: true
        }),
    },
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['pageChange', 'sortHeader', 'getselectList']);

// 定义变量内容
const toolSetRef = ref();
const state = reactive({
    page: {
        pageNum: 1,
        pageSize: 10,
    },
    selectlist: [],
    checkListAll: true,
    checkListIndeterminate: false,
});

// 设置边框显示/隐藏
const setBorder = computed(() => {
    return props.config.isBorder ? true : false;
});
// 获取父组件 配置项（必传）
const getConfig = computed(() => {
    return props.config;
});
// 设置 tool header 数据
const setHeader = computed(() => {
    return props.header.filter((v) => v.isCheck);
});
// tool 列显示全选改变时
const onCheckAllChange = (val) => {
    if (val) props.header.forEach((v) => (v.isCheck = true));
    else props.header.forEach((v) => (v.isCheck = false));
    state.checkListIndeterminate = false;
};
// tool 列显示当前项改变时
const onCheckChange = () => {
    const headers = props.header.filter((v) => v.isCheck).length;
    state.checkListAll = headers === props.header.length;
    state.checkListIndeterminate = headers > 0 && headers < props.header.length;
};
// 表格多选改变时，用于导出
const onSelectionChange = (val = []) => {
    state.selectlist = val;
    emit('getselectList', val)
};
// 分页改变
const onHandleCurrentChange = (val) => {
    state.page.pageNum = val;
    emit('pageChange', state.page);
};
// 搜索时，分页还原成默认
const pageReset = () => {
    state.page.pageNum = 1;
    state.page.pageSize = 10;
    emit('pageChange', state.page);
};
// 导出
const onImportTable = () => {
    if (state.selectlist.length <= 0) return ElMessage.warning('请先选择要导出的数据');
    console("导出数据")
};
// 刷新
const onRefreshTable = () => {
    emit('pageChange', state.page);
};
// 设置
const onSetTable = () => {
    nextTick(() => {
        // const sortable = Sortable.create(toolSetRef.value, {
        //     handle: '.handle',
        //     dataIdAttr: 'data-key',
        //     animation: 150,
        //     onEnd: () => {
        //         const headerList = [];
        //         sortable.toArray().forEach((val) => {
        //             props.header.forEach((v) => {
        //                 if (v.key === val) headerList.push({ ...v });
        //             });
        //         });
        //         emit('sortHeader', headerList);
        //     },
        // });
    });
};

// 暴露变量
defineExpose({
    pageReset,
});
</script>

<style scoped lang="scss">
.table-container {
    display: flex;
    flex-direction: column;

    .el-table {
        flex: 1;
    }

    .table-footer {
        display: flex;
        justify-content: center;

        .table-footer-tool {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            i {
                margin-right: 10px;
                cursor: pointer;
                color: var(--el-text-color-regular);

                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
