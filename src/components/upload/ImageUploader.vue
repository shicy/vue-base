<!-- 图片上传组件 -->

<template>
  <div class="sui-vue-imageuploader" :multi="multiple" :fixed="fix">
    <div v-if="!isEmpty" class="previews">
      <div v-for="(item, index) in models" :key="index" class="item">
        <img v-if="item.url" :src="item.url" />
        <div class="ops">
          <div class="op prev" @click="onOperPrevHandler(index)"></div>
          <div class="op next" @click="onOperNextHandler(index)"></div>
          <div class="op del" @click="onOperDelHandler(index)"></div>
        </div>
      </div>
    </div>
    <div v-if="isUploadVisible" class="upload-view">
      <Upload
        :action="uploadUrl"
        :data="params"
        accept="image/*"
        :show-upload-list="false"
        :before-upload="onUploadBeforeHandler"
      >
        <div class="uploadbtn"></div>
      </Upload>
    </div>
  </div>
</template>

<script>
import fileToDataUrl from "../../util/fileToDataUrl";

let localId = 1;

export default {
  props: {
    // 上传接口
    action: String,
    // 上传参数
    params: Object,
    // 图片信息
    images: Array,
    // 是否支持多图片上传
    multiple: Boolean,
    // 百分百布局
    fix: Boolean
  },

  data() {
    return {
      models: [],
      deleteIds: []
    };
  },

  computed: {
    isEmpty() {
      return !this.models.length;
    },

    isUploadVisible() {
      return this.multiple || this.isEmpty;
    },

    uploadUrl() {
      return this.action || "";
    }
  },

  methods: {
    upload() {
      return Promise.reject("error");
    },

    onUploadBeforeHandler(file) {
      // console.log("==>", file);
      if (!this.multiple) {
        if (this.models[0] && this.models[0].id) {
          this.deleteIds.push(this.models[0].id);
        }
        this.models = [];
      }

      let model = { localId: localId++, file: file };
      this.models.push(model);
      fileToDataUrl(file, dataUrl => {
        model.url = dataUrl;
        this.models = [].concat(this.models);
      });

      return new Promise(resolve => {
        model.uploadHandler = resolve;
      });
    },

    onOperDelHandler(index) {
      this.models.splice(index, 1);
    },

    onOperPrevHandler(index) {
      let model = this.models[index];
      this.models.splice(index, 1);
      this.models.splice(index - 1, 0, model);
    },

    onOperNextHandler(index) {
      let model = this.models[index];
      this.models.splice(index, 1);
      this.models.splice(index + 1, 0, model);
    }
  }
};
</script>

<style lang="scss">
.sui-vue-imageuploader {
  display: inline-block;
  position: relative;
  margin-bottom: -10px;

  .previews {
    display: inline;

    .item {
      display: inline-block;
      position: relative;
      vertical-align: top;
      width: 64px;
      height: 64px;
      margin-right: 10px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 3px;
      overflow: hidden;

      img {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .ops {
      display: none;
      position: absolute;
      width: 40px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 0px;
      text-align: center;
    }

    .op {
      display: inline-block;
      vertical-align: top;
      width: 16px;
      height: 16px;
      margin: 1px;
      border: 1px solid #fff;
      border-radius: 2px;
      background-color: #eee;
      background-size: 10px;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.65;
      cursor: pointer;
    }

    .op:hover {
      opacity: 1;
    }

    .op.del {
      background-image: url(../../images/001.png);
    }
    .op.prev {
      background-image: url(../../images/002.png);
    }
    .op.next {
      background-image: url(../../images/003.png);
    }

    .item:first-child {
      .op.prev {
        display: none;
      }
    }

    .item:last-child {
      .op.next {
        display: none;
      }
    }

    .item:hover {
      .ops {
        display: block;
      }
    }
  }

  .upload-view {
    display: inline-block;
    vertical-align: top;
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
  }

  .uploadbtn {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #fafafa;
    cursor: pointer;

    &:after {
      content: "";
      position: absolute;
      width: 50%;
      height: 50%;
      left: 50%;
      top: 50%;
      background-image: url(../../images/000.png);
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      transform: translate(-50%, -50%);
      opacity: 0.1;
    }
  }

  .ivu-upload {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.sui-vue-imageuploader[fixed] {
  width: 100%;
  height: 100%;
  margin-bottom: 0px;

  .previews {
    display: block;
    width: 100%;
    height: 100%;

    .item {
      width: 100%;
      height: 100%;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }

  .upload-view {
    display: block;
    width: 100%;
    height: 100%;
    margin-bottom: 0px;
  }
}
</style>
