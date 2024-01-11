<template>
  <div class="all">
    <div class="parentsSelects">
      <div v-for="(n, i) in RevereseQu" :key="i" class="Selects">
        <miniSelect
          :i="i"
          :Option="n.op"
          :placeholder="n.Desc"
          :value="ModelSelect[`Model-${i}`]"
          @value="ModelSelect[`Model-${i}`] = $event"
          @change="
            ModelSelect[`Model-${i}`] = $event.val;
            EventChange(
              ModelSelect[`Model-${i}`],
              RevereseQu.length - ($event.i + 1)
            );
          "
        />
      </div>
    </div>
    <div v-for="(A, i) in arrsTheOP" :key="i">
      <div
        class="container"
        v-if="i < counteros"
        :class="{ YeshCvar: ModelInputL[`Model-${i}`] }"
      >
        <div class="inContainer">
          <div
            :class="{ BigScreen: wachtStore, col: !wachtStore }"
            v-for="(Op, index) in A"
            :key="index"
          >
            <!-- {{ ObjFromIds(Op, i) }} -->
            <div class="Boxo" :style="{ width, marginLeft }">
              {{ Op ? Op.Desc : "" }}
            </div>
            <i
              class="fa-solid fa-arrow-right fa-rotate-180 fa-2xl icon"
              style="color: #000"
            ></i>
          </div>
          <div class="inptut">
            <InitialInput
              @value="ModelInputL[`Model-${i}`] = $event"
              :val="ModelInputL[`Model-${i}`]"
              background="blue"
              placeHolder="כתוב ציון"
              class="inponenets"
            />
            <el-button
              type="primary"
              size="mini"
              class="inponenets-button"
              :loading="LoadingButton"
              @click="
                SaveScore(ObjIds[`IDS-${i}`], ModelInputL[`Model-${i}`], i)
              "
              >שמור</el-button
            >
            <el-popconfirm
              confirm-button-text="כן"
              cancel-button-text="לא, תודה"
              icon="el-icon-info"
              icon-color="red"
              title="?בטוח שאתה רוצה למחוק"
              @confirm="
                DeleteScore(ObjIds[`IDS-${i}`], ModelInputL[`Model-${i}`], i)
              "
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                class="inponenets-buttonDanger"
                :loading="LoadingButton"
                >מחק ציון</el-button
              >
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
    <div
      class="more"
      @click="counteros += 10"
      v-show="counteros < arrsTheOP.length"
    >
      <i class="el-icon-more Icnoc"></i>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import miniSelect from "@/components/ComponenetsCloly/MiniSelect.vue";

