<template>
  <el-container class="mar_pad">
    <el-header class="mar_pad" style="height: 40px;">
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
        <el-menu-item index="/dashboard" style>
          <i class="iconfont i-menu-one"></i>监控平台
        </el-menu-item>

        <el-submenu index="1" popper-class="submenu-userManger" style="text-align: center;">
          <template slot="title">
            <i class="iconfont i-menu-two"></i>车辆管理
          </template>
          <el-menu-item index="/platform/equipment" class="myClass" style="text-align: center;">车辆台账</el-menu-item>
          <el-menu-item index="/platform/fence" style="text-align: center;">电子围栏</el-menu-item>
          <el-menu-item index="/historyroute" style="text-align: center;">历史轨迹</el-menu-item>
        </el-submenu>

        <el-submenu index="2" popper-class="submenu-userManger" style="text-align: center;">
          <template slot="title">
            <i class="iconfont i-menu-six"></i>实时监测
          </template>
          <el-menu-item index="/monitor/oil" class="myClass" style="text-align: center;">油耗监测</el-menu-item>
          <el-menu-item index="/monitor/warn" style="text-align: center;">告警监测</el-menu-item>
          <el-menu-item index="/monitor/statistics" style="text-align: center;">油耗统计</el-menu-item>
        </el-submenu>

        <el-submenu index="3" popper-class="submenu-userManger" style="text-align: center;">
          <template slot="title">
            <i class="iconfont i-menu-three" style="font-size:20px"></i>作业管理
          </template>
          <el-menu-item index="/plan/refuel" style="text-align: center;">车辆加油</el-menu-item>
          <el-menu-item index="/plan/repair" style="text-align: center;">车辆保养</el-menu-item>
          <el-menu-item index="/assign/assignList" style="text-align: center;">车辆调度</el-menu-item>
          <el-menu-item index="/plan/fixList" style="text-align: center;">车辆维修</el-menu-item>
        </el-submenu>

        <el-submenu index="4" popper-class="submenu-userManger" style="text-align: center;">
          <template slot="title">
            <i class="iconfont i-menu-two" style="font-size:20px"></i>平台
          </template>
          <el-menu-item
            index="/platform/companyList"
            class="myClass"
            style="text-align: center;"
          >公司管理</el-menu-item>
          <el-menu-item index="/platform/deptList" style="text-align: center;">部门管理</el-menu-item>
          <el-menu-item index="/platform/staffList" style="text-align: center;">人员管理</el-menu-item>
          <el-menu-item index="/platform/roleList" style="text-align: center;">角色管理</el-menu-item>
        </el-submenu>

        <el-menu-item style="float:right;padding: 0 20px 0 0">
          <i class="el-icon-user"></i>
          <el-dropdown class="dddddd">
            <div class="avator" style="color:#fff">
              {{ username }}
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-message-solid" @click.native="messageHandle">消息</el-dropdown-item>
              <el-dropdown-item
                command="singout"
                icon="el-icon-warning"
                @click.native="handleCommand"
              >退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="mar_pad">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "platform",
  components: {},
  data() {
    return {
      transitionName: "transitionLeft",
      circleUrl: "$img/22.png",
      mtemListA: [],
      /*************************************************** */
      active: "0-0",
      menuList: [],
      mtemList: [],
      isCollapse: false,
      /*************************************************** */
      flags1: false,
      username: sessionStorage.getItem("username"),
      dialogVisible: false,
      alarmInfo: {
        ID: 26596,
        CreatedAt: "2020-05-22T13:19:34.7506121+08:00",
        UpdatedAt: "2020-05-22T13:19:34.7506121+08:00",
        DeletedAt: null,
        guid: "296fcfc8-cb0f-47aa-a262-ec4028cec4e4",
        name: "SUV01",
        alarm_name: "SUV01超速报警",
        class_type: "超速报警",
        class_rank: "普通",
        threshold: 0,
        actual_value: 16,
        occur_time: "2020-05-22 13:19:34",
        duty_guid: "",
        duty_name: "",
        handler_guid: "",
        handler_name: "",
        handle_time: "",
        handle_result: "",
        remark: "",
        websock: null,
      },
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
      //如果to索引大于from索引,判断为前进状态,反之
      // if (to.meta.index > from.meta.index) {
      //   this.transitionName = 'transitionLeft';
      // } else {
      //   this.transitionName = 'transitionRight';
      // }
    },
  },
  created() {},
  mounted() {
    this.initWebSocket();
  },
  methods: {
    async handleCommand(command) {
      console.log(command);
      this.$router.replace({
        path: "/login",
      });
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function () {
        history.pushState(null, null, document.URL);
      });
      if (command == "singout") {
        // const response = await signout();
        this.$message.success("退出登录成功!");
      }
    },
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
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.dialogVisible = false;
        })
        .catch((_) => {});
    },
    handleAlarmInfo(id) {
      this.$router.push({
        path: "/platform/Alarm",
        query: {
          id: id,
        },
      });
      this.dialogVisible = false;
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = process.env.VUE_APP_WORNING;
      // 建立连接
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(event) {
      //数据接收
      if (event.data instanceof Blob) {
        let reader = new FileReader();
        reader.readAsText(event.data);
        reader.onload = () => {
          if (reader.result == "ws/warning") return;
          let data = reader.result;
          data = eval("(" + data + ")");
          // console.log("解析->", data);
          const h = this.$createElement;
          let guid = data.guid;
          this.$notify({
            title: data.class_type,
            type: "warning",
            position: "top-right",
            dangerouslyUseHTMLString: true,
            message: h("div", { class: "message" }, [
              h("div", { class: "btnList" }, [
                h("span", null, data.alarm_name),
                h(
                  "a",
                  {
                    class: "later",
                    on: {
                      click: () => {
                        this.$router.push({
                          path: "/platform/Alarm",
                          query: {
                            id: data.ID,
                          },
                        });
                      },
                    },
                  },
                  "处理"
                ),
              ]),
            ]),
          });
        };
      } else {
        console.log("Result2: " + event.data);
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      this.websocketsend("ws/warning");
    },
    websocketsend(Data) {
      console.log("Data:", Data);
      //数据发送
      this.websock.send(Data);
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    messageHandle() {
      this.$router.push('/platform/message')
    },
  },
  computed: {
    defaultActive: function () {
      return this.$route.path;
    },
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
};
</script>


<style  scoped>

>>> .el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
}

>>> .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 40px;
  line-height: 40px;
}

>>> .el-menu--horizontal > .el-submenu > .el-menu--horizontal > .el-menu--popup {
  min-width: 130px;
  width: 130px;
}

.mar_pad {
  padding: 0px;
  margin: 0px;
}
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
/* 激活 子菜单 背景色 */
.el-menu-item.is-active {
  background-color: rgb(0, 0, 0) !important;
}

.menu-row-style {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
  width: 100%;
}

.later {
  width: 30px;
  color: red;
  margin-left: 5px;
  cursor: pointer;
}

.fade-enter {
  opacity: 0.2;
}
.fade-leave {
  opacity: 0.8;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  opacity: 0.1;
  transition: opacity 0.5s;
}
</style>
<style>
.myClass >>> .el-menu--popup {
  min-width: 100vw;
}
</style>
