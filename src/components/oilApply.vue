<template>
  <div style="padding: 12px">
    <el-dialog title="车辆列表" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 面包屑 -->
    <headTop></headTop>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-width="80px"
      style="width:100%"
      :inline="true"
    >
      <el-card style="margin-top:12px">
        <div slot="header" class="clearfix">
          <span>加油申请</span>
        </div>
        <!-- <el-form-item label="申请单号" prop="add_oil_id" style="min-width:300px">
          <el-input disabled v-model="form.add_oil_id"></el-input>
        </el-form-item>-->
        <el-form-item label="加油数量" prop="quantity" style="min-width:300px">
          <el-input placeholder="请输入数字" type="number" v-model.number="form.quantity" :step="0.01">
            <el-button slot="append">升</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="加油单价" prop="add_oil_price" style="min-width:300px">
          <el-input
            placeholder="请输入单价"
            type="number"
            v-model.number="form.add_oil_price"
            :step="0.01"
          >
            <el-button slot="append">元</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount" style="min-width:300px">
          <el-input disabled :value="form.add_oil_price*form.quantity"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="add_oil_date" style="min-width:300px">
          <el-date-picker
            v-model="form.add_oil_date"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="state" style="min-width:300px">
          <el-select v-model="form.state" placeholder="请选择" style="width:100%">
            <el-option label="草稿" value="草稿"></el-option>
            <el-option label="审批中" value="审批中"></el-option>
            <el-option label="已通过" value="已通过"></el-option>
            <el-option label="已驳回" value="已驳回"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司" prop="company" style="min-width:300px">
          <el-select v-model="form.company" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in compList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请部门" prop="apply_dept" style="min-width:300px">
          <el-select v-model="form.apply_dept" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in deptList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="item_name" style="min-width:300px">
          <el-select v-model="form.item_name" placeholder="请选择" style="width:100%">
            <el-option label="太焦项目" value="太焦项目"></el-option>
          </el-select>
        </el-form-item>
      </el-card>
    </el-form>
    <el-card style="margin-top:12px">
      <div slot="header" class="clearfix">
        <span>车辆添加</span>
        <el-button type="text" style="margin-left:12px" @click="dialogVisible=true">添加车辆</el-button>
        <el-button type="text" style="margin-left:12px">移除车辆</el-button>
      </div>
      <el-table
        :data="tableData"
        @row-click="clickRowHandle"
        ref="oilTable"
        highlight-current-row
        style="width:100%;"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="序号" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="车辆名称" align="center"></el-table-column>
        <el-table-column prop="name" label="车牌号码" align="center"></el-table-column>
        <el-table-column prop="name" label="加油地点" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.address"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="加油地点" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.address"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="加油标号" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.corp_guid" placeholder="请选择" style="width:100%">
              <el-option label="#95" value="#95"></el-option>
              <el-option label="#92" value="#92"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="单位" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.corp_guid" placeholder="请选择" style="width:100%">
              <el-option label="升" value="升"></el-option>
              <el-option label="桶" value="桶"></el-option>
              <el-option label="吨" value="吨"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="加油数量" align="center">
          <template slot-scope="scope">
            <el-input type="number" step="0.01" v-model.number="scope.number" autocomplete="off"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="是否加急" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.value"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="优先顺序" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.value"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="优先顺序" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.value"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin-top:12px">
      <div slot="header" class="clearfix">
        <span>审批记录</span>
      </div>
      <el-table
        :data="tableData"
        @row-click="clickRowHandle"
        ref="oilTable"
        highlight-current-row
        style="width:100%;"
      >
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="处理节点" align="center"></el-table-column>
        <el-table-column prop="name" label="处理人" align="center"></el-table-column>
        <el-table-column prop="name" label="处理时间" align="center"></el-table-column>
        <el-table-column prop="name" label="处理状态" align="center"></el-table-column>
        <el-table-column prop="name" label="处理意见" align="center"></el-table-column>
      </el-table>
    </el-card>
    <el-col align="center" style="margin-top:12px">
      <el-button type="primary" @click="submitForm('handle')">立即处理</el-button>
      <el-button @click="resetForm('handle')">重置</el-button>
    </el-col>
  </div>
</template>
<script>
import { getCompList, getDeptList } from "@/getData";
import headTop from "@/common/headTop";
import { Regular } from "@/config/verification";
export default {
  name: "companyDetail",
  components: {
    headTop
  },
  data() {
    return {
      guid: null, //公司id，判断是否是新增
      compList: [], // 公司列表
      deptList: [], // 部门列表
      form: {
        company: "", // 所属公司
        quantity: "", // 加油数量
        amount: "", // 加油金额
        add_oil_date: "", // 申请时间
        apply_state: "", // 申请状态
        item_name: "太焦项目", // 项目名称
        apply_dept: "", // 申请部门
        add_oil_price: ""
        // add_oil_id: "", // 加油申请单号 自动生成 生成规则: 年月日-编号（20200509-003）
      },
      dialogVisible: false,
      Regular: Regular, // 表单校验正则
      // 表单校验规则
      rules: {
        status: [
          {
            required: true,
            message: "企业状态 必填"
          }
        ],
        name: [
          {
            required: true,
            message: "公司名称 必填"
          }
        ],
        shortname: [
          {
            required: true,
            message: "公司简称 必填"
          }
        ],
        code: [
          {
            required: true,
            message: "公司编码 邮箱",
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
        certguid: [
          {
            required: true,
            message: "必填 公司组织机构代码",
            trigger: "blur"
          }
        ],
        superior: [
          {
            required: false,
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
      },
      tableData: []
    };
  },
  created() {
    this.getCompList();
    this.getDeptList();
  },
  mounted() {},
  methods: {
    /**
     ** 公司列表查询
     */
    async getCompList() {
      const res = await getCompList();
      this.compList = res.data;
    },

    /**
     ** 公司列表查询
     */
    async getDeptList() {
      const res = await getDeptList();
      this.deptList = res.data;
    },

    /*
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 创建公司
     */
    async submitAddUser(info) {
      const res = await corperation(this.form);
      if (res.status === 200) {
        this.getData();
        this.$message.success("公司创建成功");
      } else this.$message.warning("公司创建失败");
      this.dialogFormVisible = false;
    },

    /*
     ** 查看公司
     */
    async clickRowHandle(row) {
      // const response = await corpDtails({
      //   id: guid
      // });
      // if (response.status === 200) {
      //   this.form = response.data[0];
      //   console.log(this.form);
      // } else this.$message.warning("请稍后再尝试");
    },

    /*
     ** 表格多选
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /*
     ** 关闭dialog
     */
    handleClose() {}
  }
};
</script>
<style lang="less" scoped>
.formWidth {
  width: 980px;
  padding: 20px 15px;
  margin: 0 auto;
}
</style>
