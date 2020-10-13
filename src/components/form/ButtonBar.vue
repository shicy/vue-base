<!-- 按钮栏 -->

<template>
  <div class="sui-vue-buttonbar">
    <div v-for="(item, index) in buttons" :key="index" class="item">
      <Button :name="item.name" :type="item.type">
        <i
          v-if="item.icon"
          class="ic"
          :style="`background-image: url(${item.icon})`"
        /><span class="txt">{{ item.label }}</span>
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: Array
  },

  computed: {
    buttons() {
      let _buttons = [];
      if (this.datas && this.datas.length > 0) {
        this.datas.forEach(data => {
          if (typeof data == "string") {
            data = { name: data, label: data };
          }
          if (!data.label) {
            data.label = data.text || data.title || data.name || "" + data;
          }
          _buttons.push(data);
        });
      }
      return _buttons;
    }
  }
};
</script>

<style lang="scss">
.sui-vue-buttonbar {
  .item {
    display: inline-block;
    margin-left: 10px;

    &:first-child {
      margin-left: 0px;
    }
  }

  .ivu-btn {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ic {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: top;
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .txt {
    display: inline-block;
    line-height: 20px;
  }
}
</style>
