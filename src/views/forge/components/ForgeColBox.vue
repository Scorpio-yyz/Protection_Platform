<template>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <div class="flex-warp-item">
            <div class="item-label">
                {{ detailData.fileName }}
            </div>
            <div class="item-title">
                <div class="item-title-l">
                    <span class="item-label">伪造概率：</span>
                    <template v-if="detailData.status === '已完成'">
                        <el-tag v-if="detailData.probability >= 80" type="danger">{{ detailData.probability
                        }}%</el-tag>
                        <el-tag v-else-if="detailData.probability < 80 && detailData.probability >= 50" type="warning">
                            {{ detailData.probability }}%
                        </el-tag>
                        <el-tag v-else-if="detailData.probability < 50" type="success">
                            {{ detailData.probability }}%
                        </el-tag>
                    </template>
                    <span v-else>---</span>
                </div>
                <el-tag :type="formatStatusColor(detailData.status)">{{ detailData.status }}</el-tag>
            </div>
            <template v-if="detailData.fileType !== '文本'" >
                <div  class="item-center" ref="loadRef" v-loading="detailData.status === '检测中'" element-loading-text="执行中..." :style="{ height: detailData.fileType === '音频' ? '75px' : '195px' }">
                    <img v-if="detailData.fileType === '图片' || detailData.fileType === '图文'|| detailData.fileType === 'AI图片' || detailData.fileType === '文档图片' || detailData.fileType === '待修复图片' || detailData.fileType === '待检测修复的图片'" class="item-img"
                    :src="detailData.fileUrl" alt="" />
                    <video v-else-if="detailData.fileType === '视频'" :src="detailData.fileUrl" controls class="item-img"></video>
                    <div v-else-if="detailData.fileType === '音频'" class="audio-box">
                        <audio :src="detailData.fileUrl" controls class="item-audio"></audio>
                    </div>
                 </div>
            </template>
            <template v-if="detailData.fileType === '文本'" >
                <div  class="item-center" ref="loadRef" v-loading="detailData.status === '检测中'" element-loading-text="执行中..." style="height:5px;"></div>
            </template>
            <div class="item-text" v-if="detailData.fileType === '图文'">
                <el-tooltip class="box-item" effect="light" placement="top-start">
                    <span>{{ detailData.describe }}</span>
                    <template #content>
                        <p style="line-height: 30px;font-size: 22px;width: 650px;">{{ detailData.describe }}</p>
                    </template>
                </el-tooltip>
            </div>
            <div class="item-text" v-if="detailData.fileType === '文本'">
                <el-tooltip class="box-item" effect="light" placement="top-start">
                    <span>{{ detailData.describe }}</span>
                    <template #content>
                        <p style="line-height: 30px;font-size: 22px;width: 650px;">{{ detailData.describe }}</p>
                    </template>
                </el-tooltip>
            </div>
            <div  class="item-center" style="height:15px;"></div>
            <div class="item-bottom">
                <div class="item-txt-title">
                    <span class="item-label">创建时间：</span>
                    <span class="item-value">{{ detailData.datetime }}</span>
                </div>
                <div class="item-btn-box">
                    <el-button type="primary" @click="previewPDF(detailData)" link>预览</el-button>
                    <el-button type="primary" @click="download(detailData)" link>下载</el-button>
                    <el-popconfirm title="确定删除吗？" @confirm="delOne(detailData)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button type="primary" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </div>
    </el-col>
</template>
<script name='ImageCard' setup>
import { formatStatusColor, downLoadFile } from "@/utils";
import axios from "axios";

const props = defineProps({
    detailData: Object
})

// 去掉文件名后缀的函数
const removeFileExtension = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return fileName;  // 如果没有找到点，返回原始文件名
    return fileName.substring(0, lastDotIndex);
}

