import isMatch from "./isMatch";

/**
 * 删除对象集中的某个或某些对象，返回被删除的对象集
 * @param datas 原始对象集
 * @param value 相应删除对象的编号，也可以是一个回调方法：(data) => boolean
 * @param keyField 对象编号的属性名称，默认：id -> code
 */
export default function(datas, value, keyField) {
  let removed = [];
  if (datas && datas instanceof Array) {
    for (let i = datas.length - 1; i >= 0; i--) {
      if (isMatch(datas[i], value, keyField)) {
        removed.unshift(datas.splice(i, 1)[0]);
      }
    }
  }
  return removed;
}
