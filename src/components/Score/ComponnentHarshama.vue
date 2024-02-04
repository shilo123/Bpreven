<template>
  <div>
    <el-table :data="data" border height="771">
      <el-table-column label="הוספה" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="$emit('AddScoreActionFORHarshama', scope.row)"
            >הוסף עיניינים</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="ציון"
        prop="Score"
        align="center"
      ></el-table-column>
      <el-table-column
        label="מגדר"
        prop="NameGender"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        label="עד גיל"
        prop="EndYear"
        align="center"
      ></el-table-column>
      <el-table-column
        label="מגיל"
        prop="StartYear"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenComponnentHarshama",

  data() {
    return {
      data: [],
    };
  },

  async mounted() {
    let { data } = await this.$ax.get(URL + "GETregisterCodes");
    // console.log(data);
    this.data = data;
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.el-table {
  width: 730px;
}
</style>
