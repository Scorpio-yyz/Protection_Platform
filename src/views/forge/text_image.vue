<template>
    <div class="forge-container">
        <!-- 新增检测任务的按钮 -->
        <el-row justify="end">
            <el-button type="primary" @click="state.addMissionVisible = true">新增检测</el-button>
        </el-row>
        
        <!-- 显示任务列表 -->
        <el-row class="tab-con" :gutter="10">
            <ForgeColBox v-for="(item, index) in state.tableData" :key="index" :detailData="item"></ForgeColBox>
        </el-row>
        
        <!-- 分页组件，只有在总任务数大于 0 时显示 -->
        <pagination v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNum"
            v-model:limit="state.queryParams.pageSize" @pagination="getList" />
    </div>
    
    <!-- 图片预览组件，当需要预览时显示 -->
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="previewImgList"
        hide-on-click-modal></el-image-viewer>
    
    <!-- 新增任务的对话框 -->
    <AddForgeDialog v-model:visible="state.addMissionVisible" fileType="文档图片" @initialData="addDetect" @success="updateProbability"
        :status="state.detailData.status" />
</template>
  
<script name="ForgeImage" setup>
import { formatStatusColor, downLoadFile } from "@/utils"; // 导入工具函数
import forgeData from "./jsonData/imgDataList.js"; // 导入示例数据（如果需要）
import AddForgeDialog from "./components/AddForgeDialog"; // 导入新增任务的对话框组件
import ForgeColBox from "./components/ForgeColBox"; // 导入任务展示组件
import { v4 as uuidv4 } from "uuid"; // 导入 UUID 生成函数
import { computed, onMounted, reactive } from "vue"; // 导入 Vue 的响应式 API
import axios from "axios"; // 导入 Axios 用于发起 HTTP 请求

// 定义状态对象
const state = reactive({
    tableData: [], // 存储任务数据
    total: 0, // 任务总数
    queryParams: {
        waterName: "", // 查询参数（可扩展）
        pageSize: 8, // 每页显示的任务数
        pageNum: 1, // 当前页码
    },
    addMissionVisible: false, // 控制新增任务对话框的显示
    showImagePreview: false, // 控制图片预览的显示
    detailData: {
        "id": "", // 任务 ID
        "fileName": "", // 文件名
        "fileUrl": "", // 文件 URL
        "fileType": "", // 文件类型
        "status": "", // 任务状态
        "probability": 0, // 概率
        "datetime": "" // 创建时间
    }
});

// 计算属性，获取所有文档图片的 URL 列表
const previewImgList = computed(() => {
    return state.tableData.filter(item => item.fileType === '文档图片').map(item => item.url);
});

// 获取任务列表
const getList = async() => { 
    try {
        // 从后端接口请求任务数据
        const response = await axios.get('http://49.123.117.252:2024/document_img'); 
        // 映射 UUID 到 ID
        state.tableData = response.data.map(item => ({
            ...item,
            id: item.uuid, // 假设后端返回的 UUID 存储在 item.uuid 中
        }));
        state.total = response.data.length; // 更新任务总数
    } catch (error) {
        console.error("Error fetching data:", error); // 错误处理
    }
}

// 页面加载时获取数据
onMounted(() => {
    getList(); // 调用获取列表的函数
});

// 添加新的检测任务
const addDetect = (data) => {
    state.tableData.unshift(data); // 将新任务插入到开头
    state.tableData[0].status = "检测中"; // 设置任务状态为“检测中”
}

// 更新任务的概率和状态
const updateProbability = (data) => {
    const index = state.tableData.findIndex(item => item.id === data.id); // 查找对应任务
    if (index !== -1) {
        state.tableData[index].probability = data.probability; // 更新概率
        state.tableData[index].status = "已完成"; // 更新状态为“已完成”
    }
}

// 显示图片预览
const preview = (row) => {
    state.showImagePreview = true; // 设置预览状态为 true
}

// 处理结果查看（未实现）
const lookResult = (row) => {
    // TODO: 实现查看结果的逻辑
}

// 下载文件
const download = (row) => {
    console.log(row); // 打印当前行数据
    downLoadFile(row.fileName, row.url); // 调用下载函数
}

// 删除任务（未实现）
const delMission = (row) => {
    // TODO: 实现删除任务的逻辑
}
</script>
  
<style lang="scss" scoped>
.forge-container {
    padding: 20px; // 设置内边距

    .tab-con {
        margin-top: 20px; // 设置上边距

        .pre-img {
            width: auto; // 自适应宽度
            max-width: 100%; // 最大宽度为 100%
            height: auto; // 自适应高度
            max-height: 150px; // 最大高度为 150px
            cursor: pointer; // 鼠标悬停时显示为手形
        }
    }
}
</style>
