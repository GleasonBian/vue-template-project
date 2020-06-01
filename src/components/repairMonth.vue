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
        type: "month",
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
            item: "基础项",
            desc: "各传动轴有无裂纹，链接法兰盘螺栓有无松动",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "传动轴的安全架有无裂纹",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "车轮、车轴、车轴齿轮箱有无异常及裂纹",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "空气压缩机的工作状态是否良好",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "闸瓦磨耗情况调整闸瓦间隙",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "排放储风缸内的积水",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "手制动是否有效",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "制动风管有无异常",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "车下各装置的紧固状态是否良好",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "车钩及缓存装置有无异常",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "机车各处需要油润部位",
            normal: "",
            situation: "",
            rectify: "",
            remarks: ""
          },
          {
            item: "基础项",
            desc: "其他问题及处理结果",
            normal: "",
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
      console.log(this.tableData);
    },
    /*
     ** 合并行 与 列
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        // 合并走行部 第一列
        if (rowIndex === 0) {
          return {
            rowspan: 12,
            colspan: 1
          };
        } else {
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
