import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/common.less';
import gtTable from '@/common/gtTable';
import gtSearch from '@/common/gtSearch';
import headTop from '@/common/headTop';
import SingleImageUpload from '@/common/SingleImageUpload';
import multipleImageUpload from '@/common/multipleImageUpload';
// import VueAMap from "vue-amap";
import echarts from 'echarts';
import axios from 'axios';
import store from './store';
import router from './router';

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
// import qs from 'qs'
// Vue.use(qs);
// Vue.use(VueAMap);

// VueAMap.initAMapApiLoader({
//   key: "26ca8b78bdedf59b713c591f99752df1",
//   plugin: [
//     "AMap.Autocomplete",
//     "AMap.PlaceSearch",
//     "AMap.Scale",
//     "AMap.OverView",
//     "AMap.ToolBar",
//     "AMap.MapType",
//     "AMap.PolyEditor",
//     "AMap.CircleEditor"
//   ],
//   // 默认高德 sdk 版本为 1.4.4
//   v: "1.4.4"
// });

Vue.config.productionTip = false;
Vue.component('gt-table', gtTable);
Vue.component('gt-search', gtSearch);
Vue.component('gt-header', headTop);
Vue.component('gt-single-img', SingleImageUpload);
Vue.component('gt-multiple-img', multipleImageUpload);

/*
 ** 全局加载动画 开关
 */
let loading = null;

/*
 ** 添加请求拦截器
 */
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    loading = Vue.prototype.$loading({
      lock: true,
      body: true,
      text: '客官请稍后....',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0)',
    });

    if (sessionStorage.getItem('Authorization') === null) {
      router.replace({
        path: '/',
      });
    }

    if (sessionStorage.Authorization === undefined) {
      router.replace({
        path: '/',
      });
    } else config.headers.common.Authorization = sessionStorage.Authorization;

    return config;
  },
  (error) => {
    loading.close();
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

/*
 ** 添加响应拦截器
 */
axios.interceptors.response.use(
  (response) => {
    // console.log(response);
    // 检查请求 token
    'Authorization' in response.headers ? sessionStorage.Authorization = response.headers.Authorization : '';
    // 检查本地 token
    sessionStorage.getItem('Authorization') === null ? router.replace({ path: '/login' }) : '';
    // 响应 401 返回登录页
    if (response.data.errorCode === 401) {
      Vue.prototype.$message.error(response.data.message);
      router.replace({
        path: '/login',
      });
    }
    // 关闭 loading
    loading.close();
    // 返回 响应
    return response;
  },
  (error) => {
    loading.close();
    console.log(error.response);
    // 响应 400 提示 warning
    error.response.status === 400 ? Vue.prototype.$message.warning(error.response.data.message) : '';
    if (error.response.status >= 500) {
      Vue.prototype.$message.error('服务异常,稍后重试 !');
    } else if (error.response.status === 401) {
      router.replace({
        path: '/login',
      });
      Vue.prototype.$message.error('登录超时,请重新登录!');
    }
    return Promise.reject(error);
  },
);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
