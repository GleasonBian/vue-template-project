<!--
 * @Date: 2020-05-03 20:14:44
 * @LastEditTime: 2020-05-03 20:50:55
 * @Version: 7.0
 * @Author: Johnson.Wen
 * @Editor: Johnson.Wen
 * @Mobile: 13311005499
 * @Email: 13311005499@189.cn
 * @Comment: 
 -->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// 引入 接口
import { getWangYiNews } from "@/getData.js";
export default {
  name: "home",
  components: {
    HelloWorld
  },
  created() {
    this.getDataHandle();
  },
  methods: {
    async getDataHandle() {
      const res = await getWangYiNews();
      console.log(res);
    }
  }
};
</script>
