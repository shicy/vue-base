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
        <div v-if="item.progress >= 0" class="progress">
          <div class="bar" :style="{ width: `${item.progress}%` }"></div>
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
        :on-progress="onUploadProgressHandler"
        :on-success="onUploadSuccessHandler"
        :on-error="onUploadErrorHandler"
      >
        <div class="uploadbtn"></div>
      </Upload>
    </div>
  </div>
</template>

<script>
import { Message } from "@scyui/vue-base";
import MyEvent from "../../tool/MyEvent";
import fileToDataUrl from "../../util/fileToDataUrl";

let localId = 1;

let ImageUploader = {
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
    fix: Boolean,
    // 自动上传
    auto: Boolean
  },

  data() {
    return {
      models: [],
      deleteIds: [],

      currentUploadModel: null,
      currentUploadCompleteHandler: null
    };
  },

  mounted() {
    this.doInit();
  },

  watch: {
    images() {
      this.doInit();
    }
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
    doInit() {
      let models = this.images || [];
      this.models = JSON.parse(JSON.stringify(models));
    },

    upload() {
      if (!this.uploadUrl) {
        return Promise.reject({ code: 410, errmsg: "未知上传接口" });
      }

      if (this.isEmpty) {
        return Promise.reject({ code: 411, errmsg: "没有图片信息" });
      }

      return this.doUpload();
    },

    getImageIds() {
      let imageIds = [];
      this.models.forEach(temp => {
        if (temp.id) {
          imageIds.push(temp.id);
        }
      });
      return imageIds;
    },

    getDeleteIds() {
      return this.deleteIds;
    },

    onUploadBeforeHandler(file) {
      // console.log("==>", file);
      let model = { localId: localId++, file: file, progress: -1 };
      this.models.push(model);
      fileToDataUrl(file, dataUrl => {
        model.url = dataUrl;
        this.models = [].concat(this.models);
      });

      return new Promise(resolve => {
        model.uploadHandler = resolve;

        if (this.auto) {
          this.doOneUpload(model, err => {
            if (err) {
              Message.error(err.errmsg);
            } else {
              this.$emit("success", model.id);
            }
          });
        }
      });
    },

    onUploadProgressHandler(e) {
      let percent = parseFloat(e.percent) || 0;
      this.currentUploadModel.progress = Math.min(98, percent);
    },

    onUploadSuccessHandler(result) {
      if (result && result.code == 200) {
        (model => {
          setTimeout(() => {
            model.progress = -1; // 重置
          }, 5000);
        })(this.currentUploadModel);

        if (this.currentUploadCompleteHandler) {
          this.currentUploadCompleteHandler(false, result.data);
        }
      } else if (this.currentUploadCompleteHandler) {
        if (!result) {
          result = { code: 500 };
        }
        result.errmsg = result.msg || "上传失败！";
        this.currentUploadCompleteHandler(result);
      }
    },

    onUploadErrorHandler(e) {
      if (this.currentUploadCompleteHandler) {
        let error = { code: e.status, errmsg: e.message };
        this.currentUploadCompleteHandler(error);
      }
    },

    onOperDelHandler(index) {
      let model = this.models[index];
      MyEvent.call(this, "oper-del", model, "always").then(() => {
        if (model.id) {
          this.deleteIds.push(model.id);
        }
        this.models.splice(index, 1);
      });
    },

    onOperPrevHandler(index) {
      let model = this.models[index];
      MyEvent.call(this, "oper-prev", model).then(() => {
        this.models.splice(index, 1);
        this.models.splice(index - 1, 0, model);
      });
    },

    onOperNextHandler(index) {
      let model = this.models[index];
      MyEvent.call(this, "oper-next", model).then(() => {
        this.models.splice(index, 1);
        this.models.splice(index + 1, 0, model);
      });
    },

    doUpload() {
      return new Promise((resolve, reject) => {
        let loop = index => {
          if (index < this.models.length) {
            let model = this.models[index];
            if (model.uploadHandler) {
              this.doOneUpload(model, err => {
                if (err) {
                  reject(err);
                } else {
                  loop(index + 1);
                }
              });
            } else {
              loop(index + 1);
            }
          } else {
            resolve({
              imageIds: this.getImageIds(),
              deleteIds: this.getDeleteIds()
            });
          }
        };
        loop(0);
      });
    },

    doOneUpload(model, callback) {
      model.progress = 0; // 开始进度条
      this.currentUploadModel = model;
      this.currentUploadCompleteHandler = (err, ret) => {
        // console.log("-->", err, ret);
        if (err) {
          callback(err);
        } else {
          if (ret) {
            model.id = ret.uuid || ret.id;
            model.url = ret.url || model.url;
          }
          delete model.uploadHandler;
          callback(false, ret);
        }
      };
      model.uploadHandler();
    }
  }
};

ImageUploader.NO_API = 410;
ImageUploader.EMPTY = 411;

export default ImageUploader;
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
      opacity: 0.75;
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

  .progress {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 1px 0px;
    background-color: rgba(255, 255, 255, 0.85);

    .bar {
      width: 0px;
      height: 1px;
      background-color: #038dfb;
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
