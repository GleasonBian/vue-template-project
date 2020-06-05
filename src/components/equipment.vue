<template>
  <div style="padding:12px">
    <el-card style="margin-bottom:12px">
      <gt-search :data="searchData"></gt-search>
    </el-card>

    <el-card>
      <router-link to="/platform/vehicle">
        <el-button type="primary" size="medium" style="margin-bottom:12px">新增</el-button>
      </router-link>

      <gt-table
        :tableData="tableData"
        style="width: 98%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:ExamineHandle="ExamineHandle"
        v-on:DeleteHandle="DeleteHandle"
        :handle="handle"
      ></gt-table>
      <el-pagination
        style="margin-top:12px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageno"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 新增 查看 更新 -->
  </div>
</template>
<script>
import { equiDelete, equiSelect } from "@/getData";
import { Regular } from "@/config/verification";
export default {
  name: "createCorperation",
  data() {
    return {
      show: true,
      handle: [
        {
          function: "ExamineHandle",
          text: "查看/更新",
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
          id: "corpname",
          label: "所属公司"
        },
        {
          id: "deptname",
          label: "所属部门"
        },
        {
          id: "name",
          label: "设备名称"
        },
        {
          id: "clstype",
          label: "车辆类型"
        },
        {
          id: "class",
          label: "车辆型号"
        },
        {
          id: "plateno",
          label: "车牌号"
        },
        {
          id: "oilboxheight",
          label: "油箱高度/cm"
        },
        {
          id: "oilboxvol",
          label: "油箱容量/L"
        }
      ],
      tableData: [], // 表格数据
      optionWidth: 250,
      total: 0,
      pagesize: 10,
      pageno: 1,
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
        }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.equiList();
  },
  methods: {
    /**
     ** 设备列表
     */
    async equiList() {
      const res = await equiSelect();
      this.tableData = res.data;
    },

    /*
     ** 查看更新处理
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
    }
  }
};
</script>
<style></style>
