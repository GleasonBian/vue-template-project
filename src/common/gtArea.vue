<template>
  <div class="address-select">
    <el-cascader
      style="width:100%"
      size="large"
      :options="options"
      :clearable="isClear"
      v-model="regionCode"
      
      @change="addressChange"
    ></el-cascader>
  </div>
</template>

<script>
import {
  regionDataPlus,
  regionData,
  TextToCode,
  CodeToText
} from "element-china-area-data";
export default {
  name: "",
  props: {
    modelArr: {
      type: Array,
      default: []
    },
    isAll: {
      type: Boolean,
      default: false
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    modelArr(val) {
      this.regionCode = val;
    }
  },
  data() {
    return {
      options: regionDataPlus,
      regionCode: []
    };
  },
  mounted() {
    this.regionCode = this.modelArr;
    this.isAll ? (this.options = regionDataPlus) : (this.options = regionData);
  },
  methods: {
    addressChange(arr) {
      // console.log(arr);
      // console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
      let str =
        CodeToText[arr[0]] +
        (CodeToText[arr[1]] || "") +
        (CodeToText[arr[2]] || "");
      this.$emit("region", str);
      this.$emit("regionCode", arr);
    }
  }
};
</script>
<style scoped>
</style>