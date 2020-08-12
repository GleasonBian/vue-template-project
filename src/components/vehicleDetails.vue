<template>
  <el-container style="width:100%; height:100%">
    <el-header style="padding:0px">
      <gt-header></gt-header>
    </el-header>
    <el-container>
      <el-aside
        style="border-right:3px solid #E4E7ED; margin-right:5px; padding:0px 12px"
        id="aside_vehicle"
      >
        <el-card :body-style="{ padding: '0px' }">
          <el-image style="width:100%; height:200px" :src="baseurl + form.mainImage" fit="cover"></el-image>
          <div style="padding: 14px;">
            <span>{{ form.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ form.plateno }}</time>
              <time class="button time">{{ form.equip_no }}</time>
            </div>
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-main style="padding-top:0px">
          <el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%">
            <el-tab-pane label="基本信息" name="first">
              <div class="Vehicle">
                <Vehicle ref="Vehicle" @deviceInfo="deviceInfo" :disable="true"></Vehicle>
              </div>
            </el-tab-pane>
            <el-tab-pane label="油耗统计" name="fourth">
              <Amachine></Amachine>
            </el-tab-pane>
            <el-tab-pane label="历史轨迹" name="second">
              <HistoryTrack></HistoryTrack>
            </el-tab-pane>
            <el-tab-pane label="电子围栏" name="third">
              <ACarFence></ACarFence>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import Vehicle from "@/components/vehicle";
import HistoryTrack from "@/components/track2";
import ACarFence from "@/components/ACarFence";
import Amachine from "@/components/Amachine";
export default {
  name: "vehicleDetails",
  data() {
    return {
      activeName: "first",
      form: {},
      baseurl:
        process.env.VUE_APP_TITLE === "local"
          ? process.env.VUE_APP_PROXY
          : process.env.VUE_APP_URL,
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 告警信息
     */
    async alarmHandle() {},
    /**
     * 标签页切换
     */
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    deviceInfo(data) {
      this.form = data;
    },
  },
  watch: {},
  components: {
    Vehicle,
    HistoryTrack,
    ACarFence,
    Amachine,
  },
  updated() {
    this.form = this.$refs.Vehicle.form;
  },
};
</script>
<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.Vehicle {
  /* overflow-y: auto;
  height: 80vh; */
}
</style>
