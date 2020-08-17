<template>
  <div class="page_container">
    <el-dialog
      title="油箱添加"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      :before-close="handleClose"
      center
      top="5vh"
    >
      <el-form ref="tank" :model="tank" label-width="86px" :rules="tankRules">
        <el-form-item label="车辆名称" prop="category">
          <el-input v-model="tank.category" placeholder="请输入车量"></el-input>
        </el-form-item>

        <el-form-item label="车辆型号" prop="kind">
          <el-input v-model="tank.kind"></el-input>
        </el-form-item>

        <el-form-item label="油箱形状" prop="shape">
          <el-select v-model="tank.shape" placeholder="请选择" style="width:100%">
            <el-option label="长方体" value="长方体"></el-option>
            <el-option label="圆柱体" value="圆柱体"></el-option>
            <el-option label="异型油箱" value="异型油箱"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="油箱容积" prop="theory_volume">
          <el-input v-model.number="tank.theory_volume" type="number" :step="10" :min="1">
            <el-button slot="append">升</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱高度" prop="height">
          <el-input v-model.number="tank.height" type="number" :step="10" :min="1" :max="3000">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱长度" prop="length">
          <el-input v-model.number="tank['length']" type="number" :step="10" :min="1">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱宽度" prop="width">
          <el-input v-model.number="tank['width']" type="number" :step="10" :min="1">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="油箱半径" prop="radius">
          <el-input v-model.number="tank['radius']" type="number" :step="10" :min="1">
            <el-button slot="append">厘米</el-button>
          </el-input>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="tankHandle" type="primary">确定</el-button>
      </span>
    </el-dialog>

    <el-form ref="form" :model="form" label-width="100px" :rules="rules" :disabled="disable">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        
        <el-tab-pane label="基本信息" name="first">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
          <span>基本信息</span>
          <span
            style="float: right; padding: 3px 0; color:rgb(164, 164, 165);"
          >车辆编号：{{this.form.equip_no}}</span>
            </div>-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备名称" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="计量单位" prop="unit">
                  <el-input v-model="form.unit"></el-input>
                </el-form-item>

                <el-form-item label="设备来源" prop="deviceSource">
                  <el-select v-model="form.deviceSource" placeholder="请选择" style="width:100%">
                    <el-option label="自购" value="自购"></el-option>
                    <el-option label="租赁" value="租赁"></el-option>
                    <el-option label="借调" value="借调"></el-option>
                    <el-option label="其他" value="其他"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="折旧年限" prop="depreciationYear">
                  <el-select v-model="form.depreciationYear" placeholder="请选择" style="width:100%">
                    <el-option v-for="n in 20" :label="(n) + ' 年'" :value="(n+'年')" :key="n"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="设备分类" prop="deviceClassify">
                  <el-select
                    v-model="form.deviceClassify"
                    placeholder="请选择"
                    style="width:100%"
                    @change="resetClassifyId(form.deviceClassify)"
                  >
                    <el-option v-for="item in classifyData" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="所属公司" prop="corpguid">
                  <el-select
                    v-model="form.corpguid"
                    placeholder="请选择"
                    @change="resetDept(form.corpguid)"
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in corpData"
                      :key="item.guid"
                      :label="item.name"
                      :value="item.guid"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="合同价格" prop="contractPrice">
                  <el-input v-model.number="form.contractPrice" type="number" :step="100" :min="1">
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="设备交付" prop="deliveryDate">
                  <el-date-picker
                    v-model="form.deliveryDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="管理号码" prop="manageNumber">
                  <el-input v-model.number="form.manageNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车牌号码" prop="plateno">
                  <el-input v-model="form.plateno"></el-input>
                </el-form-item>

                <el-form-item label="产权单位" prop="propertyUnit">
                  <el-input v-model="form.propertyUnit"></el-input>
                </el-form-item>

                <el-form-item label="设备原值" prop="originalValue">
                  <el-input v-model.number="form.originalValue" type="number" :step="100" :min="1">
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="年折旧率" prop="depreciationRate">
                  <el-input
                    v-model.number="form.depreciationRate"
                    type="number"
                    :step="10"
                    :min="1"
                    :max="100"
                  >
                    <el-button slot="append">%</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="设备类型" prop="clstype">
                  <el-select v-model="form.clstype" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in classifyIdData"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="所属部门" prop="deptguid">
                  <el-select v-model="form.deptguid" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in deptData"
                      track-by="item.guid"
                      :key="item.guid"
                      :label="item.name"
                      :value="item.guid"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="投资来源" prop="investmentSource">
                  <el-input v-model="form.investmentSource"></el-input>
                </el-form-item>

                <el-form-item label="合同签订" prop="signedDate">
                  <el-date-picker
                    v-model="form.signedDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="描述信息" prop="description">
                  <el-input v-model="form.description" type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="监控信息" name="second">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
              <span>监控信息</span>
            </div>-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="终端ID" prop="terminalid">
                  <el-input v-model="form.terminalid"></el-input>
                </el-form-item>

                <el-form-item label="保养日期" prop="repair_date">
                  <el-date-picker
                    v-model="form.repair_date"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="油耗阀值" prop="max_oil_wear">
                  <el-input-number
                    :min="1"
                    :max="200"
                    controls-position="right"
                    v-model.number="form.max_oil_wear"
                    :step="5"
                    step-strictly
                    placeholder="油耗报警阀值"
                    style="width:100%"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="小时/油耗" prop="hr_oil_wear">
                  <el-input
                    v-model.number="form.hr_oil_wear"
                    type="number"
                    :step="10"
                    :min="1"
                    :max="300"
                  >
                    <el-button slot="append">升/小时</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="油箱类型" prop="tank_guid">
                  <el-select v-model="form.tank_guid" placeholder="请选择" style="width:75%">
                    <el-option
                      v-for="item in tankData"
                      :key="item.guid"
                      :label="item.category"
                      :value="item.guid"
                    ></el-option>
                  </el-select>
                  <el-button style="width:25%" @click="dialogVisible = true">新增</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="SIM卡号" prop="simnumber">
                  <el-input v-model="form.simnumber"></el-input>
                </el-form-item>

                <el-form-item label="初始里程" prop="init_mileage">
                  <el-input
                    v-model.number="form.init_mileage"
                    type="number"
                    :step="10"
                    :min="1"
                    :max="300"
                  >
                    <el-button slot="append">公里</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="速度阀值" prop="max_speed">
                  <el-input-number
                    :min="1"
                    :max="200"
                    controls-position="right"
                    v-model.number="form.max_speed"
                    :step="5"
                    step-strictly
                    placeholder="超速报警阀值"
                    style="width:100%"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="公里/油耗" prop="km_oil_wear">
                  <el-input
                    v-model.number="form.km_oil_wear"
                    type="number"
                    :step="10"
                    :min="1"
                    :max="300"
                  >
                    <el-button slot="append">升/百公里</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="监控等级" prop="monitor">
                  <el-select v-model="form.monitor" placeholder="请选择" style="width:100%">
                    <el-option label="一级" value="一级"></el-option>
                    <el-option label="二级" value="二级"></el-option>
                    <el-option label="三级" value="三级"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="规格型号" name="third">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
              <span>规格型号</span>
            </div>-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备规格" prop="spec">
                  <el-input v-model="form.spec"></el-input>
                </el-form-item>

                <el-form-item label="出厂日期" prop="leaveFactoryDate">
                  <el-date-picker
                    v-model="form.leaveFactoryDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="出厂编号" prop="FactoryNumber">
                  <el-input v-model="form.FactoryNumber" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="设备品牌" prop="brand">
                  <el-input v-model.number="form.brand" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="装机功率" prop="installedPower">
                  <el-input v-model.number="form.installedPower" type="number" :step="100" :min="1">
                    <el-button slot="append">KW</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="装机重量" prop="InstalledWeight">
                  <el-input
                    v-model.number="form.InstalledWeight"
                    type="number"
                    :step="100"
                    :min="1"
                  >
                    <el-button slot="append">KG</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备型号" prop="deviceModel">
                  <el-input v-model="form.deviceModel"></el-input>
                </el-form-item>

                <el-form-item label="进口国产" prop="domestic">
                  <el-select v-model="form.domestic" placeholder="请选择" style="width:100%">
                    <el-option label="进口" value="进口"></el-option>
                    <el-option label="国产" value="国产"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="生产厂家" prop="manufacturer">
                  <el-input v-model="form.manufacturer"></el-input>
                </el-form-item>

                <el-form-item label="设备产地" prop="productionPlace">
                  <el-input v-model.number="form.productionPlace"></el-input>
                </el-form-item>

                <el-form-item label="整机尺寸" prop="deviceSize">
                  <el-input v-model="form.deviceSize" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="整机颜色" prop="color">
                  <el-select v-model="form.color" placeholder="请选择" style="width:100%">
                    <el-option label="白色" value="白色"></el-option>
                    <el-option label="黑色" value="黑色"></el-option>
                    <el-option label="银色" value="银色"></el-option>
                    <el-option label="红色" value="红色"></el-option>
                    <el-option label="黄色" value="黄色"></el-option>
                    <el-option label="棕色" value="棕色"></el-option>
                    <el-option label="绿色" value="绿色"></el-option>
                    <el-option label="蓝色" value="蓝色"></el-option>
                    <el-option label="紫色" value="紫色"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="发动机" name="fourth">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
              <span>发动机</span>
            </div>-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="引擎厂商" prop="engineManufacturer">
                  <el-input v-model="form.engineManufacturer"></el-input>
                </el-form-item>

                <el-form-item label="引擎功率" prop="enginePower">
                  <el-input v-model.number="form.enginePower" type="number" :step="100" :min="1">
                    <el-button slot="append">KW</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="出厂日期" prop="engineDate">
                  <el-date-picker
                    v-model="form.engineDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="引擎型号" prop="engineModel">
                  <el-input v-model="form.engineModel"></el-input>
                </el-form-item>

                <el-form-item label="出厂编号" prop="engineNumber">
                  <el-input v-model="form.engineNumber" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="燃料类型" prop="FuelType">
                  <el-select v-model="form.FuelType" placeholder="请选择" style="width:100%">
                    <el-option label="汽油" value="汽油"></el-option>
                    <el-option label="柴油" value="柴油"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="底盘" name="fifth">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
          <span>底盘</span>
            </div>-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="底盘厂商" prop="underpanManufacturer">
                  <el-input v-model="form.underpanManufacturer"></el-input>
                </el-form-item>

                <el-form-item label="底盘编号" prop="underpanNumber">
                  <el-input v-model="form.underpanNumber" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="工作机厂商" prop="workingMachineManufacturer">
                  <el-input v-model="form.workingMachineManufacturer" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="底盘型号" prop="underpanModel">
                  <el-input v-model="form.underpanModel"></el-input>
                </el-form-item>

                <el-form-item label="出厂日期" prop="underpanFactoryDate">
                  <el-date-picker
                    v-model="form.underpanFactoryDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="工作机型号" prop="workingMachineModel">
                  <el-input v-model="form.workingMachineModel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="项目信息" name="sixth">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
              <span>项目信息</span>
            </div>-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="使用项目" prop="useProject">
                  <el-input v-model="form.useProject"></el-input>
                </el-form-item>

                <el-form-item label="设备净值" prop="deviceNetWorth">
                  <el-input v-model.number="form.deviceNetWorth" type="number" :step="100" :min="1">
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>

                <el-form-item label="车辆状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                    <el-option label="在用" value="在用"></el-option>
                    <el-option label="闲置" value="闲置"></el-option>
                    <el-option label="正常" value="正常"></el-option>
                    <el-option label="停用" value="停用"></el-option>
                    <el-option label="封存" value="封存"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="管理人员" prop="manager">
                  <el-input v-model="form.manager"></el-input>
                </el-form-item>

                <el-form-item label="使用人员" prop="usePersonnel">
                  <el-input v-model="form.usePersonnel"></el-input>
                </el-form-item>

                <el-form-item label="清查负责人" prop="inventoryManager">
                  <el-input v-model="form.inventoryManager"></el-input>
                </el-form-item>

                <el-form-item label="清查人员" prop="checkPersonnel">
                  <el-input v-model="form.checkPersonnel"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="工程行业" prop="engineeringIndustry">
                  <el-input v-model="form.engineeringIndustry"></el-input>
                </el-form-item>

                <el-form-item label="技术状况" prop="technical">
                  <el-input v-model="form.technical"></el-input>
                </el-form-item>

                <el-form-item label="使用/存放地" prop="address">
                  <el-input v-model="form.address"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="managerTel">
                  <el-input v-model="form.managerTel"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="useTel">
                  <el-input v-model="form.useTel"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="checkManagerTel">
                  <el-input v-model="form.checkManagerTel"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="checkTel">
                  <el-input v-model="form.checkTel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="车辆图片" name="seventh">
          <el-card class="content_width" shadow="never">
            <!-- <div slot="header" class="clearfix">
              <span>车辆图片</span>
            </div>-->
            <el-form-item prop="mainImage" label-width="0px">
              <gt-single-img
                @SingleImageUpload="SingleImageUpload"
                :imageUrl="form.mainImage"
                title="车辆主图"
              ></gt-single-img>
            </el-form-item>
            <el-form-item prop="image" label-width="0px">
              <gt-multiple-img
                @multipleImageUpload="multipleImageUpload"
                title="车辆辅图"
                :propsImage="form.image"
              ></gt-multiple-img>
            </el-form-item>
          </el-card>
        </el-tab-pane>

      </el-tabs>
    </el-form>

    <el-col align="center" class="content_width" v-show="!disable">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-col>
  </div>
