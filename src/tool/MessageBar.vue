<!-- 消息提示框 -->

<script>
import { Message } from "view-design";

export default {
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