export default {
  props: ["activQushinnare"],
  name: "BprevenCardsOfScoreComp",
  components: { miniSelect },
  data() {
    return {
      val: "hoy",
      counteros: 10,
      ModelInputL: {},
      ObjIds: {},
      ModelSelect: {},
      width: "",
      marginLeft: "",
      arrsTheOP: [],
      Questos: [],
      RevereseQu: [],
      LoadingButton: false,
      Ifos: false,
    };
  },
  watch: {
    Elall(val) {
      if (val) {
        this.width = val.children[0].children[0].style.width;
        this.marginLeft = val.children[0].children[0].style.marginRight;
      }
    },
    ModelInputL(val) {
      // console.log(val);
    },
    dataQ(valu) {
      this.ObjIds = {};
      this.arrsTheOP = [];
      this.ModelInputL = {};
      this.Questos = [];
      this.RevereseQu = [];
      let val = this.$store.state.Score.data;
      val.Questions.forEach((el) => {
        let Options = val.Op.find((eo) => eo[el.Desc]);
        Options = Options[el.Desc];
        el.op = Options;
        this.Questos.unshift(el);
      });
      //   this.Questos.reverse();
      // console.log(this.Questos);
      this.Questos.sort((a, b) => {
        return a.sek - b.sek;
      });
      this.Questos.forEach((element) => {
        this.RevereseQu.unshift(element);
      });
      // this.RevereseQu.reverse();

      this.compData();
      this.BuildArrIds();

      this.$ax.get(URL + "GetScore/" + this.activQushinnare).then((res) => {
        // let arr = [];
        res.data.forEach((el) => {
          for (const key in this.ObjIds) {
            if (!Array.isArray(el.QuestionsAnswersIds)) {
              el.QuestionsAnswersIds = el.QuestionsAnswersIds.split(",");
            }
            el.QuestionsAnswersIds = el.QuestionsAnswersIds.map((e) => {
              return +e;
            });
            if (this.arraysEqual(el.QuestionsAnswersIds, this.ObjIds[key])) {
              // arr.push(key);
              this.UpdateModel(key.split("-")[1], el.QuestionnaireScore);
            }
          }
        });
        // console.log("arr", arr);
      });

      //   this.arrsTheOP.push()
    },
  },
  computed: {
    MaxQuestions() {
      return this.$findLargestArray(this.generateOptionsPaths(this.Questos));
    },
    Elall() {
      return this.$store.state.Score.items;
    },
    dataQ() {
      return this.$store.state.Score.data;
    },
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.ModelInputL);
    }, 200000);
    let val = this.$store.state.Score.data;
    // console.log("val", val);
    if (val.Questions) {
      val.Questions.forEach((el) => {
        let Options = val.Op.find((eo) => eo[el.Desc]);
        Options = Options[el.Desc];
        el.op = Options;
        this.Questos.unshift(el);
      });
      this.Questos.sort((a, b) => {
        return a.sek - b.sek;
      });
      this.Ifos = true;
      this.compData();
    }
    if (
      this.Elall &&
      this.Elall.children[0] &&
      this.Elall.children[0].children[0]
    ) {
      this.width = this.Elall.children[0].children[0].style.width;
      this.marginLeft = this.Elall.children[0].children[0].style.marginRight;
    }
    this.BuildArrIds();
    this.BuildIndexes();

    this.$ax.get(URL + "GetScore/" + this.activQushinnare).then((res) => {
      // let arr = [];
      res.data.forEach((el) => {
        for (const key in this.ObjIds) {
          if (!Array.isArray(el.QuestionsAnswersIds)) {
            el.QuestionsAnswersIds = el.QuestionsAnswersIds.split(",");
          }
          el.QuestionsAnswersIds = el.QuestionsAnswersIds.map((e) => {
            return +e;
          });
          if (this.arraysEqual(el.QuestionsAnswersIds, this.ObjIds[key])) {
            // arr.push(key);
            this.UpdateModel(key.split("-")[1], el.QuestionnaireScore);
          }
        }
      });
      // console.log("arr", arr);
    });
  },

  methods: {
    BuildArrIds() {
      this.arrsTheOP.forEach((e, i) => {
        e.forEach((op) => {
          if (op) {
            if (!this.ObjIds[`IDS-${i}`]) this.ObjIds[`IDS-${i}`] = [];
            if (!this.ObjIds[`IDS-${i}`].includes(op.Id)) {
              this.ObjIds[`IDS-${i}`].push(op.Id);
            }
          }
        });
      });
    },
    BuildIndexes() {},
    compData() {
      this.arrsTheOP = this.generateOptionsPaths(this.Questos);
      // .map(
      //   (innerArray, index) => {
      //     return { val: innerArray, id: index };
      //   }
      // );
      console.log(this.arrsTheOP);
    },
    generateOptionsPaths(questions) {
      let allPaths = [];

      const buildPath = (path, questionIndex) => {
        if (questionIndex >= questions.length) {
          allPaths.push(path);
          return;
        }

        let currentQuestion = questions[questionIndex];
        if (!currentQuestion.op || currentQuestion.op.length === 0) {
          // אם אין אופציות, מוסיפים null וממשיכים לשאלה הבאה
          buildPath([...path, null], questionIndex + 1);
        } else {
          currentQuestion.op.forEach((option) => {
            if (option.NextQuestionId === null) {
              // אם NextQuestionId הוא null, זהו סוף המסלול
              allPaths.push([...path, option]);
            } else {
              // מוצא את האינדקס של השאלה הבאה על פי NextQuestionId
              let nextIndex = questions.findIndex(
                (q) => q.Id === option.NextQuestionId
              );
              let newPath = [...path, option];

              // מוסיף null לכל השאלות שבין השאלה הנוכחית לשאלה הבאה
              for (let i = questionIndex + 1; i < nextIndex; i++) {
                newPath.push(null);
              }

              buildPath(newPath, nextIndex);
            }
          });
        }
      };

      buildPath([], 0); // מתחילים מהשאלה הראשונה
      return allPaths;
    },
    arraysEqual(arr1, arr2) {
      // console.log("arr1", arr1);
      // console.log("arr2", arr2);
      if (arr1.length !== arr2.length) return false;

      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }

      return true;
    },
    async SaveScore(arrIds, Score, i) {
      //   console.log("arrIds", arrIds.join());
      //   console.log("Score", Score);
      if (Score) {
        this.LoadingButton = true;

        let { data } = await this.$ax.post(URL + "AddScore", {
          Score,
          arrIds: arrIds.join(),
          Qushinnare: this.activQushinnare,
        });
        this.LoadingButton = false;
        if (data) {
          this.$message.success("הציון ניתן");
        } else {
          this.$message.error("משהו השתבש");
        }
      } else {
        this.$message("אחי כתוב משהו");
      }
    },
    UpdateModel(i, text) {
      this.ModelInputL[`Model-${i}`] = text;
    },
    async DeleteScore(arrIds, Score, i) {
      this.LoadingButton = true;
      let { data } = await this.$ax.post(URL + "deleteScore", {
        arrIds,
        Score,
        Qushinnare: this.activQushinnare,
      });

      this.LoadingButton = false;
      if (data) {
        this.$message.success("נמחק בהצלחה");
        ModelInputL[`Model-${i}`] = "";
      } else {
        this.$message.error("משהו השתבש");
      }
    },
    EventChange(val, i) {
      // this.arrsTheOP.forEach((e) => {
      //   // console.log(Boolean(!e[i].Desc === val));
      //   if (e[i] && e[i].Desc === val) {
      //     // e.push();
      //   }
      //   console.log(e);
      // });
      // // console.log(this.arrsTheOP);
    },
  },
};
</script>
<style scoped>
.parentsSelects {
  display: flex;
  flex-direction: row;
  position: relative;
  left: 2%;
  top: 140px;
}
.Selects {
  margin-right: 50px;
}
.Boxo {
  width: auto;
  /* border-radius: 20px; */
  /* margin: 10px; */
  margin-top: 10px;
  text-align: right;
  font-size: 13px;
  border-bottom: 2px solid crimson;
  transition: all 0.3s;
  padding: 5px;
  margin-right: 20px;
  color: crimson;
}
.inContainer {
  display: flex;
  flex-direction: row-reverse;
  position: relative;
  right: 20px;
  /* right: 50px; */
  align-items: flex-end;
  margin-bottom: 15px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-left: 300px;
}
.container {
  position: relative;
  top: 130px;
  left: 25px;
  margin-right: 22px;
  border: 2px solid black;
  width: 97%;
  background: rgba(255, 255, 255, 0.703);
  padding: 20px;
  margin-top: 30px;
  border-radius: 10px;
  /* padding-left: 100px; */
  box-shadow: 0 0 7px 3px rgb(171, 169, 148);
  overflow-x: auto;
}
.BigScreen {
  position: relative;
  /* left: 220px; */
  transition: all 0.3s;
}
.BigScreen {
  position: relative;
  /* left: 220px; */
  transition: all 0.3s;
}
.Col {
  margin: 60px;
  position: relative;
  transition: left 0.3s;
}
.Boxo::before {
  content: "";
  position: relative;
  /* width: 5%; */
  height: 2px;
  top: 50%;
  border-radius: 11px;
  background: #000;
}
.icon {
  position: relative;
  right: 10px;
  bottom: 15px;
}
.index {
  color: red;
  position: absolute;
  left: 30px;
  border-bottom: 3px solid red;
}
.indexOfNull {
  color: red;
  position: absolute;
  left: 85px;
  top: 0;
}
::-webkit-scrollbar {
  width: 10px; /* רוחב סרגל גלילה אופקי */
  height: 10px; /* גובה סרגל גלילה אנכי */
}

