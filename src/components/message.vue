<template>
  <el-main>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="历史消息" name="first" class="el-tab-pane">
        <el-tabs tab-position="left" style="height:100%">
          <el-tab-pane label="全部消息">
            <gt-table
              :tableData="msgList"
              style="width: 100%"
              :optionWidth="100"
              :columns="columns"
              :selection="false"
              v-on:examineFence="examineFence"
             
              :handle="handle"
              size="mini"
              height="100%"
            ></gt-table>
          </el-tab-pane>
          <el-tab-pane label="超速报警">
            <gt-table
              :tableData="speedList"
              style="width: 100%"
              :optionWidth="100"
              :columns="columns"
              :selection="false"
              v-on:examineFence="examineFence"
              :handle="handle"
              size="mini"
            ></gt-table>
          </el-tab-pane>
          <el-tab-pane label="油耗报警">
            <gt-table
              :tableData="fuelList"
              style="width: 100%"
              :optionWidth="100"
              :columns="columns"
              :selection="false"
              v-on:examineFence="examineFence"
              :handle="handle"
              size="mini"
            ></gt-table>
          </el-tab-pane>
          <el-tab-pane label="区域报警">
            <gt-table
              :tableData="areaList"
              style="width: 100%"
              :optionWidth="100"
              :columns="columns"
              :selection="false"
              v-on:examineFence="examineFence"
              :handle="handle"
              size="mini"
            ></gt-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- <el-tab-pane label="设备消息" name="second">配置管理</el-tab-pane> -->
    </el-tabs>
  </el-main>
</template>

<script>
import { equipAlarm, alarms } from "@/getData";
export default {
  name: "message",
  components: {},
  data() {
    return {
      activeName: "first",
      msgList: [], // 消息列表
      speedList: [],
      fuelList: [],
      areaList: [],
      columns: [
        {
          id: "ID",
          label: "告警编号",
        },
        {
          id: "alarm_name",
          label: "告警名称",
        },
        {
          id: "class_rank",
          label: "告警等级",
        },
        {
          id: "class_type",
          label: "告警类型",
        },
        {
          id: "plat_no",
          label: "车牌号码",
        },
        {
          id: "name",
          label: "车辆名称车",
        },
        {
          id: "occur_time",
          label: "告警时间",
        },
        {
          id: "location",
          label: "地理位置",
          width: 480
        },
      ],
      handle: [
        {
          function: "examineFence",
          text: "查看",
          type: "text",
          show: true,
        },
      ],
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    },
  },
  created() {
    this.initHandle();
  },
  mounted() {},
  methods: {
    async initHandle() {
      this.speedList = [];
      this.fuelList = [];
      this.areaList = [];
      const res = await alarms();
      let data = res.data.reverse();
      data.map((item) => {
        if (item.class_type == "超速报警") this.speedList.push(item);
        if (item.class_type == "油耗报警") this.fuelList.push(item);
        if (item.class_type == "区域报警") this.areaList.push(item);
      });
      this.msgList = data;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    examineFence(index,data) {
      console.log(index,data)
      this.$router.push({
        path: "/platform/Alarm",
        query: {
          id: data.ID,
        },
      });
    },
    deleteHandle() {},
  },
  computed: {},
  destroyed() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.mar_pad {
  padding: 0px;
  margin: 0px;
}
.el-tab-pane {
  height: 83.3vh;
}
</style>
