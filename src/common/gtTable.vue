<template>
  <el-table
    :data="tableData"
    :border="true"
    fit
    :show-header="true"
    :highlight-current-row="true"
    :row-class-name="tableRowClassName"
    @selection-change="handleSelectionChange"
    :header-cell-style="tableHeaderColor"
    :size="size"
  >
    <el-table-column type="selection" align="center" header-align="center" v-if="selection"></el-table-column>
    <el-table-column align="center" header-align="center" type="index" label="序号" width="50"></el-table-column>
    <el-table-column
      v-for="col in columns"
      :prop="col.id"
      :key="col.id"
      :show-overflow-tooltip="col.show"
      :label="col.label"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        <div class="product-img" v-if="col.type">
          <img
            v-for="(picture, index) in scope.row[col.id]"
            :src="
              picture.imagePath == null
                ? ''
                : 'http://file.sjgtw.com' + picture.imagePath
            "
            alt="图片"
            :key="index"
            style="margin-right:5px; width:38px; height:38px"
            v-show="index <= 2"
          />
        </div>
        <!-- <div v-else-if="typeof(col.type) === string"></div> -->
        <div v-else>{{ scope.row[col.id] }}</div>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
      header-align="center"
      v-if="handle.length > 0"
      :width="optionWidth"
    >
      <template slot-scope="scope">
        <span v-for="(item, index) in handle" :key="index" style="margin-right:5px">
          <el-button
            v-if="item.show"
            :size="item.size ? item.size : 'mini'"
            :type="item.type ? item.type : 'text'"
            @click="handleClick(item.function, scope.$index, scope.row)"
          >{{ item.text }}</el-button>
          <el-button
            v-else
            :size="item.size ? item.size : 'mini'"
            :type="item.type ? item.type : 'text'"
            v-show="scope.row.show"
            @click="handleClick(item.function, scope.$index, scope.row)"
          >{{ item.text }}</el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "gt-table",
  components: {},
  data() {
    return {};
  },
  props: {
    columns: Array,
    tableData: Array,
    selection: {
      type: Boolean,
      default: false,
      required: false
    },
    optionWidth: {
      type: Number,
      default: 80,
      required: false
    },
    handle: {
      type: Array,
      default: function() {
        return [];
      },
      required: false,
      validator: function(value) {
        return value;
      }
    },
    size: {
      type: String,
      default: "mini",
      required: false
    }
  },
  computed: {},

  watch: {},

  methods: {
    handleClick(fun, index, row) {
      this.$emit(fun, index, row);
    },
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: lightblue;color: #333333;font-weight: bold; font-size:14px;";
      }
    }
  },
  /**
   *
   * 生命周期
   *
   */
  created() {},
  mounted() {}
};
</script>
<style>
.product-img {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}

.product-img img {
  width: 50px;
  height: 50px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
