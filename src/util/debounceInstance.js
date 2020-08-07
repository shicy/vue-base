import debounce from "./debounce";

let debounceId = 1;

/**
 * 防抖动方法的增强版
 */
export default function() {
  let name = "vue-base_debounce-" + debounceId++;
  return function(handler, delay) {
  	debounce(name, handler, delay);
  };
}
