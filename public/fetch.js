// public/fetch.js

var qs = require("qs");
import axios from "axios";
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.headers.put['Content-Type'] = "application/json";
// baseurl 就是 在 .env.development 和 .env.development.local 中 预设的域名
console.log(process.env.VUE_APP_URL); // => 'https://api.apiopen.top/'
let baseurl =
  process.env.VUE_APP_TITLE === "local" // 通过判断 当前的环境变量 得知 项目 运行在 本地 或者 线上
    ? process.env.VUE_APP_PROXY // 本地 使用代理 => '/dev' 此处在 vue.config.js 中代理请求处有配置
    : process.env.VUE_APP_URL; // 线上 使用域名 => 'https://api.apiopen.top/'
console.info("baseurl", baseurl);
axios.defaults.baseURL = baseurl; // 将 baseurl 设置为 axios 的默认 baseURL
/**
 * 下面 是 axios 封装的 请求
 * 采用 es6 promise 和 async await 方式
 */
export default async (url = "", data = {}, type = "POST") => {
  type = type.toUpperCase();
  /**
   * get 请求
   */
  if (type == "GET") {
    //请求参数 拼接字符串
    // let dataStr = "";
    // Object.keys(data).forEach(key => {
    //   dataStr += key + "/" + data[key] + "&";
    // });
    // console.log(dataStr);
    // if (dataStr !== "") {
    //   dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
    //   url = url + "?" + dataStr;
    // }
    data.id ? url = url + '/' + data.id : url = url;

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  /**
   * post 请求
   */
  if (type == "POST") {
    return new Promise((resolve, reject) => {
      console.log(data)
      data = JSON.stringify(data);
      console.log(data);
      axios
        .post(url, data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  if (type == "PUT") {
    data.id ? url = url + '/' + data.id : url = url;
    return new Promise((resolve, reject) => {
      data = JSON.stringify(data.data || data);
      axios
        .put(url, data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  if (type == "DELETE") {
    data.id ? url = url + '/' + data.id : url = url;
    return new Promise((resolve, reject) => {
      data = JSON.stringify(data.data);
      axios
        .delete(url, data)
        .then(res => {
          console.log(res)
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
};
