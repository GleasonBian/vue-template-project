<template>
  <div class="searchBox">
    <el-row type="flex" justify="center" align="middle" :gutter="20">
      <el-col :span="7" class="el-col-search" v-if="searchName.box1.show">
        <div class="searchKeyWord">{{searchName.box1.name}}</div>
        <el-input v-model="keyword1" placeholder="请输入" v-if="searchName.box1.input" clearable style="width:350px">
        </el-input>
        <el-select v-model="keyword1" placeholder="请选择" style="width:350px" v-else>
          <el-option v-for="item in SelectOptions1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" v-else></el-col>

      <el-col :span="7" class="el-col-search" v-if="searchName.box2.show">
        <div class="searchKeyWord">{{searchName.box2.name}}</div>
        <el-input v-model="keyword2" placeholder="请输入"
          v-if="searchName.box2.input && !(ParentPage=='MaterialGoodsRelation')" clearable style="width:350px">
        </el-input>
        <el-select v-model="keyword2" placeholder="请选择" style="width:350px"
          v-else-if="!searchName.box2.input && !(ParentPage=='MaterialGoodsRelation')">
          <el-option v-for="item in SelectOptions2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-select v-model="keyword2" placeholder="请选择" style="width:350px" v-else>
          <el-option v-for="item in SelectOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
        <el-cascader v-model="cascader" :clearable='true' :show-all-levels="false" style="width:350px" :props="props"
          :options="options" @active-item-change="getClassHandle" @change="getThirdHandle"
          v-if="searchName.box2.show && ParentPage=='MaterialGoodsRelation'">
        </el-cascader>
      </el-col>
      <el-col :span="7" v-else></el-col>

      <el-col :span="7" class="el-col-search" v-if="searchName.box3.show">
        <div class="searchKeyWord">{{searchName.box3.name}}</div>
        <el-input v-model="keyword3" placeholder="请输入" v-if="searchName.box3.input" clearable style="width:350px">
        </el-input>
        <el-select v-model="keyword3" placeholder="请选择" style="width:350px" v-else>
          <el-option v-for="item in SelectOptions3" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" v-else></el-col>

      <el-col :span="3" class="el-col-search">
        <el-button type="primary" class="searchButton" @click="searchGetData">搜 索</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" align="middle" :gutter="20">
      <el-col :span="7" class="el-col-search" v-if="searchName.box4.show">
        <div class="searchKeyWord">{{searchName.box4.name}}</div>
        <el-input v-model="keyword4" placeholder="请输入" v-if="searchName.box4.input" clearable style="width:350px">
        </el-input>
        <el-select v-model="keyword4" placeholder="请选择" style="width:350px" v-else>
          <el-option v-for="item in SelectOptions4" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" v-else></el-col>

      <el-col :span="7" class="el-col-search" v-if="searchName.box5.show">
        <div class="searchKeyWord">{{searchName.box5.name}}</div>
        <el-input v-model="keyword5" placeholder="请输入" v-if="searchName.box5.input" clearable style="width:350px">
        </el-input>
        <el-select v-model="keyword5" placeholder="请选择" style="width:350px" v-else>
          <el-option v-for="item in SelectOptions5" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" v-else></el-col>

      <el-col :span="7" class="el-col-search" v-if="searchName.box6.show">
        <div class="searchKeyWord">{{searchName.box6.name}}</div>
        <el-input v-model="keyword1" placeholder="请输入" v-if="searchName.box6.input" clearable style="width:350px">
        </el-input>
        <el-date-picker v-else v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" style="width:350px"></el-date-picker>
      </el-col>
      <el-col :span="7" v-else></el-col>

      <!-- <el-col :span="7" class="el-col-search" v-if="searchName.box2.show && ParentPage=='MaterialGoodsRelation'">
        <div class="searchKeyWord">{{searchName.box2.name}}</div>
        <el-cascader :change-on-select='false' :props="props" :options="options" @active-item-change="getClassHandle" v-if="searchName.box2.input"></el-cascader>
      </el-col> -->

      <!-- <el-col :span="7" v-else></el-col> -->

      <el-col :span="3" class="el-col-search">
        <el-button type="info" class="searchButton" @click="resetInputContent">重 置</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    getPagerUserInfo, // 内部User
    findUserListPager, // 买家用户
    searchSupplierOrder, // 订单管理
    loadPagerEnterpriseData, // 商家店铺
    loadUserInfoQueryData, // 卖家用户
    getProductListByCondition, // 物资列表
    buyOrderDetail, // 买家统计详情
    goodsListData, // 商品管理
    findListPageData, // 物资审批
    buyerUserFeedbacks, // 买家卖家反馈 
    baseClassJSONData, // 物资分类
    pushGoodsPager, // 后台推送列表
    getPushGoodsStatus, //  后台推送状态
    NewAddbrandClass, //新增品牌运营审查列表
  } from '@/getData'
  import {
    createECDH
  } from "crypto";
  export default {
    name: "searchBoxUse",
    data() {
      return {
        keyword1: "",
        keyword2: "",
        keyword3: "",
        keyword4: "",
        keyword5: "",
        selectDate: [],
        startTime: "",
        endTime: "",
        options: [],
        props: {
          value: 'id',
          children: 'children',
          label: 'baseClassName'
        },
        thirdList: [],
        cascader: []
      };
    },
    props: {
      searchName: {},
      SelectOptions1: {},
      SelectOptions2: {},
      SelectOptions3: {},
      SelectOptions4: {},
      SelectOptions5: {},
      ParentPage: "",
      standard: {
        type: Number,
        default: 1,
        required: false
      },
    },
    mounted() {
    },
    methods: {
      searchGetData() {
        // 根据页面匹配搜索 接口
        switch (this.ParentPage) {
          case "suppliesList":
            if (this.keyword4 && isNaN(this.keyword4)) {
              this.$message.error('物资编码请输入数字')
              return
            }
            this.suppliesList();
            break;
          case "buyersUser":
            this.buyersUser();
            break;
          case "orderManage":
            if (this.keyword2 && isNaN(this.keyword2)) {
              this.$message.error('订单编号请输入数字')
              return
            }
            this.orderManage();
            break;
          case "vendorList":
            this.vendorList();
            break;
          case "vendorsUser":
            this.vendorsUser();
            break;
          case "internalUser":
            this.internalUser();
            break;
          case "goodsList":
            if (this.keyword4 && isNaN(this.keyword4)) {
              this.$message.error('物资编码请输入数字')
              return
            }
            this.suppliesList();
            break;
          case "ApprovalGoods":
            if (this.keyword2 && isNaN(this.keyword2)) {
              this.$message.error('商品编号请输入数字')
              return
            }
            this.findListPageData();
            break;
          case "buyerOrderDetail":
            if (this.keyword1 && isNaN(this.keyword1)) {
              this.$message.error('商品编号请输入数字')
              return
            }
            this.buyerOrderDetail();
            break;
          case "inSaleGoods":
            if (this.keyword2 && isNaN(this.keyword2)) {
              this.$message.error('商品编号请输入数字')
              return
            }
            this.inSaleGoods();
            break;
          case "MaterialApproval":
            if (this.keyword2 && isNaN(this.keyword2)) {
              this.$message.error('SKU编码请输入数字')
              return
            }
            this.findListPageData();
            break;
          case "atSalesGoods":
            if (this.keyword3 && isNaN(this.keyword3)) {
              this.$message.error('商品编号请输入数字')
              return
            }
            this.atSalesGoods();
            break;
          case "orderList":
            if (this.keyword1 && isNaN(this.keyword1)) {
              this.$message.error('订单编码请输入数字')
              return
            }
            this.orderListBackstage();
            break;
          case "waitSalesGoods":
            if (this.keyword3 && isNaN(this.keyword3)) {
              this.$message.error('商品编号请输入数字')
              return
            }
            this.waitSalesGoods();
            break;
          case "buyerFeedbackList":
            if (this.keyword1 && isNaN(this.keyword1)) {
              this.$message.error('用户ID请输入数字')
              return
            }
            this.buyerFeedbackList();
            break;
          case "merchantFeedbackList":
            if (this.keyword1 && isNaN(this.keyword1)) {
              this.$message.error('商家ID请输入数字')
              return
            }
            this.buyerFeedbackList();
            break;
          case "MaterialGoodsRelation":
            this.MateriaSuppliesList();
            break;
          case "pushList":
            if (this.keyword2 && isNaN(this.keyword2)) {
              this.$message.error('SKU编号请输入数字')
              return
            }
            this.pushGoodsPager();
            break;
          case "NewAddbrandClass":
            this.NewAddbrandClass();
            break;
        }
      },
      resetInputContent() {
        // 重置搜索输入
        this.keyword1 = "";
        this.keyword2 = "";
        this.keyword3 = "";
        this.keyword4 = "";
        this.keyword5 = "";
        this.startTime = "";
        this.endTime = "";
        this.selectDate = [];
        this.searchGetData();
      },
      async NewAddbrandClass(limit, offset) {
        // 新增品牌运营审查列表
        let data = {
          keyword: this.keyword1,
          brandStatus:this.keyword2,
          // state: this.keyword2,
          // startTime: Number(new Date(this.startTime)),
          // endTime: Number(new Date(this.endTime)),
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        // this.$bus.emit("NewAddbrandClass", response);
        const response = await NewAddbrandClass(data);
        if (response) this.$bus.emit("NewAddbrandClass", response);
        else this.$message.warning("让我想想哪里出了问题!");
      },
      async suppliesList(limit, offset) {
        // 物资列表
        let data = {
          productName: this.keyword1,
          firstClassName: this.keyword2,
          className: this.keyword3,
          id: this.keyword4,
          productStatus: this.ParentPage == "goodsList" ? "ONLINE" : this.keyword5,
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const response = await getProductListByCondition(data);
        if (response) this.$bus.emit("suppliesList", response);
        else this.$message.warning("让我想想哪里出了问题!");
      },
      async MateriaSuppliesList(limit, offset) {
        // 审批页面 物资列表
        let data = {
          productName: this.keyword1,
          // firstClassName: this.keyword2,
          className: this.keyword2,
          id: this.keyword4,
          brandName: this.keyword3, //** */
          productStatus: this.ParentPage == "goodsList" ? "ONLINE" : this.keyword5,
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const response = await getProductListByCondition(data);
        if (response) this.$bus.emit("MateriaSuppliesList", response);
        else this.$message.warning("让我想想哪里出了问题!");
      },
      async buyerOrderDetail(limit, offset) {
        // 统计报表
        let data = {
          userId: this.$route.query.id, // 用户id
          orderId: this.keyword1, //订单编号
          goodsName: this.keyword2, // 商品名称
          saleCompanyName: this.keyword3, // 商家名称
          orderStatus: this.keyword4, // 订单状态
          startTime: this.startTime, // 时间
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await buyOrderDetail(data);
        this.$bus.emit("buyerOrderDetail", res);
      },
      async buyersUser(limit, offset) {
        // 买家User
        let data = {
          userName: this.keyword1,
          userPhone: this.keyword2,
          companyName: this.keyword3,
          userStatus: this.keyword4,
          userType: this.keyword5,
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await findUserListPager(data);
        this.$bus.emit("buyersUser", res);

        /**
         * 用户名称 userName
         */

        /**
         * 用户手机 userPhone
         */

        /**
         * 公司名称 companyName
         */

        /**
         * 用户状态 userStatus
         */

        /**
         * 用户类型 userType
         */

        /**
         * 开始时间 startTime
         */

        /**
         * 结束时间 endTime
         */
      },
      async orderManage(limit, offset) {
        // 中台 : 订单管理
        let data = {
          orderUserName: this.keyword1, // 用户名称
          orderId: this.keyword2, //订单编号
          saleCompanyName: this.keyword3, // 公司名称
          goodsName: this.keyword4,
          orderStatus: this.keyword5,
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await searchSupplierOrder(data);
        this.$bus.emit("orderManage", res);
      },
      async orderListBackstage(limit, offset) {
        // 后台: 订单管理
        let data = {
          saleCompanyId: JSON.parse(unescape(sessionStorage["UserData"]))
            .companyId,
          orderId: this.keyword1, //订单编号
          orderUserName: this.keyword2, // 用户名称
          goodsName: this.keyword3, // 商品名称
          orderStatus: this.keyword4, // 订单状态
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await searchSupplierOrder(data);
        this.$bus.emit("orderListBackstage", res);
      },
      /**
       * 后台:推送列表
       */
      async pushGoodsPager(limit, offset,val) {
        let data = {
          goodsName: this.keyword1,
          skuId: this.keyword2,
          brandName: this.keyword3,
          pushGoodsStatusCode: this.keyword4,
          startTime: this.startTime,
          endTime: this.endTime,
          standard:val == undefined ? this.$props.standard : val,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await pushGoodsPager(data);
        if (res) this.$bus.emit("pushGoodsPager", res);
        else this.$message.error("出了点小问题");
      },

      async vendorList(limit, offset) {
        // 商家管理 / 商家列表
        let data = {
          goodsClass1Names: this.keyword1, // 品类
          enterpriseName: this.keyword2, // 企业名称
          contactName: this.keyword3, // 联系人
          contactPhone: this.keyword4, // 电话
          // contactName: this.keyword5, //关联人
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await loadPagerEnterpriseData(data);
        this.$bus.emit("vendorList", res);
      },
      async vendorsUser(limit, offset) {
        // 卖家User
        let data = {
          userName: this.keyword1,
          userId: this.keyword2, // 手机号
          positionName: this.keyword3, // 职位
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await loadUserInfoQueryData(data);
        if (res) {
          this.$bus.emit("vendorsUser", res);
        } else {
          this.$message.error("请求成功,服务错误");
        }
      },
      async internalUser(limit, offset) {
        // 内部user
        let data = {
          name: this.keyword1, // 姓名
          userName: this.keyword2, // 手机号
          position: this.keyword3, // 所在部门
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await getPagerUserInfo(data);
        this.$bus.emit("internalUser", res);
      },
      async inSaleGoods(limit, offset) {
        // 商品管理
        let data = {
          className: this.keyword1,
          productId: this.keyword2,
          supplierName: this.keyword3,
          productName: this.keyword4,
          productStatusCode: this.keyword5,
          startTime: this.startTime,
          endTime: this.endTime,
          // brandName: this.brand,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await goodsListData(data);
        if (res) this.$bus.emit("inSaleGoods", res);
        else this.$message.error("出了点小问题");
      },
      async findListPageData(limit, offset) {
        // 物资审批
        let data;
        if (this.ParentPage == 'MaterialApproval') {
          data = {
            // className: this.keyword1,
            skuId: this.keyword2,
            supplierName: this.keyword3,
            productName: this.keyword4,
            productStatusCode: this.keyword5,
            startTime: this.startTime,
            endTime: this.endTime,
            brandName: this.keyword1,
            limit: limit == undefined ? 10 : limit,
            pageNo: offset == undefined ? 1 : offset
          };
        } else {
          data = {
            className: this.keyword1,
            productId: this.keyword2,
            supplierName: this.keyword3,
            productName: this.keyword4,
            productStatusCode: this.keyword5,
            startTime: this.startTime,
            endTime: this.endTime,
            // brandName: this.brand,
            limit: limit == undefined ? 10 : limit,
            pageNo: offset == undefined ? 1 : offset
          };
        }
        // let data = {
        //   className: this.keyword1,
        //   productId: this.keyword2,
        //   supplierName: this.keyword3,
        //   productName: this.keyword4,
        //   productStatusCode: this.keyword5,
        //   startTime: this.startTime,
        //   endTime: this.endTime,
        //   // brandName: this.brand,
        //   limit: limit == undefined ? 10 : limit,
        //   pageNo: offset == undefined ? 1 : offset
        // };
        const res = await findListPageData(data);
        if (res) this.$bus.emit("findListPageData", res);
        else this.$message.error("出了点小问题");
      },
      async atSalesGoods(limit, offset) {
        // 待售商品
        let data = {
          supplierId: JSON.parse(unescape(sessionStorage["UserData"])).companyId,
          productStatusCode: 0, //在售 0 代售10        //待售在售状态
          productName: this.keyword1, //商品名称
          brandName: this.keyword2, // 品牌
          productId: this.keyword3, // 商品编号
          className: this.keyword4, // 类目
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await goodsListData(data);
        if (res) this.$bus.emit("atSalesGoods", res);
        else this.$message.error("出了点小问题");
      },
      async waitSalesGoods(limit, offset) {
        // 待售商品
        let data = {
          supplierId: JSON.parse(unescape(sessionStorage["UserData"])).companyId,
          productStatusCode: 10, //在售 0 代售10        //待售在售状态
          productName: this.keyword1, //商品名称
          brandName: this.keyword2, // 品牌
          productId: this.keyword3, // 商品编号
          className: this.keyword4, // 类目
          startTime: this.startTime,
          endTime: this.endTime,
          limit: limit == undefined ? 10 : limit,
          pageNo: offset == undefined ? 1 : offset
        };
        const res = await goodsListData(data);
        if (res) this.$bus.emit("waitSalesGoods", res);
        else this.$message.error("出了点小问题");
      },
      /**
       * 一级分类
       */
      async FirstClassHandle(value) {
        const response = await baseClassJSONData({
          level: 1,
          limit: 100
        });

        response.rows.map((item, index) => {
          item.children = []
        })

        this.options = response.rows;
      },
      /**
       * 获取二/三级分类
       */
      async getClassHandle(val) {
        if (val) {
          let data = {
            parentId: val[val.length - 1],
            limit: 1000
          }
          const response = await baseClassJSONData(data);
          if (response.rows[response.rows.length - 1].level === 2) {
            this.options.map(item => {
              if (item.id === val[val.length - 1]) {
                item.children = response.rows;
                response.rows.map(item => {
                  if (item.hasChildren)
                    item.children = [];
                })
              }
            })
          } else if (response.rows[response.rows.length - 1].level === 3) {
            this.options.map(first => {
              if (first.id === val[0]) {
                first.children.map(second => {
                  if (second.id === val[1]) {
                    second.children = response.rows;
                    this.thirdList = second.children;
                  }
                })
              }
            })
          }
        }
      },
      getThirdHandle(val) {
        this.thirdList.map(item => {
          if (item.id === val[val.length - 1]) {
            this.keyword2 = item.baseClassName
          }
        })
      },
      async buyerFeedbackList(limit, offset) { // 反馈
        let data = {}
        if (this.ParentPage == 'buyerFeedbackList') {
          data = {
            userId: this.keyword1, // 买家id
            userPhone: this.keyword2, // 手机号
            issueType: this.keyword3, // 订单状态  
            userName: this.keyword4, // 买家名称   
            feedbackUser: 'BUYER_USER', //   'SELLER_USER' //  11   买1  卖2
            startTime: this.startTime, // 时间
            endTime: this.endTime,
            limit: limit == undefined ? 10 : limit,
            pageNo: offset == undefined ? 1 : offset
          }
        } else {
          data = {
            userId: this.keyword1, // 商家id
            userPhone: this.keyword2, // 手机号
            issueType: this.keyword3, // 订单状态  
            userName: this.keyword4, // 商家名称   
            feedbackUser: 'SELLER_USER', //   'SELLER_USER' //  11   买1  卖2
            startTime: this.startTime, // 时间
            endTime: this.endTime,
            limit: limit == undefined ? 10 : limit,
            pageNo: offset == undefined ? 1 : offset
          }
        }
        const res = await buyerUserFeedbacks(data)
        this.$bus.emit("FeedbackList", res);
      },
    },
    created() {
      this.searchGetData();
    },
    watch: {
      selectDate: function (val) {
        if (val === null || val.length == 0) {
          this.startTime = "";
          this.endTime = "";
        } else {
          let start = new Date(val[0]); //直接用 new Date(时间戳) 格式转化获得当前时间
          let end = new Date(val[1]);
          start =
            start.toLocaleDateString().replace(/\//g, "-") +
            " " +
            start.toTimeString().substr(0, 8);
          end = end.toLocaleDateString().replace(/\//g, "-") + " " + "23:59:59";
          this.startTime = start;
          this.endTime = end;
        }
      }
    }
  };

</script>
<style scoped>
  .searchKeyWord {
    width: 100px;
    display: inline-block;
    text-align: center;
    line-height: 16px;
    font-family: Microsoft YaHei;
    font-size: 16px;
    color: #333333;
  }

  .searchButton {
    width: 80%;
    display: inline-block;
    text-align: center;
    text-align-last: center;
  }

  .el-col-search {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }

  @media screen and (min-width: 1367px) {
    .el-col-search {
      margin-bottom: 24px;
    }

    .searchBox {
      margin-top: 24px;
    }
  }

  @media screen and (max-width: 1366px) {
    .el-col-search {
      margin-bottom: 10px;
    }

    .searchBox {
      margin-top: 10px;
    }
  }

</style>
