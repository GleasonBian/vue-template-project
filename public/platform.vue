<template>
  <div class="manage_page fillcontain">
    <el-row class="menu-row-style">
      <el-menu
        :default-active="defaultActive"
        background-color="#272B2E"
        text-color="#ffffff"
        active-text-color="#FFD04B"
        :unique-opened="true"
        :collapse-transition="true"
        router
        mode="horizontal"
      >
        <el-menu-item index="/dashboard">
          <i class="iconfont i-menu-one"></i>首页
        </el-menu-item>
        <el-submenu
          index="5"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(1)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-six"></i>实时监测
          </template>
          <el-menu-item
            style="width:100vw;padding-left:50px"
            @mouseover.native="on_mouse(5)"
            @mouseout.native="out_mouse(5)"
          >
            <el-menu-item index="/monitor/oil" class="myClass" style="float:left">油耗监测</el-menu-item>
            <el-menu-item index="/monitor/warn" style="float:left">告警监测</el-menu-item>
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="1"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(1)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-six"></i>统计
          </template>
          <el-menu-item
            style="width:100vw;padding-left:50px"
            @mouseover.native="on_mouse(1)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/report/fixRep" class="myClass" style="float:left">维修报表</el-menu-item>
            <el-menu-item index="/report/oilRep" style="float:left">加油报表</el-menu-item>
            <el-menu-item index="/report/assignRep" style="float:left">调度报表</el-menu-item>
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="2"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(2)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-two" style="font-size:20px"></i>平台
          </template>
          <el-menu-item
            style="width:100vw;padding-left:95px"
            @mouseover.native="on_mouse(2)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/platform/companyList" class="myClass" style="float:left">公司管理</el-menu-item>
            <el-menu-item index="/platform/departmentList" style="float:left">部门管理</el-menu-item>
            <el-menu-item index="/platform/role" style="float:left">角色管理</el-menu-item>
            <el-menu-item index="/platform/staff" style="float:left">人员管理</el-menu-item>
            <el-menu-item index="/platform/equipment" style="float:left">设备管理</el-menu-item>
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="3"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(3)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-three" style="font-size:20px"></i>计划
          </template>
          <el-menu-item
            style="width:100vw;padding-left:252px"
            @mouseover.native="on_mouse(3)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/plan/fixplan" style="float:left;">维修计划</el-menu-item>
            <el-menu-item index="/plan/fixtask" style="float:left">维修任务</el-menu-item>
            <el-menu-item index="/plan/oilplan" style="float:left">加油计划</el-menu-item>
            <el-menu-item index="/plan/oiltask" style="float:left">加油任务</el-menu-item>
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="4"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(4)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-four"></i>调令
          </template>
          <el-menu-item
            style="width:100vw;padding-left:450px"
            @mouseover.native="on_mouse(4)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/assign/assignplan" style="float:left;">调度计划</el-menu-item>
            <el-menu-item index="/assign/assigntask" style="float:left">调度任务</el-menu-item>
          </el-menu-item>
        </el-submenu>
        <!-- <el-menu-item>
          <i class="iconfont i-menu-five"></i>
          <a
            href="http://114.215.194.254:89/Interface/checkDbUser"
            target="_bank"
            style="color:#fff"
          >监控平台</a>
        </el-menu-item>-->
        <!-- <el-submenu index="5" popper-class="submenu-userManger">
            <template slot="title">
              <i class="iconfont i-user-manger"></i>交接班
            </template>
            <el-menu-item index="/charge/chargework">交接班</el-menu-item>
        </el-submenu>-->
      </el-menu>
    </el-row>
    <div class="kailong" v-if="flags1" id="trangles" :style="{marginLeft:tranLeft}"></div>
    <el-row>
      <transition>
        <router-view></router-view>
      </transition>
    </el-row>
  </div>
</template>

<script>
// import { getUserPermission, getPageElement } from "@/getData";
export default {
  name: "platform",
  components: {},
  data() {
    return {
      transitionName: "",
      mtemListA: [],
      /*************************************************** */
      active: "0-0",
      menuList: [],
      mtemList: [],
      isCollapse: false,
      /*************************************************** */
      flags1: false,
      tranLeft: 0
    };
  },
  watch: {
    //使用watch 监听$router的变化
  },
  created() {
    // this.getUserPermission();
    // this.getPageElement();
  },
  methods: {
    on_mouse(e) {
      // this.flags1 = false;
      switch (e) {
        case 1:
          this.tranLeft = "150px";
          break;
        case 2:
          this.tranLeft = "270px";
          break;
        case 3:
          this.tranLeft = "390px";
          break;
        case 4:
          this.tranLeft = "510px";
          break;
      }
      this.flags1 = true;
    },
    out_mouse(e) {
      this.flags1 = false;
    }
    // async getUserPermission() {
    //   const res = await getUserPermission({
    //     systemCode: "wxsupplier"
    //   });
    //   if (res.result) {
    //     if (Array.isArray(res.data) && res.data.length > 0) {
    //       console.log("1111", this.uniq(res.data));
    //       this.addMenuIndex(res.data);
    //     }
    //   }
    // }
  },
  computed: {
    defaultActive: function() {
      return this.$route.path;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.elmenu {
  background: #324057;
}

.i-total-statistics,
.i-stores-baseis,
.i-supply-center {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  margin-left: 5px;
}

.i-user-manger {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 16px;
  margin-left: 5px;
}

.i-order-center {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 16px;
  margin-left: 5px;
}

.i-stores-manger {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 21px;
  margin-left: 5px;
}

// .el-submenu {
//   width: 100%;
// }

// .el-submenu .el-menu-item {
//   min-width: 100%;
// }

// 激活 子菜单 背景色
.el-menu-item.is-active {
  background-color: rgb(0, 0, 0) !important;
}

// .menu-row-style {
//   position: absolute;
//   top: 0px;
//   left: 0px;
//   z-index: 100;
//   width: 100%;
// }
.kailong {
  position: absolute;
  z-index: 99999;
  width: 0;
  height: 0;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-bottom: 5px solid #272b2e;
}
</style>
<style>
.myClass >>> .el-menu--popup {
  min-width: 100vw;
}
</style>