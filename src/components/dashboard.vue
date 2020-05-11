<template>
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
    <div class="card">
      <el-card class="box-card">
        <div class="clearfix">
          <span>卡片名称</span>
        </div>
        <div class="card_content">
          122,2323
          <span style="font-size:14px; font-weight:none">台</span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="clearfix">
          <span>卡片名称</span>
        </div>
        <div class="card_content">
          122,2323
          <span style="font-size:14px; font-weight:none">台</span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="clearfix">
          <span>卡片名称</span>
        </div>
        <div class="card_content">
          122,2323
          <span style="font-size:14px; font-weight:none">台</span>
        </div>
      </el-card>
    </div>
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
      zoom: 13,
      center: [112.860257, 36.860496],
      amapManager,
      total: {},
      single: {},
      websock: null
    };
  },
  components: {},
  computed: {},
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  mounted() {
    // this.initCharts();
    // this.singleHandle();
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
          /* 
            altitude: 12.345                                  // 海拔高度
            curmiles: 12                                      // 当前里程
            curoilconsume: 5.3                                // 当前油耗
            curoilpos: 9.3                                    // 当前油位
            direction: 12                                     // 行驶方向
            gpstime: "2020-05-10 16:30:30"                    // gps 时间
            guid: "e7d52b53-2307-4b09-aec8-f61d6cea6cf5"      // guid
            latitude: 36.840376                               // 纬度
            longitude: 112.860237                             // 经度
            name: "机车一号"                                   // 机车名称
            servertime: "2020-05-10 16:30:30"                 // 服务器时间
            speed: 60                                         // 速度
            totalmiles: 138                                   // 总里程
          */
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
.amap-page-container {
  width: 100%;
  height: 100%;
}
.amap-demo {
  height: 93vh;
}
.card {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 100;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix {
  border-bottom: 1px solid #00000054;
}
.clearfix:after {
  clear: both;
}
.card_content {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
}
.box-card {
  width: 300px;
  margin-bottom: 20px;
}
</style>
