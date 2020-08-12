<template>
  <div style="padding:12px">
    <!-- 面包屑 -->
    <!-- <headTop></headTop> -->

    <!-- 搜索框 -->

    <el-card style="margin-bottom:12px">
      <gt-search :data="searchData" @handle="getData" ref="roleSearch"></gt-search>
    </el-card>
    <!-- 列表操作按钮 -->
    <el-card>
      <el-button type="primary" style="margin-bottom:12px" size="mini" @click="newComp">新增</el-button>
      <el-button type="success" size="mini" @click="exportForm">导出</el-button>
      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:viewCorp="viewCorp"
        v-on:deleteCorp="deleteCorp"
        :handle="handle"
        height="70vh"
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
import { corpSelect, rolePage, delRole } from "@/getData";

export default {
  name: "createCorperation",
  data() {
    return {
      searchData: [
        {
          key: "name", // 与后端交互时的字段 必填
          label: "角色名称", // 搜索框名称 必填
          placeholder: "请输入" // 占位符 选填
        },
        {
          key: "corpguid",
          label: "所属公司",
          placeholder: "请选择", // 占位符 选填
          options: []
        },
        {
          key: "date",
          label: "创建时间",
          placeholder: "请选择",
          type: "datetimerange"
        }
      ],
      queryParam: {
        name: "",
        corpguid: "",
        start: "",
        end: "",
        date: "",
        pageno: 1,
        pagesize: 10,
        total: null
      },
      show: true,
      handle: [
        {
          function: "viewCorp",
          text: "查看/编辑",
          type: "text",
          show: true
        },
        {
          function: "deleteCorp",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "name",
          label: "角色名称"
        },
        {
          id: "corpname",
          label: "所属公司"
        },
        {
          id: "deptname",
          label: "所属部门"
        },
        {
          id: "status",
          label: "角色状态"
        },
        {
          id: "CreatedAt",
          label: "创建时间"
        }
      ],
      tableData: null, // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      optionWidth: 250
    };
  },
  beforeCreate() {},
  created() {
    this.getData();
    this.getCompList();
  },
  methods: {
    async getCompList() {
      const res = await corpSelect();
      if (res.data) {
        res.data.map(item => {
          item.label = item.name;
          item.value = item.guid;
        });
        this.searchData[1].options = res.data;
      } else this.$message.warning(res.message);
    },
    async exportForm() {
      window.open(process.env.VUE_APP_URL + "download/8");
    },
    dateChange(val) {
      this.queryParam.start = val[0];
      this.queryParam.end = val[1];
    },
    newComp() {
      this.$router.push({ path: "roleDetail" });
    },
    /**
     ** 公司查询
     */
    async getData(param = {}) {
      this.queryParam = param;
      const res = await rolePage({ param: this.queryParam });
      res.data.list.map(item => {
        item.CreatedAt = new Date(+new Date(item.CreatedAt) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      });
      this.tableData = res.data.list;
      this.queryParam.pagesize = res.data.pagesize;
      this.queryParam.pageno = res.data.pageno;
      this.queryParam.total = res.data.total;
    },

    /*
     ** 创建公司
     */
    async submitAddUser(info) {
      const res = await corperation(this.form);
      if (res.status === 200) {
        this.getData();
        this.$message.success("公司创建成功");
      } else this.$message.warning("公司创建失败");
      this.dialogFormVisible = false;
    },

    /*
     ** 查看公司
     */
    async viewCorp(index, row) {
      this.$router.push({ path: "roleDetail", query: { id: row.guid } });
    },

    /*
     ** 删除公司
     */
    deleteCorp(index, row) {
      console.log(row);
      let that = this;
      this.$confirm("删除角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delRole({ id: row.guid });
         
          if (res.status === 200) {
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
      this.$refs.roleSearch.searchHandle();
    },
    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.queryParam.pageno = val;
      this.$refs.roleSearch.searchHandle();
    },

    /*
     ** 列表 批量删除 用户
     */
    async BatchDeleteUser() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择删除数据!");
        return;
      }
      let data = {
        ids: JSON.stringify(this.multipleSelection)
      };
      let res = await deleteUserByIds(data);
      if (res.result) this.$message.success(res.message);
      else this.$message.warning(res.message);
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     ** 列表 批量删除 用户  预处理
     */
    handleSelectionChange(val) {
      let arr = [];
      for (var item of val) arr.push(item.id);
      this.multipleSelection = arr;
    }
  },
  components: {
    headTop
  }
};
</script>
<style>
</style>
