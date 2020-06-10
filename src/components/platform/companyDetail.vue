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
            <el-form-item label="公司编码" prop="guid">
              <el-input disabled v-model="form.guid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                <el-option label="运营" value="运营"></el-option>
                <el-option label="停用" value="停用"></el-option>
                <el-option label="封存" value="封存"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input maxlength="100" clearable v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司简称" prop="shortname">
              <el-input maxlength="100" v-model="form.shortname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司级别" prop="corprank">
              <el-select
                v-model="form.corprank"
                @change="changeLevel"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option label="局级" value="1"></el-option>
                <el-option label="分公司" value="2"></el-option>
                <el-option label="项目部" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.corprank!=='1'" label="上级公司" prop="superior">
              <el-select
                :disabled="form.corprank=='1'"
                v-model="form.superior"
                placeholder="请选择"
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
            <el-form-item label="所属行业" prop="corpclass">
              <el-input v-model="form.corpclass"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司类型" prop="corptype">
              <el-input v-model="form.corptype"></el-input>
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
            <el-form-item label="成立日期" prop="establishtime">
              <el-date-picker
                v-model="form.establishtime"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd hh:mm:ss"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人姓名" prop="legal">
              <el-input maxlength="100" v-model="form.legal"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactperson">
              <el-input v-model="form.contactperson"></el-input>
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
            <el-form-item label="公司电话" prop="tel">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="location">
              <el-input v-model="form.location"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="certtype">
              <el-input v-model="form.certtype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构代码" prop="orgcode">
              <el-input v-model="form.orgcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司税号" prop="taxcode">
              <el-input v-model="form.taxcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公司简介" prop="briefabout">
              <el-input type="textarea" maxlength="100" show-word-limit v-model="form.briefabout"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公司备注" prop="description">
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
  corperation,
  corpRank,
  corpDtails,
  corpUpdate,
  corpDelete
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
      form: {
        briefabout: "", //公司简介
        certguid: "", //公司组织结构代码
        certtype: "", //证件类型
        code: "", //公司编码
        corpclass: "", //所属行业
        corprank: "", //公司级别
        corptype: "", //公司类型
        description: "", //备注
        location: "", //地理信息
        name: "", //公司名称
        regdate: "", // 注册日期
        establishtime: "", // 成立日期
        superior: "", // 上级标识
        taxcode: "", // 税号
        email: "", // 公司邮箱
        contactperson: "", // 公司联系人
        legal: "", // 公司法人
        region: "", // 所在区域
        regioncode: "", //区域编码(后台存用的)
        regioncodeArr: [], //区域编码(前端用的)
        tel: "" // 公司电话
      },
      Regular: Regular, // 表单校验正则
      // 表单校验规则
      rules: {
        status: [
          {
            required: true,
            message: "必填 企业状态 "
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
            message: "必填 公司名称 "
          }
        ],
        shortname: [
          {
            required: true,
            message: "必填 公司简称"
          }
        ],
        establishtime: [
          {
            required: true,
            message: "必填 成立日期 ",
            trigger: ["blur", "change"]
          }
        ],
        code: [
          {
            required: false,
            message: "必填 公司编码 ",
            trigger: ["blur", "change"]
          }
        ],
        contactperson: [
          {
            required: true,
            message: "必填 联系人 ",
            trigger: ["blur", "change"]
          }
        ],
        legal: [
          {
            required: true,
            message: "必填 法人姓名 ",
            trigger: ["blur", "change"]
          }
        ],
        location: [
          {
            required: true,
            message: "必填 地理信息",
            trigger: ["blur", "change"]
          }
        ],
        corpclass: [
          {
            required: true,
            message: "必填 所属行业",
            trigger: ["blur", "change"]
          }
        ],
        corptype: [
          {
            required: true,
            message: "必填 公司类型",
            trigger: ["blur", "change"]
          }
        ],
        certtype: [
          {
            required: true,
            message: "必填 证件类型",
            trigger: "blur"
          }
        ],
        orgcode: [
          {
            required: true,
            message: "必填 公司组织机构代码",
            trigger: "blur"
          }
        ],
        superior: [
          {
            required: true,
            message: "必填  上级标识",
            trigger: ["blur", "change"]
          }
        ],
        taxcode: [
          {
            required: true,
            message: "必填 公司税号",
            trigger: ["blur", "change"]
          }
        ],
        description: [
          {
            required: false,
            message: "公司备注",
            trigger: ["blur", "change"]
          }
        ],
        briefabout: [
          {
            required: false,
            message: "必填 公司简介",
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
        corprank: [
          {
            required: true,
            message: "必填 公司级别",
            trigger: ["blur", "change"]
          }
        ],
        email: [
          {
            required: true,
            message: "必填 公司邮箱",
            trigger: ["blur", "change"]
          }
        ],
        tel: [
          {
            required: true,
            message: "必填 公司电话",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.guid = this.$route.query.id;
    // this.getCompList();
  },
  mounted() {
    if (this.guid) {
      this.form.code = this.guid;
      this.viewCorp(this.guid);
    }
  },
  methods: {
    recRegion(region) {
      this.form.region = region;
    },
    recRegionCode(code) {
      this.form.regioncodeArr = code;
      this.form.regioncode = JSON.stringify(code);
    },
    changeLevel() {
      let level = this.form.corprank;
      this.form.superior = ""; //重置
      this.getCompList(level - 1); //上级公司列表
    },
    goback() {
      this.$router.go(-1);
    },
    /**
     ** 公司列表查询
     */
    async getCompList(val) {
      const res = await corpRank({ id: val });
      this.compList = res.data;
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
      const res = await corpUpdate(this.form);
      if (res.status === 200) {
        this.$message.success("更新成功");
        this.$router.replace({ path: "companyList" });
      } else this.$message.warning("更新失败,稍后重试");
    },
    /*
     ** 创建公司
     */
    async submitAddUser() {
      const res = await corperation(this.form);
      if (res.status === 200) {
        this.$message.success("公司创建成功");
        this.$router.replace({ path: "companyList" });
      } else this.$message.warning("公司创建失败");
    },

    /*
     ** 查看公司
     */
    async viewCorp(guid) {
      const response = await corpDtails({
        id: guid
      });
      if (response.status === 200) {
        this.form = response.data[0];
        this.form.regioncodeArr = JSON.parse(this.form.regioncode);
        if (this.form.corprank > 1) this.getCompList(this.form.corprank - 1);
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
