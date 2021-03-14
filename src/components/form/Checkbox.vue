<!-- 复选框 -->

<template>
  <div
    class="sui-vue-checkbox"
    :checked="checked"
    :half="halfCheck"
    :disabled="disabled"
    @click="onClick"
  >
    <i></i><span v-if="label">{{ label }}</span>
  </div>
</template>

<script>
import MyEvent from "../../tool/MyEvent";

export default {
  props: {
    // 是否选择
    value: Boolean,
    // 显示文本
    label: String,
    // 半选状态
    halfCheck: Boolean,
    // 禁用
    disabled: Boolean
  },

  data() {
    return {
      checked: this.value
    };
  },

  watch: {
    value(newval) {
      this.checked = newval;
    }
  },

  methods: {
    onClick() {
      if (!this.disabled) {
        MyEvent.call(this, "change", !this.checked, 0)
          .then(() => {
            this.checked = !this.checked;
            this.$emit("input", this.checked);
            this.$emit("changed", this.checked);
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss">
.sui-vue-checkbox {
  display: inline-block;
  position: relative;
  min-height: 16px;
  vertical-align: text-bottom;
  padding-left: 16px;
  cursor: pointer;

  i {
    position: absolute;
    width: 14px;
    height: 14px;
    left: 1px;
    top: 50%;
    margin-top: -7px;
    border: 1px solid #ddd;
    border-radius: 2px;
    background-color: #fff;
    box-sizing: border-box;
  }

  span {
    display: inline-block;
    margin-left: 5px;
  }
}
.sui-vue-checkbox[half] {
  i:before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    left: 50%;
    top: 50%;
    margin-top: -4px;
    margin-left: -4px;
    border-radius: 1px;
    background-color: #aaa;
  }
}
.sui-vue-checkbox[checked] {
  i:before {
    content: "";
    position: absolute;
    width: 6px;
    height: 2px;
    left: 1px;
    top: 7px;
    margin: 0px;
    border-radius: 3px;
    background-color: #333;
    transform: rotate(45deg) scale(0.7);
    transform-origin: center;
  }

  i:after {
    content: "";
    position: absolute;
    width: 12px;
    height: 2px;
    top: 5px;
    right: -2px;
    border-radius: 3px;
    background-color: #333;
    transform: rotate(-55deg) scale(0.7);
    transform-origin: center;
  }
}
.sui-vue-checkbox[disabled] {
  pointer-events: none;

  i {
    background-color: #eee;
    opacity: 0.65;
  }

  span {
    color: #c0c0c0;
  }
}
</style>
