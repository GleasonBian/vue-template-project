<template>
  <el-container style="padding:12px 0px">
    <el-aside width="324px" style="padding:0px 12px;">
      <el-card style=" height:110vh">
        <el-table
          :data="vehicleData"
          @row-click="clickRow"
          highlight-current-row
          size="mini"
          ref="singleTable"
          border
        >
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="plateno" label="号码" align="center"></el-table-column>
        </el-table>
      </el-card>
    </el-aside>
    <el-main style="padding:0px 12px 0px 0px">
      <!-- 搜索框 -->
      <el-card>
        <gt-search :data="searchData" @handle="searchHandle" dateType="datetimerange"></gt-search>
      </el-card>
      <!-- 列表 -->
      <el-card style="margin-top:12px">
        <div style="width:100%; height:350px;" ref="chart"></div>
      </el-card>
      <el-card style="margin-top:12px">
        <el-button type="success" @click="exportForm" size="mini">导出</el-button>
        <!-- <gt-table
          :tableData="
              tableData.slice(
                (currentPage - 1) * page_size,
                currentPage * page_size
              )
            "
          style="width: 100%"
          :optionWidth="optionWidth"
          :columns="columns"
          :selection="false"
          height="45vh"
        ></gt-table>-->
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top:20px"
        ></el-pagination>-->
        <gt-table
          :tableData="tableData"
          style="width: 100%"
          :columns="columns"
          :selection="false"
          size="mini"
          height="45vh"
        ></gt-table>

        <el-pagination
          style="margin-top:12px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParam.page_index"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryParam.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-card>
    </el-main>
  </el-container>
