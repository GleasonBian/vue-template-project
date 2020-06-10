<template>
  <div class="page_container">
    <!-- 面包屑 -->
    <headTop></headTop>

    <el-card class="content_width">
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
            <el-form-item label="部门名称" prop="name">
              <el-input maxlength="100" clearable v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门简称" prop="shortname">
              <el-input maxlength="100" v-model="form.shortname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属公司" prop="corp_guid">
              <el-select
                v-model="form.corp_guid"
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
            <el-form-item label="上级部门" prop="superior">
              <el-select v-model="form.superior" placeholder="请选择上级部门，为空则为公司直属" style="width:100%">
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
            <el-form-item label="部门状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="停用" value="停用"></el-option>
                <el-option label="封存" value="封存"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在区域" prop="regioncodeArr">
              <sel-area
                v-model="form.regioncodeArr"
                :modelArr="form.regioncodeArr"
                :isAll="false"
                :isClear="false"
                @region="recRegion"
                @regionCode="recRegionCode"
              ></sel-area>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="location">
              <el-input v-model="form.location"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门简介" prop="briefabout">
              <el-input type="textarea" maxlength="100" show-word-limit v-model="form.briefabout"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" maxlength="100" show-word-limit v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-col :span="24" align="center" style="margin-top:12px">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
      <el-button @click="goback">返回</el-button>
    </el-col>
  </div>
</template>
<script>
import {
  corpSelect,
  getDeptList,
  getDeptDetail,
  editDeptDetail,
  saveAddDept
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
      form: {
        briefabout: "", //公司简介
        description: "", //备注
        location: "", //地理信息
        name: "", //公司名称
        regdate: "", // 注册日期
        superior: "", // 上级标识
        region: "", // 所在区域
        regioncode: "", //区域编码(后台存用的)
        regioncodeArr: [] //区域编码(前端用的)
      },
      Regular: Regular, // 表单校验正则
      // 表单校验规则
      rules: {
        status: [
          {
            required: true,
            message: "必填 部门状态 "
          }
        ],
        regioncodeArr: [
          {
            required: true,
            message: "必填 所在区域 "
          }
        ],
        name: [
          {
            required: true,
            message: "必填 部门名称 "
          }
        ],
        shortname: [
          {
            required: true,
            message: "必填 部门简称"
          }
        ],

        location: [
          {
            required: true,
            message: "必填 地理信息",
            trigger: ["blur", "change"]
          }
        ],

        corp_guid: [
          {
            required: true,
            message: "必填 所属公司",
            trigger: ["blur", "change"]
          }
        ],
        description: [
          {
            required: false,
            message: "备注",
            trigger: ["blur", "change"]
          }
        ],
        briefabout: [
          {
            required: false,
            message: "必填 简介",
            trigger: ["blur", "change"]
          }
        ],
        regdate: [
          {
            required: true,
            message: "必填 注册日期",
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
      let corpguid = this.form.corp_guid;
      this.form.superior = null;
      this.getDeptList(corpguid);
    },
    recRegion(region) {
      this.form.region = region;
    },
    recRegionCode(code) {
      this.form.regioncodeArr = code;
      this.form.regioncode = JSON.stringify(code);
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
      const res = await editDeptDetail(this.form);
      if (res.status === 200) {
        this.$message.success("更新成功");
        this.$router.replace({ path: "deptList" });
      } else this.$message.warning("更新失败,稍后重试");
    },
    /*
     ** 创建公司
     */
    async submitAddUser() {
      const res = await saveAddDept(this.form);
      if (res.status === 200) {
        this.$message.success("创建成功");
        this.$router.replace({ path: "deptList" });
      } else this.$message.warning("创建失败");
    },

    /*
     ** 查看公司
     */
    async viewCorp(guid) {
      const response = await getDeptDetail({
        id: guid
      });
      if (response.status === 200) {
        this.form = response.data[0];
        this.form.regioncodeArr = JSON.parse(this.form.regioncode);
        if (this.form.corprank > 1) this.getCompList(this.form.corprank - 1);
        this.getDeptList(this.form.corp_guid);
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
