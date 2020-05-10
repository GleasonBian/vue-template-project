<template>
  <div style="padding:30px 30px 0px 30px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:29.5vh">
          <div style="width:100%; height:28vh" ref="chart"></div>
        </el-card>
        <el-card shadow="hover" class="mgb20" style="height:30vh;">
          <div slot="header" class="clearfix">
            <span>成本统计</span>
          </div>油耗
          <el-progress :percentage="71.3" color="#42b983"></el-progress>设备
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>人工
          <el-progress :percentage="13.7"></el-progress>维护
          <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
        </el-card>
        <el-card shadow="hover" style="height:30vh;">
          <div style="width:100%; height:28vh" ref="single"></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">4辆</div>
                  <div>越野车</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">7台</div>
                  <div>火车头</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">312人</div>
                  <div>员工</div>
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
              :resizeEnable="true"
              class="amap-demo"
            >
              <el-amap-marker
                v-for="marker in markers"
                :key="marker.mapName"
                :position="marker.position"
                :visible="true"
                :draggable="false"
              ></el-amap-marker>
            </el-amap>
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
      markers: [
        {
          position: [112.868357, 36.860426]
        }
      ],

      total: {},
      single: {},
      zoom: 13,
      center: [112.860257, 36.860496],
      amapManager,
      path: "wss://echo.websocket.org",
      websock: null
    };
  },
  components: {
    // Schart
  },
  computed: {},
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  mounted() {
    this.initCharts();
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
      const res = await singleCollect();

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

      let myChart = this.$echarts.init(this.$refs.single);

      let option = {
        tooltip: {
          formatter: "{c}{b}"
        },
        title: {
          text: "车速",
          left: "left"
        },
        series: [
          {
            name: "车速",
            type: "gauge",
            detail: {
              formatter: "{value}",
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 12
              }
            },
            data: [{ value: 50, name: "km/h" }]
          }
        ]
      };
      setInterval(function() {
        option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        myChart.setOption(option, true);
      }, 2000);
      window.onresize = function() {
        myChart.resize();
      };
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://192.168.3.210:8090/ws/leffss";
      // 建立连接
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(event) {
      //数据接收
      if (event.data instanceof Blob) {
        let reader = new FileReader();

        reader.onload = () => {
          if (reader.result == "Hello WebSockets!") return;
          let data = reader.result;
          data = eval("(" + data + ")");
          console.log("解析->", data);
          this.center = [data.longitude, data.latitude];
          this.markers[0].position = [data.longitude, data.latitude];
        };

        reader.readAsText(event.data);
      } else {
        console.log("Result2: " + event.data);
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      this.websocketsend("Hello WebSockets!");
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
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
  height: 75vh;
}
</style>
