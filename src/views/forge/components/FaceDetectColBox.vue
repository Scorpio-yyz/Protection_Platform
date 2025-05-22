<template>
    <!-- 使用el-col组件，根据不同屏幕尺寸设置不同的栅格数 -->
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <!-- flex-warp-item是自定义的样式类，用于设置容器的样式 -->
        <div class="flex-warp-item">
            <!-- item-label是自定义的样式类，用于设置标签的样式 -->
            <div class="item-label">
                {{ detailData.fileName }}
            </div>
            <!-- item-title是自定义的样式类，用于设置标题的样式 -->
            <div class="item-title">
                <!-- item-title-l是自定义的样式类，用于设置标题左侧的样式 -->
                <div class="item-title-l">
                    <!-- item-label是自定义的样式类，用于设置标签的样式 -->
                    <span class="item-label">人脸检测：</span>
                    <!-- 根据f的值判断是否显示标签 -->
                    <template v-if="f === '已完成'">
                    </template>
                   
                </div>
                <!-- 根据detailData.status的值判断标签的类型 -->
              
            </div>
            <!-- item-center是自定义的样式类，用于设置内容的样式 -->
            <div class="item-center" ref="loadRef" v-loading="detailData.status === '检测中'" element-loading-text="执行中..." :style="{ height: detailData.fileType === '音频' ? '75px' : '195px' }">
                <!-- 根据detailData.fileType的值判断显示的内容 -->
                <img v-if="detailData.fileType === '图片' || detailData.fileType === '图文'|| detailData.fileType === 'AI图片'" class="item-img"
                    :src="detailData.fileUrl" alt="" />
                <video v-else-if="detailData.fileType === '视频'" :src="detailData.fileUrl" controls class="item-img"></video>
                <div v-else-if="detailData.fileType === '音频'" class="audio-box">
                    <audio :src="detailData.fileUrl" controls class="item-audio"></audio>
                </div>
            </div>
            <!-- 如果detailData.fileType的值是'图文'，则显示描述 -->
            <div class="item-text" v-if="detailData.fileType === '图文'">
                <el-tooltip class="box-item" effect="light" placement="top-start" >
                    <span>{{ detailData.describe }}</span>
                    <template #content>
                        <p style="line-height: 30px;font-size: 22px;width: 650px;">{{ detailData.describe }}</p>
                    </template>
                </el-tooltip>
            </div>
            <!-- item-bottom是自定义的样式类，用于设置底部内容的样式 -->
            <div class="item-bottom">
                <!-- item-txt-title是自定义的样式类，用于设置标题的样式 -->
                <div class="item-txt-title">
                    <!-- item-label是自定义的样式类，用于设置标签的样式 -->
                    <span class="item-label">创建时间：</span>
                    <!-- 显示detailData.datetime的值 -->
                    <span class="item-value">{{ detailData.datetime }}</span>
                </div>
                <!-- item-btn-box是自定义的样式类，用于设置按钮的样式 -->
                <div class="item-btn-box">
                    <!-- 下载按钮 -->
                    <el-button type="primary" @click="download(detailData)" link>下载</el-button>
                    <!-- 删除按钮 -->
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



//下载
const download = (row) => {
    //downLoadFile(row.fileName, row.fileUrl)
    // 去掉文件名后缀
    const baseFileName = removeFileExtension(row.fileName);
    console.log(row)

    if(row.fileType === "图片"){
        const downloadFileName = "detect_" + baseFileName + ".jpg";
        const url = row.fileUrl
        console.log(url)
        fetch(url)  // 替换为你的后端 URL
        .then(response => response.blob())
        .then(blob => {
            const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            // 使用传入的文件名作为下载文件名
            link.setAttribute('download', downloadFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);  // 下载后移除链接
        })
        .catch(error => console.error('Error downloading the img:', error));
    }

}

// 删除数据
const delOne = async (row) => {

    // 判断文件类型是否为图片
    if (row.fileType === '图片') {
        try {
            // 发送删除请求
            await axios.delete(`http://49.123.117.252:5011/FaceDetect/${row.id}`);
            // 刷新页面或数据
            window.location.reload();
        } catch (error) {
            console.error("删除数据时发生错误: ", error);
        }
    }
    
   
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