<template>
  <div>
    <!-- 面包屑 -->
    <!-- <headTop></headTop> -->

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
        :tableData="staffList"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:editRole="editRole"
        v-on:delRole="delRole"
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
      title="新增角色"
      :visible.sync="dialogFormVisible"
      width="25%"
      @close="handleDialogClose('form')"
      :close-on-click-modal="false"
      top="5vh"
      center
    >
      <el-form :model="form" status-icon ref="form" label-width="80px" style="width:100%">
        <el-form-item label="所属公司" prop="corpguid" :rules="[ { required: true, message: '公司 必选'}]">
          <el-select
            v-model="form.corpguid"
            @change="resetDept(form.corpguid)"
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
        <el-form-item
          v-if="form.corpguid"
          label="所属部门"
          prop="deptguid"
          :rules="[ { required: true, message: '部门 必选'}]"
        >
          <el-select v-model="form.deptguid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in deptList"
              track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name" :rules="[ { required: true, message: '角色名称 必填'}]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="code" :rules="[ { required: true, message: '角色编号 必填'}]">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="dialogEditFormVisible"
      width="25%"
      @close="handleDialogClose('roleDetail')"
      :close-on-click-modal="false"
      top="5vh"
      center
    >
      <el-form
        :model="roleDetail"
        status-icon
        ref="roleDetail"
        label-width="80px"
        style="width:100%"
      >
        <el-form-item label="所属公司" prop="corpguid" :rules="[ { required: true, message: '公司 必选'}]">
          <el-select
            v-model="roleDetail.corpguid"
            @change="resetDept2(roleDetail.corpguid)"
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
        <el-form-item
          v-if="roleDetail.corpguid"
          label="所属部门"
          prop="deptguid"
          :rules="[ { required: true, message: '部门 必选'}]"
        >
          <el-select v-model="roleDetail.deptguid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in deptList"
              track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name" :rules="[ { required: true, message: '角色名称 必填'}]">
          <el-input v-model="roleDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="code" :rules="[ { required: true, message: '角色编号 必填'}]">
          <el-input v-model="roleDetail.code"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('roleDetail',roleDetail.guid)">提交</el-button>
      </span>
    </el-dialog>

    <!-- 查看 或 编辑当前用户信息 -->
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import {
  getRoleList,
  getCompList,
  saveAddRole,
  getDeptList,
  getRoleDetail,
  editRoleDetail,
  delRole
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "staff",
  data() {
    return {
      roleDetail: {
        corpguid: "",
        deptguid: "",
        certtype: "",
        roleguid: ""
      },
      roleList: [],
      staffList: [],
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
          function: "editRole",
          text: "查看/编辑",
          type: "text",
          show: true
        },
        {
          function: "delRole",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "name",
          label: "角色名称"
        },
        {
          id: "code",
          label: "角色编码"
        },

        {
          id: "corpname",
          label: "公司"
        },
        {
          id: "deptname",
          label: "部门"
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
        deptguid: "",
        certtype: "",
        roleguid: ""
      },

      clickCurrentRowInfo: {},

      isShowViewUser: false, // 是否显示 查看用户 dialog
      isEditor: true,

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
    this.getData();
  },
  methods: {
    async resetDept(cid) {
      //先重制部门列表
      this.deptList = [];
      this.form.deptguid = null;
      this.$forceUpdate();
      this.getDeptList(cid);
    },

    async resetDept2(cid) {
      //先重制部门列表
      this.deptList = [];
      this.roleDetail.deptguid = null;
      this.$forceUpdate();
      this.getDeptList(cid);
    },

    async getData(val) {
      // console.log(val);
      const res = await getRoleList();
      this.staffList = res.data;
    },
    //查看人员列表
    async getRole(did) {
      let data = {
        deptguid: did || null
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      const res = await getRoleList(data);
      if (res.status == 200) {
        // this.$message.success(res.message);
        this.roleList = res.data;
      } else this.$message.warning(res.statusText);
    },
    //查看公司列表
    async getCompList() {
      let data = {
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      const res = await getCompList(data);
      if (res.status == 200) {
        // this.$message.success(res.message);
        this.compList = res.data;
      } else this.$message.warning(res.statusText);
    },
    async editRoleSave(guid) {
      let data = this.roleDetail;

      let saveRes = await editRoleDetail({ data });
      console.log(saveRes);
      if (saveRes.data) {
        this.dialogEditFormVisible = false;
        this.$message.success(saveRes.statusText);
        this.getData();
      }
    },
    async getRoleDetail(guid) {
      let id = guid;
      let data = {
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      this.getCompList();
      this.getDeptList();
      let detail = await getRoleDetail({ id });
      if (detail.data) {
        this.roleDetail = detail.data[0];
      }
    },

    //查看对应部门列表
    async getDeptList(cid) {
      let data = {
        corpguid: cid || null
        // userId: this.currentUserStatusId,
        // status: this.accountStatus
      };
      const res = await getDeptList(data);
      if (res.data) {
        // this.$message.success(res.message);
        this.deptList = [...res.data];
      } else this.$message.warning(res.message);
    },

    /*
     ** 获取用户部门树 新增 内部用户
     */
    async getDeptTree(info) {
      info == "newUser" ? (this.dialogFormVisible = true) : "";
      this.getCompList();
      this.getRole();
    },
    async editRole(index, row) {
      this.dialogEditFormVisible = true;
      console.log(row);
      this.getRoleDetail(row.guid);
    },
    async delRole(index, row) {
      this.$confirm("删除角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row);
          let res = delRole({ id: row.guid });
          if (res.data) {
            this.$message.success("删除成功");
            this.getData();
          }
        })
        .catch(() => {});
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
     ** 新增 用户 form 表单 验证
     */
    submitForm(formName, id) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          formName === "form" ? this.addRole("add") : this.editRoleSave(id);
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 新增 / 编辑 内部用户
     */
    async addRole(info) {
      let data = this.form;

      const res = await saveAddRole(data);
      if (res.status == 200) {
        this.getData(this.limit, this.offset);
        this.$message.success(res.statusText);
      } else this.$message.warning(res.statusText);
      this.dialogFormVisible = false;
    }

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