<template>
  <el-row>
    <el-col :span="4">
      <!-- 公司选择框 -->
      <!-- <el-select v-model="company_name" clearable placeholder="选择公司/项目">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
      <!-- <el-button type="primary" style="margin-left:40px">查询</el-button> -->
      <!-- 车辆状态列表 -->
      <el-table :data="vehicleData" style="width:100%">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="车辆名称" align="center"></el-table-column>
        <el-table-column prop="name" label="车牌号码" align="center"></el-table-column>
        <el-table-column label="车辆状态" width="80" align="center">
          <template slot-scope="scope">
            <div class="carStatus">
              <div
                class="active"
                :class="{'active':scope.row.status==1,'fix':scope.row.status==2,'stop':scope.row.status==3}"
              ></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col align="middle" :span="20">
      <!-- 搜索框 -->
      <gt-search
        :data="searchData"
        @handle="assignPlans"
        size
        style="margin-bottom:24px"
        ref="chart"
      ></gt-search>
      <!-- 列表 -->
      <el-card class="box-card" style="width:98%;margin-bottom: 24px;">
        <div style="width:100%; height:30vh" ref="mapone"></div>
      </el-card>
      <gt-table
        :tableData="tableData"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:checkTasks="checkTasks"
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
  </el-row>
</template>
<script>
import { equiSelect } from "@/getData";
export default {
  name: "oilmonitor",
  data() {
    return {
      handle: [
        {
          function: "checkTasks",
          text: "查看任务",
          type: "text",
          show: true
        },
        {
          function: "UpdatePreprocessing",
          text: "更新计划",
          type: "text",
          show: true
        },
        {
          function: "DeleteHandle",
          text: "删除计划",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "company_name",
          label: "公司名称"
        },
        {
          id: "driver_name",
          label: "司机名称"
        },
        {
          id: "alarm_time",
          label: "告警时间"
        },
        {
          id: "hand_time",
          label: "处理时间"
        },
        {
          id: "handler",
          label: "处理人"
        },
        {
          id: "hand_result",
          label: "处理结果"
        },
        {
          id: "hand_instructions",
          label: "处理说明"
        }
      ],
      tableData: [], // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      multipleSelection: [], // 用于批量 删除
      searchData: [
        // 搜索框 数据
        {
          key: "dri_name", // 与后端交互时的字段 必填
          label: "司机名称", // 搜索框名称 必填
          placeholder: "请输入司机名称", // 占位符 选填
          default: "" // 搜索框 默认值
        },
        {
          key: "handler",
          label: "处理人",
          placeholder: "请输入处理人",
          default: ""
        },
        {
          key: "warning_type", // 与后端交互时的字段 必填
          label: "告警类型", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: "油耗告警", // 搜索框 默认值
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "项目1", // 下拉选项 绑定 值
              label: "油耗告警" // 下拉选项 绑定 名称
            },
            {
              value: "项目2",
              label: "超速告警"
            },
            {
              value: "项目3",
              label: "超区域告警"
            }
          ]
        },
        {
          key: "deptname",
          label: "部门名称",
          placeholder: "请输入部门名称",
          default: ""
        },
        {
          key: "manage_type", // 与后端交互时的字段 必填
          label: "管理类型", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: "公司直管", // 搜索框 默认值
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "项目1", // 下拉选项 绑定 值
              label: "公司直管" // 下拉选项 绑定 名称
            },
            {
              value: "项目2",
              label: "项目自管"
            },
            {
              value: "项目3",
              label: "劳务自带"
            },
            {
              value: "项目4",
              label: "专业租赁"
            }
          ]
        },
        {
          key: "date",
          label: "告警时间",
          placeholder: "请选择",
          default: ""
        }
      ],
      optionWidth: 250,
      vehicleData: [],
      options: [
        {
          value: "十二局",
          label: "十二局"
        }
      ], //公司选择
      company_name: "",
      barOptions: {}
    };
  },
  beforeCreate() {},
  created() {
    this.equiList();
  },
  mounted() {
    // this.initCharts();
    this.mapOneHandle();
  },
  methods: {
    async equiList() {
      const res = await equiSelect();
      this.vehicleData = res.data;
    },

    mapOneHandle() {
      let mapone = this.$echarts.init(this.$refs.mapone);
      let option = {
        color: "#409EFF",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["次数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [
            "5-1",
            "5-2",
            "5-3",
            "5-4",
            "5-5",
            "5-6",
            "5-7",
            "5-8",
            "5-9",
            "5-10",
            "5-11",
            "5-12",
            "5-13",
            "5-14",
            "5-15"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "机车",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data: [32, 30, 31, 33, 39, 33, 32, 27, 29, 35, 24, 12, 22, 34, 15]
          }
        ]
      };

      mapone.setOption(option);

      window.onresize = function() {
        mapone.resize();
      };
    },
    /*
     ** 查看处理
     */
    assignPlans() {},

    /**
     * 查看任务列表
     * **/
    async checkTasks(index, row) {},

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {},

    /*
     ** 更新预处理
     */
    async UpdatePreprocessing(index, row) {},

    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {},

    /*
     ** 删除处理
     */
    async DeleteHandle(index, row) {
      this.$confirm("删除计划?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let res = assignDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          this.assignPlans();
        })
        .catch(err => {});
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
     ** 分页处理
     */
    handleSizeChange(val) {
      let arr = [];
      for (var item of val) arr.push(item.id);
      this.multipleSelection = arr;
    },

    /*
     ** 分页处理2
     */
    handleCurrentChange(val) {
      let arr = [];
      for (var item of val) arr.push(item.id);
      this.multipleSelection = arr;
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
@red: #ff0000;
@green: #66cc66;
@gray: #cccccc;
.carStatus {
  text-align: center;
  div {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
  }
  .active {
    background: @green;
  }
  .fix {
    background: @red;
  }
  .stop {
    background: @gray;
  }
}
</style>
