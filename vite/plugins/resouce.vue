<template>
    <div class="watermark-container">
        <el-row justify="end">
            <el-button type="primary" @click="addWater">提取水印</el-button>
        </el-row>
        <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="fileName" label="文件名称" align="center" />
            <el-table-column prop="fileUrl" label="媒体文件" width="220" align="center">
                <template #default="{ row }">
                    <img v-if="row.fileType === '图片'" class="pre-img" :src="row.fileUrl" :alt="row.fileName"
                        @click="preview(row, 'file')">
                    <video v-if="row.fileType === '视频'" class="pre-video" :src="row.fileUrl"
                        controls="controls"></video>
                    <audio v-if="row.fileType === '音频'" controls>
                        <source :src="row.fileUrl" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </template>
            </el-table-column>

            <el-table-column prop="waterName" label="水印信息" align="center" />
            <el-table-column prop="fileType" label="文件类型" width="180" align="center" />
            <el-table-column prop="size" label="文件大小" width="180" align="center">
                <template #default="{ row }">
                    {{ convertFileSize(Number(row.size)) }}
                </template>
            </el-table-column>
            <el-table-column prop="datetime" label="嵌入时间" width="180" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="{ row }">
                    <el-button type="primary" link @click="download(row)">下载</el-button>
                    <el-popconfirm title="确定删除此文件吗？" @confirm="delFile(row)">
                        <template #reference>
                            <el-button type="primary" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- <pagination v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNum"
            v-model:limit="state.queryParams.pageSize" @pagination="getList" /> -->
    </div>
    <AddMissionDialog v-model:visible="state.addVisible" @success="embedSuccess" />
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false"
        :url-list="state.isWatermarkPreview ? previewWatermarkImgList : previewImgList"
        :initial-index="state.previewIndex" hide-on-click-modal></el-image-viewer>

</template>
<script>
const download = async (row) => {
    const fileUrl = row.file2Url; // 获取该行的文件 URL
    const fileName = row.fileName; // 获取该行的文件名

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // 释放内存
    } catch (error) {
        console.error('Download error:', error);
    }
}

</script>

<style lang="scss" scoped></style>

<script name="Watermark" setup>
import AddMissionDialog from "./components/AddMissionDialog.vue";
import resouceJson from "./jsonData/missionList.js"
import { convertFileSize } from "@/utils/index";
import { computed } from "vue";

const state = reactive({
    tableData: resouceJson.sort((a, b) => {
        const date1 = new Date(a.datetime);
        const date2 = new Date(b.datetime);
        return date2 - date1;
    }),
    total: resouceJson.length,
    queryParams: {
        waterName: 0,
    },
    addVisible: false,
    showImagePreview: false,
    previewIndex: 0,
    isWatermarkPreview: false, // 新添加的标志变量
});

const previewImgList = computed(() => {
    return state.tableData
        .filter(item => item.fileType === '图片')
        .map(item => item.fileUrl) || [];
});

const previewWatermarkImgList = computed(() => {
    return state.tableData
        .filter(item => item.fileType === '图片')
        .map(item => item.file2Url) || [];
});


const addWater = () => {
    state.addVisible = true
}

const embedSuccess = (obj) => {
    state.tableData.unshift(obj)
}
// 预览图片
const preview = (row, type) => {
    let urlList = [];
    let index = 0;

    if (type === 'file') {
        urlList = state.tableData
            .filter(item => item.fileType === '图片')
            .map(item => item.fileUrl);
        index = urlList.indexOf(row.fileUrl);
        state.isWatermarkPreview = false;
    } else if (type === 'watermark') {
        urlList = state.tableData
            .filter(item => item.fileType === '图片')
            .map(item => item.file2Url);
        index = urlList.indexOf(row.file2Url);
        state.isWatermarkPreview = true;
    }

    state.previewImgList = urlList;
    state.previewIndex = index === -1 ? 0 : index;
    state.showImagePreview = true;
};


// 删除文件
const delFile = (row) => {
    const index = state.tableData.findIndex(item => item.fileName === row.fileName);

    if (index !== -1) {
        // 从表格数据中移除该项
        state.tableData.splice(index, 1);
        state.total = state.tableData.length; // 更新总条目数
    }
}
</script>

<style lang="scss" scoped>
.watermark-container {
    padding: 20px;

    .tab-con {
        margin-top: 20px;

        :deep(.el-table__body-wrapper) {
            min-height: 450px;
        }

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