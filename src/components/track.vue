<template>
  <el-row :gutter="10">
    <el-col :span="5" align="center">
      <el-select v-model="guid" placeholder="请选择设备" style="width:90%;margin-top:20px">
        <el-option
          v-for="item in vehicleData"
          :key="item.guid"
          :label=" item.plateno"
          :value="item.guid"
        ></el-option>
      </el-select>
      <el-calendar v-model="date" style="height: 300px">
        <template slot="dateCell" slot-scope="{date, data}">
          <p
            style="text-align:center;"
            :class="data.isSelected ? 'is-selected' : ''"
          >{{ data.day.split('-').slice(2).join('-')}} {{ data.isSelected ? '✔️' : ''}}</p>
        </template>
      </el-calendar>
    </el-col>
    <el-col :span="19" align="center"></el-col>
  </el-row>
</template>

<style>
.is-selected {
  color: #1989fa;
}
</style>

<script>
import { equiSelect, oilView } from "@/getData";
export default {
  name: "amap-page",
  data() {
    return {
      date: new Date(),
      guid: "",
      vehicleData: []
    };
  },
  created() {
    this.equiList();
  },
  methods: {
    /*
     ** 设备列表
     */
    async equiList() {
      const res = await equiSelect();
      this.vehicleData = res.data;
    }
  }
};
</script>
