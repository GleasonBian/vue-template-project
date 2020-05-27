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
                  <el-form-item label="项目名称" prop="dept_guid">
                    <el-select v-model="form.dept_guid" placeholder="请选择" style="width:100%">
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
                  <el-form-item label="所属公司" prop="corp_guid">
                    <el-select
                      disabled
                      v-model="form.dept_guid"
                      placeholder="请选择"
                      style="width:100%"
                    >
                      <el-option
                        v-for="item in deptList"
                        :key="item.guid"
                        :label="item.superior"
                        :value="item.guid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="申请部门" prop="deliver_corp_guid">
                    <el-select
                      v-model="form.deliver_corp_guid"
                      placeholder="请选择"
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
                  <el-form-item label="申请时间" prop="begin_time">
                    <el-date-picker
                      v-model="form.begin_time"
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
                  <el-form-item label="预计维修金额" prop="driver_name">
                    <el-input type="number" v-model="form.driver_name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="预计维修时间" prop="headdriver_name">
                    <el-input type="number" v-model="form.headdriver_name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="实际维修金额" prop="driver_name">
                    <el-input type="number" v-model="form.driver_name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="实际维修时间" prop="headdriver_name">
                    <el-input type="number" v-model="form.headdriver_name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <el-col style="margin-top:20px;" :span="24">
            <el-card>
              <div slot="header" class="clearfix">审批记录</div>
              <div>
                <el-table
                  :data="form.CheckItem"
                  ref="table"
                  tooltip-effect="dark"
                  border
                  stripe
                  style="width: 100%"
                >
                  <el-table-column label="处理节点" prop="node" align="center"></el-table-column>
                  <el-table-column label="处理人" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.check_result"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理时间" align="center">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.begin_time"
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
                      <el-select v-model="scope.row.b_normal" placeholder="请选择" style="width:100%">
                        <el-option
                        v-for="item in scope.row.status"
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
                <el-col :span="24" style="margin-top:20px">
                  <el-form-item label="维修保养记录" prop="fix_recode">
                    <el-input type="textarea" v-model="form.fix_recode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="物料消耗记录" prop="consum_recode">
                    <el-input type="textarea" v-model="form.consum_recode"></el-input>
                  </el-form-item>
                </el-col>
              </div>
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
import { assignoffline, corpSelect, equiSelect, getDeptList } from "@/getData";
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
        dispatchtime: null, //调度时间
        equip_name: null, //车辆名称
        equip_guid: null, //车辆Guid
        plate_no: null, //车牌号码
        dept_guid: null, //项目（部门）id
        corp_guid: null, //公司guid
        deliver_corp_guid: null, //交班部门guid
        oncoming_corp_guid: null, //接班部门guid
        driver_name: null, //司机名称
        headdriver_name: null, //司机长名称
        begin_oil: null, //接油
        begin_time: null, //接班时间
        end_oil: null, //交油
        end_time: null, //交班时间
        accum_oil: null, //累计油耗
        accum_working: null, //累计工作时长
        add_oil: null, //加油记录
        WorkItem: [], //作业项目
        CheckItem: [
          {
            node: "申请部门",
            status: [
              {guid:'提交',name:'提交'},
              {guid:'草稿',name:'草稿'},
            ],
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            node: "设备部",
            status: [
              {guid:'待审核',name:'待审核'},
              {guid:'已通过',name:'已通过'},
              {guid:'已驳回',name:'已驳回'},
            ],
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            node: "分管领导",
            status: [
              {guid:'待审核',name:'待审核'},
              {guid:'已通过',name:'已通过'},
              {guid:'已驳回',name:'已驳回'},
            ],
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            node: "项目经理",
            status: [
              {guid:'待审核',name:'待审核'},
              {guid:'已通过',name:'已通过'},
              {guid:'已驳回',name:'已驳回'},
            ],
            check_result: "",
            handle_result: "",
            remark: ""
          },
        ], //检查项目
        fix_recode: null, //维修保养记录
        consum_recode: null //物料消耗记录
      }
    };
  },
  created() {
    this.guid = this.$route.query.id;
    this.getCompList();
  },
  mounted() {
    this.getDeptList();
    this.getEqList();
    if (this.guid) {
      this.viewCorp(this.guid);
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
      const res = await corpSelect();
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
      if (this.guid) {
        //编辑
        this.updateCorp();
      } else {
        //新增
        this.submitAddUser();
      }
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
      const res = await assignoffline(this.form);
      if (res.status === 200) {
        this.$message.success("调令创建成功");
        this.$router.replace({ path: "assignList" });
      } else this.$message.warning("调令创建失败");
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
        console.log(this.form);
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
