<template>
  <div>
    <el-table :data="data" border ref="Table" v-loading="loadingTABLE">
      <el-table-column label="אפשרויות">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="
              $emit('NewComponnent', { C: 'UpdateFeacher', params: scope.row })
            "
            ><i class="fa-solid fa-pen-to-square"></i> עריכה</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="
              $emit('NewComponnent', { C: 'DeleteFeach', params: scope.row })
            "
            ><i class="fa-solid fa-trash-xmark"></i> מחיקה</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="סימן" prop="Symbol"></el-table-column>
      <el-table-column label="מספר" prop="Number"></el-table-column>
      <el-table-column label="שם" prop="Desc"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "BprevenTableComp",
  props: ["dat"],
  data() {
    return {
      data: this.dat,
      loadingTABLE: false,
    };
  },

  async mounted() {
    await this.$nextTick();
    this.SortTable();
  },

  methods: {
    SortTable() {
      let table = this.$refs.Table.$el;
      //   console.log(table);
      let TableHeader =
        table.children[1].children[0].children[1].children[0].children;
      //   console.log(TableHeader);
      Array.from(TableHeader).forEach((element) => {
        element.style.textAlign = "center";
      });
      let tds = table.children[2].children[0].children[1].children;
      Array.from(tds).forEach((element) => {
        Array.from(element.children).forEach((el) => {
          el.style.textAlign = "center";
        });
      });
    },
    loadingTABLEZ(val) {
      this.loadingTABLE = val;
    },
  },
};
</script>

<style scoped>
.el-table {
  height: 700px;
}
</style>
