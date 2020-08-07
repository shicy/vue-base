// 转成日期对象
export default function(value) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    value = value.replace(/(-|\.)/g, "/");
    let time = Date.parse(value);
    return isNaN(time) ? null : new Date(time);
  }

  if (typeof value == "number" && !isNaN(value)) {
    return new Date(value);
  }

  return null;
}
