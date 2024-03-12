<template>
  <div>
    <el-table
      :data="data"
      v-loading="loadingTABLE"
      ref="Table"
      @row-dblclick="ShowupdateMes"
      border
    >
      <el-table-column label="אפשרויות" width="250">
        <template slot-scope="scope">
          <div class="Buttons">
            <el-button
              type="primary"
              @click="ShowupdateMes(scope.row)"
              size="mini"
              ><i class="fa-solid fa-message-pen"></i> עריכה</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="ShowDeleteMes(scope.row)"
              ><i class="fa-solid fa-message-xmark"></i> מחיקה</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="סטטוס">
        <template slot-scope="scope">
          <div>{{ scope.row.StatusId === 1 ? "פעיל" : "לא פעיל" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="סימן" prop="Symbol"></el-table-column>
      <el-table-column label="שם" prop="Desc"></el-table-column>
      <el-table-column label="תוכן" prop="Content"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "BprevenTableComp",
  props: ["Dat"],
  data() {
    return {
      data: this.Dat,
      loadingTABLE: false,
    };
  },

  mounted() {
    this.$nextTick(function () {
      this.SortTable();
    });
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
    ShowupdateMes(row) {
      this.$emit("NewComponent", { Comp: "UpdateMes", params: row });
    },
    ShowDeleteMes(row) {
      this.$emit("NewComponent", { Comp: "DeleteMes", params: row });
    },
    LoadingTABLEZZ(val) {
      //   alert();
      this.loadingTABLE = val;
      setTimeout(() => {
        this.SortTable();
      }, 200);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-table {
  height: 700px;
}
.Buttons {
  display: flex;
  margin-right: 18px;
  .el-button {
    margin: 3px;
  }
}
</style>
