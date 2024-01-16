<template>
  <div class="all">
    <el-radio-group v-model="ValRadio" class="Radioz">
      <el-radio-button label="ניתן ציון"></el-radio-button>
      <el-radio-button label="לא ניתן ציון"></el-radio-button>
      <el-radio-button label="הכל"></el-radio-button>
    </el-radio-group>
    <el-button class="ButtonReset" @click="ResetSelects">אפס</el-button>
    <div class="parentsSelects">
      <div v-for="(n, i) in Questos" :key="i" class="Selects">
        <el-tooltip effect="dark" :content="n.Desc" placement="top">
          <miniSelect
            :ref="`ComponentSelect${i}`"
            :i="i"
            :Option="n.op"
            :placeholder="`אופציה-${i + 1}`"
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
        </el-tooltip>
      </div>
    </div>
    <div v-for="(A, i) in arrsTheOP" :key="i">
      <div
        class="container"
        v-if="i < counteros"
        :class="{ YeshCvar: ModelInputL[`Model-${A[A.length - 2]}`] }"
      >
        <div class="i">{{ A[A.length - 2] }}</div>
        <div class="inContainer">
          <div
            :class="{ BigScreen: wachtStore, col: !wachtStore }"
            v-for="(Op, index) in A"
            :key="index"
          >
            <!-- {{ ObjFromIds(Op, i) }} -->
            <div
              v-if="
                index !== A.length - 1 &&
                index !== A.length - 2 &&
                Op.DescQustions
              "
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="Op.DescQustions"
                placement="top-end"
              >
                <div class="Boxo" :style="{ width, marginLeft }">
                  {{ Op.Desc ? Op.Desc : "" }}
                </div>
              </el-tooltip>
              <i
                class="fa-solid fa-arrow-right fa-rotate-180 fa-2xl icon"
                style="color: #000"
              ></i>
            </div>
          </div>
          <div class="inptut">
            <InitialInput
              @value="ModelInputL[`Model-${A[A.length - 2]}`] = $event"
              :val="ModelInputL[`Model-${A[A.length - 2]}`]"
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
                SaveScore(
                  A[A.length - 1],
                  ModelInputL[`Model-${A[A.length - 2]}`],
                  `${A[A.length - 1]}`
                )
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
                DeleteScore(
                  A[A.length - 1],
                  ModelInputL[`Model-${A[A.length - 2]}`],
                  `${A[A.length - 2]}`
                )
              "
            >
              <el-button
                v-show="ModelInputL[`Model-${A[A.length - 2]}`]"
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
    <div class="LoNimtzeou" v-show="ShowLomatz">
      <div class="title">לא מצאנו אחי</div>
      <br />
      <div class="Haze">
        <div v-for="(A, i) in ArrLoMatzanu" :key="i" class="Haze-item">
          <i
            v-show="i !== 0"
            class="fa-solid fa-arrow-right fa-rotate-180 fa-xl"
            style="color: #000"
          ></i>
          {{ A ? A : "ללא" }}
        </div>
        <br />
      </div>
      <div class="ValRadio">{{ ValRadio }}</div>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import miniSelect from "@/components/Score/MiniSelect.vue";

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
      arrsTheOPG: [],
      Questos: [],
      RevereseQu: [],
      ArrLoMatzanu: [],
      LoadingButton: false,
      ValRadio: "הכל",
      ShowLomatz: false,
    };
  },
  watch: {
    ValRadio(val) {
      // if (!this.filter) {
      //   this.arrsTheOP = this.arrsTheOPG;
      // }
      // this.filter = false;
      this.EventChange(val);

      if (val === "הכל") {
      }
    },
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
      this.ResetSelects();
      this.arrsTheOP = [];
      this.Questos = [];
      this.RevereseQu = [];
      this.ModelInputL = {};
      this.ModelSelect = {};
      let val = this.$store.state.Score.data;
      val.Questions.forEach((el) => {
        let Options = val.Op.find((eo) => eo[el.Desc]);
        Options = Options[el.Desc];
        el.op = Options;
        this.Questos.unshift(el);
      });
      this.Questos.sort((a, b) => {
        return a.sek - b.sek;
      });
      // this.RevereseQu.reverse();

      this.compData();

      this.$ax.get(URL + "GetScore/" + this.activQushinnare).then((res) => {
        // let arr = [];
        res.data.forEach((el) => {
          if (!Array.isArray(el.QuestionsAnswersIds)) {
            el.QuestionsAnswersIds = el.QuestionsAnswersIds.split(",");
          }
          el.QuestionsAnswersIds = el.QuestionsAnswersIds.map((e) => {
            return +e;
          });
          this.arrsTheOP.forEach((e) => {
            if (this.arraysEqual(el.QuestionsAnswersIds, e[e.length - 1])) {
              this.UpdateModel(e[e.length - 2], el.QuestionnaireScore);
            }
          });
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
      this.Questos.forEach((element) => {
        this.RevereseQu.unshift(element);
      });

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
    // this.BuildIndexes();

    this.$ax.get(URL + "GetScore/" + this.activQushinnare).then((res) => {
      // let arr = [];
      res.data.forEach((el) => {
        if (!Array.isArray(el.QuestionsAnswersIds)) {
          el.QuestionsAnswersIds = el.QuestionsAnswersIds.split(",");
        }
        el.QuestionsAnswersIds = el.QuestionsAnswersIds.map((e) => {
          return +e;
        });
        this.arrsTheOP.forEach((e) => {
          if (this.arraysEqual(el.QuestionsAnswersIds, e[e.length - 1])) {
            this.UpdateModel(e[e.length - 2], el.QuestionnaireScore);
          }
        });
      });
      // console.log("arr", arr);
    });
  },

  methods: {
    addIdsArrayToEach(arrs) {
      arrs.forEach((innerArr) => {
        const idsArray = innerArr
          .filter(
            (obj) => obj !== null && obj !== undefined && obj.Id !== undefined
          )
          .map((obj) => obj.Id);

        innerArr.push(idsArray);
      });

      return arrs;
    },
    compData() {
      this.arrsTheOP = this.generateOptionsPaths(this.Questos);
      this.arrsTheOP.forEach((element, i) => {
        element.push(i);
      });
      this.arrsTheOPG = this.arrsTheOP;
      this.arrsTheOP = this.addIdsArrayToEach(this.arrsTheOP);
      this.arrsTheOPG = this.addIdsArrayToEach(this.arrsTheOPG);
      this.arrsTheOPG.forEach((element, i) => {
        element.splice(element.length - 1, 1);
        // this.arrsTheOPG[i].splice(element.length - 1, 1);
      }); //   }
      // });
      console.log(this.arrsTheOP);
      // console.log(this.arrsTheOPG);
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
          buildPath(
            [
              ...path,
              {
                Desc: null,
                DescQustions: questions[questionIndex + 1]
                  ? questions[questionIndex + 1].Desc
                  : null,
              },
            ],
            questionIndex + 1
          );
        } else {
          currentQuestion.op.forEach((option) => {
            option.DescQustions = currentQuestion.Desc;
            let newPath = [...path, option];
            if (option.NextQuestionId === null) {
              newPath = [
                ...newPath,
                {
                  Desc: null,
                  DescQustions: questions[questionIndex + 1]
                    ? questions[questionIndex + 1].Desc
                    : null,
                },
              ];
              allPaths.push(newPath);
            } else {
              let nextIndex = questions.findIndex(
                (q) => q.Id === option.NextQuestionId
              );

              for (let i = questionIndex + 1; i < nextIndex; i++) {
                newPath = [
                  ...newPath,
                  {
                    Desc: null,
                    DescQustions: questions[questionIndex + 1]
                      ? questions[questionIndex + 1].Desc
                      : null,
                  },
                ];
              }

              buildPath(newPath, nextIndex);
            }
          });

          if (
            currentQuestion.op.some((option) => option.NextQuestionId !== null)
          ) {
            buildPath(
              [
                ...path,
                {
                  Desc: null,
                  DescQustions: questions[questionIndex + 1]
                    ? questions[questionIndex + 1].Desc
                    : null,
                },
              ],
              questionIndex + 1
            );
          }
        }
      };

      buildPath([], 0);

      allPaths = allPaths.filter((e, i, arr) => e[0].Desc);
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
      console.log({ arrIds, Score, i });
      this.LoadingButton = true;
      let { data } = await this.$ax.post(URL + "deleteScore", {
        arrIds,
        Score,
        Qushinnare: this.activQushinnare,
      });

      this.LoadingButton = false;
      if (data) {
        this.$message.success("נמחק בהצלחה");
        this.ModelInputL[`Model-${i}`] = "";
      } else {
        this.$message.error("משהו השתבש");
      }
    },
    EventChange(val) {
      this.ShowLomatz = false;
      this.arrsTheOP = this.arrsTheOPG;
      // console.log(this.ModelSelect);
      if (val !== "ניתן ציון" || val !== "לא ניתן ציון" || val !== "הכל") {
        val = this.ValRadio;
      }
      this.arrsTheOP = this.arrsTheOP.filter((e, i, arr) => {
        if (val === "ניתן ציון") {
          let i = e[e.length - 2];
          return Boolean(this.ModelInputL[`Model-${i}`]);
        } else if (val === "לא ניתן ציון") {
          return !Boolean(this.ModelInputL[`Model-${i}`]);
        } else {
          return true;
        }
      });

      for (const [key, value] of Object.entries(this.ModelSelect)) {
        if (value) {
          // console.log({ key, value });
          let i = key.split("-")[1];
          // console.log({ key, value, i });
          this.arrsTheOP = this.arrsTheOP.filter((e) => {
            if (value === "ריק") {
              return e[i].Desc === null;
            }
            if (i !== e.length - 1 && i !== e.length - 2) {
              // console.log(e);
              return e[i] && e[i].Desc === value;
            }
          });
        }
      }
      if (this.arrsTheOP.length === 0) {
        let arr = [];
        for (const key in this.ModelSelect) {
          arr.push(this.ModelSelect[key]);
        }
        this.ShowLomatz = true;
        this.ArrLoMatzanu = arr;
      }
    },
    ResetSelects() {
      for (const key in this.ModelSelect) {
        if (this.ModelSelect[key]) {
          this.ModelSelect[key] = "";
          let i = key.split("-")[1];
          let el = this.$refs[`ComponentSelect${i}`];
          el[0].resizeTo();
        }
      }
      this.EventChange();
    },
  },
};
</script>
<style scoped>
.parentsSelects {
  display: flex;
  flex-direction: row-reverse;
  position: relative;
  left: 2%;
  top: 160px;
  width: 99%;
  background: rgba(0, 0, 0, 0.556);
  padding: 15px;
  border-radius: 20px;
  padding-right: 0px;
}
.Selects {
  margin-right: 50px;
}
/* .Boxo {
  width: auto;
  border-radius: 20px;
  background: rgb(204, 38, 246);
  background: linear-gradient(to right, rgb(204, 38, 246), #c344f1, #b129ff);
  margin-top: 10px;
  text-align: right;
  font-size: 13px;
  transition: all 0.3s;
  height: 50px;
  padding: 5px;
  margin-right: 20px;
  color: rgb(0, 0, 0);
} */
.Boxo {
  width: auto;
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
  overflow-x: hidden;
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
.Radioz {
  position: relative;
  left: 43%;
  top: 110px;
}
.LoNimtzeou {
  position: relative;
  left: 17%;
  top: 300px;
  font-size: 23px;
}
.LoNimtzeou .title {
  /* text-align: center; */
  position: relative;
  left: 26%;
  font-size: 30px;
  width: 240px;
  border-bottom: 4px solid black;
  text-align: center;
}
.LoNimtzeou .ValRadio {
  /* text-align: center; */
  position: relative;
  left: 26%;
  border-bottom: 3px solid black;
  width: 200px;
  text-align: center;
  top: 100px;
}
.Haze {
  display: flex;
  flex-direction: row;
  background: rgb(22, 115, 186);
  width: calc(100% - 400px);
  padding: 15px;
  border-radius: 20px;
}
.Haze-item {
  margin-right: 20px;
  text-align: center;
}
.i {
  position: absolute;
  right: 1px;
  top: 0;
  background: rgb(27, 175, 255);
  padding: 5px;
  border-radius: 0px 0px 0 14px;
}
.ButtonReset {
  background: rgb(169, 23, 236);
  border: none;
  color: black;
  position: relative;
  left: 73.5%;
  top: 160px;
  margin: 10px;
  width: 110px;
}
.ButtonReset:hover {
  background: rgb(142, 50, 185);
  font-size: 23px;
  top: 150px;
  margin-right: 20px;
}
</style>
<style></style>
