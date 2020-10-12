<!-- 页面加载进度 -->

<script>
let isLoading = false;
let lastLoadingTimerId = 0;

export default {
  start(context, force) {
    if (!isLoading || force) {
      context.$Loading.start();
      isLoading = true;

      if (lastLoadingTimerId) {
        clearTimeout(lastLoadingTimerId);
      }

      lastLoadingTimerId = setTimeout(() => {
        lastLoadingTimerId = 0;
        context.$Loading.finish();
        isLoading = false;
      }, 5000);
    }
  },

  finish(context) {
    if (isLoading) {
      context.$Loading.finish();
      isLoading = false;
    }

    if (lastLoadingTimerId) {
      clearTimeout(lastLoadingTimerId);
      lastLoadingTimerId = 0;
    }
  },

  error(context) {
    if (isLoading) {
      context.$Loading.error();
      isLoading = false;
    }

    if (lastLoadingTimerId) {
      clearTimeout(lastLoadingTimerId);
      lastLoadingTimerId = 0;
    }
  },

  percent(context, value) {
    context.$Loading.update(value);
  }
};
</script>
