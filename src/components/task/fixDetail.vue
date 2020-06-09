<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>
    <div class="formWidth">
      <el-form
        :model="form"
        status-icon
        ref="form"
        label-width="auto"
        style="width:100%"
        lable-width="120px"
      >
        <el-row :gutter="20">
          <!-- 基本信息 -->
          <el-col :span="24">
            <el-card>
              <div slot="header" class="clearfix">基本信息</div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="维修审批单号" prop="code">
                    <el-input readonly v-model="form.code"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="申请状态" prop="status">
                    <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                      <el-option label="草稿" value="草稿"></el-option>
                      <el-option label="审批中" value="审批中"></el-option>
                      <el-option label="已通过" value="已通过"></el-option>
                      <el-option label="已驳回" value="已驳回"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车辆名称" prop="equip_guid">
                    <el-select v-model="form.equip_guid" placeholder="请选择" style="width:100%">
                      <el-option
                        v-for="item in eqData"
                        :key="item.guid"
                        :label="item.name"
                        :value="item.guid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车牌号码" prop="plate_no">
                    <el-select
                      disabled
                      v-model="form.equip_guid"
                      placeholder="请选择"
                      style="width:100%"
                    >
                      <el-option
                        v-for="item in eqData"
                        :key="item.guid"
                        :label="item.plateno"
                        :value="item.guid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目名称" prop="proj_deptid">
                    <el-select v-model="form.proj_deptid" placeholder="请选择" style="width:100%">
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
                  <el-form-item label="所属公司" prop="proj_deptid">
                    <el-select
                      disabled
                      v-model="form.proj_deptid"
                      placeholder="请选择"
                      style="width:100%"
                    >
                      <el-option
                        v-for="item in compList"
                        :key="item.guid"
                        :label="item.superiorname"
                        :value="item.guid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="申请部门" prop="apply_deptid">
                    <el-select v-model="form.apply_deptid" placeholder="请选择" style="width:100%">
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
                  <el-form-item label="申请时间" prop="apply_time">
                    <el-date-picker
                      v-model="form.apply_time"
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
                  <el-form-item label="预计维修金额" prop="pre_amount">
                    <el-input type="number" v-model.number="form.pre_amount"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="预计维修时间" prop="pre_start">
                    <el-date-picker
                      v-model="form.pre_start"
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
                    <el-input type="number" v-model.number="form.real_amount"></el-input>
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
                <el-col :span="24" style="margin-top:20px">
                  <el-form-item label="需维修零部件" prop="parts">
                    <el-input type="textarea" v-model="form.parts"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" style="margin-top:20px">
                  <el-form-item label="维修申请备注" prop="remark">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <el-col v-if="form.code" style="margin-top:20px;" :span="24">
            <el-card>
              <div slot="header" class="clearfix">审批记录</div>
              <div>
                <el-table
                  :data="form.approve"
                  ref="table"
                  tooltip-effect="dark"
                  border
                  stripe
                  style="width: 100%"
                >
                  <el-table-column label="处理节点" prop="node" align="center"></el-table-column>
                  <el-table-column label="处理人" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.handler"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理时间" align="center">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.time"
                        type="datetime"
                        placeholder="选择时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="12:00:00"
                        style="width:100%"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理状态" align="center">
                    <template slot-scope="scope">
                      <el-select
                        v-if="scope.row.node=='申请部门'"
                        v-model="scope.row.state"
                        placeholder="请选择"
                        style="width:100%"
                      >
                        <el-option
                          v-for="item in status1"
                          :key="item.guid"
                          :label="item.name"
                          :value="item.guid"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-if="scope.row.node=='设备部'"
                        v-model="scope.row.state"
                        placeholder="请选择"
                        style="width:100%"
                      >
                        <el-option
                          v-for="item in status2"
                          :key="item.guid"
                          :label="item.name"
                          :value="item.guid"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-if="scope.row.node=='分管领导'"
                        v-model="scope.row.state"
                        placeholder="请选择"
                        style="width:100%"
                      >
                        <el-option
                          v-for="item in status3"
                          :key="item.guid"
                          :label="item.name"
                          :value="item.guid"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-if="scope.row.node=='项目经理'"
                        v-model="scope.row.state"
                        placeholder="请选择"
                        style="width:100%"
                      >
                        <el-option
                          v-for="item in status4"
                          :key="item.guid"
                          :label="item.name"
                          :value="item.guid"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理意见" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
          <!-- 维修记录 -->
          <el-col
            v-for="(fix,index) in form.fixrecord"
            :key="index"
            style="margin-top:20px;"
            v-if="form.code"
            :span="24"
          >
            <el-card>
              <div slot="header" class="clearfix">维修记录</div>
              <el-col :span="12">
                <el-form-item label="经办人" prop="handler">
                  <el-input readonly v-model="fix.handler"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="维修人" prop="fixer">
                  <el-input readonly v-model="fix.fixer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际维修时间" prop="real_start">
                  <el-date-picker
                    v-model="fix.real_start"
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
                  <el-input v-model.number="fix.real_amount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-top:20px">
                <el-form-item label="维修备注" prop="remark">
                  <el-input type="textarea" v-model="fix.remark"></el-input>
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
import {
  newFixPlan,
  corpDtails,
  corpRank,
  fixPlanDetail,
  editFix,
  equiSelect,
  getDeptList
} from "@/getData";
import headTop from "@/common/headTop";
import { Regular } from "@/config/verification";
export default {
  name: "companyDetail",
  components: {
    // searchBox,
    headTop
  },
  data() {
    return {
      status1: [
        { guid: "提交", name: "提交" },
        { guid: "草稿", name: "草稿" }
      ],
      status2: [
        { guid: "待审核", name: "待审核" },
        { guid: "已通过", name: "已通过" },
        { guid: "已驳回", name: "已驳回" }
      ],
      status3: [
        { guid: "待审核", name: "待审核" },
        { guid: "已通过", name: "已通过" },
        { guid: "已驳回", name: "已驳回" }
      ],
      status4: [
        { guid: "待审核", name: "待审核" },
        { guid: "已通过", name: "已通过" },
        { guid: "已驳回", name: "已驳回" }
      ],
      approve: [
        //审批记录
        {
          node: "申请部门",
          state: "",
          handler: "",
          time: "",
          remark: ""
        },
        {
          node: "设备部",
          state: "",
          handler: "",
          time: "",
          remark: ""
        },
        {
          node: "分管领导",
          state: "",
          handler: "",
          time: "",
          remark: ""
        },
        {
          node: "项目经理",
          state: "",
          handler: "",
          time: "",
          remark: ""
        }
      ], //检查项目
      counter: 0,
      code: null, //公司id，判断是否是新增
      compList: [], //上级公司列表
      deptList: [], //上级'部门'列表
      eqData: [], //设备列表
      worksTable: [], //工作表格
      checkTable: [], //检查表格
      selectlistRow: [], //表格选中的行
      form: {
        guid: null, //调度编号
        fixrecord: [
          // {
          //   handler: "经办人",
          //   fixer: "维修人",
          //   real_start: "实际维修时间",
          //   real_amount: "实际维修金额",
          //   remark: "维修备注"
          // }
        ], //维修记录
        approve: []
      }
    };
  },
  created() {
    this.form.code = this.$route.query.id;
    this.getCompList();
  },
  mounted() {
    this.getDeptList();
    this.getEqList();
    if (this.form.code) {
      this.viewCorp(this.form.code);
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    /**
     ** 公司列表查询
     */
    async getCompList(val) {
      const res = await corpRank({id:3});
      this.compList = res.data;
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
      if (this.form.code) {
        //编辑
        this.updateFix();
      } else {
        //新增
        this.submitAddUser();
      }
    },
    /*
     ** 更新公司
     */
    async updateFix() {
      const res = await editFix(this.form);
      if (res.status === 200) {
        this.$message.success("更新成功");
        this.$router.replace({ path: "fixList" });
      } else this.$message.warning("更新失败,稍后重试");
    },
    /*
     ** 创建公司
     */
    async submitAddUser() {
      const res = await newFixPlan(this.form);
      if (res.status === 200) {
        this.$message.success("维修计划创建成功");
        this.$router.replace({ path: "fixList" });
      } else this.$message.warning("维修计划创建失败");
    },

    /*
     ** 查看公司
     */
    async viewCorp(guid) {
      const response = await fixPlanDetail({
        param: { code: this.form.code }
      });
      if (response.status === 200) {
        this.form = response.data;
        if (!this.form.approve.length) {
          this.form.approve = this.approve;
        }
      } else this.$message.warning("请稍后再尝试");
    },
    async getEqList() {
      const res = await equiSelect(this.form);
      this.eqData = res.data;
    },
    async getDeptList() {
      const res = await getDeptList(this.form);
      this.deptList = res.data;
    }
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
