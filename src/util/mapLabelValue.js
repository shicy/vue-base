/**
 * 对象映射，返回由{ label, value }组成的新数组
 * @param datas 原始对象集
 * @param labelField 属性label对应的原始属性名称，默认：name
 * @param valueField 属性value对应的原始属性名称，默认：id
 */
export default function(datas, labelField, valueField) {
  if (datas && datas instanceof Array) {
    labelField = labelField || "name";
    valueField = valueField || "id";
    return datas.map(temp => {
      return { label: temp[labelField], value: temp[valueField] };
    });
  }
  return [];
}
