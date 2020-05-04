
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
export const corpDtails = data => fetch("corp", data, "post");
