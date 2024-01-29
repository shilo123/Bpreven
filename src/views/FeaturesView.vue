<template>
  <div>
    <OpTable
      class="OpTable"
      :class="{
        OpTable: !watchtogelAnimate,
        OpTableBigscreen: watchtogelAnimate,
      }"
      @NewData="
        data = $event;
        showLoMatzanu = false;
      "
      @LoadingTABLE="loadingTABLO"
      @Noserch="
        serch = $event;
        showLoMatzanu = true;
      "
      @AddFeacher="
        showDivos = true;
        Component = 'AddFeacher';
      "
    />
    <div>
      <Tablos
        v-show="!showLoMatzanu"
        :dat="data"
        ref="Table"
        :class="{
          TableComponent: !watchtogelAnimate,
          TableComponentBigscreen: watchtogelAnimate,
        }"
        v-if="ComplitedData"
        @NewComponnent="
          Component = $event.C;
          row = $event.params;
          showDivos = true;
        "
      />
    </div>
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="{
            UpF: Component === 'UpdateFeacher',
            DeleteFeach: Component === 'DeleteFeach',
            AddFeacher: Component === 'AddFeacher',
          }"
        >
          <!-- :class="{
            AddNewAnswer: Component === 'AddAnswer',
            EditOption: Component === 'EditOption',
            warning: Component === 'warning',
          }" -->
          <component
            :is="Component"
            :row="row"
            @Close="showDivos = false"
          ></component>
        </div>
      </transition>
    </div>

    <h1 v-show="showLoMatzanu" class="LoMatz">
      לא נמצאו תוצאות ל "{{ serch }}"
    </h1>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import Tablos from "@/components/Features/Table/TableComp.vue";
import OpTable from "@/components/Features/OptionForTableComp.vue";
import AddFeacher from "@/components/Features/Divos/AddFeacher.vue";
import UpdateFeacher from "@/components/Features/Divos/UpdateFeacher.vue";
import DeleteFeach from "@/components/Features/Divos/DeleteFeacher.vue";
export default {
  name: "BprevenFeaturesView",
  components: { Tablos, OpTable, AddFeacher, UpdateFeacher, DeleteFeach },
  data() {
    return {
      data: [],
      ComplitedData: false,
      serch: "",
      showLoMatzanu: false,
      Component: "",
      showDivos: false,
      row: {},
    };
  },
  watch: {
    data(val) {
      //   console.log(val);
      let Table = this.$refs.Table;
      if (Table) {
        Table.data = val;
        setTimeout(() => {
          Table.SortTable();
        }, 200);
      }
    },
  },
  async mounted() {
    let { data } = await this.$ax(URL + "GetFeatures");
    // console.log(data);
    this.data = data;
    this.ComplitedData = true;
  },
  computed: {
    watchtogelAnimate() {
      return this.$store.state.TogelAnimate;
    },
  },

  methods: {
    loadingTABLO(val) {
      let Table = this.$refs.Table;
      Table.loadingTABLEZ(val);
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
.TableComponentBigscreen {
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
.OpTableBigscreen {
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
.AddFeacher {
  background: rgba(255, 255, 255, 0.253);
  border-radius: 20px;
}
.DeleteFeach {
  background: rgba(255, 0, 0, 0.352);
  height: 260px;
  width: 420px;
  left: 31%;
}
.UpF {
  background: rgb(162, 100, 184);
  /* left: 31%; */
  border-radius: 20px;
  animation: Bodyus 4s;
}
@keyframes Bodyus {
  from {
    border-radius: 0;
  }
  to {
    border-radius: 20px;
  }
}
</style>
