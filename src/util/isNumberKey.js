/**
 * 判断是否为数字按键
 */

export default function(e) {
  if (e.shiftKey) {
    return false;
  }
  if (e.which >= 48 && e.which <= 57) {
    return true; // 0 - 9
  }
  if (e.which >= 96 && e.which <= 105) {
    return true; // 小键盘0 - 9
  }
  // if (e.which == 190 || e.which == 110) {
  //   return true; // “.”, 小键盘“.”
  // }
  // if (e.which === 189 || e.which === 109) {
  //   return true; // “-”, 小键盘“-”
  // }
  return false;
}
