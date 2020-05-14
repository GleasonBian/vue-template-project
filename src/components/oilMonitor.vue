<template>
  <el-row>
    <el-col :span="4">
      <el-table :data="vehicleData" @row-click="clickRow" style="width:100%" size="mini">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="车辆名称" align="center"></el-table-column>
        <el-table-column prop="plateno" label="车牌号码" align="center" width="120"></el-table-column>
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
      <gt-search :data="searchData" @handle="searchHandle" size style="margin-bottom:24px;"></gt-search>
      <!-- 列表 -->
      <div style="width:100%; height:350px;" ref="chart"></div>
      <gt-table
        :tableData="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
      ></gt-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin:20px"
      ></el-pagination>
    </el-col>
  </el-row>
</template>
<script>
import { equiSelect, oilView } from "@/getData";
console.log(equiSelect, oilView);
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
          label: "车牌号码"
        },
        {
          id: "gpstime",
          label: "gps时间"
        },
        {
          id: "curmiles",
          label: "当前里程"
        },
        {
          id: "totalmiles",
          label: "总里程"
        },
        {
          id: "curoilconsume",
          label: "当前油耗"
        },
        {
          id: "totaloilconsume",
          label: "总油耗"
        },
        {
          id: "oiladded",
          label: "加油油量"
        },
        {
          id: "oilleft",
          label: "剩余油量"
        },
        {
          id: "speed",
          label: "速度"
        }
      ],
      tableData: [], // 表格数据
      pagesize: 10,
      total: 0,
      currentPage: 1,
      multipleSelection: [], // 用于批量 删除
      searchData: [
        // 搜索框 数据
        {
          key: "guid", // 与后端交互时的字段 必填
          label: "设备名称", // 搜索框名称 必填
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
              value: "近3天",
              label: "近3天"
            },
            {
              value: "近7天",
              label: "近7天"
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
  created() {
    this.equiList();
  },
  methods: {
    /*
     ** 搜索处理
     */
    searchHandle(row) {
      if (row.time !== "") {
        row = JSON.parse(JSON.stringify(row));
        switch (row.time) {
          case "今天":
            row.start = this.timeForMat(0)[0];
            row.end = this.timeForMat(0)[1];
            break;
          case "昨天":
            row.start = this.timeForMat(1)[0];
            row.end = this.timeForMat(1)[1];
            break;
          case "近3天":
            row.start = this.timeForMat(3)[0];
            row.end = this.timeForMat(3)[1];
            break;
          case "近7天":
            row.start = this.timeForMat(7)[0];
            row.end = this.timeForMat(7)[1];
            break;
        }
      }
      this.oilViewHandle(row);
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
     ** 油耗监测数据
     */
    async oilViewHandle(param) {
      if (param.guid === "") {
        this.$message.warning("请选择设备");
        return;
      }
      let canshu = "";
      if (param instanceof Object) {
        if ("start" in param && "end" in param) {
          canshu =
            param.guid + "/oilcs?start=" + param.start + "&end=" + param.end;
        } else canshu = param.guid + "/oilcs";
      } else {
        canshu = param + "/oilcs";
      }
      const res = await oilView({ id: canshu });
      if (res.status === 200) {
        let gpstime = [], // 时间
          curmiles = [], // 里程
          curoilconsume = [], // 油耗
          speed = [], //速度
          totaloilconsume = []; // 总油耗
        this.total = res.data.length;
        for (var i in res.data) {
          res.data[i].oilleft = res.data[i].oilleft.toFixed(2);
          res.data[i].curoilconsume = res.data[i].curoilconsume.toFixed(2);
          res.data[i].totaloilconsume = res.data[i].totaloilconsume.toFixed(2);
          gpstime.push(res.data[i].gpstime);
          curmiles.push(res.data[i].curmiles);
          curoilconsume.push(res.data[i].curoilconsume);
          speed.push(res.data[i].speed);
          totaloilconsume.push(res.data[i].totaloilconsume);
        }
        this.tableData = res.data;
        this.initCharts(
          gpstime,
          curmiles,
          curoilconsume,
          speed,
          totaloilconsume
        );
      }
    },

    /*
     ** 单机行处理
     */
    async clickRow(row) {
      console.log(row);
      this.oilViewHandle(row.guid);
      // this.searchData[0].options
    },

    /*
     ** 初始化 echert
     */
    initCharts(gpstime, curmiles, curoilconsume, speed, totaloilconsume) {
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(this.$refs.chart);
      let option = {
        title: {
          text: "油耗统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["总油耗", "油耗", "里程", "速度"]
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            }, //区域缩放，区域缩放还原
            dataView: {
              readOnly: false
            }, //数据视图
            magicType: {
              type: ["line", "bar"]
            }, //切换为折线图，切换为柱状图
            restore: {}, //还原
            saveAsImage: {} //保存为图片
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            top: 20,
            start: 10,
            end: 90 //初始化滚动条
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: gpstime
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "总油耗",
            type: "line",
            stack: "总量",
            data: totaloilconsume
          },
          {
            name: "油耗",
            type: "line",
            stack: "总量",
            data: curoilconsume
          },
          {
            name: "里程",
            type: "line",
            stack: "总量",
            data: curmiles
          },
          {
            name: "速度",
            type: "line",
            stack: "总量",
            data: speed
          }
        ]
      };
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.pagesize = val;
    },

    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    /**
     * 日期处理
     */
    timeForMat(count) {
      // 拼接时间
      const time1 = new Date();
      const time2 = new Date();
      if (count === 1) {
        time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
      } else {
        if (count >= 0) {
          time1.setTime(time1.getTime());
        } else {
          if (count === -2) {
            time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000 * 2);
          } else {
            time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000);
          }
        }
      }

      const Y1 = time1.getFullYear();
      const M1 =
        time1.getMonth() + 1 > 9
          ? time1.getMonth() + 1
          : "0" + (time1.getMonth() + 1);
      const D1 = time1.getDate() > 9 ? time1.getDate() : "0" + time1.getDate();
      const timer1 = Y1 + "-" + M1 + "-" + D1 + "23:59:59"; // 当前时间

      time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
      const Y2 = time2.getFullYear();
      const M2 =
        time2.getMonth() + 1 > 9
          ? time2.getMonth() + 1
          : "0" + (time2.getMonth() + 1);
      const D2 = time2.getDate() > 9 ? time2.getDate() : "0" + time2.getDate();
      const timer2 = Y2 + "-" + M2 + "-" + D2 + "00:00:00"; // 之前的7天或者30天
      return [timer2, timer1];
    }
  }
};
</script>
<style lang="less" scoped>
@red: #ff0000;
@green: #66cc66;
@gray: #cccccc;
.carStatus {
  text-align: center;
  div {
    width: 14px;
    height: 14px;
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
