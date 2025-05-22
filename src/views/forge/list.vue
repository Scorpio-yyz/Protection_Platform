<template>
    <div class="forge-container">
        <MySearch :search="searchOpt" @search="onSearch" @reset="reset"></MySearch>
        <el-row justify="end">
            <el-button type="primary" @click="state.addMissionVisible = true">新增检测</el-button>
        </el-row>
        <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="id" label="任务id" width="220" align="center" />
            <el-table-column prop="fileName" label="文件名称" align="center"></el-table-column>
            <el-table-column prop="url" label="媒体文件" align="center">
                <template #default="{ row }">
                    <img v-if="row.fileType === '图片'" class="pre-img" :src="row.url"
                        @click="state.showImagePreview = true" />
                    <video v-else-if="row.fileType === '视频'" class="pre-img" controls :src="row.url"></video>
                </template>
            </el-table-column>
            <el-table-column prop="fileType" label="媒体类型" width="180" align="center" />
            <el-table-column prop="probability" label="伪造概率" width="180" align="center">
                <template #default="{ row }">
                    <template v-if="row.status === '已完成'">
                        <el-tag v-if="row.probability >= 80" type="danger" size="large">{{ row.probability }}%</el-tag>
                        <el-tag v-else-if="row.probability < 80 && row.probability >= 50" type="warning" size="large">
                            {{ row.probability }}%
                        </el-tag>
                        <el-tag v-else-if="row.probability < 50" type="success" size="large">
                            {{ row.probability }}%
                        </el-tag>
                    </template>
                    <span v-else>---</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="任务状态" width="180" align="center">
                <template #default="{ row }">
                    <el-tag :type="formatStatusColor(row.status)">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="datetime" label="创建时间" width="180" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="{ row }">
                    <!-- <el-button type="primary" link @click="preview(row)">预览文件</el-button> -->
                    <el-button type="primary" @click="download(row)" link>下载</el-button>
                    <el-popconfirm title="确定删除此文件吗？" @confirm="delMission(row)" width="180">
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
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="previewImgList"
        hide-on-click-modal></el-image-viewer>
    <AddForgeDialog v-model:visible="state.addMissionVisible" @success="addDetect" :status="state.detailData.status" />
</template>
  
<script name="Forge" setup>
import { formatStatusColor, downLoadFile } from "@/utils";
import forgeData from "./jsonData/forgeList.js"
import AddForgeDialog from "./components/AddForgeDialog";
import { computed } from "vue";

const searchOpt = [
    {
        label: '媒体类型', prop: 'fileType', placeholder: '请选择账媒体类型', required: false, type: 'select',
        options: [{ label: '视频', value: '视频' }, { label: '图片', value: '图片' }, { label: '音频', value: '音频' }]
    },
]

const state = reactive({
    tableData: forgeData,
    total: forgeData.length,
    queryParams: {
        waterName: "",
        pageSize: 8,
        pageNum: 1,
    },
    addMissionVisible: false,
    showImagePreview: false,
    detailData: {
        "id": "",
        "fileName": "",
        "url": "",
        "fileType": "",
        "status": "",
        "probability": 0,
        "datetime": ""
    }
})

const previewImgList = computed(() => {
    return state.tableData.filter(item => item.fileType === '图片').map(item => item.url)
})

// 获取列表
const getList = () => { }


const addDetect = (data) => {
    state.tableData.push(data);
}

const preview = (row) => {
    state.showImagePreview = true;
}

const lookResult = (row) => {

}

const download = (row) => {
    downLoadFile(row.fileName, row.url)
}

const delMission = (row) => {

}
</script>
  
<style lang="scss" scoped>
.forge-container {
    padding: 20px;

    .tab-con {
        margin-top: 20px;

        .pre-img {
            width: auto;
            max-width: 100%;
            height: auto;
            max-height: 150px;
            cursor: pointer;
        }
    }
}
</style>