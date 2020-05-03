import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/common.less'
import gtTable from '@/common/gtTable'
import gtSearch from "@/common/gtSearch";
Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.component('gt-table', gtTable)
Vue.component('gt-search', gtSearch)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
