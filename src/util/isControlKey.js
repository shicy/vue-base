/**
 * 判断是否控制按键
 */

// Backspace, “左”, "上", “右”, "下", F5, tab, Ctrl, shift, enter, CapsLock
let keys = [8, 37, 38, 39, 40, 116, 9, 17, 16, 13, 20];

export default function(e) {
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    return true;
  }
  return keys.indexOf(e.which) >= 0;
}
