/**
 * 判断对象是否包含属性
 * @param data 参与判断的对象
 * @param name 想要判断的属性名称
 */
export default function(data, name) {
  if (data && name) {
    return Object.prototype.hasOwnProperty.call(data, name);
  }
  return false;
}