/* עיצוב המגלגל (החלק שנע) */
::-webkit-scrollbar-thumb {
  background: rgb(13, 59, 212); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
  position: relative;
  top: 40px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(13, 59, 212, 0.7); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
}

/* עיצוב המגלגל בעת העברת העכבר מעליו */
::-webkit-scrollbar-thumb:active {
  background: rgb(63, 72, 241); /* צבע המגלגל בעת העברת העכבר */
}
.inponenets {
  position: relative;
  bottom: -10px;
  left: 100px;
}
.inponenets-button {
  position: relative;
  bottom: 20px;
  left: 30px;
}
.inponenets-buttonDanger {
  position: relative;
  bottom: 20px;
  left: -120px;
}
.inptut {
  position: relative;
  right: 200px;
}
.YeshCvar {
  border: 1px solid rgb(58, 255, 94);
  /* box-shadow: 0 0 1px 1px rgb(58, 255, 94); */
  box-shadow: 0 0 7px 3px rgb(207, 191, 44);
}
.more {
  position: relative;
  left: 43%;
  top: 200px;
  width: 200px;
  height: 50px;
  background: rgb(162, 152, 152);
  border-radius: 20px;
  transition: all 0.3;
}
.more:hover {
  background: rgba(162, 152, 152, 0.563);
  border-radius: 10px;
  width: 180px;
  cursor: pointer;
  transition: all 0.3;
  left: 44%;
}
.Icnoc {
  font-size: 100px;
  width: 300px;
  position: relative;
  left: 26%;
  bottom: 25px;
}
.Icnoc::before {
  font-size: 100px;
}
</style>
<style></style>
