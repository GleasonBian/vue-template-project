<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>
    <el-form
      :model="form"
      status-icon
      ref="form"
      :rules="rules"
      label-width="auto"
      style="width:100%"
      lable-width="120px"
    >
      <div class="page_container">
        <!-- 基本信息 -->
        <el-card class="content_width" shadow="naver">
          <div slot="header" class="clearfix">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="调度编号" prop="code">
                <el-input :disabled="true" v-model="form.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度时间" prop="dispatchtime">
                <el-date-picker
                  v-model="form.dispatchtime"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日 HH:mm:ss"
                  default-time="12:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:100%"
                ></el-date-picker>
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
                <el-select disabled v-model="form.equip_guid" placeholder="请选择" style="width:100%">
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
                    v-for="item in projList"
                    :key="item.guid"
                    :label="item.name"
                    :value="item.guid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属公司" prop="corp_guid">
                <el-select disabled v-model="form.dept_guid" placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in projList"
                    :key="item.guid"
                    :label="item.superiorname"
                    :value="item.guid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交班部门" prop="deliver_corp_guid">
                <el-select v-model="form.deliver_corp_guid" placeholder="请选择" style="width:100%">
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
              <el-form-item label="接班部门" prop="oncoming_corp_guid">
                <el-select v-model="form.oncoming_corp_guid" placeholder="请选择" style="width:100%">
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
              <el-form-item label="司机名称" prop="driver_name">
                <el-input v-model="form.driver_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="司机长" prop="headdriver_name">
                <el-input v-model="form.headdriver_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 油耗信息 -->
        <el-card class="content_width" shadow="naver">
          <div slot="header" class="clearfix">油耗信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="接油" prop="begin_oil">
                <el-input-number v-model.number="form.begin_oil" :step=".1"></el-input-number>&nbsp;升
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接班时间" prop="begin_time">
                <el-date-picker
                  v-model="form.begin_time"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日 HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="12:00:00"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交油" prop="end_oil">
                <el-input-number v-model.number="form.end_oil" :step=".1"></el-input-number>&nbsp;升
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交班时间" prop="end_time">
                <el-date-picker
                  v-model="form.end_time"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日 HH:mm:ss"
                  default-time="12:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计油耗" prop="accum_oil">
                <el-input-number v-model.number="form.accum_oil" :step=".1"></el-input-number>&nbsp;升
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作业时长" prop="accum_working">
                <el-input
                  type="number"
                  placeholder="小时"
                  v-model.number="form.accum_working"
                  :step=".01"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="加油记录" prop="add_oil">
                <el-input-number v-model.number="form.add_oil" :step=".1"></el-input-number>&nbsp;升
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="content_width" shadow="naver">
          <div slot="header" class="clearfix">作业项目</div>
          <div>
            <div style="margin-bottom:20px">
              <el-button plain type="primary" @click="addRow">添加作业</el-button>
              <el-button plain type="danger" @click="delData">移除作业</el-button>
            </div>
            <el-table
              :data="form.WorkItem"
              ref="table"
              tooltip-effect="dark"
              border
              stripe
              style="width: 100%"
              @selection-change="selectRow"
            >
              <el-table-column type="selection" width="45" align="center"></el-table-column>
              <el-table-column label="作业项目" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.work_name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="开始时间" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.begin_time"
                    type="datetime"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日 HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="12:00:00"
                    style="width:100%"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="结束时间" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.end_time"
                    type="datetime"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日 HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="12:00:00"
                    style="width:100%"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="作业时长" align="center">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.work_duration"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="content_width" shadow="naver">
          <div slot="header" class="clearfix">检查项目</div>
          <div>
            <el-table
              :data="form.CheckItem"
              ref="table"
              tooltip-effect="dark"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column label="检查项目" prop="check_name" align="center"></el-table-column>
              <el-table-column label="是否正常" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.b_normal" placeholder="请选择" style="width:100%">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="检查情况" align="center">
                <template slot-scope="scope">
                  <el-input maxlength="500" show-word-limit v-model="scope.row.check_result"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="处理结果" align="center">
                <template slot-scope="scope">
                  <el-input maxlength="500" show-word-limit v-model="scope.row.handle_result"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
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

        <el-col :span="24" align="center" class="content_width">
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="goback">返回</el-button>
        </el-col>
      </div>
    </el-form>
  </div>
