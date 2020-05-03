<template>
  <div id="app" class="fillcontain">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
    this.$root.TimeTranArrayObject = function(arrayObject) {
      arrayObject.map(item => {
        let orderTime = new Date(item.createTime);
        item.createTime =
          orderTime.toLocaleDateString().replace(/\//g, "-") +
          " " +
          orderTime.toTimeString().substr(0, 8);
      });
      return arrayObject;
    };
    this.$root.createTime = function(createTime) {
      let orderTime = new Date(createTime);
      createTime =
        orderTime.toLocaleDateString().replace(/\//g, "-") +
        " " +
        orderTime.toTimeString().substr(0, 8);
      return createTime;
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="less">
@import "./style/common";

@font-face {
  font-family: "iconfont";
  /* project id 868569 */
  src: url("//at.alicdn.com/t/font_868569_0b60n56q7j6l.eot");
  src: url("//at.alicdn.com/t/font_868569_0b60n56q7j6l.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_868569_0b60n56q7j6l.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_868569_0b60n56q7j6l.woff") format("woff"),
    url("//at.alicdn.com/t/font_868569_0b60n56q7j6l.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_868569_0b60n56q7j6l.svg#iconfont") format("svg");
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  color: #cccccc;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*本项目使用的图标 */
.i-pay-amount:before {
  content: "\e643";
}

.i-total-consu:before {
  content: "\e6f1";
}

.i-total-orders:before {
  content: "\e608";
}

.i-total-statistics:before {
  content: "\e856";
}

/* 菜单栏 图标 */
.i-user-manger:before {
  content: "\e617";
}
.i-order-center:before {
  content: "\e634";
}
.i-stores-manger:before {
  content: "\e625";
}
.i-stores-baseis:before {
  content: "\e6ef";
}
.i-supply-center:before {
  content: "\e61f";
}
</style>