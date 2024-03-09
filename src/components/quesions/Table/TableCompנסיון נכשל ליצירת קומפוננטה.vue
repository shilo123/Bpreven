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
          <Options
            :propso="props.row"
            :DefoltSelsctProps="DefoltSelsct"
            ref="Option"
            @SortTable="SortTable"
            @RafreseTable="RafreseTable"
            @SaveVal="DefoltSelsct = $event"
            @IdniFtah="$emit('IdniFtah', $event)"
            @UpdateData="$emit('UpdateData')"
            @LoadingOptionss="RafreshLoadingOptionss"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import Options from "./OptionsQuestions/OptComp.vue";
export default {
  name: "BprevenTableComp",
  components: { Options },
  data() {
    return {
      data: [],
      loadingTABLE: false,
      LoadingButton: false,
      LoadingOptionss: true,
      RafreshTable: true,
      overSpan: false,
      ifOptions: false,
      showHosef: {},
      OptheOption: {},
      ModelQestions: {},
      activQ: {},
      showSelectOfNextQuestion: {},
      ModelOfNewNextQuestion: {},
      rowEdit: {},
      IdShinuy: {},
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
    DescDefaultSelect() {
      return this.$store.state.data.find((e) => e.Id === this.DefoltSelsct)
        .Desc;
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
      // console.log(val);
      // this.$store.commit("TAndO/Set_Select", val);
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
    /////////////
    Ifloading(val) {
      if (val.length) {
        this.loadingTABLE = false;
      } else {
        this.loadingTABLE = true;
      }
    },
    async GetOptions(row, expanded) {
      // this.GetOptions(row, expanded)

      this.ModelQestions = [];
      await this.$nextTick();
      this.activQ = row;
      // console.log(row);
      if (row.DescDataType === "OptionId") {
        this.IdniFtah = row.Id;
        this.$emit("IdniFtah", row.Id);
        // console.log(expanded);
        if (expanded.length === 0) {
          this.theOption = [];
          this.ModelInputDivAnswer = "";
          this.SortTable();
          this.RafreseTable();
          this.IdShinuy[`Item-${row.Id}`] = this.DescDefaultSelect;
          setTimeout(() => {
            this.$emit("UpdateData");
            // console.log("UP");
          }, 2000);
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
              this.ModelQestions[`op-${element.Id}`] = element.NextQuestionId;
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
      if (expanded.length !== 0) {
        // let ValDefaultSelect = ""
        let values = Object.values(this.ModelQestions);
        // console.log(values);
        const boolian = values.every((val) => val === values[0]);
        if (boolian) {
          // console.log("values[0]", values[0]);
          this.DefoltSelsct = values[0];
          this.AllnextQuestion = values[0];
        } else {
          this.DefoltSelsct = "לפי האופציה";
        }
      }
      const interval = setInterval(() => {
        if (this.$refs.StamSpan) {
          // console.log(this.$refs.StamSpan);
          // this.$refs.StamSpan.forEach((el) => {
          //   el.addEventListener("mousemove", (e) => {
          //     el.style.position = "relative";
          //     console.log(el);
          //   });
          // });
          clearInterval(interval);
        }
      }, 500);
      const intervaleishen = setInterval(() => {
        if (this.$refs.Option) {
          this.ifOptions = true;
          this.$refs.Option.UpdateVars(
            this.ModelQestions,
            this.activQ,
            this.theOption,
            this.ModelInputDivAnswer,
            this.Alldata.questionsOnly,
            this.DefoltSelsct
          );
          clearInterval(intervaleishen);
        }
      }, 100);
      // setTimeout(() => {
      //   if (!this.$refs.Option) {
      //     console.log("this.$refs.Option", this.$refs.Option);
      //     clearInterval(intervaleishen);
      //     if (!Rayhel) {
      //       console.log(Rayhel);
      //       this.$message.error("משהו השתבש");
      //     }
      //   }
      // }, 3000);
      // console.log("this.$refs.Option", this.$refs.Option);
    },
    Delete(row) {
      // console.log(row);
      this.$emit("IdOfDelq", row.Id);
      this.$emit("newComponent", "warning");
      this.$store.commit("CommitRow", row);
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
    async AddNewQuestionALL(nextQusions, IdQuestion) {
      // console.log({ nextQusions, IdQuestion });
      const params = { nextQusions, IdQuestion };
      // // console.log(params);
      let { data } = await this.$ax.post(
        URL + "addNewQustionsIdSAndOption",
        params
      );
      if (data) {
        this.$message.success("השאלות הבאות עודכנו");
      } else {
        this.$message.error("משהו השתבש אחי");
      }
      // this.OptheOption[`showButton-${idOfOption}`] = false;
      // this.AllnextQuestion = this.DefoltSelsct;
    },
    TextOfNewqusetions(row) {
      // console.log(row);
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
        if (
          table &&
          table.children &&
          table.children[1] &&
          table.children[1].children[0] &&
          table.children[1].children[0].children[1] &&
          table.children[1].children[0].children[1].children[0] &&
          table.children[1].children[0].children[1].children[0].children
        ) {
          if (
            table &&
            table.children &&
            table.children[1] &&
            table.children[1].children[0] &&
            table.children[1].children[0].children[1] &&
            table.children[1].children[0].children[1].children[0]
          ) {
            let TableHeader =
              table.children[1].children[0].children[1].children[0].children;
            if (
              TableHeader
              // &&
              // TableHeader.children[1].TableHeader.children[1].children[0]
            ) {
              Array.from(TableHeader).forEach((element) => {
                element.style.textAlign = "center";
              });
            }
            let tds = table.children[2].children[0].children[1].children;
            //   console.log(tds);
            Array.from(tds).forEach((element, i) => {
              let elco;
              elco = element.children[8].children[0].children[0].children[0];
              elco.classList = "el-icon-arrow-left";
              Array.from(element.children).forEach((el) => {
                el.style.textAlign = "right";
                el.dir = "rtl";
              });
            });
          }
        }
      } catch (error) {
        // console.log("SortTableERROR", error);
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
    UpData(val) {
      this.data = val;
      // console.log("sd");
    },
    RafreshLoadingOptionss() {
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
        const intervaleishen = setInterval(() => {
          if (this.$refs.Option) {
            this.ifOptions = true;
            this.$refs.Option.UpdateVars(
              this.ModelQestions,
              this.activQ,
              this.theOption,
              this.ModelInputDivAnswer,
              this.Alldata.questionsOnly,
              this.DefoltSelsct
            );
            clearInterval(intervaleishen);
          }
        }, 0);
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
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
  gap: 5px;
  // .el-button {
  //   margin: 3px;
  // }
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
  position: absolute;
  top: -45px;
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
