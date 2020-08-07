const debounceTimers = {};

/**
 * 防抖动延迟执行方法
 * @param name 防抖标志，防止同时多个防抖方法冲突，可选
 * @param handler 执行方法
 * @param delay 延迟时间，默认为0
 */
export default function(name, handler, delay) {
  if (typeof name == "function") {
    delay = handler;
    handler = name;
    name = "";
  }

  let _name = name ? "" + name : "_default";
  let timerId = parseInt(debounceTimers[_name]);
  if (timerId) {
    clearTimeout(timerId);
    delete debounceTimers[_name];
  }

  if (typeof handler == "function") {
    timerId = setTimeout(() => {
      delete debounceTimers[_name];
      handler();
    }, parseInt(delay) || 0);
    debounceTimers[_name] = timerId;
  }
}
