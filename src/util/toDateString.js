import toDate from "./toDate";

/**
 * 日期格式化
 * @param dt 想要格式化的日期
 * @param pattern 格式化字符串，默认：yyyy-MM-dd
 */
export default function(dt, pattern) {
  dt = toDate(dt);
  if (!dt) {
    return "";
  }

  pattern = pattern || "yyyy-MM-dd";

  let month = dt.getMonth() + 1;
  let date = dt.getDate();
  let hours = dt.getHours();
  let minutes = dt.getMinutes();
  let seconds = dt.getSeconds();
  let millis = dt.getMilliseconds();
  let value = pattern.replace("yyyy", dt.getFullYear());

  if (/M/.test(value)) {
    value = value.replace(/MM/g, month < 10 ? `0${month}` : month);
    value = value.replace(/M/g, month);
  }
  if (/d/.test(value)) {
    value = value.replace(/dd/g, date < 10 ? `0${date}` : date);
    value = value.replace(/d/g, date);
  }
  if (/H/.test(value)) {
    value = value.replace(/HH/g, hours < 10 ? `0${hours}` : hours);
    value = value.replace(/H/g, hours);
  }
  if (/m/.test(value)) {
    value = value.replace(/mm/g, minutes < 10 ? `0${minutes}` : minutes);
    value = value.replace(/m/g, minutes);
  }
  if (/s/.test(value)) {
    value = value.replace(/ss/g, seconds < 10 ? `0${seconds}` : seconds);
    value = value.replace(/s/g, seconds);
  }
  if (/SSS/.test(value)) {
    value = value.replace(
      /SSS/g,
      millis < 10 ? `00${millis}` : millis < 100 ? `0${millis}` : millis
    );
  }

  if (/hh/.test(value)) {
    let val = (hours + 12) % 12;
    if (hours < 1) {
      val = "午夜" + val;
    } else if (hours >= 1 && hours < 5) {
      val = "凌晨" + val;
    } else if (hours >= 5 && hours < 6) {
      val = "清晨" + val;
    } else if (hours >= 6 && hours < 8) {
      val = "早上" + val;
    } else if (hours >= 8 && hours < 11) {
      val = "上午" + val;
    } else if (hours >= 11 && hours < 13) {
      val = "中午" + val;
    } else if (hours >= 13 && hours < 17) {
      val = "下午" + val;
    } else if (hours >= 17 && hours < 18) {
      val = "傍晚" + val;
    } else if (hours >= 18 && hours <= 23) {
      val = "晚上" + val;
    }
    value = value.replace(/hh/g, val);
  }

  return value;
}
