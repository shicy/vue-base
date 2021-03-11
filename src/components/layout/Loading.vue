<!-- 正在加载 -->

<template>
  <div class="sui-vue-loading" :fix="fix">
    <div class="msgbox">
      <div class="icon"></div>
      <div v-if="message" class="msg">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

let currentInstance = null;

const Loading = {
  props: {
    message: String,
    fix: Boolean
  },

  create(options) {
    options = options || {};
    currentInstance = new Vue({
      render: h => {
        return h(Loading, {
          props: {
            message: options.message,
            fix: options.fix
          }
        });
      }
    }).$mount();
    document.body.appendChild(currentInstance.$el);

    return {
      hide() {
        currentInstance.$destroy();
        document.body.removeChild(currentInstance.$el);
        currentInstance = null;
      }
    };
  }
};

export default Loading;
</script>

<style lang="scss">
.sui-vue-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.25);

  .msgbox {
    position: absolute;
    min-width: 72px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 64px 20px 10px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.85);

    .icon {
      position: absolute;
      width: 32px;
      height: 32px;
      left: 50%;
      top: 20px;
      margin-left: -16px;
      border: 3px solid #ddd;
      border-top-color: #8f2d56;
      border-radius: 100px;
      animation: animation_loading_circle 1s infinite;
    }
  }

  .msg {
    max-width: 150px;
    line-height: 20px;
    text-align: center;
  }
}
.comp-loading[fix] {
  position: fixed;
  z-index: 9999;
}
</style>
