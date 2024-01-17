<template>
  <div>
    <div>
      <OpTable
        class="OpTable"
        @NewData="data = $event"
        @Noserch="
          nodata = true;
          serch = $event;
        "
        @LoadingTABLE="LoadingTable"
      />
    </div>
    <div>
      <Tablos
        v-show="!nodata"
        ref="Table"
        :dat="data"
        class="TableComponent"
        v-if="ComplitedData"
      />
    </div>
    <h1 v-show="nodata" class="LoMatz">"{{ serch }}" לא נמצאו תוצאות ל</h1>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import Tablos from "@/components/Exercises/Table/TableComp.vue";
import OpTable from "@/components/Exercises/OptionForTableComp.vue";
export default {
  name: "BprevenExercisesView",
  components: { Tablos, OpTable },
  data() {
    return {
      data: [],
      ComplitedData: false,
      nodata: false,
      serch: "",
    };
  },
  watch: {
    data(val) {
      if (Boolean(val.length)) {
        this.nodata = false;
      }
      let table = this.$refs.Table;
      if (table) {
        table.data = val;
      }
    },
  },
  async mounted() {
    let { data } = await this.$ax.get(URL + "GetExercises");
    this.data = data;
    this.ComplitedData = true;
  },

  methods: {
    LoadingTable(val) {
      let table = this.$refs.Table;
      if (table) {
        table.LoadingTable(val);
      }
    },
  },
};
</script>

<style scoped>
.TableComponent {
  width: 78%;
  position: absolute;
  top: 120px;
  margin-left: 80px;
  transition: all 0.3s;
}
.OpTable {
  position: absolute;
  top: 45px;
  width: 78%;
  margin-left: 80px;
  transition: all 0.3s;
}
.LoMatz {
  position: absolute;
  left: 30%;
  top: 40%;
}
</style>
