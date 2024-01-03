<template>
  <div>
    <el-table
      :data="data"
      :class="{ table: !wachtStore, bigTable: wachtStore }"
      height="100%"
      ref="Table"
      border
      v-show="data.length > 0"
      v-loading="loadingTABLE"
      v-if="RafreshTable"
      @expand-change="GetOptions"
    >
      <el-table-column label="אופציות" ref="Clumn">
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
          {{
            scope.row.StatusId === 1 || scope.row.StatusId
              ? "כן"
              : scope.row.StatusId === 0 || !scope.row.StatusId
              ? "לא"
              : ""
          }}
        </template>
      </el-table-column>
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
      <el-table-column label="שאלה" prop="Desc"></el-table-column>
      <el-table-column label="שאלון" prop="DescQuestionnaire"></el-table-column>
      <el-table-column type="expand" v-if="LoadingOptionss">
        <template slot-scope="props">
          <div>
            <OptionInTable
              v-if="IfComponent"
              :props="props"
              :theOption="theOption"
              :IdniFtah="IdniFtah"
              :Alldata="Alldata"
              :ModelQestions="ModelQestions"
              :LoadingButton="LoadingButton"
              :OptheOption="OptheOption"
            />
          </div>
          <!--  -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import OptionInTable from "vue-router";
export default {
  name: "BprevenTableComp",
  components: { OptionInTable },
  data() {
    return {
      data: [],
      loadingTABLE: false,
      LoadingButton: false,
      LoadingOptionss: true,
      RafreshTable: true,
      IfComponent: false,
      showHosef: {},
      OptheOption: {},
      ModelQestions: {},
      showSelectOfNextQuestion: {},
      ModelOfNewNextQuestion: {},
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
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },
  watch: {
    theOption(val) {
      this.$store.commit("UptheOption", val);
    },
    LoadingButton(val) {
      if (val && this.$refs.butnoc) {
        this.$refs.butnoc.$el.style.position = "absolute";
      }
    },
    LoadingOptionss(val) {
      // console.log(" LoadingOptionss(val)", val);
    },
    loadingTABLE(val) {
      if (!val && this.$store.state.theOption.length === 0) {
        this.SortTable();
      }
    },
  },
  async mounted() {
    try {
      this.loadingTABLE = true;
      await this.$store.dispatch("fetchData");
      this.Alldata.Allquestions = this.$store.state.AllData.Allquestions;
      this.Alldata.questionsOnly = this.$store.state.AllData.questionsOnly;
      this.Alldata.DataType = this.$store.state.AllData.DataType;
      this.Alldata.NameQuen = this.$store.state.AllData.NameQuen;
      this.data = this.$store.state.data;
      this.loadingTABLE = false;
      // let { data } = await this.$ax(URL + "GetQuestions");
      // this.data = data;
      // let res = await this.$ax.get(URL + "GetData");
      // this.Alldata.DataType = res.data.DataType;
      // this.Alldata.NameQuen = res.data.NameQuen;
      // let allquestions = await this.$ax.get(URL + "GetallQuestions");
      // this.Alldata.Allquestions = allquestions.data;
      await this.$nextTick();
      this.SortTable();
    } catch (error) {
      console.log(error);
      this.$message.error("משהו השתבש");
    }
  },

  methods: {
    async GetOptions(row, expanded) {
      await this.$nextTick();
      if (row.DescDataType === "OptionId") {
        this.IdniFtah = row.Id;
        this.$emit("IdniFtah", row.Id);
        if (expanded.length === 0) {
          this.theOption = [];
          this.ModelInputDivAnswer = "";
          this.SortTable();
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
      }
    },
    Delete(row) {
      // console.log(row);
      this.$emit("IdOfDelq", row.Id);
      this.$emit("newComponent", "warning");
    },
    Edit(row) {
      this.rowEdit = row;
      //   this.shows.showDivos = true;
      //   this.shows.showEdit = true;
      if (
        this.rowEdit.DescDataType === "OptionId" ||
        this.rowEdit.DescDataType === "אופציות "
      ) {
        setTimeout(() => {
          this.rowEdit.NextQuestionDesc = "לפי אופציה";
        }, 300);
      }
      if (this.rowEdit.StatusId) {
        this.rowEdit.StatusId = 1;
      } else if (!this.rowEdit.StatusId) {
        this.rowEdit.StatusId = 0;
      }
      this.$emit("ParamsEditAddNewComponent", this.rowEdit);
      this.$emit("newComponent", "Edit");
    },
    TextOfNewqusetions(row) {
      // console.log(row);
      if (row.DescDataType === "OptionId") {
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
            let elco = element.children[7].children[0].children[0].children[0];
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
    // <!--ADDnewtAnswer,AddNewQuestion,changeEventOptions, SelectFromAll,EventChangeOption,UpdateOption,DeleteAnswerTHEshows -->
  },
};
</script>
<style scoped>
.table {
  width: 78%;
  /* width: 76%; */
  position: absolute;
  top: 100px;
  margin-left: 80px;
  /* margin-left: 85px; */
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
</style>
