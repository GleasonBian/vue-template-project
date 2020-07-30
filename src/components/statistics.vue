<template>
  <div style="padding:12px">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="汇总" name="first">
        <div slot="label" class="tab_pane_slot">
          <el-date-picker
            v-model="date"
            type="daterange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change.stop="dateChange(date)"
            size="mini"
            style="padding: 0px"
          ></el-date-picker>
        </div>
        <el-button @click="exportHandle" type="success" style="margin-bottom:12px">导出</el-button>
        <el-table size="mini" :data="equipsummaryAllData" :header-row-style="iHeaderRowStyle">
          <el-table-column align="center" header-align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="plateno" label="车牌" align="center" header-align="center"></el-table-column>
          <el-table-column prop="equipname" label="设备名称" align="center" header-align="center"></el-table-column>
          <el-table-column prop="drivername" label="司机" align="center" header-align="center"></el-table-column>
          <el-table-column prop="goandfortimes" label="趟数" align="center" header-align="center"></el-table-column>
          <el-table-column prop="miles" label="里程" align="center" header-align="center"></el-table-column>
          <el-table-column prop="oilconsume" label="油耗(升)" align="center" header-align="center"></el-table-column>
          <el-table-column prop="otherconsume" label="轮胎(条)" align="center" header-align="center"></el-table-column>
          <el-table-column label="维修及保养" header-align="center">
            <el-table-column prop="partscost" label="配件费(元)" align="center" header-align="center"></el-table-column>
            <el-table-column prop="auxoilcost" label="附属油(元)" align="center" header-align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="leasecost" label="零星台班" align="center" header-align="center"></el-table-column>
          <el-table-column
            prop="specificoilcon"
            label="单位油耗(L/趟)"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="specificothercon"
            label="单位轮胎(号)"
            align="center"
            header-align="center"
          ></el-table-column>

          <el-table-column prop="remark" label="备注" align="center" header-align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="item.name"
        :name="item.name"
        v-for="(item,index) in equiData"
        :key="index"
      >
        <el-table size="mini" :data="EquipmentSummaryData" :header-row-style="iHeaderRowStyle">
          <el-table-column align="center" header-align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="recordtime" label="日期" align="center" header-align="center"></el-table-column>
          <el-table-column prop="miles" label="里程" align="center" header-align="center"></el-table-column>
          <el-table-column
            prop="goandfortimes"
            label="趟数/排数(小时)"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column prop="oilconsume" label="油耗(升)" align="center" header-align="center"></el-table-column>
          <el-table-column prop="otherconsume" label="轮胎(条)" align="center" header-align="center"></el-table-column>
          <el-table-column label="维修及保养" header-align="center">
            <el-table-column prop="partscost" label="配件费(元)" align="center" header-align="center"></el-table-column>
            <el-table-column prop="auxoilcost" label="附属油(元)" align="center" header-align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" header-align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
    // "attendance": "string",
    // "leasecost": 0,

    // "specificoilcon": 0,
    // "specificothercon": 0
<script>
import { equiSelectAll, EquipmentSummary, equipsummaryAll } from "@/getData";
export default {
  data() {
    return {
      activeName: "first",
      equiData: [],
      EquipmentSummaryData: [],
      equipsummaryAllData: [],
      total: 0,
      pagesize: 100,
      pageno: 1,
      date: [],
    };
  },
  created() {
    this.equiList();
    this.equipsummaryAllHandle();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.index);
      if (tab.index != 0)
        this.EquipmentSummaryList({
          equipid: this.equiData[tab.index - 1].guid,
        });
    },
    /*
     ** 设备列表
     */
    async equiList(param = {}) {
      param.pagesize = this.pagesize;
      param.pageno = this.pageno;
      const res = await equiSelectAll({ param: param });
      this.total = res.data.total;
      this.equiData = res.data.list;
    },
    async EquipmentSummaryList(param = {}) {
      const res = await EquipmentSummary({ param: param });
      this.EquipmentSummaryData = res.data;
    },
    async equipsummaryAllHandle(param = {}) {
      const res = await equipsummaryAll({ param: param });
      this.equipsummaryAllData = res.data;
    },
    dateChange(val) {
      console.log("111");
      val[1] = val[1].replace("00:00:00", "23:59:59");
      let search = {};
      search.start = val[0];
      search.end = val[1];
      this.equipsummaryAllHandle(search);
    },
    iHeaderRowStyle: function ({ row, rowIndex }) {
      return "height:10px";
    },
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