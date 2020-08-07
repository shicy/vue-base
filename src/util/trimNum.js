/**
 * 格式化数字，删除数字后面的.00
 * @param value 一个数字
 * @param decimals 小数点位数
 */
export default function(value, decimals) {
  let _value = parseFloat(value);
  if (isNaN(_value)) {
    return "";
  }
  decimals = parseInt(decimals);
  if (isNaN(decimals) || decimals < 0) {
    decimals = 2;
  }
  let temp = _value.toFixed(decimals);
  return /\./.test(temp) ? temp.replace(/\.?0*$/, "") : temp;
}
