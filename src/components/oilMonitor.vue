<template>
  <el-row>
    <el-col :span="4">
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
      <div style="width:100%; height:350px;" ref="chart"></div>
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
          id: "name",
          label: "车牌号码"
        },
        {
          id: "clstype",
          label: "时间"
        },
        {
          id: "class",
          label: "总里程"
        },
        {
          id: "clsrank",
          label: "油量"
        },
        {
          id: "corpname",
          label: "速度"
        },
        {
          id: "deptname",
          label: "状态"
        },
        {
          id: "dept",
          label: "位置"
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
          key: "proid", // 与后端交互时的字段 必填
          label: "项目名称", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: "", // 搜索框 默认值
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "项目1", // 下拉选项 绑定 值
              label: "项目1" // 下拉选项 绑定 名称
            },
            {
              value: "项目2",
              label: "项目2"
            }
          ]
        },
        {
          key: "time",
          label: "近期时间",
          placeholder: "选择近期时间",
          default: "",
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "今天", // 下拉选项 绑定 值
              label: "今天" // 下拉选项 绑定 名称
            },
            {
              value: "昨天",
              label: "昨天"
            },
            {
              value: "近7天",
              label: "近7天"
            },
            {
              value: "近30天",
              label: "近30天"
            }
          ]
        },
        {
          key: "date",
          label: "选择时间",
          placeholder: "请选择",
          default: ""
        }
      ],
      optionWidth: 250,
      vehicleData: []
    };
  },
  beforeCreate() {},
  created() {
    this.equiList();
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    /*
     ** 查看处理
     */
    async equiList() {
      const res = await equiSelect();
      this.vehicleData = res.data;
    },
    initCharts() {
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(this.$refs.chart);
      let option = {
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          right: "20%"
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["蒸发量", "降水量", "平均温度"]
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "蒸发量",
            min: 0,
            max: 250,
            position: "right",
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: "{value} ml"
            }
          },
          {
            type: "value",
            name: "降水量",
            min: 0,
            max: 250,
            position: "right",
            offset: 80,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: "{value} ml"
            }
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            position: "left",
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: "{value} °C"
            }
          }
        ],
        series: [
          {
            name: "蒸发量",
            type: "bar",
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },
          {
            name: "降水量",
            type: "bar",
            yAxisIndex: 1,
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: "平均温度",
            type: "line",
            yAxisIndex: 2,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      };
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
    },

    /*
     ** 查看处理
     */
    assignPlans() {},

    /*
     ** 查看处理
     */
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
