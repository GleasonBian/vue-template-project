<template>
  <el-table size="mini" :data="EquipmentSummaryData" height="81.5vh">
    <el-table-column align="center" header-align="center" type="index" label="序号" width="50"></el-table-column>
    <el-table-column prop="recordtime" label="日期" align="center" header-align="center"></el-table-column>
    <el-table-column prop="miles" label="里程" align="center" header-align="center"></el-table-column>
    <el-table-column prop="goandfortimes" label="趟数/排数(小时)" align="center" header-align="center"></el-table-column>
    <el-table-column prop="oilconsume" label="油耗(升)" align="center" header-align="center"></el-table-column>
    <el-table-column prop="otherconsume" label="轮胎(条)" align="center" header-align="center"></el-table-column>
    <el-table-column label="维修及保养" header-align="center">
      <el-table-column prop="partscost" label="配件费(元)" align="center" header-align="center"></el-table-column>
      <el-table-column prop="auxoilcost" label="附属油(元)" align="center" header-align="center"></el-table-column>
    </el-table-column>
    <el-table-column prop="remark" label="备注" align="center" header-align="center"></el-table-column>
  </el-table>
</template>
<script>
import { equiSelectAll, EquipmentSummary, equipsummaryAll } from "@/getData";
export default {
  name: "Amachine",
  data() {
    return {
      EquipmentSummaryData: [],
    };
  },
  created() {
      this.EquipmentSummaryList();
  },
  methods: {
    /**
     * 单台设备
     */
    async EquipmentSummaryList() {
      const res = await EquipmentSummary({
        param: {
          equipid: this.$route.query.id,
        },
      });
      this.EquipmentSummaryData = res.data;
    },
    /**
     * 导出
     */
    exportHandle() {
      window.open(process.env.VUE_APP_URL + `equipsummary/export`);
    },
  },
  watch: {
    date: {
      deep: true, //深度监听
      handler: function () {
        this.dateChange(this.date);
      },
    },
  },
};
</script>

<style>
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 10px;
}
</style>