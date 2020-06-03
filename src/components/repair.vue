<template>
  <div style="padding:12px">
    <!-- 搜索框 -->

    <el-card>
      <gt-search :data="searchData" @handle="getRepairList" ref="gtSearch"></gt-search>
    </el-card>

    <el-card style="margin-top:12px">
      <el-col align="left" style="margin-bottom:1%">
        <el-select v-model="select" placeholder="请选择新建项" size="medium">
          <el-option label="日常检查保养记录表" value="1"></el-option>
          <el-option label="周检查保养记录表" value="2"></el-option>
          <el-option label="月检查保养记录表" value="3"></el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="CreateHandle" plain>创建</el-button>

        <!-- <el-button type="primary" size="medium" @click="exportExcel">导出</el-button> -->
      </el-col>

      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:ExamineHandle="ExamineHandle"
        v-on:DeleteHandle="DeleteHandle"
        v-on:downloadHandle="downloadHandle"
        :handle="handle"
      ></gt-table>
      <el-pagination
        style="margin:12px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageno"
        :page-sizes="[2, 4, 6]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import {
  corpSelect, // 公司
  getDeptList, // 部门
  getStaffList, // 人员
  equiSelect, // 设备列表
  oilSelect, // 加油计划列表
  repairList, // 保养记录
  repairDelete, // 删除保养记录
  repairexport // 单条导出
} from "@/getData";
export default {
  name: "fixtask",
  data() {
    return {
      // 表格相关数据
      handle: [
        {
          function: "ExamineHandle",
          text: "查看/更新",
          type: "text",
          show: true
        },
        {
          function: "DeleteHandle",
          text: "删除",
          type: "text",
          show: true
        },
        {
          function: "downloadHandle",
          text: "导出",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "code",
          label: "保养记录编号"
        },
        {
          id: "plateno",
          label: "保养记录编号"
        },
        {
          id: "type",
          label: "保养类型"
        },
        {
          id: "time",
          label: "保养时间"
        },
        {
          id: "state",
          label: "保养状态"
        },
        {
          id: "repaname",
          label: "保养部门"
        },
        {
          id: "proname",
          label: "项目部"
        },
        {
          id: "driver_chief",
          label: "司机长"
        },
        {
          id: "driver",
          label: "司机"
        }
      ],
      tableData: [], // 表格数据
      total: 6,
      pageno: 1,
      pagesize: 2,
      optionWidth: 250,
      // 搜索框数据
      searchData: [
        {
          key: "flag", // 与后端交互时的字段 必填
          label: "保养类型", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          default: "", // 搜索框 默认值
          options: [
            {
              label: "日常保养",
              value: "day"
            },
            {
              label: "周常保养",
              value: "week"
            },
            {
              label: "月常保养",
              value: "month"
            }
          ]
        },
        {
          key: "opm",
          label: "项目部",
          placeholder: "请选择",
          default: "",
          options: []
        },
        {
          key: "date",
          label: "选择日期",
          placeholder: "请选择",
          default: ""
        }
      ],
      select: "1"
    };
  },
  beforeCreate() {},
  created() {
    this.getRepairList();
    this.getDeptList();
  },
  methods: {
    /*
     ** 创建处理
     */
    async CreateHandle(info) {
      switch (this.select) {
        case "1":
          this.$router.push({
            path: "day"
          });
          break;
        case "2":
          this.$router.push({
            path: "week"
          });
          break;
        case "3":
          this.$router.push({
            path: "month"
          });
          break;
      }
    },

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {
      console.log(index, row);
      switch (row.type) {
        case "日常保养":
          this.$router.push({
            path: "day",
            query: {
              id: row.code
            }
          });
          break;
        case "周常保养":
          this.$router.push({
            path: "week",
            query: {
              id: row.code
            }
          });
          break;
        case "月常保养":
          this.$router.push({
            path: "month",
            query: {
              id: row.code
            }
          });
          break;
      }
      // this.formCurrentStatus = "查看";
      // const response = await oildeDetail({
      //   id: row.guid
      // });
      // if (response.status === 200) {
      //   this.form = row;
      //   this.dialogFormVisible = true;
      // } else this.$message.warning("请稍后再尝试");
    },

    /*
     ** 设备列表
     */
    async getEquiList() {
      const res = await equiSelect();
      res.data.map(item => {
        item.value = item.guid;
        item.label = item.plateno;
      });
      this.searchData[0].options = res.data;
    },

    /**
     ** 部门列表
     */
    async getDeptList() {
      const res = await getDeptList();
      res.data.map(item => {
        console.log(item);
        item.value = item.guid;
        item.label = item.name;
      });
      this.searchData[1].options = res.data;
    },

    /*
     ** 删除处理
     */
    DeleteHandle(index, row) {
      let that = this;
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await repairDelete({ id: row.code });
          if (res.status === 200) {
            this.$message.success("删除成功");
            this.getRepairList();
          }
        })
        .catch(err => {});
    },

    /*
     ** 获取保养记录列表
     */
    async getRepairList(param = {}) {
      param.pageno = this.pageno;
      param.pagesize = this.pagesize;
      console.log(param);
      const res = await repairList({ param: param });

      this.tableData = res.data.list;
      this.total = res.data.total;
      // this.pagesize = res.data.pagesize;
      // this.pageno = res.data.pagesize;
      res.data.list.map(item => {
        switch (item.type) {
          case "day":
            item.type = "日常保养";
            break;
          case "week":
            item.type = "周常保养";
            break;
          case "month":
            item.type = "月常保养";
            break;
        }
      });
    },

    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.pagesize = val;
      console.log(`size每页:${val}条`);
      console.log(`size第${this.pageno}页`);
      this.$refs.gtSearch.searchHandle();
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      console.log(`current每页:${this.pagesize}条`);
      this.pageno = val;
      this.$refs.gtSearch.searchHandle();
    },

    /*
     ** 搜索处理
     */
    async searchHandle(param) {
      const res = await oildeSelect({ param: param });
      this.tableData = res.data;
    },

    /*
     ** 导出 excel
     */
    exportExcel(val) {},

    /*
     ** 单条导出
     */
    downloadHandle(index, row) {
      window.open(process.env.VUE_APP_URL + `repairexport/${row.code}`);
    }
  },
  components: {}
};
</script>
<style>
.button_group {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
</style>
