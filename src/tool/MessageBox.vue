<!-- 消息提示框 -->

<script>
import { Message, Modal } from "view-design";
import { post as $post } from "./Request";

export default {
  confirm(title, content, api, params) {
    if (!content) {
      content = title;
      title = "提示";
    }
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: title || "提示",
        content: content,
        onOk: () => {
          if (api) {
            $post(api, params)
              .then(data => resolve(data))
              .catch(err => reject(err));
          } else {
            resolve();
          }
        },
        onCancel: () => {
          reject("cancel");
        }
      });
    });
  },

  error(value, closeHandler) {
    Message.error({
      content: value,
      duration: 5,
      closable: true,
      onClose: () => {
        if (typeof closeHandler == "function") {
          closeHandler();
        }
      }
    });
    return false;
  },

  success(value, closeHandler) {
    Message.success({
      content: value,
      closable: true,
      onClose: () => {
        if (typeof closeHandler == "function") {
          closeHandler();
        }
      }
    });
    return true;
  }
};
</script>
