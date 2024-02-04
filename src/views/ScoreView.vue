<template>
  <div>
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
    />
    <div class="TypeQusinnaire" v-show="activQushinnare">
      סוג השאלון:
      {{ typeQueshinarire ? typeQueshinarire.Name : "טוען" }}
    </div>
    <div v-if="typeQueshinarire.Id === 3">
      <el-button type="success" class="ButtonSuccess" @click="HOsefInyanimOreh"
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
        "לא נמצע ערך זהה ל "{{ activQushinnare }}
      </h1>
      <div v-if="shomes" ref="TheAlElements" class="Allel">
        <!-- style="position: Sticky; top: -130px; z-index: 3" -->
        <el-row>
          <el-col
            :span="0.5"
            v-for="(q, i) in ObjDataQuestions[activQushinnare]"
            :key="i"
            class="content"
            ref="contentCOL"
            v-show="q.DescDateTypes === 'OptionId'"
          >
            <div class="HeaderQuestions" ref="HeaderQuestions">
              {{ q.Desc }}/<span>{{ computedData(q.DescDateTypes) }}</span>
            </div>
            <div ref="ItemsNoheader">
              <div
                v-for="(s, i) in ComputedOptions({ arrOptions, Desco: q.Desc })"
                :key="i"
                class="Item-content"
                ref="ItemContent"
                :style="{ width }"
              >
                <span>
                  {{ s.Desc }}
                </span>
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
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import InputAutoComplitade from "@/components/Score/Elenents/inputAutoComp.vue";
import Cardos from "@/components/Score/CardsOfScoreComp.vue";
import TablePopap from "@/components/Score/PopPap/TableInyonim.vue";
import Hashamos from "@/components/Score/ComponnentHarshama.vue";
// import "../claly.css";
export default {
  components: {
    InputAutoComplitade,
    Cardos,
    TablePopap,
    Hashamos,
  },
  name: "BprevenScoreView",
  data() {
    return {
      NameOfScore: "",
      Params: {},
      showDivos: false,
      ObjDataQuestions: [],
      arrOptions: [],
      activQushinnare: "",
      shomes: false,
      Screen: window.innerWidth - 240,
      width: "",
      IfComponents: false,
      shomesALL: false,
      afterClear: false,
      reverse: false,
      typeQueshinarire: "",
    };
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
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
    computedData(val) {
      //   console.log(val);
      if (val === "Text") {
        return "טקסט";
      } else if (val === "Numeric") {
        return "מספר";
      } else if (val === "OptionId") {
        return "אופציות";
      } else if (val === "Date") {
        return "תאריך";
      } else {
        return val;
      }
    },
    async sortTabs() {
      await this.$nextTick();
      setTimeout(async () => {
        let widtho;
        let col;
        if (this.$refs.contentCOL) {
          let ItemsOnly = this.$refs.ItemsNoheader;
          col = this.$refs.contentCOL;
          widtho = this.Screen / col.length - 65 + "px";
          this.width = widtho;
          // console.log(col.length);
          let elAll = this.$refs.TheAlElements;
          this.$store.commit("Score/UpItems", elAll);
          col.forEach((e, i) => {
            e = e.$el;
            // console.log(e);
            if (col.length === 2) {
              widtho = this.Screen / col.length - 75 + "px";
            } else if (col.length === 1) {
              widtho = this.Screen / col.length - 175 + "px";
            } else if (col.length > 7) {
              widtho = this.Screen / col.length - 15 + "px";
              if (i === col.length - 1) {
                this.ItemosSorted(ItemsOnly);
              }
            }
            e.style.width = widtho;
            e.style.marginRight = "30px";
          });
          let item = this.$refs.ItemContent;
          if (!item) {
            await this.delay(500);
          }
          if (item) {
            item.forEach((elo) => {
              elo.style.position = "relative";
              elo.style.left = "50%";
              elo.style.transform = "translateX(-50%)";
            });
          }
        }
        this.IfComponents = true;
      }, 200);
    },
    async ItemosSorted(elements) {
      elements.forEach((el) => {
        // console.log(el);
        Array.from(el.children).forEach((e) => {
          // console.log(e);
          e.style.width = "120px";
        });
      });
      let Headers = this.$refs.HeaderQuestions;
      // console.log(Headers);
      Headers.forEach((element) => {
        // console.log(element);
        element.style.fontSize = "10px";
        element.style.width = "130px";
      });
      let all = this.$refs.contentCOL;

      all.forEach((element) => {
        // console.log("Yesh");
        // console.log("element.$el", element.$el);
        let W =
          +element.$el.style.width.split("px")[0] +
          +element.$el.style.marginRight.split("px")[0];
        W = W + "px";
        this.width = W;
        element.$el.style.position = "relative";
        element.$el.style.left = "40px";
        // element.$el.style.width = "0px";
        let ELOS = Array.from(element.$el.children[1].children);
        setTimeout(() => {
          ELOS.forEach((e) => {
            // console.log("e", e);
            e.style.position = "relative";
            e.style.left = "60px";
            e.style.marginRight = "30px";
            // console.log(e.style.left);
          });
        }, 300);
      });
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
        if (res.data.type.Id === 1) {
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
        }
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
  },
};
</script>
<style scoped>
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
  width: 160px;
  margin-top: 30px;
  border-radius: 10px;
  font-size: 14px;
  position: relative;
  left: 30px;
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
.el-card {
  height: 100px;
  font-size: 15px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 10px;
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
  /* height: 760px; */
  height: 630px;
  width: 1140px;
  left: 210px;
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
</style>
