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
          <el-image style="width:100%; height:200px" src="url" fit="cover">
           
          </el-image>
          <div style="padding: 14px;">
            <span>车辆名称</span>
            <div class="bottom clearfix">
              <time class="time">{{ '车辆编号' }}</time>
              <!-- <el-button type="text" class="button">操作按钮</el-button> -->
            </div>
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-main style="padding-top:0px">
          <el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%">
            <el-tab-pane label="基本信息" name="first"><vehicle></vehicle></el-tab-pane>
            <el-tab-pane label="历史轨迹" name="second"><historyTrack></historyTrack></el-tab-pane>
            <el-tab-pane label="电子围栏" name="third"><ACarFence></ACarFence></el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import {} from "@/getData";
import vehicle from '@/components/vehicle'
import historyTrack from '@/components/track2'
import ACarFence from '@/components/ACarFence'
export default {
  name: "vehicleDetails",
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  mounted(){
  },
  methods: {
    /**
     * 告警信息
     */
    async alarmHandle() {},
    /**
     * 标签页切换
     */
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  watch: {},
  components:{
      vehicle,
      historyTrack,
      ACarFence,
  }
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

</style>
