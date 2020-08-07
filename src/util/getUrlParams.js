/**
 * 获取浏览器地址栏中的参数值
 * @param name 参数名称
 */
export default function(name) {
  let results = {};
  let params = location.search.substr(1).split("&");
  for (let i = 0; i < params.length; i++) {
    if (params[i]) {
      let param = params[i].split("=");

      let _name = param.shift();
      let _value = param.join("=");

      if (_name == name) {
        return _value;
      }
      results[_name] = _value;
    }
  }
  return !name ? results : null;
}
