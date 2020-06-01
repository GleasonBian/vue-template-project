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
                @change="selectHandle"
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
              <el-select v-model="form.repair_dept" placeholder="请选择" style="width:100%">
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
import { getCompList, getDeptList, equiSelect, repair } from "@/getData";
export default {
  name: "repairDay",
  data() {
    return {
      compList: [], // 公司列表
      deptList: [], // 部门列表
      equiList: [], // 设备列表
      form: {
        type: "week",
        guid: "", // 车辆guid
        time: "", // 保养时间
        state: "", // 保养状态
        repair_dept: "", // 保养部门 guid
        company: "", // 公司 guid
        project_dept: "", // 项目部 guid
        driver_chief: "", // 司机长
        driver: "", // 司机
        content: [
          {
            item: "司机室",
            desc: "各开关、接线、插头松脱、电器触指烧损",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "司机室",
            desc:
              "手把杆止钉及安装螺丝、司机座螺丝松、脱、开焊，其它一般安装螺丝松动。",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "司机室",
            desc:
              "头灯、司机室灯、仪表照明灯、信号指示灯不亮，各灯泡及灯座安装不良及缺损。",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc:
              "各电路线圈、保险、刀闸刀片、各转换开关及接触器触指烧伤、拉伤。QD电机碳刷到限，CF皮带、尼龙绳状态不符合要求",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc:
              "各电器元件、大线、导线、插头、照明线松脱、烧损。各控制箱接线、插头松脱、电流互感器线圈接线、整流柜元件松脱烧损",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "电器间",
            desc:
              "各电空阀、接触器、传动风缸风路漏泄。空气系统风缸、管路漏泄，塞门位置不对",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc:
              "各单节散热器、热交换器、QBD电机、静压系统各水路、油路、法兰裂漏、管系塞门位置不对",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc:
              "后变速箱、空压机组、QBD及各传动部件安装法兰螺丝松脱，注排油堵松漏，皮带、尼龙绳裂纹断股",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "风泵电机碳刷到限，转子拉伤伤损，接线松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "冷却间",
            desc: "十字头、传动轴及各连接螺丝、法兰螺丝松动",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "主发碳刷到限、安装不良，转子拉伤、伤损，各电机接线松及安装螺丝松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc: "传动轴及各传动部件连接螺丝松、脱、裂纹",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "柴油机和增压器各循环水管、润滑油管、燃油系统各管系严重裂漏，各法兰螺母松动，各出水支管裂漏、安装螺丝松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "水箱水位不符合规定、润滑油位不符合规定，水表不清，差示液面不符合规定",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "各油压继电器、步进电机、压力温度传感器、车体通风机照明接线及接线盒线松、脱、烧损",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "燃油供油系统各杆销脱落、拔叉卡滞、齿条卡死、状态不良，喷油泵安装螺丝松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "各摇臂箱、曲轴箱、凸轮轴箱检查盖及挺杆套、帆布罩松漏，安装螺丝松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "动力间",
            desc:
              "增压器、中冷器、油泵、水泵、各滤清器安装螺丝、法兰螺丝松动，示功阀、测温堵松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车体",
            desc: "各百叶窗关闭不良，排气烟道盖安装及作用不良",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车体",
            desc: "外观：车漆剥离、脚踏板、车牌牢固不牢等",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "转向架端梁变形、裂纹、开焊。制动装置风管路破损、胶管老化",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "照明灯线不良、老化",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc:
              "牵引电机悬挂座吊杆裂纹，胶垫变形、传销、开口销丢失，各安装螺丝、托板及座螺丝松脱",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc:
              "牵引电机碳刷到限、安装不良，压指弹簧折损、脱落，转子轻微拉伤环火，引出线破损、松脱烧伤，换向器毛刺多、云母槽深度不够",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "牵引电机通风罩破损、卡子脱、电机散热口堵塞",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc:
              "牵引电机盖破损、内外通风网破损堵塞、引出线夹板不良、一般螺丝松动",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "抱轴瓦毛线安装不良，抱轴轻微拉伤、碾片，放油堵丢失",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "抱轴瓦螺丝松动、防缓丝不良",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "齿轮箱箱体裂、加油口盖封盖不良、严重漏泄",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "车底部",
            desc: "车底部其他一般螺丝松动",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "油底壳、启动变速箱（内燃机车专用机油）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "供油齿条、拉杆等连接处（普通机油）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "调速器（航空机油）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "牵引电机抱轴承（抱轴油）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "牵引电机传动齿轮箱（齿轮脂）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "空气压缩机（空压机专用油）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "电器中相对运动的结合部（凡士林）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "转换开关（凡士林）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "制动缸及车钩及机械联结装置（钙基脂）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "闸瓦间隙调节器（钙基脂）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "各电动机、发电机轴承（锂基酯）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "机车油润",
            desc: "静液压变速箱、冷却风扇的静液压系统（液压油）",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          }
        ]
      },
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
  mounted() {},
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
     ** 表单提交验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.repairHadnle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
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
          //
          // that.tableData.forEach(function(itemI, indexI) {
          //   // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
          //   if (item.guid === itemI.guid) {
          //     itemI.plateno = item.plateno;
          //   }
          // });
        });
      }
    },

    /*
     ** 合并行 与 列
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        // 合并走行部 第一列
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if (rowIndex > 0 && rowIndex <= 2) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 合并司机室第一列
        if (rowIndex === 3) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if (rowIndex > 3 && rowIndex < 6) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // // 合并冷却间
        if (rowIndex === 6) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else if (rowIndex > 6 && rowIndex < 10) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 合并 机械间
        if (rowIndex === 10) {
          // 等于上一个
          return {
            rowspan: 8, // 向下 合并几个
            colspan: 1
          };
        } else if (rowIndex > 10 && rowIndex < 18) {
          // 等于进入
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // // 合并 电气间
        if (rowIndex === 18) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else if (rowIndex > 18 && rowIndex <= 19) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        // 车体
        if (rowIndex === 20) {
          return {
            rowspan: 10,
            colspan: 1
          };
        } else if (rowIndex > 20 && rowIndex <= 29) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        if (rowIndex === 30) {
          return {
            rowspan: 12,
            colspan: 1
          };
        } else if (rowIndex > 30 && rowIndex <= 41) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    /*
     ** 周提交
     */
    async repairHadnle() {
      let data = this.form;
      const res = await repair(data);
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
