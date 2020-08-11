<template>
  <div style="padding:12px">
    <el-card style="margin-bottom:12px">
      <gt-search :data="searchData" @handle="getData" ref="fixSearch"></gt-search>
    </el-card>
    <el-card>
      <!-- 列表操作按钮 -->
      <el-col align="left" style="margin-bottom:12px;">
        <el-button type="primary" size="mini" @click="newFix">新增</el-button>
        <el-button type="success" size="mini" @click="exportForm">导出</el-button>
      </el-col>
      <!-- 内部用户列表 -->
      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:viewAssign="viewAssign"
        v-on:newFixTask="newFixTask"
        :handle="handle"
        size="mini"
      ></gt-table>
      <!-- v-on:selection-change="handleSelectionChange" -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pageno"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParam.total"
        style="margin-top:12px"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import { corpRank, equiSelect, download, fixList } from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
  data() {
    return {
      searchData: [
        {
          key: "equip", // 与后端交互时的字段 必填
          label: "车辆", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          options: []
        },
        {
          key: "proj_deptid",
          label: "项目名称",
          placeholder: "请选择", // 占位符 选填
          options: []
        },
        {
          key: "date",
          label: "起止时间",
          placeholder: "请选择",
          type: "datetimerange"
        }
      ],
      queryParam: {
        pageno: 1,
        pagesize: 10
      },
      eqData: [], //设备列表
      corpData: [], //公司列表
      show: true,
      handle: [
        {
          function: "viewAssign",
          text: "查看/编辑",
          type: "text",
          show: true
        },
        {
          function: "newFixTask",
          text: "新增维修任务",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "code",
          label: "维修审批单号"
        },
        {
          id: "equipname",
          label: "车辆名称"
        },
        {
          id: "plant_no",
          label: "车牌号码"
        },
        {
          id: "deptnamesched",
          label: "申请部门"
        },
        {
          id: "project_name",
          label: "项目名称"
        },
        {
          id: "real_amount",
          label: "维修金额"
        },
        {
          id: "planstart",
          label: "计划维修时间"
        },
        {
          id: "apply_date",
          label: "申请时间"
        }
      ],
      tableData: null, // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      // 创建 更新 删除 表单

      optionWidth: 250
    };
  },
  created() {
    this.getData();
    this.getEqList();
    this.getCorp();
  },
  methods: {
    async exportForm() {
      window.open(process.env.VUE_APP_URL + "download/3");
    },
    dateChange(val) {
      this.queryParam.start = val[0];
      this.queryParam.end = val[1];
    },
    async getEqList() {
      const res = await equiSelect(this.form);
      res.data.map(item => {
        item.value = item.guid;
        item.label = item.name + "-" + item.plateno;
      });
      this.searchData[0].options = res.data;
    },
    newFix() {
      this.$router.push({ path: "fixDetail" });
    },
    /**
     ** 调令列表
     */
    async getData(param = {}) {
      this.queryParam = param;
      const res = await fixList({ param: this.queryParam });
      this.tableData = res.data.list;
      this.queryParam.pageno = res.data.pageno;
      this.queryParam.pagesize = res.data.pagesize;
      this.queryParam.total = res.data.total;
    },

    /*
     ** 编辑
     */
    async viewAssign(index, row) {
      this.$router.push({ path: "fixDetail", query: { id: row.code } });
    },
    /*
     ** 新增维修人物
     */
    async newFixTask(index, row) {
      this.$router.push({ path: "fixTask", query: { id: row.code } });
    },

    /*
     ** 删除公司
     */
    async deleteCorp(index, row) {
      console.log(row);
      let that = this;
      this.$confirm("删除公司?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let res = corpDelete({ id: row.guid });
         
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          that.getData();
        })
        .catch(err => {});
    },
    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.queryParam.pagesize = val;
      this.$refs.fixSearch.searchHandle();
    },
    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.queryParam.pageno = val;
      this.$refs.fixSearch.searchHandle();
    },

    async getCorp() {
      const res = await corpRank({ id: 3 });
      res.data.map(item => {
        item.label = item.name;
        item.value = item.guid;
      });
      this.searchData[1].options = res.data;
    },

    getDataHandle(val) {
      this.queryParam = val;
    }
  },
  components: {
    // searchBox,
    headTop
  }
};
</script>
<style scoped>
</style>
