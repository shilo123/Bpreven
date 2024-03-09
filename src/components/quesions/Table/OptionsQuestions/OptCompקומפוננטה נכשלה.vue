<template>
  <!-- <div>{{ props.DescDataType }}</div> -->
  <div>
    <div class="Options" v-show="row.DescDataType === 'OptionId'">
      <!-- <el-button
        type="primary"
        @click="$ConSol(row)"
        style="position: absolute; right: 0"
      ></el-button> -->
      <div v-show="theOption.length > 0">
        <label
          :class="{
            DefaultSelectLabel: !wachtStore,
            DefaultSelectLabelBig: wachtStore,
          }"
          >כל האופציות</label
        >
        <el-select
          v-model="DefoltSelsct"
          placeholder="כל השאלות פה"
          :class="{
            DefaultSelect: !wachtStore,
            DefaultSelectBig: wachtStore,
          }"
          @change="SelectFromAll(DefoltSelsct, IdniFtah, row)"
        >
          <el-option value="לפי האופציה"></el-option>
          <el-option value="שאלה אחרונה"></el-option>
          <el-option
            v-for="(q, i) in Alldata.questionsOnly"
            :key="i"
            :label="q.Desc"
            :value="q.Id"
            v-show="q.Seq > activQ.Seq"
          ></el-option>
        </el-select>
        <div class="parentsheaderOFAnswers">
          <h1
            :class="{
              headerOFAnswers: !wachtStore,
              headerOFAnswersBig: !!wachtStore,
            }"
          >
            אופציות
          </h1>
        </div>
        <ul class="Answers">
          <draggable
            v-model="theOption"
            @end="EventChangeOption($event, row.Id)"
          >
            <li
              v-for="(O, i) in theOption"
              :key="i"
              class="button-and-li"
              :class="{ bigScreenOPtion: wachtStore }"
              :id="O.Id"
            >
              <span
                @mouseover="overSpan = true"
                @mouseleave="overSpan = false"
                ref="StamSpan"
                >{{ O.Desc }}</span
              >
              <div class="ParentsAdcen">
                <el-button
                  class="buttonUP"
                  type="primary"
                  size="mini"
                  v-show="O.Id"
                  @click="UpdateOption(O.Id)"
                  >עדכן</el-button
                >
              </div>

              <div class="Del-andComp">
                <div class="indeSel">
                  <el-select
                    v-if="Show"
                    v-model="ModelQestions[`op-${O.Id}`]"
                    placeholder="השאלה הבאה"
                    size="medium"
                    @change="
                      changeEventOptions(ModelQestions[`op-${O.Id}`], O.Id)
                    "
                  >
                    <el-option value="ללא שאלה הבאה"></el-option>
                    <el-option
                      v-for="(q, i) in Alldata.questionsOnly"
                      :key="i"
                      :value="q.Id"
                      :label="q.Desc"
                      v-show="q.Seq > activQ.Seq"
                    >
                    </el-option>
                  </el-select>
                  <!-- <button
                    @click="
                      $ConSol({
                        imze: OptheOption[`showButton-${O.Id}`],
                        id: O.Id,
                        Onjo: OptheOption,
                      })
                    "
                  >
                    ClickShashlick
                  </button> -->
                  <el-button
                    type="primary"
                    size="mini"
                    class="buutonOF"
                    :loading="LoadingButton"
                    v-show="OptheOption[`showButton-${O.Id}`]"
                    @click="
                      AddNewQuestion(
                        O.Id,
                        ModelQestions[`op-${O.Id}`],
                        IdniFtah
                      )
                    "
                    >שמור</el-button
                  >
                </div>
                <el-button
                  type="danger"
                  size="mini"
                  @click="DeleteAnswerTHEshows(O.Id)"
                  v-show="O.Id"
                  >מחק</el-button
                >
              </div>
            </li>
          </draggable>
          <el-divider></el-divider>
          <el-button
            :class="{
              buttonSuccessBig: wachtStore,
              buttonSuccess: !wachtStore,
            }"
            type="success"
            @click="
              $emit('newComponent', 'AddAnswer');
              ModelInputDivAnswer = 'AddAnswer';
            "
            >הוספה</el-button
          >
        </ul>
      </div>
      <div v-show="!theOption.length > 0" class="Div-else-show">
        <ul class="Answers">
          <li class="button-and-li EN">
            <span
              contenteditable="true"
              ref="inptutDiv"
              @input="inptutDiv"
            ></span>
            <el-button
              class="Button_Beayot"
              type="success"
              @click="ADDnewtAnswer(row.Id, ModelInputDivAnswer)"
              :loading="LoadingButton"
              v-show="ModelInputDivAnswer"
              >הוסף</el-button
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="Date" v-show="row.DescDataType === 'Date'">תאריך</div>
    <div class="Text" v-show="row.DescDataType === 'Text'">טקסט</div>
    <div class="Numeric" v-show="row.DescDataType === 'Numeric'">מספר</div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import draggable from "vuedraggable";

