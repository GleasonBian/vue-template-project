
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


//获取角色列表 getRoleList
export const getRoleList = data => fetch("role", data, "get");


/**
 * 公司查询
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
