<template>
  <div style="padding:12px">
    <!-- 搜索框 -->
    <el-card class="serarch">
      <gt-search :data="searchData" @handle="oilApplyList" style="width:100%"></gt-search>
    </el-card>

    <el-card style="margin-top:12px;">
      <el-col align="left" style="margin-bottom:1%;margin-top:1%">
        <router-link to="/plan/oilApply">
          <el-button type="primary" size="medium" style="margin-left:1%">新增</el-button>
        </router-link>
        <el-button type="success" size="medium" style="margin-left:1%" @click="BatchDeleteUser">导出</el-button>
      </el-col>
      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:checkHandle="checkHandle"
        v-on:DeleteHandle="DeleteHandle"
        v-on:UpdatePreprocessing="UpdatePreprocessing"
        :handle="handle"
        size="mini"
      ></gt-table>
      <!-- v-on:selection-change="handleSelectionChange" -->
      <el-pagination
        style="margin:12px 0px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="offset"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import {
  getStaffList,
  corpSelect,
  getDeptList,
  oilCreate,
  oilSelect,
  oilUpdate,
  oilDetails,
  oildeSelect,
  oilDelete
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "oilPlan",
  data() {
    return {
      handle: [
        {
          function: "checkHandle",
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
      columns: [
        {
          id: "code",
          label: "加油申请单号"
        },
        {
          id: "urgent",
          label: "是否加急"
        },
        {
          id: "project_name",
          label: "项目部"
        },
        {
          id: "quantity",
          label: "加油数量"
        },
        {
          id: "amount",
          label: "加油金额"
        },
        {
          id: "deptname",
          label: "申请部门"
        },
        {
          id: "apply_state",
          label: "申请状态"
        }
      ],
      tableData: [], // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      optionWidth: 250,
      searchData: [
        // 搜索框 数据
        {
          key: "code", // 与后端交互时的字段 必填
          label: "申请单号", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: ""
        },
        {
          key: "guid", // 与后端交互时的字段 必填
          label: "项目部", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: "", // 搜索框 默认值
          options: []
        },
        {
          key: "date",
          label: "搜索框2",
          placeholder: "",
          default: ""
        }
      ]
    };
  },
  created() {
    this.getDeptList();
    this.oilApplyList();
  },
  methods: {
    /**
     ** 详情
     */
    async oilApplyList(param) {
      const res = await oildeSelect({ param: param });
      this.tableData = res.data;
    },

    /*
     ** 查看处理
     */
    async checkHandle(index, row) {
      console.log(row);
      // this.formCurrentStatus = "查看";
      // const response = await oilDetails({
      //   id: row.guid
      // });
      // if (response.status === 200) {
      //   this.form = response.data;
      //   this.dialogFormVisible = true;
      // } else this.$message.warning("请稍后再尝试");
    },

    /*
     ** 更新预处理
     */
    async UpdatePreprocessing(index, row) {
      console.log(index, row);
      this.ExamineHandle(index, row);
      this.formCurrentStatus = "更新";
    },

    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {
      const res = await oilUpdate(this.form);
      if (res.status === 200) {
        this.oilPlans();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
    },

    /*
     ** 删除处理
     */
    async DeleteHandle(index, row) {
      let that = this;
      this.$confirm("删除计划?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let res = oilDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          this.oilPlans();
        })
        .catch(err => {});
    },

    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.limit = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.offset = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     ** 列表 批量删除 用户
     */
    BatchDeleteUser() {
      window.open(process.env.VUE_APP_URL + "download");
    },

    /*
     ** 列表 批量删除 用户  预处理
     */
    handleSelectionChange(val) {
      let arr = [];
      for (var item of val) arr.push(item.id);
      this.multipleSelection = arr;
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
    }
  },
  components: {
    // searchBox,
    headTop
  }
};
</script>
<style>
.serarch {
  width: 100%;
  /* display: flex;
  justify-content: space-around;
  align-items: center; */
}
</style>
