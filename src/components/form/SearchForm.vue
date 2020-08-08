<!-- 查询表单 -->
<!-- 参数：datas: [{name, label, width, others..}] -->
<!-- by shicy 2020-08-07 -->

<template>
  <div class="sui-vue-searchform">
    <div class="search-items">
      <div
        v-for="(item, index) in searchItems"
        :key="index"
        class="search-item"
        :style="{ width: item.width }"
        :has-lbl="item.label"
      >
        <dl class="box">
          <dt v-if="item.label">{{ item.label }}</dt>
          <dd>
            <Input v-model="item.value" :placeholder="item.placeholder" />
          </dd>
        </dl>
      </div>
      <div class="search-btns">
        <div v-for="(item, index) in formButtons" :key="index" class="btn">
          <Button :type="item.type" @click="onButtonClickHandler(item)">
            {{ item.label }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: Array,
    buttons: Array
  },

  data() {
    return {
      searchItems: []
    };
  },

  mounted() {
    // this.initSearchItems();
  },

  watch: {
    datas: {
      immediate: true,
      handler() {
        this.initSearchItems();
      }
    }
  },

  computed: {
    formButtons() {
      let _buttons = [];
      if (this.buttons) {
        this.buttons.forEach(temp => {
          // temp = Object.assign({}, temp);
          _buttons.push(temp);
        });
      } else {
        _buttons.push({ name: "search", label: "查询", type: "primary" });
      }
      return _buttons;
    },
    formData() {
      let data = {};
      this.searchItems.forEach(item => {
        if (item.name && item.type != "line") {
          let value = item.value;
          if (typeof value == "string") {
            value = value.trim();
          }
          data[item.name] = value;
        }
      });
      return data;
    }
  },

  methods: {
    reset() {
      this.searchItems.forEach(item => {
        item.value = item.originValue;
      });
      // this.$emit("search", this.formData);
    },

    initSearchItems() {
      let items = [];
      if (this.datas && this.datas.length > 0) {
        this.datas.forEach(temp => {
          let item = Object.assign({}, temp);
          item.type = item.type || "input";
          item.width = parseInt(item.width) || null;
          item.width = item.width ? `${item.width}px` : "";
          item.value = item.value || null;
          item.values = item.values || null;
          item.originValue = item.value;
          items.push(item);
        });
      }
      this.searchItems = items;
    },

    onButtonClickHandler(item) {
      if (item.name == "search") {
        this.$emit("search", this.formData);
      } else if (item.name == "reset") {
        this.reset();
        this.$emit("reset", this.formData);
      } else if (item.name) {
        this.$emit(`btn_${item.name}`, this.formData);
      }
    }
  }
};
</script>

<style lang="scss">
.sui-vue-searchform {
  .search-item {
    display: inline-block;
    margin-left: 20px;

    &:first-child {
      margin-left: 0px;
    }

    > .box {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 200px;

      dt {
        flex: none;
        padding-right: 10px;
      }

      dd {
        flex: 1;
      }
    }
  }

  .search-btns {
    display: inline-block;
    margin-left: 30px;
  }
}
</style>
