<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>

    <!-- 搜索框 -->
    <gt-search :data="searchData" @handle="getData" size></gt-search>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:1%">
      <el-button
        type="primary"
        size="medium"
        @click="dialogFormVisible = true;formCurrentStatus = '创建'"
        style="margin-left:1%"
      >新增</el-button>
      <!-- <el-button type="danger" size="medium" @click="BatchDeleteUser">批量删除</el-button> -->
    </el-col>

    <!-- 内部用户列表 -->
    <el-col align="middle">
      <gt-table
        :tableData="tableData"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:viewCorp="viewCorp"
        v-on:deleteCorp="deleteCorp"
        v-on:updatePretreatment="updatePretreatment"
        :handle="handle"
      ></gt-table>
      <!-- v-on:selection-change="handleSelectionChange" -->
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

    <!-- 新增 查看 更新 -->
    <el-dialog
      :title="formCurrentStatus+'公司'"
      :visible.sync="dialogFormVisible"
      width="25%"
      @close="handleDialogClose('form')"
      :close-on-click-modal="false"
      top="0vh"
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
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="公司编码" prop="code">
          <el-input  v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="tel">
          <el-input  v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="公司邮箱" prop="email">
          <el-input  v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="地理位置" prop="location">
          <el-input v-model="form.location"></el-input>
        </el-form-item>
        <el-form-item label="公司类别" prop="corpclass">
          <el-input v-model="form.corpclass"></el-input>
        </el-form-item>
        <el-form-item label="公司类型" prop="corptype">
          <el-input v-model="form.corptype"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certtype">
          <el-input v-model="form.certtype"></el-input>
        </el-form-item>
        <el-form-item label="机构代码" prop="certguid">
          <el-input v-model="form.certguid"></el-input>
        </el-form-item>
        <el-form-item label="上级标识" prop="superior">
          <el-input v-model="form.superior"></el-input>
        </el-form-item>
        <el-form-item label="公司税号" prop="taxcode">
          <el-input v-model="form.taxcode"></el-input>
        </el-form-item>
        <el-form-item label="公司备注" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="公司简介" prop="briefabout">
          <el-input v-model="form.briefabout"></el-input>
        </el-form-item>
        <el-form-item label="公司级别" prop="corprank">
          <el-select v-model="form.corprank" placeholder="请选择" style="width:100%">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期" prop="regdate">
          <el-date-picker
            v-model="form.regdate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import {
  corperation,
  corpSelect,
  corpDtails,
  corpUpdate,
  corpDelete
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
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
          function: "viewCorp",
          text: "查看",
          type: "text",
          show: true
        },
        {
          function: "updatePretreatment",
          text: "更新",
          type: "text",
          show: true
        },
        {
          function: "deleteCorp",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "name",
          label: "公司名称"
        },
        {
          id: "corpclass",
          label: "公司类别"
        },
        {
          id: "corptype",
          label: "公司类型"
        },
        {
          id: "corprank",
          label: "公司级别"
        },
        {
          id: "email",
          label: "公司邮箱"
        },
        {
          id: "tel",
          label: "公司电话"
        },
        {
          id: "location",
          label: "地理位置"
        }
      ],
      tableData: null, // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      multipleSelection: [], // 用于批量 删除
      dialogFormVisible: false, // 是否显示 新增 删除 更新 对话框
      formCurrentStatus: "", // 表单当前状态
      // 创建 更新 删除 表单
      form: {
        briefabout: "", //公司简介
        certguid: "", //公司组织结构代码
        certtype: "", //证件类型
        code: "", //公司编码
        corpclass: "", //公司类别
        corprank: "", //公司级别
        corptype: "", //公司类型
        description: "", //备注
        location: "", //地理信息
        name: "", //公司名称
        regdate: "", // 注册日期
        superior: "", // 上级标识
        taxcode: "", // 税号
        email: "", // 公司邮箱
        tel: "" // 公司电话
      },
      searchData: [
        // 搜索框 数据
        {
          key: "id", // 与后端交互时的字段 必填
          label: "搜索框1", // 搜索框名称 必填
          placeholder: "请搜索", // 占位符 选填
          default: "0", // 搜索框 默认值
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "1", // 下拉选项 绑定 值
              label: "男" // 下拉选项 绑定 名称
            },
            {
              value: "0",
              label: "女"
            }
          ]
        },
        {
          key: "date",
          label: "搜索框2",
          placeholder: "",
          default: ""
        },
        {
          key: "age",
          label: "搜索框3",
          placeholder: "请搜索",
          default: ""
        },
        {
          key: "ccc",
          label: "搜索框4",
          placeholder: "请搜索",
          default: ""
        },
        {
          key: "asdafs",
          label: "搜索框5",
          placeholder: "请搜索",
          default: ""
        },
        {
          key: "adgdd",
          label: "搜索框6",
          placeholder: "请搜索",
          default: ""
        }
      ],
      Regular: Regular, // 表单校验正则
      // 表单校验规则
      rules: {
        name: [
          {
            required: true,
            message: "公司名称 必填"
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
            message: "必填 公司类别",
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
            required: true,
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
      isShowViewUser: false, // 是否显示 查看用户 dialog
      isEditor: true,
      optionWidth: 250
    };
  },
  beforeCreate() {},
  created() {
    this.getData();
  },
  methods: {
    /**
     ** 公司查询
     */
    async getData(val) {
      const res = await corpSelect();
      this.tableData = res.data;
    },

    /*
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formCurrentStatus === "创建") this.submitAddUser();
          else if (this.formCurrentStatus === "更新") this.updateCorp();
          else if (this.formCurrentStatus === "查看") this.viewCorp();
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
    async viewCorp(index, row) {
      console.log(row);
      this.formCurrentStatus = "查看";
      const response = await corpDtails({
        id: row.guid
      });
      if (response.status === 200) {
        this.form = response.data[0];
        this.dialogFormVisible = true;
      } else this.$message.warning("请稍后再尝试");
    },

    /*
     ** 更新预处理
     */
    async updatePretreatment(index, row) {
      this.viewCorp(index, row);
      this.formCurrentStatus = "更新";
    },

    /*
     ** 更新公司
     */
    async updateCorp(index, row) {
      const res = await corpUpdate(this.form);
      if (res.status === 200) {
        this.getData();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
    },

    /*
     ** 删除公司
     */
    async deleteCorp(index, row) {
      console.log(row);
      let that = this;
      this.$confirm("删除公司?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let res = corpDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          that.getData();
        })
        .catch(err => {});
    },

    /*
     ** 创建公司 form 表单 重置
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*
     ** 关闭 创建公司  dialog
     */
    handleDialogClose(formName) {
      this.$refs[formName].resetFields();
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