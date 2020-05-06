import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/common.less'
import gtTable from '@/common/gtTable'
import gtSearch from "@/common/gtSearch";
import VueAMap from 'vue-amap';
Vue.use(ElementUI);
import qs from 'qs'
Vue.use(qs);
Vue.use(VueAMap);

Vue.config.productionTip = false;
Vue.component('gt-table', gtTable)
Vue.component('gt-search', gtSearch)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
