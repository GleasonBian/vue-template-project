<template>
  <div class="pd15">
    <!-- 面包屑 -->
    <!-- <headTop></headTop> -->

    <!-- 搜索框 -->
    <!-- <gt-search :data="searchData" @handle="getDataHandle" size></gt-search> -->

    <el-card style="margin-bottom:12px">
      <gt-search :data="searchData" @handle="getData" ref="assignSearch"></gt-search>
    </el-card>

    <!-- 列表操作按钮 -->
    <el-card>
      <el-button type="primary" size="mini" @click="newAssign" style="margin-bottom:12px">新增</el-button>
      <el-button type="primary" size="mini" @click="singleOil">单机油耗核算</el-button>
      <el-button type="success" size="mini" @click="downAss">导出</el-button>

      <!-- 内部用户列表 -->

      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:viewAssign="viewAssign"
        v-on:deleteAssign="deleteAssign"
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
import { corpRank, equiSelect, assigndeSelect, assignDelete } from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
  data() {
    return {
      queryParam: {
        equip_guid: "",
        start: "",
        end: "",
        corp_guid: "",
        pageno: 1,
        pagesize: 10
      },
      searchData: [
        {
          key: "equip_guid", // 与后端交互时的字段 必填
          label: "车辆", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          options: []
        },
        {
          key: "corpguid",
          label: "项目名称",
          placeholder: "请选择", // 占位符 选填
          options: []
        },
        {
          key: "date",
          label: "接班时间",
          placeholder: "请选择",
          type: "datetimerange"
        }
      ],
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
          function: "deleteAssign",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "code",
          label: "调令编号"
        },
        {
          id: "equipname",
          label: "车辆名称"
        },
        {
          id: "plat_no",
          label: "车牌号码"
        },
        {
          id: "project_name",
          label: "项目名称"
        },
        {
          id: "accum_working",
          label: "作业时长"
        },
        {
          id: "factstart",
          label: "接班时间"
        },
        {
          id: "factstop",
          label: "交班时间"
        },
        {
          id: "driver_name",
          label: "值乘司机"
        }
      ],
      tableData: null, // 表格数据
      optionWidth: 250
    };
  },
  created() {
    this.getData();
    this.getEqList();
    this.getCorp();
  },
  methods: {
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
    newAssign() {
      this.$router.push({ path: "assignDetail" });
    },
    /**
     ** 调令列表
     */
    async getData(param = {}) {
      this.queryParam = param;
      const res = await assigndeSelect({ param: this.queryParam });
      this.tableData = res.data.list;
      this.queryParam.total = res.data.total;
      this.queryParam.pageno = res.data.pageno;
      this.queryParam.pagesize = res.data.pagesize;
    },

    /*
     ** 编辑
     */
    async viewAssign(index, row) {
      this.$router.push({ path: "assignDetail", query: { id: row.code } });
    },
    /*
     ** 单机油耗核算
     */
    async singleOil() {
      if (
        !(
          this.queryParam.equip_guid &&
          this.queryParam.start &&
          this.queryParam.end
        )
      ) {
        this.$message({
          type: "warning",
          message: "请先进行条件搜索"
        });
        return;
      } else {
        this.$router.push({
          path: "singleOil",
          query: {
            equip_guid: this.queryParam.equip_guid,
            start: this.queryParam.start,
            end: this.queryParam.end
          }
        });
      }
    },

    /*
     ** 删除公司
     */
    deleteAssign(index, row) {
      console.log(row);
      let that = this;
      this.$confirm("删除调令?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await assignDelete({ id: row.code });
          if (res.status == 200) {
            this.$message.success("删除成功");
            that.getData();
          }
        })
        .catch(err => {});
    },
    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.queryParam.pagesize = val;
      this.$refs.assignSearch.searchHandle();
    },
    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.queryParam.pageno = val;
      this.$refs.assignSearch.searchHandle();
    },

    async getCorp() {
      const res = await corpRank({ id: 3 });
      res.data.map(item => {
        item.label = item.name;
        item.value = item.guid;
      });
      this.searchData[1].options = res.data;
    },
    downAss() {
      window.open(process.env.VUE_APP_URL + "download/2");
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
.pd15 {
  padding: 15px;
}
</style>
