<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="3" style="min-height: 100%; background-color: #272B2E;">
        <el-menu
          :default-active="defaultActive"
          background-color="#272B2E"
          text-color="#ffffff"
          active-text-color="#FFD04B"
          :unique-opened="true"
          :collapse-transition="true"
          router
        >
          <el-menu-item index="/middleground">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="2" popper-class="submenu-userManger">
            <template slot="title">
              <i class="iconfont i-user-manger"></i>平台
            </template>
            <el-menu-item index="/platform/companyList">公司管理</el-menu-item>
            <el-menu-item index="/platform/departmentList">部门管理</el-menu-item>
            <el-menu-item index="/platform/role">角色管理</el-menu-item>
            <el-menu-item index="/platform/staff">人员管理</el-menu-item>
            <el-menu-item index="/platform/equipment">设备管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="21" style="height: 100%;overflow: auto;">
        <transition>
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserPermission, getPageElement } from "@/getData";
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
      menuLeftBar: [
        {
          name: "数据总览",
          title: "数据总览",
          index: 0,
          code: "0901",
          children: []
        },
        {
          name: "用户管理",
          title: "用户管理",
          index: 1,
          code: "0903",
          children: []
        },
        {
          name: "订单中心",
          title: "订单中心",
          index: 2,
          code: "0902",
          children: []
        },
        {
          name: "商家管理",
          title: "商家管理",
          index: 3,
          code: "0908",
          children: []
        },
        {
          name: "商品中心",
          title: "商品中心",
          index: 4,
          code: "0904",
          children: []
        },
        {
          name: "商家基础",
          title: "商家基础",
          index: 5,
          code: "0905",
          children: []
        },
        {
          name: "物资中心",
          title: "物资中心",
          index: 6,
          code: "0906",
          children: []
        },
        {
          name: "统计报表",
          title: "统计报表",
          index: 7,
          code: "0907",
          children: []
        }
      ]
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
    async getUserPermission() {
      const res = await getUserPermission({
        systemCode: "wxsupplier"
      });
      if (res.result) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          console.log("1111", this.uniq(res.data));
          this.addMenuIndex(res.data);
        }
      }
    }
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

.el-submenu {
  width: 100%;
}

.el-submenu .el-menu-item {
  min-width: 100%;
}

// 激活 子菜单 背景色
.el-menu-item.is-active {
  background-color: rgb(0, 0, 0) !important;
}
</style>
