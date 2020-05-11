<template>
  <div class="amap-page-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-table :data="tableData">
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="车辆名称" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="车牌号码" width="100" align="center"></el-table-column>
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
        </div>
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
  </div>
</template>

<script>
import {
  equiSelect //设备列表
} from "@/getData";
export default {
  name: "oilMonitor",
  data() {
    return {
      map: null,
      tableData: [], //设备列表
      websock: null
    };
  },
  components: {},
  computed: {},
  created() {},
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  mounted() {
    this.equiList();
  },
  methods: {
    async equiList() {
      //设备列表
      const res = await equiSelect();
      this.tableData = res.data;
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
          let obj = { position: [data.longitude, data.latitude] };
          this.markers.push(obj);
          this.map.markers(this.markers);
          /* 
            altitude: 12.345                                  // 海拔高度
            curmiles: 12                                      // 当前里程 = 今日里程
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
.carList {
  width: 30%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
.amap-page-container {
  width: 100%;
  height: 100%;
}
.map {
  height: 90vh;
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
