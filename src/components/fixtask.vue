<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>

    <!-- 搜索框 -->
    <gt-search :data="searchData" @handle="corpList" size></gt-search>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:1%">
<<<<<<< Updated upstream
      <el-button type="primary" size="medium"  @click="dialogFormVisible = true; ResetForm('form'); form={};formCurrentStatus = '创建'" style="margin-left:1%">新增</el-button>
=======
      <el-button type="primary" size="medium"  @click="newCreate('form')" style="margin-left:1%">新增</el-button>
>>>>>>> Stashed changes
      <!-- <el-button type="danger" size="medium" @click="BatchDeleteUser">批量删除</el-button> -->
    </el-col>

    <!-- 表格 -->
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
        v-on:IntoTask="IntoTask"
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
    <el-dialog :title="formCurrentStatus+'任务'" :visible.sync="dialogFormVisible" width="30%" @close="DialogClose('form')" :close-on-click-modal="false" top="0vh" center >
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="80px" style="width:100%" >

        <el-form-item label="所属公司" prop="corpguid" v-if="formCurrentStatus==='创建'">
          <el-select v-model="form.corpguid"  placeholder="请选择" @change="resetDept(form.corpguid)" style="width:100%">
            <el-option
              v-for="item in corpData"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计划编码" prop="code">
          <el-input  v-model="form.code"></el-input>
        </el-form-item>

        <el-form-item label="计划标识" prop="planguid">
          <el-select v-model="form.planguid"  placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in fixData" 
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备标识" prop="equipguid">
          <el-select v-model="form.equipguid"  placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in equiData" track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="维修内容" prop="content">
          <el-input v-model="form.content"></el-input>
        </el-form-item>

        <el-form-item label="调度部门" prop="deptsched">
          <el-select v-model="form.deptsched"  placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in deptData" track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="接收部门" prop="deptrecv">
          <el-select v-model="form.deptrecv"  placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in deptData" track-by="item.guid"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计划开始" prop="planstart">
          <el-date-picker v-model="form.planstart"
            type="datetime"
            placeholder="选择日期"
            format="yyyy年MM月dd日 hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="计划结束" prop="planstop">
          <el-date-picker v-model="form.planstop"
            type="datetime"
            placeholder="选择日期"
            format="yyyy年MM月dd日 hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="实际开始" prop="factstart">
          <el-date-picker v-model="form.factstart"
            type="datetime"
            placeholder="选择日期"
            format="yyyy年MM月dd日 hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="实际结束" prop="factstop">
          <el-date-picker v-model="form.factstop"
            type="datetime"
            placeholder="选择日期"
            format="yyyy年MM月dd日 hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="开始时间" prop="recvdate">
          <el-date-picker v-model="form.recvdate"
            type="datetime"
            placeholder="选择日期"
            format="yyyy年MM月dd日 hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="schedate">
          <el-date-picker v-model="form.schedate"
            type="datetime"
            placeholder="选择日期"
            format="yyyy年MM月dd日 hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer" v-if="form.statuscode!=2">
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
  corpSelect, // 公司
  getDeptList, // 部门
  getStaffList, // 人员
  fixdeCreate, // 维修任务创建
  fixdeSelect, // 维修列表
  fixdeDetail, // 维修详情
  fixdeUpdate,  // 任务更新
  fixdeDelete,  // 任务删除
  equiSelect,   // 设备列表
  fixSelect,    //维修计划列表
  fixTaskStart, // 任务开始
  fixTaskStop,  // 任务结束
} from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "fixtask",
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
        },
        {
          function: "IntoTask",
          text: "任务",
          type: "text",
          show: true
        }
      ],
      columns: [
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
        },
      ],
      // 创建 更新 删除 表单
      form: {
        corpguid: "",
        code: "",                 // 计划编码
        planguid: "",             // 计划标识
        name: "",                 // 任务名称
        equipguid: "",            // 设备标识
        content: "",              // 维修内容
        deptsched: "",            // 调度部门
        deptrecv: "",             // 接收部门
        planstart: "",            // 计划开始
        planstop: "",             // 计划结束
        factstart: "",            // 实际开始
        factstop: "",             // 实际结束
        recvdate: "",             // 开始时间
        schedate: "",             // 结束时间
        statuscode: 0,            // 不在页面展示 给个零
        factdur: 0,               // 不在页面展示 给个零
        plandur: 0,               // 不在页面展示 给个零
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
        code: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        corpguid: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],

        planguid: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        name: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        equipguid: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        content: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        deptsched: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        deptrecv: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        planstart: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        planstop: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        factstart: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        factstop: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        recvdate: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
        schedate: [{
            required: true,
            message: "必填",
            trigger: ["blur", "change"]
          }],
      },
      isShowViewUser: false, // 是否显示 查看用户 dialog
      isEditor: true,
      optionWidth: 250,
      // 公司列表
      corpData:[],
      // 部门列表
      deptData:[],
      // 计划列表
      fixData:[],
      // 设备列表
      equiData:[],
      // 人员列表
      staffData:[], 
    };
  },
  beforeCreate() {},
  created() {
    this.corpList();
    this.deptList();
    this.equiList();
    this.fixList();
    this.detaList();
    this.staffList();
  },
  // mounted(){
  //   this.dialogFormVisible=true;
  //   setTimeout(() => {
  //     this.dialogFormVisible=false;
  //   }, 0);
  // },
  methods: {

    /**
     ** 创建 / 新增
     */
    newCreate(val) {
      console.log(val);
      this.dialogFormVisible = true;
      this.formCurrentStatus = '创建'
      this.$nextTick(()=>{
        this.$refs[val].resetFields();
      })
    },

    /**
     ** 公司列表
     */
    async corpList(val) {
      const res = await corpSelect();
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
     ** 人员列表
     */
    async staffList(val) {
      const res = await getStaffList();
      this.staffData = res.data;
    },
    /**
     ** 计划列表
     */
    async fixList(val) {
      const res = await fixSelect();
      console.log('计划列表',res.data)
      this.fixData = res.data;
    },

    /**
     ** 维修任务列表
     */
    async detaList(val) {
      const res = await fixdeSelect();
      console.log('维修任务',res.data)
      this.tableData = res.data;
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formCurrentStatus === "创建") this.CreateHandle();
          else if (this.formCurrentStatus === "更新") this.UpdateHandle();
          else if (this.formCurrentStatus === "查看") this.ExamineHandle();
          else if (this.formCurrentStatus === '开始') this.fixTaskStartHandle()
          else if (this.formCurrentStatus === '结束') this.fixTaskStopHandle()
          this.detaList();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /**
     ** 设备列表
     */
    async equiList() {
      const res = await equiSelect();
      console.log('设备列表',res.data)
      this.equiData = res.data;
    },

    /*
     ** 创建处理
     */
    async CreateHandle(info) {
      const res = await fixdeCreate(this.form);
      if (res.status === 200) {
        this.detaList()
        this.$message.success("设备创建成功");
      } else this.$message.warning("设备创建失败");
      this.dialogFormVisible = false;
    },

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {
      this.formCurrentStatus = "查看";
      const response = await fixdeDetail({
        id: row.guid
      });
      if (response.status === 200) {
        this.$nextTick(()=>{
          this.form = response.data;
        })
        
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
      const res = await fixdeUpdate(this.form);
      if (res.status === 200) {
        this.detaList()
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
          let res = fixdeDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
          this.detaList()
        })
        .catch(err => {});
    },

    /*
     ** 进入任务
     */
    IntoTask(index,row) {
      row.statuscode===0?this.formCurrentStatus = '开始':this.formCurrentStatus = '结束'
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
          this.form = row;
      })
    },

    /*
     ** 提交维修开始任务
     */
    async fixTaskStartHandle() {
      const res = await fixTaskStart(this.form)
      if(res.status === 200) 
        this.$message.success('更新成功')
      else
        this.$message.warning("更新失败，稍后重试")
      // 关闭dialog
      this.dialogFormVisible = false;
      this.formCurrentStatus = '结束';
    },

    /*
     ** 提交维修结束任务
     */
    async fixTaskStopHandle(index,row) {
      const res = await fixTaskStop(this.form)
      if(res.status === 200) 
        this.$message.success('更新成功')
      else
        this.$message.warning("更新失败，稍后重试")
      // 关闭dialog
      this.dialogFormVisible = false;
      this.formCurrentStatus = ''
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