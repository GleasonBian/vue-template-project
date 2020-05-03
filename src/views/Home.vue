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
