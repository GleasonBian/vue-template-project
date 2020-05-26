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
            <el-input v-model="alarm.class_type" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警等级">
            <el-input v-model="alarm.class_rank" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警编号">
            <el-input v-model="alarm.ID" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警时间">
            <el-input v-model="alarm.occur_time" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-position="right" label-width="80px" :model="alarm">
          <el-form-item label="告警位置">
            <el-input v-model="alarm.address " :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="告警描述">
            <el-input type="textarea" :rows="4" v-model="alarm.remark" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="card_container">
        <el-card class="card_item" style="margin-right:10px">
          <div slot="header" class="clearfix">
            <span>车辆信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-form label-position="right" label-width="80px" :model="alarm">
            <el-form-item label="车辆名称">
              <el-input v-model="alarm.name" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="车牌号码">
              <el-input v-model="alarm.plat_no" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="司机名称">
              <el-input v-model="alarm.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
              <el-input v-model="alarm.type" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-input v-model="alarm.type" :readonly="true"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="card_item">
          <div slot="header" class="clearfix">
            <span>油耗信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-form label-position="right" label-width="80px" :model="alarm">
            <el-form-item label="当前阀值">
              <el-input v-model="alarm.threshold" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="当前油量">
              <el-input v-model="alarm.actual_value" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="当前里程">
              <el-input v-model="alarm.Threshold" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="当前速度">
              <el-input v-model="alarm.ActualValue" :readonly="true"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>处理信息</span>
      </div>
      <el-form
        label-position="right"
        label-width="80px"
        :model="handle"
        :rules="rules"
        ref="handle"
      >
        <el-form-item label="处理人" prop="handle_name">
          <el-input v-model="handle.handle_name"></el-input>
        </el-form-item>
        <el-form-item label="处理时间" prop="handle_time">
          <el-date-picker
            v-model="handle.handle_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="处理结果" prop="handle_result">
          <el-radio-group v-model="handle.handle_result">
            <el-radio border label="误报" value="误报"></el-radio>
            <el-radio border label="已处理" value="已处理"></el-radio>
            <el-radio border label="向上汇报" value="向上汇报"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明" prop="handle_explain">
          <el-input type="textarea" :rows="4" v-model="handle.handle_explain"></el-input>
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
import { alarm, alarmHandle } from "@/getData";
export default {
  name: "alarm",
  data() {
    return {
      alarm: {},
      handle: {
        handle_name: "",
        handle_time: "",
        handle_result: "",
        handle_explain: ""
      },
      guid: this.$route.query.id,
      rules: {
        handle_name: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        handle_time: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        handle_result: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        handle_explain: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.alarmHandle();
  },
  methods: {
    /*
     ** 告警信息
     */
    async alarmHandle() {
      const res = await alarm({ id: this.guid });
      this.alarm = res.data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleinfo();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async handleinfo() {
      let data = Object.assign(this.alarm, this.handle);
      console.log("发送数据:", data);
      const res = await alarmHandle(data);
      if (res.data instanceof Object) {
        this.$message.success("处理成功");
        this.$router.replace({
          path: "/dashboard"
        });
      }
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
    }
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
