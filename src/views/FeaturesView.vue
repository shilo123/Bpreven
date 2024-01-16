<template>
  <div>
    <OpTable class="OpTable" />
    <div>
      <Tablos :dat="data" class="TableComponent" v-if="ComplitedData" />
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import Tablos from "@/components/Features/Table/TableComp.vue";
import OpTable from "@/components/Features/OptionForTableComp.vue";
export default {
  name: "BprevenFeaturesView",
  components: { Tablos, OpTable },
  data() {
    return {
      data: [],
      ComplitedData: false,
    };
  },

  async mounted() {
    let { data } = await this.$ax(URL + "GetFeatures");
    // console.log(data);
    this.data = data;
    this.ComplitedData = true;
  },

  methods: {},
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
</style>
