<template>
  <div style="padding:12px">
    <!-- 搜索框 -->

    <el-card>
      <gt-search :data="searchData" @handle="searchHandle" size></gt-search>
    </el-card>

    <el-card style="margin-top:12px">
      <el-col align="left" style="margin-bottom:1%">
        <el-select v-model="select" placeholder="请选择新建项" size="medium">
          <el-option label="日常检查保养记录表" value="1"></el-option>
          <el-option label="周检查保养记录表" value="2"></el-option>
          <el-option label="月检查保养记录表" value="3"></el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="CreateHandle" plain>创建</el-button>

        <el-button type="primary" size="medium" @click="exportExcel">导出</el-button>
      </el-col>
      <el-col align="middle">
        <gt-table
          :tableData="tableData"
          style="width: 100%"
          :optionWidth="optionWidth"
          :columns="columns"
          :selection="false"
          v-on:ExamineHandle="ExamineHandle"
          v-on:DeleteHandle="DeleteHandle"
          v-on:UpdatePreprocessing="UpdatePreprocessing"
          :handle="handle"
        ></gt-table>
        <!-- v-on:selection-change="handleSelectionChange" -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="offset"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
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
  oildeCreate, // 加油任务创建
  oildeSelect, // 加油任务列表
  oildeDetail, // 加油任务详情
  oildeUpdate, // 更新加油任务
  oildeDelete, // 加油任务删除
  oilTaskStart, // 加油任务开始
  oilTaskStop, // 加油任务结束
  repairAll // 保养记录
} from "@/getData";
export default {
  name: "fixtask",
  data() {
    return {
      // 表格相关数据
      handle: [
        {
          function: "ExamineHandle",
          text: "查看",
          type: "text",
          show: true
        },
        {
          function: "UpdatePreprocessing",
          text: "更新",
          type: "text",
          show: true
        },
        {
          function: "DeleteHandle",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      // type: "day",
      //   guid: "", // 车辆guid
      //   time: "", // 保养时间
      //   state: "", // 保养状态
      //   repair_dept: "", // 保养部门 guid
      //   company: "", // 公司 guid
      //   project_dept: "", // 项目部 guid
      //   driver_chief: "", // 司机长
      //   driver: "", // 司机
      columns: [
        {
          id: "code",
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
          id: "repair_dept",
          label: "保养部门"
        },
        {
          id: "project_dept",
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
      total: 0,
      limit: 10,
      offset: 1,
      optionWidth: 250,
      // 搜索框数据
      searchData: [
        {
          key: "guid", // 与后端交互时的字段 必填
          label: "车辆牌号", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          default: "0", // 搜索框 默认值
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "福田", // 下拉选项 绑定 值
              label: "0019" // 下拉选项 绑定 名称
            },
            {
              value: "本田",
              label: "00210"
            }
          ]
        },
        {
          key: "OPM",
          label: "项目部",
          placeholder: "请选择",
          default: "",
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "福田", // 下拉选项 绑定 值
              label: "0019" // 下拉选项 绑定 名称
            },
            {
              value: "本田",
              label: "00210"
            }
          ]
        },
        {
          key: "date",
          label: "搜索框3",
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
     ** 更新预处理
     */
    UpdatePreprocessing(index, row) {
      console.log(index, row);
      this.ExamineHandle(index, row);
      this.formCurrentStatus = "更新";
    },

    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {
      this.ExamineHandle(index, row);
      const res = await oildeUpdate(this.form);
      if (res.status === 200) {
        this.detaList();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
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
          let res = await oildeDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
            this.detaList();
          }
        })
        .catch(err => {});
    },

    /*
     ** 获取保养记录列表
     */
    async getRepairList(formName) {
      const res = await repairAll();
      this.tableData = res.data;
      res.data.map(item => {
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
      this.limit = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     *关闭编辑状态
     */
    handleisShowViewUser() {
      this.isEditor = true;
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.offset = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     ** 搜索处理
     */
    searchHandle(val) {
      console.log("搜索:", val);
    },

    /*
     ** 导出 excel
     */
    exportExcel(val) {}
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
