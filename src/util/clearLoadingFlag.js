/**
 * 清除（对话框）加载标志
 * @param context 组件实例
 * @param field 加载标志属性名称，默认为 loadingFlag
 */
export default function(context, field) {
  field = field || "loadingFlag";
  setTimeout(() => {
    context[field] = false;
    setTimeout(() => {
      context[field] = true; // 还原
    });
  });
}
