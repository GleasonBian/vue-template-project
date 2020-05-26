<template>
  <div>
    <!-- 面包屑 -->
    <!-- <headTop></headTop> -->

    <!-- 搜索框 -->
    <gt-search :data="searchData" @handle="getData" size></gt-search>

    <!-- 列表操作按钮 -->
    <el-col align="left" style="margin-bottom:1%">
      <el-button type="primary" size="medium" @click="newAssign" style="margin-left:1%">新增</el-button>
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
        v-on:viewAssign="viewAssign"
        v-on:deleteCorp="deleteCorp"
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
    return {
      show: true,
      handle: [
        {
          function: "viewAssign",
          text: "查看/编辑",
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
          label: "调令编号"
        },
        {
          id: "corpclass",
          label: "车辆名称"
        },
        {
          id: "corptype",
          label: "车牌号码"
        },
        {
          id: "corprank",
          label: "项目名称"
        },
        {
          id: "email",
          label: "作业时长"
        },
        {
          id: "tel",
          label: "接班时间"
        },
        {
          id: "tel",
          label: "交班时间"
        },
        {
          id: "location",
          label: "值乘司机"
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
        corpclass: "", //所属行业
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
     
      optionWidth: 250
    };
  },
  beforeCreate() {},
  created() {
    this.getData();
  },
  methods: {
    newAssign() {
      this.$router.push({ path: "assignDetail" });
    },
    /**
     ** 调令列表
     */
    async getData(val) {
      const res = await corpSelect();
      this.tableData = res.data;
    },

   
    /*
     ** 查看公司
     */
    async viewAssign(index, row) {
      this.$router.push({ path: "assignDetail", query: { id: row.guid } });
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
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.limit = val;
      this.$refs.searchBox.internalUser(this.limit, this.offset);
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
<style></style>
