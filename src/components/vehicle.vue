<template>
  <div style="padding:12px">
    <el-card>
      <div slot="header" class="clearfix">
        <span>车辆基本信息</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车辆名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="车牌号码" prop="plateno">
              <el-input v-model="form.plateno"></el-input>
            </el-form-item>

            <el-form-item label="车辆颜色" prop="color">
              <el-select v-model="form.color" placeholder="请选择" style="width:100%">
                <el-option label="白色" value="白色"></el-option>
                <el-option label="黑色" value="黑色"></el-option>
                <el-option label="银色" value="银色"></el-option>
                <el-option label="红色" value="红色"></el-option>
                <el-option label="黄色" value="黄色"></el-option>
                <el-option label="棕色" value="棕色"></el-option>
                <el-option label="绿色" value="绿色"></el-option>
                <el-option label="蓝色" value="蓝色"></el-option>
                <el-option label="紫色" value="紫色"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="车辆类型" prop="clstype">
              <el-select v-model="form.clstype" placeholder="请选择" style="width:100%">
                <el-option label="轨道车" value="轨道车"></el-option>
                <el-option label="东风机车" value="东风机车"></el-option>
                <el-option label="SUV" value="SUV"></el-option>
              </el-select>
              <!-- <el-input v-model="form.clstype" placeholder="请输入"></el-input> -->
            </el-form-item>

            <el-form-item label="车辆型号" prop="class">
              <el-input v-model="form.class" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="所属公司" prop="corpguid">
              <el-select
                v-model="form.corpguid"
                placeholder="请选择"
                @change="resetDept(form.corpguid)"
                style="width:100%"
              >
                <el-option
                  v-for="item in corpData"
                  :key="item.guid"
                  :label="item.name"
                  :value="item.guid"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="上级部门" prop="deptguid">
              <el-select v-model="form.deptguid" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in deptData"
                  track-by="item.guid"
                  :key="item.guid"
                  :label="item.name"
                  :value="item.guid"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="车辆状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="停用" value="停用"></el-option>
                <el-option label="封存" value="封存"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="来源类型" prop="source_type">
              <el-select v-model="form.source_type" placeholder="请选择" style="width:100%">
                <el-option label="自购" value="自购"></el-option>
                <el-option label="租赁" value="租赁"></el-option>
                <el-option label="借调" value="借调"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="管理类型" prop="manage_type">
              <el-select v-model="form.manage_type" placeholder="请选择" style="width:100%">
                <el-option label="公司直管" value="公司直管"></el-option>
                <el-option label="项目自管" value="项目自管"></el-option>
                <el-option label="劳务自带" value="劳务自带"></el-option>
                <el-option label="专业租赁" value="专业租赁"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="生产厂家" prop="producer">
              <el-input v-model="form.producer"></el-input>
            </el-form-item>

            <el-form-item label="生产日期" prop="proddate">
              <el-date-picker
                v-model="form.proddate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端id" prop="terminalid">
              <el-input v-model="form.terminalid"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="simnumber">
              <el-input v-model="form.simnumber"></el-input>
            </el-form-item>

            <el-form-item label="车辆用途" prop="vehicle_use">
              <el-input v-model="form.vehicle_use"></el-input>
            </el-form-item>

            <el-form-item label="保养日期" prop="repair_date">
              <el-date-picker
                v-model="form.repair_date"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="监控等级" prop="clsrank">
              <el-select v-model="form.clsrank" placeholder="请选择" style="width:100%">
                <el-option label="一级" value="一级"></el-option>
                <el-option label="二级" value="二级"></el-option>
                <el-option label="三级" value="三级"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="初始里程" prop="init_mileage">
              <el-input v-model="form.km_oil_wear" type="number" :step="10" :min="1" :max="300">
                <el-button slot="append">升/百公里</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="油箱高度" prop="oilboxheight">
              <el-input
                v-model.number="form.oilboxheight"
                type="number"
                :step="10"
                :min="1"
                :max="3000"
              >
                <el-button slot="append">厘米</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="油箱容量" prop="oilboxvol">
              <el-input v-model.number="form.oilboxvol" :step="10" type="number">
                <el-button slot="append">升</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="限制时速">
              <el-row>
                <el-col :span="11">
                  <el-input-number
                    :min="1"
                    :max="200"
                    controls-position="right"
                    v-model="form.min_speed"
                    :step="5"
                    step-strictly
                    placeholder="最大速度(km/h)"
                    style="width:100%"
                  ></el-input-number>
                </el-col>
                <el-col :span="2" align="center">-</el-col>
                <el-col :span="11">
                  <el-input-number
                    :min="1"
                    :max="200"
                    controls-position="right"
                    v-model="form.max_speed"
                    :step="5"
                    step-strictly
                    placeholder="最小速度(km/h)"
                    style="width:100%"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="公里/油耗" prop="oil_wear">
              <el-input v-model="form.km_oil_wear" type="number" :step="10" :min="1" :max="300">
                <el-button slot="append">升/百公里</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="小时/油耗" prop="oil_wear">
              <el-input v-model="form.hr_oil_wear" type="number" :step="10" :min="1" :max="300">
                <el-button slot="append">升/小时</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="描述信息" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:12px">
      <div slot="header" class="clearfix">
        <span>司机管理</span>
        <el-button type="text" style="margin-left:12px" @click="addRow">添加司机</el-button>
        <el-button type="text" style="margin-left:12px" @click="delData">移除司机</el-button>
      </div>
      <el-table
        :data="form.driver"
        ref="driverTable"
        highlight-current-row
        style="width:100%;"
        stripe
        border
        @selection-change="selectRow"
        size="mini"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="guid" label="司机名称" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.guid"
              placeholder="请选择"
              style="width:100%"
              @change="selectHandle"
              size="mini"
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
        <el-table-column prop="oil_address" label="手机号码" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.oil_address" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="plan_time" label="加油时间" align="center">
          <template slot-scope="scope">
            <el-date-picker
              size="mini"
              v-model="scope.row.plan_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="oil_grade" label="加油标号" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.oil_grade"
              placeholder="请选择"
              style="width:100%"
              size="mini"
            >
              <el-option label="#91" value="#91"></el-option>
              <el-option label="#92" value="#92"></el-option>
              <el-option label="#93" value="#93"></el-option>
              <el-option label="#94" value="#94"></el-option>
              <el-option label="#95" value="#95"></el-option>
              <el-option label="#96" value="#96"></el-option>
              <el-option label="#97" value="#97"></el-option>
              <el-option label="#98" value="#98"></el-option>
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
              size="mini"
              @change="sumRefuelNumber"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="油量单位" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.unit"
              placeholder="请选择"
              @change="sumRefuelNumber"
              style="width:100%"
              size="mini"
            >
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
            <el-select
              v-model="scope.row.priority"
              placeholder="请选择"
              style="width:100%"
              size="mini"
            >
              <el-option label="一级" value="一级"></el-option>
              <el-option label="二级" value="二级"></el-option>
              <el-option label="三级" value="三级"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  corpSelect,
  getDeptList,
  equiCreate,
  equiUpdate,
  equiDetails
} from "@/getData";
export default {
  data() {
    return {
      // 表单校验规则
      rules: {
        clstype: [
          {
            required: true,
            message: "必填 车辆类型",
            trigger: ["blur", "change"]
          }
        ],
        class: [
          {
            required: true,
            message: "必填 车辆型号",
            trigger: ["blur", "change"]
          }
        ],
        clsrank: [
          {
            required: true,
            message: "必填 分类等级",
            trigger: ["blur", "change"]
          }
        ],
        corpguid: [
          {
            required: true,
            message: "必填 公司标识",
            trigger: ["blur", "change"]
          }
        ],
        deptguid: [
          {
            required: true,
            message: "必填 部门标识",
            trigger: ["blur", "change"]
          }
        ],
        name: [
          {
            required: true,
            message: "设备名称 必填",
            trigger: ["blur", "change"]
          }
        ],
        proddate: [
          {
            required: true,
            message: "生产日期 必填",
            trigger: ["blur", "change"]
          }
        ],
        producer: [
          {
            required: true,
            message: "生产厂家 必填",
            trigger: ["blur", "change"]
          }
        ],
        plateno: [
          {
            required: true,
            message: "车牌号 必填",
            trigger: ["blur", "change"]
          }
        ],
        oilboxheight: [
          {
            required: true,
            message: "油箱高度 必填",
            trigger: ["blur", "change"]
          }
        ],
        oilboxvol: [
          {
            required: true,
            message: "油箱容量 必填",
            trigger: ["blur", "change"]
          }
        ],
        simnumber: [
          {
            required: true,
            message: "手机号 必填",
            trigger: ["blur", "change"]
          }
        ],
        terminalid: [
          {
            required: true,
            message: "终端id 必填",
            trigger: ["blur", "change"]
          }
        ],
        description: [
          {
            required: false,
            message: "描述信息 必填",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 创建 更新 删除 表单
      form: {
        certguid: "", // 证件号码
        certtype: "", // 证件类型
        clstype: "", // 车辆类型
        class: "", // 车辆型号
        clsrank: "", // 分类等级
        corpguid: "", // 公司标识
        deptguid: "", // 部门标识
        code: "", // 设备编码
        name: "", // 设备名称
        proddate: "", // 生产日期
        producer: "", // 生产厂家
        description: "", // 描述
        plateno: null, //车牌号
        simnumber: null, //手机号
        terminalid: null, //终端id
        driver: []
      },
      // 选择行
      selectRow: [],
      // 公司列表
      corpData: [],
      // 部门列表
      deptData: []
    };
  },
  created() {
    this.corpList();
    this.deptList();
  },

  methods: {
    /*
     ** 创建处理
     */
    async CreateHandle(info) {
      const res = await equiCreate(this.form);
      if (res.status === 200) {
        this.equiList();
        this.$message.success("设备创建成功");
      } else this.$message.warning("设备创建失败");
      this.dialogFormVisible = false;
    },

    /**
     ** 公司列表
     */
    async corpList(val) {
      const res = await corpSelect();
      this.corpData = res.data;
    },

    /**
     ** 部门列表
     */
    async deptList(val) {
      const res = await getDeptList({ deptguid: val || null });
      console.log("部门列表", res.data);
      this.deptData = res.data;
    },

    /**
     ** 更换公司清空部门, 重新获取部门列表
     */
    async resetDept(cid) {
      this.deptData = [];
      this.form.deptguid = null;
      this.$forceUpdate();
      this.deptList(cid);
    },
    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {
      const res = await equiUpdate(this.form);
      if (res.status === 200) {
        this.equiList();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
    },

    /*
     ** form 表单 验证
     */
    submitForm(formName) {
      console.log("232323");
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formCurrentStatus === "创建") this.CreateHandle();
          else if (this.formCurrentStatus === "更新") this.UpdateHandle();
          else if (this.formCurrentStatus === "查看") this.ExamineHandle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** form 表单 重置
     */
    ResetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*
     ** 表格多选处理
     */
    selectRow(val) {
      this.selectRow = val;
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
        remarks: "", // 备注
        plan_time: "" // 加油时间
      };
      this.form.vehicle.push(list);
      this.counter++;
    }
  }
};
</script>

<style>
</style>
