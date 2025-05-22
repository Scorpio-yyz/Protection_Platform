<template>
    <!-- 上传窗口 -->
    <el-dialog :model-value="visible" title="新增审查" width="30%" :before-close="close">
        <div class="result-box">
            <el-radio-group v-model="state.dialogForm.taskType" @change="changeType">
                <el-radio-button :label="item" v-for="item in taskTypeList" :key="item" />
            </el-radio-group>
            <el-upload class="upload-demo" drag :on-change="checkFile" :on-success="upSuccess" :accept="state.accept"
                :before-remove="showUploadArea" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :auto-upload="false">
                <div class="upload-area">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖拽文件到此或<em>点击上传</em>
                    </div>
                </div>
            </el-upload>
            <el-timeline class="time-box">
                <el-timeline-item v-for="(activity, index) in state.activities" :key="index" :type="activity.type"
                    :timestamp="activity.timestamp">
                    {{ activity.content }}
                </el-timeline-item>
            </el-timeline>
        </div>
        <template #footer>
            <el-button type="primary" @click="upSuccess" :loading="state.btnLoad">
                开始检测
            </el-button>
        </template>
    </el-dialog>
</template>

<script name="AddCensorDialog" setup>
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/index"
import { v4 as uuidv4 } from "uuid"


const props = defineProps({
    visible: Boolean
})
const emits = defineEmits(["update:visible", "success"])

const close = () => {
    emits("update:visible", false)
}
const taskTypeList = [
    "视频",
    "图片",
    "音频",
]
const actives = [
    {
        timestamp: "",
        content: "文件上传",
        type: ""
    },
    {
        timestamp: "",
        content: "生成溯源标识",
        type: ""
    },
    {
        timestamp: "",
        content: "匹配区块哈希",
        type: ""
    }
]
const state = reactive({
    activities: JSON.parse(JSON.stringify(actives)),
    tempObj: {
        id: uuidv4(),
        fileName: "",
        fileUrl: "",
        datetime: "",
        logotype: "",
        fileType: "视频",
        block: "",
        status: "已完成",
        result: "无异常",
    },
    dialogForm: {
        taskType: "视频",
        fileUrl: ""
    },
    accept: "video/*",
    btnLoad: false
})

// 切换上传文件类型
const changeType = (type) => {
    switch (type) {
        case "视频":
            state.accept = "video/*"
            break
        case "图片":
            state.accept = "image/*"
            break
        case "音频":
            state.accept = "audio/*"
            break
    }
}

// 重置弹窗表单
const resetDialogForm = () => {
    state.activities = JSON.parse(JSON.stringify(actives))
    showUploadArea()
    state.dialogForm.taskType = "视频"
    state.tempObj = {
        id: uuidv4(),
        fileName: "",
        fileUrl: "",
        datetime: "",
        logotype: "",
        fileType: "视频",
        block: "",
        status: "已完成",
        result: "无异常",
    }
}
const checkFile = (file) => {
    state.tempObj.fileName = file.name
    state.tempObj.fileUrl = URL.createObjectURL(file.raw)
    showUploadArea(false)
}
// 文件上传成功
const upSuccess = (res) => {
    state.btnLoad = true
    state.activities[0].timestamp = formatDate(new Date(), 'date-time')
    state.activities[0].content = "文件上传..."
    state.activities[0].type = "primary"
    setTimeout(() => {
        state.activities[0].content = "文件上传成功"
        state.activities[0].type = "success"
        state.activities[1].timestamp = formatDate(new Date(), 'date-time')
        state.activities[1].content = "正在生成溯源标识..."
        state.activities[1].type = "primary"
        setTimeout(() => {
            state.activities[1].content = "溯源标识:5d41402abc4b2a76b9719d911017c592"
            state.activities[1].type = "success"
            state.activities[2].timestamp = formatDate(new Date(), 'date-time')
            state.activities[2].content = "正在匹配区块哈希..."
            state.activities[2].type = "primary"
            setTimeout(() => {
                let result = (state.tempObj.fileName.indexOf("fake") === -1 && state.tempObj.fileName.indexOf("习近平") === -1) ? "正常" : "异常警告"
                if (result === '无异常') {
                    state.activities[2].content = "区块哈希:2k3k5j2jk56he6e9a8f9b8b5a8c4a3b2c1d09e8f7e6d5c4b3a2d1e0f9e8d7c6b5a4d3c2b1a0f9e8d7c6"
                    state.activities[2].type = "success"
                    state.tempObj.logotype = "5d41402abc4b2a76b9719d911017c592"
                    state.tempObj.hash = "2k3k5j2jk56he6e9a8f9b8b5a8c4a3b2c1d09e8f7e6d5c4b3a2d1e0f9e8d7c6b5a4d3c2b1a0f9e8d7c6"
                    state.tempObj.datetime = formatDate(new Date(), 'date')
                    state.tempObj.fileType = "视频"
                    state.tempObj.status = "已完成"
                    state.tempObj.result = result
                } else {
                    state.activities[2].content = "未匹配到区块哈希"
                    state.activities[2].type = "danger"
                    state.tempObj.logotype = "5d41402abc4b2a76b9719d911017c592"
                    state.tempObj.hash = ""
                    state.tempObj.datetime = formatDate(new Date(), 'date')
                    state.tempObj.fileType = "视频"
                    state.tempObj.result = result
                }
                state.btnLoad = false
                emits("success", state.tempObj)
                close()
                // ElMessage.success("数据已上链！")
                resetDialogForm()
            }, 1000)
        }, 1000)
    }, 1000)
}

// 删除文件
const delFile = (row) => {

}
const showUploadArea = (show = true) => {
    const area = document.querySelector(".upload-area");
    area.parentElement.parentElement.style.display = show ? "block" : "none";
}
</script>

<style lang="scss" scoped>
.result-box {
    .upload-demo {
        margin-top: 20px;
    }

    .time-box {
        margin-top: 20px;
        padding-left: 10px !important;
    }
}
</style>