<template>
  <div style="padding:30px 30px 0px 30px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:29.5vh">
          <div style="width:100%; height:28vh" ref="chart"></div>
        </el-card>
        <el-card shadow="hover" class="mgb20" style="height:30vh;">
          <div slot="header" class="clearfix">
            <span>语言详情</span>
          </div>Vue
          <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
          <el-progress :percentage="13.7"></el-progress>HTML
          <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
        </el-card>
        <el-card shadow="hover" style="height:30vh;">
          <div slot="header" class="clearfix">
            <span>语言详情</span>
          </div>Vue
          <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
          <el-progress :percentage="13.7"></el-progress>HTML
          <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">5000</div>
                  <div>数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover">
          <div class="amap-page-container">
            <el-amap
              vid="amapDemo"
              :center="center"
              :amap-manager="amapManager"
              :zoom="zoom"
              :events="events"
              class="amap-demo"
            ></el-amap>
            <div class="toolbar">
              <button @click="add()">add marker</button>
            </div>
          </div>
        </el-card>
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
let amapManager = new VueAMap.AMapManager();
export default {
  name: "dashboard",
  data() {
    return {
      todoList: [
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: true
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: true
        }
      ],
      data: [
        {
          name: "2018/09/04",
          value: 1083
        },
        {
          name: "2018/09/05",
          value: 941
        },
        {
          name: "2018/09/06",
          value: 1139
        },
        {
          name: "2018/09/07",
          value: 816
        },
        {
          name: "2018/09/08",
          value: 327
        },
        {
          name: "2018/09/09",
          value: 228
        },
        {
          name: "2018/09/10",
          value: 1065
        }
      ],
      options: {
        type: "bar",
        title: {
          text: "最近一周各品类销售图"
        },
        xRorate: 25,
        labels: ["周一", "周二", "周三", "周四", "周五"],
        datasets: [
          {
            label: "家电",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "百货",
            data: [164, 178, 190, 135, 160]
          },
          {
            label: "食品",
            data: [144, 198, 150, 235, 120]
          }
        ]
      },
      options2: {
        type: "line",
        title: {
          text: "最近几个月各品类销售趋势图"
        },
        labels: ["6月", "7月", "8月", "9月", "10月"],
        datasets: [
          {
            label: "家电",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "百货",
            data: [164, 178, 150, 135, 160]
          },
          {
            label: "食品",
            data: [74, 118, 200, 235, 90]
          }
        ]
      },
      total: {},
      zoom: 12,
      center: [121.59996, 31.197646],
      amapManager,
      events: {
        init(o) {
          let marker = new AMap.Marker({
            position: [121.59996, 31.197646]
          });

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
  mounted() {
    // this.allCollectHandle();
    this.initCharts();
  },
  methods: {
    async allCollectHandle() {
      const res = await allCollect();
      console.log(res.data);
      let amount = [],
        oil = [],
        time = [],
        xAxis = [];

      console.log(res.data);
      res.data.forEach(function(element) {
        // 工作时长

        xAxis.push(element.equipname);
        amount.push(element.totalamout);
        oil.push(element.totaloil);
        time.push(element.totaltime);
        // one.yAxis.push(Number(element.totalamount));
        // // 小时油耗
        // three.xAxis.push(element.设备名称);
        // three.yAxis.push(Number(element.小时油耗));
        // // 加油油量
        // six.xAxis.push(element.设备名称);
        // six.yAxis.push(Number(element.加油油量));
        // // 公里油耗
        // four.xAxis.push(element.设备名称);
        // four.yAxis.push(Number(element.公里油耗));
        // // 累计油耗
        // seven.xAxis.push(element.设备名称);
        // seven.yAxis.push(Number(element.累计油耗));
        // // 上月剩油
        // five.xAxis.push(element.设备名称);
        // five.yAxis.push(Number(element.上次剩油));
        // // 本月剩油
        // eight.xAxis.push(element.设备名称);
        // eight.yAxis.push(parseFloat(element.本次剩油));
      });
      this.total = {
        xAxis: xAxis,
        yAxis: {
          oil,
          amount,
          time
        }
      };
    },
    add() {
      let o = amapManager.getMap();
      let marker = new AMap.Marker({
        position: [121.59996, 31.177646]
      });

      marker.setMap(o);
    },
    async initCharts() {
      const res = await allCollect();
      console.log(res.data);
      let amount = [],
        oil = [],
        time = [],
        xAxis = [];

      console.log(res.data);
      res.data.forEach(function(element) {
        // 工作时长

        xAxis.push(element.equipname);
        amount.push(element.totalamout);
        oil.push(element.totaloil);
        time.push(element.totaltime);
        // one.yAxis.push(Number(element.totalamount));
        // // 小时油耗
        // three.xAxis.push(element.设备名称);
        // three.yAxis.push(Number(element.小时油耗));
        // // 加油油量
        // six.xAxis.push(element.设备名称);
        // six.yAxis.push(Number(element.加油油量));
        // // 公里油耗
        // four.xAxis.push(element.设备名称);
        // four.yAxis.push(Number(element.公里油耗));
        // // 累计油耗
        // seven.xAxis.push(element.设备名称);
        // seven.yAxis.push(Number(element.累计油耗));
        // // 上月剩油
        // five.xAxis.push(element.设备名称);
        // five.yAxis.push(Number(element.上次剩油));
        // // 本月剩油
        // eight.xAxis.push(element.设备名称);
        // eight.yAxis.push(parseFloat(element.本次剩油));
      });
      this.total = {
        xAxis: xAxis,
        yAxis: {
          oil,
          amount,
          time
        }
      };
      console.log(this.total)
      let myChart = this.$echarts.init(this.$refs.chart); // 绘制图表
      myChart.setOption({
        title: {
          text: "柴油油耗",
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
          data: ["蒸发量", "降水量", "平均温度"],
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
            name: "水量",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} ml"
            }
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value} °C"
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
            name: "总量",
            type: "line",
            yAxisIndex: 1,
            data: this.total.yAxis.amount
          }
        ]
      });
    },
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() +
          1}/${date.getDate()}`;
      });
    }
    // handleListener() {
    //     bus.$on('collapse', this.handleBus);
    //     // 调用renderChart方法对图表进行重新渲染
    //     window.addEventListener('resize', this.renderChart);
    // },
    // handleBus(msg) {
    //     setTimeout(() => {
    //         this.renderChart();
    //     }, 200);
    // },
    // renderChart() {
    //     this.$refs.bar.renderChart();
    //     this.$refs.line.renderChart();
    // }
  }
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
  height: 75vh;
}
</style>
