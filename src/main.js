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
import axios from 'axios'

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
// import qs from 'qs'
// Vue.use(qs);
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



/*
 ** 全局加载动画 开关
 */

let loading = null;

/*
 ** 添加请求拦截器
 */
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  loading = Vue.prototype.$loading({
    lock: true,
    text: '客官请稍后....',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  if (sessionStorage.getItem("Authorization") === null) {
    router.replace({
      path: '/'
    });
  }

  if (sessionStorage['Authorization'] === undefined)
    router.replace({
      path: '/'
    });
  else
    config.headers.common['Authorization'] = sessionStorage['Authorization'];

  return config;
}, function (error) {
  loading.close()
  // 对请求错误做些什么
  return Promise.reject(error);
});

/*
 ** 添加响应拦截器
 */
axios.interceptors.response.use(function (response) {
  if ('Authorization' in response.headers)
    sessionStorage['Authorization'] = response.headers.Authorization;

  if (response.data.errorCode === 401) {
    Vue.prototype.$message.error(response.data.message);
    router.replace({
      path: '/login'
    })
  }

  if (sessionStorage.getItem("Authorization") === null) {
    router.replace({
      path: '/login'
    });
  }

  loading.close()

  return response;
}, function (error) {
  loading.close()
  if (error.response.status >= 500) {
    Vue.prototype.$message.error('服务异常,稍后重试 !');
  } else if (error.response.status === 401) {
    router.replace({
      path: '/login'
    });
    Vue.prototype.$message.error('登录超时,请重新登录!');
  }
  return Promise.reject(error);
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
