// 自定义事件

export default function(name, data, timeout) {
  let event = { name: name, data: data };

  if (timeout === true) {
    timeout = 5000;
  } else if (timeout && timeout != "always") {
    timeout = parseInt(timeout) || 0;
  } else if (timeout !== false && timeout !== 0) {
    if (this.$listeners[name]) {
      if (timeout == "always") {
        timeout = 60 * 60 * 1000;
      } else {
        timeout = 60 * 1000;
      }
    }
  }

  return new Promise((resolve, reject) => {
    let timerId = 0;
    let hasComplete = false;

    let complete = () => {
      if (timerId > 0) {
        clearTimeout(timerId);
        timerId = 0;
      }
      hasComplete = true;
    };

    event.resolve = () => {
      if (!hasComplete) {
        complete();
        resolve();
      }
    };
    event.reject = error => {
      if (!hasComplete) {
        complete();
        reject(error);
      }
    };

    this.$emit(name, event);

    if (!hasComplete) {
      if (timeout > 0) {
        timerId = setTimeout(() => {
          timerId = 0;
          event.reject("timeout");
        }, timeout);
      } else {
        event.resolve();
      }
    }
  });
}
