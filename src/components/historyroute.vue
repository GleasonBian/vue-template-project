<template>
  <el-container>
    <el-aside>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="currentHandle"
        style="width:100%"
      ></el-date-picker>
      <gt-table
        :tableData="vehicleData"
        style="width: 100%"
         :optionWidth="60"
        :columns="columns"
        :selection="false"
        v-on:historyTrackHandle="historyTrackHandle"
        :handle="handle"
        size="mini"
      ></gt-table>
    </el-aside>
      <el-main>
         <div class="echarts_style" v-show="dialogTableVisible">
      <span class="xxx" @click="closedialog($event)">×</span>
      <div style="width:80vw; height:500px" ref="chart"></div>
    </div>
    <div style="position: absolute; z-index:100">
        <el-button type="primary" icon="el-icon-s-order" @click="dialogOpenHandle">统计</el-button>
      </div>

      <div class="map" id="historymap"></div>
      <div class="input-card">
        <h4>轨迹回放控制</h4>
        <div class="input-item">
          <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()" />
          <input type="button" class="btn" value="显示信息" id=" speed" @click="showInfo()" />
        </div>
        <div class="input-item">
          <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()" />
          <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation()" />
        </div>
        <div class="input-item">
          <input type="button" class="btn" value="加速" id="start" @click="startAdd()" />
          <input type="button" class="btn" value="减速" id=" speed" @click="startRed()" />
        </div>
      </div>
      </el-main>
  </el-container>
</template>


