<template>
    <el-dialog :model-value="visible" title="新增检测" width="40%" lock-scroll class="addwaterarmy-dialog-con"
        :before-close="close" :close-on-click-modal="false">
        <el-form label-width="120px" class="form-box" :model="state.form" ref="ruleFormRef" status-icon>
            <el-form-item label="请上传图像:" required prop="file" v-if="fileType !== '文本'">
                <template v-if="fileType === '待修复图片'">
                    <div class="upload-group">
                        <div class="upload-item">
                            <div class="upload-label">待修复图像：</div>
                            <el-upload :auto-upload="false" :on-change="(file) => imgChange(file, 'image')" 
                                :accept="state.accept" class="upload-container" list-type="picture-card" drag 
                                :file-list="state.imageFileList">
                                <el-icon id="uploadBox-image">
                                    <Plus />
                                </el-icon>
                                <template #file="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" :alt="file.name" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-delete" @click="handleRemove(file, 'image')">
                                            <el-icon>
                                                <Delete />
                                            </el-icon>
                                        </span>
                                    </span>
                                </template>
                            </el-upload>
                        </div>
                        <div class="upload-item">
                            <div class="upload-label">掩码图像：</div>
                            <el-upload :auto-upload="false" :on-change="(file) => maskChange(file, 'mask')" 
                                :accept="state.accept" class="upload-container" list-type="picture-card" drag 
                                :file-list="state.maskFileList">
                                <el-icon id="uploadBox-mask">
                                    <Plus />
                                </el-icon>
                                <template #file="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" :alt="file.name" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-delete" @click="handleRemove(file, 'mask')">
                                            <el-icon>
                                                <Delete />
                                            </el-icon>
                                        </span>
                                    </span>
                                </template>
                            </el-upload>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <el-upload :auto-upload="false" :on-change="fileChange" :accept="state.accept" class="upload-container"
                        list-type="picture-card" drag ref="uploadFileRef" :on-preview="handlePictureCardPreview"
                        :file-list="state.fileList">
                        <el-icon id="uploadBox2">
                            <Plus />
                        </el-icon>
                        <template #file="{ file, files }">
                            <img class="el-upload-list__item-thumbnail" :src="state.tempFile.fileUrl"
                                v-if="fileType === '图片' || fileType === '图文' || fileType === 'AI图片' || fileType === '文档图片'"
                                :alt="state.tempFile.fileName" />
                            <img class="el-upload-list__item-thumbnail" src="../../../assets/images/up-video.svg"
                                v-else-if="fileType === '视频'" :alt="state.tempFile.fileName" />
                            <img class="el-upload-list__item-thumbnail" src="../../../assets/images/up-audio.svg"
                                v-else-if="fileType === '音频'" :alt="state.tempFile.fileName" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-delete" @click="handleRemove(file, files)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </span>
                        </template>
                    </el-upload>
                </template>
            </el-form-item>
            <el-form-item label="文字描述：" v-if="fileType === '图文'">
                <el-input v-model="state.form.describe" type="textarea" :rows="5" placeholder="请输入文字描述" />
            </el-form-item>
            <el-form-item label="文字描述：" v-if="fileType === '文本'">
                <el-input v-model="state.form.describe" type="textarea" :rows="5" placeholder="请输入文字描述" />
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


<script name="AddForgeDialog" setup>
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

    formData.delete('imgName')
    formData.delete('imgUrl')
    formData.delete('imgType')
    formData.delete('maskName')
    formData.delete('maskUrl')
    formData.delete('maskType')
    formData.delete('resultName')
    formData.delete('resultUrl')
    formData.delete('resultType')
    
}

const props = defineProps({
    visible: Boolean,
    fileType: String,
})

const close = () => {
    emits("update:visible", false)

}

