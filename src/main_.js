import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

/** 
 * 富文本 编辑器
*/
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/**
 * 引入 element UI
 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(VueQuillEditor)


/** 
 * 引入 VueX
*/
import store from './store'

/* *
 * import VueAxios from 'vue-axios'
 * Vue.use(VueAxios, axios);
 * var qs = require('qs');
 * Vue.prototype.qs = qs;
 */

 import VueAxios from 'vue-axios'
 Vue.use(VueAxios, axios);
 var qs = require('qs');
 Vue.prototype.qs = qs;

var qs = require('qs');
Vue.prototype.qs = qs;
 /**
  * 事件中心
  */
import VueBus from 'vue-bus';
Vue.use(VueBus);

Vue.config.productionTip = false

/**
 * 公共组件
 */
import pagination from '@/common/pagination'
import dialog from '@/common/dialog'
import gtform from '@/common/gtform'
import editor from '@/common/editor'
import brand from '@/common/brand'
import newTag from '@/common/newTag'
import gtTable from '@/common/gtTable'
import gtTabTree from '@/common/gtTabTree'
import gtCascaderClass from '@/common/gtCascaderClass'
import gtCascader from '@/common/gtCascader'
import gtAutocomplete from '@/common/gtautocomplete'
import gtSingleImg from '@/common/gtSingleImg'
import gtMultiImg from '@/common/gtMultiImg'
import gtFile from '@/common/gtFile'
Vue.component('gt-pagination', pagination)
Vue.component('gt-form', gtform)
Vue.component('gt-dialog', dialog)
Vue.component('gt-editor', editor)
Vue.component('gt-brand', brand);
Vue.component('gt-newTag', newTag);
Vue.component('gt-table', gtTable);
Vue.component('gt-cascader-class', gtCascaderClass);
Vue.component('gt-cascader', gtCascader);
Vue.component('gt-autocomplete', gtAutocomplete);
Vue.component('gt-singleImg', gtSingleImg);
Vue.component('gt-multiImg', gtMultiImg);
Vue.component('gt-file', gtFile);


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

  if (sessionStorage.getItem("suppliertoken") === null) {
    router.replace({
      path: '/'
    });
  }

  if (sessionStorage['suppliertoken'] === undefined)
    router.replace({
      path: '/'
    });
  else
    config.headers.common['supplierToken'] = sessionStorage['suppliertoken'];

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
  if ('suppliertoken' in response.headers)
    sessionStorage['suppliertoken'] = response.headers.suppliertoken;

  if (response.data.errorCode === 401) {
    Vue.prototype.$message.error(response.data.message);
    router.replace({
      path: '/'
    })
  }

  if (sessionStorage.getItem("suppliertoken") === null) {
    router.replace({
      path: '/'
    });
  }

  loading.close()

  return response;
}, function (error) {
  loading.close()
  if (error.response.status >= 404) {
    Vue.prototype.$message.error('服务异常,稍后重试 !');
  }
  return Promise.reject(error);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})