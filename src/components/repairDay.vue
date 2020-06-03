<template>
  <div style="padding: 12px">
    <gt-header></gt-header>
    <el-card style="margin-top:12px;margin-right:12px;width:100%">
      <div slot="header" class="clearfix">
        <span>机车日常检查保养记录表</span>
      </div>
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
            <el-form-item label="车牌号码" prop="guid">
              <el-select
                v-model="form.guid"
                placeholder="请选择"
                style="width:100%"
                @change="equidHandle"
              >
                <el-option
                  v-for="item in equiList"
                  :key="item.guid"
                  :label="item.plateno"
                  :value="item.guid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="保养时间" prop="time">
              <el-date-picker
                v-model="form.time"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="保养状态" prop="state">
              <el-select v-model="form.state" placeholder="请选择" style="width:100%">
                <el-option label="草稿" value="草稿"></el-option>
                <el-option label="审批中" value="审批中"></el-option>
                <el-option label="已通过" value="已通过"></el-option>
                <el-option label="已驳回" value="已驳回"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="保养部门" prop="repair_dept">
              <el-select
                v-model="form.repair_dept"
                @change="repairHandle"
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
            <el-form-item label="所属公司" prop="company">
              <el-select
                v-model="form.company"
                @change="companyHandle"
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
            <el-form-item label="项目部" prop="project_dept">
              <el-select
                v-model="form.project_dept"
                @change="projectHandle"
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
            <el-form-item label="司机长" prop="driver_chief">
              <el-input placeholder="填写司机长姓名" type="text" v-model="form.driver_chief"></el-input>
            </el-form-item>
            <el-form-item label="司机名称" prop="driver">
              <el-input placeholder="填写司机姓名" type="text" v-model="form.driver"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:12px; width:100%">
      <div slot="header" class="clearfix">
        <span>检查保养内容</span>
        <!-- <el-button type="text" style="margin-left:12px" @click="addRow"></el-button>
        <el-button type="text" style="margin-left:12px" @click="delData">移除车辆</el-button>-->
      </div>
      <el-table
        :data="form.content"
        ref="approvalTable"
        highlight-current-row
        style="width:100%;"
        :span-method="objectSpanMethod"
        border
      >
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="item" label="检查项目" align="center" width="110"></el-table-column>
        <el-table-column prop="desc" label="检查描述" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.desc" :readonly="true" type="textarea" :rows="2"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="normal" label="是否正常" align="center" width="110">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.normal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              active-value="是"
              inactive-value="否"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="situation" label="检查情况" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.situation" placeholder="请输入" type="textarea" :rows="2"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="rectify" label="整改落实情况" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rectify" placeholder="请输入" type="textarea" :rows="2"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks" placeholder="请输入" type="textarea" :rows="2"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin-top:12px; width:100%">
      <el-col align="center" style="margin:0px 0px 12px 0px">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-card>
  </div>
