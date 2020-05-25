<template>
  <div class="container">
    <div class="box-card">
      <el-card style="margin-bottom:10px">
        <div slot="header" class="clearfix">
          <span style="color:#fe9901">告警信息</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <el-form :inline="true" label-position="right" label-width="80px" :model="alarm">
          <el-form-item label="告警类型">
            <el-input v-model="alarm.name" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警编号">
            <el-input v-model="alarm.name" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警时间">
            <el-input v-model="alarm.region" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-position="right" label-width="80px" :model="alarm">
          <el-form-item label="告警位置">
            <el-input v-model="alarm.region" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警描述">
            <el-input type="textarea" :rows="4" v-model="alarm.region" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="card_container">
        <el-card class="card_item" style="margin-right:10px">
          <div slot="header" class="clearfix">
            <span>车辆信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-form label-position="right" label-width="80px" :model="vehicle">
            <el-form-item label="车辆名称">
              <el-input v-model="vehicle.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="车牌号码">
              <el-input v-model="vehicle.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="司机名称">
              <el-input v-model="vehicle.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
              <el-input v-model="vehicle.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-input v-model="vehicle.type" :readonly="true"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="card_item">
          <div slot="header" class="clearfix">
            <span>油耗信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-form label-position="right" label-width="80px" :model="fuelcons">
            <el-form-item label="当前油量">
              <el-input v-model="fuelcons.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="当前里程">
              <el-input v-model="fuelcons.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="当前速度">
              <el-input v-model="fuelcons.type" :readonly="true"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>处理信息</span>
      </div>
      <el-form label-position="right" label-width="80px" :model="handle">
        <el-form-item label="处理人">
          <el-input v-model="handle.name"></el-input>
        </el-form-item>
        <el-form-item label="处理时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="handle.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" align="center">--</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="handle.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio-group v-model="handle.result">
            <el-radio border label="误报"></el-radio>
            <el-radio border label="已处理"></el-radio>
            <el-radio border label="向上汇报"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input type="textarea" :rows="4" v-model="handle.explain"></el-input>
        </el-form-item>
        <!-- <el-form-item label="现场图片">
          <el-input v-model="formLabelAlign.type"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="submitForm('handle')">立即处理</el-button>
          <el-button @click="resetForm('handle')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { delRole } from "@/getData";
export default {
  name: "alarm",
  data() {
    return {
      alarm: {}, // 告警信息
      vehicle: {}, // 车辆信息
      fuelcons: {}, // 油耗信息
      handle: {
        date: "",
        time: "",
        result: "",
        explain: ""
      } // 处理信息
    };
  },
  created() {},
  methods: {
    /*
     ** 告警信息
     */
    async resetDept(cid) {},
    submitForm() {},
    resetForm() {}
  }
};
</script>
<style>
.container {
  padding: 24px 0px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}
.card_container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 400px;
}
.card_item {
  width: 50%;
  height: 100%;
}
.box-card {
  width: 48%;
  min-height: 500px;
}
</style>
