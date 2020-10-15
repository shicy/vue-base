<!-- 自定义表格 -->
<!-- by shicy 2020-08-07 -->

<template>
  <div
    class="sui-vue-mytable"
    :show-pager="isPageVisible"
    :is-loading="loadingFlag"
  >
    <div ref="listView" class="listview">
      <Table
        :height="tableHeight"
        :columns="showColumns"
        :data="models"
        :loading="loadingFlag"
        :no-data-text="emptyText"
      />
    </div>
    <div v-if="isPageVisible" class="pager">
      <Page
        :current="pageNo"
        :page-size="pageSize"
        :total="totalCount"
        size="small"
        show-total
        show-elevator
        @on-change="onPageChangeHandler"
      />
    </div>
  </div>
</template>

<script>
import { debounceInstance } from "@scyui/vue-base";
import { $get, $post } from "@scyui/vue-base";

export default {
  props: {
    // 数据接口
    action: String,
    // 接口查询参数
    params: Object,
    // 请求方式：get, post，默认为get
    method: String,
    // 表格列定义
    columns: Array,
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
    return {
      models: [],
      pageInfo: { page: 1, total: 0 },
      showColumns: [],

      loadingFlag: false,

      tableHeight: null,
      layoutTimerId: 0
    };
  },

  mounted() {
    this.initColumns();
    this.startAutoLayout();
    if (this.autoLoad !== false) {
      setTimeout(() => {
        this.refresh();
      }, 100);
    }
  },

  beforeDestroy() {
    this.stopAutoLayout();
  },

  watch: {
    action: {
      handler() {
        if (this.autoLoad !== false) {
          this.refresh();
        }
      }
    },
    params: {
      handler() {
        if (this.autoLoad !== false) {
          this.refresh();
        }
      }
    },
    columns: {
      handler() {
        this.initColumns();
      }
    },
    size: {
      // immediate: true,
      handler() {
        this.initPageSize();
      }
    }
  },

  computed: {
    pageNo() {
      return parseInt(this.pageInfo.page) || 1;
    },
    pageSize() {
      return parseInt(this.pageInfo.size) || 20;
    },
    pageCount() {
      if (this.totalCount > 0) {
        return Math.ceil(this.totalCount / this.pageSize);
      }
      return 0;
    },
    totalCount() {
      return parseInt(this.pageInfo.total) || 0;
    },
    isPageVisible() {
      return this.pageCount > 1;
    }
  },

  methods: {
    refresh() {
      if (!this.refreshDebounce) {
        this.refreshDebounce = debounceInstance();
      }
      this.refreshDebounce(() => {
        this.models = [];
        this.pageInfo.page = 1;
        this.pageInfo.total = 0;
        this.loadData(1);
      }, 50);
    },

    reload() {
      this.loadData(this.pageNo);
    },

    initColumns() {
      if (!this.columnDebounce) {
        this.columnDebounce = debounceInstance();
      }
      this.columnDebounce(() => {
        let _columns = [];
        if (this.columns && this.columns.length > 0) {
          this.columns.forEach(temp => {
            temp = Object.assign({}, temp);
            temp.width = parseInt(temp.width) || null;
            if (temp.resizable !== false && temp.width) {
              temp.resizable = true;
            }
            _columns.push(temp);
          });
        }
        this.showColumns = _columns;
      });
    },

    initPageSize() {
      if (this.size == "auto") {
        let height = parseInt(this.tableHeight) || 0;
        height -= parseInt(this.headHeight) || 32; // 表头高度
        height -= this.isPageVisible ? 0 : 60; // 分页
        if (height > 0) {
          let rowHeight = parseInt(this.rowHeight) || 40;
          this.pageInfo.size = Math.floor(height / rowHeight);
          return;
        }
      }
      this.pageInfo.size = parseInt(this.size) || 20;
    },

    startAutoLayout() {
      this.stopAutoLayout();
      this.layoutTimerId = setInterval(() => {
        let listView = this.$refs.listView;
        let height = listView && listView.clientHeight;
        if (height && height != this.tableHeight) {
          this.tableHeight = height;
          this.initPageSize();
        }
      }, 100);
    },

    stopAutoLayout() {
      if (this.layoutTimerId) {
        clearInterval(this.layoutTimerId);
        this.layoutTimerId = 0;
      }
    },

    loadData(page, callback) {
      if (!this.action) {
        return;
      }

      let params = this.getLoadParams();
      if (params === false) {
        return;
      }
      params.page = page;
      params.size = this.pageSize;

      this.models = [];
      this.loadingFlag = true;
      let loadId = (this.lastLoadId = Date.now());
      this.lastLoadCallback = callback;

      let http = this.method == "post" ? $post : $get;
      http(this.action, params, (err, data, pageInfo) => {
        // console.log("==>", err, data, pageInfo);
        if (loadId == this.lastLoadId) {
          this.loadingFlag = false;

          let result = { datas: (!err ? data : null) || [] };
          this.$emit("loaded", result);
          this.models = result.datas || [];

          this.pageInfo.page = page;
          this.pageInfo.total = (pageInfo && pageInfo.total) || 0;

          if (!this.models.length && page > 1) {
            this.loadData(page - 1, this.lastLoadCallback);
          } else if (callback) {
            callback();
          }
        }
      });
    },

    getLoadParams() {
      let params = {};
      if (this.params) {
        params = Object.assign(params, this.params);
      }
      this.$emit("load-before", params);
      if (params.__canceled__) {
        params = false;
      }
      return params;
    },

    onPageChangeHandler(page) {
      this.loadData(page);
    }
  }
};
</script>

<style lang="scss">
.sui-vue-mytable {
  height: 100%;

  .ivu-table {
    &:before {
      display: none;
    }

    th {
      height: 32px;
      padding-top: 6px;
      padding-bottom: 4px;
      font-weight: normal;
      overflow: visible;

      .ivu-table-cell {
        vertical-align: top;
        line-height: 21px;
      }
    }

    td {
      height: 40px;
      border-bottom: 1px solid #f6f6f6;
    }

    tr:last-child td {
      border-bottom: 0px;
    }

    .ivu-table-cell {
      padding-left: 10px;
      padding-right: 10px;
    }

    .ivu-table-header-resizable:before {
      content: "";
      position: absolute;
      height: 16px;
      left: 5px;
      top: 50%;
      margin-top: -8px;
      border-left: 1px solid rgba(0, 0, 0, 0.15);
    }
  }

  .listview {
    height: 100%;
  }

  .pager {
    position: absolute;
    height: 60px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding-top: 10px;
    text-align: center;
    border-top: 1px solid #eee;

    .ivu-page {
      display: inline-block;
    }
  }
}
.sui-vue-mytable[show-pager] {
  padding-bottom: 60px;
}
.sui-vue-mytable[is-loading] {
  .ivu-table {
    .ivu-table-tip {
      display: none;
    }
  }
}
</style>
