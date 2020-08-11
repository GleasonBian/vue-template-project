// 引入 封装请求
import fetch from "../public/fetch.js";
/**
 * 作用: getData.js 用于请求的集中管理
 * 假设: 你的项目 有100个接口 我们需要把这 100个接口进行集中管理
 */

//获取公司列表
export const getCompList = data => fetch("corp", data, "get");
//新增部门 saveAddDept
export const saveAddDept = data => fetch("dept", data, "post");
//获取部门列表
export const getDeptList = data => fetch("dept", data, "get");
//获取部门详情
export const getDeptDetail = data => fetch("dept", data, "get");
//编辑部门详情
export const editDeptDetail = data => fetch("dept", data, "put");
//删除部门 delDept
export const delDept = data => fetch("dept", data, "delete");
//删除部门 delDept
export const deptPage = data => fetch("depts", data, "get");

//获取人员列表
export const getStaffList = data => fetch("staff", data, "get");
//获取人员列表
export const staffPage = data => fetch("staffs", data, "get");
//获取人员详情
export const getStaffDetail = data => fetch("staff", data, "get");
//新增人员
export const saveAddStaff = data => fetch("staff", data, "post");
//编辑人员详情
export const editStaffDetail = data => fetch("staff", data, "put");
//删除人员 delDept
export const delStaff = data => fetch("staff", data, "delete");

//获取角色列表 getRoleList
export const getRoleList = data => fetch("role", data, "get");
//获取角色列表 分页
export const rolePage = data => fetch("roles", data, "get");
//获取角色详情
export const getRoleDetail = data => fetch("role", data, "get");
//新增角色
export const saveAddRole = data => fetch("role", data, "post");
//编辑角色详情
export const editRoleDetail = data => fetch("role", data, "put");
//删除角色 delDept
export const delRole = data => fetch("role", data, "delete");

/**
 * 公司列表
 */
export const corpSelect = data => fetch("corp", data, "get");

/**
 * 创建公司
 */
export const corperation = data => fetch("corp", data, "post");

/**
 * 查看公司详细信息
 */
export const corpDtails = data => fetch("corp", data, "get");

/**
 * 更新公司信息
 */
export const corpUpdate = data => fetch("corp", data, "put");

/**
 * 删除公司
 */
export const corpDelete = data => fetch("corp", data, "delete");

/**
 * 创建设备
 */
export const equiSelectAll = data => fetch("equipments", data, "get");

/**
 * 创建设备
 */
export const equiCreate = data => fetch("equipment", data, "post");

/**
 * 设备列表
 */
export const equiSelect = data => fetch("equipment", data, "get");

/**
 * 更新设备
 */
export const equiUpdate = data => fetch("equipment", data, "put");

/**
 * 设备详情
 */
export const equiDetails = data => fetch("equipment", data, "get");

/**
 * 删除设备
 */
export const equiDelete = data => fetch("equipment", data, "delete");

/**
 * 创建维修计划
 */
export const fixCreate = data => fetch("fixplan", data, "post");

/**
 * 维修计划列表
 */
export const fixSelect = data => fetch("fixplan", data, "get");

/**
 * 更新维修计划
 */
export const fixUpdate = data => fetch("fixplan", data, "put");

/**
 * 删除维修计划
 */
export const fixDelete = data => fetch("fixplan", data, "delete");

/**
 * 计划列表
 */
export const fixDetails = data => fetch("fixplan", data, "get");

/**
 * 创建加油计划
 */
export const oilCreate = data => fetch("oilplan", data, "post");

/**
 * 加油计划列表
 */
export const oilSelect = data => fetch("oilplan", data, "get");


/**
 * 更新加油计划
 */
export const oilUpdate = data => fetch("oilplan", data, "put");

/**
 * 删除加油计划
 */
export const oilDelete = data => fetch("oilplan", data, "delete");

/**
 * 加油计划详情
 */
