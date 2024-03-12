<template>
  <div>
    <div>
      <OptionTable
        class="OpTable"
        :class="{ OpTableBig: watchStor }"
        @NewData="NewData = $event"
        @AddMessage="
          showDivos = true;
          Component = 'AddMessage';
        "
        @LoadingTABLE="LoadingTable"
        @Noserch="serch = $event"
      />
    </div>
    <div>
      <Table
        ref="ComponnentsTable"
        :Dat="data"
        class="Tablos"
        :class="{ TablosBig: watchStor }"
        @NewComponent="
          showDivos = true;
          Component = $event.Comp;
          params = $event.params;
        "
        v-show="!LoMaTznu"
      />
      <!-- v-if="Loadingoz" -->
    </div>
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="{
            Upo: Component === 'UpdateMes',
            DeleteMes: Component === 'DeleteMes',
            AddMessage: Component === 'AddMessage',
          }"
        >
          <!-- :class="{
            AddNewAnswer: Component === 'AddAnswer',
            EditOption: Component === 'EditOption',
            warning: Component === 'warning',
          }" -->
          <component :is="Component" :row="params" @Updata="Updata"></component>
        </div>
      </transition>
    </div>
    <div class="LoMatzanu" v-show="LoMaTznu">
      "{{ serch }}" לא נמצאו תוצאות ל
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import OptionTable from "@/components/Messages/Table/OptionForTableComp.vue";
import Table from "@/components/Messages/Table/TableComp.vue";
import DeleteMes from "@/components/Messages/Divos/DeleteMesComp.vue";
import UpdateMes from "@/components/Messages/Divos/UpdateMesComp.vue";
import AddMessage from "@/components/Messages/Divos/AddMessageComp.vue";
export default {
  name: "BprevenMessageView",
  components: { Table, UpdateMes, DeleteMes, AddMessage, OptionTable },
  data() {
    return {
      Loadingoz: false,
      data: [],
      Component: "",
      showDivos: false,
      params: {},
      NewData: [],
      LoMaTznu: false,
      serch: "",
    };
  },
  watch: {
    wachtStoreShowDivos(val, old) {
      if (val) {
        this.showDivos = false;
      }
      this.$store.commit("SgorDivos", false);
    },
    NewData(val) {
      let table = this.$refs.ComponnentsTable;
      table.data = val;
      setTimeout(() => {
        table.SortTable();
      }, 100);
      this.LoMaTznu = Boolean(!val.length);
      console.log(this.LoMaTznu);
    },
    watchStor(val) {
      val;
    },
  },
  computed: {
    wachtStoreShowDivos() {
      return this.$store.state.SgorDivos;
    },
    watchStor() {
      return this.$store.state.TogelAnimate;
    },
  },
  async mounted() {
    this.LoadingTable(true);
    await this.$nextTick();
    // setTimeout(async () => {
    let { data } = await this.$ax(URL + "GetMessages");
    this.data = data;
    this.DataTableUp(data);
    this.Loadingoz = true;
    this.LoadingTable(false);
    // }, 2000);
  },

  methods: {
    LoadingTable(val) {
      let table = this.$refs.ComponnentsTable;
      table.LoadingTABLEZZ(val);
    },
    DataTableUp(NewData) {
      if (!NewData) {
        NewData = [];
      }
      let table = this.$refs.ComponnentsTable;
      table.data = NewData;
    },
    async Updata() {
      this.showDivos = false;
      let { data } = await this.$ax(URL + "GetMessages");
      let table = this.$refs.ComponnentsTable;
      table.data = data;
      setTimeout(() => {
        table.SortTable();
      }, 100);
    },
  },
};
</script>
<style lang="scss" scoped>
.Tablos {
  width: 78%;
  position: absolute;
  top: 140px;
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
  /* background: #000; */
  width: 88%;
}
.TablosBig {
  /* background: #000; */
  width: 88%;
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
.AddMessage {
  // background: linear-gradient(to right, #55ddff, #544bff, #59fcd6);
  background: #afbfff76;
  border-radius: 10px;
}
.LoMatzanu {
  position: absolute;
  left: 50%;
  top: 40%;
  font-size: 30px;
}
@media screen and (max-width: 1300px) {
  .Tablos {
    width: 73%;
    position: absolute;
    top: 140px;
    margin-left: 80px;
    transition: all 0.3s;
    &Big {
      width: 88%;
    }
  }
  .OpTable {
    position: absolute;
    top: 45px;
    width: 73%;
    margin-left: 80px;
    transition: all 0.3s;
    &Big {
      width: 88%;
    }
  }
  //
  .Upo {
    background: white;
    border-radius: 10px;
    left: 17%;
    top: 40px;
  }
  .DeleteMes {
    background: rgba(255, 26, 26, 0.611);
    height: 260px;
    width: 420px;
    left: 31%;
  }
  .AddMessage {
    // background: linear-gradient(to right, #55ddff, #544bff, #59fcd6);
    background: #afbfff76;
    border-radius: 10px;
    left: 17%;
    top: 40px;
  }
}
</style>
