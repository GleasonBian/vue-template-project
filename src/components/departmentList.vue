<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>

    <!-- 搜索框 -->
    <!-- 搜索框 -->
    <gt-search :data="searchData" @handle="getData" size></gt-search>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:1%">
      <el-button
        type="primary"
        size="medium"
        @click="getDeptTree('newUser')"
        style="margin-left:1%"
      >新增</el-button>
      <!-- <el-button type="danger" size="medium" @click="BatchDeleteUser">删除</el-button> -->
    </el-col>

    <!-- 内部用户列表 -->
    <el-col align="middle">
      <gt-table
        :tableData="deptList"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:editDept="editDept"
        v-on:delDept="delDept"
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

    <!-- 新增用户 -->
    <el-dialog
      title="新增部门"
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
        ref="form"
        label-width="80px"
        style="width:100%"
      >
        <el-form-item label="所属公司" prop="corp_guid" :rules="[ { required: true, message: '公司 必选'}]">
          <el-select v-model="form.corp_guid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in compList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name" :rules="[ { required: true, message: '部门名称 必填'}]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="部门编号" prop="code" :rules="[ { required: true, message: '部门编号 必填'}]">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="部门类别" prop="deptclass" :rules="[ { required: true, message: '部门类别 必填'}]">
          <el-input v-model="form.deptclass"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="depttype" :rules="[ { required: true, message: '部门类型 必填'}]">
          <el-input v-model="form.depttype"></el-input>
        </el-form-item>
        <el-form-item label="部门级别" prop="deptrank" :rules="[ { required: true, message: '部门级别 必填'}]">
          <el-select v-model="form.deptrank" placeholder="请选择" style="width:100%">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期" prop="regdate" :rules="[ { required: true, message: '注册日期 必填'}]">
          <el-date-picker
            v-model="form.regdate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门简介" prop="briefabout" :rules="[ { required: false, message: '部门简介 必填'}]">
          <el-input v-model="form.briefabout"></el-input>
        </el-form-item>
        <el-form-item label="部门位置" prop="location" :rules="[ { required: true, message: '部门位置 必填'}]">
          <el-input v-model="form.location"></el-input>
        </el-form-item>
        <el-form-item label="上级标识" prop="superior" :rules="[ { required: true, message: '上级标识 必填'}]">
          <el-input v-model="form.superior"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

    
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog
      title="编辑部门"
      :visible.sync="dialogEditFormVisible"
      width="25%"
      @close="handleDialogClose('deptDetail')"
      :close-on-click-modal="false"
      top="5vh"
      center
    >
      <el-form
        :model="deptDetail"
        status-icon
        ref="deptDetail"
        label-width="80px"
        style="width:100%"
      >
        <el-form-item label="所属公司" prop="corp_guid" :rules="[ { required: true, message: '公司 必选'}]">
          <el-select v-model="deptDetail.corp_guid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in compList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name" :rules="[ { required: true, message: '部门名称 必填'}]">
          <el-input v-model="deptDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="部门编号" prop="code" :rules="[ { required: true, message: '部门编号 必填'}]">
          <el-input v-model="deptDetail.code"></el-input>
        </el-form-item>
        <el-form-item label="部门类别" prop="deptclass" :rules="[ { required: true, message: '部门类别 必填'}]">
          <el-input v-model="deptDetail.deptclass"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="depttype" :rules="[ { required: true, message: '部门类型 必填'}]">
          <el-input v-model="deptDetail.depttype"></el-input>
        </el-form-item>
        <el-form-item label="部门级别" prop="deptrank" :rules="[ { required: true, message: '部门级别 必填'}]">
          <el-select v-model="deptDetail.deptrank" placeholder="请选择" style="width:100%">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期" prop="regdate" :rules="[ { required: true, message: '注册日期 必填'}]">
          <el-date-picker
            v-model="deptDetail.regdate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门简介" prop="briefabout" :rules="[ { required: false, message: '部门简介 必填'}]">
          <el-input v-model="deptDetail.briefabout"></el-input>
        </el-form-item>
        <el-form-item label="部门位置" prop="location" :rules="[ { required: true, message: '部门位置 必填'}]">
          <el-input v-model="deptDetail.location"></el-input>
        </el-form-item>
        <el-form-item label="上级标识" prop="superior" :rules="[ { required: true, message: '上级标识 必填'}]">
          <el-input v-model="deptDetail.superior"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="deptDetail.description"></el-input>
        </el-form-item>

    
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('deptDetail',deptDetail.guid)">提交</el-button>
      </span>
    </el-dialog>

    <!-- 查看 或 编辑当前用户信息 -->
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import { getCompList, saveAddDept, getDeptList, getDeptDetail, editDeptDetail, delDept } from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "internalUser",
  data() {
    
    return {
      deptDetail: {},
      searchData: [
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
      rules: [],
      show: true,
      handle: [
        {
          function: "editDept",
          text: "查看/编辑",
          type: "text",
          show: true
        },
        {
          function: "delDept",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "name",
          label: "部门名称"
        },
        {
          id: "code",
          label: "部门编码"
        },
        {
          id: "deptrank",
          label: "部门级别"
        },
        {
          id: "deptclass",
          label: "部门类别"
        },
        {
          id: "depttype",
          label: "部门类型"
        },
        {
          id: "regdate",
          label: "注册时间"
        }
      ],
      Regular: Regular, // 验证
      userStatusDialogVisible: false,
      fromPage: "deptList",
      tableData: null, // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      multipleSelection: [], // 用于批量 删除
      dialogFormVisible: false, // 是否显示对话框
      dialogEditFormVisible: false, //编辑部门模态
      form: {
        
      },

      clickCurrentRowInfo: {},

      

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
      compList: [],
      props: {
        label: "name",
        value: "id"
      },
      deptIdOption: [],
      deptList: [],
      currentUserStatusId: "",
      accountStatus: 0,
      optionWidth: 250
    };
  },
  beforeCreate() {},
  created() {
    this.getCompList();
    this.getDeptList();
  },
  methods: {
    getData: function (res) {
        // childValue就是子组件传过来的值
        this.deptList = res.data;
        console.log(this.deptList)
      },
    //查看公司列表
    async getCompList() {
      let data = {
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      const res = await getCompList(data);
      if (res.data) {
        // this.$message.success(res.message);
        this.compList=res.data;
      } else this.$message.warning(res.message);
    },
    async editDeptSave(guid){
      let data = this.deptDetail;
      
      let saveRes = await editDeptDetail({data});
      console.log(saveRes)
      if (saveRes.data){
        this.dialogEditFormVisible=false;
        this.$message.success(saveRes.statusText);
        this.getDeptList()
      }
    },
    async getDeptDetail(guid){
      let id = guid;
      let data = {
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      let detail = await getDeptDetail({id,data});
      if (detail.data){
        this.deptDetail=detail.data[0]
      }
    },

    //查看部门列表
     async getDeptList() {
      let data = {
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      const res = await getDeptList(data);
      if (res.data) {
        // this.$message.success(res.message);
        this.deptList=res.data
      } else this.$message.warning(res.message);
    },

    /*
     ** 获取用户部门树 新增 内部用户
     */
    async getDeptTree(info) {
      info == "newUser" ? (this.dialogFormVisible = true) : "";
      this.getCompList();
    },
    async editDept(index,row){
      this.dialogEditFormVisible = true;
      console.log(row)
      this.getDeptDetail(row.guid)
    },
    async delDept(index,row){
      let that = this;
       this.$confirm('删除部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row)
          let res = delDept({id:row.guid});
          if (res) {
            this.$message.success('删除成功');
            that.getDeptList()
          }
        }).catch(() => {
                   
        });
      
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
    submitForm(formName,id) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          formName === "form"
            ? this.addDept("add")
            : this.editDeptSave(id);
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 新增 / 编辑 内部用户
     */
    async addDept(info) {
      let data = this.form;
      
      const res = await saveAddDept(data);
      if (res.status==200) {
        this.getData(this.limit, this.offset);
        this.$message.success(res.statusText);
      } else this.$message.warning(res.message);
      this.dialogFormVisible = false;
    },

    /*
     ** 保存 查看/编辑 用户信息
     */
    
  },
  components: {
    // searchBox,
    headTop
  }
};
</script>
<style>
</style>