</template>
<script>
import {
  assignoffline,
  corpSelect,
  corpRank,
  equiSelect,
  getDeptList,
  editAssign,
  viewAssign
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
      counter: 0,
      code: "", //公司id，判断是否是新增
      compList: [], //上级公司列表
      projList: [], //上级公司列表
      deptList: [], //上级'部门'列表
      eqData: [], //设备列表
      worksTable: [], //工作表格
      checkTable: [], //检查表格
      selectlistRow: [], //表格选中的行

      rules: {
        dispatchtime: [
          {
            required: true,
            message: "必填 "
          }
        ],
        equip_guid: [
          {
            required: true,
            message: "必填  "
          }
        ],
        dept_guid: [
          {
            required: true,
            message: "必填  "
          }
        ],
        deliver_corp_guid: [
          {
            required: true,
            message: "必填 "
          }
        ],
        oncoming_corp_guid: [
          {
            required: true,
            message: "必填  ",
            trigger: ["blur", "change"]
          }
        ],
        driver_name: [
          {
            required: true,
            message: "必填 ",
            trigger: ["blur", "change"]
          }
        ]
      },
      form: {
        code: null, //调度编号
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
            check_name: "走行部",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "电气系统",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "制动系统",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "防溜检查",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "显示仪器",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "油、水、砂",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "机械间",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "防护用品",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "机能试验",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          },
          {
            check_name: "卫生清扫",
            b_normal: "",
            check_result: "",
            handle_result: "",
            remark: ""
          }
        ], //检查项目
        fix_recode: null, //维修保养记录
        consum_recode: null //物料消耗记录
      }
    };
  },
  created() {
    this.form.code = this.$route.query.id;
    this.getCompList();
    this.getDeptList();
    this.getProj();
    this.getEqList();
    if (this.form.code) {
      this.viewCorp(this.form.code);
    }
  },
  mounted() {},
  methods: {
    async getProj() {
      const res = await corpRank({ id: 3 });
      this.projList = res.data;
    },
    // 获取表格选中时的数据
    selectRow(val) {
      this.selectlistRow = val;
    },

    // 增加行
    addRow() {
      var list = {
        counter: this.counter,
        work_name: null,
        begin_time: this.address,
        end_time: this.name,
        work_duration: this.weather,
        remark: this.phone
      };
      this.form.WorkItem.push(list);
      this.counter++;
    },
    // 删除选中行
    delData() {
      if (!this.selectlistRow.length) {
        this.$message({ type: "warning", message: "请选择要删除的作业项目" });
        return;
      }
      for (let i = 0; i < this.selectlistRow.length; i++) {
        let val = this.selectlistRow;
        // 获取选中行的索引的方法
        // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
        // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
        val.forEach((val, index) => {
          this.form.WorkItem.forEach((v, i) => {
            if (val.counter === v.counter) {
              // i 为选中的索引
              this.form.WorkItem.splice(i, 1);
            }
          });
        });
      }
      // // 删除完数据之后清除勾选框
      // this.$refs.form.WorkItem.clearSelection();
    },

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
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.code) {
            //编辑
            this.editAssign();
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
    async editAssign() {
      const res = await editAssign(this.form);
      if (res.status === 200) {
        this.$message.success("更新成功");
        this.$router.replace({ path: "assignList" });
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
      const response = await viewAssign({
        id: guid
      });
      if (response.status === 200) {
        this.form = response.data;
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