export default {
  name: "BprevenOptComp",
  props: ["propso", "DefoltSelsctProps"],
  components: { draggable },
  data() {
    return {
      DefoltSelsct: this.DefoltSelsctProps,
      row: this.propso,
      theOption: [],
      //   wachtStore,
      IdniFtah: "",
      Alldata: {},
      overSpan: false,
      ModelQestions: {},
      LoadingButton: false,
      OptheOption: {},
      ModelInputDivAnswer: "",
      activQ: "",
      IdShinuy: {},
      Show: true,
    };
  },

  async mounted() {
    // console.log(this.DefoltSelsct);
    // console.log({ ...this.props });
    await this.$store.dispatch("fetchData");

    this.Alldata.Allquestions = this.$store.state.AllData.Allquestions;
    this.Alldata.questionsOnly = this.$store.state.AllData.questionsOnly;
    this.Alldata.DataType = this.$store.state.AllData.DataType;
    this.Alldata.NameQuen = this.$store.state.AllData.NameQuen;
    this.data = this.$store.state.data;
    // idShowButton
    setTimeout(() => {
      this.OptheOption[`showButton-${this.$store.state.idShowButton}`] = true;
    }, 200); // console.log(this.OptheOption);
    console.log(
      "🚀 ~ mounted ~ this.$store.state.idShowButton:",
      this.$store.state.idShowButton
    );
    if (this.theOption.length === 0) {
      //   this.theOption = this.$store.state.theOption;
      //   if (this.$store.state.theOption.length === 0) {
      //   }
    }
  },
  computed: {
    // defS() {
    //   return this.$store.state.TAndO.DefaultSelect;
    // },
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
    DescDefaultSelect() {
      return this.$store.state.data.find((e) => {
        // console.log("e", e);
        // console.log("this.DefoltSelsct", this.DefoltSelsct);
        // console.log("e.Id === this.DefoltSelsct", e.Id === this.DefoltSelsct);
        return e.Id === this.DefoltSelsct;
      }).Desc;
    },
  },
  watch: {
    theOption(val) {
      this.$store.commit("UptheOption", val);
    },
    DefoltSelsct(val) {
      console.log(val);
      this.$emit("SaveVal", val);
    },
  },
  methods: {
    UpdateVars(
      valModelQestions,
      valactivQ,
      valtheOption,
      valModelInputDivAnswer,
      valAlldataQuestionsOnly,
      valDefoltSelsct
    ) {
      this.ModelQestions = valModelQestions;
      this.activQ = valactivQ;
      this.theOption = valtheOption;
      this.ModelInputDivAnswer = valModelInputDivAnswer;
      this.Alldata.questionsOnly = valAlldataQuestionsOnly;
      this.DefoltSelsct = valDefoltSelsct;
      //   console.log({
      //     valModelQestions,
      //     valactivQ,
      //     valtheOption,
      //     valModelInputDivAnswer,
      //     valAlldataQuestionsOnly,
      //     valDefoltSelsct,
      //   });
    },
    SortTable() {
      this.$emit("SortTable");
    },
    RafreseTable() {
      this.$emit("RafreseTable");
    },
    SelectFromAll(val, id, row) {
      let ifFeatch = false;
      // this.beforModelQestions = this.ModelQestions;
      if (val !== "שאלה אחרונה" && val !== "לפי אופציה") {
        for (const key in this.ModelQestions) {
          if (val !== "לפי האופציה") {
            this.ModelQestions[key] = val;
          }
        }
      }
      if (
        val === "לפי האופציה" &&
        Object.keys(this.beforModelQestions).length !== 0
      ) {
        this.ModelQestions = this.beforModelQestions;
      }
      if (val === "שאלה אחרונה") {
        for (const key in this.ModelQestions) {
          this.ModelQestions[key] = "ללא שאלה הבאה";
        }
        let IactivRow = this.data.findIndex((e) => e.Id === id);
        this.data[IactivRow].IsEnd = true;
      } else {
        let IactivRow = this.data.findIndex((e) => e.Id === id);
        this.data[IactivRow].IsEnd = false;
      }

      const IdofQuestions = id;
      let valTheOp;
      for (const key in this.ModelQestions) {
        valTheOp = this.ModelQestions[key];
        ifFeatch = true;
      }
      if (ifFeatch) {
        this.AddNewQuestionALL(valTheOp, IdofQuestions);
      }
      //   this.LoadingOptionss = false;
      //   this.$emit("LoadingOptionss", false);

      setTimeout(() => {
        // this.LoadingOptionss = true;
        // this.$emit("LoadingOptionss", true);
        // $

        setTimeout(() => {
          this.$emit("UpdateData");
        }, 400);
      }, 100);
    },
    async EventChangeOption(val, id) {
      await this.$nextTick();
      console.log(val.from.children);
      let arr = [];
      Array.from(val.from.children).forEach((item, i) => {
        // console.log(item.id, i + 1);
        arr.push({ id: item.id, newSek: i + 1 });
      });
      console.log(arr);
      let QuestionId = id;
      const params = { arr, QuestionId };
      // console.log(params);
      let { data } = await this.$ax.post(URL + "updateSek", params);
      if (data) {
        this.$message.success("סדר האופציות עודכן בהצלחה");
      } else {
        this.$message.error("משהו השתבש");
      }
    },
    UpdateOption(id) {
      let OptionOfUp = this.theOption.find((e) => e.Id === id);
      console.log(OptionOfUp);
      this.$emit("newComponent", "EditOption");
      this.$emit("ParamsEditOption", OptionOfUp);

      // console.log(OptionOfUp);
      //UpdateOption
    },
    async AddNewQuestion(idOfOption, nextQusions, IdQuestion, bool) {
      // console.log({ idOfOption, nextQusions, IdQuestion });
      this.beforModelQestions = this.ModelQestions;
      let values = Object.values(this.ModelQestions);
      // console.log(values);
      const boolian = values.every((val) => val === values[0]);
      if (boolian) {
        this.DefoltSelsct = values[0];
        if (values[0] === "ללא שאלה הבאה") {
          let IactivRow = this.data.findIndex((e) => e.Id === IdQuestion);
          this.data[IactivRow].IsEnd = true;
        }
      } else {
        this.DefoltSelsct = "לפי האופציה";
        let IactivRow = this.data.findIndex((e) => e.Id === IdQuestion);
        this.data[IactivRow].IsEnd = false;
      }
      await this.$ax.post(URL + "UpNextQuestion", {
        val: this.DefoltSelsct,
        id: IdQuestion,
      });
      const params = { idOfOption, nextQusions, IdQuestion };
      this.LoadingButton = true;

      let { data } = await this.$ax.post(URL + "addNewQustionsId", params);
      this.LoadingButton = false;
      if (data) {
        if (!bool) {
          this.$message.success("השאלה הבאה עודכנה");
        }
      } else {
        this.$message.error("משהו השתבש אחי");
      }
      this.OptheOption[`showButton-${idOfOption}`] = false;
      this.AllnextQuestion = this.DefoltSelsct;
      setTimeout(() => {
        this.$emit("UpdateData");
      }, 400);
    },
    changeEventOptions(val, id) {
      this.OptheOption[`showButton-${id}`] = true;
      //   console.log(this.ModelQestions);
      //   console.log(val);
      //   this.LoadingOptionss = false;
      this.$store.commit("SaveShowButton", id);
      this.$emit("LoadingOptionss");

      //   setTimeout(() => {
      //     // this.LoadingOptionss = true;
      //     this.$emit("LoadingOptionss", true);
      //   }, 0);
      //   console.log(this.Alldata.questionsOnly);
      //   this.Show = false;
      //   setTimeout(() => {
      //     this.Show = true;
      //     console.log(this.Alldata.questionsOnly);
      //   }, 0);
    },
    DeleteAnswerTHEshows(id) {
      this.$emit("paramsOfDeleteOp", id, this.theOption);
      this.$emit("newComponent", "DeleteAnswer");
    },
    async ADDnewtAnswer(id, text) {
      this.LoadingButton = true;
      if (text) {
        try {
          await this.$ax.post(URL + "AddAnswer", { text, id });
          this.$message.success("התשובה נוספה");
          this.theOption.push({ Desc: text });
          // this.shows.showDivos = false;
          // this.RafreseTable();
        } catch (error) {
          this.$message.error("משהו השתבש");
          console.log(error);
        } finally {
          this.LoadingButton = false;
        }
        // console.log(data);
      }
    },
    inptutDiv(e) {
      // console.log(e.target.innerText);
      this.ModelInputDivAnswer = e.target.innerText;
    },
  },
};
</script>

