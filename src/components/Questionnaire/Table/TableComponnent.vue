<template>
  <div>
    <el-table
      :data="dataos"
      :class="{ table: !wachtStore, tableBig: wachtStore }"
      ref="Table"
      border
      v-loading="loadingTABLE"
      @row-dblclick="Edit"
    >
      <!-- v-loading="!Booleano(dataos ? dataos.length : 0)" -->
      <el-table-column label="אפשרויות" width="185">
        <template slot-scope="scope">
          <div class="Buttons">
            <el-button type="primary" size="mini" @click="Edit(scope.row)"
              ><i class="el-icon-edit"></i> עריכה</el-button
            >
            <el-button type="danger" size="mini" @click="DELETE(scope.row)"
              ><i class="el-icon-delete"></i> מחיקה</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="סטטוס" prop="StatusId">
        <template slot-scope="scope">
          <div>{{ Booleano(scope.row.StatusId) ? "פעיל" : "לא פעיל" }}</div>
        </template>
      </el-table-column>

      <el-table-column
        width="270"
        label="שאלה ראשונית"
        prop="StartQuestion"
      ></el-table-column>

      <el-table-column label="סימן" prop="Symbol"></el-table-column>
      <el-table-column label="שם" prop="Desc"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "BprevenTableComponnent",
  props: [],
  data() {
    return {
      loadingTABLE: true,
      data: [],
      gaspu: true,
    };
  },
  computed: {
    dataos() {
      return this.$store.state.Questionaire.data.data;
    },
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },
  watch: {
    loadingTABLE(val) {
      //   console.log(val);
      if (!val) {
        setTimeout(() => {
          this.SortTable();
        }, 200);
      }
    },

    dataos(val) {
      //   console.log(val);
      //   setTimeout(() => {
      //     if (val && val.length) {
      this.loadingTABLE = false;
      //     } else {
      //       this.loadingTABLE = true;
      //   setTimeout(() => {
      //     this.loadingTABLE = false;
      //   }, 1000);
      // }
      //   }, 100);
    },
  },
  async mounted() {
    // this.data = this.$store.state.Questionaire.data.data;
    await this.$nextTick();
    this.SortTable();
    // this.SortInput();
  },

  methods: {
    Edit(row) {
      console.log(row);
      if (!row.QuestionnaireTypesId) row.QuestionnaireTypesId = 1;
      let stat = row.StatusId;
      row.StatusId = Boolean(stat);
      this.paramsFromEdit = {
        paramsModel: row,
      };
      this.$emit("newComponnent", { C: "Up", params: this.paramsFromEdit });
    },
    DELETE(row) {
      console.log(row);
      this.$emit("newComponnent", { C: "Del", params: row });
    },
    Booleano(val) {
      return Boolean(val);
    },
    SortTable() {
      let table = this.$refs.Table.$el;
      let TableHeader =
        table.children[1].children[0].children[1].children[0].children;
      Array.from(TableHeader).forEach((element) => {
        element.style.textAlign = "center";
      });
      let tds = table.children[2].children[0].children[1].children;
      // console.log(tds);
      Array.from(tds).forEach((element) => {
        Array.from(element.children).forEach((el) => {
          el.style.textAlign = "right";
        });
      });
    },
    UpLoading(val) {
      this.loadingTABLE = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 70%;
  position: absolute;
  top: 100px;
  left: 0;
  margin-left: 116px;
  height: 700px;
  z-index: 3;
  border: 3px solid black;
  overflow-y: auto;
  padding-bottom: 50px;
  transition: all 0.3s;
  &Big {
    width: 86%;
    position: absolute;
    top: 100px;
    right: 0;
    margin-right: 6.5%;
    height: 700px;
    z-index: 3;
    border: 3px solid black;
    overflow-y: auto;
    padding-bottom: 50px;
    transition: all 0.3s;
  }
}
.Buttons {
  display: flex;
  flex-direction: row;
  .el-button {
    margin: 2px;
  }
}
</style>
