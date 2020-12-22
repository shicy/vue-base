/**
 * 读取本地文件，获取URL数据集
 * @param file 本地文件
 * @param callback 文件读取成功后回调，如：function (data) {}
 */
export default function(file, callback) {
  let reader = new FileReader();
  reader.onload = function(e) {
    if (typeof callback == "function") {
      callback(e.target.result);
    }
  };
  reader.readAsDataURL(file);
}
