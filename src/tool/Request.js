/**
 * Http请求自定义
 * Created by shicy 2020-08-07
 */

import QueryString from "querystring";
import axios from "axios";
import { Message } from "view-design";
import config from "../config";

let beforeHandlers = [];
let afterHandlers = [];
let formatHandlers = [];

export function get(url, params, callback) {
  return doRequest("get", url, params, callback);
}

export function post(url, params, callback) {
  return doRequest("post", url, params, callback);
}

export function before(handler) {
  beforeHandlers.push(handler);
  return {
    remove: () => {
      removeHandler(beforeHandlers, handler);
    }
  };
}

export function after(handler) {
  afterHandlers.push(handler);
  return {
    remove: () => {
      removeHandler(afterHandlers, handler);
    }
  };
}

export function format(handler) {
  formatHandlers.push(handler);
  return {
    remove: () => {
      removeHandler(formatHandlers, handler);
    }
  };
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
      if (callback(err, data, pageInfo, response) !== false) {
        if (err) {
          showErrorMsg(err.msg || err);
        }
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      doRequestInner(method, url, params, (err, data, pageInfo, response) => {
        if (!err) {
          let result = { data, response };
          if (pageInfo) {
            result.datas = data;
            result.pageInfo = pageInfo;
          }
          resolve(result);
        } else {
          let isPreventDefault = false;
          let result = { err, code: err.code, data, response };
          result.errmsg = err.msg || err;
          result.preventDefault = function() {
            isPreventDefault = true;
          };
          reject(result);
          setTimeout(() => {
            if (!isPreventDefault) {
              showErrorMsg(result.errmsg);
            }
          }, 100);
        }
      });
    });
  }
}

function showErrorMsg(errmsg) {
  Message.error({ content: errmsg, duration: 6 });
}

function doRequestInner(method, url, params, callback) {
  // console.log("request: ", method, url, params);
  let options = { method, url, data: params };
  doRequestBefore(options)
    .then(() => {
      axios(options)
        .then(response => {
          if (
            Object.prototype.hasOwnProperty.call(config.request, "successCode")
          ) {
            let code = response && response.data && response.data.code;
            if (code != config.request.successCode) {
              return Promise.reject(response);
            }
          }
          response.data = doRequestFormat(url, params, response.data);
          let result = doResponseSuccess(url, params, response);
          callback(false, result.data, result.pageInfo, response);
          return result;
        })
        .catch(response => {
          response = response.response || response;
          response.data = doRequestFormat(url, params, response.data);
          let result = doResponseError(response);
          callback(result.err, result.data, null, response);
          return result;
        })
        .then(result => {
          doRequestAfter(options, result);
        });
    })
    .catch(err => {
      callback(err || "canceled");
    });
}

function doRequestBefore(options) {
  return new Promise((resolve, reject) => {
    let handlers = [].concat(beforeHandlers);
    let loop = index => {
      if (index < handlers.length) {
        let temp = handlers[index](options);
        if (temp && temp instanceof Promise) {
          temp
            .then(() => {
              loop(index + 1);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          loop(index + 1);
        }
      } else {
        resolve();
      }
    };
    loop(0);
  });
}

function doRequestAfter(options, result) {
  let handlers = [].concat(afterHandlers);
  let loop = index => {
    if (index < handlers.length) {
      let temp = handlers[index](options, result);
      if (temp && temp instanceof Promise) {
        temp
          .then(() => {
            loop(index + 1);
          })
          .catch(() => {
            loop(index + 1);
          });
      } else {
        loop(index + 1);
      }
    }
  };
  loop(0);
}

function doRequestFormat(url, params, result) {
  formatHandlers.forEach(handler => {
    let data = handler(url, params, result);
    if (typeof data != "undefined") {
      result = data;
    }
  });
  return result;
}

function doResponseSuccess(url, params, response) {
  // console.log(response);
  let result = response.data || {};
  return { data: result.data, msg: result.msg, pageInfo: result.pageInfo };
}

function doResponseError(response) {
  console.warn(response);
  let error = {};
  if (response.status == 404) {
    error = { code: 404, msg: "网络错误！" };
    return { err: error, data: response.data };
  } else if (/(network|internal).*error/i.test(response.statusText)) {
    error = { code: response.status, msg: response.data };
    return { err: error, data: response.data };
  }
  let result = response.data || {};
  error.code = result.code || response.status || 1;
  error.msg = result.msg || response.message || "出错了!_!";
  return { err: error, data: result.data || null };
}

function removeHandler(allHandlers, handler) {
  for (let i = allHandlers.length - 1; i >= 0; i--) {
    if (allHandlers == handler) {
      allHandlers.splice(i, 1);
      break;
    }
  }
}
