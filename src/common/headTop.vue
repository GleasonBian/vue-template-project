<template>
  <div class="header_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in $route.meta.crumbs"
        :key="index"
        >{{ item }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- <el-dropdown @command="handleCommand" class="dddddd">
      
      <div class="avator">{{userName}}<i class="el-icon-caret-bottom"></i></div>
      <el-dropdown-menu slot="dropdown">
        
        <el-dropdown-item command="singout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
  </div>
</template>

<script>
import {} from "@/getData";
export default {
  name: "headTop",
  data() {
    return {
      // userName: JSON.parse(unescape(sessionStorage['UserData'])).userName
      userName: ""
    };
  },
  created() {},
  computed: {
    // ...mapState(['adminInfo']),
  },
  methods: {
    // async handleCommand(command) {
    //   this.$router.replace({
    //     path: '/login'
    //   })
    //   history.pushState(null, null, document.URL);
    //   window.addEventListener('popstate', function () {
    //     history.pushState(null, null, document.URL);
    //   });
    //   if (command == 'singout') {
    //     const response = await signout();
    //       this.$message.success("退出登录成功!");
    //     sessionStorage.removeItem('suppliertoken')
    //   }
    // }
  }
};
</script>

<style lang="less">
@import "../style/mixin.less";

.header_container {
  background-color: #eff2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}

.avator {
  width: 80px;
  text-align: center;
  color: #409eff;
}

.el-dropdown-menu__item {
  text-align: center;
}

.dddddd {
  // margin-right: 50px;
}

@media screen and (min-width: 1367px) {
  .header_container {
    height: 50px;
  }
}

@media screen and (max-width: 1366px) {
  .header_container {
    height: 40px;
  }
}
</style>
