/**
 * 将对象集转化为树型结构
 * @param datas 原对象集
 * @param keyField 对象编号对应的属性名称，默认：id
 * @param parentField 对象上级编号对应的属性名称，默认：parentId
 */
export default function(datas, keyField, parentField) {
  let results = [];
  if (datas && datas.length > 0) {
    keyField = keyField || "id";
    parentField = parentField || "parentId";
    datas.forEach(data => {
      delete data.children;
    });
    datas.forEach(data => {
      let _pid = data[parentField];
      if (!_pid) {
        results.push(data);
      } else {
        let pData = datas.find(temp => {
          return temp[keyField] == _pid;
        });
        if (pData) {
          if (!pData.children) {
            pData.children = [];
          }
          pData.children.push(data);
        }
      }
    });
  }
  return results;
}