<script>
import { equiSelect, history } from "@/getData";
export default {
  name: "historyTrack2",
  data() {
    return {
      marker: {},
      hisData: [], //回放位置数组
      map: {},
      firstArr: [116.478935, 39.997761],
      polyline: {}, //最原始
      passedPolyline: {}, //最原始
      newPolyline: {}, //速度改变后新轨迹
      newPassedPolyline: {}, //速度改变后的新轨迹
      markerSpeed: 200, //运动速度
      speedCount: 1, //速度计数
      havePassedLine: [], //已经运动的点
      NoPassedLine: [], //未运动的点
      eqid: "",
      date: new Date(),
      formDate: "",
      guid: "",
      formDate: "",
      vehicleData: [],
      dialogTableVisible: false,
      gpstime: [], // 时间
      curmiles: [], // 里程
      curoilconsume: [], // 油耗
      speed: [], //速度
      totaloilconsume: [], // 总油耗
      tableData: [], // 设备列表
      columns: [
          {
          id: "name",
          label: "车辆名称",
          width: 110
        },
        {
          id: "plateno",
          label: "车牌号码",
        },
      
      ],
      handle: [
        {
          function: "historyTrackHandle",
          text: "查看",
          type: "text",
          show: true,
        },
      ],
    };
  },
  created() {
    this.equiList();
  },
  mounted() {
    this.initMap();
  },
  methods: {
    ExamineHandle(val) {
      console.log(val);
    },
    // 地图引入
    initMap() {
      this.map = new AMap.Map("historymap", {
        zoom: 8, //级别
        center: [112.866504, 36.860657], //中心点坐标
        resizeEnable: true,
      });
      // 创建信息展示框
      this.carWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(6, -25),
        content: "",
      });
      // 插件
      // AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.GraspRoad"], function() {
      //   that.map.addControl(new AMap.ToolBar());
      //   that.map.addControl(new AMap.Scale());
      //   that.map.addControl(new AMap.GraspRoad());
      // });
      // console.log("map");
      // console.log(AMap);
    },
    initroad() {
      let that = this;
      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      //绘制路过了的轨迹
      var passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5", //线颜色
        //path: this.lineArr,
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      this.marker.on("moving", (e) => {
        //获取已经经过点的长度
        this.passedLineLength = e.passedPath.length;
        //已经经过的点
        this.havePassedLine = e.passedPath;
        passedPolyline.setPath(e.passedPath);
      });
      // 信息框随车辆移动
      AMap.event.addListener(this.marker, "moving", function (e) {
        var lastLocation = e.passedPath[e.passedPath.length - 1];
        that.carWindow.setPosition(lastLocation);
        that.setInfoContent(lastLocation);
      });
      this.carWindow.open(this.map, this.marker.getPosition());
      this.map.setFitView();
      this.map.setFitView(); //合适的视口
    },
    drawLine() {
      let that = this;
      //画图之前先重置
      this.marker = null;
      this.polyline = null;
      this.passedPolyline = null;
      this.new_polyline = null;
      this.lineArr = [];
      this.passLineArr = [];
      this.map.clearMap();

      this.hisData.map((val) => {
        this.lineArr.push(new AMap.LngLat(val.longitude, val.latitude));
      });
      this.map.setZoomAndCenter(18, this.lineArr[0]); //设置地图中心
      //起点
      new AMap.Marker({
        map: this.map,
        position: this.lineArr[0],
        icon: "https://img-blog.csdnimg.cn/20200529153725255.png",
        autoRotation: true,
      });
      //终点
      new AMap.Marker({
        map: this.map,
        position: this.lineArr[this.lineArr.length - 1],
        icon: "https://img-blog.csdnimg.cn/20200529153800221.png",
        autoRotation: true,
      });
      //创建车
      this.marker = new AMap.Marker({
        position: this.lineArr[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
      });

      this.map.add(this.marker);
      this.initroad();
    },
    setInfoContent(lnglat) {
      for (var i = 0; i < this.hisData.length; i++) {
        if (
          lnglat.lat == this.hisData[i].latitude &&
          lnglat.lng == this.hisData[i].longitude
        ) {
          this.carWindow.setContent(
            "车牌:" +
              this.hisData[i].platenum +
              "<br>" +
              "油位:" +
              this.hisData[i].curoilpos +
              "<br>" +
              "里程:" +
              this.hisData[i].totalmiles.toFixed(2) +
              "<br>" +
              "速度:" +
              this.hisData[i].speed.toFixed(2) +
              "km/h"
          );
          return;
        }
      }
    },
    showInfo() {
      if (!this.carWindow.getIsOpen()) {
        //判斷窗體是否顯示
        this.carWindow.open(this.map, this.marker.getPosition());
      }
    },
    //开始动画
    startAnimation() {
      this.marker.stopMove();
      this.speedCount = 1;
      this.markerSpeed = 200;
      this.marker.moveAlong(this.lineArr, this.markerSpeed);
      // console.log(this.lineArr)
      // console.log(this.newLineArr)

      if (this.lineArr.length < this.hisData.length) {
        this.lineArr = [];
        this.hisData.map((val) => {
          this.lineArr.push(new AMap.LngLat(val.longitude, val.latitude));
        }); //搞一个和之前数组一样的代码
        this.initroad();
        this.marker.moveAlong(this.lineArr, this.markerSpeed);
      } else {
        this.marker.moveAlong(this.lineArr, this.markerSpeed);
      }
    },
    //加速
    startAdd() {
      //点击加速将已经运动的点的颜色改成和之前的一样
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.havePassedLine,
        showDir: true,
        strokeColor: "#AF5", //线颜色--绿色的线
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      //截取未运动的点
      if (this.passedLineLength >= 2) {
        this.NoPassedLine = this.lineArr.slice(this.passedLineLength - 2);
      }
      //将未运动的点变成新的点
      this.lineArr = this.NoPassedLine;
      // 绘制轨迹---未运动时候的样式
      this.newPolyline = new AMap.Polyline({
        map: this.map,
        path: this.NoPassedLine,
        showDir: true,
        strokeColor: "#28F", //线颜色--蓝色的线
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: "solid", //线样式
      });
      //绘制运动过了的轨迹
      var newPassedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5", //线颜色--绿色的线
        // path: this.lineArr,
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: "solid", //线样式
      });
      this.marker.on("moving", (e) => {
        this.passedLineLength = e.passedPath.length;
        this.havePassedLine = e.passedPath;
        newPassedPolyline.setPath(e.passedPath);
      });
      this.map.setFitView(); //合适的视口
      if (this.markerSpeed < 1000000) {
        this.markerSpeed = 500;
        this.speedCount += 10;
        this.speedCount = this.speedCount += 10;
        this.markerSpeed = this.markerSpeed * this.speedCount;
        this.marker.moveAlong(this.NoPassedLine, this.markerSpeed);
      } else {
        this.speedCount = 15;
      }
    },
    //减速
    startRed() {
      //点击加速将已经运动的点的颜色改成和之前的一样
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.havePassedLine,
        showDir: true,
        strokeColor: "#AF5", //线颜色--绿色的线
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      //截取未运动的点
      if (this.passedLineLength >= 2) {
        this.NoPassedLine = this.lineArr.slice(this.passedLineLength - 2);
      }
      //将未运动的点变成新的点
      this.lineArr = this.NoPassedLine;
      // 绘制轨迹---未运动时候的样式
      this.newPolyline = new AMap.Polyline({
        map: this.map,
        path: this.NoPassedLine,
        showDir: true,
        strokeColor: "#28F", //线颜色--蓝色的线
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: "solid", //线样式
      });
      //绘制运动过了的轨迹
      var newPassedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5", //线颜色--绿色的线
        // path: this.lineArr,
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: "solid", //线样式
      });
      this.marker.on("moving", (e) => {
        this.passedLineLength = e.passedPath.length;
        this.havePassedLine = e.passedPath;
        newPassedPolyline.setPath(e.passedPath);
      });
      this.map.setFitView(); //合适的视口
      if (this.markerSpeed > 200000) {
        this.markerSpeed = 500;
        this.speedCount -= 3;
        this.speedCount = this.speedCount = 3;
        this.markerSpeed = this.markerSpeed * this.speedCount;
        this.marker.moveAlong(this.NoPassedLine, this.markerSpeed);
      } else {
        this.marker.moveAlong(this.NoPassedLine, 200);
        this.speedCount = 1;
      }
    },
    //暂停
    pauseAnimation() {
      this.marker.pauseMove();
    },
    //继续
    resumeAnimation() {
      this.marker.resumeMove();
    },
    /*
     ** 设备列表
     */
    async equiList() {
      const res = await equiSelect();
      this.vehicleData = res.data;
    },
    /*
     ** 点击日历 获取选中时间
     */
    currentHandle(date) {
      this.formDate = date;
      this.historyTrackHandle();
    },
    /*
     ** 历史轨迹处理
     */
    async historyTrackHandle(index,row) {

      row ?  this.eqid = row.guid : '';

      let res = null;

      if (this.formDate) {
        res = await history({
          param: { id: this.eqid, start:  this.formDate },
        });
      } else {
        res = await history({ param: { id: this.eqid } });
      }
      this.hisData = res.data;
      for (var i in res.data) {
        this.gpstime.push(res.data[i].gpstime);
        this.curmiles.push(res.data[i].curmiles);
        this.curoilconsume.push(res.data[i].curoilconsume);
        this.speed.push(res.data[i].speed);
        this.totaloilconsume.push(res.data[i].totaloilconsume);
      }
      this.drawLine();
    },
    dialogOpenHandle() {
      this.dialogTableVisible = true;
      this.initCharts();
    },
    /*
     ** 初始化 echert
     */
    initCharts() {
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(this.$refs.chart);
      console.log(myChart);
      let option = {
        title: {
          text: "油耗统计",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left",
          },
        },
        legend: {
          data: ["总油耗", "油耗", "里程", "速度"],
          align: "left", //水平方向位置
          verticalAlign: "top", //垂直方向位置
          x: 100, //距离x轴的距离
          y: 0, //距离Y轴的距离
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ["line", "bar"],
              show: true,
            },
            dataZoom: {
              show: true,
            },
            dataView: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
            },
          },
        },
        calculable: true,
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            top: 30,
            start: 10,
            end: 90,
            height: 20, //初始化滚动条
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gpstime,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "总油耗",
            type: "line",
            stack: "总量",
            data: this.totaloilconsume,
          },
          {
            name: "油耗",
            type: "line",
            stack: "总量",
            data: this.curoilconsume,
          },
          {
            name: "里程",
            type: "line",
            stack: "总量",
            data: this.curmiles,
          },
          {
            name: "速度",
            type: "line",
            stack: "总量",
            data: this.speed,
          },
        ],
      };
      myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    closedialog(e) {
      this.dialogTableVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.xxx {
  font-size: 30px;
  color: red;
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
}
.echarts_style {
  width: 80vw;
  height: 500px;
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
  // border: 1px solid black;
  padding: 50px 24px 15px 24px;
  box-shadow: 0 0 10px #888888;
  border-radius: 5px;
  text-align: right;
}
#historymap {
  height: 95vh;
}
.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.25rem;
  width: 22rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
  h4 {
    font-family: inherit;
    line-height: 1.8;
    font-weight: 300;
    color: inherit;
    font-size: 1.1rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  .input-item {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
    height: 3rem;
  }
  .btn {
    margin-right: 1.2rem;
    width: 9rem;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    background-color: transparent;
    background-image: none;
    color: #25a5f7;
    border-color: #25a5f7;
    padding: 0.25rem 0.5rem;
    line-height: 1.5;
    border-radius: 1rem;
    -webkit-appearance: button;
    cursor: pointer;
  }
  .btn:last-child {
    margin-right: 0;
  }
}

.is-selected {
  color: #1989fa;
}
.calendar_style {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
>>> .el-main{
  padding: 0px;
}
</style>