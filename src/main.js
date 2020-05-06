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
import echarts from 'echarts'

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
import qs from 'qs'
Vue.use(qs);
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '26ca8b78bdedf59b713c591f99752df1',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
Vue.config.productionTip = false;
Vue.component('gt-table', gtTable)
Vue.component('gt-search', gtSearch)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
