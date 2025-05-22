<template>
    <div class="forge-container">
        <!-- <MySearch :search="searchOpt" @search="onSearch" @reset="reset"></MySearch> -->
        <el-row justify="end">
            <el-button type="primary" @click="state.addMissionVisible = true">新增检测</el-button>
        </el-row>
        <el-row class="tab-con" :gutter="10">
            <ForgeColBox v-for="(item, index) in state.tableData" :key="index" :detailData="item"></ForgeColBox>
        </el-row>
        <pagination v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNum"
            v-model:limit="state.queryParams.pageSize" @pagination="getList" />
    </div>
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="previewImgList"
        hide-on-click-modal></el-image-viewer>
    <AddForgeDialog v-model:visible="state.addMissionVisible" fileType="视频" @initialData="addDetect" @success="updateProbability"
        :status="state.detailData.status" />
</template>
  
<script name="ForgeVideo" setup>
import { formatStatusColor, downLoadFile } from "@/utils";
import forgeData from "./jsonData/videoDataList.js";
import AddForgeDialog from "./components/AddForgeDialog";
import ForgeColBox from "./components/ForgeColBox";
import { v4 as uuidv4 } from "uuid"
import { computed, onMounted, reactive} from "vue";

import axios from "axios"

const searchOpt = [
    {
        label: '媒体类型', prop: 'fileType', placeholder: '请选择账媒体类型', required: false, type: 'select',
        options: [{ label: '视频', value: '视频' }, { label: '图片', value: '图片' }, { label: '音频', value: '音频' }]
    },
]

const state = reactive({
    // tableData: forgeData,
    // total:forgeData.length,
    tableData: [],
    total: 0,
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
        "fileUrl": "",
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
const getList = async () => {
    try {
        const response = await axios.get('http://49.123.117.252:3002/video'); // 请求后端接口
        // 映射uuid到id
        state.tableData = response.data.map(item => ({
            ...item,
            id: item.uuid, // 假设后端返回的uuid存储在item.uuid中
        }));
        state.total = response.data.length;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 页面加载时获取数据
onMounted(() => {
    getList();
});

const addDetect = (data) => {
    state.tableData.unshift(data);
    state.tableData[0].status = "检测中"
    // state.tableData.unshift(data);
    // setTimeout(() => {
    //     state.tableData[0].probability = 96
    //     state.tableData[0].status = "已完成"
    // }, 3000);
}

const updateProbability = (data) => {
    //更新对应数据项的概率和状态
    const index = state.tableData.findIndex(item => item.id === data.id)
    if (index !== -1) {
        state.tableData[index].probability = data.probability
        state.tableData[index].status = "已完成"
    }
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