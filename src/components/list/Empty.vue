<!-- 空列表 -->

<template>
  <div class="sui-vue-empty">
    <div class="box">
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  }
};
</script>

<style lang="scss">
.sui-vue-empty {
  position: relative;
  height: 100%;
  min-height: 220px;

  .box {
    position: absolute;
    width: 128px;
    padding-top: 110px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #686868;
    font-size: 12px;
    text-align: center;
    background-image: url(../../images/empty.png);
    background-size: 100px;
    background-repeat: no-repeat;
    background-position: center top;
  }
}
</style>
