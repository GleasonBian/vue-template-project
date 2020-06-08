<template>
  <div>
    <!-- 面包屑 -->
    <!-- <headTop></headTop> -->

    <!-- 搜索框 -->
    <!-- <gt-search :data="searchData" @handle="getDataHandle" size></gt-search> -->
    <el-row :gutter="20" class="searchBox">
      <el-form
        :model="queryParam"
        status-icon
        ref="form"
        label-width="auto"
        style="width:100%"
        lable-width="120px"
      >
        <el-col :span="8">
          <el-form-item label="车辆名称" prop="equip">
            <el-select v-model="queryParam.equip" clearable placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in eqData"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="proj_deptid">
            <el-select
              v-model="queryParam.proj_deptid"
              clearable
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in corpData"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接班时间" prop="date">
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
      </el-form>
    </el-row>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:1%;">
      <el-button type="primary" style="margin-left:1%" size="medium" @click="newFix">新增</el-button>
      <el-button type="success" size="medium" @click="exportForm">导出</el-button>
      <el-button
        type="primary"
        style="float:right;margin-right:1%"
        size="medium"
        @click="getData"
      >查询</el-button>
    </el-col>

    <!-- 内部用户列表 -->
    <el-col align="middle">
      <gt-table
        :tableData="tableData"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:viewAssign="viewAssign"
        v-on:newFixTask="newFixTask"
        :handle="handle"
      ></gt-table>
      <!-- v-on:selection-change="handleSelectionChange" -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page_index"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryParam.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParam.total_count"
      ></el-pagination>
    </el-col>
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
      queryParam: {
        page_index: 1,
        page_size: 1
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
      this.eqData = res.data;
    },
    newFix() {
      this.$router.push({ path: "fixDetail" });
    },
    /**
     ** 调令列表
     */
    async getData(val) {
      const res = await fixList({ param: this.queryParam });
      this.tableData = res.data.fixplandetail;
      this.queryParam.page_index = res.data.page_index;
      this.queryParam.page_size = res.data.page_size;
      this.queryParam.total_count = res.data.total_count;
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
          console.log(res);
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
      this.queryParam.page_size = val;
      this.getData();
    },
    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.queryParam.page_index = val;
      this.getData();
    },

    async getCorp() {
      const res = await corpRank({id:3});
      this.corpData = res.data;
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
.searchBox {
  padding: 15px 20px;
}
</style>
