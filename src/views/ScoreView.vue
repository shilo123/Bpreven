<template>
  <div :class="{ Loading: !loDading, No: loDading }">
    <i
      class="fa-solid fa-loader fa-spin fa-2xl Icnon"
      style="color: #6670ff"
    ></i>
    <!-- <div>
      <br /><br /><br />
      {{ shomes }}
    </div> -->
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div class="indivos">
          <TablePopap
            @SgorDivos="
              showDivos = false;
              SgorSham();
            "
            :Params="Params[Params.length - 1]"
            :NameOfScore="NameOfScore"
            :que="CompActivosQ()"
          />
        </div>
      </transition>
    </div>

    <InputAutoComplitade
      :class="{ inlineInput: !wachtStore, BigScreen: wachtStore }"
      @nivhar="
        activQushinnare = $event;
        sortTabs();
      "
      @clear="ClearOption"
      @Inp="
        afterClear ? FuncafterClear() : '';
        shomesALL = true;
      "
      v-if="loDading"
    />
    <div v-if="shomes">
      <div class="TypeQusinnaire" v-show="activQushinnare && wachtStore">
        סוג השאלון:
        {{ typeQueshinarire ? typeQueshinarire.Name : "טוען" }}
      </div>
      <div v-if="typeQueshinarire.Id === 3">
        <el-button
          type="success"
          class="ButtonSuccess"
          @click="HOsefInyanimOreh"
          >הוסף עיניינים</el-button
        >
      </div>
      <div v-if="typeQueshinarire.Id === 2" class="Harshama">
        <Hashamos @AddScoreActionFORHarshama="AddScoreActionFORHarshama" />
      </div>
      <div v-if="shomesALL && typeQueshinarire.Id === 1">
        <h1
          class="LoMatzanu"
          v-show="
            activQushinnare
              ? !ObjDataQuestions[activQushinnare].length > 0
              : !null && activQushinnare !== ''
          "
        >
          "לא נמצאו שאלות ל "{{ activQushinnare }}
        </h1>
        <div v-if="shomes" ref="TheAlElements" class="Allel">
          <!-- style="position: Sticky; top: -130px; z-index: 3" -->
          <el-row :gutter="20">
            <el-col
              :span="span"
              v-for="(q, i) in ObjDataQuestions[activQushinnare]"
              :key="i"
              class="content"
              ref="contentCOL"
              :style="{ width }"
            >
              <!-- v-show="q.DescDateTypes === 'OptionId'" -->
              <div class="HeaderQuestions" ref="HeaderQuestions">
                {{ q.Desc }}/<span>{{ $computedData(q.DescDateTypes) }}</span>
              </div>
              <div ref="ItemsNoheader">
                <div
                  v-for="(s, i) in ComputedOptions({
                    arrOptions,
                    Desco: q.Desc,
                  })"
                  :key="i"
                  class="Item-content"
                  ref="ItemContent"
                >
                  <!-- :style="
                    ComputedStyle(
                      width,
                      ObjDataQuestions[activQushinnare].length === 1
                    )
                  " -->
                  <!-- :style="{ width }" -->
                  <span> {{ s.Desc }} </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <Cardos
          ref="Cardos"
          :activQushinnare="activQushinnare"
          :width="width"
          v-show="
            activQushinnare
              ? ObjDataQuestions[activQushinnare].length > 0
              : null && activQushinnare !== ''
          "
          v-if="IfComponents && activQushinnare"
          @showPopUp="
            showDivos = true;
            Params = $event;
          "
          @newParams="NameOfScore = $event"
        />
      </div>
      <div v-else-if="shomesALL && typeQueshinarire.Id === 4">
        <h1
          class="LoMatzanu"
          v-show="
            activQushinnare
              ? !ObjDataQuestions[activQushinnare].length > 0
              : !null && activQushinnare !== ''
          "
        >
          "לא נמצאו שאלות ל "{{ activQushinnare }}
        </h1>
        <div v-if="shomes" ref="TheAlElements" class="Allel">
          <!-- style="position: Sticky; top: -130px; z-index: 3" -->
          <el-row :gutter="20">
            <el-col
              :span="0.5"
              v-for="(q, i) in ObjDataQuestions[activQushinnare]"
              :key="i"
              class="content"
              ref="contentCOL"
              :style="{ width }"
            >
              <!-- // v-show="q.DescDateTypes === 'OptionId'" -->
              <div class="HeaderQuestions" ref="HeaderQuestions">
                {{ q.Desc }}/<span>{{ $computedData(q.DescDateTypes) }}</span>
              </div>
              <div ref="ItemsNoheader">
                <div
                  v-for="(s, i) in ComputedOptions({
                    arrOptions,
                    Desco: q.Desc,
                  })"
                  :key="i"
                  class="Item-content"
                  ref="ItemContent"
                >
                  <!-- :style="
                    ComputedStyle(
                      width,
                      ObjDataQuestions[activQushinnare].length === 1
                    )
                  " -->
                  <!-- :style="{ width }" -->
                  <span> {{ s.Desc }} </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <Cardos
          ref="Cardos"
          :activQushinnare="activQushinnare"
          :width="width"
          v-show="
            activQushinnare
              ? ObjDataQuestions[activQushinnare].length > 0
              : null && activQushinnare !== ''
          "
          v-if="IfComponents && activQushinnare"
          @showPopUp="
            showDivos = true;
            Params = $event;
          "
          @newParams="NameOfScore = $event"
          @ShowPopapMetaplim="PopapMetaplim"
        />
      </div>
    </div>
    <PopapMetape
      v-if="ShowPopapMetaplim"
      :activQushinnare="activQushinnare"
      :arrIDS="arrIDSTerapist"
      @Sgor="ShowPopapMetaplim = false"
    />
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import InputAutoComplitade from "@/components/Score/Elenents/inputAutoComp.vue";
import Cardos from "@/components/Score/CardsOfScoreComp.vue";
import TablePopap from "@/components/Score/PopPap/TableInyonim.vue";
import Hashamos from "@/components/Score/ComponnentHarshama.vue";
import PopapMetape from "@/components/Score/PopPap/PopPapMetapel.vue";
// import "../claly.css";
export default {
  components: {
    InputAutoComplitade,
    Cardos,
    TablePopap,
    Hashamos,
    PopapMetape,
  },
  name: "BprevenScoreView",
  data() {
    return {
      showDivos: false,
      shomes: false,
      IfComponents: false,
      shomesALL: false,
      afterClear: false,
      reverse: false,
      ShowPopapMetaplim: false,
      NameOfScore: "",
      activQushinnare: "",
      width: "",
      typeQueshinarire: "",
      Params: {},
      ObjDataQuestions: [],
      arrOptions: [],
      arrIDSTerapist: "",
      Screen: window.innerWidth - 240,
      span: 0,
      loDading: true,
    };
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
    returnLength() {
      return this.ObjDataQuestions[this.activQushinnare]
        ? this.ObjDataQuestions[this.activQushinnare].length
        : false;
    },
  },
  watch: {
    showDivos(val) {
      // console.log("showDivos", val);
    },
    activQushinnare(val, Old) {
      if (val) {
        this.FunctionActiveQushinnare(val);
      }
    },
    wachtStore(val) {
      if (val) {
        // this.Screen = window.innerWidth;
        if (this.afterClear && this.activQushinnare) {
          this.FunctionActiveQushinnare(this.activQushinnare);
        }
      } else {
        this.Screen = window.innerWidth - 240;
        this.ClearOption();
      }
      this.sortTabs();
    },
    typeQueshinarire: {
      handler(val) {
        // console.log(val);
        // this.$store.state.Score
        this.$store.commit("Score/ActivType", val);
      },
    },
    shomes(val) {
      this.loDading = val;
    },
  },
  async mounted() {
    let { data } = await this.$ax.get(URL + "GetallQuestions");
    // console.log(data);

    this.ObjDataQuestions = data;
    await this.$nextTick();
  },

  methods: {
    SgorSham() {
      let cardos = this.$refs.Cardos;
      if (cardos && cardos.showPopAp) {
        cardos.showPopAp = false;
      }
    },
    FuncafterClear() {
      this.FunctionActiveQushinnare(this.activQushinnare);
    },
    async sortTabs() {
      // await this.$nextTick();
      // setTimeout(async () => {
      let widtho;
      let LengthItems;
      const Intervalos = setInterval(async () => {
        // console.log("מנסה");
        if (this.$refs.contentCOL) {
          // setTimeout(async () => {
          // await this.$nextTick();

          LengthItems = this.returnLength;
          if (!this.returnLength) {
            await this.delay(500);
            LengthItems = this.returnLength;
          }

          // widtho = this.Screen / LengthItems + "px";
          widtho = 90 / LengthItems + "%";

          this.span = LengthItems / 24;
          this.width = widtho;
          let widthSham = this.Screen / LengthItems + "px";
          this.$store.commit("Score/Upwidth", widthSham);
          this.IfComponents = true;

          // console.log("הצלחתי");
          // }, 200);
          clearInterval(Intervalos);
        }
      }, 100);
    },
    ComputedOptions(val) {
      // console.log(val);
      let result = val.arrOptions.find((e) => {
        return e[val.Desco];
      });
      if (!result) {
        result = [];
      }
      // console.log(result);
      // console.log(result[val.Desco]);
      return result[val.Desco];
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async FunctionActiveQushinnare(val, bool) {
      try {
        if (!this.wachtStore) {
          this.shomesALL = false;
          this.$store.commit("SetTogel", true);
          return;
        }
        this.shomes = false;
        this.shomesALL = true;
        let res = await this.$ax.get(URL + "GetOPtionForQuestion/" + val);
        // console.log(res.data);
        this.arrOptions = res.data.arr;
        this.typeQueshinarire = res.data.type;
        if (res.data.type.Id === 1 || res.data.type.Id === 4) {
          if (!this.reverse) {
            this.ObjDataQuestions[this.activQushinnare].reverse();
            this.reverse = true;
          }
          const Params = {
            Questions: this.ObjDataQuestions[this.activQushinnare],
            Op: res.data.arr,
          };
          this.$store.commit("Score/UpData", Params);
          this.shomes = true;
        } else {
          this.shomes = true;
        }
        //if (res.data.type.Id === 3)
      } catch (error) {
        this.$message.error("משהו השתבשש");
      }
    },
    ClearOption() {
      this.arrOptions = [];
      this.shomesALL = false;
      this.afterClear = true;
    },
    HOsefInyanimOreh() {
      this.Params = [[]];
      this.NameOfScore = this.typeQueshinarire.Name;
      this.showDivos = true;
    },
    CompActivosQ() {
      if (this.typeQueshinarire.Id === 3) {
        return this.activQushinnare;
      } else {
        return null;
      }
    },
    AddScoreActionFORHarshama(row) {
      console.log({ ...row });
      this.Params = [[row.Score]];
      let nameS = `${row.StartYear} - ${row.EndYear} / ${row.NameGender}`;
      this.NameOfScore = nameS;
      this.showDivos = true;
      // console.log({ nameS, params: this.Params });
    },
    ComputedStyle(width, mIfOne) {
      let objStyle = { width };
      if (mIfOne) {
        objStyle.left = "54%";
      }

      return objStyle;
    },
    //
    PopapMetaplim(val) {
      // console.log("val in score", val);
      this.arrIDSTerapist = val[val.length - 1].join(",");
      this.ShowPopapMetaplim = true;
    },
  },
};
</script>
<style lang="scss" scoped>
/* .D {
  background: #000;
  height: 30px;
  position: absolute;
  top: 200px;
  left: 0;
  transition: all 2s;
} */
.HeaderQuestions {
  background: rgb(255, 255, 255);
  color: crimson;
  padding: 6px;
  max-height: 100px;
  overflow-y: auto;
  overflow-x: auto;
  margin-bottom: 10px;
}
.HeaderQuestions span {
  font-size: 12px;
  color: crimson;
}
.content:not(.HeaderQuestions) {
  position: relative;
  top: 130px;
  left: 90px;
  display: flex;
  flex-direction: column;
  /* width: 250px; */
  /* margin-right: 50px; */
  text-align: center;
  transition: width 0.3s;
}
.Item-content {
  background: rgb(159, 195, 101);
  padding: 5px;
  //  width: 160px;
  width: 100%;
  margin-top: 30px;
  border-radius: 10px;
  font-size: 14px;
  position: relative;
  left: 0px;
  transition: all 0.4s;
}
.Item-content:not(:last-child)::after {
  content: "";
  position: absolute;
  height: 100%;
  border-left: 2px solid black;
  left: 50%;
  bottom: -100%;
}
/* .content span:hover {
  padding: 5px;
  width: 100px;
  text-align: right;
} */
.inlineInput {
  position: absolute;
  left: 30%;
  top: 50px;
  width: 360px;
  transition: all 0.3s;
  z-index: 15;
}
.BigScreen {
  z-index: 11;
  position: absolute;
  left: 40%;
  top: 50px;
  width: 360px;
  transition: all 0.3s;
}
.block {
  width: 20%;
  position: relative;
  top: 100px;
}
.option,
.score {
  width: 40%; /* מגדיל את הרוחב מ-50% ל-40% כדי ליצור מרחב באמצע */
}

.option {
  text-align: center;
  position: absolute;
  right: 18px;
  top: 20px;
}

.score {
  text-align: center;
  position: absolute;
  left: 18px;
  top: 24px;
}

/* מוסיף קו באמצע הכרטיס */
.el-card::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  border-left: 1px solid #ccc; /* יוצר קו אנכי */
  transform: translateX(-50%); /* ממקם את הקו במרכז האלמנט */
}
.LoMatzanu {
  position: absolute;
  left: 34%;
  top: 30%;
}
.Allel {
  /* background: rgba(0, 0, 0, 0.415); */
  padding-bottom: 12%;
  /* position: relative;
  top: -130px;
  z-index: 3; */
}
.indivos {
  background: rgba(255, 255, 255, 0.792);
  // height: 630px;
  height: 90%;
  // width: 1140px;
  width: 80%;
  // left: 210px;
  left: 10%;
  top: 30px;
  border-radius: 20px;
}
.TypeQusinnaire {
  font-size: 30px;
  position: absolute;
  top: 50px;
  left: 110px;
}
.ButtonSuccess {
  position: absolute;
  left: 43%;
  top: 200px;
  width: 300px;
  transition: all 0.3s;
}
.ButtonSuccess:hover {
  font-size: 23px;
  padding: 12px;
}
.Harshama {
  position: absolute;
  left: 28%;
  top: 140px;
  width: 920px;
  transition: all 0.3s;
}
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* עיצוב המגלגל (החלק שנע) */
::-webkit-scrollbar-thumb {
  background: #efff6180; /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
  position: relative;
  top: 40px;
}
::-webkit-scrollbar-thumb:hover {
  background: #575757b3; /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
}
.Loading {
  background: #1d19198b;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 800;
  .Icnon {
    position: absolute;
    left: 50%;
    top: 40%;
  }
}
</style>
