import isMatch from "./isMatch";

/**
 * 从树型结构中查找对象
 * @param datas 一个树型对象集
 * @param value 想要查找对象的值，或者一个回调方法：data => boolean
 * @param keyField 用来标记值的属性名称
 */
export default function(datas, value, keyField) {
  return findInner(datas, value, keyField);
}

function findInner(datas, value, keyField) {
  if (datas && datas instanceof Array) {
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i];
      if (isMatch(data, value, keyField)) {
        return data;
      }
      data = findInner(data.children, value, keyField);
      if (data) {
        return data;
      }
    }
  }
  return null;
}
