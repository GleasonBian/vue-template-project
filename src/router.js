import Vue from 'vue'
import Router from 'vue-router'
import {
  resolve
} from 'path';


// login 登录
const login = resolve => require(['@/components/login'], resolve);


Vue.use(Router)

const router = new Router({
  mode: 'hash', //history   hash
  base: "/equipment/",
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '中铁十二局三公司设备管理系统'
      }
    },
    {
      path: '*',
      name: '*',
      redirect: '/login'
    },
    {
      path: '/platform',
      component: resolve => require(['@/common/platform'], resolve),
      children: [
        // {
        //   path: '',
        //   component: resolve => require(['@/components/middleground/Zhongtai'], resolve),
        //   meta: {
        //     crumbs: ['欢迎访问中台'],
        //     title: '欢迎访问中台',
        //     index: 0,
        //   },
        // },
        // {
        //   path: 'home',
        //   component: resolve => require(['@/components/middleground/home'], resolve),
        //   meta: {
        //     crumbs: ['数据统计图'],
        //     title: '数据统计图',
        //     index: 0,
        //     menu: '090101'
        //   },
        // },
        {
          path: 'companyList',
          component: resolve => require(['@/components/companyList'], resolve),
          meta: {
            crumbs: ['用户管理', '公司管理'],
            title: '公司管理',
            index: 0,
            menu: '090302'
          },
        },
        {
          path: 'departmentList',
          component: resolve => require(['@/components/departmentList'], resolve),
          meta: {
            crumbs: ['平台', '部门管理'],
            title: '部门管理',
            index: 0,
            menu: '090302'
          },
        },
      ]
    }
  ]
})
// 每个页面 添加title
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();
})
export default router