<!-- 页面加载进度 -->

<script>
import { LoadingBar } from "view-design";

let isLoading = false;
let lastLoadingTimerId = 0;

export default {
  start(force) {
    if (!isLoading || force) {
      LoadingBar.start();
      isLoading = true;

      if (lastLoadingTimerId) {
        clearTimeout(lastLoadingTimerId);
      }

      lastLoadingTimerId = setTimeout(() => {
        lastLoadingTimerId = 0;
        LoadingBar.finish();
        isLoading = false;
      }, 5000);
    }
  },

  finish() {
    if (isLoading) {
      LoadingBar.finish();
      isLoading = false;
    }

    if (lastLoadingTimerId) {
      clearTimeout(lastLoadingTimerId);
      lastLoadingTimerId = 0;
    }
  },

  error() {
    if (isLoading) {
      LoadingBar.error();
      isLoading = false;
    }

    if (lastLoadingTimerId) {
      clearTimeout(lastLoadingTimerId);
      lastLoadingTimerId = 0;
    }
  },

  percent(value) {
    LoadingBar.update(value);
  }
};
</script>
