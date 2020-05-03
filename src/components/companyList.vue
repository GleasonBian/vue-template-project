<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>

    <!-- 搜索框 -->
    <gt-search
      :ParentPage="fromPage"
      ref="searchBox"
      :searchName="searchName"
      :SelectOptions3="jobTitle"
    ></gt-search>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:1%">
      <el-button
        type="primary"
        size="medium"
        @click="getDeptTree('newUser')"
        style="margin-left:1%"
      >新增</el-button>
      <el-button type="danger" size="medium" @click="BatchDeleteUser">删除</el-button>
    </el-col>

    <!-- 内部用户列表 -->
    <el-col align="middle">
      <gt-table
        :tableData="tableData"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="true"
        v-on:resetPassword="resetPassword"
        v-on:viewOReditorUserInfo="viewOReditorUserInfo"
        v-on:changeUserStatus="changeUserStatus"
        v-on:selection-change="handleSelectionChange"
        :handle="handle"
      ></gt-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="offset"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-col>

    <!-- 选择用户状态 -->
    <el-dialog
      title="选择用户状态"
      :visible.sync="userStatusDialogVisible"
      width="18%"
      :close-on-click-modal="false"
      center
    >
      <el-col :span="24" type="flex" justify="center" align="middle">
        <el-radio-group v-model="accountStatus">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userStatusChange">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增用户 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogFormVisible"
      width="25%"
      @close="handleDialogClose('form')"
      :close-on-click-modal="false"
      top="5vh"
      center
    >
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="80px"
        style="width:100%"
      >
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model.number="form.name"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="mail">
          <el-input v-model="form.mail"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择" style="width:100%">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择" style="width:100%">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位名称" prop="position" :rules="[ { required: true, message: '职位 必选'}]">
          <el-select v-model="form.position" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in jobTitle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker
            v-model="form.entryTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptId">
          <el-cascader
            v-model="form.deptIds"
            :options="deptIdOption"
            :props="props"
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </span>
    </el-dialog>

    <!-- 查看 或 编辑当前用户信息 -->
    <el-dialog
      title="查看/编辑"
      :visible.sync="isShowViewUser"
      width="25%"
      @close="handleisShowViewUser"
      center
    >
      <el-form
        :model="clickCurrentRowInfo"
        status-icon
        label-width="80px"
        style="width:100%"
        ref="viewOReditorUserInfo"
      >
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="clickCurrentRowInfo.userName" autocomplete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item
          label="用户姓名"
          prop="name"
          :rules="[
            { required: true, message: '用户姓名 为空', trigger: ['blur', 'change']},
            { pattern: Regular.Username, message: '2到8位汉字, 字母，数字，下划线，连字符', trigger: ['blur', 'change'] }
           ]"
        >
          <el-input
            v-model.number="clickCurrentRowInfo.name"
            autocomplete="off"
            :disabled="isEditor"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户邮箱"
          prop="mail"
          :rules="[
            { required: true, message: '用户邮箱 为空', trigger: ['blur', 'change']},
            { pattern: Regular.Email, message: '邮箱格式非法', trigger: ['blur', 'change'] }
           ]"
        >
          <el-input v-model="clickCurrentRowInfo.mail" autocomplete="off" :disabled="isEditor"></el-input>
        </el-form-item>
        <el-form-item
          label="用户性别"
          prop="sex"
          :rules="[{ required: true, message: '用户性别 必选', trigger: ['blur', 'change']}]"
        >
          <el-select
            v-model.number="clickCurrentRowInfo.sex"
            placeholder="请选择"
            style="width:100%"
            autocomplete="off"
            :disabled="isEditor"
          >
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户状态"
          prop="state"
          :rules="[{ required: true, message: '用户状态 必选', trigger: ['blur', 'change']}]"
        >
          <el-select
            v-model.number="clickCurrentRowInfo.state"
            placeholder="请选择"
            style="width:100%"
            autocomplete="off"
            :disabled="isEditor"
          >
            <el-option label="正常" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="职位名称"
          prop="position"
          :rules="[ { required: true, message: '职位 必选',trigger: ['blur', 'change']}]"
        >
          <el-select
            v-model="clickCurrentRowInfo.position"
            placeholder="请选择"
            style="width:100%"
            autocomplete="off"
            :disabled="isEditor"
          >
            <el-option
              v-for="item in jobTitle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="入职时间"
          prop="entryTime"
          :rules="[ { required: true, message: '入职时间 必选',trigger: ['blur', 'change']}]"
        >
          <el-date-picker
            v-model="clickCurrentRowInfo.entryTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format
            autocomplete="off"
            :disabled="isEditor"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="部门名称"
          prop="deptIds"
          :rules="[ { required: true, message: '部门名称 必选',trigger: ['blur', 'change']}]"
        >
          <el-cascader
            v-model="clickCurrentRowInfo.deptIds"
            :options="deptIdOption"
            :props="props"
            style="width:100%"
            :disabled="isEditor"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isEditor=false" v-if="isEditor">编 辑</el-button>
        <el-button type="primary" @click="submitForm('viewOReditorUserInfo')" v-else>保 存</el-button>
        <!--  @click="saveEditorUser" -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import {} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "internalUser",
  data() {
    var checkUserName = async (rule, value, callback) => {
      // 验证 登录手机号
      if (!value) return callback(new Error("手机号码 不能为空"));
      else if (!Regular.Phone.test(value))
        return callback(new Error("请输入正确固话或手机号"));
      else if (value) {
        // 调用接口 验证唯一性
        let res = await checkPhone({
          phoneNo: value
        });
        if (res.result) callback();
        else callback(new Error("该号码已存在,请更换号码注册"));
      }
    };
    let checkName = (rule, value, callback) => {
      // 验证 user Name
      if (!value) return callback(new Error("用户名称 不能为空"));
      else if (!Regular.Username.test(value))
        callback(new Error("2到16位（汉字, 字母，数字，下划线，连字符）"));
      else {
        callback();
      }
    };
    let checkEmail = (rule, value, callback) => {
      // 验证 email
      if (!value) return callback(new Error("邮箱不能为空"));
      else if (!Regular.Email.test(value))
        return callback(new Error("邮箱格式非法"));
      else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      // 验证 密码
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      // 验证 确认密码
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      show: true,
      handle: [
        {
          function: "resetPassword",
          text: "重置密码",
          type: "text",
          show: true
        },
        {
          function: "viewOReditorUserInfo",
          text: "查看/编辑",
          type: "text",
          show: true
        },
        {
          function: "changeUserStatus",
          text: "修改状态",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "userName",
          label: "登录账号"
        },
        {
          id: "name",
          label: "用户名称"
        },
        {
          id: "position",
          label: "职位名称"
        },
        {
          id: "mail",
          label: "邮箱"
        },
        {
          id: "deptName",
          label: "部门名称"
        },
        {
          id: "state",
          label: "用户状态"
        },
        {
          id: "entryTimeStr",
          label: "入职时间"
        }
      ],
      Regular: Regular, // 验证
      userStatusDialogVisible: false,
      fromPage: "internalUser",
      tableData: null, // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      multipleSelection: [], // 用于批量 删除
      dialogFormVisible: false, // 是否显示对话框
      form: {
        userName: "",
        mail: "",
        password: "",
        name: "",
        sex: "",
        state: "",
        position: "",
        entryTime: "",
        deptId: 0,
        deptIds: [],
        checkPass: ""
      },

      clickCurrentRowInfo: {},

      rules: {
        userName: [
          {
            required: true,
            message: "登录账号 必填"
          },
          {
            validator: checkUserName,
            trigger: ["change"]
          }
        ],
        mail: [
          {
            required: true,
            message: "必填 邮箱"
          },
          {
            validator: checkEmail,
            trigger: ["blur", "change"]
          }
        ],
        name: [
          {
            required: true,
            message: "必填 用户名称"
          },
          {
            validator: checkName,
            trigger: ["blur", "change"]
          }
        ],
        sex: [
          {
            required: true,
            message: "必填 性别",
            trigger: ["blur", "change"]
          }
        ],
        state: [
          {
            required: true,
            message: "用户状态 必填",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: "必填 密码",
            trigger: "blur"
          },
          {
            validator: validatePass,
            trigger: ["blur", "change"]
          }
        ],
        checkPass: [
          {
            required: true,
            message: "必填 确认密码",
            trigger: "blur"
          },
          {
            validator: validatePass2,
            trigger: ["blur", "change"]
          }
        ],
        position: [
          {
            required: true,
            message: "必填 职位",
            trigger: ["blur", "change"]
          }
        ],
        entryTime: [
          {
            required: true,
            message: "必填 入职时间",
            trigger: ["blur", "change"]
          }
        ],
        deptId: [
          {
            required: true,
            message: "必填 入职时间",
            trigger: ["blur", "change"]
          }
        ]
      },

      isShowViewUser: false, // 是否显示 查看用户 dialog
      isEditor: true,
      searchName: {
        box1: {
          name: "公司名称",
          input: true,
          show: true
        },
        box2: {
          name: "登录账号",
          input: true,
          show: true
        },
        box3: {
          name: "职位名称",
          input: false,
          show: true
        },
        box4: {
          name: "",
          input: false,
          show: false
        },
        box5: {
          name: "",
          input: false,
          show: false
        },
        box6: {
          name: "选择日期",
          input: false,
          show: true
        }
      },
      jobTitle: [
        {
          // 职位名称
          value: "CEO",
          label: "总经理"
        },
        {
          value: "VP",
          label: "副总"
        },
        {
          value: "DIRECTOR",
          label: "总监"
        },
        {
          value: "MANAGER",
          label: "经理"
        },
        {
          value: "EMPLOYEE",
          label: "员工"
        }
      ],
      props: {
        label: "name",
        value: "id"
      },
      deptIdOption: [],
      currentUserStatusId: "",
      accountStatus: 0,
      optionWidth: 250
    };
  },
  beforeCreate() {},
  created() {},
  methods: {
    /*
     ** 修改 用户 状态
     */
    async userStatusChange() {
      let data = {
        userId: this.currentUserStatusId,
        status: this.accountStatus
      };

      this.userStatusDialogVisible = false;
      const res = await updateUserStatus(data);
      if (res.result) {
        this.$message.success(res.message);
        this.$refs.searchBox.internalUser(this.limit, this.offset);
      } else this.$message.warning(res.message);
    },

    /*
     ** 当前 选择 用户   修改用户状态预处理
     */
    changeUserStatus(index, row) {
      // 0 正常 1 禁用
      switch (row.state) {
        case "正常":
          this.accountStatus = 0;
          break;
        case "禁用":
          this.accountStatus = 1;
          break;
      }
      this.currentUserStatusId = row.id;
      this.userStatusDialogVisible = true;
    },

    /*
     ** 获取用户部门树 新增 内部用户
     */
    async getDeptTree(info) {
      info == "newUser" ? (this.dialogFormVisible = true) : "";
      const res = await getDeptTree();
      if (res.result) this.deptIdOption = res.data;
      else this.$message.warning(res.message);
    },

    /*
     ** 新增用户 form 表单 重置
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*
     ** 关闭 新增 内部用户 dialog
     */
    handleDialogClose(formName) {
      this.$refs[formName].resetFields();
    },

    /*
     ** 内部用户 重置 密码
     */
    async resetPassword(index, row) {
      let data = {
        userId: row.id
      };
      const res = await resetPassword(data);
      if (res.result) this.$message.success(res.message);
      else this.$message.warning(res.message);
    },

    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.limit = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     *关闭编辑状态
     */
    handleisShowViewUser() {
      this.isEditor = true;
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.offset = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     ** 初始化 数据 处理函数
     */

    internalUserHadle(val) {
      val.rows.map(item => {
        switch (item.position) {
          case "CEO":
            item.position = "总经理";
            break;
          case "VP":
            item.position = "副总";
            break;
          case "DIRECTOR":
            item.position = "总监";
            break;
          case "MANAGER":
            item.position = "经理";
            break;
          default:
            item.position = "员工";
            break;
        }
        switch (item.state) {
          case 0:
            item.state = "正常";
            break;
          case 1:
            item.state = "禁用";
            break;
        }
      });
      this.total = val.total;
      this.tableData = val.rows;
    },

    /*
     ** 列表 批量删除 用户
     */
    async BatchDeleteUser() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择删除数据!");
        return;
      }
      let data = {
        ids: JSON.stringify(this.multipleSelection)
      };
      let res = await deleteUserByIds(data);
      if (res.result) this.$message.success(res.message);
      else this.$message.warning(res.message);
      this.$refs.searchBox.internalUser(this.limit, this.offset);
    },

    /*
     ** 列表 批量删除 用户  预处理
     */
    handleSelectionChange(val) {
      let arr = [];
      for (var item of val) arr.push(item.id);
      this.multipleSelection = arr;
    },

    /*
     ** 查看/编辑用户信息
     */
    async viewOReditorUserInfo(index, row) {
      const response = await viewOReditor({
        userPhone: row.userName
      });
      if (response.result) {
        response.data.deptIds === null ? (response.data.deptIds = []) : "";
        response.data.sex = Number(response.data.sex);
        response.data.state = Number(response.data.state);
        this.clickCurrentRowInfo = response.data;
        this.isShowViewUser = true;
      } else this.$message.warning(response.data.message);
      this.getDeptTree();
    },

    /*
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          formName === "form"
            ? this.submitAddUser("insertUser")
            : this.saveEditorUser();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 新增 / 编辑 内部用户
     */
    async submitAddUser(info) {
      let sendData = this.form;
      sendData.deptId = sendData.deptIds[sendData.deptIds.length - 1];
      delete sendData.checkPass;
      sendData.entryTime = sendData.entryTime + " " + "00:00:00";

      // // info 如果 是 insertUser 则为 新增 否为 为 查看 和编辑 用户数据
      let data = info === "insertUser" ? sendData : this.clickCurrentRowInfo;
      const res = await saveAdminUser(data);
      if (res.result) {
        info === "insertUser"
          ? ""
          : this.viewOReditorUserInfo(this.clickCurrentRowInfo);
        this.$refs.searchBox.internalUser(this.limit, this.offset);
        this.$message.success(res.message);
      } else this.$message.warning(res.message);
      this.dialogFormVisible = false;
    },

    /*
     ** 保存 查看/编辑 用户信息
     */
    saveEditorUser() {
      let info = this.clickCurrentRowInfo;
      info.deptId = info.deptIds[info.deptIds.length - 1];
      info.entryTime = this.$root.createTime(info.entryTime);
      delete info.deptName;
      delete info.entryTimeStr;
      delete info.deptName;
      delete info.openId;
      delete info.roleName;
      delete info.deptIds;
      this.isEditor = true;
      this.submitAddUser("updateUser");
      this.isShowViewUser = false;
    }
  },
  components: {
    // searchBox,
    headTop
  }
};
</script>
<style>
</style>