const fileTypeList = ["图片", "文档图片", "视频", "音频", "AI图片", "待检测修复的图片","待修复图片"]

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
        describe: "",
        file: "",


        //待修复图片的相关字段
        imgName: "",
        imgUrl: "",
        imgType: "",
        maskName: "",
        maskUrl: "",
        maskType: "",
        resultName: "",
        resultUrl: "",
        resultType: "",
    },
    detectList: [
        //深伪图片检测算法
        { title: "OSN", disabled: false, supportedFileTypes: '图片' },
        { title: "FOCAL", disabled: false, supportedFileTypes: '图片' },
        // { title: "IIDNet", disabled: false, supportedFileTypes: '图片' },
        { title: "PCANet", disabled: false, supportedFileTypes: '图片' },
        { title: "LHEFNet", disabled: false, supportedFileTypes: '图片' },
        { title: "PSCCNet", disabled: false, supportedFileTypes: '图片' },
        { title: "TruFor", disabled: false, supportedFileTypes: '图片' },
        // { title: "CTP-Net", disabled: false, supportedFileTypes: '图片' },
        //AIGC图片检测算法
        { title: "FatFormer", disabled: false, supportedFileTypes: 'AI图片' },
        // {   title: "NPR",  disabled: false,    supportedFileTypes: 'AI图片'},

        //文档图片检测算法
        { title: "CPTNet", disabled: false, supportedFileTypes: '文档图片' },
        // {   title: "NPR",  disabled: false,    supportedFileTypes: 'AI图片'},
        

        //深伪视频检测算法
        { title: "FAMM", disabled: false, supportedFileTypes: '视频' },
        { title: "Delocate", disabled: false, supportedFileTypes: '视频' },
        { title: "SBIs", disabled: false, supportedFileTypes: '视频' },
        { title: "EfficientNet", disabled: false, supportedFileTypes: '视频' },

        { title: "LPR", disabled: false, supportedFileTypes: '视频' },
        { title: "Multiscale", disabled: false, supportedFileTypes: '视频' },
        //深伪音频检测算法
        { title: "ESSD", disabled: false, supportedFileTypes: '音频' },
        //图文伪造检测算法
        { title: "HDF-Net", disabled: false, supportedFileTypes: '图文' },
        { title: "MFF-Net", disabled: false, supportedFileTypes: '图文' },
        { title: "MMFN", disabled: false, supportedFileTypes: '图文' },
        { title: "SpotFake+", disabled: false, supportedFileTypes: '图文' },
        { title: "CFFN", disabled: false, supportedFileTypes: '图文' },
        { title: "CAFE", disabled: false, supportedFileTypes: '图文' },
        
        //AIGC文本检测算法
        { title: "GPT-who", disabled: false, supportedFileTypes: '文本' },

        //图像修复相关算法
        { title: "DeFI", disabled: false, supportedFileTypes: '待检测修复的图片' },//针对图像修复的检测算法
        { title: "SafePaint", disabled: false, supportedFileTypes: '待修复图片' },//抗检测的图像修复算法

    ],
})

//根据不同“fileType”显示对应的算法选项
const filteredDetectList = computed(() => {
    return state.detectList.filter(item => item.supportedFileTypes === state.form.fileType);
});

