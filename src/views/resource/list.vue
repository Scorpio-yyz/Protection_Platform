<template>
  <div class="resource-container">
    <MySearch :search="searchOpt" @search="onSearch" @reset="reset">
    </MySearch>
    <el-row justify="end">
      <el-button type="primary" @click="addWater">导入资源</el-button>
    </el-row>
    <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="fileName" label="文件名称" align="center" />
      <el-table-column prop="fileType" label="文件类型" width="180" align="center" />
      <el-table-column prop="size" label="文件大小" width="180" align="center">
        <template #default="{ row }">
          {{ convertFileSize(Number(row.size)) }}
        </template>
      </el-table-column>
      <el-table-column prop="person" label="人物" align="center" />
      <el-table-column prop="datetime" label="创建时间" width="180" align="center" />
      <el-table-column label="操作" width="260" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="markFile(row)">标记资源</el-button>
          <el-button type="primary" link @click="preview(row)">预览</el-button>
          <el-button type="primary" link>下载</el-button>
          <el-popconfirm title="确定删除此文件吗？" @confirm="delFile(row)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNum"
      v-model:limit="state.queryParams.pageSize" @pagination="getList" /> -->
  </div>
</template>

<script name="Resource" setup>
import { convertFileSize } from "@/utils/index";
import fileList from "./jsonData/fileList.json";
const searchOpt = [
  {
    label: '文件名称', prop: 'waterName', placeholder: '请输入文件名称', required: false, type: 'input'
  },
  {
    label: '文件类型', prop: 'fileType', placeholder: '请选择文件类型', required: false, type: 'select',
    options: [
      { label: "视频", value: "视频" },
      { label: "图片", value: "图片" },
      { label: "音频", value: "音频" },
    ]
  },
]
const state = reactive({
  tableData: fileList,
  total: fileList.length,
  queryParams: {
    fileName: 0,
  },
  addVisible: false,
  showImagePreview: false,
  previewImgList: [],
})

const markFile=(row)=>{
  
}
</script>

<style lang="scss" scoped>
.resource-container {
  padding: 20px;

  .tab-con {
    margin-top: 20px;
  }
}
</style>