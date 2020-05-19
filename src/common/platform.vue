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
          <i class="iconfont i-menu-one"></i>监控平台
        </el-menu-item>
        <el-submenu
          index="5"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(1, $event)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-six"></i>实时监测
          </template>
          <el-menu-item
            :style="{ paddingLeft: childTitleLeft1, width: childTitleWidth }"
            @mouseover.native="on_mouse_child(1, $event)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item
              index="/monitor/oil"
              class="myClass"
              style="float:left"
              >油耗监测</el-menu-item
            >
            <el-menu-item index="/monitor/warn" style="float:left"
              >告警监测</el-menu-item
            >
          </el-menu-item>
        </el-submenu>
        <!-- <el-submenu
          index="1"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(2)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-six"></i>统计
          </template>
          <el-menu-item
            style="width:100vw;padding-left:185px"
            @mouseover.native="on_mouse(2)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/report/fixRep" class="myClass" style="float:left">维修报表</el-menu-item>
            <el-menu-item index="/report/oilRep" style="float:left">加油报表</el-menu-item>
            <el-menu-item index="/report/assignRep" style="float:left">调度报表</el-menu-item>
          </el-menu-item>
        </el-submenu>-->

        <el-submenu
          index="3"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(2, $event)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-three" style="font-size:20px"></i>计划
          </template>
          <el-menu-item
            :style="{ paddingLeft: childTitleLeft2, width: childTitleWidth }"
            @mouseover.native="on_mouse_child(2, $event)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/plan/fixplan" style="float:left;"
              >维修计划</el-menu-item
            >
            <el-menu-item index="/plan/fixtask" style="float:left"
              >维修任务</el-menu-item
            >
            <el-menu-item index="/plan/oilplan" style="float:left"
              >加油计划</el-menu-item
            >
            <el-menu-item index="/plan/oiltask" style="float:left"
              >加油任务</el-menu-item
            >
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="4"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(3, $event)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-four" style="font-size:20px"></i>调令
          </template>
          <el-menu-item
            :style="{ paddingLeft: childTitleLeft3, width: childTitleWidth }"
            @mouseover.native="on_mouse_child(3, $event)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item index="/assign/assignplan" style="float:left;"
              >调度计划</el-menu-item
            >
            <el-menu-item index="/assign/assigntask" style="float:left"
              >调度任务</el-menu-item
            >
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="2"
          popper-class="submenu-userManger"
          @mouseover.native="on_mouse(4, $event)"
          @mouseout.native="out_mouse(1)"
        >
          <template slot="title">
            <i class="iconfont i-menu-two" style="font-size:20px"></i>平台
          </template>
          <el-menu-item
            :style="{ paddingLeft: childTitleLeft4, width: childTitleWidth }"
            @mouseover.native="on_mouse_child(4, $event)"
            @mouseout.native="out_mouse(1)"
          >
            <el-menu-item
              index="/platform/companyList"
              class="myClass"
              style="float:left"
              >公司管理</el-menu-item
            >
            <el-menu-item index="/platform/departmentList" style="float:left"
              >部门管理</el-menu-item
            >
            <el-menu-item index="/platform/role" style="float:left"
              >角色管理</el-menu-item
            >
            <el-menu-item index="/platform/staff" style="float:left"
              >人员管理</el-menu-item
            >
            <el-menu-item index="/platform/equipment" style="float:left"
              >设备管理</el-menu-item
            >
          </el-menu-item>
        </el-submenu>
        <el-menu-item style="float:right">
          <i class="el-icon-user"></i>
          <el-dropdown @command="handleCommand" class="dddddd">
            <div class="avator" style="color:#fff">
              {{ username }}
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="singout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <!-- <el-submenu index="5" popper-class="submenu-userManger">
            <template slot="title">
              <i class="iconfont i-user-manger"></i>交接班
            </template>
            <el-menu-item index="/charge/chargework">交接班</el-menu-item>
        </el-submenu>-->
      </el-menu>
    </el-row>
    <div
      class="kailong"
      v-if="flags1"
      id="trangles"
      :style="{ marginLeft: tranLeft }"
    ></div>
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
      tranLeft: 0,
      childTitleWidth: "100vw",
      childTitleLeft1: "100px",
      childTitleLeft2: "100px",
      childTitleLeft3: "100px",
      childTitleLeft4: "100px",
      username: sessionStorage.getItem("username")
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
    on_mouse(num, e) {
      // this.flags1 = false;
      let parentEle = e.currentTarget.parentElement;
      let childLis = parentEle.childNodes;
      let leftDis = 0;
      for (var i = 0; i < num; i++) {
        leftDis = leftDis + childLis[i].offsetWidth;
      }
      let leftDistance = childLis[num].offsetWidth / 2 + leftDis;
      this.tranLeft = leftDistance + "px";
      this.flags1 = true;
      let distanceSum = 0;
      var subTitleLength = 60;
      switch (num) {
        case 1:
          distanceSum = leftDistance - subTitleLength * 1;
          this.childTitleLeft1 = distanceSum + "px";
          break;
        case 2:
          distanceSum = leftDistance - subTitleLength * 2 - 15;
          this.childTitleLeft2 = distanceSum + "px";
          break;
        case 3:
          distanceSum = leftDistance - subTitleLength * 1;
          this.childTitleLeft3 = distanceSum + "px";
          break;
        case 4:
          distanceSum = leftDistance - subTitleLength * 2.5 - 25;
          this.childTitleLeft4 = distanceSum + "px";
          break;
      }
    },
    on_mouse_child(num, e) {
      this.flags1 = true;
    },
    out_mouse(e) {
      this.flags1 = false;
    },
    async handleCommand(command) {
      this.$router.replace({
        path: "/login"
      });
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function() {
        history.pushState(null, null, document.URL);
      });
      if (command == "singout") {
        const response = await signout();
        this.$message.success("退出登录成功!");
        sessionStorage.removeItem("suppliertoken");
      }
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