</template>

<script>
import {
  equiCreate, // 设备创建
  equiUpdate, // 设备更新
  equiDetails, // 设备详情
  corpSelect, // 公司列表
  getDeptList, // 部门列表
  getStaffList, //人员
  tankCreate, // 邮箱创建
  tankList, // 邮箱列表
  equiSelect, // 获取详情
  uploadImages, // 上传图片
  classify, // 车辆分类一级
  classifyId, // 车辆分类二级
} from "@/getData";
export default {
  data() {
    return {
      dialogVisible: false,
      tankRules: {},
      activeName: "first",
      form: {
        /* -------基本信息1-------- */
        name: "", //车辆名称 String
        unit: "", // 计量单位 String
        originalValue: "", // 设备原值 Number
        deviceSource: "", //设备来源 String
        deviceClassify: "", //设备分类 String
        corpguid: "", //所属公司 String
        contractPrice: "", // 合同价格 Number
        deliveryDate: "", // 设备交付 String
        manageNumber: "", // 管理号码 String

        /* -------基本信息2-------- */
        plateno: "", //车牌号码 String
        propertyUnit: "", // 产权单位 String
        depreciationYear: "", // 折旧年限 String
        depreciationRate: "", // 年折旧率 Number
        clstype: "", //设备类型 String
        investmentSource: "", // 投资来源 String
        deptguid: "", //所属部门  String
        signedDate: "", // 签订时间 String
        description: "", //描述信息 String

        /* -----设备规格1---------- */
        spec: "", // 设备规格 String
        leaveFactoryDate: "", // 出厂日期 String
        FactoryNumber: "", //出厂编号 String
        brand: "", // 设备品牌 String
        installedPower: "", // 装机功率 Number
        InstalledWeight: "", // 装机重量 Number

        /* 设备规格2 */
        deviceModel: "", // 设备型号 String
        domestic: "", // 进口/国产 String
        manufacturer: "", // 生产厂家 String
        productionPlace: "", // 设备产地 String
        deviceSize: "", // 设备尺寸 String
        color: "", //车辆颜色  String

        /* 发动机 */
        engineManufacturer: "", // 引擎厂商 String
        enginePower: "", // 引擎功率 Number
        engineDate: "", // 引擎出厂日期 String
        engineModel: "", // 引擎型号 String
        engineNumber: "", // 引擎编号 String
        FuelType: "", // 燃油类型 String

        /* 底盘 */
        underpanManufacturer: "", // 底盘厂商 String
        underpanNumber: "", // 底盘编号 String
        workingMachineManufacturer: "", // 工作机厂商 String
        underpanModel: "", // 底盘型号 String
        underpanFactoryDate: "", // 底盘出厂日期 String
        workingMachineModel: "", // 工作机型号 String

        /* 项目信息 */
        useProject: "", // 使用项目 String
        deviceNetWorth: "", // 设备净值 Number
        status: "", // 设备状态 String
        manager: "", // 管理人员 String
        usePersonnel: "", // 使用人员 String
        inventoryManager: "", // 清查负责人 String
        checkPersonnel: "", //清查人 String
        engineeringIndustry: "", // 工程行业 String
        technical: "", // 技术状况 String
        address: "", // 地址 String
        managerTel: "", // 管理人员电话 String
        useTel: "", // 使用人员电话 String
        checkManagerTel: "", // 清查负责人电话 String
        checkTel: "", // 清查人电话  String

        /* 监控信息 */
        terminalid: "", //终端ID String
        repair_date: "", //保养日期 String
        max_oil_wear: "", //油耗报警阀值 Number
        hr_oil_wear: "", //小时/油耗 Number
        tank_guid: "", // 油箱 String
        simnumber: "", //手机号  String
        init_mileage: "", //初始里程 Number
        max_speed: "", // 速度报警阀值  Number
        km_oil_wear: "", //公里/油耗 Number
        monitor: "", //监控等级 String

        /* 图片 */
        image: [], // list / Array
        // 图片主图
        mainImage: "",
        /* 弃用字段 */
        // proddate: "", //生产日期
        // vehicle_use: "", //车辆用途
        // driver: [], // 司机
        // deviceUse: "", // 设备用途
      },

      // 表单校验规则
      rules: {
        name: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 车辆名称
        name: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //车辆名称 String
        unit: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 计量单位 String
        originalValue: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备原值 Number
        deviceSource: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //设备来源 String
        deviceClassify: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //设备分类 String
        corpguid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //所属公司 String
        contractPrice: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 合同价格 Number
        deliveryDate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备交付 String
        manageNumber: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 管理号码 String

        /* -------基本信息2-------- */
        plateno: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //车牌号码 String
        propertyUnit: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 产权单位 String
        depreciationYear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 折旧年限 Number
        depreciationRate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 年折旧率 Number
        clstype: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //设备类型 String
        investmentSource: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 投资来源 String
        deptguid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //所属部门  String
        signedDate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 签订时间 String
        description: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //描述信息 String

        /* -----设备规格1---------- */
        spec: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备规格 String
        leaveFactoryDate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 出厂日期 String
        FactoryNumber: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //出厂编号 String
        brand: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备品牌 String
        installedPower: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 装机功率 Number
        InstalledWeight: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 装机重量 Number

        /* 设备规格2 */
        deviceModel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备型号 String
        domestic: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 进口/国产 String
        manufacturer: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 生产厂家 String
        productionPlace: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备产地 String
        deviceSize: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备尺寸 String
        color: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //车辆颜色  String

        /* 发动机 */
        engineManufacturer: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 引擎厂商 String
        enginePower: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 引擎功率 Number
        engineDate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 引擎出厂日期 String
        engineModel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 引擎型号 String
        engineNumber: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 引擎编号 String
        FuelType: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 燃油类型 String

        /* 底盘 */
        underpanManufacturer: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 底盘厂商 String
        underpanNumber: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 底盘编号 String
        workingMachineManufacturer: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 工作机厂商 String
        underpanModel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 底盘型号 String
        underpanFactoryDate: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 底盘出厂日期 String
        workingMachineModel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 工作机型号 String

        /* 项目信息 */
        useProject: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 使用项目 String
        deviceNetWorth: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备净值 Number
        status: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 设备状态 String
        manager: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 管理人员 String
        usePersonnel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 使用人员 String
        inventoryManager: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 清查负责人 String
        checkPersonnel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //清查人 String
        engineeringIndustry: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 工程行业 String
        technical: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 技术状况 String
        address: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 地址 String
        managerTel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 管理人员电话 String
        useTel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 使用人员电话 String
        checkManagerTel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 清查负责人电话 String
        checkTel: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 清查人电话  String

        /* 监控信息 */
        terminalid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //终端ID String
        repair_date: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //保养日期 String
        max_oil_wear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //油耗报警阀值 Number
        hr_oil_wear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //小时/油耗 Number
        tank_guid: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 油箱 String
        simnumber: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //手机号  String
        init_mileage: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //初始里程 Number
        max_speed: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], // 速度报警阀值  Number
        km_oil_wear: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //公里/油耗 Number
        monitor: [
          {
            required: true,
            message: "必填",
            trigger: ["blur", "change"],
          },
        ], //监控等级 String

        /* 图片 */
        image: [], // list / Array
      },

      // 创建 更新 删除 表单
      tank: {
        category: "", // 车辆名称
        kind: "", // 车辆型号
        shape: "", // 长方体,圆柱体,异型油箱
        theory_volume: 0, // 理论容积
        height: 0, // 油箱高度
        length: 0, // 油箱长度
        width: 0, //宽度
        radius: 0, // 油箱半径
      },

      // 选择行
      selectRowList: [],
      // 公司列表
      corpData: [],
      // 部门列表
      deptData: [],
      // 人员
      staffData: [],
      // 邮箱
      tankData: [],
      // 分类一级列表
      classifyData: [],
      // 二级分类列表
      classifyIdData: [],
    };
  },
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.staffList();
    this.corpList();
    this.deptList();
    this.tankListHandle();
    this.classifyList();
  },
  mounted() {
    this.getVehicleDetail();
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
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
      const res = await getDeptList({ param: { corpguid: val } });
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
     ** 更换公司清空部门, 重新获取部门列表
     */
    async resetDept(cid) {
      console.log("公司id：", cid);
      this.deptData = [];
      this.form.deptguid = null;
      this.$forceUpdate();
      this.deptList(cid);
    },

    /**
     * 分类一级列表
     */
    async classifyList() {
      const res = await classify();
      this.classifyData = res.data;
    },

    /**
     * 获取分类二级列表
     */
    async classifyIdList(id) {
      const res = await classifyId({ id: id });
      this.classifyIdData = res.data;
    },

    /**
     *  更换一级分类,重新获取二级分类
     */
    async resetClassifyId(id) {
      // 二级分类id 重置
      this.form.clstype = null;

      // 清空二级分类
      this.classifyIdData = [];

      this.$forceUpdate();
      // 重新获取二级分类
      this.classifyIdList(id);
    },
    /*
     ** 更新处理
     */
    async UpdateHandle(index, row) {
      const res = await equiUpdate(this.form);
      if (res.status === 200) {
        this.$router.push({
          path: "equipment",
        });
        this.$message.success("更新成功");
      } else this.$message.warning("更新失败,稍后重试");
    },

    /*
     ** form 表单 验证
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.CreateHandle()
          this.UpdateHandle();
          // this.$route.query.id ? this.UpdateHandle() : this.CreateHandle();
        } else {
          this.$message.error("请正确填写红框内容");
          return false;
        }
      });
    },

    /*
     ** 创建处理
     */
    async CreateHandle() {
      const res = await equiCreate(this.form);
      if (res.status === 200) {
        this.$message.success("设备创建成功");
        this.$router.push({
          path: "equipment",
        });
      } else this.$message.warning("设备创建失败");
    },

    /*
     ** form 表单 重置
     */
    ResetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*
     ** 表格多选处理
     */
    selectRowHandle(val) {
      this.selectRowList = val;
    },

    /*
     ** 增加行
     */
    addRow() {
      let list = {
        guid: "", // 人员guid
        name: "", // 人员名称
        phonenum: "", // 手机号
        corpname: "", // 公司名称
        corpguid: "", // 公司id
        deptname: "", // 部门名称
        deptguid: "", // 部门id
        default: "否", // 默认司机
      };
      this.form.driver.push(list);
    },

    /*
     ** 删除表格选中项目
     */
    delData() {
      if (!this.selectRowList.length) {
        this.$message.warning("请选择删除的行");
        return;
      }
      var that = this;
      // 拿到选中的数据；
      var val = this.selectRowList;
      // 如果选中数据存在
      if (val) {
        // 将选中数据遍历
        val.forEach(function (item, index) {
          // 遍历源数据
          that.form.driver.forEach(function (itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等，删除对应的源数据
            if (item.guid === itemI.guid && item.phonenum === itemI.phonenum) {
              that.form.driver.splice(indexI, 1);
            }
          });
        });
      }
      // 清除选中状态
      this.$refs.driverTable.clearSelection();
    },

    /*
     ** 选中车辆 自动添加 车牌号码
     */
    selectHandle(guid) {
      let that = this,
        val = this.staffData;
      if (val) {
        // 将选中数据遍历
        val.forEach(function (item, index) {
          // 遍历源数据
          that.form.driver.forEach(function (itemI, indexI) {
            // 如果选中数据跟元数据某一条标识相等
            if (item.guid === itemI.guid) {
              itemI.corpguid = item.corpguid;
              itemI.name = item.name;
              itemI.corpname = item.corpname;
              itemI.deptguid = item.deptguid;
              itemI.deptname = item.deptname;
              itemI.phonenum = item.phonenum;
            }
          });
        });
      }
    },

    /*
     ** 默认司机处理
     */
    defaultDriverHandle(val) {
      let that = this;
      that.form.driver.forEach(function (item, index) {
        that.form.driver[index].default = "否";
      });
      that.form.driver[val].default = "是";
    },

    /*
     ** 添加邮箱
     */
    async tankHandle() {
      const res = await tankCreate(this.tank);
      console.log(res);
      if (res.status === 200) {
        this.tankListHandle();
        this.tank = {
          category: "", // 车辆名称
          kind: "", // 车辆型号
          shape: "", // 长方体,圆柱体,异型油箱
          theory_volume: 0, // 理论容积
          height: 0, // 油箱高度
          length: 0, // 油箱长度
          width: 0, //宽度
          radius: 0, // 油箱半径
        };
        this.$message.success("添加成功");
      } else this.$message.warning("添加失败稍后再试!");
      this.dialogVisible = false;
    },

    /*
     ** 油箱列表
     */
    async tankListHandle() {
      const res = await tankList();
      this.tankData = res.data.list;
    },

    /**
     * 获取详情
     */
    async getVehicleDetail() {
      if (!this.$route.query.id) return;
      const res = await equiSelect({ id: this.$route.query.id });
      if (res.status === 200) {
        this.deptList(res.data.corpguid);
        this.classifyIdList(res.data.deviceClassify);
        this.$emit("deviceInfo", res.data);
        this.form = res.data;
      }
    },
    /**
     * 单图上传
     */
    SingleImageUpload(image) {
      this.form.mainImage = image;
    },
    /**
     * 多图上传
     */
    multipleImageUpload(image) {
      this.form.image = image;
    },
  },
};
</script>

<style>
.dialog-footer {
  text-align: center;
}
</style>
