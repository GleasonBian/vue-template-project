<template>
  <div>
    <el-divider content-position="left">{{title}}</el-divider>
    <el-upload
      class="avatar-uploaderONE"
      :action="baseurl+serverUrl"
      :show-file-list="false"
      list-type="picture-card"
      accept="image/*"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-error="coverIMageUploadError"
      name="image"
    >
    <!-- :http-request="uploadImage" -->
      <img v-if="imageUrl" :src="baseurl+imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
       <div slot="tip" class="el-upload__tip">{{tip}}</div>
    </el-upload>
  </div>
</template>

<script>
import {  uploadImages } from "@/getData";
export default {
  name: "SingleImageUpload",
  data() {
    return {
      serverUrl:"upload/images", // 图片上传 接口
      baseurl : process.env.VUE_APP_TITLE === "local" ? process.env.VUE_APP_PROXY  : process.env.VUE_APP_URL
    };
  },
  props: {
    imageUrl: {
      default: '',
      type:String,
    }, // 本地图片路径
    title: {
      default: '单图上传',
      type: String,
    }, // 本地图片路径
    tip: {
      default: '请上传 jpg,jpeg, png, gif 格式，且图片尺寸小于300*350, 图片容量小于 1MB!',
      type: String,
    }
  },
  computed: {},

  watch: {},

  methods: {
    handleAvatarSuccess(response, file, fileList) {
      console.log(response.filepath[0]);
      this.$message.success("图片上传成功");
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit("SingleImageUpload", response.filepath[0]);
    },
    beforeAvatarUpload(file) {
      // 上传前 对 图片 格式 大小进行检测
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt1M = file.size / 500 / 500 < 1;
      if (!isJPG) {
        this.$message.error("图片只能是 JPG,png,gif 格式!");
      }
      if (!isLt1M) {
        this.$message.error("图片尺寸小于300*350, 小于 1MB!");
      }
      return isJPG && isLt1M;
    },
    coverIMageUploadError(err, file, fileList) {
      // 封面图片上传失败
      this.$message.error("文件上传失败");
    },
    async uploadImage(item) {
      let fileObj = item.file;
      const form = new FormData(); // FormData 对象
      form.append("file", fileObj); // 文件对象  'upload'是后台接收的参数名
      const res = await uploadImages()
      console.log(res);

    },
  },
  /**
   *
   * 生命周期
   *
   */
  created() {},
  mounted() {},
  watch: {
    // logo(val) {
    //   this.$bus.emit("SingleImageUpload", val);
    //   this.$bus.emit("multipleImageUploadEditor", val);
    // },
  },
};
</script>
<style scoped>
.avatar-uploaderONE .el-upload {
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
}

/*.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    border: 1px dotted gray;
    border-radius: 10px;
  }*/

.avatar {
  width: 140px;
  height: 140px;
}
</style>