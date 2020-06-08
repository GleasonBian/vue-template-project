<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>
    <div style="margin:15px">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="80px"
        style="width:100%"
      >
        <el-card>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色名称" prop="name">
                <el-input maxlength="100" clearable v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="停用" value="停用"></el-option>
                  <el-option label="封存" value="封存"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属公司" prop="corpguid">
                <el-select
                  v-model="form.corpguid"
                  @change="changeDepts"
                  placeholder="请选择所属公司"
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="deptguid">
                <el-select
                  v-model="form.deptguid"
                  placeholder="请选择上级部门，为空则为公司直属"
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
              <el-form-item label="创建时间" prop="regdate">
                <el-date-picker
                  v-model="form.regdate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" maxlength="100" show-word-limit v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-col :span="24">
          <el-card style="margin-top:12px">
            <div slot="header" class="clearfix">
              <span>添加人员</span>
              <el-button type="text" style="margin-left:12px" @click="addRow">添加员工</el-button>
              <el-button type="text" style="margin-left:12px" @click="delData">移除员工</el-button>
            </div>
            <el-table
              :data="form.staffs"
              ref="staffs"
              highlight-current-row
              style="width:100%;"
              stripe
              border
              @selection-change="selectRowHandle"
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="guid" label="员工姓名" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.guid"
                    placeholder="请选择"
                    style="width:100%"
                    @change="selectHandle(scope.$index,scope.row.guid)"
                  >
                    <el-option
                      v-for="item in staffList"
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
              <el-table-column prop="postname" label="岗位名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.postname" :readonly="true"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="24" style="text-align:center;margin:20px">
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="goback">返回</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  corpSelect,
  getStaffList,
  getDeptList,
  getRoleDetail,
  editRoleDetail,
  saveAddRole
} from "@/getData";
import headTop from "@/common/headTop";
import selArea from "@/common/gtArea";
import { Regular } from "@/config/verification";
export default {
  name: "companyDetail",
  components: {
    selArea,
    headTop
  },
  data() {
    return {
      selectRowList: {},
      guid: null, //公司id，判断是否是新增
      compList: [], //上级公司列表
      deptList: [], //上级部门列表
      staffList: [], //直属领导列表
      form: {
        corpguid: "",
        deptguid: "",
        briefabout: "", //公司简介
        description: "", //备注
        location: "", //地理信息
        name: "", //公司名称
        certtype: "身份证", //证件类型
        regdate: "", // 注册日期
        staffs: [], // 人员
        superior: "" // 上级标识
      },
      Regular: Regular, // 表单校验正则
      // 表单校验规则
      rules: {
        corpguid: [
          {
            required: true,
            message: "必填 所属公司 "
          }
        ],
        postname: [
          {
            required: true,
            message: "必填 岗位名称 "
          }
        ],
        userid: [
          {
            required: true,
            message: "必填 登录账号 "
          }
        ],
        password: [
          {
            required: true,
            message: "必填 登录密码 "
          }
        ],
        status: [
          {
            required: true,
            message: "必填 人员状态 "
          }
        ],
        name: [
          {
            required: true,
            message: "必填 人员名称 "
          }
        ],
        corp_guid: [
          {
            required: true,
            message: "必填 所属公司",
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
        hiredate: [
          {
            required: true,
            message: "必填 入职时间",
            trigger: ["blur", "change"]
          }
        ],
        certtype: [
          {
            required: true,
            message: "必填 证件类型",
            trigger: ["blur", "change"]
          }
        ],
        certguid: [
          {
            required: true,
            message: "必填 证件号码",
            trigger: ["blur", "change"]
          }
        ],
        phonenum: [
          {
            required: true,
            message: "必填 手机号码",
            trigger: ["blur", "change"]
          }
        ],
        email: [
          {
            required: true,
            message: "必填 工作邮箱",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.getCompList();
    this.getStuffList();
    this.guid = this.$route.query.id;
    if (this.guid) {
      this.viewCorp(this.guid);
    }
  },
  mounted() {},
  methods: {
    addRow() {
      let list = {
        guid: "", // 人员guid
        name: "", // 人员名称
        phonenum: "", // 手机号
        corpname: "", // 公司名称
        corpguid: "", // 公司id
        deptname: "", // 部门名称
        deptguid: "", // 部门id
        default: false // 默认司机
      };
      console.log(this.form);
      this.form.staffs.push(list);
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
          that.form.staffs.forEach(function(itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
            if (item.guid === itemI.guid && item.phonenum === itemI.phonenum) {
              that.form.staffs.splice(indexI, 1);
            }
          });
        });
      }
      // 清除选中状态
      this.$refs.staffs.clearSelection();
    },
    selectRowHandle(val) {
      this.selectRowList = val;
    },
    /*
     ** 选中人员
     */
    selectHandle(index, guid) {
      let that = this;
      var val = this.staffList;
      if (val) {
        // 将选中数据遍历

        val.forEach(function(item, index2) {
          // 遍历源数据
          that.form.staffs.forEach(function(itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等

            if (item.guid === itemI.guid) {
              itemI.corpguid = item.corpguid;
              itemI.corpname = item.corpname;
              itemI.deptguid = item.deptguid;
              itemI.deptname = item.deptname;
              itemI.phonenum = item.phonenum;
              itemI.postname = item.postname;
            }
          });
        });
      }
    },
    changeDepts() {
      let corpguid = this.form.corpguid;
      this.form.deptguid = null;
      this.getDeptList(corpguid);
      this.getStuffList();
    },
    goback() {
      this.$router.go(-1);
    },
    /**
     ** 公司列表查询
     */
    async getCompList() {
      const res = await corpSelect();
      this.compList = res.data;
    },
    /**
     **部门列表查询
     */
    async getDeptList(corpguid) {
      const res = await getDeptList({ param: { corpguid } });
      this.deptList = res.data;
    },
    /**
     **人员列表查询
     */
    async getStuffList() {
      let corpguid = this.form.corpguid;
      const res = await getStaffList({ param: { corpguid } });
      this.staffList = res.data;
    },

    /*
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.guid) {
            //编辑
            this.updateCorp();
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
    async updateCorp() {
      const res = await editRoleDetail(this.form);
      if (res.status === 200) {
        this.$message.success("更新成功");
        this.$router.replace({ path: "roleList" });
      } else this.$message.warning("更新失败,稍后重试");
    },
    /*
     ** 创建公司
     */
    async submitAddUser() {
      const res = await saveAddRole(this.form);
      if (res.status === 200) {
        this.$message.success("创建成功");
        this.$router.replace({ path: "roleList" });
      } else this.$message.warning("创建失败");
    },

    /*
     ** 人员详细信息
     */
    async viewCorp(guid) {
      const response = await getRoleDetail({
        id: guid
      });
      if (response.status === 200) {
        this.form = response.data;
        this.form.staffs
          ? (this.form.staffs = this.form.staffs)
          : (this.form.staffs = []);
        this.getDeptList(this.form.corpguid);
        this.getStuffList();
      } else this.$message.warning("请稍后再尝试");
    }
  }
};
</script>
<style lang="less" scoped>
.formWidth {
  width: 980px;
  padding: 20px 15px;
}
</style>
