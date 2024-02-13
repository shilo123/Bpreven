<template>
  <div>
    <OpTable
      @LoadnigTABL="UpLoading"
      @AddQuestionaire="
        Componnent = 'Add';
        shows.SHdivos = true;
      "
    />
    <h1 class="LoMatzanu" v-show="!data.length > 0">
      "{{ this.serch }}" לא נמצאו תוצאות ל
    </h1>
    <Table
      @newComponnent="
        Componnent = $event.C;
        paramsOfComp = $event.params;
        shows.SHdivos = true;
      "
      ref="Table"
    />
    <div class="divos" v-if="shows.SHdivos">
      <transition appear name="expand">
        <div
          :class="[
            {
              indivos: true,
              queshens: Componnent === 'Add',
              EditQuen: Componnent === 'Up',
            },
            Componnent === 'Del'
              ? 'w3-panel w3-pale-red w3-leftbar w3-border-red warning'
              : '',
          ]"
        >
          <component
            :is="Componnent"
            @sgor="shows.SHdivos = false"
            :paramsOfComp="paramsOfComp"
            @SortTable="SortTable"
          ></component>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import Add from "@/components/Questionnaire/Divos/AddComp.vue";
import Del from "@/components/Questionnaire/Divos/DeleteComp.vue";
import Up from "@/components/Questionnaire/Divos/UpdateComp.vue";
//
import Table from "@/components/Questionnaire/Table/TableComponnent.vue";
import OpTable from "@/components/Questionnaire/Table/Optable.vue";

export default {
  components: { Add, Del, Up, Table, OpTable },
  data() {
    return {
      data: [],
      serch: "",
      Allamudot: [],
      shows: {
        SHdivos: false,
      },
      Componnent: "",
      paramsOfComp: {},
    };
  },
  computed: {
    // Monthi() {
    //   return this.newquen.Monthly;
    // },

    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },

  watch: {
    loadingButton(val) {
      if (val) {
        // this.$refs.butnonn.$el.style.position = "absulote";
        // this.$refs.butnonn.$el.style.left = "";
      }
    },
    "shows.SHdivos"(val) {
      if (val) {
        this.$store.commit("Setmessage", true);
      } else {
        this.$store.commit("Setmessage", false);
      }
    },
  },
  async mounted() {
    // console.log(response.data);
    await this.$store.dispatch("Questionaire/GetDatas");
    // console.log(this.$store.getters["Questionaire/LastId"]);
    // console.log(this.$store.state.Questionaire.Allamudot.data);
    // console.log(this.$store.state.Questionaire.data.data);
    // console.log(this.$store.state.Questionaire.Optoz.data);
    this.data = this.$store.state.Questionaire.data.data;
  },
  methods: {
    SortTable() {
      let Table = this.$refs.Table;
      setTimeout(() => {
        Table.SortTable();
      }, 100);
    },
    UpLoading(val) {
      let Table = this.$refs.Table;
      setTimeout(() => {
        Table.UpLoading(val);
      }, 100);
    },
  },
};
</script>
<style scoped lang="scss">
.queshens {
  background: white;
  height: 600px;
  width: 990px;
  left: 200px;
  top: 60px;
  padding: 40px;
  border: 13px solid rgb(55, 55, 216);
  border-radius: 20px;
  overflow-y: hidden;
  /* padding-bottom: 40px; */
}
.warning {
  /* background: rgb(255, 255, 255); */
  width: 300px;
  height: 210px;
  padding: 70px;
  text-align: center;
  left: 530px;
  /* border-radius: 20px; */
}
.EditQuen {
  width: 1020px;
  background: rgba(255, 255, 255, 0.547);
  height: 550px;
  top: 30px;
  border: 10px solid rgba(206, 215, 164, 0.586);
  padding-bottom: 50px;
  left: 240px;
  border-radius: 20px;
}
.LoMatzanu {
  position: absolute;
  top: 30%;
  left: 30%;
}
</style>
<style></style>
