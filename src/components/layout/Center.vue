<!-- 居中视图 -->

<template>
  <div class="sui-vue-center">
    <div class="center-table">
      <div class="center-cell">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.sui-vue-center {
  width: 100%;
  height: 100%;
  overflow: auto;

  > .center-table {
    display: table;
    width: 100%;
    height: 100%;

    > .center-cell {
      display: table-cell;
      width: 100%;
      vertical-align: middle;
      text-align: center;

      > * {
        text-align: initial;
      }
    }
  }
}
</style>
