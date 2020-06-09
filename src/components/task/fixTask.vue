<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>
    <div class="page_container">
      <el-form
        :model="form"
        status-icon
        ref="form"
        label-width="auto"
        style="width:100%"
        lable-width="120px"
      >
        <el-row :gutter="20">
          <!-- 维修记录 -->
          <el-col style="margin-top:20px;" :span="24">
            <el-card>
              <div slot="header" class="clearfix">维修记录</div>
              <el-col :span="12">
                <el-form-item label="经办人" prop="handler">
                  <el-input v-model="form.handler"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="维修人" prop="fixer">
                  <el-input v-model="form.fixer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际维修时间" prop="real_start">
                  <el-date-picker
                    v-model="form.real_start"
                    type="datetime"
                    placeholder="选择日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="12:00:00"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际维修金额" prop="real_amount">
                  <el-input v-model.number="form.real_amount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-top:20px">
                  <el-form-item label="维修备注" prop="remark">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                  </el-form-item>
                </el-col>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;margin-top:20px">
            <el-button type="primary" @click="submitForm('form')">保存</el-button>
            <el-button @click="goback">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { fixTask } from "@/getData";
import headTop from "@/common/headTop";
import { Regular } from "@/config/verification";
export default {
  name: "fixTask",
  components: {
    // searchBox,
    headTop
  },
  data() {
    return {
      form: {
        code: null, //调度编号
        
      }
    };
  },
  created() {
    this.form.code = this.$route.query.id;
  },
  mounted() {
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },

    /*
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {

      //   } else {
      //     this.$message.error("请正确填写红框内容");
      //     return false;
      //   }
      // });
      
        //新增
        this.submitAddUser();
    },
    
    /*
     ** 创建公司
     */
    async submitAddUser() {
      const res = await fixTask(this.form);
      if (res.status === 200) {
        this.$message.success("维修任务创建成功");
        this.$router.replace({ path: "fixList" });
      } else this.$message.warning("维修任务创建失败");
    },

 
  }
};
</script>
<style lang="less" scoped>
.formWidth {
  width: 100%;

  box-sizing: border-box;
  padding: 20px 15px;
}
</style>
