import getKey from "./getKey";

/**
 * 对象集去重，原对象集不变，返回新的去重后的对象集
 * @param datas 想要去重的对象集
 * @param keyField 对象编号的属性名称
 */
export default function(datas, keyField) {
  let results = [];
  if (datas && datas instanceof Array) {
    let resultKeys = [];
    datas.forEach(data => {
      let key = getKey(data, keyField);
      let index = resultKeys.findIndex(t => t == key);
      if (index < 0) {
        results.push(data);
        resultKeys.push(key);
      }
    });
  }
  return results;
}
