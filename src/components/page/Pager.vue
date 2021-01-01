<!-- 分页 -->

<template>
  <div class="sui-vue-pager">
    <div class="pager-btns">
      <button class="first" :disabled="isFirst" @click="onFirstClick">
        <span>首页</span>
      </button>
      <button class="prev" :disabled="isFirst" @click="onPrevClick">
        <span>上一页</span>
      </button>
      <div class="pages">
        <button v-if="hasLess" @click="onLessClick">
          <span>...</span>
        </button>
        <button
          v-for="item in showPages"
          :key="item"
          :selected="item == pageNo"
          @click="onPageBtnClick(item)"
        >
          <span>{{ item }}</span>
        </button>
        <button v-if="hasMore" @click="onMoreClick">
          <span>...</span>
        </button>
      </div>
      <button class="next" :disabled="isLast" @click="onNextClick">
        <span>下一页</span>
      </button>
      <button class="last" :disabled="isLast" @click="onLastClick">
        <span>尾页</span>
      </button>
    </div>
    <div class="pager-status">
      <span>前往第</span>
      <span class="goto">
        <input
          v-model="gotoPage"
          type="text"
          @keydown="onPageInputKeydown"
          @blur="onPageInputBlur"
        />
        <span class="count">/{{ pageCount }}</span>
      </span>
      <span>页</span>
      <span>，共{{ totalSize }}条</span>
    </div>
  </div>
</template>

<script>
import { isControlKey, isNumberKey } from "@scyui/vue-base";

export default {
  props: {
    // 当前页
    page: Number,
    // 分页大小
    size: Number,
    // 总记录数
    total: Number,
    // 显示个数
    nums: Number
  },

  data() {
    return {
      showStart: -1,
      gotoPage: ""
    };
  },

  watch: {
    page() {
      this.showStart = -1;
    },

    size() {
      this.showStart = -1;
    },

    total() {
      this.showStart = -1;
    },

    nums() {
      this.showStart = -1;
    }
  },

  computed: {
    pageNo() {
      return parseInt(this.page) || 1;
    },

    pageSize() {
      return parseInt(this.size) || 20;
    },

    pageCount() {
      return Math.ceil(this.totalSize / this.pageSize);
    },

    totalSize() {
      return parseInt(this.total) || 0;
    },

    isFirst() {
      return this.pageNo == 1;
    },

    isLast() {
      return this.pageNo == this.pageCount;
    },

    hasLess() {
      return this.showPages[0] > 1;
    },

    hasMore() {
      let pages = this.showPages;
      return pages[pages.length - 1] < this.pageCount;
    },

    showCount() {
      return Math.max(0, parseInt(this.nums)) || 10;
    },

    showPageStart() {
      if (this.showStart > 0 && this.showStart < this.pageCount) {
        return this.showStart;
      }

      let page = this.pageNo - Math.floor(this.showCount / 2);
      if (page + this.showCount - 1 > this.pageCount) {
        page = this.pageCount - this.showCount + 1;
      }
      if (page < 1) {
        page = 1;
      }

      return page;
    },

    showPages() {
      let pages = [];
      let page = this.showPageStart;
      for (let i = 0; i < this.showCount; i++) {
        pages.push(page++);
        if (page > this.pageCount) {
          break;
        }
      }
      return pages;
    }
  },

  methods: {
    onPageBtnClick(page) {
      this.$emit("change", page, this.pageSize);
    },

    onFirstClick() {
      this.$emit("change", 1, this.pageSize);
    },

    onPrevClick() {
      this.$emit("change", this.pageNo - 1, this.pageSize);
    },

    onNextClick() {
      this.$emit("change", this.pageNo + 1, this.pageSize);
    },

    onLastClick() {
      this.$emit("change", this.pageCount, this.pageSize);
    },

    onLessClick() {
      let startPage = this.showPageStart - this.showCount;
      this.showStart = Math.max(1, startPage);
    },

    onMoreClick() {
      let startPage = this.showPageStart + this.showCount;
      this.showStart = Math.min(startPage, this.pageCount);
    },

    onPageInputKeydown(e) {
      if (e.which == 13) {
        let page = parseInt(this.gotoPage) || 0;
        if (page < 1 || page > this.pageCount) {
          this.gotoPage = "";
        } else if (page != this.pageNo) {
          this.$emit("change", page, this.pageSize);
        }
      } else if (!isControlKey(e) && !isNumberKey(e)) {
        e.preventDefault();
      }
    },

    onPageInputBlur() {
      let page = parseInt(this.gotoPage) || 0;
      if (page < 1 || page > this.pageCount) {
        this.gotoPage = "";
      } else if (page != this.pageNo) {
        this.$emit("change", page, this.pageSize);
      }
    }
  }
};
</script>

<style lang="scss">
.sui-vue-pager {
  margin: 10px 0px;
  text-align: center;

  .pager-btns {
    display: inline-block;

    button {
      height: 32px;
      padding: 0px 10px;
      margin: 0px 1px;
      color: #787878;
      border: 1px solid #ddd;
      border-radius: 2px;
      background-color: #fff;
      outline: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #f3f3f3;
    }

    button:active {
      background-color: #eee;
    }

    button[disabled] {
      color: #d6d6d6;
      border-color: #e0e0e0;
      background-color: #f3f3f3;
      cursor: not-allowed;
    }

    .pages {
      display: inline-block;
      padding: 0px 3px;

      button {
        min-width: 32px;
        padding: 0px 5px;
      }

      button[selected] {
        color: #000;
        border-bottom: 1px solid #000;
      }
    }
  }

  .pager-status {
    display: inline-block;
    margin-left: 10px;
    line-height: 32px;

    input {
      width: 40px;
      height: 18px;
      line-height: 16px;
      text-align: center;
      border: 0px;
      border-bottom: 1px solid #ccc;
      outline: none;
    }
  }
}
</style>
