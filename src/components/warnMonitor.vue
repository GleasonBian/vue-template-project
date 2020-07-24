<template>
  <div style="padding:12px">
    <el-row :gutter="10">
      <el-col :span="5" align="center">
        <el-card>
          <el-table
            :data="vehicleData"
            @row-click="clickRow"
            highlight-current-row
            size="mini"
            ref="singleTable"
            style="width:100%"
            border
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="plateno" label="号码"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col align="middle" :span="19">
        <!-- 搜索框 -->
        <el-card>
          <gt-search :data="searchData" @handle="oilViewHandle"></gt-search>
        </el-card>
        <!-- 列表 -->
        <el-card style="margin-top:12px">
          <div style="width:100%; height:350px;float:left" ref="chart"></div>
        </el-card>
        <el-card style="margin-top:12px">
          <gt-table
            :tableData="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
            style="width: 100%"
            :optionWidth="optionWidth"
            :columns="columns"
            :selection="false"
            v-on:checkTasks="checkTasks"
            v-on:DeleteHandle="DeleteHandle"
            v-on:UpdatePreprocessing="UpdatePreprocessing"
            :handle="handle"
            size="mini"
          ></gt-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin:20px"
          ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { equiSelect, oilView, alarm } from "@/getData";
export default {
  name: "oilmonitor",
  data() {
    return {
      handle: [
        // {
        //   function: "checkTasks",
        //   text: "查看任务",
        //   type: "text",
        //   show: true
        // },
        // {
        //   function: "UpdatePreprocessing",
        //   text: "更新计划",
        //   type: "text",
        //   show: true
        // },
        // {
        //   function: "DeleteHandle",
        //   text: "删除计划",
        //   type: "text",
        //   show: true
        // }
      ],
      columns: [
        {
          id: "name",
          label: "车辆名称"
        },
        {
          id: "duty_name",
          label: "责任人"
        },
        {
          id: "class_type",
          label: "告警类型"
        },
        {
          id: "alarm_name",
          label: "告警内容"
        },
        {
          id: "class_rank",
          label: "告警等级"
        },
        {
          id: "occur_time",
          label: "告警时间"
        },
        {
          id: "handle_time",
          label: "处理时间"
        },
        {
          id: "handle_name",
          label: "处理人"
        },
        {
          id: "handle_result",
          label: "处理结果"
        },
        {
          id: "remark",
          label: "处理说明"
        }
      ],
      tableData: [], // 表格数据
      total: 0,
      currentPage: 1,
      pagesize: 10,
      multipleSelection: [], // 用于批量 删除
      searchData: [
        // 搜索框 数据
        {
          key: "guid", // 与后端交互时的字段 必填
          label: "车牌号", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          default: "", // 搜索框 默认值
          options: [
            {
              value: "项目1", // 下拉选项 绑定 值
              label: "项目1" // 下拉选项 绑定 名称
            }
          ]
        },
        {
          key: "type",
          label: "告警类型",
          placeholder: "选择告警类型",
          default: "",
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "1", // 下拉选项 绑定 值
              label: "超速告警" // 下拉选项 绑定 名称
            },
            {
              value: "2",
              label: "油耗告警"
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
     ** 获取当天日期
     */
    getDays() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      // var dates = date.toLocaleDateString();
      var dates2 = year + "-" + month + "-" + day;
      return dates2;
    },
    /*
     ** 获取两个时间之间的天数数组
     */
    getAllDate(day1, day2) {
      var getDate = function(str) {
        var tempDate = new Date();
        var list = str.split("-");
        tempDate.setFullYear(list[0]);
        tempDate.setMonth(list[1] - 1);
        tempDate.setDate(list[2]);
        return tempDate;
      };
      var date1 = getDate(day1);
      var date2 = getDate(day2);
      if (date1 > date2) {
        var tempDate = date1;
        date1 = date2;
        date2 = tempDate;
      }
      date1.setDate(date1.getDate() + 1);
      var dateArr = [];
      var i = 0;
      while (
        !(
          date1.getFullYear() == date2.getFullYear() &&
          date1.getMonth() == date2.getMonth() &&
          date1.getDate() == date2.getDate()
        )
      ) {
        var dayStr = date1.getDate().toString();
        if (dayStr.length == 1) {
          dayStr = "0" + dayStr;
        }
        var monthStr =
          date1.getMonth() + 1 < 10
            ? "0" + (date1.getMonth() + 1)
            : date1.getMonth() + 1;
        dateArr[i] = date1.getFullYear() + "-" + monthStr + "-" + dayStr;
        i++;
        date1.setDate(date1.getDate() + 1);
      }
      dateArr.splice(0, 0, day1);
      dateArr.push(day2);
      return dateArr;
    },
    /*
     ** 获取两个时间之间的天数差
     */
    getDaysBetween(dateString1, dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return Math.floor(days);
    },

    /*
     ** 设备列表
     */
    async equiList() {
      const res = await equiSelect();
      res.data.map(item => {
        item.value = item.guid;
        item.label = item.plateno;
      });
      this.vehicleData = res.data;
      this.searchData[0].options = res.data;
    },

    /*
     ** 告警监测数据
     */
    async oilViewHandle(param) {
      console.log(param.start);
      if (param.guid === "") {
        this.$message.warning("请选择设备");
        return;
      }
      let canshu2 = "";
      let xdays = [];
      let startDay = this.getDays();
      let endDay = "";
      if (param instanceof Object) {
        if ("start" in param && "end" in param) {
          startDay = param.start.substr(0, 10);
          endDay = param.end.substr(0, 10);
          canshu2 =
            param.guid +
            "/alarm?start=" +
            param.start +
            "&end=" +
            param.end +
            "&type=" +
            param.type;
          var s = this.getAllDate(startDay, endDay);
          console.log(s);
          xdays.push(...s);
        } else {
          canshu2 = param.guid + "/alarm?type=" + param.type;
          let dates = this.getDays();
          xdays.push(dates);
        }
      } else {
        let dates = this.getDays();
        xdays.push(dates);
        canshu2 = param + "/alarm?type=" + param.type;
      }

      const alermRes = await oilView({ id: canshu2 });
      this.total = alermRes.data.length;

      if (alermRes.status === 200) {
        let alarmSpeedNum = [];
        let alarmOilNum = [];
        this.tableData = alermRes.data;
        let dataLength = alermRes.data.length;
        let xdayArr = alermRes.data;
        for (var k = 0; k < dataLength; k++) {
          let diffDays = this.getDaysBetween(startDay, xdayArr[k].occur_time);
          if (xdayArr[k].class_type == "超速报警") {
            if (alarmSpeedNum[diffDays] == undefined) {
              alarmSpeedNum[diffDays] = 1;
            } else {
              alarmSpeedNum[diffDays]++;
            }
          }
          if (xdayArr[k].class_type == "油耗报警") {
            if (alarmOilNum[diffDays] == undefined) {
              alarmOilNum[diffDays] = 1;
            } else {
              alarmOilNum[diffDays]++;
            }
          }
        }
        this.initCharts(xdays, alarmSpeedNum, alarmOilNum);
      }
    },

    /*
     ** 单机行处理
     */
    async clickRow(row) {
      this.oilViewHandle(row.guid);
      // this.searchData[0].options
    },
    initCharts(xdays, alarmSpeedNum, alarmOilNum) {
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(this.$refs.chart);
      let option = {
        title: {
          left: "center",
          text: "告警统计"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          }
        },
        legend: {
          align: "left",
          data: ["超速告警", "油耗告警"],
          verticalAlign: "top", //垂直方向位置
          x: 100, //距离x轴的距离
          y: 0 //距离Y轴的距离
        },
        toolbox: {
          show: true,
          // orient: "horizontal",
          // right: "50",
          feature: {
            magicType: {
              type: ["line", "bar"],
              show: true
            },
            dataZoom: {
              show: true
            },
            dataView: {
              show: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        calculable: true,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            top: 30,
            start: 10,
            end: 90,
            height: 20 //初始化滚动条
          }
        ],
        xAxis: {
          type: "category",
          axisTick: { show: false },
          boundaryGap: false,
          data: xdays
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "超速告警",
            type: "bar",
            stack: "超速告警计数",
            data: alarmSpeedNum,
            label: {
              show: true, // 开启显示
              rotate: 0, // 旋转0度
              position: "top", // 在上方显示
              distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "black",
                fontSize: 16
              }
            }
          },
          {
            name: "油耗告警",
            type: "bar",
            stack: "油耗告警计数",
            data: alarmOilNum,
            label: {
              show: true, // 开启显示
              rotate: 0, // 旋转0度
              position: "top", // 在上方显示
              distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "black",
                fontSize: 16
              }
            }
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
          this.searchHandle();
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
      this.pagesize = val;
    },

    /*
     ** 分页处理2
     */
    handleCurrentChange(val) {
      this.currentPage = val;
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
  text-align: left;
  div {
    width: 6px;
    height: 6px;
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
