import Vue from "vue";
import Router from "vue-router";
import { resolve } from "path";

// login 登录
const login = resolve => require(["@/components/login"], resolve);

Vue.use(Router);

const router = new Router({
  mode: "hash", //history   hash
  base: "/equipment/",
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        title: "中铁十二局三公司设备管理系统"
      }
    },
    {
      path: "*",
      name: "*",
      redirect: "/login"
    },
    {
      path: "/platform",
      component: resolve => require(["@/common/platform"], resolve),
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
          path: "/dashboard",
          name: "dashboard",
          component: resolve => require(["@/components/dashboard"], resolve),
          meta: {
            title: "数据统计图"
          }
        },
        {
          path: "/track/:id",
          name: "track",
          component: resolve => require(["@/components/track2"], resolve),
          meta: {
            crumbs: ["监控平台", "历史轨迹"],
            title: "历史轨迹",
            index: 11,
            menu: "090302"
          }
        },
        // {
        //   path: "companyList",
        //   component: resolve => require(["@/components/companyList"], resolve),
        //   meta: {
        //     crumbs: ["平台", "公司管理"],
        //     title: "公司管理",
        //     index: 11,
        //     menu: "090302"
        //   }
        // },
        {
          path: "companyList",
          component: resolve => require(["@/components/platform/companyList"], resolve),
          meta: {
            crumbs: ["平台", "公司管理"],
            title: "公司管理",
            index: 11,
            menu: "090302"
          }
        },
        {
          path: "companyDetail",
          component: resolve => require(["@/components/platform/companyDetail"], resolve),
          meta: {
            crumbs: ["平台", "公司管理"],
            title: "公司管理",
            index: 12,
            menu: "090302"
          }
        },
        {
          path: "departmentList",
          component: resolve =>
            require(["@/components/departmentList"], resolve),
          meta: {
            crumbs: ["平台", "部门管理"],
            title: "部门管理",
            index: 1,
            menu: "090302"
          }
        },
        {
          path: "equipment",
          component: resolve => require(["@/components/equipment"], resolve),
          meta: {
            crumbs: ["平台", "设备管理"],
            title: "设备管理",
            index: 2,
            menu: "090302"
          }
        },
        {
          path: "staff",
          component: resolve => require(["@/components/staff"], resolve),
          meta: {
            crumbs: ["平台", "人员管理"],
            title: "人员管理",
            index: 3,
            menu: "090302"
          }
        },
        {
          path: "role",
          component: resolve => require(["@/components/role"], resolve),
          meta: {
            crumbs: ["平台", "角色管理"],
            title: "角色管理",
            index: 4,
            menu: "090302"
          }
        },
        {
          path: "Alarm",
          component: resolve => require(["@/components/alarm"], resolve),
          meta: {
            crumbs: ["告警", "告警信息"],
            title: "告警信息",
            index: 5,
            menu: "090302"
          }
        },
      ]
    },
    {
      path: "/plan",
      component: resolve => require(["@/common/platform"], resolve),
      children: [
        {
          path: "refuel",
          component: resolve => require(["@/components/refuel"], resolve),
          meta: {
            crumbs: ["计划", "加油计划"],
            title: "加油计划",
            index: 7,
            menu: "090302"
          }
        },
        {
          path: "oilapply",
          component: resolve => require(["@/components/oilApply"], resolve),
          meta: {
            crumbs: ["作业管理", "加油申请"],
            title: "加油申请",
            index: 9,
            menu: "090302"
          }
        },
        {
          path: "repair",
          component: resolve => require(["@/components/repair"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆保养"],
            title: "车辆保养",
            index: 8,
            menu: "090302"
          }
        },
        {
          path: "day",
          component: resolve => require(["@/components/repairDay"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆保养", "日常保养"],
            title: "日常保养",
            index: 8,
            menu: "090302"
          }
        },
        {
          path: "week",
          component: resolve => require(["@/components/repairWeek"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆保养", "周常保养"],
            title: "周常保养",
            index: 8,
            menu: "090302"
          }
        },
        {
          path: "month",
          component: resolve => require(["@/components/repairMonth"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆保养", "月常保养"],
            title: "月常保养",
            index: 8,
            menu: "090302"
          }
        },
        {
          path: "fixList",
          component: resolve => require(["@/components/task/fixList"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆维修"],
            title: "车辆维修",
            index: 15,
            menu: "090302"
          }
        },
        {
          path: "fixDetail",
          component: resolve => require(["@/components/task/fixDetail"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆维修", "维修详情"],
            title: "维修详情",
            index: 15,
            menu: "090302"
          }
        },
        {
          path: "fixTask",
          component: resolve => require(["@/components/task/fixTask"], resolve),
          meta: {
            crumbs: ["作业管理", "车辆维修", "维修任务"],
            title: "维修任务",
            index: 15,
            menu: "090302"
          }
        },
      ]
    },
    {
      path: "/assign",
      component: resolve => require(["@/common/platform"], resolve),
      children: [
        {
          path: "assignList",
          component: resolve => require(["@/components/task/assignList"], resolve),
          meta: {
            crumbs: ["作业管理", "调令"],
            title: "调令",
            index: 7,
            menu: "090302"
          }
        },
        {
          path: "assignDetail",
          component: resolve => require(["@/components/task/assignDetail"], resolve),
          meta: {
            crumbs: ["作业管理", "调令"],
            title: "调令",
            index: 8,
            menu: "090302"
          }
        },
        {
          path: "singleOil",
          component: resolve => require(["@/components/task/singleOil"], resolve),
          meta: {
            crumbs: ["作业管理", "单机油耗核算"],
            title: "单机油耗核算",
            index: 9,
            menu: "090302"
          }
        },
      ]
    },
    {
      path: "/report",
      component: resolve => require(["@/common/platform"], resolve),
      children: [
        {
          path: "fixRep",
          component: resolve => require(["@/components/fixRep"], resolve),
          meta: {
            crumbs: ["统计", "维修报表"],
            title: "维修报表",
            index: 9,
            menu: "090302"
          }
        },
        {
          path: "oilRep",
          component: resolve => require(["@/components/oilRep"], resolve),
          meta: {
            crumbs: ["统计", "加油报表"],
            title: "加油报表",
            index: 10,
            menu: "090302"
          }
        },
        {
          path: "assignRep",
          component: resolve => require(["@/components/assignRep"], resolve),
          meta: {
            crumbs: ["统计", "调度报表"],
            title: "调度报表",
            index: 11,
            menu: "090302"
          }
        }
      ]
    },
    {
      path: "/monitor",
      component: resolve => require(["@/common/platform"], resolve),
      children: [
        {
          path: "oil",
          component: resolve => require(["@/components/oilMonitor"], resolve),
          meta: {
            crumbs: ["实时监测", "油耗监测"],
            title: "油耗监测",
            index: 20,
            menu: "090302"
          }
        },
        {
          path: "warn",
          component: resolve => require(["@/components/warnMonitor"], resolve),
          meta: {
            crumbs: ["实时监测", "告警监测"],
            title: "油耗监测",
            index: 10,
            menu: "090302"
          }
        }
      ]
    },


  ]
});
// 每个页面 添加title
router.beforeEach((to, from, next) => {
  window.document.title = "设备管理系统/" + to.meta.title;
  next();
});
export default router;
