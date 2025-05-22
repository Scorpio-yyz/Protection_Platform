<template>
    <el-dialog :model-value="visible" title="提取水印" width="40%" lock-scroll class="addwater-dialog-con" :before-close="close"
        :close-on-click-modal="false">
        <el-form label-width="120px" class="form-box" :model="state.form" ref="ruleFormRef" status-icon>
            <!-- 文件类型选择 -->
            <el-form-item label="文件类型：">
                <el-radio-group v-model="state.form.fileType" @change="changeType">
                    <el-radio-button :label="item" v-for="item in fileTypeList" :key="item" />
                </el-radio-group>
            </el-form-item>

            <!-- 文件上传 -->
            <el-form-item label="请上传文件:" required prop="file">
                <el-upload :auto-upload="false" :on-change="fileChange" :accept="state.accept" class="upload-container"
                    list-type="picture-card" drag ref="uploadFileRef" :on-preview="handlePictureCardPreview"
                    :file-list="state.fileList">
                    <el-icon id="uploadBox2">
                        <Plus />
                    </el-icon>
                    <template #file="{ file, files }">
                        <img class="el-upload-list__item-thumbnail" :src="state.tempFile.fileUrl"
                            v-if="state.form.fileType === '图片'" :alt="state.tempFile.fileName" />
                        <img class="el-upload-list__item-thumbnail" src="../../../assets/images/up-video.svg"
                            v-else-if="state.form.fileType === '视频'" :alt="state.tempFile.fileName" />
                        <img class="el-upload-list__item-thumbnail" src="../../../assets/images/up-audio.svg"
                            v-else-if="state.form.fileType === '音频'" :alt="state.tempFile.fileName" />
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-delete" @click="handleRemove(file, files)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </span>
                        </span>
                    </template>
                </el-upload>
            </el-form-item>

            <!-- 文件类型对应的算法选择 -->
            <el-form-item v-if="state.form.fileType" label="选择算法:" required prop="algorithm">
                <el-select v-model="state.form.algorithm" placeholder="请选择算法">
                    <el-option v-for="algorithm in getAlgorithmOptions()" :label="algorithm.label" :value="algorithm.value" :key="algorithm.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 提交按钮 -->
            <el-row justify="end">
                <el-button type="primary" @click="start" :loading="state.embedLoad">开始提取</el-button>
            </el-row>
        </el-form>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="state.previewVisible" width="fit-content" style="max-width: 90%;">
        <img w-full :src="state.previewImageUrl" alt="Preview Image" />
    </el-dialog>
    
</template>

<script setup>
import { reactive, ref } from "vue";
import { formatDate } from "@/utils/index";
import axios from 'axios';
import { Plus, Delete } from "@element-plus/icons-vue";

const emits = defineEmits(["update:visible", "success"]);
const uploadFileRef = ref(null);

const close = () => {
    emits("update:visible", false);
};

const props = defineProps({
    visible: Boolean
});

const fileTypeList = [
    "图片",
    "视频",
    "音频"
];

const state = reactive({
    form: {
        fileType: "图片",
        file: "",
        text: "",
        algorithm: ""
    },
    accept: "image/*",
    fileList: [],
    embedLoad: false,
    previewVisible: false,
    previewImageUrl: "",
    tempFile: {
        fileName: "",
        fileType: "",
        fileUrl: "",
        file2Url: "",
        waterName: "",
        size: 0,
        datetime: ""
    }
});

const changeType = (type) => {
    switch (type) {
        case "图片":
            state.accept = "image/*";
            break;
        case "视频":
            state.accept = "video/*";
            break;
        case "音频":
            state.accept = "audio/*";
            break;
    }
    handleRemove();
};

const showUploadCard = (show = true) => {
    const icon = document.querySelector("#uploadBox2");
    icon.parentElement.parentElement.style.display = show ? "block" : "none";
};

const fileChange = (file) => {
    showUploadCard(false);
    state.tempFile.fileName = file.name;
    state.tempFile.fileUrl = file.url;
    state.tempFile.size = file.size;
    state.tempFile.fileType = state.form.fileType;
    state.form.file = file.name;
    state.tempFile.file = file.raw;
};

const handleRemove = () => {
    console.log("删除文件");
    uploadFileRef.value.clearFiles();
    state.fileList = [];
    state.tempFile = {
        fileName: "",
        fileType: "",
        fileUrl: "",
        file2Url: "",
        waterName: "",
        size: 0,
        datetime: ""
    };
    showUploadCard();
};

const handlePictureCardPreview = (file) => {
    state.previewImageUrl = file.url;
    state.previewVisible = true;
};

const start = async () => {

    const formData = new FormData();
    formData.set('file', state.tempFile.file);
    formData.set('fileType', state.form.fileType);
    formData.set('algorithm', state.form.algorithm);

    state.embedLoad = true;

    try {
        console.log('Sending request to server...');
        const response = await axios.post('http://49.123.114.186:4444/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Received response:', response.data);
        const responseData = response.data;

        if (responseData.watermarkName) {
            state.tempFile.waterName = responseData.watermarkName;
        }
        console.log(state.tempFile)
        console.log('提取完成');
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        console.log('Upload process finished.');
        state.embedLoad = false;
        close();
    }

    state.tempFile.datetime = formatDate(new Date(), 'date-time');

    setTimeout(() => {
        emits("success", JSON.parse(JSON.stringify(state.tempFile)));
        close();
    }, 1000);
};

const getAlgorithmOptions = () => {
    const options = {
        "图片": [
            { label: "AutoWm", value: "AutoWm" },
            { label: "PIMOG", value: "PIMOG" }
        ],
        "视频": [
            { label: "算法1", value: "algorithm1" },
            { label: "算法2", value: "algorithm2" }
        ],
        "音频": [
            { label: "算法1", value: "algorithm1" },
            { label: "算法2", value: "algorithm2" }
        ]
    };

    return options[state.form.fileType] || [];
};
</script>

<style lang="scss" scoped>
$borderColor: #000;

.addwater-dialog-con {
    .form-box {
        :deep(.el-upload-list--picture-card) {
            width: 138px;
            height: 146px;
        }

        :deep(.el-upload-dragger) {
            padding: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
        }
    }
}
</style>