// preview和download这两个太冗杂，修改如下
const getFilePath = (row) => {
    let baseFileName = row.fileName;  // 使用 let 声明 baseFileName 变量
    console.log(row);

    // 根据文件类型调整 baseFileName
    if (row.fileType !== "文本") {
        baseFileName = removeFileExtension(row.fileName);  // 移除文件扩展名
    } else {
        baseFileName = row.describe.substring(0, 7);  // 如果是文本，使用 row.describe
    }

    // 根据不同的 fileType 返回对应的路径
    const paths = {
        "文档图片": `/forge/fake_text_image/pdf/文档图片伪造检测报告_${row.id}.pdf`,
        "图文": `/forge/fake_news_detection/pdf/图文伪造检测报告_${row.id}.pdf`,
        "图片": `/forge/deepfake_image/pdf/深伪图像检测报告_${row.id}.pdf`,
        "AI图片": `http://49.123.114.186:5555/media/AIGC图像检测报告_${baseFileName}.pdf`,
        "视频": `/forge/deepfake_video/pdf/深伪视频检测报告_${row.id}.pdf`,
        "音频": `http://49.123.114.186:7777/media/深伪音频检测报告_${baseFileName}.pdf`,
        "文本": `http://49.123.114.186:8888/media/AIGC文本检测报告_${baseFileName}.pdf`,

        "待修复图片": `/forge/inpainting/pdf/抗取证的图像修复报告_${row.id}.pdf`,
        "待检测修复的图片": `/forge/inpainting_detection/pdf/图像修复的检测报告_${row.id}.pdf`,
    };

    return paths[row.fileType];  // 返回相应的路径
}


const previewPDF = (row) => {
    const filePath = getFilePath(row);
    window.open(filePath, '_blank');
}

const download = (row) => {
    const filePath = getFilePath(row);
    if (row.fileType !== '文本' ) {
        const downloadFileName = `${row.fileType}检测报告_${removeFileExtension(row.fileName)}.pdf`;
        fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);  // 创建 Blob URL
                link.href = url;
                link.download = downloadFileName;  // 设置下载文件名
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);  // 释放 URL
            })
            .catch(err => console.error('文件下载失败:', err));
    } else {
        const downloadFileName = `${row.fileType}检测报告_${row.describe.substring(0, 7)}.pdf`;

        // 使用 fetch 获取文件并创建 Blob
        fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);  // 创建 Blob URL
                link.href = url;
                link.download = downloadFileName;  // 设置下载文件名
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);  // 释放 URL
            })
            .catch(err => console.error('文件下载失败:', err));
    }
}




//重构删除函数
const deleteFile = async (fileType, id) => {
    const endpoints = {
        "图文": `http://49.123.117.252:3000/text/${id}`,
        "图片": `http://49.123.117.252:3001/image/${id}`,
        "AI图片": `http://49.123.114.186:5555/image/${id}`,
        "视频": `http://49.123.117.252:3002/video/${id}`,
        "音频": `http://49.123.117.252:3090/audio/${id}`,
        "文本": `http://49.123.117.252:3091/ai_text/${id}`,
        "文档图片": `http://49.123.117.252:2024/document_img/${id}`,

        "待检测修复的图片": `http://49.123.117.252:8001/inpainting_detection_img/${id}`,//对应get_db.js中的port，含义是用来映射到数据库的端口/表
        "待修复图片": `http://49.123.117.252:9092/inpainting_mask_img/${id}`
    };

    try {
        await axios.delete(endpoints[fileType]);
        // 刷新页面或数据
        window.location.reload();
    } catch (error) {
        console.error("删除数据时发生错误: ", error);
    }
}

const delOne = (row) => {
    deleteFile(row.fileType, row.id);
}

</script>


<style lang='scss' scoped>
.flex-warp-item {
    padding: 5px;
    width: 100%;
    border: 1px solid #f1f2f3;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    border-radius: 2px;
    margin-top: 10px;

    &:hover {
        border: 1px solid var(--el-color-primary);
        transition: all 0.3s ease;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
    }

    .item-label {
        padding: 10px;
    }

    .item-title {
        display: flex;
        justify-content: space-between;
        padding: 10px;

        .item-title-l {
            align-items: center;
            flex-grow: 1;
            overflow: hidden;

            .item-label {
                font-weight: bold;
                color: #409eff;
                font-size: 18px;
                white-space: nowrap;
            }

            .item-value {
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .item-center {
        width: 100%;
        height: 195px;
        overflow: hidden;
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 10px;
        justify-content: center;

        .item-img {
            height: 100%;
            max-height: 100%;
            width: auto;
            // margin-right: 10px;
        }

        .audio-box {
            width: 100%;
            height: 100%;
            // background-image: url(../../../assets/images/audiobg.webp);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .item-audio {
                width: 100%;
                height: 150px;
            }
        }
    }
    .item-text {
        padding: 10px;
        margin-top: 10px;
        height: 65px;
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }
    }

    .item-bottom {
        margin: 10px;
        display: flex;
        overflow: hidden;
        justify-content: space-between;

        .item-btn-box {
            font-size: 14px;
            display: flex;
            align-items: center;
        }
    }
}
</style>