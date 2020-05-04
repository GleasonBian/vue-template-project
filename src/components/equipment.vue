<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>

    <!-- 搜索框 -->
    <gt-search :data="searchData" @handle="corpList" size></gt-search>

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
        v-on:ExamineHandle="ExamineHandle"
        v-on:DeleteHandle="DeleteHandle"
        v-on:UpdatePreprocessing="UpdatePreprocessing"
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
      :title="formCurrentStatus+'设备'"
      :visible.sync="dialogFormVisible"
      width="25%"
      @close="DialogClose('form')"
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
        <el-form-item label="所属公司" prop="corpguid">
          <el-select v-model="form.corpguid"  placeholder="请选择" @change="resetDept(form.corpguid)" style="width:100%">
            <el-option
              v-for="item in corpData"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属部门" prop="deptguid">
          <el-select v-model="form.deptguid"  placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in deptData" track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件号码" prop="certguid">
          <el-input v-model="form.certguid"></el-input>
        </el-form-item>

        <el-form-item label="证件类型" prop="certtype">
          <el-input v-model="form.certtype"></el-input>
        </el-form-item>

        <el-form-item label="分类等级" prop="clsrank">
          <el-select v-model="form.clsrank"  placeholder="请选择" style="width:100%">
            <el-option label="一级" value="一级"></el-option>
            <el-option label="二级" value="二级"></el-option>
            <el-option label="三级" value="三级"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类类型" prop="clstype" >
          <el-input v-model="form.clstype" placeholder="请选择"></el-input>
        </el-form-item>

        <el-form-item label="分类类别" prop="class">
          <el-input v-model="form.class" placeholder="请选择"></el-input>
        </el-form-item>

        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="设备编码" prop="code">
          <el-input v-model.number="form.code"></el-input>
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

        <el-form-item label="生产厂家" prop="producer">
          <el-input v-model.number="form.producer"></el-input>
        </el-form-item>

        <el-form-item label="描述信息" prop="descrifptio">
          <el-input v-model.number="form.descrifptio"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="ResetForm('form')">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchBox from "@/common/gtSearch";
import headTop from "@/common/headTop";
import {
  corpSelect,
  getDeptList,
  equiCreate,
  equiSelect,
  equiUpdate,
  equiDetails,
  equiDelete
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
  data() {
    return {
      show: true,
      handle: [
        {
          function: "ExamineHandle",
          text: "查看",
          type: "text",
          show: true
        },
        {
          function: "UpdatePreprocessing",
          text: "更新",
          type: "text",
          show: true
        },
        {
          function: "DeleteHandle",
          text: "删除",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "name",
          label: "设备名称"
        },
        {
          id: "proddate",
          label: "生产日期"
        },
        {
          id: "producer",
          label: "生产厂家"
        },
        {
          id: "clstype",
          label: "分类类型"
        },
        {
          id: "class",
          label: "分类类别"
        },
        {
          id: "clsrank",
          label: "分类等级"
        },
        {
          id: "descrifptio",
          label: "描述信息"
        }
      ],
      // 创建 更新 删除 表单
      form: {
        certguid: "", // 证件号码
        certtype: "", // 证件类型
        clstype: "", // 分类类型
        class: "", // 分类类别
        clsrank: "", // 分类等级
        corpguid: "", // 公司标识
        deptguid: "", // 部门标识
        code: "", // 设备编码
        name: "", // 设备名称
        proddate: "", // 生产日期
        producer: "", // 生产厂家
        descrifptio: "", // 描述
      },
      tableData: [], // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      multipleSelection: [], // 用于批量 删除
      dialogFormVisible: false, // 是否显示 新增 删除 更新 对话框
      formCurrentStatus: "", // 表单当前状态
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
        certguid: [
          {
            required: true,
            message: "证件号码 必填"
          }
        ],
        certtype: [
          {
            required: true,
            message: "证件类型 必填"
          }
        ],
        clstype: [
          {
            required: true,
            message: "必填 分类类型",
            trigger: ["blur", "change"]
          }
        ],
        class: [
          {
            required: false,
            message: "必填 分类类别",
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
        code: [
          {
            required: true,
            message: "设备编码 必填",
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
        descrifptio: [
          {
            required: false,
            message: "描述信息 必填",
            trigger: ["blur", "change"]
          }
        ],

      },
      isShowViewUser: false, // 是否显示 查看用户 dialog
      isEditor: true,
      optionWidth: 250,
      // 公司列表
      corpData:[],
      // 部门列表
      deptData:[],
    };
  },
  beforeCreate() {},
  created() {
    this.corpList();
    this.deptList();
    this.equiList();
  },
  methods: {

    /**
     ** 公司列表
     */
    async corpList(val) {
      const res = await corpSelect();
      console.log('公司列表',res.data)
      this.corpData = res.data;
    },

    /**
     ** 部门列表
     */
    async deptList(val) {
      const res = await getDeptList({ deptguid: val || null });
      console.log('部门列表',res.data)
      this.deptData = res.data;
    },

    /**
     ** 更换公司清空部门, 重新获取部门列表
     */
    async resetDept(cid){
      this.deptData = [];
      this.form.deptguid = null;
      this.$forceUpdate();
      this.deptList(cid)
    },

    /*
     ** form 表单 验证
     */
    submitForm(formName) {
      console.log("232323")
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

    /**
     ** 公司列表
     */
    async equiList() {
      const res = await equiSelect();
      console.log('公司列表',res.data)
      this.tableData = res.data;
    },

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

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {
      console.log(row);
      this.formCurrentStatus = "查看";
      const response = await equiDetails({
        id: row.guid
      });
      if (response.status === 200) {
        this.form = response.data;
        this.dialogFormVisible = true;
      } else this.$message.warning("请稍后再尝试");
    },

    /*
     ** 更新预处理
     */
    async UpdatePreprocessing(index, row) {
      console.log(index, row)
      this.ExamineHandle(index, row);
      this.formCurrentStatus = "更新";
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
     ** 删除处理
     */
    async DeleteHandle(index, row) {
      let that = this;
      this.$confirm("删除设备?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let res = equiDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          this.equiList();
        })
        .catch(err => {});
    },

    /*
     ** form 表单 重置
     */
    ResetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*
     ** 关闭 dialog
     */
    DialogClose(formName) {
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