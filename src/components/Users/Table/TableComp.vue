<template>
  <div>
    <ElTableDraggable v-model="data" @update="Move">
      <el-table
        :data="data"
        height="70%"
        class="table"
        border
        row-key="Id"
        v-loading="!titaen"
        @row-dblclick="$emit('newComponent', { C: 'Edit', row: $event })"
      >
        <el-table-column
          v-if="titaen"
          :label="`${data[0].UserDesc}/${data[0].SymbolUser}`"
          align="center"
        >
          <el-table-column label="אפשרויות" align="center">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="$emit('newComponent', { C: 'Delete', row: scope.row })"
                >מחיקה</el-button
              >
              <el-button
                type="success"
                size="mini"
                @click="$emit('newComponent', { C: 'Edit', row: scope.row })"
                >עריכה</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="אם פעיל" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.StatusId === 1 ? "כן" : "לא" }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="שאלון"
            prop="DescQuestion"
            align="center"
          ></el-table-column>
          <el-table-column
            label="סדר"
            prop="Seq"
            align="center"
            width="100"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </ElTableDraggable>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import ElTableDraggable from "el-table-draggable";
export default {
  components: { ElTableDraggable },
  name: "BprevenTableComp",
  props: ["dat"],
  data() {
    return {
      data: this.dat ? this.dat : [],
      titaen: false,
    };
  },
  watch: {},
  async mounted() {
    setTimeout(() => {
      this.titaen = true;
    }, 200);
  },

  methods: {
    async Move(e) {
      setTimeout(async () => {
        let UserId = this.data[e.oldIndex].UserId;
        //   console.log(UserId);
        let arr = [];
        this.data.forEach((obj, i) => {
          let id = obj.Id;
          let newSeq = i + 1;
          arr.push({ id, newSeq });
        });
        // console.log({ data: this.data, arr });
        let { data } = await this.$ax.post(URL + "UpdateSeqUserz", {
          arr,
          UserId,
        });
        this.$Bool(data, "הסדר עודכן בהצלחה", "משהו השתבש", false);
        if (data) {
          this.data.forEach((e, i) => {
            e.Seq = i + 1;
          });
        }
      }, 0);
    },
  },
};
</script>

<style scoped>
.table {
  width: 78%;
  position: absolute;
  top: 100px;
  margin-left: 80px;
  transition: all 0.3s;
}
</style>
