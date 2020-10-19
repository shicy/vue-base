<!-- 等待组件 -->

<template>
  <div class="sui-vue-waiting">正在努力加载...</div>
</template>

<script>
import { Spin } from "view-design";

export default {
  show() {
    Spin.show();
  },

  hide() {
    Spin.hide();
  }
};
</script>

<style lang="scss"></style>
