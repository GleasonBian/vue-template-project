<template>
  <div>
    <!-- 面包屑 -->
    <!-- <headTop></headTop> -->

    <!-- 搜索框 -->
    <gt-search :data="searchData" @handle="chargePlans" size></gt-search>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:12px;">
      <el-button
        type="primary"
        size="mini"
        @click="
          dialogFormVisible = true;
          formCurrentStatus = '创建';
        "
        style="margin-left:12px;"
      >新增</el-button>
      <!-- <el-button type="danger" size="mini" @click="BatchDeleteUser">批量删除</el-button> -->
    </el-col>

    <!-- 内部用户列表 -->
    <el-col align="middle">
      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:checkTasks="checkTasks"
        v-on:DeleteHandle="DeleteHandle"
        v-on:UpdatePreprocessing="UpdatePreprocessing"
        :handle="handle"
        size="mini"
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

    <!-- check tasks -->
    <el-dialog
      :title="'任务列表'"
      :visible.sync="taskDial"
      width="75%"
      :close-on-click-modal="false"
      top="0vh"
      center
    >
      <div style="text-align:center">
        <gt-table
          :tableData="t_tableData"
          style="width: 100%"
          :optionWidth="optionWidth"
          :columns="t_columns"
          :selection="false"
        ></gt-table>
      </div>
    </el-dialog>

    <!-- 新增 查看 更新 -->
    <el-dialog
      :title="formCurrentStatus + '计划'"
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

        <el-form-item v-if="form.corpguid" label="所属部门" prop="deptguid">
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

        <el-form-item label="人员" prop="staffid">
          <el-select v-model="form.staffid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in staffData"
              track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类等级" prop="clsrank">
          <el-select v-model="form.clsrank" placeholder="请选择" style="width:100%">
            <el-option label="一级" value="一级"></el-option>
            <el-option label="二级" value="二级"></el-option>
            <el-option label="三级" value="三级"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类类型" prop="clstype">
          <el-input v-model="form.clstype" placeholder="请选择"></el-input>
        </el-form-item>

        <el-form-item label="分类类别" prop="class">
          <el-input v-model="form.class" placeholder="请选择"></el-input>
        </el-form-item>

        <el-form-item label="计划名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="计划编码" prop="code">
          <el-input v-model="form.code"></el-input>
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
  getStaffList,
  corpSelect,
  getDeptList,
  chargeCreate,
  chargeSelect,
  chargeUpdate,
  chargeDetails,
  chargedeSelect,
  chargeDelete
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
  data() {
    return {
      staffData: [],
      show: true,
      handle: [
        {
          function: "checkTasks",
          text: "查看任务",
          type: "text",
          show: true
        },
        {
          function: "UpdatePreprocessing",
          text: "更新计划",
          type: "text",
          show: true
        },
        {
          function: "DeleteHandle",
          text: "删除计划",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "chargername",
          label: "交接人"
        },
        {
          id: "starttime",
          label: "开始时间"
        },
        {
          id: "stoptime",
          label: "结束时间"
        },
        {
          id: "durtime",
          label: "持续时间"
        },
        {
          id: "beforeoil",
          label: "交接前油量"
        },
        {
          id: "afteroil",
          label: "交接后油量"
        },
        {
          id: "equipid",
          label: "设备"
        },
        {
          id: "oilconsume",
          label: "油耗"
        },
        {
          id: "produceamount",
          label: "数量"
        },
        {
          id: "produceunit",
          label: "单位"
        }
      ],
      t_columns: [
        {
          id: "name",
          label: "任务名称"
        },
        {
          id: "planstart",
          label: "计划开始"
        },
        {
          id: "planstop",
          label: "计划结束"
        },
        {
          id: "factstart",
          label: "实际开始"
        },
        {
          id: "factstop",
          label: "实际结束"
        },
        {
          id: "deptsched",
          label: "调度部门"
        },
        {
          id: "deptrecv",
          label: "接收部门"
        },
        {
          id: "content",
          label: "维修内容"
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
        code: "", // 计划编码
        name: "", // 计划名称
        proddate: "", // 生产日期
        producer: "", // 生产厂家
        descrifptio: "" // 描述
      },
      tableData: [], // 表格数据
      t_tableData: [], // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      multipleSelection: [], // 用于批量 删除
      dialogFormVisible: false, // 是否显示 新增 删除 更新 对话框
      taskDial: false, //tasks dialog
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
            required: true,
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
        staffid: [
          {
            required: true,
            message: "必填 人员标识",
            trigger: ["blur", "change"]
          }
        ],
        code: [
          {
            required: true,
            message: "计划编码 必填",
            trigger: ["blur", "change"]
          }
        ],
        name: [
          {
            required: true,
            message: "计划名称 必填",
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
        ]
      },
      isShowViewUser: false, // 是否显示 查看用户 dialog
      isEditor: true,
      optionWidth: 250,
      // 公司列表
      corpData: [],
      // 部门列表
      deptData: []
    };
  },
  beforeCreate() {},
  created() {
    this.staffList();
    this.corpList();
    this.deptList();
    this.chargePlans();
  },
  methods: {
    /**
     * 查看任务列表
     * **/
    async checkTasks(index, row) {
      this.taskDial = true;
      this.fTasks(row.guid);
    },

    /**
     ** 人员列表
     */
    async staffList(val) {
      const res = await getStaffList();
      this.staffData = res.data;
    },

    /**
     ** 公司列表
     */
    async corpList(val) {
      const res = await corpSelect();
      console.log("公司列表", res.data);
      this.corpData = res.data;
    },

    /**
     ** 部门列表
     */
    async deptList(val) {
      const res = await getDeptList({ deptguid: val || null });
      console.log("部门列表", res.data);
      this.deptData = res.data;
    },

    /**
     ** 更换公司清空部门, 重新获取部门列表
     */
    resetDept(cid) {
      this.deptData = [];
      this.form.deptguid = null;
      this.$forceUpdate();
      this.deptList(cid);
    },

    /*
     ** form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(valid);
          console.log(this.formCurrentStatus);
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
     ** 计划列表
     */
    async chargePlans() {
      const res = await chargeSelect();
      this.tableData = res.data;
    },

    /**
     ** 任务列表
     */
    async fTasks(id) {
      const res = await chargedeSelect({ id: id + "/chargeplan" });
      this.t_tableData = res.data;
    },

    /*
     ** 创建处理
     */
    async CreateHandle(info) {
      const res = await chargeCreate(this.form);
      if (res.status === 200) {
        this.chargePlans();
        this.$message.success("创建成功");
      } else this.$message.warning("创建失败");
      this.dialogFormVisible = false;
    },

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {
      console.log(row);
      this.formCurrentStatus = "查看";
      const response = await chargeDetails({
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
      console.log(index, row);
      this.ExamineHandle(index, row);
      this.formCurrentStatus = "更新";
    },

    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {
      const res = await chargeUpdate(this.form);
      if (res.status === 200) {
        this.chargePlans();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
    },

    /*
     ** 删除处理
     */
    async DeleteHandle(index, row) {
      let that = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let res = chargeDelete({ id: row.guid });
  
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          this.chargePlans();
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
    headTop
  }
};
</script>
<style></style>
