<template>
  <div style="padding:12px">
    <!-- 搜索框 -->
    <el-card>
      <el-form
        :model="queryParam"
        status-icon
        ref="form"
        label-width="auto"
        style="width:100%"
        lable-width="120px"
      >
        <el-row :gutter="20" class="searchBox">
          <el-col :span="6" align="center">
            <el-form-item label="部门名称" prop="name">
              <el-input clearable v-model="queryParam.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="center">
            <el-form-item label="所属公司" prop="corpguid">
              <el-select
                clearable
                v-model="queryParam.corpguid"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in compList"
                  :key="item.guid"
                  :value="item.guid"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="center">
            <el-form-item label="注册时间" prop="date">
              <el-date-picker
                clearable
                v-model="queryParam.date"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width:100%; margin-right:15px"
                @change="dateChange(queryParam.date)"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="center">
            <el-button type="primary" size="mini" @click="getData" style="width:36%">查询</el-button>
            <el-button style="width:36%" @click="resetHandle">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:12px">
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
        size="mini"
      ></gt-table>

      <el-pagination
        style="margin-top:12px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pageno"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParam.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
// import selArea from "@/common/gtArea";
import {
  corperation,
  corpSelect,
  corpDtails,
  corpUpdate,
  deptPage,
  delDept
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
  data() {
    return {
      compList: [],
      queryParam: {
        name: "",
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
          label: "部门名称"
        },
        {
          id: "shortname",
          label: "部门简称"
        },
        {
          id: "superiorname",
          label: "上级部门"
        },
        {
          id: "corp_name",
          label: "所属公司"
        },
        {
          id: "status",
          label: "部门状态"
        },
        {
          id: "CreatedAt",
          label: "注册时间"
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
        this.compList = res.data;
      } else this.$message.warning(res.message);
    },
    async exportForm() {
      window.open(process.env.VUE_APP_URL + "download/6");
    },
    dateChange(val) {
      this.queryParam.start = val[0];
      this.queryParam.end = val[1];
    },
    newComp() {
      this.$router.push({ path: "deptDetail" });
    },
    /**
     ** 公司查询
     */
    async getData() {
      const res = await deptPage({ param: this.queryParam });
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
      this.$router.push({ path: "deptDetail", query: { id: row.guid } });
    },

    /*
     ** 删除公司
     */
    deleteCorp(index, row) {
      console.log(row);
      let that = this;
      this.$confirm("删除部门?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delDept({ id: row.guid });
         
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
      this.getData();
    },
    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.queryParam.pageno = val;
      this.getData();
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
    },

    /*
     ** 重置
     */
    resetHandle(val) {
      this.queryParam = {
        name: "",
        start: "",
        end: "",
        date: "",
        pageno: 1,
        pagesize: 10,
        total: null
      };
      this.getData();
    }
  },
  components: {
    headTop
  }
};
</script>
<style scoped>
.el-form-item {
  margin-bottom: 0px;
}
</style>
