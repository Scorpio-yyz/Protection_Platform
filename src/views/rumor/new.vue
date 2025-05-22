<template>
    <div class="new-rumor-container">
        <el-form :inline="true" label-width="150px" class="form-box" :model="state.form" ref="ruleFormRef" status-icon>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="类型：" label-width="80px">
                        <el-radio-group v-model="state.form.taskType" @change="changeType">
                            <el-radio-button :label="item" v-for="item in taskTypeList" :key="item" />
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item v-if="state.form.taskType === 'url'" label="请输入url地址：" required prop="url">
                        <el-input v-model="state.form.url" />
                    </el-form-item>
                    <el-form-item label="请上传文件:" required prop="file" v-if="state.form.taskType === '上传文件'">
                        <el-upload accept=".csv,.txt,.docx" class="upload-container" ref="uploadFileRef"
                            :auto-upload="false" :before-remove="showUploadBtn" :on-change="fileChange" :limit="1"
                            :file-list="state.fileList">
                            <el-button size="small" type="primary" ref="uploadBtnRef">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="新闻内容:" required prop="file" v-if="state.form.taskType === '手动输入'">
                        <el-input v-model="state.form.text" :autosize="{ minRows: 8, maxRows: 12 }" type="textarea"
                            placeholder="请输入新闻内容" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="success" @click="start">开始检测</el-button>
                <el-button type="primary">导出结果</el-button>
                <el-button type="info" @click="reset">重置</el-button>
            </el-row>
        </el-form>
        <el-steps class="step-box" :space="200" :active="activeIndex" simple finish-status="success">
            <el-step v-for="(item, index) in state.activities" :key="index" :title="item.content" :icon="item.icon" />
        </el-steps>
        <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="title" label="内容" align="center" />
            <el-table-column prop="type" label="分类" width="180" align="center" />
            <el-table-column prop="date" label="时间" width="180" align="center" />
            <el-table-column prop="probability" label="为真的概率" width="180" align="center">
                <template #default="{ row }">
                    <el-tag v-if="row.probability >= 80" type="success" size="small">{{ row.probability }}%</el-tag>
                    <el-tag v-else-if="row.probability < 80 && row.probability >= 50" type="warning" size="small">
                        {{ row.probability }}%
                    </el-tag>
                    <el-tag v-else-if="row.probability < 50" type="danger" size="small">
                        {{ row.probability }}%
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script name="NewRumor" setup>
import { nextTick, reactive, ref, watch } from "vue";
import { Refresh, SuccessFilled } from "@element-plus/icons-vue"
import { mockLoadData } from "@/utils/index"

import jsonData from "./jsonData/list.json"

const taskTypeList = [
    "url",
    "上传文件",
    "手动输入",
]
const state = reactive({
    form: {
        taskType: "url",
        url: "",
        text: ""
    },
    fileList: [],
    activities: [
        {
            content: '获取数据',
        },
        {
            content: '分析数据',
        },
        {
            content: '生成结果',
        },
    ],
    tableData: []
})

const uploadBtnRef = ref(null)
const activeIndex = ref(-1)
const changeType = () => {

}
// 监听步骤变化
watch(activeIndex, () => {
    if (activeIndex.value !== -1 && activeIndex.value < state.activities.length) {
        startFresh()
    }
})
const fileChange = () => {
    showUploadBtn(false)
}
// 重置数据
const reset = () => {
    activeIndex.value = -1
    if (uploadBtnRef.value) {
        uploadBtnRef.value.clearFiles()
        uploadBtnRef.value.handleRemove()
    }
    state.tableData = []
    state.form.url = ""
    state.form.text = ""
}

const start = () => {
    step1()
}

const startFresh = () => {
    nextTick(() => {
        state.activities[activeIndex.value].icon = Refresh
        const processBox = document.querySelector(".is-process")
        if (processBox) {
            processBox.style["animation-play-state"] = "running"
        }
    })
}

const step1 = () => {
    activeIndex.value++
    let num = 0
    mockLoadData(stop => {
        const len = Math.floor(Math.random() * 4) + 1;
        state.tableData.push(...jsonData.slice(num, num + len).map(item => ({ title: item.title, id: item.id })))
        num += len
        if (num >= jsonData.length) {
            stop()
        }
    }).then(res => {
        state.activities[activeIndex.value++].icon = SuccessFilled
        step2()
    })
}

const step2 = () => {
    let num = 0
    mockLoadData(stop => {
        const len = Math.floor(Math.random() * 4) + 1;
        const data = jsonData.slice(num, num + len)
        for (let i = 0; i < data.length; i++) {
            const index = state.tableData.findIndex(item => item.id === data[i].id)
            state.tableData[index].date = data[i].date
            state.tableData[index].type = data[i].type
        }
        num += len
        if (num >= jsonData.length) {
            stop()
        }
    }).then(res => {
        state.activities[activeIndex.value++].icon = SuccessFilled
        step3()
    })
}

const step3 = () => {
    let num = 0
    mockLoadData(stop => {
        const len = Math.floor(Math.random() * 4) + 1;
        const data = jsonData.slice(num, num + len)
        for (let i = 0; i < data.length; i++) {
            const index = state.tableData.findIndex(item => item.id === data[i].id)
            state.tableData[index].probability = Math.floor(Number(data[i].probability) * 100)
        }
        num += len
        if (num >= jsonData.length) {
            stop()
        }
    }).then(res => {
        state.activities[activeIndex.value++].icon = SuccessFilled
    })
}

const showUploadBtn = (show = true) => {
    uploadBtnRef.value.ref.parentNode.style.display = show ? "inline-block" : "none";
}


</script>
  
<style lang="scss" scoped>
.new-rumor-container {
    padding: 0 20px;

    .form-box {
        margin-top: 20px;
    }

    .step-box {
        margin-top: 20px;
    }

    .tab-con {
        margin-top: 20px;
    }
}

:deep(.el-form-item) {
    vertical-align: top;
    display: flex;
}

:deep(.upload-container) {
    width: 100%;
}

:deep(.el-upload) {
    width: auto;
}

:deep(.is-simple) {
    .el-step__head {
        padding-right: 0 !important;

        .is-icon {
            display: flex;

            .el-step__icon-inner {
                font-size: 24px;
                width: fit-content;
            }
        }
    }

    .is-process {
        color: var(--el-color-primary);
        animation: loadfresh .8s linear infinite;
        animation-play-state: paused;
    }

    .el-step__main {
        margin-left: 10px;
    }
}


@keyframes loadfresh {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>