<template>
  <div>
    <OpTable
      @Changosy="
        FilterChange = $event;
        Sortable();
      "
      @YeshLanu="YeshLanu"
      @LoadingTABLE="LoadingTable"
      @Sortable="Sortable"
      @upSetch="FilterChange = $event"
      @newComponent="
        shows.showDivos = true;
        Component = $event;
      "
    />
    <Table
      ref="CompoTable"
      @newComponent="
        shows.showDivos = true;
        Component = $event;
      "
      @SortTable="Sortable"
      @ParamsEditAddNewComponent="ParamsToRowEditAddComp"
      @IdOfDelq="ParamsDelQ = $event"
      @ParamsEditOption="ParamsEditO = $event"
      @paramsOfDeleteOp="paramsOfDeleteOp"
      @IdniFtah="IdniFtah = $event"
    />
    <h1 class="loMatzanu" v-show="data.length === 0">
      {{
        `"לא נמצא ערך זהה ל 
      "${FilterChange}`
      }}
    </h1>
    <div class="divos" v-if="shows.showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="{
            Edito: Component === 'Edit',
            newQ: Component === 'NewQustion',
            AddNewAnswer: Component === 'AddAnswer',
            DeleteAnswer: Component === 'DeleteAnswer',
            EditOption: Component === 'EditOption',
            warning: Component === 'warning',
          }"
        >
          <component
            :is="Component"
            :paramsEdit="paramsEdit"
            :ParamsDelQ="ParamsDelQ"
            :ParamsEditO="ParamsEditO"
            :ParamsOfDelOP="ParamsOfDelOP.id"
            :theOption="ParamsOfDelOP.theOption"
            :IdniFtah="IdniFtah"
          ></component>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import OpTable from "@/components/quesions/optionsONtheTableComp.vue";
import Table from "@/components/quesions/Table/TableComp.vue";
// import Table from "@/components/quesions/Table/TableCopy.vue";
// import draggable from "vuedraggable";
import AddAnswer from "@/components/quesions/divos/ShowAddAnswerComp.vue";
import DeleteAnswer from "@/components/quesions/divos/ShowDeleteAnswerComp.vue";
import Edit from "@/components/quesions/divos/ShowEditComp.vue";
import EditOption from "@/components/quesions/divos/ShowEditOptionComp.vue";
import NewQustion from "@/components/quesions/divos/ShowNewQustion.vue";
import warning from "@/components/quesions/divos/ShowWarnningComp.vue";
export default {
  components: {
    Table,
    OpTable,
    /*draggable,*/
    AddAnswer,
    DeleteAnswer,
    Edit,
    EditOption,
    NewQustion,
    warning,
  },
  name: "BprevenQueshtinsView",

  data() {
    return {
      Component: "",
      shows: {
        showDivos: false,
      },
      theOption: [],
      AllData: {},
      data: [],
      FilterChange: "",
      serch: "",
      paramsEdit: "",
      ParamsDelQ: "",
      ParamsEditO: "",
      ParamsOfDelOP: "",
      IdniFtah: "",
    };
  },
  watch: {
    "shows.showDivos"(val) {
      if (val) {
        this.$store.commit("Setmessage", true);
      } else {
        this.$store.commit("Setmessage", false);
      }
    },
    wachtStoreShowDivos(val) {
      if (val) {
        this.shows.showDivos = false;
      }
      this.$store.commit("SgorDivos", false);
    },
    wachtData(val) {
      this.data = val;
    },
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
    wachtStoreShowDivos() {
      return this.$store.state.SgorDivos;
    },
    wachtData() {
      return this.$store.state.data;
    },
  },
  async mounted() {
    try {
    } catch (error) {
      this.$message.error("משהו השתבש");
    }
  },

  methods: {
    addAnswer() {
      // this.$nextTick(function () {
      this.LoadingOptionss = false;
    },
    ParamsToRowEditAddComp(params) {
      this.paramsEdit = params;
      this.shows.showDivos = true;
    },
    paramsOfDeleteOp(id, theOption) {
      this.ParamsOfDelOP = { id, theOption };
    },
    YeshLanu() {
      let Component = this.$refs.CompoTable;
      Component.data = this.$store.state.data;
      Component.SortTable();
      //   this.SortTable();
    },
    LoadingTable(val) {
      let Component = this.$refs.CompoTable;
      Component.loadingTABLE = val;
    },
    Sortable() {
      // alert();
      let Component = this.$refs.CompoTable;
      setTimeout(() => {
        Component.SortTable();
      }, 200);
    },
  },
};
</script>
<style scoped>
.loMatzanu {
  position: relative;
  top: 300px;
  left: 29%;
  z-index: -1;
}
.AddNewAnswer {
  height: 300px;
  width: 400px;
}
.DeleteAnswer {
  width: 300px;
  height: 200px;
  left: 35%;
  top: 35%;
}
.Edito {
  width: 660px;
  left: 300px;
  height: 630px;
  top: 30px;
}
.EditOption {
  height: 150px;
  width: 400px;
  left: 30%;
}
.newQ {
  height: 520px;
  width: 800px;
  left: 280px;
  top: 60px;
}
.warning {
  width: 300px;
  height: 210px;
  left: 530px;
}
</style>
