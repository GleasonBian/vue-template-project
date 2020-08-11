<template>
  <div class="map_containr">
    <div class="a_car_map" id="a-car-map"></div>
    <!--   v-on:deleteHandle="deleteHandle" -->
    <gt-table
      class="fence_tabs"
      :tableData="fenceData"
      :optionWidth="100"
      :columns="columns"
      :selection="false"
      v-on:fencesHandle="fencesHandle"
      :handle="handle"
      size="mini"
    ></gt-table>
  </div>
</template>

<script>
import {
  equiSelect, //设备列表
  fencesPoly, // 创建多边形围栏
  fencesRound, // 创建圆形围栏
  fences, // 围栏列表
  fencesDelete, // 删除围栏
  corpSelect, // 公司列表
  getDeptList, // 部门列表
} from "@/getData";
export default {
  name: "AcarFence",
  data() {
    return {
      tabsShow: true,
      map: Object, // 地图对象
      zoom: 13, // 缩放级别
      center: [112.860257, 36.860496],
      fenceData: [],
      noRepeatFence: {},
      columns: [
        {
          id: "name",
          label: "围栏名称",
          width: 100,
        },
        {
          id: "purpose",
          label: "围栏用途",
        },
        {
          id: "radius",
          label: "围栏半径",
        },
        {
          id: "validtime",
          label: "过期时间",
          width: 100,
        },
      ],
      handle: [
        {
          function: "fencesHandle",
          text: "查看",
          type: "text",
          show: true,
        },
        // {
        //   function: "deleteHandle",
        //   text: "删除",
        //   type: "text",
        //   show: true,
        // },
      ],
    };
  },
  components: {},
  computed: {},
  created() {
    this.getFenceHandle();
  },

  mounted() {
    this.initMap();
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      let that = this;

      this.map = new AMap.Map("a-car-map", {
        zoom: this.zoom, //级别
        center: this.center, //中心点坐标
        resizeEnable: true, // 调整重绘
      });

      // 插件
      AMap.plugin(
        [
          "AMap.ToolBar",
          "AMap.Scale",
          "AMap.GraspRoad",
          "AMap.MouseTool",
          "AMap.PolyEditor",
          "AMap.CircleEditor",
        ],
        function () {
          that.map.addControl(new AMap.ToolBar({ position: "RB" }));
          that.map.addControl(new AMap.Scale());
          that.map.addControl(new AMap.GraspRoad());
          that.map.addControl(new AMap.MouseTool());
          that.map.addControl(new AMap.PolyEditor());
          that.map.addControl(new AMap.CircleEditor());
        }
      );

      this.map.setFitView();
    },

    /**
     * 围栏列表
     */
    async getFenceHandle() {
      let val = { belongguid: this.$route.query.id };
      const res = await fences({ param: val });
           this.fenceData = res.data;

      this.fenceData.map((item, index) => {
        this.fencesHandle(index, item);
      });
    },

    /**
     * 查看围栏
     */
    fencesHandle(index, row) {
      let fence = {};
      if (row.fencetype === "圆形围栏") {
        fence = this.structureCircle(row.center, row.radius);
      } else {
        fence = this.structurePolygon(row.points);
      }
      // 添加到地图上
      if (row.gid in this.noRepeatFence) {
        this.map.setFitView([fence]);
      } else {
        this.noRepeatFence[row.gid] = fence;
        this.map.add(fence);
        this.map.setFitView([fence]);
      }
    },

    /**
     * 圆形构造
     */
    structureCircle(center, radius) {
      var circle = new AMap.Circle({
        center: [center.lng, center.lat],
        radius: Number(radius), //半径
        borderWeight: 3,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        strokeStyle: "dashed",
        strokeDasharray: [10, 10],
        fillColor: "#1791fc",
        zIndex: 50,
      });
      return circle;
    },

    /**
     * 多边形构造
     */
    structurePolygon(param) {
      let path = [];
      // 构造路径
      param.map((item) => path.push([item.lng, item.lat]));
      // 构造多边形
      var polygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: "#1791fc",
        zIndex: 50,
      });
      return polygon;
    },
  },
  updated() {},
  destroyed() {
    if (!!this.map) {
      this.map.destroy();
    }
  },
};
</script>

<style lang="less" scoped>
.map_containr {
  width: 100%;
  height: 100%;
}
.a_car_map {
  height: 81.4vh;
  width: 100%;
  position: relative;
  z-index: 10;
  top: 0px;
  left: 0px;
}
.btn_group {
  position: absolute;
  z-index: 100;
  right: 10px;
  top: 10px;
}
.btn_vehicle {
  position: absolute;
  z-index: 100;
  bottom: 10px;
  left: 10px;
}
.fence_tabs {
  position: absolute;
  z-index: 100;
  top: 0;
  width: 500px;
}
</style>
