<template>
  <div style="padding:12px">
    <el-dialog
      title="油箱标的"
      :visible.sync="dialogVisible1"
      width="20%"
      :modal-append-to-body="false"
      center
    >
      <el-form ref="tank" :model="tank" label-width="86px" :rules="tankRules">
        <el-form-item label="实际加油" prop="theory_volume">
          <el-input v-model.number="tank.custom_value" type="number" :step="10" :min="1">
            <el-button slot="append">升</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button @click="tankHandle" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="油箱标的"
      :visible.sync="dialogVisible2"
      width="85%"
      :modal-append-to-body="false"
      center
    >
      <el-table :data="oilMarkData" highlight-current-row ref="singleTable" border>
        <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="updatetime" label="标的时间" align="center"></el-table-column>
        <el-table-column prop="platform_value" label="平台加油量" align="center"></el-table-column>
        <el-table-column prop="custom_value" label="实际加油" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.flag===0?'未标的':'已标的'}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.flag!==0" type="text" @click="markOil(scope.row)">标的</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-form ref="tank" :model="tank" label-width="86px" :rules="tankRules">
        <el-form-item label="实际加油" prop="theory_volume">
          <el-input v-model.number="tank.custom_value" type="number" :step="10" :min="1">
            <el-button slot="append">升</el-button>
          </el-input>
        </el-form-item>
      </el-form>-->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button @click="tankHandle" type="primary">确定</el-button>
      </span>-->
    </el-dialog>
    <el-card style="margin-bottom:12px">
      <gt-search :data="searchData" @handle="equiList" ref="equiSearch"></gt-search>
    </el-card>

    <el-card>
      <router-link to="/platform/vehicle">
        <el-button type="primary" size="mini" style="margin-bottom:12px" >新增</el-button>
      </router-link>
      <el-button
        type="success"
        size="mini"
        style="margin-bottom:12px; margin-left:12px"
        @click="exportHandle"
      >导出</el-button>
      <gt-table
        :tableData="tableData"
        style="width: 100%"
        :optionWidth="optionWidth"
        :columns="columns"
        :selection="false"
        v-on:ExamineHandle="ExamineHandle"
        v-on:DeleteHandle="DeleteHandle"
        v-on:ComeOnTag="ComeOnTag"
        :handle="handle"
        size="mini"
        height="70vh"
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

import {
  equiDelete,
  equiSelectAll,
  getOilMark,
  corpSelect,
  ComeOnTag
} from "@/getData";
export default {
  name: "createCorperation",
  data() {
    return {
      show: true,
      oilMarkData: [],
      oilMarkParam: {},
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
        },
        {
          function: "ComeOnTag",
          text: "加油标的",
          type: "text",
          show: true
        }
      ],
      columns: [
        {
          id: "equip_no",
          label: "车辆编号"
        },
        {
          img: true,
          id: "mainImage",
          label: "车辆图片"
        },
        {
          id: "plateno",
          label: "车牌号码"
        },
        {
          id: "name",
          label: "车辆名称"
        },
        {
          id: "corpname",
          label: "所属公司"
        },
        {
          id: "deptname",
          label: "所属部门"
        },
        {
          id: "status",
          label: "车辆状态"
        },
        {
          id: "deviceClassify",
          label: "管理类型"
        }
      ],
      tableData: [], // 表格数据
      optionWidth: 250,
      total: 0,
      pagesize: 10,
      pageno: 1,
      searchData: [
        {
          key: "name", // 与后端交互时的字段 必填
          label: "车辆名称", // 搜索框名称 必填
          placeholder: "请输入" // 占位符 选填
          // options: []
        },
        {
          key: "deviceClassify", // 与后端交互时的字段 必填
          label: "管理类型", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          options: [
            {
              label: "公司直管",
              value: "公司直管"
            },
            {
              label: "项目自管",
              value: "项目自管"
            },
            {
              label: "劳务自带",
              value: "劳务自带"
            },
            {
              label: "专业租赁",
              value: "专业租赁"
            }
          ]
        },
        {
          key: "corpguid",
          label: "所属公司",
          placeholder: "请选择", // 占位符 选填
          options: []
        }
      ],
      dialogVisible1: false,
      dialogVisible2: false,
      tank: {
        custom_value: 0,
        equip_guid: "",
        platform_value: 0
      },
      tankRules: {}
    };
  },
  beforeCreate() {},
  created() {
    this.equiList();
    this.corpList();
  },
  methods: {
    /**
     ** 设备列表
     */
    async equiList(param = {}) {
      param.pagesize = this.pagesize;
      param.pageno = this.pageno;
      const res = await equiSelectAll({ param: param });
      this.total = res.data.total;
      res.data.list.map(item => {
        item.value = item.name;
        item.label = item.name;
      });
      // this.searchData[0].options = res.data.list;
      this.tableData = res.data.list;
    },

    /**
     ** 公司列表
     */
    async corpList(val) {
      const res = await corpSelect();
      res.data.map(item => {
        item.value = item.guid;
        item.label = item.name;
      });
      this.searchData[2].options = res.data;
    },

    /*
     ** 查看更新处理
     */

    ExamineHandle(index, row) {
      this.$router.push({
        path: "vehicle",
        query: {
          id: row.guid
        }
      });
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
        .then(async () => {
          const res = await equiDelete({ id: row.guid });
          if (res.status === 200) {
            this.$message.success("删除成功");
            this.equiList();
          }
        })
        .catch(err => {});
    },

    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.pagesize = val;
      this.$refs.equiSearch.searchHandle();
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.pageno = val;
      this.$refs.equiSearch.searchHandle();
    },

    /*
     ** 加油标记
     */
    async ComeOnTag(index, row) {
      // oilMarkData
      const res = await getOilMark({ id: row.guid });
      this.dialogVisible2 = true;
      this.oilMarkData = res.data;
      // this.tank.equip_guid = row.guid;
    },

    /*
     ** 加油标记
     */
    markOil(row) {
      this.tank = row;
      this.dialogVisible1 = true;
    },
    /*
     ** 加油标记
     */
    handleClose(index, row) {
      this.dialogVisible = false;
    },

    /*
     ** 加油标记
     */
    async tankHandle() {
      const res = await ComeOnTag(this.tank);
      if (res.status === 200) {
        this.$message.success("标的完成");
        this.dialogVisible1 = false;
        this.ComeOnTag(this.tank.equip_guid);
      }
    },
    exportHandle() {
      window.open(
        process.env.VUE_APP_URL +
          `download/9?pagesize=${this.pagesize}&pageno=${this.pageno}`
      );
    }
  }
};
</script>
<style></style>
