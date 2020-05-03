//=======================================================================
// @Date: 2020-05-03 20:14:44
// @LastEditTime: 2020-05-03 21:16:55
// @Version: 7.0
// @Author: Johnson.Wen
// @Editor: Johnson.Wen
// @Mobile: 13311005499
// @Email: 13311005499@189.cn
// @Comment: 
//=======================================================================
// 引入 封装请求
import fetch from "../public/fetch.js";
/**
 * 作用: getData.js 用于请求的集中管理
 * 假设: 你的项目 有100个接口 我们需要把这 100个接口进行集中管理
 */

/**
 * 获取最新 消息
 */
// export const getWangYiNews = data => fetch("getWangYiNews", data, "get");

/**
 * 获取最新 消息
 */
export const getWangYiNews = data => fetch("corp", data, "get");
