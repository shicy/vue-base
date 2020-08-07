import hasProperty from "./hasProperty";

/**
 * 获取对象值
 * @param data 原始对象
 * @param keyField 值对应的属性名称，默认取值：id -> code
 */
export default function(data, keyField) {
  if (data) {
    if (keyField) {
      if (typeof keyField == "function") {
        return keyField(data);
      }
      return data[keyField];
    }
    if (hasProperty(data, "id")) {
      return data.id;
    }
    if (hasProperty(data, "code")) {
      return data.code;
    }
  }
  return data;
}