</template>
<script>
import { equiSelect, oilView } from "@/getData";
export default {
  name: "oilmonitor",
  data() {
    return {
      handle: [
        // {
        //   function: "checkTasks",
        //   text: "查看任务",
        //   type: "text",
        //   show: true
        // },
        // {
        //   function: "UpdatePreprocessing",
        //   text: "更新计划",
        //   type: "text",
        //   show: true
        // },
        // {
        //   function: "DeleteHandle",
        //   text: "删除计划",
        //   type: "text",
        //   show: true
        // }
      ],
      queryParam: {
        end: "",
        start: "",
        guid: "",
        time: "",
        page_index: 1,
        page_size: 10,
      },
      total: 0,
      columns: [
        {
          id: "plateno",
          label: "车牌号码",
        },
        {
          id: "gpstime",
          label: "gps时间",
          width: 150,
        },
        {
          id: "curmiles",
          label: "当前里程",
        },
        {
          id: "totalmiles",
          label: "总里程",
        },
        {
          id: "curoilconsume",
          label: "当前油耗",
        },
        {
          id: "totaloilconsume",
          label: "总油耗",
        },
        {
          id: "oiladded",
          label: "加油油量",
        },
        {
          id: "oilleft",
          label: "剩余油量",
        },
        {
          id: "speed",
          label: "速度",
        },
        {
          id: "location",
          label: "位置",
          width: 350,
        },
      ],
      tableData: [], // 表格数据
      page_size: 10,
      total: 0,
      currentPage: 1,
      multipleSelection: [], // 用于批量 删除
      searchData: [
        // 搜索框 数据
        {
          key: "guid", // 与后端交互时的字段 必填
          label: "设备名称", // 搜索框名称 必填
          placeholder: "请选择", // 占位符 选填
          default: "", // 搜索框 默认值
          options: [
            {
              value: "项目1", // 下拉选项 绑定 值
              label: "项目1", // 下拉选项 绑定 名称
            },
          ],
        },
        {
          key: "time",
          label: "近期时间",
          placeholder: "选择近期时间",
          default: "",
          options: [
            {
              // 选填 如果 存在 options 选项 搜索框将由 input 变为 select框
              value: "今天", // 下拉选项 绑定 值
              label: "今天", // 下拉选项 绑定 名称
            },
            {
              value: "昨天",
              label: "昨天",
            },
            {
              value: "近3天",
              label: "近3天",
            },
            {
              value: "近7天",
              label: "近7天",
            },
          ],
        },
        {
          key: "date",
          label: "选择时间",
          placeholder: "请选择",
          default: "",
        },
      ],
      optionWidth: 250,
      vehicleData: [],
    };
  },
  created() {
    this.equiList();
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    //导出表格
    exportForm() {
      window.open(process.env.VUE_APP_URL + "download/10");
    },
    /*
     ** 搜索处理
     */
    searchHandle(query) {
      if (query.time !== "") {
        query = JSON.parse(JSON.stringify(query));
        switch (query.time) {
          case "今天":
            query.start = this.timeForMat(0)[0];
            query.end = this.timeForMat(0)[1];
            break;
          case "昨天":
            query.start = this.timeForMat(1)[0];
            query.end = this.timeForMat(1)[1];
            break;
          case "近3天":
            query.start = this.timeForMat(3)[0];
            query.end = this.timeForMat(3)[1];
            break;
          case "近7天":
            query.start = this.timeForMat(7)[0];
            query.end = this.timeForMat(7)[1];
            break;
        }
      }
      let param = JSON.parse(JSON.stringify(query));
      delete param.date;
      this.queryParam.page_index = 1;
      this.queryParam.page_size = 10;
      this.queryParam.end = param.end;
      this.queryParam.start = param.start;
      this.queryParam.guid = param.guid;
      this.oilViewHandle();
    },

    /*
     ** 设备列表
     */
    async equiList() {
      const res = await equiSelect();
      res.data.map((item) => {
        item.value = item.guid;
        item.label = item.plateno;
      });
      this.vehicleData = res.data;
      this.searchData[0].options = res.data;
    },

    /*
     ** 油耗监测数据
     */
    async oilViewHandle() {
      // 请求参数: equip/c9dc3f51-ab2d-42d8-b58c-b3b2dc6c5b8b/oilcs
      let param = this.queryParam;

      if (param.guid === "") {
        this.$message.warning("请选择设备");
        return;
      }

      // 参数拼接
      let canshu = "";

      if (param instanceof Object)
        canshu =
          param.guid +
          "/oilcs?start=" +
          param.start +
          "&end=" +
          param.end +
          "&page_index=" +
          param.page_index +
          "&page_size=" +
          param.page_size;
      else canshu = param.guid + "/oilcs";

      // 发送请求
      const res = await oilView({ id: canshu });

      if (res.status === 200) {
        let gpstime = [], // 时间
          curmiles = [], // 里程
          oilleft = [], // 剩余油量
          curoilconsume = [], // 油耗
          speed = [], //速度
          totaloilconsume = []; // 总油耗
        this.total = res.data.count;
        let response = res.data.data;
        console.log(response);
        for (var i in response) {
          response[i].oilleft = response[i].oilleft.toFixed(2);
          response[i].curoilconsume = response[i].curoilconsume.toFixed(2);
          response[i].totaloilconsume = response[i].totaloilconsume.toFixed(2);
          response[i].curmiles = response[i].curmiles.toFixed(2);
          response[i].speed = response[i].speed.toFixed(2);
          gpstime.push(response[i].gpstime);
          oilleft.push(response[i].oilleft);
          curmiles.push(response[i].curmiles);
          curoilconsume.push(response[i].curoilconsume);
          speed.push(response[i].speed);
          totaloilconsume.push(response[i].totaloilconsume);
        }
        this.tableData = response;
        this.initCharts(
          gpstime,
          oilleft,
          curmiles,
          curoilconsume,
          speed,
          totaloilconsume
        );
      }
    },

    /*
     ** 单机行处理
     */
    clickRow(row) {
      console.log(row.guid);
      this.$refs.singleTable.setCurrentRow(row);
      this.queryParam.guid = row.guid;
      this.oilViewHandle();
      // this.searchData[0].options
    },

    /*
     ** 初始化 echert
     */
    initCharts(
      gpstime = [],
      oilleft = [],
      curmiles = [],
      curoilconsume = [],
      speed = [],
      totaloilconsume = []
    ) {
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(this.$refs.chart);
      let option = {
        title: {
          text: "油耗统计",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left",
          },
        },
        legend: {
          data: ["总油耗", "油耗", "剩余油量", "里程", "速度"],
          align: "left", //水平方向位置
          verticalAlign: "top", //垂直方向位置
          x: 100, //距离x轴的距离
          y: 0, //距离Y轴的距离
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ["line", "bar"],
              show: true,
            },
            dataZoom: {
              show: true,
            },
            dataView: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
            },
          },
        },
        calculable: true,
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            top: 30,
            start: 10,
            end: 90,
            height: 20, //初始化滚动条
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: gpstime,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "总油耗",
            type: "line",
            stack: "总量",
            data: totaloilconsume,
          },
          {
            name: "油耗",
            type: "line",
            stack: "总量",
            data: curoilconsume,
          },
          {
            name: "剩余油量",
            type: "line",
            stack: "总量",
            data: oilleft,
          },
          {
            name: "里程",
            type: "line",
            stack: "总量",
            data: curmiles,
          },
          {
            name: "速度",
            type: "line",
            stack: "总量",
            data: speed,
          },
        ],
      };
      myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },

    /*
     ** 列表 分页
     */
    handleSizeChange(val) {
      this.queryParam.page_size = val;
      this.oilViewHandle();
    },

    /*
     ** 列表 分页
     */
    handleCurrentChange(val) {
      this.queryParam.page_index = val;
      this.oilViewHandle();
    },
    /**
     * 分页
     */
    // handleSizeChange(val) {
    //   this.page_size = val;
    // },

    /**
     * 分页
     */
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    // },

    /**
     * 日期处理
     */
    timeForMat(count) {
      // 拼接时间
      const time1 = new Date();
      const time2 = new Date();
      if (count === 1) {
        time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
      } else {
        if (count >= 0) {
          time1.setTime(time1.getTime());
        } else {
          if (count === -2) {
            time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000 * 2);
          } else {
            time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000);
          }
        }
      }

      const Y1 = time1.getFullYear();
      const M1 =
        time1.getMonth() + 1 > 9
          ? time1.getMonth() + 1
          : "0" + (time1.getMonth() + 1);
      const D1 = time1.getDate() > 9 ? time1.getDate() : "0" + time1.getDate();
      const timer1 = Y1 + "-" + M1 + "-" + D1 + " 23:59:59"; // 当前时间

      time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
      const Y2 = time2.getFullYear();
      const M2 =
        time2.getMonth() + 1 > 9
          ? time2.getMonth() + 1
          : "0" + (time2.getMonth() + 1);
      const D2 = time2.getDate() > 9 ? time2.getDate() : "0" + time2.getDate();
      const timer2 = Y2 + "-" + M2 + "-" + D2 + " 00:00:00"; // 之前的7天或者30天
      return [timer2, timer1];
    },
  },
};
</script>
<style lang="less" scoped>
@red: #ff0000;
@green: #66cc66;
@gray: #cccccc;
.carStatus {
  text-align: left;
  div {
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 50%;
  }
  .active {
    background: @green;
  }
  .fix {
    background: @red;
  }
  .stop {
    background: @gray;
  }
}
</style>
