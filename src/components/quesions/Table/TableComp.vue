<template>
  <div>
    <el-table
      :data="data"
      :class="{ table: !wachtStore, bigTable: wachtStore }"
      height="100%"
      ref="Table"
      row-key="Id"
      border
      v-if="RafreshTable"
      v-loading="loadingTABLE || !showTable"
      @expand-change="GetOptions"
      @row-dblclick="Edit"
    >
      <!-- v-show="showTable" -->
      <el-table-column label="אופציות" ref="Clumn" width="180">
        <template slot-scope="scope">
          <div class="buttons">
            <el-button
              type="danger"
              size="mini"
              class="el-icon-delete"
              @click="Delete(scope.row)"
              >מחיקה</el-button
            >
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="Edit(scope.row)"
              >עריכה</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="אם פעיל">
        <template slot-scope="scope">
          {{ scope.row.StatusId === 1 ? "כן" : "לא" }}
        </template>
      </el-table-column>
      <el-table-column
        label="סדר"
        prop="Seq"
        :width="wachtStore ? 150 : 60"
      ></el-table-column>
      <!-- v-if="wachtStore" -->
      <el-table-column label="אם אחרון">
        <template slot-scope="scope">
          {{ computedOfisEnd(scope.row.IsEnd) }}
        </template>
      </el-table-column>
      <el-table-column label="סוג התשובה">
        <template slot-scope="scope">
          {{ computedData(scope.row.DescDataType) }}
        </template>
      </el-table-column>
      <el-table-column label="השאלה הבאה">
        <template slot-scope="scope">
          <div
            v-show="scope.row.IsEnd"
            style="border-bottom: 2px solid red; font-size: 16px"
          >
            זאת שאלה אחרונה
          </div>
          <div v-show="!scope.row.IsEnd">
            {{ TextOfNewqusetions(scope.row) }}
            <div v-show="showHosef[`item-${scope.row.Id}`]">
              <el-button
                v-if="!showSelectOfNextQuestion[`item-${scope.row.Id}`]"
                type="warning"
                class="ButtonAddNewNextQustion"
                size="medium"
                @click="
                  RafreseTable();
                  showSelectOfNextQuestion[`item-${scope.row.Id}`] = true;
                "
                ><i class="el-icon-circle-plus"></i> הוסף
              </el-button>

              <el-select
                v-show="showSelectOfNextQuestion[`item-${scope.row.Id}`]"
                v-model="ModelOfNewNextQuestion[`item-${scope.row.Id}`]"
                placeholder="שאלה הבאה"
                size="medium"
                @change="
                  AddNewQuestionOfNoOp(
                    ModelOfNewNextQuestion[`item-${scope.row.Id}`],
                    scope.row.Id
                  )
                "
              >
                <el-option value="ללא שאלה הבאה"></el-option>
                <el-option
                  v-for="(a, i) in Alldata.Allquestions[
                    scope.row.DescQuestionnaire
                  ]"
                  :key="i"
                  :value="a.Id"
                  :label="a.Desc"
                  v-show="a.Desc !== scope.row.Desc"
                ></el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="שאלה" prop="Desc" autoFit></el-table-column>

      <el-table-column label="שאלון" prop="DescQuestionnaire"></el-table-column>
      <el-table-column type="expand" v-if="LoadingOptionss">
        <template slot-scope="props">
          <div class="Options" v-show="props.row.DescDataType === 'OptionId'">
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
                @change="SelectFromAll(DefoltSelsct, IdniFtah, props.row)"
              >
                <el-option value="לפי האופציה"></el-option>
                <el-option value="שאלה אחרונה"></el-option>
                <el-option
                  v-for="(q, i) in Alldata.questionsOnly"
                  :key="i"
                  :value="q.Desc"
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
                  @end="EventChangeOption($event, props.row.Id)"
                >
                  <li
                    v-for="(O, i) in theOption"
                    :key="i"
                    class="button-and-li"
                    :class="{ bigScreenOPtion: wachtStore }"
                    :id="O.Id"
                  >
                    <span>{{ O.Desc }}</span>
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
                          v-model="ModelQestions[`op-${O.Id}`]"
                          placeholder="השאלה הבאה"
                          size="medium"
                          @change="
                            changeEventOptions(
                              ModelQestions[`op-${O.Id}`],
                              O.Id
                            )
                          "
                        >
                          <el-option value="ללא שאלה הבאה"></el-option>
                          <el-option
                            v-for="(q, i) in Alldata.questionsOnly"
                            :key="i"
                            :value="q.Desc"
                            v-show="q.Seq > activQ.Seq"
                          >
                            <!-- :style="
                              // bodek({
                              //   q: q.Seq,
                              //   activQ: activQ.Seq,
                              //   BoolBool: q.Seq > activQ.Seq,
                              // })
                            " -->
                          </el-option>
                        </el-select>
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
                    type="success"
                    @click="ADDnewtAnswer(props.row.Id, ModelInputDivAnswer)"
                    :loading="LoadingButton"
                    v-show="ModelInputDivAnswer"
                    >הוסף</el-button
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="Date" v-show="props.row.DescDataType === 'Date'">
            תאריך
          </div>
          <div class="Text" v-show="props.row.DescDataType === 'Text'">
            טקסט
          </div>
          <div class="Numeric" v-show="props.row.DescDataType === 'Numeric'">
            מספר
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import draggable from "vuedraggable";
export default {
  name: "BprevenTableComp",
  components: { draggable },
  data() {
    return {
      StutSelectAll: false,
      data: [],
      loadingTABLE: false,
      LoadingButton: false,
      LoadingOptionss: true,
      RafreshTable: true,
      showHosef: {},
      OptheOption: {},
      ModelQestions: {},
      activQ: {},
      showSelectOfNextQuestion: {},
      ModelOfNewNextQuestion: {},
      rowEdit: {},
      IdShinuy: {},
      AllnextQuestion: "לפי האופציה",
      ModelInputDivAnswer: "",
      IdniFtah: "",
      DefoltSelsct: "לפי האופציה",
      Alldata: {
        Allquestions: [],
        questionsOnly: [],
        DataType: [],
        NameQuen: [],
      },
      theOption: [],
    };
  },
  computed: {
    showTable() {
      return !this.loadingTABLE ? this.data.length > 0 : true;
    },
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
    WachLoadingTable() {
      return this.$store.state.LoadingTable;
    },
    datos() {
      return this.$store.state.data;
    },
  },
  watch: {
    datos(val) {
      this.Ifloading(val);
    },
    theOption(val) {
      this.$store.commit("UptheOption", val);
    },
    loadingTABLE(val) {
      if (!val && this.$store.state.theOption.length === 0) {
        this.SortTable();
      }
    },
    WachLoadingTable(val) {
      this.loadingTABLE = val;
    },
    wachtStore(val) {
      setTimeout(() => {
        this.SortTable();
      }, 400);
    },
    DefoltSelsct(val) {
      this.AllnextQuestion = val;
    },
  },
  async mounted() {
    try {
      this.loadingTABLE = true;
      this.Ifloading(this.$store.state.data);
      await this.$store.dispatch("fetchData");
      this.Alldata.Allquestions = this.$store.state.AllData.Allquestions;
      this.Alldata.questionsOnly = this.$store.state.AllData.questionsOnly;
      this.Alldata.DataType = this.$store.state.AllData.DataType;
      this.Alldata.NameQuen = this.$store.state.AllData.NameQuen;
      this.data = this.$store.state.data;
      // console.log(this.data);

      this.loadingTABLE = false;
      await this.$nextTick();
      this.SortTable();
    } catch (error) {
      console.log(error);
      this.$message.error("משהו השתבש");
    }
  },

  methods: {
    Ifloading(val) {
      if (val.length) {
        this.loadingTABLE = false;
      } else {
        this.loadingTABLE = true;
      }
    },
    async GetOptions(row, expanded) {
      await this.$nextTick();
      this.activQ = row;
      // console.log(row);
      if (row.DescDataType === "OptionId") {
        this.IdniFtah = row.Id;
        this.$emit("IdniFtah", row.Id);
        if (expanded.length === 0) {
          this.theOption = [];
          this.ModelInputDivAnswer = "";
          this.SortTable();
          this.RafreseTable();
          this.IdShinuy[`Item-${row.Id}`] = this.DefoltSelsct;
        } else if (expanded.length !== 0) {
          this.loadingTABLE = true;
          this.LoadingOptionss = false;
          let { data } = await this.$ax.get(URL + "GetOption/" + row.Id);
          this.theOption = data;
          let res = await this.$ax.post(URL + "GetQestion", row);
          // console.log("data", data);
          this.Alldata.questionsOnly = res.data;
          data.forEach((element) => {
            this.OptheOption[`showButton-${element.Id}`] = false;
            this.OptheOption[`loading-${element.Id}`] = false;
            if (element.Nextques) {
              this.ModelQestions[`op-${element.Id}`] = element.Nextques;
            } else {
              this.ModelQestions[`op-${element.Id}`] = "ללא שאלה הבאה";
            }
          });
          // console.log(this.OptheOption);
          if (!this.theOption.length > 0) {
            setTimeout(() => {
              if (this.$refs.inptutDiv) {
                this.$refs.inptutDiv.focus();
              }
            }, 700);
          }
          setTimeout(() => {
            this.loadingTABLE = false;
            this.LoadingOptionss = true;
          }, 300);
        }
      }
      let values = Object.values(this.ModelQestions);
      const boolian = values.every((val) => val === values[0]);
      if (boolian) {
        this.DefoltSelsct = values[0];
        this.AllnextQuestion = values[0];
      }

      // console.log(data);
    },
    Delete(row) {
      // console.log(row);
      this.$emit("IdOfDelq", row.Id);
      this.$emit("newComponent", "warning");
    },
    Edit(row) {
      // console.log(row);
      let status = row.StatusId;
      this.rowEdit = row;
      this.rowEdit.StatusId = Boolean(status);
      if (
        this.rowEdit.DescDataType === "OptionId" ||
        this.rowEdit.DescDataType === "אופציות "
      ) {
      }
      if (!this.rowEdit.NextQuestionDesc) {
        this.rowEdit.NextQuestionDesc = this.DefoltSelsct;
      }
      if (this.rowEdit.IsEnd) {
        this.rowEdit.NextQuestionDesc = "שאלה אחרונה";
      }
      // console.log(this.rowEdit, this.DefoltSelsct);
      this.$emit("ParamsEditAddNewComponent", this.rowEdit);
      this.$emit("newComponent", "Edit");
    },
    DeleteAnswerTHEshows(id) {
      // console.log(id);
      //   this.$message.success("ds");
      this.$emit("paramsOfDeleteOp", id, this.theOption);
      this.$emit("newComponent", "DeleteAnswer");
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
      this.beforModelQestions = this.ModelQestions;
      let values = Object.values(this.ModelQestions);
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
      // console.log(params);
      this.LoadingButton = true;

      let { data } = await this.$ax.post(URL + "addNewQustionsId", params);
      this.LoadingButton = false;
      if (data) {
        if (!bool) {
          this.$message.success("השאלה הבאה עודכנה");
        }
        this.StutSelectAll = true;
      } else {
        this.StutSelectAll = false;
        this.$message.error("משהו השתבש אחי");
      }
      this.OptheOption[`showButton-${idOfOption}`] = false;
      this.AllnextQuestion = this.DefoltSelsct;
    },
    changeEventOptions(val, id) {
      this.OptheOption[`showButton-${id}`] = true;
      //   console.log(this.ModelQestions);
      //   console.log(val);
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 0);
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
    SelectFromAll(val, id, row) {
      this.beforModelQestions = this.ModelQestions;
      if (val !== "לפי אופציה") {
      }
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
      for (const key in this.ModelQestions) {
        let idofOpt = key.split("-")[1];
        let valTheOp = this.ModelQestions[key];
        let counter = 0;
        setTimeout(() => {
          counter++;
          this.AddNewQuestion(idofOpt, valTheOp, IdofQuestions, true);
          setTimeout(() => {
            if (this.StutSelectAll) {
              this.$message.success("השאלות הבאות עודכנו בהצלחה");
            } else {
              this.$message.success("משהו השתבש אחינו");
            }
          }, 100);
        }, 500);
      }
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 100);
    },
    TextOfNewqusetions(row) {
      if (this.IdShinuy[`Item-${row.Id}`] && row.DescDataType === "OptionId") {
        if (this.IdShinuy[`Item-${row.Id}`] !== "ללא שאלה הבאה") {
          return this.IdShinuy[`Item-${row.Id}`];
        }
      }
      if (!row.NextQuestionDesc && row.DescDataType === "OptionId") {
        return "לפי אופציה";
      } else if (row.NextQuestionDesc) {
        return row.NextQuestionDesc;
      } else {
        this.showHosef[`item-${row.Id}`] = true;
      }
    },
    RafreseTable() {
      this.RafreshTable = false;
      setTimeout(() => {
        this.RafreshTable = true;
      }, 0);
      setTimeout(() => {
        this.SortTable();
      }, 100);
    },
    SortTable() {
      try {
        let table = this.$refs.Table.$el;
        if (table.children[1].children[0].children[1].children[0].children) {
          let TableHeader =
            table.children[1].children[0].children[1].children[0].children;
          Array.from(TableHeader).forEach((element) => {
            element.style.textAlign = "center";
          });
          let tds = table.children[2].children[0].children[1].children;
          //   console.log(tds);
          Array.from(tds).forEach((element, i) => {
            let elco;
            elco = element.children[8].children[0].children[0].children[0];
            elco.classList = "el-icon-arrow-left";
            Array.from(element.children).forEach((el) => {
              el.style.textAlign = "right";
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    RafreshColumnOfOption(id) {
      setTimeout(() => {
        this.RafreseTable();
        console.log(id);
        let row = this.data.find((e) => e.Id === id);
        console.log(row);
        setTimeout(() => {
          this.$refs.Table.toggleRowExpansion(row);
        }, 100);
      }, 0);
    },
    computedOfisEnd(val) {
      if (val) {
        return "כן";
      } else {
        return "לא";
      }
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
      }
    },
    REVERScomputedData(val) {
      // console.log(val);
      if (val === "טקסט") {
        return "Text";
      } else if (val === "מספר") {
        return "Numeric";
      } else if (val === "אופציות") {
        return "OptionId";
      } else if (val === "תאריך") {
        return "Date";
      } else {
        return val;
      }
    },
    inptutDiv(e) {
      // console.log(e.target.innerText);
      this.ModelInputDivAnswer = e.target.innerText;
    },
    async AddNewQuestionOfNoOp(neXtQuestionsId, id) {
      this.RafreseTable();
      const params = { neXtQuestionsId, id };
      console.log(params);
      let { data } = await this.$ax.post(
        URL + "AddnewNextquestionNoOption",
        params
      );
      if (data) {
        this.$message.success("עודכן בהצלחה");
        window.location.reload();
      } else {
        this.$message.error("משהו השתבש");
      }
      // console.log(data);
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
    UpData(val) {
      this.data = val;
      console.log("sd");
    },
  },
};
</script>
<style scoped>
.table {
  width: 78%;
  position: absolute;
  top: 100px;
  margin-left: 80px;
  transition: all 0.3s;
}
.bigTable {
  width: 90%;
  position: absolute;
  top: 100px;
  margin-left: 80px;
  transition: all 0.3s;
}
.buttons {
  display: flex;
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
}
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
}
.headerOFAnswersBig {
  position: relative;
  left: 52.3%;
}
.Del-andComp .indeSel {
  position: absolute;
  left: 90px;
  width: 190px;
}
.Del-andComp .indeSel .buutonOF {
  background: rgb(73, 0, 200);
  position: absolute;
  left: -80px;
  top: 5px;
}
.Del-andComp .indeSel .shord {
  position: absolute;
  left: -80px;
  top: 5px;
}
.button-and-li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button-and-li .el-button {
  position: relative;
  /* left: 360px; */
  left: 313px;
  margin-bottom: 20px;
}
.button-and-li .el-button--primary.buttonUP {
  background: rgba(4, 82, 252, 0.822);
}
.button-and-li .el-button--primary:hover {
  background: rgba(4, 83, 252, 0.434);
}
.button-and-li .el-button--danger {
  background: rgba(252, 4, 4, 0.822);
}
.button-and-li .el-button--danger:hover {
  background: rgba(252, 4, 4, 0.327);
}
.button-and-li span {
  flex-grow: 1;
  background: rgb(206, 69, 0);
  flex-basis: 190px; /* רוחב התחלתי */
  max-width: 190px; /* מקסימום רוחב */
  margin-bottom: 20px;
  height: auto;
  color: white;
  position: relative;
  right: 450px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 20px;
  transition: all 0.3s;
}
.button-and-li span:hover {
  background: rgba(206, 69, 0, 0.821);
  cursor: grab;
}
.bigScreenOPtion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  left: 140px;
}
.bigScreenOPtion span {
  position: relative;
  right: 620px;
}

.button-and-li span:active {
  cursor: move;
  background: rgb(255, 0, 0);
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
.ButtonAndLi {
  display: flex;
}
.Div-else-show {
  text-align: center;
}
.Div-else-show .el-button {
  width: 400px;
  font-size: 20px;
  margin: 50px;
  height: 70px;
}
.Div-else-show .el-button:hover {
  width: 430px;
  font-size: 25px;
  /* margin: 30px; */

  height: 60px;
  color: #000;
}
.EN span {
  margin: 0;
}
.EN .el-button--success {
  width: 200px;
  font-size: 15px;
  height: 3em;
  position: absolute;
  bottom: -11px;
  left: 50px;
  margin-left: 220px;
}
.EN .el-button--success:hover {
  width: 200px;
  font-size: 15px;
  height: 3em;
  color: #34495e;
}
.Date,
.Text,
.Numeric {
  text-align: center;
  font-size: 20px;
  background: rgba(227, 224, 47, 0.615);
  border-radius: 15px;
  padding: 15px;
}
.ButtonAddNewNextQustion {
  width: 130px;
}
.DefaultSelect {
  position: absolute;
  left: 20px;
  z-index: 2;
  top: 60px;
  width: 350px;
  color: blue;
  transition: all 0.3s;
}
.DefaultSelectLabel {
  position: absolute;
  left: 160px;
  z-index: 2;
  top: 30px;
  font-size: 20px;
  transition: all 0.3s;
}
.DefaultSelectBig {
  position: absolute;
  left: 160px;
  z-index: 2;
  top: 80px;
  width: 350px;
  color: blue;
  transition: all 0.3s;
}
.DefaultSelectLabelBig {
  position: absolute;
  left: 300px;
  z-index: 2;
  top: 50px;
  font-size: 20px;
  transition: all 0.3s;
}
.buttonSuccessBig {
  background: rgb(46, 156, 46);
  width: 310px;
  position: relative;
  left: 80px;
  transition: all 0.3s;
}
.buttonSuccessBig:hover {
  background: rgba(46, 156, 46, 0.589);
  width: 310px;
  font-size: 20px;
  transition: all 0.3s;
}

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* עיצוב המגלגל (החלק שנע) */
::-webkit-scrollbar-thumb {
  background: rgb(158, 181, 255); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
  position: relative;
  top: 40px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(87, 87, 87, 0.7); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
}
</style>
<style></style>
