<template>
  <div>
    <OpTable
      class="OpTable"
      :opt="option"
      v-if="ComplitedData"
      @ChangeType="UpDataChangeType"
      @newComponenet="
        showDivos = true;
        Component = $event;
      "
      :amudzot="amudzot"
      @FilterData="FilterData"
    />
    <Table
      v-if="ifTable"
      ref="Table"
      class="Tabloz"
      :dat="data"
      @newComponent="
        showDivos = true;
        Component = $event.C;
        row = $event.row;
      "
    />
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="{
            Add: Component === 'Add',
            Edit: Component === 'Edit',
            Delete: Component === 'Delete',
            AddStep: Component === 'AddStep',
          }"
        >
          <component
            :is="Component"
            :dataUserFlow="option"
            :data="data"
            :row="row"
            @Close="showDivos = false"
          ></component>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import Add from "@/components/Users/Divos/AddUserFlow.vue";
import Edit from "@/components/Users/Divos/EditUserFlow.vue";
import Delete from "@/components/Users/Divos/DeleteUserFlow.vue";
import AddStep from "@/components/Users/Divos/AddUserFlowStep.vue";
import Table from "@/components/Users/Table/TableComp.vue";
import OpTable from "@/components/Users/Table/OpTableComp.vue";
export default {
  name: "BprevenUsersView",
  components: { Table, OpTable, Add, Edit, Delete, AddStep },
  data() {
    return {
      row: {},
      data: [],
      ComplitedData: false,
      option: [],
      ifTable: true,
      Component: "",
      showDivos: false,
      amudzot: [],
      id: "",
    };
  },

  async mounted() {
    await this.$nextTick();
    let res = await this.$ax.get(URL + "GetTypeUser");
    // console.log(res.data);
    this.option = res.data;
    this.ComplitedData = true;
  },

  methods: {
    async UpDataChangeType(id) {
      // console.log(id);
      this.id = id;
      let { data } = await this.$ax.get(URL + "GetUsers/" + id);
      this.data = data;
      let table = this.$refs.Table;
      table.data = data;
      await this.$nextTick();
      let amudimim = this.data.map((e) => e.DescQuestion);
      amudimim = amudimim.filter((e, index, self) => {
        return self.indexOf(e) === index;
      });
      amudimim.unshift("הכל");
      this.amudzot = amudimim;
      // console.log(amudimim);
    },
    async FilterData(valD) {
      const response = await this.$ax.get(URL + "GetUsers/" + this.id);
      this.data = response.data;
      if (valD !== "הכל") {
        this.data = this.data.filter((e) => {
          return e.DescQuestion === valD;
        });
      } else {
        this.data = response.data;
      }
      let table = this.$refs.Table;
      table.data = this.data;
      // console.log(this.data);
    },
  },
};
</script>
<style scoped>
.OpTable {
  position: absolute;
  top: 43px;
  width: 78%;
  margin-left: 80px;
  transition: all 0.3s;
}
.Add {
  background: white;
  height: 550px;
  top: 40px;
}
.Edit {
  background: white;
  width: 850px;
  height: 390px;
  left: 250px;
  top: 70px;
  border-radius: 10px;
}
.Delete {
  background: white;
}
.AddStep {
  background: white;
  width: 850px;
  height: 390px;
  left: 250px;
  top: 70px;
  border-radius: 10px;
}
</style>
