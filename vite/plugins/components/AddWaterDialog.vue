<template>
    <el-dialog :model-value="visible" title="嵌入水印" width="40%" lock-scroll class="addwater-dialog-con" :before-close="close"
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

            <!-- 水印内容输入 -->
            <el-form-item label="水印内容:" required prop="file">
                <el-input v-model="state.form.text" :autosize="{ minRows: 8, maxRows: 12 }" type="input"
                    placeholder="请输入水印内容" />
            </el-form-item>

            <!-- 图片的算法选择 -->
            <el-form-item v-if="state.form.fileType === '图片'" label="选择算法:" required prop="algorithm">
                <el-select v-model="state.form.algorithm" placeholder="请选择算法">
                    <el-option label="AutoWm" value="AutoWm"></el-option>
                    <el-option label="PIMOG" value="PIMOG"></el-option>
                </el-select>
            </el-form-item>

            <!-- 视频的算法选择 -->
            <el-form-item v-if="state.form.fileType === '视频'" label="选择算法:" required prop="algorithm">
                <el-select v-model="state.form.algorithm" placeholder="请选择算法">
                    <el-option label="算法1" value="algorithm1"></el-option>
                    <el-option label="算法2" value="algorithm2"></el-option>
                </el-select>
            </el-form-item>

            <!-- 音频的算法选择 -->
            <el-form-item v-if="state.form.fileType === '音频'" label="选择算法:" required prop="algorithm">
                <el-select v-model="state.form.algorithm" placeholder="请选择算法">
                    <el-option label="算法1" value="algorithm1"></el-option>
                    <el-option label="算法2" value="algorithm2"></el-option>
                </el-select>
            </el-form-item>

            <!-- 提交按钮 -->
            <el-row justify="end">
                <el-button type="primary" @click="start" :loading="state.embedLoad">开始嵌入</el-button>
            </el-row>
        </el-form>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="state.previewVisible" width="fit-content" style="max-width: 90%;">
        <img w-full :src="state.previewImageUrl" alt="Preview Image" />
    </el-dialog>
</template>



<script name="AddWaterDialog" setup>
import { reactive } from "vue"
import { formatDate } from "@/utils/index"
import axios from 'axios';
const emits = defineEmits(["update:visible", "success"])

const uploadFileRef = ref(null)
const close = () => {
    emits("update:visible", false)
}
const props = defineProps({
    visible: Boolean
})

const fileTypeList = [
    "图片",
    "视频",
    "音频"
]
const state = reactive({
    form: {
        fileType: "图片",
        file: "",
        text: ""
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
    },
})

const changeType = (type) => {
    if (type === "图片") {
        state.accept = "image/*"
    } else if (type === "视频") {
        state.accept = "video/*"
    } else if (type === "音频") {
        state.accept = "audio/*"
    }
    handleRemove()
}
const showUplodCard = (show = true) => {
    const icon = document.querySelector("#uploadBox2");
    icon.parentElement.parentElement.style.display = show ? "block" : "none";
}
// 选择文件后
const fileChange = (file) => {
    showUplodCard(false)
    state.tempFile.fileName = file.name
    state.tempFile.fileUrl = file.url
    state.tempFile.size = file.size
    state.tempFile.fileType = state.form.fileType
    state.form.file = file.name
    state.tempFile.file = file.raw;
}
// 删除文件后
const handleRemove = (file) => {
    console.log("删除文件");
    uploadFileRef.value.clearFiles()
    state.fileList = []
    state.tempFile = {
        fileName: "",
        fileType: "",
        fileUrl: "",
        file2Url: "",
        waterName: "",
        size: 0,
        datetime: ""
    }
    showUplodCard()
}
const getObjectURL = (file) => {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
// 预览上传图片
const handlePictureCardPreview = (file) => {
    state.previewImageUrl = file.url
    state.previewVisible = true;
}
//base64toBlob
function base64ToBlob(base64, mimeType = '') {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}


const start = async () => {
    // 准备 FormData
    const formData = new FormData();
    formData.set('file', state.tempFile.file);   // 设置文件
    formData.set('text', state.form.text);  // 设置水印内容
    formData.set('fileType', state.form.fileType);  // 设置文件类型
    formData.set('algorithm', state.form.algorithm);  // 设置算法类型，假设你有一个算法选择

    // 打印 FormData 内容以进行调试
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    state.embedLoad = true;

    try {
        console.log('Sending request to server...');
        const response = await axios.post('http://49.123.114.186:3333/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Received response:', response.data);
        const responseData = response.data;

        // 下载并转换为本地URL
        if (responseData.imageUrl) {
            const downloadAndConvertToLocalUrl = async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                const localUrl = URL.createObjectURL(blob); // 转换为本地URL
                return localUrl;
            };

            // 调用函数，将服务器URL转换为本地URL
            state.tempFile.file2Url = await downloadAndConvertToLocalUrl(responseData.imageUrl);
        }

        // 更新其他数据，比如 PSNR、SSIM 等
        console.log('嵌入完成');
        console.log(`PSNR: ${responseData.psnr}, SSIM: ${responseData.ssim}, LPIPS: ${responseData.lpips}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        console.log('Upload process finished.');
        state.embedLoad = false;
        close();
    }

    // 更新临时文件的数据，用于成功后的事件触发
    state.tempFile.waterName = state.form.text;
    state.tempFile.datetime = formatDate(new Date(), 'date-time');

    setTimeout(() => {
        emits("success", JSON.parse(JSON.stringify(state.tempFile)));
        close();
    }, 1000);
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