<template>
  <div class="search_box">
    <div class="search_box_single" v-if="data.length <= 3">
      <div class="search_item" v-for="(item, index) in data" :key="index">
        <div class="search_item_label">{{ item.label ? item.label : "暂无!" }}：</div>
        <el-select
          v-if="item.options"
          v-model="search[item.key]"
          :placeholder="
            item.placeholder ? item.placeholder : '请选择'
          "
          style="width:100%; margin-right:15px"
          :size="size"
        >
          <el-option
            v-for="(opt, optIdx) in item.options"
            :key="optIdx"
            :label="opt.label"
            :value="opt.value"
          ></el-option>
        </el-select>
        <el-date-picker
          :size="size"
          v-else-if="item.key === 'date'"
          v-model="search[item.key]"
          :type="item.type ? item.type : 'daterange'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:100%; margin-right:15px"
          @change="dateChange(search[item.key])"
        ></el-date-picker>

        <el-input
          v-else
          v-model="search[item.key]"
          :placeholder="
            item.placeholder ? item.placeholder : '请输入搜索关键字'
          "
          :size="size"
          style="margin-right:15px"
        ></el-input>
      </div>
      <div class="search_item">
        <el-button
          type="primary"
          @click="searchHandle"
          :size="size"
          style="width:32%; margin-right:15px"
        >搜 索</el-button>
        <el-button @click="reset" :size="size" style="width:32%">重 置</el-button>
      </div>
    </div>
    <div class="search_box_multi" v-else-if="data.length > 3">
      <div class="search_multi_item" v-for="(item, index) in data" :key="index">
        <div class="search_item_label">{{ item.label ? item.label : "暂无!" }}：</div>
        <el-select
          v-if="item.options"
          v-model="search[item.key]"
          :placeholder="
            item.placeholder ? item.placeholder : '请选择'
          "
          style="width:100%; margin-right:15px"
          :size="size"
        >
          <el-option
            v-for="(opt, optIdx) in item.options"
            :key="optIdx"
            :label="opt.label"
            :value="opt.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-else-if="item.key === 'date'"
          v-model="search[item.key]"
          type="daterange"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:100%; margin-right:15px"
          @change="dateChange(search[item.key])"
          :size="size"
        ></el-date-picker>
        <el-input
          v-else
          v-model="search[item.key]"
          :placeholder="
            item.placeholder ? item.placeholder : '请输入'
          "
          :size="size"
          style="margin-right:15px"
        ></el-input>
      </div>
      <div class="search_multi_item_button">
        <el-button
          type="primary"
          @click="searchHandle"
          :size="size"
          style="width:32%; margin-right:15px"
        >搜 索</el-button>
        <el-button @click="reset" :size="size" style="width:32%">重 置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {}
    };
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      },
      require: true,
      validator: function(value) {
        return value;
      }
    },
    size: {
      type: String,
      default: function() {
        return "mini";
      },
      require: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    searchHandle() {
      // if ("date" in this.search) this.search.date = [];
      this.$emit("handle", this.search);
    },
    reset() {
      this.$props.data.map(item => {
        // delete this.search.date;
        if (item.key === "date") {
          this.search.date = [];
          // delete this.search.date;
          this.$set(this.search, "start", "");
          this.$set(this.search, "end", "");
        } else this.$set(this.search, item.key, "");
      });
      this.$emit("handle", this.search);
    },
    dateChange(val) {
      val[1] = val[1].replace("00:00:00", "23:59:59");
      this.search.start = val[0];
      this.search.end = val[1];
    }
  },
  /**
   *
   * 生命周期
   *
   */
  created() {
    this.$props.data.map(item => {
      this.$set(this.search, item.key, item.default ? item.default : "");
    });
  }
};
</script>
<style scoped>
/* 单行搜索框(<3个) */
.search_box_single {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* margin-top: 10px; */
}
.search_item {
  display: flex;
  justify-content: center;
  width: 25%;
  align-items: center;
}
/* 两行搜索框(>3<=6个) */
.search_item_label {
  width: 140px;
  text-align: right;
  letter-spacing: 2px;
  font-size: 14px;
  color: #606266;
}
.search_box-double {
  /* border: 1px solid red; */
  width: 99.8%;
  display: flex;
  justify-content: space-between;
}
.search_box-double-input {
  width: 80%;
  /* border: 1px solid gray; */
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px 10px 0px 50px;
}
.search_box-double-button {
  width: 20%;
  /* border: 1px solid rgb(10, 224, 196); */
  display: flex;
  flex-direction: column;
  padding: 10px 50px 15px 10px;
  justify-content: space-between;
}
.search_box-double-item {
  display: flex;
  justify-content: center;
  width: 30%;
  align-items: center;
  margin-bottom: 15px;
}
.search-button {
  width: 50%;
}
/* 多行搜索框(>6个) */
.search_box_multi {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 95%;
  margin-right: 20px;
  margin-top: 10px;
}
.search_multi_item {
  display: flex;
  justify-content: center;
  width: 33%;
  align-items: center;
  margin-bottom: 10px;
}

.search_multi_item_button {
  margin-left: auto;
  width: 33%;
}
</style>
