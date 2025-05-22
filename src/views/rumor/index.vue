<template>
    <div class="rumor-container">
        <MySearch :search="searchOpt" @search="onSearch" @reset="reset"></MySearch>
        <el-row justify="end">
            <el-button type="primary" @click="state.addMissionVisible = true">新增检测</el-button>
        </el-row>
        <el-table class="tab-con" :data="state.tableData" stripe border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="id" label="任务id" align="center" />
            <el-table-column prop="missionType" label="任务类型" width="180" align="center" />
            <el-table-column label="新闻数量" width="180" align="center">
                <template #default="{ row }">
                    {{ row.newsList.length }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="任务状态" width="180" align="center">
                <template #default="{ row }">
                    <el-tag :type="formatStatusColor(row.status)">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="datetime" label="创建时间" width="180" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="{ row }">
                    <el-button type="primary" link @click="lookResult(row)">查看结果</el-button>
                    <el-popconfirm title="确定删除此任务吗？" @confirm="delMission(row)" width="180">
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
    <AddRumorDialog v-model:visible="state.addMissionVisible" @success="addDetect" />
    <RumorDetailDialog v-model:visible="state.DetailVisible" :detail-data="state.currentRow" />
</template>
  
<script name="RumorList" setup>
import { reactive } from "vue";
import { formatStatusColor, extractStringFromURL, mockLoadData } from "@/utils";
import missionJson from "./jsonData/missionList.json";
import AddRumorDialog from "./components/AddRumorDialog";
import RumorDetailDialog from "./components/RumorDetailDialog.vue";
import { v4 as uuidv4 } from 'uuid';

const searchOpt = [
    {
        label: '任务类型',
        prop: 'missionType',
        placeholder: '请选择任务类型',
        required: false,
        type: 'select',
        options: [
            { label: "url", value: "url" },
            { label: "上传文件", value: "上传文件" },
            { label: "手动输入", value: "手动输入" },
        ],
    },
]
const state = reactive({
    addMissionVisible: false,
    DetailVisible: false,
    tableData: missionJson.sort((a, b) => {
        const date1 = new Date(a.datetime);
        const date2 = new Date(b.datetime);
        return date2 - date1;
    }).slice(0, 10),
    total: missionJson.length,
    queryParams: {
        waterName: "",
        pageNum: 1,
        pageSize: 10,
    },
    currentRow: {},
})
const onSearch = () => {

}
const reset = () => {

}
const lookResult = (row) => {
    state.currentRow = row;
    state.DetailVisible = true;
}
const delMission = (row) => {

}
const getList = () => {

}


const addDetect = (data) => {
    if (data.missionType === "url") {
        state.tableData.unshift(data);
        loadUrlNews()
    } else if (data.missionType === "上传文件") {
        data.activeIndex = 3
        state.tableData.unshift(data);
        loadTextNews()
    }
}

const newsList = [
    {
        "id": 1,
        "title": "加沙医院被空袭引发愤怒，拜登发声：对无辜逝者表示最深切哀悼",
        "url": "https://www.toutiao.com/article/7291075021475316261/?log_from=de1f90da98f43_1697622722274",
        "type": "国际时事",
        "date": "2023-10-18 07:35",
        "probability": 99
    },
]
// 加载url新闻内容
const loadUrlNews = () => {
    let num = 0
    mockLoadData(stop => {
        const len = Math.floor(Math.random() * 2) + 1;
        state.tableData[0].newsList.push(...newsList.slice(num, num + len).map(item => ({ title: item.title, id: item.id })))
        num += len
        if (num >= newsList.length) {
            stop()
        }
    }).then(res => {
        state.tableData[0].activeIndex = 2
        let num = 0
        mockLoadData(stop => {
            const len = Math.floor(Math.random() * 2) + 1;
            const data = newsList.slice(num, num + len)
            for (let i = 0; i < data.length; i++) {
                const index = state.tableData[0].newsList.findIndex(item => item.id === data[i].id)
                state.tableData[0].newsList[index].date = data[i].date
                state.tableData[0].newsList[index].type = data[i].type
            }
            num += len
            if (num >= newsList.length) {
                stop()
            }
        }).then(res => {
            state.tableData[0].activeIndex = 3
            let num = 0
            mockLoadData(stop => {
                const len = Math.floor(Math.random() * 2) + 1;
                const data = newsList.slice(num, num + len)
                for (let i = 0; i < data.length; i++) {
                    const index = state.tableData[0].newsList.findIndex(item => item.id === data[i].id)
                    console.log("index", index);
                    state.tableData[0].newsList[index].probability = Number(data[i].probability)
                }
                num += len
                if (num >= newsList.length) {
                    stop()
                }
            }).then(res => {
                state.tableData[0].status = "已完成"
            })
        })
    })
}

const textNewsList1 = [
    {
        "id": 1,
        "title": "社交媒体上广泛传播我导弹击中岛内医院，导致大量伤亡",
        "url": "",
        "type": "国际时事",
        "date": "2023-04-15",
        "probability": 2
    },
]
const textNewsList2 = [
    {
        "id": 1,
        "title": "2022年10月13日，赫尔松地区新动员的俄军士兵枪击了他们的上级，并且带着所有的武器投降了。对于那些不想被装在裹尸袋里回家的人来说，这是一个很好的可供参考的例子。",
        "url": "",
        "type": "国际时事",
        "date": "2022-10-30",
        "probability": 5
    },
]
// 加载上传文件的新闻内容
const loadTextNews = () => {
    let list = textNewsList1
    // if (state.tableData[0].fileName.indexOf("fake") === -1) {
    //     list = textNewsList1
    // } else {
    //     list = textNewsList2
    // }
    state.tableData[0].newsList = list.map(item => {
        const obj = { ...item }
        delete obj.probability
        return obj
    })
    setTimeout(() => {
        state.tableData[0].newsList.forEach((el, index) => {
            el.probability = list[index].probability
        })
        state.tableData[0].status = "已完成"
    }, 3000)
}

</script>
<style lang="scss" scoped>
.rumor-container {
    padding: 20px;

    .tab-con {
        margin-top: 20px;
    }
}
</style>