<style lang="scss" scoped>
.Options {
  .DefaultSelectLabel {
    position: absolute;
    left: 160px;
    z-index: 2;
    top: 30px;
    font-size: 20px;
    transition: all 0.3s;
    &Big {
      position: absolute;
      left: 300px;
      z-index: 2;
      top: 50px;
      font-size: 20px;
      transition: all 0.3s;
    }
  }
  .DefaultSelect {
    position: absolute;
    left: 20px;
    z-index: 2;
    top: 60px;
    width: 350px;
    color: blue;
    transition: all 0.3s;
    &Big {
      position: absolute;
      left: 160px;
      z-index: 2;
      top: 80px;
      width: 350px;
      color: blue;
      transition: all 0.3s;
    }
  }
  .parentsheaderOFAnswers {
    background: linear-gradient(
      rgb(255, 251, 184),
      rgb(210, 206, 136),
      rgb(226, 219, 161)
    );
    padding: 30px;
    position: relative;
    top: 11px;
    .headerOFAnswers {
      text-align: center;
      /* margin-bottom: 20px; */
      /* background: rgb(255, 116, 116); */
      width: 400px;
      margin: 0;
      position: relative;
      left: 32.7%;
      border-radius: 15px;
      color: black;
      &Big {
        position: relative;
        left: 52.3%;
      }
    }
  }
  .Answers {
    /* background: rgba(252, 255, 152, 0.619); */
    background: linear-gradient(
      rgb(255, 251, 184),
      rgb(210, 206, 136),
      rgb(226, 219, 161)
    );
    text-align: center;
    direction: rtl;
    list-style-position: inside;
    padding: 15px;
    .button-and-li {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      .el-button--primary.buttonUP {
        background: rgba(4, 82, 252, 0.822);
        position: absolute;
        right: 30%;
        top: 7px;
        &:hover {
          background: rgba(4, 83, 252, 0.434);
        }
      }
      .el-button--danger {
        background: rgba(252, 4, 4, 0.822);
        position: absolute;
        top: 7px;
        left: 30%;
        &:hover {
          background: rgba(252, 4, 4, 0.327);
        }
      }
      span {
        background: rgb(206, 69, 0);
        flex-basis: 190px;
        // max-width: 190px;
        width: 200px;

        margin-bottom: 20px;
        height: auto;
        color: white;
        position: relative;
        top: 0;
        right: 41%;
        overflow-y: auto;
        padding: 10px;
        border-radius: 20px;
        transition: all 0.3s;
        &:hover {
          background: rgba(206, 69, 0, 0.821);
          cursor: grab;
        }
      }
      .indeSel {
        position: absolute;
        top: 0;
      }
      span:active {
        cursor: move;
        background: rgb(255, 0, 0);
      }
    }
    .bigScreenOPtion {
      align-items: center;
      justify-content: space-between;
      position: relative;
      left: 140px;
      span {
        position: relative;
        // right: 620px;
        right: 870px;
      }
      .el-button--primary.buttonUP {
        right: 40%;
        top: 3px;
      }
      .el-button--danger {
        top: 3px;
        // top: 0;
        left: 20%;
      }
    }
    .Del-andComp {
      .indeSel {
        position: absolute;
        left: 90px;
        width: 190px;
      }
      .indeSel {
        .buutonOF {
          background: rgb(73, 0, 200);
          position: absolute;
          left: -80px;
          top: 5px;
        }
        .shord {
          position: absolute;
          left: -80px;
          top: 5px;
        }
      }
    }
  }
  .buttonSuccess:not(.EN .el-button--success) {
    background: rgb(46, 156, 46);
    width: 300px;
    transition: all 0.3s;
    position: relative;
    left: 30px;
  }
  .buttonSuccess:hover:not(.EN .el-button--success) {
    background: rgba(46, 156, 46, 0.589);
    width: 300px;
    font-size: 18px;
    transition: all 0.3s;
  }
}
</style>
