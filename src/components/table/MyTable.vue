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
        :stripe="showStripe"
      />
    </div>
    <div v-if="isPageVisible" class="pager">
      <Page
        :current="pageNo"
        :page-size="pageSize"
        :total="totalCount"
        :size="pageStyleInner"
        show-total
        show-elevator
        @on-change="onPageChangeHandler"
      />
    </div>
  </div>
</template>

<script>
import getKey from "../../util/getKey";
import debounceInstance from "../../util/debounceInstance";
import { get as $get, post as $post } from "../../tool/Request";
import OperColumn from "./OperColumn.vue";
import Checkbox from "../form/Checkbox.vue";

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
    // 是否显示多选框，默认false
    showChkbox: Boolean,
    // 是否多选
    multiple: Boolean,
    // 主键字段名称
    keyField: String,
    // 当前选中项
    selectedKeys: Array,
    // 斑马纹，默认false
    showStripe: Boolean,
    // 分页样式
    pageStyle: {
      type: String,
      default: () => "small"
    },
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

      allCheckedFlag: false,
      checkedRowKeys: [],

      loadingFlag: false,

      tableHeight: null,
      layoutTimerId: 0
    };
  },

  mounted() {
    this.initColumns();
    this.initCheckedKeys();
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
      immediate: true,
      handler() {
        this.initPageSize();
      }
    },
    showChkbox: {
      handler() {
        this.initColumns();
      }
    },
    selectedKeys: {
      handler() {
        this.initCheckedKeys();
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
    },
    pageStyleInner() {
      return this.pageStyle == "small" ? "small" : null;
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
        if (this.showChkbox) {
          _columns.push({
            key: "chk",
            width: 36,
            fixed: "left",
            renderHeader: this.chkboxHeaderRenderer,
            render: this.chkboxColumnRenderer
          });
        }
        if (this.columns && this.columns.length > 0) {
          this.columns.forEach(temp => {
            temp = Object.assign({}, temp);
            temp.width = parseInt(temp.width) || null;
            if (temp.resizable !== false && temp.width) {
              temp.resizable = true;
            }
            if (temp.key == "ops") {
              temp.align = temp.align || "right";
              temp.render = this.operColumnRenderer;
            }
            _columns.push(temp);
          });
        }
        this.showColumns = _columns;
      });
    },

    initCheckedKeys() {
      const selectedKeys = this.selectedKeys || [];
      for (let i = this.checkedRowKeys.length - 1; i >= 0; i--) {
        const value = this.checkedRowKeys[i];
        const index = selectedKeys.findIndex(t => t == value);
        if (index < 0) {
          this.checkedRowKeys.splice(i, 1);
        }
      }
      for (let i = 0; i < selectedKeys.length; i++) {
        const value = selectedKeys[i];
        const index = this.checkedRowKeys.findIndex(t => t == value);
        if (index < 0) {
          this.checkedRowKeys.push(value);
        }
      }
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

    chkboxHeaderRenderer(h) {
      // console.log("chkboxHeaderRenderer:", this.allCheckedFlag);
      return h(Checkbox, {
        props: {
          value: this.allCheckedFlag,
          halfCheck: this.checkedRowKeys.length > 0,
          disabled: !this.multiple
        },
        on: {
          change: e => {
            if (this.models.length > 0) {
              e.reject();
              this.setAllCheckedOrNot(!this.allCheckedFlag);
              this.$emit("change", this.checkedRowKeys);
            }
          }
        }
      });
    },

    chkboxColumnRenderer(h, params) {
      // console.log("chkboxColumnRenderer", params);
      let rowId = getKey(params.row);
      let checked = this.checkedRowKeys.findIndex(t => t == rowId) >= 0;
      // console.log("chkboxColumnRenderer:", rowId, checked);
      return h(Checkbox, {
        props: { value: checked },
        on: {
          change: e => {
            e.reject();
            this.setRowCheckedOrNot(rowId, !checked);
            this.$emit("change", this.checkedRowKeys);
          }
        }
      });
    },

    operColumnRenderer(h, params) {
      let data = params.row;
      let buttons = [];

      let column = params.column || {};
      if (column.opers) {
        if (typeof column.opers == "function") {
          buttons = column.opers(data) || [];
        } else if (column.opers instanceof Array) {
          buttons = buttons.concat(column.opers);
        }
      }

      if (buttons.length > 0) {
        return h(OperColumn, {
          props: { model: data, buttons: buttons, width: column.operWidth },
          on: {
            btnclick: name => {
              this.$emit("oper", name, data);
              this.$emit(`oper-${name}`, data);
            }
          }
        });
      }

      // return h("div");
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
      http(this.action, params, (err, datas, pageInfo) => {
        // console.log("==>MyTable:", err, datas, pageInfo);
        if (loadId == this.lastLoadId) {
          this.loadingFlag = false;

          let result = { datas: (!err ? datas : null) || [] };
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

    setAllCheckedOrNot(checked) {
      if (checked) {
        this.checkedRowKeys = this.models.map(t => getKey(t));
        this.allCheckedFlag = true;
      } else {
        if (this.checkedRowKeys.length > 0) {
          this.checkedRowKeys = [];
        }
        this.allCheckedFlag = false;
      }
    },

    setRowCheckedOrNot(rowId, checked) {
      const _checked = this.hasCheckedKey(rowId);
      // console.log("-----<<<", rowId, checked, this.multiple);
      if (this.multiple) {
        if (checked) {
          if (_checked) {
            return false;
          }
          this.checkedRowKeys.push(rowId);
          this.allCheckedFlag =
            this.checkedRowKeys.length == this.models.length;
        } else if (_checked) {
          this.removeCheckedKey(rowId);
          this.allCheckedFlag = false;
        } else {
          return false;
        }
      } else if (checked) {
        if (_checked) {
          return false;
        }
        this.checkedRowKeys = [rowId];
        this.allCheckedFlag = false;
      } else {
        this.allCheckedFlag = false;
        if (checked) {
          if (_checked) {
            return false;
          }
          this.checkedRowKeys = [rowId];
        } else if (_checked) {
          this.checkedRowKeys = [];
        } else {
          return false;
        }
      }
      return true;
    },

    onPageChangeHandler(page) {
      this.loadData(page);
    },

    hasCheckedKey(rowId) {
      for (let i = 0; i < this.checkedRowKeys.length; i++) {
        if (this.checkedRowKeys[i] == rowId) {
          return true;
        }
      }
      return false;
    },

    removeCheckedKey(rowId) {
      for (let i = this.checkedRowKeys.length - 1; i >= 0; i--) {
        if (this.checkedRowKeys[i] == rowId) {
          this.checkedRowKeys.splice(i, 1);
          return true;
        }
      }
      return false;
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
      padding-top: 0px;
      padding-bottom: 0px;
      font-weight: normal;
      overflow: visible;

      .ivu-table-cell {
        vertical-align: top;
        line-height: 20px;
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

  .ivu-table-stripe {
    td {
      border-bottom: 0px;
    }
  }

  .ivu-table-fixed {
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.3);

    &:before {
      display: none;
    }
  }

  .ivu-table-fixed-right {
    box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, 0.3);

    &:before {
      display: none;
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

    .ivu-page-item {
      border-radius: 2px;
    }

    .ivu-page-prev {
      border-radius: 2px;
    }

    .ivu-page-next {
      border-radius: 2px;
    }

    .ivu-page-options-elevator {
      input {
        text-align: center;
        border-radius: 2px;
      }
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
