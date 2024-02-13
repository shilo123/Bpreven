<template>
  <div>
    <button
      @mouseover="over = true"
      @mouseleave="over = false"
      class="button-6"
      role="button"
      @click="showQuesheannaire = !showQuesheannaire"
    >
      סדר שאלות
    </button>
    <div
      class="FlexColumn"
      v-if="showQuesheannaire"
      @mouseover="over = true"
      @mouseleave="over = false"
    >
      <button
        v-for="(Q, i) in QUestory"
        :key="i"
        @click="
          shows.showDivos = true;
          ParamsOfSeq = Q.Id;
          Component = 'UpdateSeq';
        "
        class="button-33"
        role="button"
      >
        {{ Q.Desc }}
      </button>
    </div>
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
            UpdateSeq: Component === 'UpdateSeq',
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
            :Idq="ParamsOfSeq"
            @UpdateData="UpdateData"
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
import UpdateSeq from "@/components/quesions/divos/UpdateSeq.vue";
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
    //
    UpdateSeq,
  },
  name: "BprevenQueshtinsView",

  data() {
    return {
      over: false,
      showQuesheannaire: false,
      Component: "",
      shows: {
        showDivos: false,
      },
      theOption: [],
      QUestory: {},
      ParamsOfSeq: {},
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
      let { data } = await this.$ax(URL + "GetQueshianaire");
      this.QUestory = data;
      document.body.addEventListener("click", (e) => {
        if (!this.over) {
          this.showQuesheannaire = false;
        }
      });
      // console.log("this.data", this.data);
      // console.log(this.QUestory);
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
      setTimeout(() => {
        Component.SortTable();
      }, 200); //   this.SortTable();
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
    async UpdateData() {
      await this.$store.dispatch("fetchData");
      this.YeshLanu();
    },
  },
};
</script>
<style scoped lang="scss">
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
  //  height: 630px;
  height: 480px;
  left: 400px;
  // left: 300px;
  top: 80px;
  // top: 30px;
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
.UpdateSeq {
  background: white;
  width: 400px;
  height: auto;
  padding-bottom: 200px;
  top: 50px;
  left: 480px;
}
/* CSS */
.button-6 {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  top: 40px;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: 80px;
  height: 20px;
}

.button-6:hover,
.button-6:focus {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.button-6:hover {
  transform: translateY(-1px);
}

.button-6:active {
  background-color: #f0f0f1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}
/* / */

/* CSS */
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, 0.2) 0 -25px 18px -14px inset,
    rgba(44, 187, 99, 0.15) 0 1px 2px, rgba(44, 187, 99, 0.15) 0 2px 4px,
    rgba(44, 187, 99, 0.15) 0 4px 8px, rgba(44, 187, 99, 0.15) 0 8px 16px,
    rgba(44, 187, 99, 0.15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular, -apple-system, system-ui, Roboto, sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100px;
  height: 50px;
  margin-bottom: 10px;
  animation: ShowButton 0.3s ease forwards;
}

@keyframes ShowButton {
  from {
    transform: translateY(-20px); /* התחל מ-20px מעל למקום הסופי */
    opacity: 0; /* התחל עם שקיפות 0 */
  }
  to {
    transform: translateY(0);
    opacity: 1; /* הגיע לשקיפות מלאה */
  }
}

.button-33:hover {
  box-shadow: rgba(44, 187, 99, 0.35) 0 -25px 18px -14px inset,
    rgba(44, 187, 99, 0.25) 0 1px 2px, rgba(44, 187, 99, 0.25) 0 2px 4px,
    rgba(44, 187, 99, 0.25) 0 4px 8px, rgba(44, 187, 99, 0.25) 0 8px 16px,
    rgba(44, 187, 99, 0.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}

/* / */
.FlexColumn {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 40px;
  right: 10px;
}
</style>
