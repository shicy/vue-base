import isMatch from "./isMatch";

/**
 * 判断对象集中是否存在某对象
 * @param datas 参与查找的对象集
 * @param value 想要查找对象的值，或者一个回调方法：data => boolean
 * @param keyField 对象编号的属性名称，默认：id -> code
 */
export default function(datas, value, keyField) {
  if (datas && datas instanceof Array) {
    for (let i = 0; i < datas.length; i++) {
      if (isMatch(datas[i], value, keyField)) {
        return true;
      }
    }
  }
  return false;
}
