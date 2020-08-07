/**
 * 获取页面中某个元素的位置信息
 * @param elem 想要获取位置信息的元素
 * @return { top, left, width, height }
 */
export default function(elem) {
  if (!elem) {
    return null;
  }
  let offset = { top: 0, left: 0 };
  if (elem.getBoundingClientRect) {
    let rect = elem.getBoundingClientRect();
    offset.left = rect.left;
    offset.top = rect.top;
    // offset.right = rect.right;
    // offset.bottom = rect.bottom;
    offset.width = rect.width;
    offset.height = rect.height;

    offset.left += window.pageXOffset - document.documentElement.clientLeft;
    offset.top += window.pageYOffset - document.documentElement.clientTop;
  } else {
    offset.width = elem.clientWidth;
    offset.height = elem.clientHeight;
  }
  return offset;
}
