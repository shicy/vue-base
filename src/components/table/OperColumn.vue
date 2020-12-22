<!-- 操作列渲染 -->

<template>
  <div class="sui-vue-col-oper" :style="{ width: operWidth }">
    <div
      v-for="(item, index) in showButtons"
      :key="index"
      :class="{ op: true, line: item.type == 'line' }"
      :style="{ width: item.width }"
      :disabled="item.disabled"
    >
      <a
        v-if="item.type != 'line'"
        class="box"
        @click="onItemClickHandler(item)"
      >
        <i v-if="item.icon" class="ic" :style="item.icon">&nbsp;</i>
        <span class="txt">{{ item.label }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: Object,
    buttons: Array,
    width: Number
  },

  data() {
    return {};
  },

  computed: {
    showButtons() {
      let _buttons = [];
      if (this.buttons && this.buttons.length > 0) {
        this.buttons.forEach(temp => {
          if (temp) {
            if (typeof temp == "string") {
              temp = { name: temp, label: temp };
            }
            temp = Object.assign({}, temp);
            temp.width = this.formatWidth(temp.width);
            temp.disabled = !!temp.disabled;
            if (temp.icon === true) {
              temp.icon = "background-image: none";
            } else if (temp.icon) {
              temp.icon = `background-image: url(${temp.icon})`;
            }
            _buttons.push(temp);
          }
        });
      }
      return _buttons;
    },

    operWidth() {
      return this.formatWidth(this.width);
    }
  },

  methods: {
    onItemClickHandler(item) {
      if (!item.disabled) {
        if (typeof item.handler == "function") {
          item.handler(this.model, item.name);
        }
        this.$emit("btnclick", item.name, this.model);
      }
    },

    formatWidth(value) {
      if (value) {
        if (!isNaN(value)) {
          return value + "px";
        }
        return value;
      }
      return "";
    }
  }
};
</script>

<style lang="scss">
.sui-vue-col-oper {
  line-height: 20px;

  .op {
    display: inline-block;
    height: 100%;
    margin-left: 10px;

    &:first-child {
      margin-left: 0px;
    }
  }

  .op.line {
    display: block;
    height: 0px;
    margin-left: 0px;
  }

  .box {
    display: block;
    height: 100%;
    text-decoration: none;

    .ic {
      display: inline-block;
      width: 16px;
      height: 100%;
      margin-right: 2px;
      vertical-align: top;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 16px;
    }

    .txt {
      display: inline-block;
      vertical-align: top;
    }
  }

  .op[disabled] {
    cursor: not-allowed;

    .box {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>
