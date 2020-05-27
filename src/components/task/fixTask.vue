<template>
  <div>
    <!-- 面包屑 -->
    <headTop></headTop>
    <div class="formWidth">
      <el-row :gutter="20">
        <el-col style="margin-top:20px;" :span="24">
          <el-card>
            <div slot="header" class="clearfix">基本信息</div>
            <el-row>
              <el-col class="pd_10" :span="12">
                <div class="label">车辆名称：</div>
                <div class="desc">{{details.BaseInfo.name}}</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">设备编号：</div>
                <div class="desc">{{details.BaseInfo.code}}</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">规格型号：</div>
                <div class="desc">{{details.BaseInfo.model}}</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">车牌号码：</div>
                <div class="desc">{{details.BaseInfo.plateno}}</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">管理类型：</div>
                <div class="desc">{{details.BaseInfo.class}}</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">归属公司：</div>
                <div class="desc">{{details.BaseInfo.corpname}}</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">作业油耗：</div>
                <div class="desc">{{details.BaseInfo.oilconsume}} 升</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">作业时长：</div>
                <div class="desc">{{details.BaseInfo.workduration}} 小时</div>
              </el-col>
              <el-col class="pd_10" :span="12">
                <div class="label">作业里程：</div>
                <div class="desc">{{details.BaseInfo.miles}} 公里</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col style="margin-top:20px;" :span="24">
          <el-card>
            <div slot="header" class="clearfix">
              油料核算明细
              <el-button type="success" style="float:right;" size="small">导出</el-button>
            </div>
            <div>
              <el-table
                :data="details.Reports"
                ref="table"
                tooltip-effect="dark"
                border
                stripe
                style="width: 100%"
              >
                <el-table-column label="作业日期" prop="jobtime" align="center"></el-table-column>
                <el-table-column label="开始时间" prop="startime" align="center"></el-table-column>
                <el-table-column label="结束时间" prop="finishtime" align="center"></el-table-column>
                <el-table-column label="作业时长" prop="jobduration" align="center"></el-table-column>
                <el-table-column label="作业内容" prop="jobcontent" align="center"></el-table-column>
                <el-table-column label="使用单位" prop="department" align="center"></el-table-column>
                <el-table-column label="机械司机" prop="driver" align="center"></el-table-column>
                <el-table-column label="现场负责人或机械总调度" prop="charger" align="center"></el-table-column>
                <el-table-column label="开始油量（升）" prop="oilstart" align="center"></el-table-column>
                <el-table-column label="结束油量（升）" prop="oilend" align="center"></el-table-column>
                <el-table-column label="加油记录（升）" prop="oilrecord" align="center"></el-table-column>
                <el-table-column label="油耗（升）" prop="oilconsume" align="center"></el-table-column>
                <el-table-column label="作业里程" prop="jobproduct" align="center"></el-table-column>
                <el-table-column label="备注" prop="remark" align="center"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="24" style="text-align:center;margin-top:20px">
            <el-button @click="goback">返回</el-button>
          </el-col>
        </el-row>
    </div>
  </div>
</template>
<script>
import { singleOil } from "@/getData";
import headTop from "@/common/headTop";
import { Regular } from "@/config/verification";
export default {
  name: "companyDetail",
  components: {
    // searchBox,
    headTop
  },
  data() {
    return {
      queryParam: {},
      details: {}
    };
  },
  created() {
    this.queryParam.guid = this.$route.query.equip_guid;
    this.queryParam.start = this.$route.query.start;
    this.queryParam.end = this.$route.query.end;
    this.getDetail();
  },
  mounted() {},
  methods: {
    goback() {
      this.$router.go(-1);
    },
    /**
     ** 公司列表查询
     */
    async getDetail() {
      const res = await singleOil({ param: this.queryParam });
      this.details = res.data;
    }
  }
};
</script>
<style lang="less" scoped>
.pd_10 {
  padding: 10px;
}
.label {
  display: inline-block;
  width: 80px;
  padding-right: 10px;
  text-align: right;
}
.desc {
  display: inline-block;
}
.formWidth {
  width: 100%;

  box-sizing: border-box;
  padding: 20px 15px;
}
</style>
