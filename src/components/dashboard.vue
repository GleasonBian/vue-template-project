<template>
  <div class="amap-page-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-table
            :data="tableData"
            @row-click="clickMarker"
            ref="singleATable"
            highlight-current-row
            style="width:100%;"
            size="mini"
          >
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="name" label="车辆名称" align="center" width="95"></el-table-column>
            <el-table-column prop="platenum" label="车牌号码" align="center"></el-table-column>
            <el-table-column label="状态" align="center" width="50">
              <template slot-scope="scope">
                <div class="carStatus">
                  <div
                    :class="{
                      active: scope.row.status == 1,
                      fix: scope.row.status == 2,
                      stop: scope.row.status == 3
                    }"
                  ></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="历史轨迹" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="goHistory(scope.row.guid)">查看</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col style="position:relative;overflow:hidden;" :span="18">
        <div class="grid-content bg-purple">
          <div class="map" id="track-map"></div>
          <el-dropdown class="viewbtn" @command="handleCommand">
            <el-button type="primary">
              {{dropdownText}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item   command="总览">总览</el-dropdown-item>
              <el-dropdown-item  :command="viewBtn">{{viewBtn}}</el-dropdown-item>
              <el-dropdown-item  command="清空轨迹">清空轨迹</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="card" :class="{'active':showView}">
            <el-card v-if="totalView" class="box-card">
              <div class="clearfix">
                <span class="card_title">车辆监测</span>
                <div class="card_void"></div>
              </div>
              <div>
                <span class="card_main">{{ viewData.totalequips||0 }}</span>
                <span class="card_minor">台</span>
              </div>
            </el-card>
            <el-card class="box-card">
              <div class="clearfix">
                <span class="card_title">保养监测</span>
                <div class="card_void"></div>
              </div>
              <div class="card_content">
                <div>
                  <span class="card_minor">今日</span>
                  <!-- <span class="card_main">2</span> -->
                  <span class="card_main">{{parseInt(viewData.maintain.CurNum)||0}}</span>
                  <span class="card_minor">次</span>
                </div>
                <div>
                  <div class="card_row">
                    <span class="card_minor">本月</span>
                    <!-- <span class="card_col_main">23</span> -->
                    <span class="card_col_main">{{parseInt(viewData.maintain.MonthNum)||0}}</span>
                    <span class="card_minor">次</span>
                  </div>
                  <div class="card_row">
                    <span class="card_minor">年度</span>
                    <!-- <span class="card_col_main">255</span> -->
                    <span class="card_col_main">{{parseInt(viewData.maintain.YearNum)||0}}</span>
                    <span class="card_minor">次</span>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="box-card">
              <div class="clearfix">
                <span class="card_title">维修监测</span>
                <div class="card_void"></div>
              </div>
              <div class="card_content">
                <div>
                  <span class="card_minor">今日</span>
                  <!-- <span class="card_main">1</span> -->
                  <span class="card_main">{{parseInt(viewData.fix.CurNum)||0}}</span>
                  <span class="card_minor">次</span>
                </div>
                <div>
                  <div class="card_row">
                    <span class="card_minor">本月</span>
                    <!-- <span class="card_col_main">2</span> -->
                    <span class="card_col_main">{{parseInt(viewData.fix.MonthNum)||0}}</span>
                    <span class="card_minor">次</span>
                  </div>
                  <div class="card_row">
                    <span class="card_minor">年度</span>
                    <!-- <span class="card_col_main">12</span> -->
                    <span class="card_col_main">{{parseInt(viewData.fix.YearNum)||0}}</span>
                    <span class="card_minor">次</span>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="box-card">
              <div class="clearfix">
                <span class="card_title">告警监测</span>
                <div class="card_void"></div>
              </div>
              <div class="card_content">
                <div>
                  <span class="card_minor">今日</span>
                  <!-- <span class="card_main" style="color:red">0</span> -->
                  <span class="card_main" style="color:red">{{parseInt(viewData.alarm.CurNum)||0}}</span>
                  <span class="card_minor">次</span>
                </div>
                <div>
                  <div class="card_row">
                    <span class="card_minor">本月</span>
                    <!-- <span class="card_col_main">5</span> -->
                    <span class="card_col_main">{{parseInt(viewData.alarm.MonthNum)||0}}</span>
                    <span class="card_minor">次</span>
                  </div>
                  <div class="card_row">
                    <span class="card_minor">年度</span>
                    <!-- <span class="card_col_main">100</span> -->
                    <span class="card_col_main">{{parseInt(viewData.alarm.YearNum)||0}}</span>
                    <span class="card_minor">次</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card_bottom clear" :class="{ active: showView }">
            <el-card class="bottom_card">
              <div class="clearfix">
                <span class="card_title">里程监测</span>
                <div class="card_void"></div>
              </div>
              <div class="card_content">
                <div>
                  <span class="card_minor">今日</span>
                  <!-- <span class="card_main">113</span> -->
                  <span class="card_main">{{(parseFloat(viewData.travel.CurNum)||0).toFixed(2)}}</span>
                  <span class="card_minor">公里</span>
                </div>
                <div>
                  <div class="card_row">
                    <span class="card_minor">本月</span>
                    <!-- <span class="card_col_main">1230</span> -->
                    <span
                      class="card_col_main"
                    >{{(parseFloat(viewData.travel.MonthNum)||0).toFixed(2)}}</span>
                    <span class="card_minor">公里</span>
                  </div>
                  <div class="card_row">
                    <span class="card_minor">年度</span>
                    <!-- <span class="card_col_main">14256</span> -->
                    <span
                      class="card_col_main"
                    >{{(parseFloat(viewData.travel.YearNum)||0).toFixed(2)}}</span>
                    <span class="card_minor">公里</span>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="bottom_card">
              <div class="clearfix">
                <span class="card_title">油耗监测</span>
                <div class="card_void"></div>
              </div>
              <div class="card_content">
                <div>
                  <span class="card_minor">今日</span>
                  <span
                    class="card_main"
                    style="color:#f0c70b"
                  >{{(parseFloat(viewData.oil.CurNum)||0).toFixed(2)}}</span>
                  <span class="card_minor">升</span>
                </div>
                <div>
                  <div class="card_row">
                    <span class="card_minor">本月</span>
                    <!-- <span class="card_col_main">3521</span> -->
                    <span
                      class="card_col_main"
                    >{{(parseFloat(viewData.oil.MonthNum)||0).toFixed(2)}}</span>
                    <span class="card_minor">升</span>
                  </div>
                  <div class="card_row">
                    <span class="card_minor">年度</span>
                    <!-- <span class="card_col_main">53412</span> -->
                    <span class="card_col_main">{{(parseFloat(viewData.oil.YearNum)||0).toFixed(2)}}</span>
                    <span class="card_minor">升</span>
                  </div>
                </div>
              </div>
            </el-card>
            <!-- <el-card class="bottom_card">
              <div class="clearfix">
                <span class="card_title">作业时长</span>
                <div class="card_void"></div>
              </div>
              <div class="card_content">
                <div>
                  <span class="card_minor">今日</span>
                  <span class="card_main">17</span>
                  <span class="card_main">{{(parseFloat(viewData.assignment.CurNum)||0).toFixed(1)}}</span>
                  <span class="card_minor">小时</span>
                </div>
                <div>
                  <div class="card_row">
                    <span class="card_minor">本月</span>
                    <span
                      class="card_col_main"
                    >{{(parseFloat(viewData.assignment.MonthNum)||0).toFixed(1)}}</span>
                    <span class="card_minor">小时</span>
                  </div>
                  <div class="card_row">
                    <span class="card_minor">年度</span>
                    <span
                      class="card_col_main"
                    >{{(parseFloat(viewData.assignment.YearNum)||0).toFixed(1)}}</span>
                    <span class="card_minor">小时</span>
                  </div>
                </div>
              </div>
            </el-card>-->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var infoWindow = new AMap.InfoWindow({
  isCustom: true, //使用自定义窗体
  offset: new AMap.Pixel(0, -30),
});
import {
  equiSelect, //设备列表
  allCollect, // 全部
  singleCollect, // 单个
  overview, //设备概览
} from "@/getData";
export default {
  name: "dashboard",
  data() {
    return {
      dropdownText: '总览',
      totalView: true,
      clickEdit: false,
      viewBtn: "隐藏信息",
      showView: true,
      map: null,
      viewData: {
        alarm: {
          CurNum: "",
          MonthNum: "",
          YearNum: "",
        },
        oil: {
          CurNum: "",
          MonthNum: "",
          YearNum: "",
        },
        assignment: {
          CurNum: "",
          MonthNum: "",
          YearNum: "",
        },
        travel: {
          CurNum: "",
          MonthNum: "",
          YearNum: "",
        },
        fix: {
          CurNum: "",
          MonthNum: "",
          YearNum: "",
        },
        maintain: {
          CurNum: "",
          MonthNum: "",
          YearNum: "",
        },
      },
      showLine: false,
      lineId: "",
      path: [],
      marks: [],
      points: [],
      tableData: [], //设备列表
      markers: [
        {
          position: [112.868357, 36.860426],
        },
      ],
      zoom: 13,
      center: [112.860257, 36.860496],
      total: {},
      single: {},
      websock: null,
    };
  },
  components: {},
  computed: {},
  created() {},
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
    if (!!this.map) {
      this.map.destroy();
    }
  },
  mounted() {
    this.initMap();
    // this.equiList();
    this.getOverWatch();
  },
  methods: {
    handleCommand (command) {
      this.dropdownText = command;
      switch (command) {
        case '总览' : this.getOverWatch(); break;
        case '清空轨迹' : this.closeLine(); break;
        default : this.showBox();
      }
    },
    goHistory(id) {
      this.$router.push({ path: "/track/" + id });
    },
    showBox() {
      this.showView = !this.showView;
      this.showView ? (this.viewBtn = "隐藏信息") : (this.viewBtn = "详细信息");
    },
    async getOverWatch(id) {
      this.showView = true;
      // console.log(id);
      let res = null;
      if (id) {
        res = await overview({ param: { id: id } });
        // console.log(res.data);
        this.totalView = false; //展示单台车辆信息
      } else {
        this.totalView = true; //显示总览车辆台数
        res = await overview();
      }
      //设备列表
      this.viewData = res.data;
      // console.log(this.viewData);
    },
    removeChild() {
      var child = document.getElementsByClassName("custom-content-marker");
      child.removeNode = [];
      if (child.length != undefined) {
        var len = child.length;
        for (var i = 0; i < len; i++) {
          child.removeNode.push({
            parent: child[i].parentNode,
            inner: child[i].outerHTML,
            next: child[i].nextSibling,
          });
        }
        for (var i = 0; i < len; i++) {
          child[0].parentNode.removeChild(child[0]);
        }
      } else {
        child.removeNode.push({
          parent: child.parentNode,
          inner: child.outerHTML,
          next: child.nextSibling,
        });
        child.parentNode.removeChild(child);
      }
    },
    //点击设备列表打开地图中marker
    clickMarker(row) {
      this.getOverWatch(row.guid);
      this.$refs.singleATable.setCurrentRow(row);
      this.removeChild();
      this.closeInfoWindow();
      let eqid = row.guid;
      let targetM;
      if (this.points.length) {
        for (var i = 0; i < this.points.length; i++) {
          if (this.points[i].getExtData().guid == eqid) {
            let param = this.windowInfoHandle(this.points[i].getExtData());
            infoWindow.setContent(
              this.createInfoWindow(param.title, param.content.join(""))
            );
            infoWindow.open(this.map, this.points[i].getPosition());
            this.map.setZoomAndCenter(16, this.marks[i].position);
            targetM = this.points[i];
            this.drowLine(eqid);

            var marker = new AMap.Marker({
              position: this.marks[i].position,
              // 将 html 传给 content
              content:
                '<img src="https://img-blog.csdnimg.cn/20200520160316104.png" style="width:20px" class="custom-content-marker">',
              // 以 icon 的 [center bottom] 为原点
              offset: new AMap.Pixel(-24, -30),
            });
            this.map.add(marker);
            break;
          }
          if (
            i == this.points.length - 1 &&
            this.points[i].getExtData().guid != eqid
          ) {
            this.$message.error("车辆未在线");
          }
        }
      } else {
        this.$message.error("车辆未在线");
      }
    },
    initMap() {
      let that = this;
      this.map = new AMap.Map("track-map", {
        zoom: 8, //级别
        center: [112.866504, 36.860657], //中心点坐标
        resizeEnable: true,
      });

      // 插件
      AMap.plugin(
        ["AMap.ToolBar", "AMap.Scale", "AMap.GraspRoad"],
        function () {
          that.map.addControl(new AMap.ToolBar());
          that.map.addControl(new AMap.Scale());
          that.map.addControl(new AMap.GraspRoad());
        }
      );
      this.initWebSocket();
      // console.log("map");
      // console.log(AMap);
    },
    markerClick(mark) {
      infoWindow.setContent(mark.content);
      infoWindow.open(this.map, mark.getPosition());
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = process.env.VUE_APP_SOCKET;
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
        "position: absolute;top: 10px;right: 10px;transition-duration: 0.25s;cursor:pointer;hover{box-shadow: 0px 0px 5px #000;}";
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
    closeLine() {
      if (this.showLine == false) return;
      this.showLine = false;
      this.map.remove(this.map.getAllOverlays("polyline"));
    },
    drowLine(id) {
      this.showLine = true;
      this.lineId = id;
      let nPath123;
      for (var i = 0; i < this.path.length; i++) {
        if (id == this.path[i].guid) {
          nPath123 = this.path[i].path;
        }
      }

      // console.log(nPath123);
      // console.log(this.path);
      let n_path = [];
      for (var j = 0; j < nPath123.length; j++) {
        n_path.push(new AMap.LngLat(nPath123[j][0], nPath123[j][1]));
      }

      this.map.remove(this.map.getAllOverlays("polyline"));

      var polyline = new AMap.Polyline({
        path: n_path, //设置线覆盖物路径
        strokeColor: "#34a034", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 8, //线宽
        strokeStyle: "solid", //线样式
        showDir: true,
        strokeDasharray: [10, 5], //补充线样式
      });
      polyline.setMap(this.map);
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
          // console.log("解析->", data);
          //循环现有设备列表
          if (that.tableData.length) {
            for (var i = 0; i < that.tableData.length; i++) {
              if (this.tableData[i].guid == data.guid) {
                that.$set(that.tableData, i, data);
                break;
              }
              if (
                i == this.tableData.length - 1 &&
                this.tableData[i].guid != data.guid
              ) {
                //新增点
                this.tableData.push(data);
              }
            }
          } else {
            this.tableData.push(data);
          }
          //循环现有marks
          let pos = null;
          pos = [data.longitude, data.latitude];
          if (that.marks.length) {
            for (var i = 0; i < that.marks.length; i++) {
              if (this.marks[i].guid == data.guid) {
                this.marks[i].position = pos; //更新position信息
                this.marks[i].angle = data.direction;
                this.marks[i].extData = data; //更新position信息
                //更新path信息
                for (var k = 0; k < this.path.length; k++) {
                  if (this.path[k].guid == data.guid) {
                    this.path[k].path.push(pos);
                    this.path[k].gpstime = data.gpstime;
                    this.path[k].speed = data.speed;
                    this.path[k].direction = data.direction;
                    if (this.path[k].path.length == 101) {
                      this.path[k].path.shift();
                    }
                    break;
                  }
                }
                if (data.guid == that.lineId && that.showLine) {
                  that.drowLine(data.guid);
                }
                break;
              }
              if (
                i == this.marks.length - 1 &&
                this.marks[i].guid != data.guid
              ) {
                //新增点
                let mark = {
                  guid: data.guid,
                  position: pos,
                  icon: "https://img-blog.csdnimg.cn/20200514172516537.png",
                  offset: new AMap.Pixel(-10, -16),
                  angle: data.direction,
                  extData: data,
                };
                this.marks.push(mark);

                //新增点记录
                let markPath = {
                  guid: data.guid,
                  path: [],
                  gpstime: data.gpstime,
                  speed: data.speed,
                  direction: data.direction,
                };
                markPath.path.push(pos);
                this.path.push(markPath);
              }
            }
          } else {
            let mark = {
              guid: data.guid,
              position: pos,
              icon: "https://img-blog.csdnimg.cn/20200514172516537.png",
              offset: new AMap.Pixel(-10, -16),
              angle: data.direction,
              extData: data,
            };

            this.marks.push(mark);
            //新增点记录
            let markPath = {
              guid: data.guid,
              path: [],
              gpstime: data.gpstime,
              speed: data.speed,
              direction: data.direction,
            };
            markPath.path.push(pos);
            this.path.push(markPath);
          }
          this.map.remove(this.points);
          this.points = [];
          for (var j = 0; j < this.marks.length; j++) {
            //实例化所有点标记
            let point = new AMap.Marker(this.marks[j]);
            let title =
              that.marks[j].extData.name +
              " &nbsp;&nbsp; " +
              that.marks[j].extData.platenum;
            let content = [];
            let direction = "";
            let t = parseInt(that.marks[j].extData.direction);

            // 车辆方向
            if (t > 27 && t <= 72) {
              direction = "东北";
            } else if (t > 72 && t <= 117) {
              direction = "东";
            } else if (t > 117 && t <= 162) {
              direction = "东南";
            } else if (t > 162 && t <= 207) {
              direction = "南";
            } else if (t > 207 && t <= 252) {
              direction = "西南";
            } else if (t > 252 && t <= 297) {
              direction = "西";
            } else if (t > 297 && t <= 342) {
              direction = "西北";
            } else {
              direction = "北";
            }

            // 车辆类型
            if (that.marks[j].extData.classtype == "SUV") {
              content.push(
                `<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='https://img-blog.csdnimg.cn/20200511201816499.png'></div>`
              );
            } else if (that.marks[j].extData.classtype == "轨道车") {
              content.push(
                "<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='https://img-blog.csdnimg.cn/20200511201716290.png'></div>"
              );
            } else if (that.marks[j].extData.classtype == "东风机车") {
              content.push(
                "<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='https://img-blog.csdnimg.cn/20200511201800164.png'></div>"
              );
            }

            // 行驶方向
            content.push(
              "<div style='padding:5px 10px'>行驶方向：" + direction + "</div>"
            );

            // 当前速度：
            content.push(
              "<div style='padding:5px 10px'>当前速度：" +
                parseFloat(that.marks[j].extData.speed).toFixed(2) +
                "km/h" +
                "</div>"
            );

            // 当前油位：
            content.push(
              "<div style='padding:5px 10px'>当前油位：" +
                parseFloat(that.marks[j].extData.curoilpos).toFixed(2) +
                "cm" +
                "</div>"
            );

            // 剩余油量：
            content.push(
              "<div style='padding:5px 10px'>剩余油量：" +
                parseFloat(that.marks[j].extData.oilleft).toFixed(2) +
                "升" +
                "</div>"
            );

            //今日里程：
            content.push(
              "<div style='padding:5px 10px'>今日里程：" +
                parseFloat(that.marks[j].extData.curmiles).toFixed(2) +
                "km" +
                "</div>"
            );

            // 总里程：
            content.push(
              "<div style='padding:5px 10px'>总里程：" +
                parseFloat(that.marks[j].extData.totalmiles).toFixed(2) +
                "km" +
                "</div>"
            );

            //gps 时间
            content.push(
              "<div style='padding:5px 10px'>gps 时间：" +
                that.marks[j].extData.gpstime +
                "</div>"
            );

            // 服务器时间：
            content.push(
              "<div style='padding:5px 10px'>服务器时间：" +
                that.marks[j].extData.servertime +
                "</div>"
            );

            // 位置：
            content.push(
              "<div style='padding:5px 10px'>位置：" +
                that.marks[j].extData.location +
                "</div>"
            );

            // 瞬时油耗：
            // content.push(
            //   "<div style='padding:5px 10px'>瞬时油耗：" +
            //     parseFloat(that.marks[j].extData.curoilconsume).toFixed(2) +
            //     "L" +
            //     "</div>"
            // );
            point.on("click", function (e) {
              infoWindow.setContent(
                that.createInfoWindow(title, content.join(""))
              );
              infoWindow.open(that.map, e.target.getPosition());
            });
            this.points.push(point);
          }

          this.map.add(this.points); //画点

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
    },
    windowInfoHandle(extData) {
      let that = this;
      let title = extData.name + " &nbsp;&nbsp; " + extData.platenum;
      let content = [];
      let direction = "";
      let t = parseInt(extData.direction);

      // 车辆方向
      if (t > 27 && t <= 72) {
        direction = "东北";
      } else if (t > 72 && t <= 117) {
        direction = "东";
      } else if (t > 117 && t <= 162) {
        direction = "东南";
      } else if (t > 162 && t <= 207) {
        direction = "南";
      } else if (t > 207 && t <= 252) {
        direction = "西南";
      } else if (t > 252 && t <= 297) {
        direction = "西";
      } else if (t > 297 && t <= 342) {
        direction = "西北";
      } else {
        direction = "北";
      }

      // 车辆类型
      if (extData.classtype == "SUV") {
        content.push(
          `<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='https://img-blog.csdnimg.cn/20200511201816499.png'></div>`
        );
      } else if (extData.classtype == "轨道车") {
        content.push(
          "<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='https://img-blog.csdnimg.cn/20200511201716290.png'></div>"
        );
      } else if (extData.classtype == "东风机车") {
        content.push(
          "<div style='text-align:center'><img style='display:inline-block;margin-right: 6px;' src='https://img-blog.csdnimg.cn/20200511201800164.png'></div>"
        );
      }

      // 行驶方向
      content.push(
        "<div style='padding:5px 10px'>行驶方向：" + direction + "</div>"
      );

      // 当前速度：
      content.push(
        "<div style='padding:5px 10px'>当前速度：" +
          parseFloat(extData.speed).toFixed(2) +
          "km/h" +
          "</div>"
      );

      // 当前油位：
      content.push(
        "<div style='padding:5px 10px'>当前油位：" +
          parseFloat(extData.curoilpos).toFixed(2) +
          "cm" +
          "</div>"
      );

      // 剩余油量：
      content.push(
        "<div style='padding:5px 10px'>剩余油量：" +
          parseFloat(extData.oilleft).toFixed(2) +
          "升" +
          "</div>"
      );
      //今日里程：
      content.push(
        "<div style='padding:5px 10px'>今日里程：" +
          parseFloat(extData.curmiles).toFixed(2) +
          "km" +
          "</div>"
      );

      // 总里程：
      content.push(
        "<div style='padding:5px 10px'>总里程：" +
          parseFloat(extData.totalmiles).toFixed(2) +
          "km" +
          "</div>"
      );

      //gps 时间
      content.push(
        "<div style='padding:5px 10px'>gps 时间：" + extData.gpstime + "</div>"
      );

      // 服务器时间：
      content.push(
        "<div style='padding:5px 10px'>服务器时间：" +
          extData.servertime +
          "</div>"
      );

      // 位置：
      content.push(
        "<div style='padding:5px 10px'>位置：" + extData.location + "</div>"
      );
      return {
        title,
        content,
      };
    },
  },
  updated() {},
};
</script>

<style lang="less" scoped>
.card_title {
  color: #858585;
  font-size: 15px;
  letter-spacing: 2px;
}
.card_void {
  width: 100%;
  height: 5px;
}
.card_main {
  color: #009247;
  font-size: 30px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  padding-top: 6px;
}
@media screen and (min-width: 1720px) {
  .card_bottom {
    position: absolute;
    width: 100%;
    bottom: -160px;
    left: 20px;
    z-index: 100;
    transition: all 0.2s;
    .bottom_card {
      float: left;
      width: 24.5%;
      margin-right: 15px;
    }
  }
  .card_content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
@media screen and (max-width: 1719px) {
  .card_content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: baseline;
    div {
      align-items: center;
    }
  }
  .card_bottom {
    position: absolute;
    width: 100%;
    bottom: -30%;
    left: 20px;
    z-index: 100;
    transition: all 0.2s;
    .bottom_card {
      float: left;
      width: 20%;
      margin-right: 15px;
    }
  }
}
.card_minor {
  font-size: 15px;
  font-weight: none;
  color: #858585;
}

.card_col_main {
  font-size: 18px;
  height: 30px;
  color: black;
}
.card_row {
  padding-top: 8px;
}
@red: #ff0000;
@green: #66cc66;
@gray: #cccccc;
.carStatus {
  text-align: center;
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
  height: 93vh;
}
.amap-demo {
  height: 93vh;
}
.card {
  position: absolute;
  width: 20%;
  top: 12px;
  right: -320px;
  z-index: 100;
  transition: all 0.2s;
}
.card.active {
  right: 20px;
}

.card_bottom.active {
  bottom: 20px;
}
.viewbtn {
  position: absolute;
  top: 15px;
  left: 90px;
}
.viewline {
  position: absolute;
  top: 15px;
  left: 170px;
}
.viewTotal {
  position: absolute;
  top: 15px;
  left: 290px;
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

.box-card {
  width: 100%;
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

.clear::after {
  content: "";
  display: table;
  clear: both;
}

.custom-content-marker {
  position: relative;
  width: 20px;
  height: 20px;
}

.custom-content-marker img {
  width: 100%;
  height: 100%;
}

.custom-content-marker .close-btn {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  background: #ccc;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 15px;
  box-shadow: -1px 1px 1px rgba(10, 10, 10, 0.2);
}

.custom-content-marker .close-btn:hover {
  background: #666;
}
</style>
