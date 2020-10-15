<!-- 列表页面 -->

<template>
  <div class="sui-vue-listview">
    <div v-if="isTopBarVisible" class="topbar">
      <div v-if="isSearchBarVisible" class="searchbar">
        <SearchForm :datas="searchs" />
      </div>
      <div v-if="isButtonBarVisible" class="buttonbar">
        <ButtonBar :datas="buttons" />
      </div>
    </div>
    <div class="listview">
      <MyTable
        :action="action"
        :params="params"
        :method="method"
        :columns="columns"
        :size="size"
        :head-height="headHeight"
        :row-height="rowHeight"
        :empty-text="emptyText"
        :auto-load="autoLoad"
      />
    </div>
  </div>
</template>

<script>
import MyTable from "../table/MyTable.vue";
import SearchForm from "../form/SearchForm.vue";
import ButtonBar from "../form/ButtonBar.vue";

export default {
  components: { MyTable, SearchForm, ButtonBar },
  props: {
    // 查询接口
    action: String,
    // 默认查询参数，默认是get
    params: Object,
    // 接口请求方式
    method: String,
    // 列定义
    columns: Array,
    // 列表查询配置项
    searchs: Array,
    // 列表上面的按钮配置项
    buttons: Array,
    // 分页大小，默认为20，可以是“auto”自动根据视图计算分页大小
    size: String,
    // 表头高度，用于计算分页大小，默认为32
    headHeight: Number,
    // 行高度，用于计算分页大小，默认为40
    rowHeight: Number,
    // 空文本提示
    emptyText: String,
    // 是否自动加载，默认为true
    autoLoad: {
      type: Boolean,
      default: () => true
    }
  },

  data() {
    return {};
  },

  computed: {
    isTopBarVisible() {
      return this.isSearchBarVisible || this.isButtonBarVisible;
    },

    isSearchBarVisible() {
      return this.searchs && this.searchs.length > 0;
    },

    isButtonBarVisible() {
      return this.buttons && this.buttons.length > 0;
    }
  }
};
</script>

<style lang="scss">
.sui-vue-listview {
  display: flex;
  flex-direction: column;
  height: 100%;

  > .topbar {
    flex: none;
    min-height: 32px;
    padding-bottom: 10px;

    .buttonbar {
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }

  > .listview {
    flex: 1;
  }
}
</style>
