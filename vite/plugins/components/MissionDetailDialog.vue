<template>
    <el-dialog :model-value="visible" title="任务详情" width="60%" lock-scroll class="water-mission-dialog"
        :before-close="close">
        <div class="detail-box">
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">任务id：</span>
                    <span class="item-txt">{{ detailData.id }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">任务类型：</span>
                    <span class="item-txt">{{ detailData.missionType }}</span>
                </el-col>
            </el-row>
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">url地址：</span>
                    <span class="item-txt" style="line-height: 20px;">
                        <!-- <a href="http://" target="_blank" rel="noopener noreferrer"></a> -->
                        <el-link type="primary" target="_blank" :href="detailData.url">
                            {{ detailData.url }}
                        </el-link>
                    </span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">是否存在水印：</span>
                    <span class="item-txt">{{ hasWaterFun(detailData.fileList) ? "是" : "否" }}</span>
                </el-col>
            </el-row>
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">图片：</span>
                    <span class="item-txt">{{ getFileNum(detailData.fileList, "图片") }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">含水印：</span>
                    <span class="item-txt">{{ getFileNum(detailData.fileList, "图片", true) }}</span>
                </el-col>
            </el-row>
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">视频：</span>
                    <span class="item-txt">{{ getFileNum(detailData.fileList, "视频") }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">含水印：</span>
                    <span class="item-txt">{{ getFileNum(detailData.fileList, "视频", true) }}</span>
                </el-col>
            </el-row>
            <el-row class="row-item">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">检测时间：</span>
                    <span class="item-txt">{{ detailData.datetime }}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <span class="item-label">任务状态：</span>
                    <span class="item-txt">{{ detailData.status }}</span>
                </el-col>
            </el-row>
        </div>
        <el-table class="tab-con" :data="detailData.fileList" stripe border style="width: 100%">
            <!-- <el-table-column prop="fileName" label="文件名称" align="center" /> -->
            <el-table-column prop="fileName" label="文件" align="center">
                <template #default="{ row }">
                    <img v-if="row.fileType === '图片'" class="pre-img" :src="row.fileUrl" @click="preview(row)" />
                    <video v-else-if="row.fileType === '视频'" class="pre-img" controls :src="row.fileUrl"></video>
                </template>
            </el-table-column>
            <el-table-column prop="fileType" label="文件类型" width="120" align="center" />
            <el-table-column prop="waterName" label="水印信息" width="180" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="{ row }">
                    <!-- <el-button type="primary" link @click="preview(row)">预览文件</el-button> -->
                    <el-button type="primary" link @click="download(row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <el-image-viewer v-if="state.showImagePreview" @close="state.showImagePreview = false" :url-list="previewImgList"
        hide-on-click-modal></el-image-viewer>
</template>

<script name="MissionDetailDialog" setup>
import { reactive } from "vue"
import { getFileNum, hasWaterFun } from "../utils"
import { downLoadFile } from "@/utils/index"

const props = defineProps({
    visible: Boolean,
    detailData: Object
})

const state = reactive({
    previewIndex: 0,
    showImagePreview: false
})


const emits = defineEmits(["update:visible"])

const close = () => {
    emits("update:visible", false)
}
const preview = (row) => {
    const index = previewImgList.value.indexOf(row.fileUrl)
    state.previewIndex = index === -1 ? 0 : index
    state.showImagePreview = true
}
const previewImgList = computed(() => {
    return props.detailData.fileList.filter(item => item.fileType === "图片").map(item => item.fileUrl) || []
})

// 下载文件
const download = (row) => {
    downLoadFile(row.fileName, row.fileUrl)
}
</script>

<style lang="scss" scoped>
$borderColor: #000;

.water-mission-dialog {
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

    .tab-con {
        margin-top: 20px;

        .pre-img {
            width: auto;
            height: auto;
            max-width: 220px;
            max-height: 150px;
        }
    }
}
</style>