export const oilDetails = data => fetch("oilplan", data, "get");

/**
 * 创建维修任务
 */
export const fixdeCreate = data => fetch("fixdetail", data, "post");

/**
 * 维修任务列表
 */
export const fixdeSelect = data => fetch("fixdetail", data, "get");

/**
 * 维修任务详情
 */
export const fixdeDetail = data => fetch("fixdetail", data, "get");

/**
 * 更新维修任务
 */
export const fixdeUpdate = data => fetch("fixdetail", data, "put");

/**
 * 维修任务开始
 */
export const fixTaskStart = data => fetch("fixdetail/start", data, "put");

/**
 * 维修任务结束
 */
export const fixTaskStop = data => fetch("/fixdetail/stop", data, "put");

/**
 * 维修任务删除
 */
export const fixdeDelete = data => fetch("fixdetail", data, "delete");

/**
 * 创建加油任务
 */
export const oildeCreate = data => fetch("oildetail", data, "post");

/**
 * 加油任务列表
 */
export const oildeSelect = data => fetch("oildetail", data, "get");

/**
 * 加油任务详情
 */
export const oildeDetail = data => fetch("oildetail", data, "get");

/**
 * 更新加油任务
 */
export const oildeUpdate = data => fetch("oildetail", data, "put");

/**
 * 加油任务删除
 */
export const oildeDelete = data => fetch("oildetail", data, "delete");

/**
 * 加油任务开始
 */
export const oilTaskStart = data => fetch("oildetail/start", data, "put");

/**
 * 加油任务结束
 */
export const oilTaskStop = data => fetch("oildetail/stop", data, "put");

/**
 * 更新调度计划
 */
export const assignUpdate = data => fetch("assignment", data, "put");


/**
 * 调度计划详情
 */
export const assignDetails = data => fetch("assignment", data, "get");


/**
 * 调度任务列表
 */
export const assigndeSelect = data => fetch("assigndetail", data, "get");


/**
 * 调度任务详情
 */
export const assigndeDetail = data => fetch("assigndetail", data, "get");
/**
 * 新增调度
 */
export const assignoffline = data => fetch("assignoffline", data, "post");
/**
 * 调度列表
 */
export const assignList = data => fetch("assignoffline", data, "get");
/**
 * 调度列表删除
 */
export const assignDelete = data => fetch("assignoffline", data, "delete");
/**
 * 调度详情
 */
export const viewAssign = data => fetch("assignoffline", data, "get");
/**
 * 调度更新
 */
export const editAssign = data => fetch("assignoffline", data, "put");

/**
 * 调度报表 - 油总核算
 */
export const allCollect = data => fetch("statis", data, "get");

/**
 * 调度报表 - 油单个核算
 */
export const singleCollect = data => fetch("statis", data, "get");

/**
 * 单机油耗核算
 */
export const singleOil = data => fetch("oilreport", data, "get");

/**
 * 登录
 */
export const login = data => fetch("login", data, "post");

/**
 * 设备概览
 */
export const overview = data => fetch("overview", data, "get");

/**
 * 预警监测
 */
export const oilView = data => fetch("equip", data, "get");

/**
 * 油耗监测
 */
export const equip = data => fetch("equip", data, "get");

/**
 * 单车油耗
 */
export const EquipmentSummary = data => fetch("equipsummary", data, "get");

/**
 * 单车油耗
 */
export const equipsummaryAll = data => fetch("equipsummary/all", data, "get");

/**
 * 报警监测 id 传 报警id
 */
export const alarm = data => fetch("alarm", data, "get");

/**
 * 报警监测 id 传 报警id
 */
export const alarmHandle = data => fetch("alarm", data, "put");

/**
 * 报警监测 id 传 报警id
 */
export const history = data => fetch("history", data, "get");

/**
 * 维修新增
 */
export const newFixPlan = data => fetch("offlinefix", data, "post");
/**
 * 维修申请回显
 */
