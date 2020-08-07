/**
 * 删除字符串前后空白符
 * @param value 原字符串
 */
export default function(value) {
  if (value || value === 0 || value === false) {
    if (typeof value != "string") {
      value = "" + value;
    }
    return value.trim();
  }
  return "";
}
