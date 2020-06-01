<template>
  <div style="padding: 12px">
    <headTop></headTop>
    <div class="add_apply">
      <el-card style="margin-top:12px;margin-right:12px;width:30%">
        <div slot="header" class="clearfix">
          <span>加油申请</span>
        </div>
        <el-form
          :model="form"
          status-icon
          :rules="rules"
          ref="form"
          label-width="80px"
          style="width:100%"
        >
          <el-form-item label="加油数量" prop="quantity">
            <el-input placeholder="请输入数字" type="number" v-model.number="form.quantity" :step="0.01">
              <el-button slot="append">升</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="加油金额" prop="amount">
            <el-input placeholder="请输入加油金额" type="number" v-model.number="form.amount" :step="0.01">
              <el-button slot="append">元</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="申请时间" prop="apply_date">
            <el-date-picker
              v-model="form.apply_date"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="申请状态" prop="apply_state">
            <el-select v-model="form.apply_state" placeholder="请选择" style="width:100%">
              <el-option label="草稿" value="草稿"></el-option>
              <el-option label="审批中" value="审批中"></el-option>
              <el-option label="已通过" value="已通过"></el-option>
              <el-option label="已驳回" value="已驳回"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司" prop="company">
            <el-select v-model="form.company" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in compList"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目部" prop="project_dept">
            <el-select v-model="form.project_dept" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in deptList"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请部门" prop="apply_dept">
            <el-select v-model="form.apply_dept" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in deptList"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否加急" prop="urgent">
            <el-switch
              v-model="form.urgent"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              active-value="是"
              inactive-value="否"
            ></el-switch>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-top:12px; width:70%">
        <div slot="header" class="clearfix">
          <span>审批记录</span>
        </div>
        <el-table
          :data="form.approval"
          @row-click="clickRowHandle"
          ref="approvalTable"
          highlight-current-row
          style="width:100%;"
          size="mini"
        >
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="node" label="处理节点" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.node" :readonly="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="handler" label="处理人" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.handler" placeholder="请输入处理人"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="处理时间" align="center">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.time"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="处理状态" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.state" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in scope.row.option"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="opinion" label="处理意见" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.opinion" placeholder="请输入处理意见"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-card style="margin-top:12px">
      <div slot="header" class="clearfix">
        <span>车辆添加</span>
        <el-button type="text" style="margin-left:12px" @click="addRow">添加车辆</el-button>
        <el-button type="text" style="margin-left:12px" @click="delData">移除车辆</el-button>
      </div>
      <el-table
        :data="form.vehicle"
        @row-click="clickRowHandle"
        ref="oilTable"
        highlight-current-row
        style="width:100%;"
        stripe
        border
        @selection-change="selectRow"
        size="mini"
      >
        <el-table-column type="selection" label="序号" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="guid" label="车牌号码" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.guid"
              placeholder="请选择"
              style="width:100%"
              @change="selectHandle"
            >
              <el-option
                v-for="item in equiList"
                :key="item.guid"
                :label="item.plateno"
                :value="item.guid"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="oil_address" label="加油地点" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.oil_address"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="oil_grade" label="加油标号" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.oil_grade" placeholder="请选择" style="width:100%">
              <el-option label="#95" value="#95"></el-option>
              <el-option label="#92" value="#92"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="加油数量" align="center">
          <template slot-scope="scope">
            <el-input
              type="number"
              step="0.01"
              v-model.number="scope.row.quantity"
              autocomplete="off"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="油量单位" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.unit" placeholder="请选择" style="width:100%">
              <el-option label="升" value="升"></el-option>
              <el-option label="桶" value="桶"></el-option>
              <el-option label="吨" value="吨"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="urgent" label="是否加急" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.urgent"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              active-value="是"
              inactive-value="否"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先顺序" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.priority" placeholder="请选择" style="width:100%">
              <el-option label="一级" value="一级"></el-option>
              <el-option label="二级" value="二级"></el-option>
              <el-option label="三级" value="三级"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-col align="center" style="margin-top:12px">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-col>
  </div>
