import getKey from "./getKey";

/**
 * 判断对象是否匹配
 * @param data 参与判断的对象
 * @param value 想要查找对象的值，或者一个回调方法：data => boolean
 * @param keyField 用来标记值的属性名称
 */
export default function(data, value, keyField) {
  if (typeof data == "undefined") {
    return typeof value == "undefined";
  }
  if (data === null) {
    return value === null;
  }
  if (data === "") {
    return value === "";
  }
  if (data === 0) {
    return value === 0;
  }
  if (typeof value == "function") {
    return value(data, keyField) === true;
  }
  return getKey(data, keyField) == value;
}
