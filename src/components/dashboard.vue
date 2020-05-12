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
var infoWindow = new AMap.InfoWindow({
  isCustom: true, //使用自定义窗体
  offset: new AMap.Pixel(0, -30)
});
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
      points: [],
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
    markerClick(mark) {
      infoWindow.setContent(mark.content);
      infoWindow.open(this.map, mark.getPosition());
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
    //构建自定义信息窗体
    createInfoWindow(title, content) {
      var info = document.createElement("div");
      info.className = "custom-info input-card content-window-card";
      info.style =
        "position: relative;box-shadow: none;bottom: 0;left: 0;width: auto;padding: 0; box-shadow: 0 0 10px #888888;";
      info.style.width = "300px";
      //可以通过下面的方式修改自定义窗体的宽高
      //info.style.width = "400px";
      // 定义顶部标题
      var top = document.createElement("div");
      var titleD = document.createElement("div");
      var closeX = document.createElement("img");
      closeX.style =
        "position: absolute;top: 10px;right: 10px;transition-duration: 0.25s;";
      top.className = "info-top";
      top.style =
        "position: relative;background: none repeat scroll 0 0 #f9f9f9;border-bottom: 1px solid #ccc;border-radius: 5px 5px 0 0;";
      titleD.innerHTML = title;
      titleD.style = `display: inline-block;color: #333333;font-size: 14px;font-weight: bold;line-height: 31px;padding: 0 10px;`;
      closeX.src = "https://webapi.amap.com/images/close2.gif";
      closeX.addEventListener("click", this.closeInfoWindow);

      top.appendChild(titleD);
      top.appendChild(closeX);
      info.appendChild(top);

      // 定义中部内容
      var middle = document.createElement("div");
      middle.className = "info-middle";
      middle.style = "font-size: 12px;padding: 10px 6px;line-height: 20px;";
      middle.style.backgroundColor = "white";
      middle.innerHTML = content;
      info.appendChild(middle);

      return info;
    },
    closeInfoWindow() {
      this.map.clearInfoWindow();
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
          if (that.marks.length) {
            for (var i = 0; i < that.marks.length; i++) {
              // console.log("i", that.marks.length);
              // console.log(this.marks[i].guid == data.guid);
              if (this.marks[i].guid == data.guid) {
                this.marks[i].position = [data.longitude, data.latitude]; //更新position信息
                break;
              }
              if (
                i == this.marks.length - 1 &&
                this.marks[i].guid != data.guid
              ) {
                //新增点
                let mark = {
                  guid: data.guid,
                  position: [data.longitude, data.latitude]
                };
                this.marks.push(mark);
              }
            }
          } else {
            let mark = {
              guid: data.guid,
              position: [data.longitude, data.latitude]
            };
            this.marks.push(mark);
          }
          console.log(this.marks);
          this.points = [];
          for (var j = 0; j < this.marks.length; j++) {
            //实例化所有点标记
            let point = new AMap.Marker(this.marks[j]);
            // point.content = "guid : " + this.marks[j].guid;
            let title = data.name;
            let content = [];
            content.push(
              "<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='http://tpc.googlesyndication.com/simgad/5843493769827749134'></div>"
            );
            content.push(
              "<div style='padding:5px 10px'>当前里程：" +
                data.curmiles +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>当前油耗：" +
                data.curoilconsume +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>当前油位：" +
                data.curoilpos +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>行驶方向：" +
                data.direction +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>海拔高度：" +
                data.altitude +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>gps 时间：" +
                data.gpstime +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>服务器时间：" +
                data.servertime +
                "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>速 度 ：" + data.speed + "</div>"
            );
            content.push(
              "<div style='padding:5px 10px'>总里程：" + data.总里程 + "</div>"
            );
            point.on("click", function(e) {
              infoWindow.setContent(
                that.createInfoWindow(title, content.join(""))
              );
              infoWindow.open(that.map, e.target.getPosition());
            });
            // point.on("click", this.markerClick(point));
            point.emit("click", { target: point });
            this.points.push(point);
          }

          this.map.add(this.points); //画点
          // that.map.setFitView();
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
.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 12px;
  padding: 10px 6px;
  line-height: 20px;
}

div.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

span {
  margin-left: 5px;
  font-size: 11px;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}
</style>
