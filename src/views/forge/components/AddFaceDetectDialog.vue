<template>
    <el-dialog :model-value="visible" title="新增检测" width="40%" lock-scroll class="addwaterarmy-dialog-con"
        :before-close="close" :close-on-click-modal="false">
        <el-form label-width="120px" class="form-box" :model="state.form" ref="ruleFormRef" status-icon>
            <!-- <el-form-item label="任务类型：">
                <el-radio-group v-model="state.form.fileType" @change="changeType">
                    <el-radio-button :label="item" v-for="item in fileTypeList" :key="item" />
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="请上传文件:" required prop="file">
                <el-upload :auto-upload="false" :on-change="fileChange" :accept="state.accept" class="upload-container"
                    list-type="picture-card" drag ref="uploadFileRef" :on-preview="handlePictureCardPreview"
                    :file-list="state.fileList">
                    <el-icon id="uploadBox2">
                        <Plus />
                    </el-icon>
                    <template #file="{ file, files }">
                        <img class="el-upload-list__item-thumbnail" :src="state.tempFile.fileUrl"
                            v-if="fileType === '图片' || fileType === '图文' || fileType === 'AI图文'" :alt="state.tempFile.fileName" />
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
            <el-form-item label="请选择算法：">
                <el-checkbox-group v-model="state.form.detectItems">
                    <el-checkbox v-for="(item, index) in filteredDetectList" :key="index" :label="item.title" border
                        :disabled="item.disabled" />
                </el-checkbox-group>
            </el-form-item>
            <el-row justify="end">
                <el-button type="primary" @click="start">开始检测</el-button>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script name="AddFaceDetectDialog" setup>
import { formatDate } from "@/utils/index"
import { reactive } from "vue"
const emits = defineEmits(["update:visible", "initialData", "success"])
import { v4 as uuidv4 } from "uuid"
import axios from "axios"

const uploadFileRef = ref(null)
const formData = new FormData()

//每次检测后清空formData，确保数据不会重复出现
const clearFormData = () => {
    formData.delete('file')
    formData.delete('id')
    formData.delete('filename')
    formData.delete('describe')
    formData.delete('fileType')
    formData.delete('datetime')
    formData.delete('detectItems')
}

const props = defineProps({
    visible: Boolean,
    fileType: String,
})

const close = () => {
    emits("update:visible", false)

}

const state = reactive({
    form: {
        fileType: "图片",
        file: "",
        describe: "",
        detectItems: [],
    },
    accept: "image/*",
    fileList: [],
    tempFile: {
        id: "",
        fileName: "",
        fileUrl: "",
        fileType: "",
        probability: 0,
        datetime: "",
        status: "检测中",
        describe: ""
    },
    detectList: [
        //人脸图像检测算法
        { title: "RetinaFace", disabled: false, supportedFileTypes: '图片' },

    ],
})

const filteredDetectList = computed(() => {
    return state.detectList.filter(item => item.supportedFileTypes === state.form.fileType);
});

const changeType = (value) => {
    state.form.fileType = value
    if (value === "图片") {
        state.accept = "image/*"
    } 
    
    //过滤出支持当前“fileType”的算法，并自动选择所有算法
    const compatibleDetectItems = state.detectList
        .filter(item => item.supportedFileTypes === state.form.fileType)
        .map(item => item.title);

    //更新“detecItems”来自动选择所有对应的算法
    state.form.detectItems = compatibleDetectItems;
}
changeType(props.fileType)

// 预览上传图片
const handlePictureCardPreview = (file) => {
    state.previewImageUrl = file.url
    state.previewVisible = true;
}

// 删除文件后
const handleRemove = (file) => {
    console.log("删除文件");
    uploadFileRef.value.clearFiles();
    showUplodCard()
}

// 选择文件后
const fileChange = (file) => {
    formData.append('file', file.raw)
    const { name, url } = file
    state.tempFile.fileName = name
    state.tempFile.fileUrl = url
    state.form.file = name
    showUplodCard(false)
}
const showUplodCard = (show = true) => {
    const icon = document.querySelector("#uploadBox2");
    icon.parentElement.parentElement.style.display = show ? "block" : "none";
}


const start = () => {
    state.tempFile.id = uuidv4()
    state.tempFile.datetime = formatDate()
    state.tempFile.fileType = props.fileType
    state.tempFile.describe = state.form.describe
    state.form.detectItems = state.form.detectItems

    console.log(state)
    console.log('submit!')
    console.log("Sending these detect items:", state.form.detectItems);

    close()


    if(props.fileType === "图片"){
        console.log("图片")
        formData.append('id', state.tempFile.id)
        formData.append('filename', state.tempFile.fileName)
        formData.append('fileType', state.tempFile.fileType)
        formData.append('datetime', state.tempFile.datetime)
        formData.append('detectItems', state.form.detectItems)

        emits("initialData", JSON.parse(JSON.stringify(state.tempFile)))

        // 发送图片数据到后端进行图片伪造检测，并回传检测结果
        axios.post('http://49.123.117.252:5010/FaceDetect', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res=>{
                let responseData = res.data
                state.tempFile.probability = responseData.result
                console.log(responseData.result)
                console.log('pre: ', state.tempFile.probability)

                //返回到image.vue文件的state.tempFile数据
                emits("success", {id: state.tempFile.id, probability: state.tempFile.probability})
            })
            .catch(error => {
            console.log(error)
        })
        //清除上一次检测遗留的表单数据
        clearFormData()
        reset()

    }

}


// 重置表单
const reset = () => {
    state.form = {
        fileType: state.form.fileType,
        file: "",
        describe: "",
        detectItems: [],
    }
    changeType(state.form.fileType)
    //state.fileList = []
    //state.accept = "image/*"
}
</script>

<style lang="scss" scoped>
.addwaterarmy-dialog-con {
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