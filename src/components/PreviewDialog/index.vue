<template>
    <!-- 预览窗口 -->
    <el-dialog :model-value="previewVisible" width="fit-content" lock-scroll append-to-body id="video-dialog"
        @close="pasueVideo" class="preview-dialog-con" :before-close="pasueVideo">
        <video ref="videoRef" src="./id3_id1_0001.mp4" width="600" height="400" controls id="videoId"></video>
        <!-- <div v-else-if="state.preInfo.preFileType === 'audio'" class="audio-box">
            <img src="../../../assets/audiobg.webp" alt="" class="w100">
            <audio ref="audioRef" class="audio-component" controls preload="auto"
                :src="state.preInfo.mediaResponse"></audio>
        </div> -->
        <!-- <div class="close-btn">
            <img src="../../assets/icons/svg/close-btn.svg" alt="" @click="emits('update:previewVisible', false)">
        </div> -->
    </el-dialog>
</template>

<script name="PreviewFile" setup>
import { reactive } from "vue";

const props = defineProps({
    previewVisible: Boolean
})


const emits = defineEmits(["update:previewVisible"])

// 关闭视频播放
const pasueVideo = () => {
    emits('update:previewVisible', false)
    autoPasue();
}
//自动关闭播放
const autoPasue = () => {
    switch ("video") {
        case "video":
            const videoDom = document.getElementById("videoId")
            if (videoDom) {
                videoDom.pause();
            }
            break;
        case "audio":
            if (audioRef.value) {
                audioRef.value.pause();
            }
            break;
        default:
            break;
    }
}
</script>

<style lang="scss">
.preview-dialog-con {
    position: relative;

    .el-dialog__header {
        // display: none;
    }

    .el-dialog__body {
        // padding-top: 0;
    }

    .close-btn {
        position: absolute;
        z-index: 2;
        top: -18px;
        right: -18px;
        width: 35px;
        height: 35px;
        background-color: #fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        &>img {
            width: 120%;
            height: 120%;
            cursor: pointer;
        }
    }
}
</style>