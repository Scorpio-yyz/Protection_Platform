<template>
    <div class="table-search-container" v-if="props.search.length > 0">
        <el-form ref="tableSearchRef" :model="state.form" size="default" label-width="100px" class="table-form">
            <el-row>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="pl10 pr10" v-for="(val, key) in search" :key="key"
                    v-show="key === 0 || state.isToggle">
                    <template v-if="val.type !== ''">
                        <el-form-item :label="val.label" :prop="val.prop"
                            :rules="[{ required: val.required, message: `${val.label}不能为空`, trigger: val.type === 'input' ? 'blur' : 'change' }]">
                            <el-input v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable
                                v-if="val.type === 'input'" style="width: 100%" />
                            <el-date-picker v-model="state.form[val.prop]" type="date" :placeholder="val.placeholder"
                                v-else-if="val.type === 'date'" style="width: 100%" clearable />
                            <el-select v-model="state.form[val.prop]" :placeholder="val.placeholder"
                                v-else-if="val.type === 'select'" style="width: 100%" clearable>
                                <el-option v-for="item in val.options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="8" style="flex-grow: 1;">
                    <el-form-item class="table-form-btn" :label-width="search.length <= 1 ? '10px' : '10px'">
                        <el-button :icon="Search" size="default" type="primary" class="ml10"
                            @click="onSearch(tableSearchRef)">查询
                        </el-button>
                        <el-button :icon="RefreshRight" size="default" type="info" class="ml10"
                            @click="onReset(tableSearchRef)">
                            重置
                        </el-button>
                        <slot name="new-btn"></slot>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup name="Search">
import { reactive, ref, onMounted } from 'vue';
import { Search, RefreshRight } from '@element-plus/icons-vue';


// 定义父组件传过来的值
const props = defineProps({
    // 搜索表单
    search: {
        type: Array,
        default: () => [],
    },
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search', 'reset']);

// 定义变量内容
const tableSearchRef = ref();
const state = reactive({
    form: {},
    isToggle: true,
});

// 查询
const onSearch = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            emit('search', state.form);
        } else {
            return false;
        }
    });
};
// 重置
const onReset = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    emit('reset');
};
// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
    if (props.search.length <= 0) return false;
    props.search.forEach((v) => (state.form[v.prop] = ''));
};
// 页面加载时
onMounted(() => {
    initFormField();
});
</script>

<style scoped lang="scss">
.table-search-container {
    display: flex;

    .table-form {
        flex: 1;

        .table-form-btn-toggle {
            white-space: nowrap;
            user-select: none;
            display: flex;
            align-items: center;
            color: var(--el-color-primary);
        }
    }
}
</style>