export const fixPlanDetail = data => fetch("offlinefix", data, "get");
/**
 * 维修申请编辑
 */
export const editFix = data => fetch("offlinefix", data, "put");

/**
 * 维修新增
 */
export const fixList = data => fetch("fixdetail", data, "get");

/**
 * 维修任务新增
 */
export const fixTask = data => fetch("fixreport", data, "post");


/* -----------------------加油申请 -------------------------------*/

/**
 * 作业管理 / 加油申请 / 创建
 */
export const refuelCreate = data => fetch("refuel", data, "post");

/**
 * 作业管理 / 加油申请 / 列表 !id
 */
export const refuelList = data => fetch("refuel", data, "get");

/**
 * 作业管理 / 加油申请 / 详情 id
 */
export const refuelDetail = data => fetch("refuel", data, "get");

/**
 * 作业管理 / 加油申请 / 删除 id
 */
export const refuelDelete = data => fetch("refuel", data, "delete");

/**
 * 作业管理 / 加油申请 / 更新 id
 */
export const refuelUpdate = data => fetch("refuel", data, "put");


/* -----------------------车辆保养 -------------------------------*/

/**
 * 作业管理 / 车辆保养 / 创建 !id
 */
export const repairCreat = data => fetch("repaircreat", data, "post");

/**
 * 作业管理 / 车辆保养 / 列表 
 */
export const repairList = data => fetch("repairlist", data, "get");

/**
 * 作业管理 / 车辆保养 / 详情 id
 */
export const repairDetail = data => fetch("repaircheck", data, "get");

/**
 * 作业管理 / 车辆保养 / 更新 id
 */
export const repairUpdate = data => fetch("repairupdate", data, "put");

/**
 * 作业管理 / 车辆保养 / 删除 id
 */
export const repairDelete = data => fetch("repairdel", data, "delete");


/**
 * 公司分页查询
 */
export const allCorpList = data => fetch("corps", data, "get");

/**
 * 公司按级别查询
 */
export const corpRank = data => fetch("corprank", data, "get");

/**
 * 车辆管理 / 邮箱 / 创建
 */
export const tankCreate = data => fetch("tanks", data, "post");

/**
 * 车辆管理 / 邮箱 / 列表
 */
export const tankList = data => fetch("tanks", data, "get");

/**
 * 车辆管理 / 邮箱 / 列表
 */
export const ComeOnTag = data => fetch("adjusthistory", data, "put");

/**
 * 车辆管理 / 邮箱 / 加油标的列表
 */
export const getOilMark = data => fetch("adjusthistory", data, "get");


/* ----------------------- 电子围栏 -------------------------------*/

/**
 * 车辆管理 / 电子围栏 / 创建多边形围栏
 */
export const fencesPoly = data => fetch("fences/poly", data, "post");

/**
 * 车辆管理 / 电子围栏 / 创建圆形围栏
 */
export const fencesRound = data => fetch("fences/round", data, "post");

/**
 * 车辆管理 / 电子围栏 / 查询围栏
 */
export const fences = data => fetch("fences", data, "get");

/**
 * 车辆管理 / 电子围栏 / 删除围栏
 */
export const fencesDelete = data => fetch("fences", data, "delete");


/* ------------------------图片上传-------------------------------- */

export const uploadImages = data => fetch("upload/images", data, "form");

/* ------------------------车辆分类-------------------------------- */

/**
 * 车辆管理 / 车辆创建 / 车辆分类
 */
export const classify = data => fetch("classify", data, "get");

/**
 * 车辆管理 / 车辆创建 / 车辆类型
 */
export const classifyId = data => fetch("classify", data, "get");

/* ------------------------告警-------------------------------- */

/**
 * 消息 / 设备消息
 */
export const equipAlarm = data => fetch("equip", data, "get");

/**
 * 消息 / 历史消息
 */
export const alarms = data => fetch("alarms", data, "get");