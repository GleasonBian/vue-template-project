
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

//获取人员列表
export const getStaffList = data => fetch("staff", data, "get");
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
 * 创建调度计划
 */
export const assignCreate = data => fetch("assignment", data, "post");

/**
 * 调度计划列表
 */
export const assignSelect = data => fetch("assignment", data, "get");

/**
 * 更新调度计划
 */
export const assignUpdate = data => fetch("assignment", data, "put");

/**
 * 删除调度计划
 */
export const assignDelete = data => fetch("assignment", data, "delete");

/**
 * 调度计划详情
 */
export const assignDetails = data => fetch("assignment", data, "get");

/**
 * 创建调度任务
 */
export const assigndeCreate = data => fetch("assigndetail", data, "post");

/**
 * 调度任务列表
 */
export const assigndeSelect = data => fetch("assigndetail", data, "get");

/**
 * 更新调度任务
 */
export const assigndeUpdate = data => fetch("assigndetail", data, "put");

/**
 * 更新调度任务开始
 */
export const assigndeStart = data => fetch("assigndetail/start", data, "put");

/**
 * 更新调度任务结束
 */
export const assigndeStop = data => fetch("assigndetail/stop", data, "put");

/**
 * 删除调度任务
 */
export const assigndeDelete = data => fetch("assigndetail", data, "delete");

/**
 * 调度任务详情
 */
export const assigndeDetail = data => fetch("assigndetail", data, "get");
