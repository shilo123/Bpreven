<template>
  <div>
    <div>
      <Table
        :Dat="data"
        class="Tablos"
        @NewComponent="
          showDivos = true;
          Component = $event.Comp;
          params = $event.params;
        "
        v-if="Loadingoz"
      />
    </div>
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="{
            Upo: Component === 'UpdateMes',
            DeleteMes: Component === 'DeleteMes',
          }"
        >
          <!-- :class="{
            newQ: Component === 'NewQustion',
            AddNewAnswer: Component === 'AddAnswer',
            EditOption: Component === 'EditOption',
            warning: Component === 'warning',
          }" -->
          <component :is="Component" :row="params"></component>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import Table from "@/components/Messages/Table/TableComp.vue";
import DeleteMes from "@/components/Messages/Divos/DeleteMesComp.vue";
import UpdateMes from "@/components/Messages/Divos/UpdateMesComp.vue";
export default {
  name: "BprevenMessageView",
  components: { Table, UpdateMes, DeleteMes },
  data() {
    return {
      Loadingoz: false,
      data: [],
      Component: "",
      showDivos: false,
      params: {},
    };
  },
  watch: {
    wachtStoreShowDivos(val, old) {
      if (val) {
        this.showDivos = false;
      }
      this.$store.commit("SgorDivos", false);
    },
  },
  computed: {
    wachtStoreShowDivos() {
      return this.$store.state.SgorDivos;
    },
  },
  async mounted() {
    await this.$nextTick();
    let { data } = await this.$ax(URL + "GetMessages");
    this.data = data;
    this.Loadingoz = true;
  },

  methods: {},
};
</script>
<style scoped>
.Tablos {
  width: 78%;
  position: absolute;
  top: 100px;
  margin-left: 80px;
  transition: all 0.3s;
}
.Upo {
  background: white;
  border-radius: 10px;
}
.DeleteMes {
  background: rgba(255, 26, 26, 0.611);
  height: 260px;
  width: 420px;
  left: 31%;
}
</style>
