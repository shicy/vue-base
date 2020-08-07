import find from "./find";
import hasProperty from "./hasProperty";

/**
 * 查找对象集，获取某个对象相应的属性值，并判断如果值不存在返回指定的默认值
 * @param datas 参与查找的对象集
 * @param key 想要查找的对象编号，也可以是一个回调方法：(data) => boolean
 * @param keyField 对象编号的属性名称，默认：id -> code
 * @param valueField 想要获取的对象属性名称，默认：name
 * @param defaultValue 当获取的值不存在（undefined, null, ""）时，想要返回的默认值
 */
export default function(datas, key, keyField, valueField, defaultValue) {
  let data = find(datas, key, keyField);
  if (data) {
    if (typeof valueField == "function") {
      valueField = valueField(data, key, keyField);
    }
    valueField = valueField || "name";
    if (hasProperty(data, valueField)) {
      let value = data[valueField];
      if (value || value == 0) {
        return value;
      }
    }
  }
  if (typeof defaultValue == "function") {
    return defaultValue(data, key, keyField, valueField);
  }
  return defaultValue;
}
