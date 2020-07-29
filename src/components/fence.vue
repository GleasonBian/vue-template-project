<template>
  <div class="map_containr">
    <div class="map" id="fence-map"></div>
    <div>
      <el-button-group size="mini" class="btn_group">
        <el-button type="primary" icon="iconfont i-duobianxing" @click="polygonMarksHandle"></el-button>
        <el-button type="primary" icon="iconfont i-yuanxing" @click="circleMarkHandle"></el-button>
        <el-button type="primary" icon="el-icon-view" @click="tabsShow = !tabsShow"></el-button>
      </el-button-group>
    </div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="fence_tabs"
      @tab-click="showCloneRuleslView"
      v-show="tabsShow"
    >
      <el-tab-pane label="全部" name="first">
        <gt-table
          :tableData="tableData"
          style="width: 100%"
          :optionWidth="100"
          :columns="columns"
          :selection="false"
          v-on:examineFence="examineFence"
          v-on:deleteHandle="deleteHandle"
          :handle="handle"
          size="mini"
        ></gt-table>
      </el-tab-pane>
      <el-tab-pane label="多边形围栏" name="second">
        <gt-table
          :tableData="tableDataFilter"
          style="width: 100%"
          :optionWidth="100"
          :columns="columns"
          :selection="false"
          v-on:examineFence="examineFence"
          v-on:deleteHandle="deleteHandle"
          :handle="handle"
          size="mini"
        ></gt-table>
      </el-tab-pane>
      <el-tab-pane label="圆形围栏" name="third">
        <gt-table
          :tableData="tableDataFilter"
          style="width: 100%"
          :optionWidth="100"
          :columns="columns"
          :selection="false"
          v-on:examineFence="examineFence"
          v-on:deleteHandle="deleteHandle"
          :handle="handle"
          size="mini"
        ></gt-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增 查看 更新 -->
    <el-dialog
      title="电子创建围栏"
      :visible.sync="dialogFormVisible"
      width="25%"
      @close="DialogClose('form')"
      :close-on-click-modal="true"
      top="10vh"
      center
      append-to-body
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="width:100%">
        <el-form-item label="围栏归属" prop="belongto">
          <el-select
            v-model="form.belongto"
            placeholder="请选择"
            style="width:100%"
            @change="selectHandle"
          >
            <el-option label="部门" value="部门"></el-option>
            <el-option label="车辆" value="车辆"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属公司" prop="corpguid" v-show="form.belongto=='部门'">
          <el-select
            v-model="form.corpguid"
            @change="changeDepts"
            placeholder="请选择所属公司"
            style="width:100%"
          >
            <el-option
              v-for="item in compList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="belongguid" v-show="form.corpguid">
          <el-select v-model="form.belongguid" placeholder="请选择上级部门，为空则为公司直属" style="width:100%">
            <el-option
              v-for="item in deptList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车牌号码" prop="belongguid" v-show="form.belongto=='车辆'">
          <el-select v-model="form.belongguid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in equiList"
              :key="item.guid"
              :label="item.plateno"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="围栏名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="围栏用途" prop="purpose">
          <el-select v-model="form.purpose" placeholder="请选择" style="width:100%">
            <el-option label="区域报警" value="区域报警"></el-option>
            <el-option label="往返次数计算" value="往返次数计算"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="过期时间" prop="validtime">
          <el-date-picker
            v-model="form.validtime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="ResetForm('form')">重置</el-button>
      </span>
    </el-dialog>
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
  name: "dashboard",
  data() {
    return {
      tabsShow: true,
      map: Object, // 地图对象
      zoom: 13, // 缩放级别
      center: [112.860257, 36.860496],
      /* ------------------ */
      dialogFormVisible: false, // 是否显示 新增 删除 更新 对话框
      compList: [], // 公司列表
      deptList: [], // 公司列表
      tableData: [], // 围栏列表
      equiList: [], // 设备列表
      tableDataFilter: [], // 过滤后围栏列表
      activeName: "first",
      columns: [
        {
          id: "name",
          label: "围栏名称",
          width: 100,
        },
        {
          id: "belongto",
          label: "围栏归属",
        },
        {
          id: "fencetype",
          label: "围栏类型",
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
          function: "examineFence",
          text: "查看",
          type: "text",
          show: true,
        },
        {
          function: "deleteHandle",
          text: "删除",
          type: "text",
          show: true,
        },
      ],
      form: {
        corpguid: "", // 公司标识
        belongguid: "", //围栏归属的Guid
        belongto: "", //围栏归属;值分为：部门；车辆；其它
        name: "", //围栏名称
        points: "", //多边形围栏坐标 lon1,lat1;long2,lat2;lon3,lat3;(3<=点个数<=5000);多边形围栏必填
        purpose: "", //围栏用途；值分为：区域报警；往返次数计算；其它
        validtime: "", //过期时间，过期后不对此进行维护;格式yyyy-MM-dd
      },
      rules: {
        belongto: [
          {
            required: true,
            message: "必填",
          },
        ],
        name: [
          {
            required: true,
            message: "必填",
          },
        ],
        purpose: [
          {
            required: true,
            message: "必填",
          },
        ],
        validtime: [
          {
            required: true,
            message: "必填",
          },
        ],
      },
      /* ----------------- */
      // 多边形 mark 标点事件
      polygonMarkClickEvent: null,
      // 多边形 mark 点数组
      polygonMarks: [],
      // 多边形 点 数组
      polygonPoints: [],
      // 当前构造的多边形
      polygon: {},
      polygonEditor: null,
      resPolygon: [],
      polygonCurrent: {},
      resNum: 0,
      // 重复点击验证
      repeatClickVerify: {},
      polygonListenEvent: {}, //监听事件
      /* ------圆形标记------- */
      circleClickEvent: {}, // 圆形标点事件
      circle: {}, // 当前构造的圆形
      circleEditor: {}, // 圆形编辑
      /* -------覆盖物类型----------- */
      mulchType: "polygon", // circular(圆形) / polygon(多边形)
      /* ---------整合----------------- */
      signEvent: {}, // 多边形/圆形全局标点事件
    };
  },
  components: {},
  computed: {},
  created() {
    this.fencesHandle();
    this.getCompList();
    this.getEquiList();
  },

  mounted() {
    this.initMap();
  },
  methods: {
    /**
     ** 公司列表
     */
    async getCompList() {
      const res = await corpSelect();
      this.compList = res.data;
    },

    /**
     ** 部门列表
     */
    async getDeptList(corpguid) {
      const res = await getDeptList({ param: { corpguid } });
      this.deptList = res.data;
    },

    /*
     ** 设备列表
     */
    async getEquiList() {
      const res = await equiSelect();
      this.equiList = res.data;
    },

    /**
     * 围栏列表
     */
    async fencesHandle() {
      const res = await fences();
      this.tableData = res.data;
      this.tableData.map((item, index) => {
        this.examineFence(index, item);
      });
    },

    /**
     * 删除围栏
     */
    async deleteHandle(index, row) {
      let that = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await fencesDelete({ id: row.gid });
          if (res.status === 200) {
            that.map.remove(that.repeatClickVerify[row.gid]);
            this.$message.success("删除成功");
            this.fencesHandle();
          }
        })
        .catch((err) => {});
    },

    /**
     * 圆形提交
     */
    async fencesRoundHandle() {
      const res = await fencesRound(this.form);
      if (res.status !== 200) return;
      this.fencesCreateSuccess();
    },

    /**
     * 多边形提交
     */
    async fencesPolyHandle() {
      const res = await fencesPoly(this.form);
      if (res.status !== 200) return;
      this.fencesCreateSuccess();
    },
    /**
     * 提交成功处理
     */
    fencesCreateSuccess() {
      // 设置成功消息提示
      this.$message.success("设置围栏成功!");

      // 关闭 dialog
      this.DialogClose("form");

      // 多变形 编辑关闭
      "close" in this.circleEditor ? this.polygonEditor.close() : "";

      // 圆形 编辑关闭
      "close" in this.circleEditor? this.circleEditor.close() : '';

      // 移除监听事件
      AMap.event.removeListener(this.signEvent);

      // 清空 覆盖物
      this.map.clearMap();
      // 删除 多余 提交对象
      delete this.form.center;
      delete this.form.radius;
      delete this.form.points;
      this.polygonMarks = [];
      this.polygonPoints = [];
      this.repeatClickVerify = {};

      // 重新 获取围栏列表
      this.fencesHandle();
    },
    /**
     * 切换公司 重新查询部门
     */
    changeDepts() {
      this.form.deptguid = null;
      this.getDeptList(this.form.corpguid);
    },

    /**
     * 切换选项清空
     */
    selectHandle() {
      this.form.belongguid = null;
      this.form.corpguid = null;
    },

    /**
     * form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mulchType === "polygon"
            ? this.fencesPolyHandle()
            : this.fencesRoundHandle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /**
     * form 表单 重置
     */
    ResetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * 关闭 dialog
     */
    DialogClose(Name) {
      this.dialogFormVisible = false;
      this.$refs[Name].resetFields();
    },

    /**
     * 表格过滤
     */
    showCloneRuleslView(param) {
      this.tableDataFilter = this.tableData.filter(
        (data) => data.fencetype == param.label
      );
    },

    /**
     * 初始化地图
     */
    initMap() {
      let that = this;

      this.map = new AMap.Map("fence-map", {
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
     * 多边形标点
     */
    polygonMarksHandle() {
      // circular(圆形) / polygon(多边形)
      this.mulchType = "polygon";

      // 添加新的标点事件
      this.signEventHandle();
    },

    /**
     * 圆形标点
     */
    circleMarkHandle() {
      // circular(圆形) / polygon(多边形)
      this.mulchType = "circular";

      // 添加新的标点
      this.signEventHandle();
    },

    /**
     * 多边形 / 圆形标点处理
     */
    signEventHandle() {
      // 清空地图 覆盖物
      this.map.clearMap();

      // 清空保存多边形标点数组
      this.polygonMarks = [];
      this.polygonPoints = [];

      // 移除上一个标点
      AMap.event.removeListener(this.signEvent);

      // 当前覆盖物类型
      let currentEvent;

      // 覆盖物 回调
      this.mulchType === "polygon"
        ? (currentEvent = this.polygonInstance)
        : (currentEvent = this.circleInstance);

      // 调用覆盖物方法
      this.signEvent = AMap.event.addListener(this.map, "click", currentEvent);
    },

    /**
     * 多边形实例化
     */
    polygonInstance(e) {
      // 点击时页面添加点
      this.polygonMarks.push(this.addMarker(e.lnglat));

      // 添加多边形点
      this.polygonPoints.push(e.lnglat);

      if (this.polygonMarks.length === 3) {
        // 移除多边形 mark 标点事件
        AMap.event.removeListener(this.signEvent);

        // 将点(marks) 转换为 四边形(plygon)
        this.createPolygon();

        // 清除 标点 mark
        this.clearMarks();
      }
    },

    /**
     * 实例化 marks 添加到地图上
     */
    addMarker(lnglat) {
      var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat,
      });
      marker.setMap(this.map);
      return marker;
    },

    /**
     * 创建 plygon(多边形)
     */
    createPolygon(arr) {
      let that = this;

      // 构造多边形
      this.polygon = new AMap.Polygon({
        map: that.map,
        path: that.polygonPoints,
        strokeColor: "#0000ff",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#f5deb3",
        fillOpacity: 0.35,
      });

      // 添加 双击 回调
      AMap.event.addListener(
        this.polygon,
        "dblclick",
        this.polygonDblclickCallback
      );

      // 添加 单击右键 回调
      AMap.event.addListener(
        this.polygon,
        "rightclick",
        this.polygonRightclickCallback
      );

      // 保存多边形编辑对象
      this.polygonEditor = new AMap.PolyEditor(this.map, this.polygon);

      // 打开编辑模式
      this.polygonEditor.open();

      // 设置 合适 视图大小
      that.map.setFitView([this.polygon]);
    },

    /**
     * 多边形双击回调
     */
    polygonDblclickCallback(e) {
      let obj = JSON.parse(JSON.stringify(e.target.getPath()));
      obj.map((item) => {
        delete item.Q;
        delete item.R;
      });
      // 将所得标点数据 添加到 form 表单中, 作为发送请求时带参
      this.form.points = obj;
      // 打开 dialog 框
      this.dialogFormVisible = true;
    },

    /**
     * 多边形单击右键回调
     */
    polygonRightclickCallback(e) {
      this.polygonMarks = [];
      this.polygonPoints = [];
      this.map.remove(this.polygon);
      this.polygonEditor.close();
    },

    /**
     * 移除地图上 mark (标记点)
     */
    clearMarks() {
      this.map.remove(this.polygonMarks);
    },

    /* -----------------------------圆形围栏------------------------------------ */

    /**
     * 实例化圆形标记点
     */
    circleInstance(e) {
      let that = this;

      this.circle = new AMap.Circle({
        center: [e.lnglat.lng, e.lnglat.lat],
        radius: 1000, //半径
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

      // 放置到地图上
      this.circle.setMap(this.map);

      // 设置合适大小
      this.map.setFitView([this.circle]);
      this.circleRightclickMenu();
      // 圆形编辑
      this.circleEditor = new AMap.CircleEditor(this.map, this.circle);
      this.circleEditor.open();

      // 移除 圆形 click 事件
      AMap.event.removeListener(this.signEvent);

      // 圆形添加双击事件
      this.circleDblclick = AMap.event.addListener(
        this.circle,
        "dblclick",
        this.circleDblclickHandle
      );
      
      // 半径超范围提示
      this.circleEditor.on("adjust", function (event) {
        if (event.radius > 5000) {
          that.$message.error("半径必须小于5000米");
        }
      });
    },

    /**
     * 圆形右键菜单
     */
    circleRightclickMenu() {
      let that = this;
      var contextMenu = new AMap.ContextMenu();
      contextMenu.addItem(
        "重新编辑",
        function () {
          that.circleEditor.open();
        },
        0
      );
      contextMenu.addItem(
        "删除",
        function () {
          console.log("移除");
        },
        1
      );
      that.circle.on("rightclick", function (e) {
        contextMenu.open(that.map, e.lnglat);
      });
    },

    /**
     * 圆形双击事件回调函数
     */
    circleDblclickHandle(event) {
      // 打开 dialog 框
      this.dialogFormVisible = true;
      this.mulchType = "circular";
      this.form.center = event.target.getCenter();
      this.form.radius = event.target.getRadius().toString();
    },

    /* -----------------------------查看围栏------------------------------------ */

    /**
     * 查看围栏
     */
    examineFence(index, row) {
      console.log(row);
      let fence = {};
      if (row.fencetype === "圆形围栏") {
        fence = this.structureCircle(row.center, row.radius);
      } else {
        fence = this.structurePolygon(row.points);
      }
      // 添加到地图上
      if (row.gid in this.repeatClickVerify) {
        this.map.setFitView([fence]);
      } else {
        this.repeatClickVerify[row.gid] = fence;
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
.map {
  height: 93vh;
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
.fence_tabs {
  position: absolute;
  z-index: 100;
  left: 10px;
  top: 10px;
}
</style>
