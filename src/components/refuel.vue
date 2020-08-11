<template>
  <div style="padding:12px">
    <!-- 搜索框 -->
    <el-card class="serarch">
      <gt-search :data="searchData" @handle="oilApplyList" ref="refuelSearch" style="width:100%"></gt-search>
    </el-card>

    <el-card style="margin-top:12px;">
      <router-link to="/plan/oilApply">
        <el-button type="primary" size="mini">新增</el-button>
      </router-link>
      <el-button
        type="success"
        size="mini"
        style="margin-left:12px;; margin-bottom:12px"
        @click="BatchDeleteUser"
      >导出</el-button>

      <!-- refuel -->
      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:ExamineHandle="ExamineHandle"
        v-on:DeleteHandle="DeleteHandle"
        :handle="handle"
      ></gt-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageno"
        :page-sizes="[10,20,30,40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:12px"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import {
  oilUpdate,
  corpRank, // 部门列表
  refuelList, // 加油申请列表
  refuelDelete // 加油申请删除
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "refuel",
  data() {
    return {
      handle: [
        {
          function: "ExamineHandle",
          text: "查看/编辑",
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
      pagesize: 10,
      pageno: 1,
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
          key: "dept_guid", // 与后端交互时的字段 必填
          label: "项目部", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: "", // 搜索框 默认值
          options: []
        },
        {
          key: "date",
          label: "申请时间",
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
     ** 加油申请列表
     */
    async oilApplyList(param = {}) {
      param.pagesize = this.pagesize;
      param.pageno = this.pageno;
      const res = await refuelList({ param: param });
      this.total = res.data.total;
      this.tableData = res.data.list;
    },

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {
      this.$router.push({
        path: "/plan/oilApply",
        query: {
          id: row.code
        }
      });
    },

    /*
     ** 更新
     */
    async UpdateHandle(index, row) {
      this.ExamineHandle(index, row);
      this.formCurrentStatus = "更新";
      const res = await oilUpdate(this.form);
      if (res.status === 200) {
        this.refuels();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
    },

    /*
     ** 删除处理
     */
    DeleteHandle(index, row) {
      let that = this;
      this.$confirm("删除加油申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await refuelDelete({ id: row.code });
          if (res.status === 200) {
            this.$message.success("删除成功");
            this.oilApplyList();
          } else this.$message.warning("删除失败,请稍后再试");
        })
        .catch(err => {});
    },

    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.pagesize = val;
      this.$refs.refuelSearch.searchHandle();
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.pageno = val;
      this.$refs.refuelSearch.searchHandle();
    },

    /*
     ** 列表 批量删除 用户
     */
    BatchDeleteUser() {
      window.open(process.env.VUE_APP_URL + "download/10");
    },

    /**
     ** 部门列表
     */
    async getDeptList() {
      const res = await corpRank({ id: 3 });
      res.data.map(item => {
        console.log(item);
        item.value = item.guid;
        item.label = item.name;
      });
      this.searchData[1].options = res.data;
    }
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
