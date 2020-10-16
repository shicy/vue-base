<!-- 按钮栏 -->

<template>
  <div class="sui-vue-buttonbar">
    <div v-for="(item, index) in buttons" :key="index" class="item">
      <Button
        :name="item.name"
        :type="item.type"
        :disabled="item.disabled"
        @click="onBtnClickHandler(item)"
      >
        <i v-if="item.icon" class="ic" :style="item.icon" />
        <span class="txt">{{ item.label }}</span>
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
          data.disabled = !!data.disabled;
          if (data.icon === true) {
            data.icon = "background-image: none";
          } else if (data.icon) {
            data.icon = `background-image: url(${data.icon})`;
          }
          _buttons.push(data);
        });
      }
      return _buttons;
    }
  },

  methods: {
    onBtnClickHandler(item) {
      if (!item.disabled) {
        if (typeof item.handler == "function") {
          item.handler();
        }
        this.$emit("btnclick", item.name, item);
        this.$emit(`btn-${item.name}`, item);
      }
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
