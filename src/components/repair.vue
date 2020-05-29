<template>
  <div style="padding:12px">
    <!-- 搜索框 -->

    <el-card>
      <gt-search :data="searchData" @handle="corpList" size></gt-search>
    </el-card>

    <el-card style="margin-top:12px">
      <el-col align="left" style="margin-bottom:1%">
        <el-select v-model="select" placeholder="请选择新建项" size="medium">
          <el-option label="日常检查保养记录表" value="1"></el-option>
          <el-option label="周检查保养记录表" value="2"></el-option>
          <el-option label="月检查保养记录表" value="3"></el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="CreateHandle" plain>创建</el-button>

        <el-button type="primary" size="medium" @click="BatchDeleteUser">导出</el-button>
      </el-col>
      <el-col align="middle">
        <gt-table
          :tableData="tableData"
          style="width: 100%"
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
    </el-card>
  </div>
</template>
<script>
import {
  corpSelect, // 公司
  getDeptList, // 部门
  getStaffList, // 人员
  equiSelect, // 设备列表
  oilSelect, // 加油计划列表
  oildeCreate, // 加油任务创建
  oildeSelect, // 加油任务列表
  oildeDetail, // 加油任务详情
  oildeUpdate, // 更新加油任务
  oildeDelete, // 加油任务删除
  oilTaskStart, // 加油任务开始
  oilTaskStop // 加油任务结束
} from "@/getData";
export default {
  name: "fixtask",
  data() {
    return {
      // 表格相关数据
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
          label: "保养记录编号"
        },
        {
          id: "planoil",
          label: "车辆名称"
        },
        {
          id: "factoil",
          label: "车牌号码"
        },
        {
          id: "beforeoil",
          label: "申请部门"
        },
        {
          id: "afteroil",
          label: "项目名称"
        },
        {
          id: "staffname",
          label: "保养周期"
        },
        {
          id: "deptname",
          label: "保养人"
        },
        {
          id: "location",
          label: "保养时间"
        }
      ],
      tableData: [], // 表格数据
      total: 0,
      limit: 10,
      offset: 1,
      optionWidth: 250,
      // 搜索框数据
      searchData: [
        {
          key: "guid", // 与后端交互时的字段 必填
          label: "车辆牌号", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          default: "0", // 搜索框 默认值
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "福田", // 下拉选项 绑定 值
              label: "0019" // 下拉选项 绑定 名称
            },
            {
              value: "本田",
              label: "00210"
            }
          ]
        },
        {
          key: "OPM",
          label: "项目部",
          placeholder: "请选择",
          default: "",
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "福田", // 下拉选项 绑定 值
              label: "0019" // 下拉选项 绑定 名称
            },
            {
              value: "本田",
              label: "00210"
            }
          ]
        },
        {
          key: "date",
          label: "搜索框3",
          placeholder: "请选择",
          default: ""
        }
      ],
      select: "1"
    };
  },
  beforeCreate() {},
  created() {},
  methods: {
    /*
     ** 创建处理
     */
    async CreateHandle(info) {
      switch (this.select) {
        case "1":
          this.$router.replace({
            path: "day"
          });
          break;
        case "2":
          this.$router.replace({
            path: "week"
          });
          break;
        case "3":
          this.$router.replace({
            path: "month"
          });
          break;
      }
    },

    /*
     ** 查看处理
     */
    async ExamineHandle(index, row) {
      console.log(index, row);
      this.formCurrentStatus = "查看";
      const response = await oildeDetail({
        id: row.guid
      });
      if (response.status === 200) {
        this.form = row;
        this.dialogFormVisible = true;
      } else this.$message.warning("请稍后再尝试");
    },

    /*
     ** 更新预处理
     */
    UpdatePreprocessing(index, row) {
      console.log(index, row);
      this.ExamineHandle(index, row);
      this.formCurrentStatus = "更新";
    },

    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {
      this.ExamineHandle(index, row);
      const res = await oildeUpdate(this.form);
      if (res.status === 200) {
        this.detaList();
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
      this.dialogFormVisible = false;
    },

    /*
     ** 删除处理
     */
    DeleteHandle(index, row) {
      let that = this;
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await oildeDelete({ id: row.guid });
          console.log(res);
          if (res.status === 200) {
            this.$message.success("删除成功");
            this.detaList();
          }
        })
        .catch(err => {});
    },

    /*
     ** form 表单 重置
     */
    ResetForm(formName) {
      console.log(formName);
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },

    /*
     ** 关闭 dialog
     */
    DialogClose(formName) {
      console.log(formName);
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
  components: {}
};
</script>
<style>
.button_group {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
</style>
