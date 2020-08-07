import trimNum from "./trimNum";

/**
 * 格式化文件大小，获取简化易读的文件大小
 * @param value 文件大小
 */
export default function(value) {
  value = parseFloat(value);
  if (!value) {
    return "0B";
  }
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
  for (let i = 0; i < sizes.length; i++) {
    if (value < 1024) {
      return trimNum(value, 2) + sizes[i];
    }
    value = parseFloat(value / 1024);
  }
  return trimNum(value) + "YB";
}
