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
            crumbs: ['平台', '公司管理'],
            title: '公司管理',
            index: 11,
            menu: '090302'
          },
        },
        {
          path: 'departmentList',
          component: resolve => require(['@/components/departmentList'], resolve),
          meta: {
            crumbs: ['平台', '部门管理'],
            title: '部门管理',
            index: 1,
            menu: '090302'
          },
        },
        {
          path: 'equipment',
          component: resolve => require(['@/components/equipment'], resolve),
          meta: {
            crumbs: ['平台', '设备管理'],
            title: '设备管理',
            index: 2,
            menu: '090302'
          },
        },
        {
          path: 'staff',
          component: resolve => require(['@/components/staff'], resolve),
          meta: {
            crumbs: ['平台', '人员管理'],
            title: '人员管理',
            index: 3,
            menu: '090302'
          },
        },
        {
          path: 'role',
          component: resolve => require(['@/components/role'], resolve),
          meta: {
            crumbs: ['平台', '角色管理'],
            title: '角色管理',
            index: 4,
            menu: '090302'
          },
        },
      ]
    },
    {
      path: '/plan',
      component: resolve => require(['@/common/platform'], resolve),
      children: [
        {
          path: 'fixplan',
          component: resolve => require(['@/components/fixplan'], resolve),
          meta: {
            crumbs: ['计划', '维修计划'],
            title: '维修计划',
            index: 5,
            menu: '090302'
          },
        },
        {
          path: 'fixtask',
          component: resolve => require(['@/components/fixtask'], resolve),
          meta: {
            crumbs: ['计划', '维修任务'],
            title: '维修任务',
            index: 6,
            menu: '090302'
          },
        },
        {
          path: 'oilplan',
          component: resolve => require(['@/components/oilplan'], resolve),
          meta: {
            crumbs: ['计划', '加油计划'],
            title: '加油计划',
            index: 7,
            menu: '090302'
          },
        },
        {
          path: 'oiltask',
          component: resolve => require(['@/components/oiltask'], resolve),
          meta: {
            crumbs: ['计划', '加油任务'],
            title: '加油任务',
            index: 8,
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