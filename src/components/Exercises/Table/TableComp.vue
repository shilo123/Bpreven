<template>
  <div>
    <el-table
      :data="data"
      ref="Table"
      border
      v-loading="LoadingTABLE"
      height="600px"
      @row-dblclick="UPE"
    >
      <el-table-column label="אפשרויות" width="160">
        <template slot-scope="scope">
          <div class="Buttons">
            <el-button
              type="primary"
              size="mini"
              @click="$emit('newComponent', { C: 'EditEx', params: scope.row })"
              >עריכה</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="
                $emit('newComponent', { C: 'DeleteEx', params: scope.row })
              "
              >מחיקה</el-button
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="תיאור" prop="About"></el-table-column>
      <el-table-column label="קטוגריה" prop="NameCategory"></el-table-column>
      <el-table-column label="סטטוס">
        <template slot-scope="scope">
          <div>{{ scope.row.StatusId === 1 ? "פעיל" : "לא פעיל" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="סימן" prop="Symbol"></el-table-column>
      <el-table-column label="כותרת" prop="Title"></el-table-column>
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
      LoadingTABLE: false,
    };
  },
  computed: {
    watchtogelAnimate() {
      return this.$store.state.TogelAnimate;
    },
  },

  mounted() {
    // console.log(this.data);
    setTimeout(() => {
      this.SortTable();
    }, 100);
  },

  methods: {
    SortTable() {
      if (this.$refs.Table) {
        let table = this.$refs.Table.$el;
        let TableHeader =
          table.children[1].children[0].children[1].children[0].children;
        //   console.log(TableHeader);
        Array.from(TableHeader).forEach((element) => {
          element.style.textAlign = "center";
        });
        let tds = table.children[2].children[0].children[1].children;
        Array.from(tds).forEach((element) => {
          Array.from(element.children).forEach((el, i) => {
            if (i !== 0) {
              el.style.textAlign = "right";
            } else {
              el.style.textAlign = "center";
            }
          });
        });
      }
    },
    LoadingTable(val) {
      this.LoadingTABLE = val;
      setTimeout(() => {
        this.SortTable();
      }, 200);
    },
    UPE(row) {
      this.$emit("newComponent", { C: "EditEx", params: row });
    },
  },
};
</script>

<style lang="scss" scoped>
.Buttons {
  display: flex;
  // margin-right: 18px;
  .el-button {
    margin: 3px;
  }
}
</style>
