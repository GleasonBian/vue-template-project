<template>
  <div>
    <el-divider content-position="left">{{title}}</el-divider>
    <el-upload
      :action="baseurl+serverUrl"
      name="image"
      accept="image/*"
      :multiple="true"
      list-type="picture-card"
      :limit="5"
      :on-preview="PictureCardPreview"
      :on-remove="imageListRemove"
      :on-exceed="handleExceed"
      :before-upload="ImageListUploadBefore"
      :on-success="ImageListUploadsuccess"
      ref="childMultiple"
      :class="(propsImage.length + imageList.length)>=5?'UploadImgTrue':'UploadImgFalse'"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">{{tip}}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" width="30%" :modal-append-to-body="false">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "multipleImageUpload",
  components: {},
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      serverUrl: "upload/images", // 图片上传 接口
      baseurl:
        process.env.VUE_APP_TITLE === "local"
          ? process.env.VUE_APP_PROXY
          : process.env.VUE_APP_URL,
      fileList: [],
      imageList: [],
      propsFlag: true,
    };
  },
  computed: {},
  props: {
    title: {
      default: "多图上传",
      type: String,
    },
    tip: {
      default:
        "请上传 jpg,jpeg, png, gif 格式，且图片尺寸小于 800*800, 图片容量小于 1MB!",
      type: String,
    },
    propsImage: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  watch: {
    propsImage: {
      deep: true, //深度监听
      handler: function () {
        this.propsHandle();
      },
    },
  },

  methods: {
    ImageListUploadsuccess(response, file, fileList) {
      // 图片列表 图片上传成功
      console.log(response, file, fileList);
      let PathArray = [];
      fileList.map((item) => {
        if ("response" in item) {
          PathArray.push(item.response.filepath[0]);
        } else {
          PathArray.push(item.url.substr(item.url.indexOf("/static")));
        }
        //
      });
      this.fileList = fileList;
      this.imageList = PathArray;
      console.log(PathArray);
      this.$emit("multipleImageUpload", PathArray);
    },

    PictureCardPreview(file) {
      // 图片列表 - 点击文件列表中已上传的文件时的钩子
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleExceed(files, fileList) {
      // 图片列表 - 文件超出个数
      this.$message.warning("最多上传五张图片");
    },

    ImageListUploadBefore(file) {
      //图片列表 -  上传文件之前的钩子 对文件类型 大小进行检测限制
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 800 / 800 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG, jpeg, png, gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("图片尺寸 800*800, 小于 1MB!");
      }
      return isJPG && isLt2M;
    },

    imageListRemove(file, fileList) {
      //图片列表 -  移除图片列表 图片
      let PathArray = [];
      fileList.map((item) => {
        if ("response" in item) {
          PathArray.push(item.response.filepath[0]);
        } else {
          PathArray.push(item.url.substr(item.url.indexOf("/static")));
        }
      });
      this.fileList = fileList;
      this.imageList = PathArray;
      this.$emit("multipleImageUpload", PathArray);
    },
    propsHandle() {
      if (this.propsFlag) {
        this.propsImage.map((item) => {
          this.fileList.push({
            name: Date.parse(new Date()),
            url: this.baseurl + item,
          });
        });
        this.propsFlag = false;
      }
    },
  },
  /**
   *
   * 生命周期
   *
   */
  created() {},
  mounted() {},
};
</script>
<style scoped>
.UploadImgTrue >>> div {
  display: inline-block;
}
.UploadImgTrue >>> div {
  display: none;
}
.avatar {
  width: 140px;
  height: 140px;
}
</style>