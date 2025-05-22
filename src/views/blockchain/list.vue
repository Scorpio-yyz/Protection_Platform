<template>
    <div class="prove-container">
        <MySearch :search="searchOpt" @search="onSearch" @reset="reset">
        </MySearch>
        <el-row justify="end">
            <el-button type="primary" :icon="UploadFilled" @click="upload">数据上链</el-button>
            <!-- <el-button type="primary">导出结果</el-button>
            <el-button type="info" @click="reset">重置</el-button> -->
        </el-row>
        <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="fileName" label="文件名" width="180" align="center" />
            <el-table-column prop="logotype" label="溯源标识" width="180" align="center" />
            <!-- <el-table-column prop="fileType" label="文件类型" width="120" align="center" /> -->
            <el-table-column prop="fileType" label="文件类型" width="220" align="center">
                <template #default="{ row }">
                    <img v-if="row.fileType === '图片'" class="pre-img" :src="row.fileUrl" :alt="row.fileName"
                        @click="preview(row)">
                    <video v-if="row.fileType === '视频'" class="pre-video" :src="row.fileUrl" controls="controls"></video>
                </template>
            </el-table-column>
            <el-table-column prop="hash" label="区块哈希" align="center" />
            <el-table-column prop="datetime" label="上传时间" width="120" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="{ row }">
                    <!-- <el-button type="primary" link @click="preview(row)">预览文件</el-button> -->
                    <el-button type="primary" link @click="download(row)">下载</el-button>
                    <el-popconfirm title="确定删除此文件吗？" @confirm="delFile(row)">
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
    <PreviewDialog v-model:previewVisible="state.previewDialogVisible"></PreviewDialog>
    <UploadFileDialog v-model:visible="state.dialogVisible" @success="uploadSuccess" />
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="previewImgList"
        hide-on-click-modal></el-image-viewer>
</template>
  
<script name="BlockChainProve" setup>
import { computed, reactive } from "vue";
import { UploadFilled } from "@element-plus/icons-vue"
import PreviewDialog from "@/components/PreviewDialog"
import UploadFileDialog from "./components/UploadFileDialog";
import dataJson from "./jsonData/fileList.js"
import { formatDate, downLoadFile } from "@/utils/index"

const searchOpt = [
    { label: '文件名称', prop: 'fileName', placeholder: '请输入文件名称', required: false, type: 'input' },
    {
        label: '溯源标识',
        prop: 'logotype',
        placeholder: '请选择溯源标识',
        required: false,
        type: 'input',
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
    tableData: dataJson.sort((a, b) => {
        const date1 = new Date(a.datetime);
        const date2 = new Date(b.datetime);
        return date2 - date1;
    }),
    total: dataJson.length,
    dialogVisible: false,
    previewDialogVisible: false,
    queryParams: {
        pageNum: 0,
        pageSize: 10,
        fileName: "",
        logotype: "",
        date: "",
    },
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

// 下载文件
const download = row => {
    downLoadFile(row.fileName, row.fileUrl)
}

const getList = () => { }

const upload = () => {
    state.dialogVisible = true
}

// 数据上链成功
const uploadSuccess = (data) => {
    state.tableData.unshift(data)
}

// 删除文件
const delFile = (row) => {

}
</script>
 
<style lang="scss" scoped>
.prove-container {
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
    }
}
</style>