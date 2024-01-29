<template>
  <div>
    <div>
      <OpTable
        :class="{ OpTable: !watchtogelAnimate, OpTableBig: watchtogelAnimate }"
        @NewData="data = $event"
        @Noserch="
          nodata = true;
          serch = $event;
        "
        @LoadingTABLE="LoadingTable"
        @newComponent="
          Component = $event;
          showDivos = true;
        "
      />
    </div>
    <div>
      <Tablos
        v-show="!nodata"
        ref="Table"
        :dat="data"
        :class="{
          TableComponent: !watchtogelAnimate,
          TableComponentBig: watchtogelAnimate,
        }"
        v-if="ComplitedData"
        @newComponent="
          Component = $event.C;
          params = $event.params;
          showDivos = true;
        "
      />
    </div>
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="{
            AddEx: Component === 'AddEx',
            EditEx: Component === 'EditEx',
            DeleteEx: Component === 'DeleteEx',
            addCategory: Component === 'Category',
          }"
        >
          <component
            :is="Component"
            :params="params"
            @Close="showDivos = false"
          ></component>
        </div>
      </transition>
    </div>

    <h1 v-show="nodata" class="LoMatz">"{{ serch }}" לא נמצאו תוצאות ל</h1>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import Tablos from "@/components/Exercises/Table/TableComp.vue";
import OpTable from "@/components/Exercises/OptionForTableComp.vue";
import AddEx from "@/components/Exercises/Divos/AddExercises.vue";
import EditEx from "@/components/Exercises/Divos/EditExercises.vue";
import DeleteEx from "@/components/Exercises/Divos/DeleteExercises.vue";
import Category from "@/components/Exercises/Divos/Category.vue";
export default {
  name: "BprevenExercisesView",
  components: { Tablos, OpTable, AddEx, DeleteEx, EditEx, Category },
  data() {
    return {
      data: [],
      ComplitedData: false,
      nodata: false,
      serch: "",
      Component: "",
      showDivos: false,
      params: {},
    };
  },
  computed: {
    watchtogelAnimate() {
      return this.$store.state.TogelAnimate;
    },
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
.TableComponentBig {
  width: 88%;
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
.OpTableBig {
  position: absolute;
  top: 45px;
  width: 88%;
  margin-left: 80px;
  transition: all 0.3s;
}
.LoMatz {
  position: absolute;
  left: 30%;
  top: 40%;
}
.AddEx {
  background: white;
  width: 1100px;
  height: 570px;
  left: 200px;
  top: 80px;
  border-radius: 20px;
}
.DeleteEx {
  background: rgb(255, 126, 126);
  border-radius: 20px;
  width: 480px;
  height: 290px;
}
.addCategory {
  background: white;
  width: 480px;
  overflow-y: auto;
}
.EditEx {
  background: white;
  width: 1100px;
  height: 570px;
  left: 200px;
  top: 80px;
  border-radius: 20px;
}
</style>
