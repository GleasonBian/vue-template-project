<template>
  <div class="page_container">
    <el-dialog
      title="油箱添加"
      :visible.sync="dialogVisible"
      width="45%"
      :modal-append-to-body="false"
      :before-close="handleClose"
      center
    >
      <el-form ref="tank" :model="tank" label-width="86px" :rules="tankRules">
        <el-form-item label="车辆名称" prop="category">
          <el-input v-model="tank.category" placeholder="请输入车量"></el-input>
        </el-form-item>

        <el-form-item label="车辆型号" prop="kind">
          <el-input v-model="tank.kind"></el-input>
        </el-form-item>

        <el-form-item label="油箱形状" prop="shape">
          <el-select v-model="tank.shape" placeholder="请选择" style="width:100%">
            <el-option label="长方体" value="长方体"></el-option>
            <el-option label="圆柱体" value="圆柱体"></el-option>
            <el-option label="异型油箱" value="异型油箱"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="油箱容积" prop="theory_volume">
          <el-input v-model.number="form.theory_volume" type="number" :step="10" :min="1">
            <el-button slot="append">升</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱高度" prop="height">
          <el-input v-model.number="form.height" type="number" :step="10" :min="1" :max="3000">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱长度" prop="length">
          <el-input v-model.number="tank['length']" type="number" :step="10" :min="1">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱宽度" prop="width">
          <el-input v-model.number="tank['width']" type="number" :step="10" :min="1">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱半径" prop="radius">
          <el-input v-model.number="tank['radius']" type="number" :step="10" :min="1">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button @click="tankHandle" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-card class="content_width" shadow="never">
      <div slot="header" class="clearfix">
        <span>车辆基本信息</span>
        <span style="margin-left:20px; color:rgb(164, 164, 165);">单号：{{this.form.code}}</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="车辆名称" prop="name">
              <el-input v-model="form.name"></el-input>
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

            <el-form-item label="车辆状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="停用" value="停用"></el-option>
                <el-option label="封存" value="封存"></el-option>
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

            <el-form-item label="油耗阀值" prop="max_oil_wear">
              <el-input-number
                :min="1"
                :max="200"
                controls-position="right"
                v-model.number="form.max_oil_wear"
                :step="5"
                step-strictly
                placeholder="油耗报警阀值"
                style="width:100%"
              ></el-input-number>
            </el-form-item>

            <el-form-item label="公里/油耗" prop="km_oil_wear">
              <el-input
                v-model.number="form.km_oil_wear"
                type="number"
                :step="10"
                :min="1"
                :max="300"
              >
                <el-button slot="append">升/百公里</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="邮箱类型" prop="tank_guid">
              <el-select v-model="form.tank_guid" placeholder="请选择" style="width:75%">
                <el-option
                  v-for="item in tankData"
                  :key="item.guid"
                  :label="item.category"
                  :value="item.guid"
                ></el-option>
              </el-select>
              <el-button style="width:25%" @click="dialogVisible = true">新增</el-button>
            </el-form-item>

            <el-form-item label="生产厂家" prop="producer">
              <el-input v-model="form.producer"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="simnumber">
              <el-input v-model="form.simnumber"></el-input>
            </el-form-item>

            <el-form-item label="车辆类型" prop="clstype">
              <el-select v-model="form.clstype" placeholder="请选择" style="width:100%">
                <el-option label="轨道车" value="轨道车"></el-option>
                <el-option label="东风机车" value="东风机车"></el-option>
                <el-option label="SUV" value="SUV"></el-option>
              </el-select>
              <!-- <el-input v-model="form.clstype" placeholder="请输入"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号码" prop="plateno">
              <el-input v-model="form.plateno"></el-input>
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

            <el-form-item label="来源类型" prop="source_type">
              <el-select v-model="form.source_type" placeholder="请选择" style="width:100%">
                <el-option label="自购" value="自购"></el-option>
                <el-option label="租赁" value="租赁"></el-option>
                <el-option label="借调" value="借调"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="车辆用途" prop="vehicle_use">
              <el-input v-model="form.vehicle_use"></el-input>
            </el-form-item>

            <el-form-item label="监控等级" prop="monitor">
              <el-select v-model="form.monitor" placeholder="请选择" style="width:100%">
                <el-option label="一级" value="一级"></el-option>
                <el-option label="二级" value="二级"></el-option>
                <el-option label="三级" value="三级"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="速度阀值" prop="max_speed">
              <el-input-number
                :min="1"
                :max="200"
                controls-position="right"
                v-model.number="form.max_speed"
                :step="5"
                step-strictly
                placeholder="超速报警阀值"
                style="width:100%"
              ></el-input-number>
            </el-form-item>

            <el-form-item label="小时/油耗" prop="hr_oil_wear">
              <el-input
                v-model.number="form.hr_oil_wear"
                type="number"
                :step="10"
                :min="1"
                :max="300"
              >
                <el-button slot="append">升/小时</el-button>
              </el-input>
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

            <el-form-item label="初始里程" prop="init_mileage">
              <el-input
                v-model.number="form.init_mileage"
                type="number"
                :step="10"
                :min="1"
                :max="300"
              >
                <el-button slot="append">升/百公里</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="终端id" prop="terminalid">
              <el-input v-model="form.terminalid"></el-input>
            </el-form-item>

            <el-form-item label="描述信息" prop="description">
              <el-input v-model="form.description" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="content_width" shadow="never">
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
        @selection-change="selectRowHandle"
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
            >
              <el-option
                v-for="item in staffData"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="phonenum" label="手机号码" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.phonenum" :readonly="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="corpname" label="所属公司" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.corpname" :readonly="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="deptname" label="所属部门" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deptname" :readonly="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="default" label="默认司机" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.default"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              active-value="是"
              inactive-value="否"
              @change="defaultDriverHandle(scope.$index)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-col align="center" class="content_width">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-col>
  </div>
