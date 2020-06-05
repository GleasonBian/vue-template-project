<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>
    <div style="margin:15px">
      <el-card>
        <el-form
          :model="form"
          status-icon
          :rules="rules"
          ref="form"
          label-width="80px"
          style="width:100%"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="人员名称" prop="name">
                <el-input maxlength="100" clearable v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人员状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="停用" value="停用"></el-option>
                  <el-option label="封存" value="封存"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册日期" prop="regdate">
                <el-date-picker
                  v-model="form.regdate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="hiredate">
                <el-date-picker
                  v-model="form.hiredate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属公司" prop="corpguid">
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="deptguid">
                <el-select
                  v-model="form.deptguid"
                  placeholder="请选择上级部门，为空则为公司直属"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in deptList"
                    :key="item.guid"
                    :label="item.name"
                    :value="item.guid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位名称" prop="postname">
                <el-input maxlength="100" clearable v-model="form.postname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直接主管" prop="superiorid">
                <el-select v-model="form.superiorid" placeholder="请选择直接主管" style="width:100%">
                  <el-option
                    v-for="item in staffList"
                    :key="item.guid"
                    :label="item.name"
                    :value="item.guid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phonenum">
                <el-input v-model="form.phonenum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录账号" prop="userid">
                <el-input v-model="form.userid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="form.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件类型" prop="certtype">
                <el-select v-model="form.certtype" placeholder="请选择直接主管" style="width:100%">
                  <el-option label="身份证" value="身份证"></el-option>
                  <el-option label="军官证" value="军官证"></el-option>
                  <el-option label="护照" value="护照"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码" prop="certguid">
                <el-input v-model="form.certguid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="员工介绍" prop="description">
                <el-input
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  v-model="form.description"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" maxlength="100" show-word-limit v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align:center">
              <el-button type="primary" @click="submitForm('form')">保存</el-button>
              <el-button @click="goback">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  corpSelect,
  getStaffList,
  getDeptList,
  getStaffDetail,
  editStaffDetail,
  saveAddStaff
} from "@/getData";
import headTop from "@/common/headTop";
import selArea from "@/common/gtArea";
import { Regular } from "@/config/verification";
export default {
  name: "companyDetail",
  components: {
    selArea,
    headTop
  },
  data() {
    return {
      guid: null, //公司id，判断是否是新增
      compList: [], //上级公司列表
      deptList: [], //上级部门列表
      staffList: [], //直属领导列表
      form: {
        corpguid: "",
        deptguid: "",
        briefabout: "", //公司简介
        description: "", //备注
        location: "", //地理信息
        name: "", //公司名称
        certtype: "身份证", //证件类型
        regdate: "", // 注册日期
        superior: "" // 上级标识
      },
      Regular: Regular, // 表单校验正则
      // 表单校验规则
      rules: {
        postname: [
          {
            required: true,
            message: "必填 岗位名称 "
          }
        ],
        userid: [
          {
            required: true,
            message: "必填 登录账号 "
          }
        ],
        password: [
          {
            required: true,
            message: "必填 登录密码 "
          }
        ],
        status: [
          {
            required: true,
            message: "必填 人员状态 "
          }
        ],
        name: [
          {
            required: true,
            message: "必填 人员名称 "
          }
        ],
        corp_guid: [
          {
            required: true,
            message: "必填 所属公司",
            trigger: ["blur", "change"]
          }
        ],
        regdate: [
          {
            required: true,
            message: "必填 注册日期",
            trigger: ["blur", "change"]
          }
        ],
        hiredate: [
          {
            required: true,
            message: "必填 入职时间",
            trigger: ["blur", "change"]
          }
        ],
        certtype: [
          {
            required: true,
            message: "必填 证件类型",
            trigger: ["blur", "change"]
          }
        ],
        certguid: [
          {
            required: true,
            message: "必填 证件号码",
            trigger: ["blur", "change"]
          }
        ],
        phonenum: [
          {
            required: true,
            message: "必填 手机号码",
            trigger: ["blur", "change"]
          }
        ],
        email: [
          {
            required: true,
            message: "必填 工作邮箱",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.guid = this.$route.query.id;
    if (this.guid) {
      this.viewCorp(this.guid);
    }
    this.getCompList();
  },
  mounted() {},
  methods: {
    changeDepts() {
      let corpguid = this.form.corpguid;
      this.form.deptguid = null;
      this.form.superior = null;
      this.getDeptList(corpguid);
      this.getStuffList();
    },
    goback() {
      this.$router.go(-1);
    },
    /**
     ** 公司列表查询
     */
    async getCompList() {
      const res = await corpSelect();
      this.compList = res.data;
    },
    /**
     **部门列表查询
     */
    async getDeptList(corpguid) {
      const res = await getDeptList({ param: { corpguid } });
      this.deptList = res.data;
    },
    /**
     **人员列表查询
     */
    async getStuffList() {
      let corpguid = this.form.corpguid;
      const res = await getStaffList({ param: { corpguid } });
      this.staffList = res.data;
    },

    /*
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.guid) {
            //编辑
            this.updateCorp();
          } else {
            //新增
            this.submitAddUser();
          }
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },
    /*
     ** 更新公司
     */
    async updateCorp() {
      const res = await editStaffDetail(this.form);
      if (res.status === 200) {
        this.$message.success("更新成功");
        this.$router.replace({ path: "staffList" });
      } else this.$message.warning("更新失败,稍后重试");
    },
    /*
     ** 创建公司
     */
    async submitAddUser() {
      const res = await saveAddStaff(this.form);
      if (res.status === 200) {
        this.$message.success("创建成功");
        this.$router.replace({ path: "staffList" });
      } else this.$message.warning("创建失败");
    },

    /*
     ** 查看公司
     */
    async viewCorp(guid) {
      const response = await getStaffDetail({
        id: guid
      });
      if (response.status === 200) {
        this.form = response.data;
        
      this.getCompList();
      this.getDeptList(this.form.corpguid);
      this.getStuffList();
      } else this.$message.warning("请稍后再尝试");
    }
  }
};
</script>
<style lang="less" scoped>
.formWidth {
  width: 980px;
  padding: 20px 15px;
}
</style>
