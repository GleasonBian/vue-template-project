<template>
  <div style="padding:30px 30px 0px 30px">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="mgb20" style="height:45vh">
          <div style="width:100%; height:45vh" ref="single"></div>
        </el-card>

        <el-card shadow="hover" style="height:45vh;">
          <div style="width:100%; height:45vh" ref="level"></div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-row class="mgb20">
          <el-card shadow="hover" style="height:45vh;">
            <div style="width:100%; height:45vh" ref="prod"></div>
          </el-card>
        </el-row>
        <el-row class="mgb20">
          <el-card shadow="hover" style="height:45vh;">
            <div style="width:100%; height:45vh" ref="chart"></div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
import {
  allCollect, // 全部
  singleCollect // 单个
} from "@/getData";
// let amapManager = new VueAMap.AMapManager();
export default {
  name: "assignRep",
  data() {
    return {
      markers: [
        {
          position: [112.868357, 36.860426]
        },
        {
          position: [112.870453, 36.862496]
        },
        {
          position: [112.840453, 36.866496]
        },
        {
          position: [112.840423, 36.832496]
        },
        {
          position: [112.8500257, 36.860406]
        },
        {
          position: [112.860237, 36.840376]
        }
      ],

      total: {},
      single: {},
      zoom: 13,
      center: [112.860257, 36.860496],
      events: {
        init(o) {
          let marker = new AMap.Marker([
            {
              position: [112.835406, 36.868778],
              content: "阿斯塔纳"
            },
            {
              position: [112.835406, 36.869778],
              content: "阿斯塔纳"
            },
            {
              position: [112.835406, 36.863778],
              content: "阿斯塔纳"
            }
          ]);
          marker.setMap(o);
        }
      }
    };
  },
  components: {
    // Schart
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  created() {},
  mounted() {
    this.initCharts();
    this.initCharts2();
    this.initCharts3();
    this.singleHandle();
  },
  methods: {
    add() {
      let o = amapManager.getMap();
      let marker = new AMap.Marker({
        position: [121.59996, 31.177646]
      });
      marker.setMap(o);
    },
    async initCharts() {
      const res = await allCollect();

      let amount = [],
        oil = [],
        time = [],
        xAxis = [];

      res.data.forEach(function(element) {
        xAxis.push(element.equipname);
        amount.push(element.totalamout);
        oil.push(element.totaloil);
        time.push(element.totaltime);
      });

      this.total = {
        xAxis: xAxis,
        yAxis: {
          oil,
          amount,
          time
        }
      };

      let myChart = this.$echarts.init(this.$refs.chart);
      myChart.setOption({
        title: {
          text: "油耗产出总览",
          textStyle: {
            // color: "#",
          },
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        legend: {
          data: ["总油量", "总耗时", "总产出"],
          top: "10%" //与上方的距离 可百分比% 可像素px
        },
        xAxis: [
          {
            type: "category",
            data: this.total.xAxis,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "升",
            min: 0,
            interval: 50,
            axisLabel: {
              formatter: "{value} L"
            }
          },
          {
            type: "value",
            name: "小时",
            min: 0,
            interval: 5,
            axisLabel: {
              formatter: "{value} H"
            }
          }
        ],
        series: [
          {
            name: "总油量",
            type: "bar",
            data: this.total.yAxis.oil
          },
          {
            name: "总耗时",
            type: "bar",
            data: this.total.yAxis.time
          },
          {
            name: "总产出",
            type: "line",
            yAxisIndex: 1,
            data: this.total.yAxis.amount
          }
        ]
      });
      window.onresize = function() {
        myChart.resize();
      };
    },
    async singleHandle() {
      let option = {
        title: {
          text: "设备使用率",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["A", "B", "C", "D", "E"]
        },
        series: [
          {
            name: "设备使用率",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 258, name: "A" },
              { value: 176, name: "B" },
              { value: 222, name: "C" },
              { value: 135, name: "D" },
              { value: 375, name: "E" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      let myChart = this.$echarts.init(this.$refs.single);
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    async initCharts2() {
      const res = await allCollect();

      var base = +new Date(2016, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var valueBase = Math.random() * 300;
      var valueBase2 = Math.random() * 50;
      var data = [];
      var data2 = [];

      for (var i = 1; i < 10; i++) {
        var now = new Date((base += oneDay));
        var dayStr = [
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate()
        ].join("-");

        valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
        valueBase <= 0 && (valueBase = Math.random() * 300);
        data.push([dayStr, valueBase]);

        valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
        valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
        data2.push([dayStr, valueBase2]);
      }

      let option = {
        animation: false,
        title: {
          left: "center",
          text: "设备产出"
        },
        legend: {
          top: "bottom",
          data: ["意向"]
        },
        tooltip: {
          triggerOn: "none",
          position: function(pt) {
            return [pt[0], 130];
          }
        },

        xAxis: {
          type: "time",
          // boundaryGap: [0, 0],
          axisPointer: {
            value: "2016-10-7",
            snap: true,
            lineStyle: {
              color: "#004E52",
              opacity: 0.5,
              width: 2
            },
            label: {
              show: true,

              backgroundColor: "#004E52"
            },
            handle: {
              show: true,
              color: "#004E52"
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            inside: true
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            inside: true,
            formatter: "{value}\n"
          },
          z: 10
        },
        grid: {
          top: 40,
          left: 15,
          right: 15,
          height: 160
        },
        dataZoom: [
          {
            type: "inside",
            throttle: 50
          }
        ],
        series: [
          {
            name: "设备A",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            sampling: "average",
            itemStyle: {
              color: "#8ec6ad"
            },
            stack: "a",
            areaStyle: {},
            data: data
          },
          {
            name: "设备B",
            type: "line",
            smooth: true,
            stack: "a",
            symbol: "circle",
            symbolSize: 5,
            sampling: "average",
            itemStyle: {
              color: "#d68262"
            },
            areaStyle: {},
            data: data2
          }
        ]
      };

      let myChart = this.$echarts.init(this.$refs.prod);
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
    },
    async initCharts3() {
      let option = {
        title: {
          text: "计划完成度",
          left: "left"
        },
        angleAxis: {},
        radiusAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四"],
          z: 10
        },
        polar: {},
        series: [
          {
            type: "bar",
            data: [1, 2, 3, 4],
            coordinateSystem: "polar",
            name: "A",
            stack: "a"
          },
          {
            type: "bar",
            data: [2, 4, 6, 8],
            coordinateSystem: "polar",
            name: "B",
            stack: "a"
          },
          {
            type: "bar",
            data: [1, 2, 3, 4],
            coordinateSystem: "polar",
            name: "C",
            stack: "a"
          }
        ],
        legend: {
          show: true,
          data: ["A", "B", "C"]
        }
      };

      let myChart = this.$echarts.init(this.$refs.level);
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
    }
  },
  updated() {}
};
</script>

<style scoped>
/* .el-row {
    margin-bottom: 20px;
} */

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
.amap-demo {
  height: 51vh;
}
</style>
