import isMatch from "./isMatch";

/**
 * 查找对象
 * @param datas 原数据集
 * @param value 想要查找对象的值，或者一个回调方法：data => boolean
 * @param keyField 用来标记值的属性名称
 */
export default function(datas, value, keyField) {
  if (datas && datas instanceof Array) {
    for (let i = 0; i < datas.length; i++) {
      if (isMatch(datas[i], value, keyField)) {
        return datas[i];
      }
    }
  }
  return null;
}
