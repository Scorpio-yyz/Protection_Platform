<template>
    <el-dialog :model-value="visible" title="任务详情" width="60%" lock-scroll class="rumor-mission-dialog"
        :before-close="close">
        <div class="detail-box">
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">任务id：</span>
                    <span class="item-txt">{{ detailData.id }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">任务状态：</span>
                    <span class="item-txt">
                        <el-tag type="success">{{ detailData.status }}</el-tag>
                    </span>
                </el-col>
            </el-row>
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">任务类型：</span>
                    <span class="item-txt">{{ detailData.missionType }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">url地址：</span>
                    <span class="item-txt" style="line-height: 20px;">
                        <!-- <a href="http://" target="_blank" rel="noopener noreferrer"></a> -->
                        <el-link type="primary" target="_blank" :href="detailData.url">
                            {{ detailData.url }}
                        </el-link>
                    </span>
                </el-col>
            </el-row>
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">新闻数量：</span>
                    <span class="item-txt">{{ detailData.newsList.length }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">创建时间：</span>
                    <span class="item-txt">{{ detailData.datetime }}</span>
                </el-col>
            </el-row>
        </div>
        <el-steps class="step-box" :space="200" simple finish-status="success">
            <el-step v-for="(item, index) in state.activities" :key="index" :status="item.status" :title="item.content"
                :icon="item.icon" />
        </el-steps>
        <el-table class="tab-con" :data="detailData.newsList" stripe border height="280" style="width: 100%">
            <el-table-column prop="title" label="新闻内容" align="center">
                <template #default="{ row }">
                    <el-link type="primary" target="_blank" :href="row.url">
                        {{ row.title }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="分类" width="150" align="center" />
            <el-table-column prop="date" label="时间" width="150" align="center" />
            <el-table-column prop="probability" label="为真的概率" width="100" align="center">
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
    </el-dialog>
    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="state.previewImgList"
        hide-on-click-modal></el-image-viewer>
</template>

<script name="RumorDetailDialog" setup>
import { reactive, watch } from "vue"
import { Refresh, SuccessFilled } from "@element-plus/icons-vue"
import jsonData from "../jsonData/list.json"

const props = defineProps({
    visible: Boolean,
    detailData: Object,
})

const state = reactive({
    tableData: jsonData.map(item => {
        const obj = JSON.parse(JSON.stringify(item))
        delete obj.probability
        return obj
    }),
    showImagePreview: false,
    previewImgList: ["http://img.longjian.vip/2023-01-15/c4078ffb534b7e4ded78f2401.png"],
    activities: [
        {
            content: '获取数据',
            status: "success"
        },
        {
            content: '分析数据',
            status: "process",
            // icon: Refresh
        },
        {
            content: '生成结果',
            status: "wait"
        },
    ],
})

watch(() => {
    if (props.detailData.status === "已完成") {
        state.activities.forEach(el => {
            el.status = "success"
        })
    } else {
        if (props.detailData.activeIndex === 1) {
            state.activities[0].status = "process"
            state.activities[0].icon = Refresh
            state.activities[1].status = "wait"
            state.activities[2].status = "wait"
        } else if (props.detailData.activeIndex === 2) {
            state.activities[0].status = "success"
            state.activities[1].status = "process"
            state.activities[1].icon = Refresh
            state.activities[2].status = "wait"
        } else if (props.detailData.activeIndex === 3) {
            state.activities[0].status = "success"
            state.activities[1].status = "success"
            state.activities[2].status = "process"
            state.activities[2].icon = Refresh
        }
    }
}, { deep: true })

const emits = defineEmits(["update:visible"])

const close = () => {
    emits("update:visible", false)
}
const preview = (row) => {
    state.showImagePreview = true
}
</script>

<style lang="scss" scoped>
$borderColor: #000;

.rumor-mission-dialog {
    .detail-box {
        .row-item {
            border: 1px solid $borderColor;
            border-bottom: none;

            &:last-child {
                border-bottom: 1px solid $borderColor !important;
            }

            &>div:first-child {
                border-right: 1px solid $borderColor;
            }

            &>div {
                display: flex;
            }

            &:nth-child(odd) {
                background-color: #F3F7FA;
            }

            .item-label {
                font-weight: bold;
                font-size: 18px;
                width: 160px;
                height: 38px;
                line-height: 38px;
                text-indent: 12px;
                flex-shrink: 0;
            }

            .item-txt {
                // height: 38px;
                line-height: 38px;
                font-size: 16px;
                border-left: 1px solid $borderColor;
                padding-left: 12px;

            }
        }
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

        .is-icon {
            animation: loadfresh .8s linear infinite;
        }
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