const changeType = (value) => {
    state.form.fileType = value
    if (value === "图片") {
        state.accept = "image/*"
    } else if (value === "AI图片") {
        state.accept = "image/*"
    } else if (value === "音频") {
        state.accept = "audio/*"
    } else if (value === "视频") {
        state.accept = "video/*"
    }else if (value === "文档图片") {
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
// const handleRemove = (file) => {
//     console.log("删除文件");
//     uploadFileRef.value.clearFiles();
//     showUplodCard()
// }
const handleRemove = (file, type = "general") => {
    console.log("删除文件");
    uploadFileRef.value.clearFiles();

    // 根据类型控制不同上传框的显示
    if (type === "image") {
        showUplodCard("uploadBox-image", true); // 显示“待修复图像”
    } else if (type === "mask") {
        showUplodCard("uploadBox-mask", true);  // 显示“掩码图像”
    } else {
        showUplodCard("uploadBox2", true); // 显示通用上传框
    }
};


// 选择文件后
const fileChange = (file) => {
    state.tempFile.file = file.raw; // 保存文件对象
    formData.append('file', file.raw);
    const { name, url } = file;
    state.tempFile.fileName = name;
    state.tempFile.fileUrl = url;
    state.form.file = name;
    // showUplodCard(false)
    showUplodCard("uploadBox2", false); // 隐藏

}

const imgChange = (file) => {
    state.tempFile.imgFile = file.raw; // 保存文件对象
    const { name, url } = file;
    state.tempFile.imgName = name;
    state.tempFile.imgUrl = url;
    state.tempFile.imgType = "待修复图片";
    state.form.file = name;
    // showUplodCard(false);
    showUplodCard("uploadBox-image", false);   // 显示

}

const maskChange = (file) => {
    state.tempFile.maskFile = file.raw; // 保存文件对象
    const { name, url } = file;
    state.tempFile.maskName = name;
    state.tempFile.maskUrl = url;
    state.tempFile.maskType = "掩码图片";
    state.form.file = name;
    // showUplodCard(false);
    showUplodCard("uploadBox-mask", false);   // 隐藏
}

// const showUplodCard = (show = true) => {
//     const icon = document.querySelector("#uploadBox2");
//     icon.parentElement.parentElement.style.display = show ? "block" : "none";
// }
const showUplodCard = (id = "uploadBox-image", show = true) => {
    const icon = document.querySelector(`#${id}`);
    if (icon && icon.parentElement?.parentElement) {
        icon.parentElement.parentElement.style.display = show ? "block" : "none";
    }
}


// 定义一个异步函数，用于发送数据
const sendData = async (url, formData) => {
    try {
        console.log("FormData 内容：");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        console.log("hhhhhhhhhhhhhhhhhhhh");
        
        // 发送 POST 请求，携带 formData，并设置内容类型为 multipart/form-data
        const res = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        // const res = await axios.post(url, formData); // 不手动设置headers
        console.log("hhhhhhhhhhhhhhhhhhhh");
        
        // 从响应中提取数据
        const responseData = res.data;
        
        // 将概率值存储到状态中
        state.tempFile.probability = responseData.result;
        
        // 输出概率值到控制台
        console.log(responseData.result);
        // 触发成功事件，传递 ID 和概率值
        emits("success", { id: state.tempFile.id, probability: state.tempFile.probability });
        if(state.tempFile.fileType === "音频"){
            let parms = {
                    id: state.tempFile.id,         // UUID
                    filename: state.tempFile.fileName,  // 文件名
                    fileUrl: responseData.fileurl,    // 文件URL
                    fileType: state.tempFile.fileType,  // 文件类型
                    probability: state.tempFile.probability, // 概率信息
                    datatime:state.tempFile.datetime,
                    statue: "已完成",
                    pdf_path: responseData.pdf_url
                };
                console.log(parms, '上传阐述================');
                axios.post('http://49.123.117.252:3090/audio/add', parms, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            if(state.tempFile.fileType === "文本"){
            let parms = {
                    id: state.tempFile.id,         // UUID
                    fileType: state.tempFile.fileType,  // 文件类型
                    probability: state.tempFile.probability, // 概率信息
                    describe: state.tempFile.describe,
                    datatime:state.tempFile.datetime,
                    statue: "已完成",
                    pdf_path: responseData.pdf_url
                };
                console.log(parms, '上传阐述================');
                axios.post('http://49.123.117.252:3091/ai_text/add', parms, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
    } catch (error) {
        // 捕获并输出任何错误
        console.log(error);
    } finally {
        // 清空表单数据，重置表单状态
        clearFormData();
        reset();
    }
};

// 定义开始检测的函数
const start = () => {
    // 生成唯一 ID，并设置当前时间
    state.tempFile.id = uuidv4();
    state.tempFile.datetime = formatDate();
    // 设置文件类型和描述
    state.tempFile.fileType = props.fileType;
    state.tempFile.describe = state.form.describe;

    // 清空 formData
    clearFormData();

    // 添加通用字段
    formData.append('id', state.tempFile.id);
    formData.append('datetime', state.tempFile.datetime);
    formData.append('detectItems', JSON.stringify(state.form.detectItems)); // 将数组转换为字符串

    if (props.fileType === "待修复图片") {
        // 添加 img 和 mask 文件
        if (state.tempFile.imgFile) {
            formData.append('img', state.tempFile.imgFile);
        }
        if (state.tempFile.maskFile) {
            formData.append('mask', state.tempFile.maskFile);
        }
        // 添加 img 和 mask 相关信息
        formData.append('imgName', state.tempFile.imgName);
        formData.append('imgType', state.tempFile.imgType);
        formData.append('maskName', state.tempFile.maskName);
        formData.append('maskType', state.tempFile.maskType);
    } else {
        // 其他文件类型的处理
        formData.append('filename', state.tempFile.fileName);
        formData.append('fileType', state.tempFile.fileType);
        formData.append('describe', state.tempFile.describe);
         formData.append('file', state.tempFile.file);
    }

    // 打印 FormData 内容，用于调试
    console.log("FormData 内容：");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    // 触发初始数据事件，传递当前临时文件的信息
    emits("initialData", JSON.parse(JSON.stringify(state.tempFile)));

    // 定义不同文件类型对应的 URL
    const urls = {
        "文档图片": 'http://49.123.117.252:8848/TextImageDetect',
        "图文": 'http://49.123.117.252:5000/fnd',
        "图片": 'http://49.123.117.252:5001/ImageDetect',
        "AI图片": 'http://49.123.114.186:5555/ImageDetect',
        "视频": 'http://49.123.117.252:5002/VideoDet',
        "音频": 'http://49.123.114.186:7777/upload',
        "文本": 'http://49.123.114.186:8888/upload',
        "待检测修复的图片": 'http://49.123.117.252:8091/ipd',
        "待修复图片": 'http://49.123.117.252:9090/ip'
    };

    // 根据当前文件类型选择相应的 URL
    const url = urls[props.fileType];
    if (url) {
        sendData(url, formData);
    }
};




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