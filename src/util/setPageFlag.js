/**
 * 设置分页标记
 */

export default function(datas, page, total) {
  if (datas && datas.length > 0) {
    page = parseInt(page) || 1;
    total = parseInt(total) || 0;

    if (page == 1) {
      datas[0]._isFirst = true;
    }

    if (page * datas.length <= total) {
      datas[datas.length - 1]._isLast = true;
    }
  }
}