</template>

<script>
import {
  equiCreate, // 设备创建
  equiUpdate, // 设备更新
  equiDetails, // 设备详情
  corpSelect, // 公司列表
  getDeptList, // 部门列表
  getStaffList, //人员
  tankCreate, // 邮箱创建
  tankList, // 邮箱列表
  equiSelect // 获取详情
} from "@/getData";
export default {
  data() {
    return {
      dialogVisible: false,
      tankRules: {},
      // 表单校验规则
      rules: {
        name: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        plateno: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        color: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        clstype: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        class: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        corpguid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        deptguid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        status: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        source_type: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        manage_type: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        producer: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        proddate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        terminalid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        simnumber: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        vehicle_use: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        repair_date: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        monitor: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        init_mileage: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        oilboxheight: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        max_oil_wear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        max_speed: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        km_oil_wear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        hr_oil_wear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        tank_guid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 创建 更新 删除 表单
      form: {
        name: "", //车辆名称
        plateno: "", //车牌号码
        color: "", //车辆颜色
        clstype: "", //车辆类型
        corpguid: "", //所属公司
        deptguid: "", //上级部门
        status: "", //车辆状态
        source_type: "", //来源类型
        manage_type: "", //管理类型
        producer: "", //生产厂家
        proddate: "", //生产日期
        terminalid: "", //终端id
        simnumber: "", //手机号
        vehicle_use: "", //车辆用途
        repair_date: "", //保养日期
        monitor: "", //监控等级
        init_mileage: "", //初始里程
        max_oil_wear: "", //油耗报警阀值
        max_speed: "", // 速度报警阀值
        km_oil_wear: "", //公里/油耗
        hr_oil_wear: "", //小时/油耗
        description: "", //描述信息
        driver: [], // 司机
        tank_guid: "" // 油箱
      },
      tank: {
        category: "", // 车辆名称
        kind: "", // 车辆型号
        shape: "", // 长方体,圆柱体,异型油箱
        theory_volume: 0, // 理论容积
        height: 0, // 油箱高度
        length: 0, // 油箱长度
        width: 0, //宽度
        radius: 0 // 油箱半径
      },
      // 选择行
      selectRowList: [],
      // 公司列表
      corpData: [],
      // 部门列表
      deptData: [],
      // 人员
      staffData: [],
      // 邮箱
      tankData: []
    };
  },
  created() {
    this.staffList();
    this.corpList();
    this.deptList();
    this.tankListHandle();
  },
  mounted() {
    this.getVehicleDetail();
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
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
      const res = await getDeptList({ param: { corpguid: val } });
      this.deptData = res.data;
    },

    /**
     ** 人员列表
     */
    async staffList(val) {
      const res = await getStaffList();
      this.staffData = res.data;
    },

    /**
     ** 更换公司清空部门, 重新获取部门列表
     */
    async resetDept(cid) {
      console.log("公司id：", cid);
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
        this.$router.push({
          path: "equipment"
        });
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
    },

    /*
     ** form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$route.query.id ? this.UpdateHandle() : this.CreateHandle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 创建处理
     */
    async CreateHandle() {
      const res = await equiCreate(this.form);
      if (res.status === 200) {
        this.$message.success("设备创建成功");
        this.$router.push({
          path: "equipment"
        });
      } else this.$message.warning("设备创建失败");
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
    selectRowHandle(val) {
      this.selectRowList = val;
    },

    /*
     ** 增加行
     */
    addRow() {
      let list = {
        guid: "", // 人员guid
        name: "", // 人员名称
        phonenum: "", // 手机号
        corpname: "", // 公司名称
        corpguid: "", // 公司id
        deptname: "", // 部门名称
        deptguid: "", // 部门id
        default: "否" // 默认司机
      };
      this.form.driver.push(list);
    },

    /*
     ** 删除表格选中项目
     */
    delData() {
      if (!this.selectRowList.length) {
        this.$message.warning("请选择删除的行");
        return;
      }
      var that = this;
      // 拿到选中的数据；
      var val = this.selectRowList;
      // 如果选中数据存在
      if (val) {
        // 将选中数据遍历
        val.forEach(function(item, index) {
          // 遍历源数据
          that.form.driver.forEach(function(itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
            if (item.guid === itemI.guid && item.phonenum === itemI.phonenum) {
              that.form.driver.splice(indexI, 1);
            }
          });
        });
      }
      // 清除选中状态
      this.$refs.driverTable.clearSelection();
    },

    /*
     ** 选中车辆 自动添加 车牌号码
     */
    selectHandle(guid) {
      let that = this,
        val = this.staffData;
      if (val) {
        // 将选中数据遍历
        val.forEach(function(item, index) {
          // 遍历源数据
          that.form.driver.forEach(function(itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等
            if (item.guid === itemI.guid) {
              itemI.corpguid = item.corpguid;
              itemI.name = item.name;
              itemI.corpname = item.corpname;
              itemI.deptguid = item.deptguid;
              itemI.deptname = item.deptname;
              itemI.phonenum = item.phonenum;
            }
          });
        });
      }
    },

    /*
     ** 默认司机处理
     */
    defaultDriverHandle(val) {
      let that = this;
      that.form.driver.forEach(function(item, index) {
        that.form.driver[index].default = "否";
      });
      that.form.driver[val].default = "是";
    },

    /*
     ** 添加邮箱
     */
    async tankHandle() {
      const res = await tankCreate(this.tank);
      console.log(res);
      if (res.status === 200) {
        this.tankListHandle();
        this.tank = {
          category: "", // 车辆名称
          kind: "", // 车辆型号
          shape: "", // 长方体,圆柱体,异型油箱
          theory_volume: 0, // 理论容积
          height: 0, // 油箱高度
          length: 0, // 油箱长度
          width: 0, //宽度
          radius: 0 // 油箱半径
        };
        this.$message.success("添加成功");
      } else this.$message.warning("添加失败稍后再试!");
      this.dialogVisible = false;
    },

    /*
     ** 油箱列表
     */
    async tankListHandle() {
      const res = await tankList();
      this.tankData = res.data.list;
    },

    /*
     ** 获取详情
     */
    async getVehicleDetail() {
      if (!this.$route.query.id) return;
      const res = await equiSelect({ id: this.$route.query.id });
      this.form = res.data;
    }
  }
};
</script>

<style>
.dialog-footer {
  text-align: center;
}
</style>
