<template>
  <el-row :gutter="10">
    <el-dialog title="统计信息" :visible.sync="dialogTableVisible" width="80%"></el-dialog>
    <el-col :span="5" align="center">
      <el-select
        v-model="eqid"
        @change="historyTrackHandle()"
        placeholder="请选择设备"
        style="width:90%;margin-top:20px"
      >
        <el-option
          v-for="item in vehicleData"
          :key="item.guid"
          :label=" item.plateno"
          :value="item.guid"
        ></el-option>
      </el-select>
      <el-calendar v-model="date">
        <template slot="dateCell" slot-scope="{date, data}">
          <div
            @click="currentHandle(data)"
            style="text-align:center;"
            class="calendar_style"
            :class="data.isSelected ? 'is-selected' : ''"
          >{{ data.day.split('-').slice(2).join('-')}} {{ data.isSelected ? '✔️' : ''}}</div>
        </template>
      </el-calendar>
    </el-col>
    <el-col :span="19" align="center">
      <div style="position: absolute; z-index:100">
        <!-- <el-button-group> -->
        <el-button type="primary" icon="el-icon-s-order" @click="dialogTableVisible = true">统计</el-button>
        <!-- <el-button type="primary" icon="el-icon-s-platform"></el-button> -->
        <!-- </el-button-group> -->
      </div>

      <div class="map" id="hismap"></div>
      <div class="input-card">
        <h4>轨迹回放控制</h4>
        <!-- <div class="input-item">
          <input type="button" class="btn" value="加速" id="start" @click="reStartAnimation(10000)" />
          <input type="button" class="btn" value="减速" id=" speed" @click="reStartAnimation(500)" />
        </div>-->
        <div class="input-item">
          <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()" />
          <input type="button" class="btn" value="显示信息" id=" speed" @click="showInfo()" />
        </div>
        <div class="input-item">
          <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()" />
          <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation()" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
#hismap {
  height: 93vh;
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

<script>
import { equiSelect, history } from "@/getData";
export default {
  name: "amap-page",
  data() {
    return {
      marker: null, //车
      polyline: null, //历史线
      new_polyline: null, //没跑过的线
      passedPolyline: null, //跑过的线
      carWindow: null, //信息窗体
      map: null, //地图
      hisData: [], //历史轨迹数据
      lineArr: [], //画线线数组-位置信息
      passLineArr: [], //未画线线数组-位置信息
      n_passLineArr: [], //已画线线数组-位置信息
      eqid: "",
      date: new Date(),
      formDate: "",
      guid: "",
      formDate: "",
      vehicleData: [],
      dialogTableVisible: false
    };
  },
  created() {
    this.eqid = this.$route.params.id;
    this.equiList();
    this.historyTrackHandle();
  },
  mounted() {
    this.initMap();
  },
  methods: {
    htimeHandle() {},
    // 地图引入
    initMap() {
      this.map = new AMap.Map("hismap", {
        zoom: 8, //级别
        center: [112.866504, 36.860657], //中心点坐标
        resizeEnable: true
      });
      // 创建信息展示框
      this.carWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(6, -25),
        content: ""
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

      this.hisData.map(val => {
        this.lineArr.push(new AMap.LngLat(val.longitude, val.latitude));
      });
      this.map.setZoomAndCenter(18, this.lineArr[0]); //设置地图中心
      //创建车
      this.marker = new AMap.Marker({
        position: this.lineArr[0],
        icon: "https://img-blog.csdnimg.cn/20200514172516537.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });
      // 历史轨迹
      this.polyline = new AMap.Polyline({
        path: this.lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });
      // 车开过的轨迹
      this.passedPolyline = new AMap.Polyline({
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });
      this.map.add(this.marker);
      this.map.add(this.polyline);
      this.map.add(this.passedPolyline);
      //行駛過後改變顏色
      this.marker.on("moving", function(e) {
        that.passLineArr = e.passedPath;
        that.n_passLineArr = that.lineArr.slice(that.passLineArr.length);
        that.passedPolyline.setPath(that.passLineArr);
      });

      // 信息框随车辆移动
      AMap.event.addListener(this.marker, "moving", function(e) {
        var lastLocation = e.passedPath[e.passedPath.length - 1];
        that.carWindow.setPosition(lastLocation);
        that.setInfoContent(lastLocation);
      });
      this.carWindow.open(this.map, this.marker.getPosition());
      this.map.setFitView();
    },
    setInfoContent(lnglat) {
      for (var i = 0; i < this.hisData.length; i++) {
        if (
          lnglat.lat == this.hisData[i].latitude &&
          lnglat.lng == this.hisData[i].longitude
        ) {
          this.carWindow.setContent(
            "车牌:" + this.hisData[i].platenum +
            "<br>"+
            "油位:" + this.hisData[i].curoilpos +
            "<br>"+
            "里程:" + this.hisData[i].totalmiles.toFixed(2) +
            "<br>"+
            "速度:" + this.hisData[i].speed.toFixed(2) + "km/h"
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
      this.marker.moveAlong(this.lineArr, 1000);
    },
    //加减速开始动画
    reStartAnimation(time) {
      this.marker.stopMove();
      // this.new_polyline = new AMap.Polyline({
      //   path: this.passLineArr,
      //   showDir: true,
      //   strokeColor: "#AF5", //线颜色
      //   // strokeOpacity:1,//透明
      //   // strokeOpacity: 1,     //线透明度
      //   strokeWeight: 6 //线宽
      //   // strokeStyle: "solid"  //线样式
      // });
      // this.map.add(this.new_polyline)
      this.marker.moveAlong(this.n_passLineArr, time);
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
    currentHandle(data) {
      this.formDate = data.day;
      this.historyTrackHandle();
    },
    /*
     ** 历史轨迹处理
     */
    async historyTrackHandle() {
      console.log("id:", this.$route.params.id);
      let res = null;
      if (this.formDate) {
        res = await history({
          param: { id: this.eqid, start: this.formDate + " 00:00:00" }
        });
      } else {
        res = await history({ param: { id: this.eqid } });
      }
      this.hisData = res.data;
      this.drawLine();
    },

    /*
     ** 初始化 echert
     */
    initCharts(
      gpstime = [],
      curmiles = [],
      curoilconsume = [],
      speed = [],
      totaloilconsume = []
    ) {
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(this.$refs.chart);
      let option = {
        title: {
          text: "油耗统计",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          }
        },
        legend: {
          data: ["总油耗", "油耗", "里程", "速度"],
          align: "left", //水平方向位置
          verticalAlign: "top", //垂直方向位置
          x: 100, //距离x轴的距离
          y: 0 //距离Y轴的距离
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ["line", "bar"],
              show: true
            },
            dataZoom: {
              show: true
            },
            dataView: {
              show: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        calculable: true,
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            top: 30,
            start: 10,
            end: 90,
            height: 20 //初始化滚动条
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
    }
  }
};
</script>
