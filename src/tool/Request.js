/**
 * Http请求自定义
 * Created by shicy 2020-08-07
 */

import QueryString from "querystring";
import axios from "axios";

export function get(url, params, callback) {
  return doRequest("get", url, params, callback);
}

export function post(url, params, callback) {
  return doRequest("post", url, params, callback);
}

///////////////////////////////////////////////////////////
function doRequest(method, url, params, callback) {
  if (!/get|post/.test(method)) {
    method = "get";
  }
  if (method == "get" && params) {
    params = QueryString.stringify(params);
    if (params) {
      url += (/\?/.test(url) ? "&" : "?") + params;
    }
    params = null;
  }
  url += (/\?/.test(url) ? "&" : "?") + "_t=" + Date.now();

  if (typeof callback == "function") {
    doRequestInner(method, url, params, (err, data, pageInfo, response) => {
      callback(err, data, pageInfo, response);
    });
  } else {
    return new Promise((resolve, reject) => {
      doRequestInner(method, url, params, (err, data, pageInfo, response) => {
        if (err) {
          let errmsg = err.msg || err;
          reject({ errmsg, err, code: err.code, data, response });
        } else {
          let result = { data, response };
          if (pageInfo) {
            result.datas = data;
            result.pageInfo = pageInfo;
          }
          resolve(result);
        }
      });
    });
  }
}

function doRequestInner(method, url, params, callback) {
  console.log("request: ", method, url, params);
  let options = { method, url, data: params };
  axios(options)
    .then(response => {
      console.log("==>", response);
      let result = doResponseSuccess(response);
      callback(false, result.data, result.pageInfo, response);
    })
    .catch(response => {
      response = response.response || response;
      let result = doResponseError(response);
      callback(result.err, result.data, null, response);
    });
}

function doResponseSuccess(response) {
  console.log(response);
}

function doResponseError(response) {
  console.error(response, response.status);
  if (response.status == 404 || /network error/i.test(response.statusText)) {
    return { code: 404, msg: "网络错误！", data: response.data };
  }
  let result = response.data || {};
  let error = {};
  error.code = result.code || response.status || 1;
  error.msg = result.msg || response.message || "出错了!_!";
  return { err: error, data: result.data || null };
}