</template>
<script>
import {
  getCompList,
  getDeptList,
  equiSelect,
  repairCreat, // 保养创建
  repairDetail, // 根据 code 查询 详情
  repairUpdate // 更新
} from "@/getData";
export default {
  name: "repairDay",
  data() {
    return {
      compList: [], // 公司列表
      deptList: [], // 部门列表
      equiList: [], // 设备列表
      form: {
        type: "day",
        guid: "", // 车辆guid
        time: "", // 保养时间
        state: "", // 保养状态
        repair_dept: "", // 保养部门 guid
        company: "", // 公司 guid
        project_dept: "", // 项目部 guid
        driver_chief: "", // 司机长
        driver: "", // 司机
        content: [
          //保养内容
          {
            item: "车钩",
            desc: "摆动灵活、各部无裂纹、限位标准",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "制动软管",
            desc: "配件齐全无老化缺失、作用良好、无漏风",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "排障器",
            desc: "无开裂、变形、缺失、距轨面高度符合标准",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "脚踏板",
            desc: "无开裂、变形、缺失、距轨面高度符合标准",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "扫石器",
            desc: "无开裂、变形、缺失、距轨面高度符合标准",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "灯光",
            desc: "外观及作用良好",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "制动缸油润、行程、穿销垫片作用良好",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "撒沙装置外观、储砂量、胶管高度、作用",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "轮毂无迟缓，磨耗、擦伤、碾堆符合标准",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "油压减振器支座无断裂，器体无破损漏油",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "旁承、牵引杆、车体侧挡、百叶窗检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "总风缸、燃油箱、蓄电池、排污阀检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "1-6牵引电机及附近检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "走行部",
            desc: "轴油、齿轮脂等油润检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "整体外观",
            desc: "无车漆大面积剥离，无污损、破裂",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "司机室",
            desc: "各控制开关、显示仪表、灭火器检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "司机室",
            desc: "门窗、空调、暖风机、电炉检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "司机室",
            desc: "三项设备、电台、手制动机、控制线路等",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "司机室",
            desc: "标识标牌、卫生检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "灭火器、工具堆放、百叶窗、卫生检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "变速箱、温控阀、油水热交换器检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "空压机、静液压油箱、机油滤清器检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "牵引电机通风机组检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "冷却单节、静液压马达等检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "灭火器、工具堆放、百叶窗、卫生检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "燃油泵，粗、精滤器、侧壁仪表检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "紧急停车按钮、联调、DLS、转速表检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "示功阀、供油齿、喷油泵检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "差示压力计、通风机检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "膨胀水箱水位、机油储量检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "燃油泵、机油泵检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "主发及其它电机组检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "柴油机各缸检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "增压器、制动系统各阀检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机械间",
            desc: "各部位跑冒滴漏检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc: "灭火器、工具堆放、百叶窗、卫生检查",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc: "各继电器外观完好、触头无烧损",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc: "各熔断器、接线安装牢固，状态完好",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc:
              "各电空接触器线圈接线无破损、脱落，灭弧罩安装牢固、无裂损。辅助触头状态良好，各接线无脱落",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc: "各电空阀状态良好，接线无脱落",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc:
              "换向器固定触头和滚子无烧损，辅助触头状态良好，手动转换手柄作用良好",
            normal: "否",
            situation: "",
            rectify: "",
            remarks: ""
          }
        ]
      },
      id: this.$route.query.id,
      // 表单校验规则
      rules: {
        guid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        time: [
          {
            required: true,
            message: "必填 ",
            trigger: ["blur", "change"]
          }
        ],
        state: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        repair_dept: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        company: [
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
        driver_chief: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }
        ],
        driver: [
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
    this.getRepairDetail();
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
      this.equiList = res.data;
    },

    /*
     ** 获取详情
     */
    async getRepairDetail() {
      if (!this.$route.query.id) return;
      const res = await repairDetail({ id: this.$route.query.id });
      this.form = res.data;
      console.log(res);
    },

    /*
     ** 表单提交验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.id ? this.repairUpdate() : this.repairHadnle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 选择设备 带出id
     */
    equidHandle(guid) {
      let that = this;
      var equiList = this.equiList;
      if (equiList) {
        // 将选中数据遍历
        equiList.forEach(function(item, index) {
          if (item.guid === guid) {
            that.form.plateno = item.plateno;
          }
        });
      }
    },

    /*
     ** 项目部门 带出id
     */
    projectHandle(guid) {
      let that = this;
      var deptList = this.deptList;
      if (deptList) {
        // 将选中数据遍历
        deptList.forEach(function(item, index) {
          if (item.guid === guid) {
            that.form.proname = item.name;
          }
        });
      }
    },

    /*
     ** 保养部门 带出id
     */
    repairHandle(guid) {
      let that = this;
      var deptList = this.deptList;
      if (deptList) {
        // 将选中数据遍历
        deptList.forEach(function(item, index) {
          if (item.guid === guid) {
            that.form.repaname = item.name;
          }
        });
      }
    },

    /*
     ** 选择公司 带出id
     */
    companyHandle(guid) {
      console.log(guid);
      let that = this;
      var compList = this.compList;
      if (compList) {
        // 将选中数据遍历
        compList.forEach(function(item, index) {
          if (item.guid === guid) {
            that.form.compname = item.name;
          }
        });
      }
    },

    /*
     ** 合并行 与 列
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        // 合并走行部 第一列
        if (rowIndex === 6) {
          return {
            rowspan: 8,
            colspan: 1
          };
        } else if (rowIndex > 6 && rowIndex <= 13) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 合并司机室第一列
        if (rowIndex === 15) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else if (rowIndex > 15 && rowIndex < 19) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 合并冷却间
        if (rowIndex === 19) {
          return {
            rowspan: 5,
            colspan: 1
          };
        } else if (rowIndex > 19 && rowIndex < 24) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 合并 机械间
        if (rowIndex === 24) {
          return {
            rowspan: 11,
            colspan: 1
          };
        } else if (rowIndex > 24 && rowIndex < 35) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 合并 电气间
        if (rowIndex === 35) {
          return {
            rowspan: 6,
            colspan: 1
          };
        } else if (rowIndex > 35 && rowIndex <= 40) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    /*
     ** 保存
     */
    async repairHadnle() {
      let data = this.form;
      const res = await repairCreat(data);
      if (res.data instanceof Object && res.status === 200)
        this.$router.push({
          path: "repair"
        });
    },

    /*
     ** 更新
     */
    async repairUpdate() {
      let data = this.form;
      const res = await repairUpdate(data);
      if (res.data instanceof Object && res.status === 200)
        this.$router.push({
          path: "repair"
        });
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
