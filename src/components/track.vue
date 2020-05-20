<template>
  <el-row :gutter="10">
    <el-col :span="5" align="center">
      <el-select v-model="guid" placeholder="请选择设备" style="width:90%;margin-top:20px">
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
      <div class="map" id="track-map"></div>
    </el-col>
  </el-row>
</template>

<style>
.is-selected {
  color: #1989fa;
}
.calendar_style {
  width: 100%;
  height: 100%;
}
</style>

<script>
import { equiSelect, oilView } from "@/getData";
export default {
  name: "amap-page",
  data() {
    return {
      date: new Date(),
      guid: "",
      formDate: "",
      vehicleData: []
    };
  },
  created() {
    this.equiList();
    this.historyTrackHandle();
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 地图引入
    initMap() {
      let that = this;
      this.map = new AMap.Map("track-map", {
        zoom: 8, //级别
        center: [112.866504, 36.860657], //中心点坐标
        resizeEnable: true
      });

      // 插件
      AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.GraspRoad"], function() {
        that.map.addControl(new AMap.ToolBar());
        that.map.addControl(new AMap.Scale());
        that.map.addControl(new AMap.GraspRoad());
      });
      this.initWebSocket();
      // console.log("map");
      // console.log(AMap);
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
      console.log(data.day);
    },
    /*
     ** 历史轨迹处理
     */
    historyTrackHandle() {
      console.log("id:", this.$route.params.id);
    }
  }
};
</script>
