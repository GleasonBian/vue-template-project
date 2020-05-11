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
      <el-col :span="20">
        <div class="grid-content bg-purple">
          <div class="map" id="track-map"></div>
          <!-- <el-amap
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
          </el-amap>-->
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  equiSelect, //设备列表
  allCollect, // 全部
  singleCollect // 单个
} from "@/getData";
export default {
  name: "dashboard",
  data() {
    return {
      map: null,
      path: [],
      marks: [],
      tableData: [], //设备列表
      markers: [
        {
          position: [112.868357, 36.860426]
        }
      ],
      zoom: 13,
      center: [112.860257, 36.860496],
      total: {},
      single: {},
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
    this.initMap();
    // this.singleHandle();
  },
  methods: {
    initMap() {
      let that = this;
      this.map = new AMap.Map("track-map", {
        zoom: 14, //级别
        center: [112.860257, 36.860496], //中心点坐标
        resizeEnable: true
      });

      // 插件
      AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.GraspRoad"], function() {
        that.map.addControl(new AMap.ToolBar());
        that.map.addControl(new AMap.Scale());
        that.map.addControl(new AMap.GraspRoad());
      });
      this.initWebSocket();
      console.log("map");
      console.log(AMap);
    },
    async equiList() {
      //设备列表
      const res = await equiSelect();
      this.tableData = res.data;
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
        let that = this;
        reader.onload = () => {
          if (reader.result == "Hello WebSockets!") return;
          let data = reader.result;
          data = eval("(" + data + ")");
          console.log("解析->", data);
          //循环现有marks
          for (var i = 0; i < that.marks.length; i++) {
            console.log("i", i);
            // console.log(this.marks[i].guid)
            // if(this.marks[i].guid==data.guid){
            //   this.marks[i].position=[data.longitude, data.latitude]; //更新position信息
            //   return;
            // }
            // if(i==this.marks.length-1 && this.marks[i].guid!=data.guid){//新增点
            //   let mark = new AMap.Marker({
            //     guid: data.guid,
            //     position: [data.longitude, data.latitude]
            //   });
            //   this.marks.push(mark)
            // }
          }
          this.map.add(this.marks); //画点

          // let pathParam = {
          //   x: data.longitude,
          //   y: data.latitude,
          //   sp: data.speed,
          //   ag: data.direction,
          //   tm: Date.parse(data.gpstime)
          // };
          // this.path.push(pathParam);
          // let graspRoad = new AMap.GraspRoad(); //行驶轨迹
          // console.log("graspRoad", graspRoad);
          // graspRoad.driving(this.path, function(error, result) {//行驶轨迹
          //   console.log("result", result);
          //   console.log("err", error);
          //   if (!error) {
          //     var path2 = [];
          //     var newPath = result.data.points;

          //     for (var i = 0; i < newPath.length; i += 1) {
          //       path2.push([newPath[i].x, newPath[i].y]);
          //     }
          //     var newLine = new AMap.Polyline({
          //       path: path2,
          //       strokeWeight: 8,
          //       strokeOpacity: 0.8,
          //       strokeColor: "#0091ea",
          //       showDir: true
          //     });
          //     that.map.add(newLine);
          //     that.map.setFitView();
          //   }
          // });
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
