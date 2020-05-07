<template>
  <div style="padding:30px 30px 0px 30px">
    <el-row :gutter="20" class="el-row">
      <el-col :span="12">
        <el-card class="box-card">
          <div style="width:100%; height:42vh" ref="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div style="width:100%; height:42vh" ref="mapone"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div style="width:100%; height:42vh" ref="maptwo"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div style="width:100%; height:42vh" ref="mapthree"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>



export default {
  name: "equi",
  data() {
    return {

    };
  },
  components: {
    // Schart
  },
  computed: {

  },
  created() {
  },
  mounted() {
    this.initCharts();
    this.mapOneHandle()
    this.maptwoHandle()
    this.mapmapthreeHandle()
  },
  methods: {
    initCharts() {
      
      let myChart = this.$echarts.init(this.$refs.chart); 
      let option = {
          title: {
              text: '某站点用户访问来源',
              subtext: '纯属虚构',
              left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              left: 'left',
              data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: [
                      {value: 335, name: '直接访问'},
                      {value: 310, name: '邮件营销'},
                      {value: 234, name: '联盟广告'},
                      {value: 135, name: '视频广告'},
                      {value: 1548, name: '搜索引擎'}
                  ],
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      };

      myChart.setOption(option);

      window.onresize = function() {
        myChart.resize();
      };
    },
    mapOneHandle() {
      
      let mapone = this.$echarts.init(this.$refs.mapone); 
      let option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: {
              type: 'value'
          },
          yAxis: {
              type: 'category',
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          series: [
              {
                  name: '直接访问',
                  type: 'bar',
                  stack: '总量',
                  label: {
                      show: true,
                      position: 'insideRight'
                  },
                  data: [320, 302, 301, 334, 390, 330, 320]
              },
              {
                  name: '邮件营销',
                  type: 'bar',
                  stack: '总量',
                  label: {
                      show: true,
                      position: 'insideRight'
                  },
                  data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name: '联盟广告',
                  type: 'bar',
                  stack: '总量',
                  label: {
                      show: true,
                      position: 'insideRight'
                  },
                  data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name: '视频广告',
                  type: 'bar',
                  stack: '总量',
                  label: {
                      show: true,
                      position: 'insideRight'
                  },
                  data: [150, 212, 201, 154, 190, 330, 410]
              },
              {
                  name: '搜索引擎',
                  type: 'bar',
                  stack: '总量',
                  label: {
                      show: true,
                      position: 'insideRight'
                  },
                  data: [820, 832, 901, 934, 1290, 1330, 1320]
              }
          ]
      };

      mapone.setOption(option);

      window.onresize = function() {
        mapone.resize();
      };
    },
    maptwoHandle() {
      
      let mapone = this.$echarts.init(this.$refs.maptwo); 
      
      var category = [];
      var dottedBase = +new Date();
      var lineData = [];
      var barData = [];

      for (var i = 0; i < 20; i++) {
          var date = new Date(dottedBase += 3600 * 24 * 1000);
          category.push([
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate()
          ].join('-'));
          var b = Math.random() * 200;
          var d = Math.random() * 200;
          barData.push(b)
          lineData.push(d + b);
      }


      // option
      let option = {
          backgroundColor: '#0f375f',
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          legend: {
              data: ['line', 'bar'],
              textStyle: {
                  color: '#ccc'
              }
          },
          xAxis: {
              data: category,
              axisLine: {
                  lineStyle: {
                      color: '#ccc'
                  }
              }
          },
          yAxis: {
              splitLine: {show: false},
              axisLine: {
                  lineStyle: {
                      color: '#ccc'
                  }
              }
          },
          series: [{
              name: 'line',
              type: 'line',
              smooth: true,
              showAllSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 15,
              data: lineData
          }, {
              name: 'bar',
              type: 'bar',
              barWidth: 10,
              itemStyle: {
                  barBorderRadius: 5,
                  color: new this.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#14c8d4'},
                          {offset: 1, color: '#43eec6'}
                      ]
                  )
              },
              data: barData
          }, {
              name: 'line',
              type: 'bar',
              barGap: '-100%',
              barWidth: 10,
              itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: 'rgba(20,200,212,0.5)'},
                          {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
                          {offset: 1, color: 'rgba(20,200,212,0)'}
                      ]
                  )
              },
              z: -12,
              data: lineData
          }, {
              name: 'dotted',
              type: 'pictorialBar',
              symbol: 'rect',
              itemStyle: {
                  color: '#0f375f'
              },
              symbolRepeat: true,
              symbolSize: [12, 4],
              symbolMargin: 1,
              z: -10,
              data: lineData
          }]
      };

      mapone.setOption(option);

      window.onresize = function() {
        mapone.resize();
      };
    },
    mapmapthreeHandle() {
      
      let mapthree = this.$echarts.init(this.$refs.mapthree); 
      
      var data = [[10, 16, 3, 'A'], [16, 18, 15, 'B'], [18, 26, 12, 'C'], [26, 32, 22, 'D'], [32, 56, 7, 'E'], [56, 62, 17, 'F']];
      var colorList = ['#4f81bd', '#c0504d', '#9bbb59', '#604a7b', '#948a54', '#e46c0b'];

      data = this.$echarts.util.map(data, function (item, index) {
          return {
              value: item,
              itemStyle: {
                  color: colorList[index]
              }
          };
      });

      function renderItem(params, api) {
          var yValue = api.value(2);
          var start = api.coord([api.value(0), yValue]);
          var size = api.size([api.value(1) - api.value(0), yValue]);
          var style = api.style();

          return {
              type: 'rect',
              shape: {
                  x: start[0],
                  y: start[1],
                  width: size[0],
                  height: size[1]
              },
              style: style
          };
      }

      let option = {
          title: {
              text: 'Profit',
              left: 'center'
          },
          tooltip: {
          },
          xAxis: {
              scale: true
          },
          yAxis: {
          },
          series: [{
              type: 'custom',
              renderItem: renderItem,
              label: {
                  show: true,
                  position: 'top'
              },
              dimensions: ['from', 'to', 'profit'],
              encode: {
                  x: [0, 1],
                  y: 2,
                  tooltip: [0, 1, 2],
                  itemName: 3
              },
              data: data
          }]
      };

      mapthree.setOption(option);

      window.onresize = function() {
        mapone.resize();
      };
    },
  },
  updated(){
    
  }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.box-card{
  height: 45.7vh;
}
</style>
