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
      <MyTable :columns="columns" />
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
    columns: Array,
    searchs: Array,
    buttons: Array
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
