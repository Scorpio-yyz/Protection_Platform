<template>
    <div class="new-censor-container">
        <MySearch :search="searchOpt" @search="onSearch" @reset="reset">
        </MySearch>
        <el-row justify="end">
            <el-button type="primary" :icon="UploadFilled" @click="state.addVisible = true">在线审查</el-button>
        </el-row>
        <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="fileName" label="文件名" width="180" align="center" />
            <el-table-column prop="logotype" label="文件标识" width="180" align="center" />
            <el-table-column prop="fileType" label="文件" width="220" align="center">
                <template #default="{ row }">
                    <img v-if="row.fileType === '图片'" class="pre-img" :src="row.fileUrl" :alt="row.fileName"
                        @click="preview(row)">
                    <video v-if="row.fileType === '视频'" class="pre-video" :src="row.fileUrl" controls="controls"></video>
                </template>
            </el-table-column>
            <el-table-column prop="result" label="检测结果" width="120" align="center">
                <template #default="{ row }">
                    <el-popover placement="top" :width="400" trigger="hover" v-if="row.result === '异常警告'">
                        <template #reference>
                            <span :style="{ color: formatResultColor(row.result) }">{{ row.result }}</span>
                        </template>
                        <div class="warn-box">
                            <el-icon :size="24" color="var(--el-color-danger)">
                                <WarnTriangleFilled />
                            </el-icon>
                            <div class="txt-info">
                                <span>此文件不在区块链中，请对其进行深伪检测</span>
                                <!-- <span class="txt-btn" @click="toDeepDetect(row)">深伪检测</span> -->
                            </div>
                        </div>
                    </el-popover>
                    <span v-else :style="{ color: formatResultColor(row.result) }">{{ row.result }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="block" label="所在区块" align="center">
                <template #default="{ row }">
                    <span v-if="row.result === '异常警告'"></span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="检测状态" width="180" align="center">
                <template #default="{ row }">
                    <el-tag :type="formatStatusColor(row.status)">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="datetime" label="检测时间" width="180" align="center" />
            <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                    <!-- <el-button type="primary" link @click="lookResult(row)">查看结果</el-button> -->
                    <el-popconfirm title="确定删除此任务吗？" @confirm="delMission(row)" width="180">
                        <template #reference>
                            <el-button type="primary" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNum"
            v-model:limit="state.queryParams.pageSize" @pagination="getList" />
    </div>
    <CensorDialog v-model:visible="state.addVisible" @success="upSuccess"></CensorDialog>
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="previewImgList"
        hide-on-click-modal></el-image-viewer>
</template>
  
<script name="CensorList" setup>
import missionList from "./jsonData/missionList.js";
import CensorDialog from "./components/AddCensorDialog";
import { formatStatusColor } from "@/utils/index"

const searchOpt = [
    {
        label: '文件名', prop: 'fileName', placeholder: '请输入文件名', required: false, type: 'input'
    },
    {
        label: '检测状态', prop: 'status', placeholder: '请选择检测状态', required: false, type: 'select', options: [
            { label: '检测中', value: '1' },
            { label: '已完成', value: '2' },
        ]
    },
    {
        label: '检测结果',
        prop: 'result',
        placeholder: '请选择检测结果',
        required: false,
        type: 'select',
        options: [
            { label: '异常警告', value: '1' },
            { label: '未发现异常', value: '2' },
        ]
    },
    {
        label: '检测时间',
        prop: 'datetime',
        placeholder: '请选择检测时间',
        required: false,
        type: 'date',
    },
]
const state = reactive({
    tableData: missionList.sort((a, b) => {
        const date1 = new Date(a.datetime);
        const date2 = new Date(b.datetime);
        return date2 - date1;
    }),
    total: missionList.length,
    queryParams: {
        pageNum: 0,
        pageSize: 10,
        fileName: "",
        logotype: "",
        date: "",
    },
    addVisible: false,
    showImagePreview: false,
    previewIndex: 0
})

const previewImgList = computed(() => {
    return state.tableData.filter(item => item.fileType === "图片").map(item => item.fileUrl)
})

// 预览图片
const preview = (row) => {
    const index = previewImgList.value.indexOf(row.fileUrl)
    state.previewIndex = index === -1 ? 0 : index
    state.showImagePreview = true
}

const lookResult = (row) => {
    state.resultVisible = true
}

const delMission = (row) => {

}

const formatResultColor = (result) => {
    switch (result) {
        case '异常警告':
            return 'var(--el-color-danger)';
        case '无异常':
            return 'var(--el-color-success)';
        default:
            return '#67C23A';
    }
}
// 审查完成
const upSuccess = (data) => {
    state.tableData.unshift(data)
}

const toDeepDetect = (row) => {

}

</script>
  
<style lang="scss" scoped>
.new-censor-container {
    padding: 20px;

    .tab-con {
        margin-top: 20px;

        .pre-img {
            width: auto;
            max-width: 100%;
            height: 120px;
            cursor: pointer;
        }

        .pre-video {
            width: auto;
            max-width: 100%;
            height: 120px;
        }

        :deep(.el-table__body-wrapper) {
            min-height: 450px;
        }

    }
}

.warn-box {
    display: flex;
    align-items: center;

    .txt-info {
        margin-left: 10px;
        display: flex;
        align-items: center;

        .txt-btn {
            color: var(--el-color-primary);
            cursor: pointer;

            &:active {
                color: var(--el-color-primary-light-4);
            }
        }
    }
}
</style>