</template>
<script>
import {
  getCompList,
  getDeptList,
  equiSelect,
  offlineoildetail, // 加油申请创建
  oilApplyDetail // 加油申请查看
} from "@/getData";
import headTop from "@/common/headTop";
export default {
  name: "companyDetail",
  components: {
    headTop
  },
  data() {
    return {
      counter: 0,
      guid: null, //公司id，判断是否是新增
      compList: [], // 公司列表
      deptList: [], // 部门列表
      equiList: [],
      form: {
        company: "", // 所属公司
        quantity: "", // 加油数量
        amount: "", // 加油金额
        apply_date: "", // 申请时间
        apply_state: "", // 申请状态
        project_dept: "", // 项目部
        apply_dept: "", // 申请部门
        urgent: "是", // 是否加急
        approval: [
          {
            node: "申请部门",
            handler: "",
            time: "",
            state: "",
            opinion: "",
            option: [
              {
                label: "提交",
                value: "提交"
              },
              {
                label: "草稿",
                value: "草稿"
              }
            ]
          },
          {
            node: "审核部门",
            handler: "",
            time: "",
            state: "",
            opinion: "",
            option: [
              {
                label: "待审核",
                value: "待审核"
              },
              {
                label: "已通过",
                value: "已通过"
              },
              {
                label: "已驳回",
                value: "已驳回"
              }
            ]
          },
          {
            node: "接收部门",
            handler: "",
            time: "",
            state: "",
            opinion: "",
            option: [
              {
                label: "待审核",
                value: "待审核"
              },
              {
                label: "已通过",
                value: "已通过"
              },
              {
                label: "已驳回",
                value: "已驳回"
              }
            ]
          }
        ],
        vehicle: []
      },
      // 表单校验规则
      rules: {
        company: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        quantity: [
          {
            required: true,
            message: "必填 ",
            trigger: ["blur", "change"]
          }
        ],
        amount: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        apply_date: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        apply_state: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        project_dept: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        apply_dept: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ]
      },
      selectlistRow: []
    };
  },
  created() {
    this.getCompList();
    this.getDeptList();
    this.getEquiList();
  },
  mounted() {
    this.oilApplyCheck();
  },
  methods: {
    /**
     ** 公司列表
     */
    async getCompList() {
      const res = await getCompList();
      this.compList = res.data;
    },

    /**
     ** 部门列表
     */
    async getDeptList() {
      const res = await getDeptList();
      this.deptList = res.data;
    },

    /*
     ** 设备列表
     */
    async getEquiList() {
      const res = await equiSelect();
      console.log("设备列表", res.data);
      this.equiList = res.data;
    },

    /*
     ** 表格单机行 处理方法
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
     ** 增加行
     */
    addRow() {
      let list = {
        guid: "", // 车辆名称
        plateno: "", // 车辆牌号
        oil_address: "", // 加油地址
        oil_grade: "", // 油料等级(标号)
        unit: "", // 单位
        quantity: "", // 加油数量
        urgent: false, // 是否加急
        priority: "", // 优先顺序
        remarks: "" // 备注
      };
      this.form.vehicle.push(list);
      this.counter++;
    },

    /*
     ** 表格多选处理
     */
    selectRow(val) {
      console.log(val);
      this.selectlistRow = val;
    },

    /*
     ** 删除表格选中项目
     */
    delData() {
      if (!this.selectlistRow.length) {
        this.$message.warning("请选择删除的行");
        return;
      }
      var that = this;
      // 拿到选中的数据；
      var val = this.selectlistRow;
      // 如果选中数据存在
      if (val) {
        // 将选中数据遍历
        val.forEach(function(item, index) {
          // 遍历源数据
          that.form.vehicle.forEach(function(itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
            if (item.guid === itemI.guid) {
              that.form.vehicle.splice(indexI, 1);
            }
          });
        });
      }
      // 清除选中状态
      this.$refs.oilTable.clearSelection();
    },

    /*
     ** 选中车辆 自动添加 车牌号码
     */
    selectHandle(guid) {
      let that = this;
      var val = this.equiList;
      if (val) {
        // 将选中数据遍历
        val.forEach(function(item, index) {
          // 遍历源数据
          that.form.vehicle.forEach(function(itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
            if (item.guid === itemI.guid) {
              itemI.plateno = item.plateno;
            }
          });
        });
      }
      console.log(this.form.vehicle);
    },

    /*
     ** 表单提交验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.vehicle.length === 0
            ? this.$message.warning("请添加车辆")
            : this.offlineoildetailHandle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 表单提交验证
     */
    async offlineoildetailHandle() {
      const res = await offlineoildetail(this.form);
      if (res.data instanceof Object && res.status === 200) {
        this.$message.success("添加成功");
        this.$router.push({
          path: "/plan/oilplan"
        });
      } else this.$message.warning("添加失败, 请稍后尝试!");
    },

    /*
     ** 加油详情查看
     */
    async oilApplyCheck() {
      if (!this.$route.query.id) return;
      const res = await oilApplyDetail({ id: this.$route.query.id });
      this.form = res.data;
      console.log(res);
    }
  }
};
</script>
<style lang="less" scoped>
.formWidth {
  width: 980px;
  padding: 20px 15px;
  margin: 0 auto;
}
.add_apply {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}
</style>
