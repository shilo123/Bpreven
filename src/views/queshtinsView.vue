<template>
  <div>
    <div class="optionsONtheTable">
      <el-button
        type="success"
        class="ButtonHosef"
        @click="
          shows.showDivos = true;
          shows.shownewqustion = true;
        "
        ><i class="fa-solid fa-square-plus"></i> הוסף שאלה</el-button
      >
      <el-input
        v-show="!showRadio"
        v-model="serch"
        dir="auto"
        placeholder="חפש"
        class="inputSerch"
        ref="inputSerch"
        ><i slot="suffix" class="el-icon-search" ref="iconOfInp"></i
      ></el-input>
      <el-radio-group v-model="serch" v-show="showRadio" class="radio">
        <el-radio-button label="כן" ref="itemRadioA"></el-radio-button>
        <el-radio-button label="לא" ref="itemRadioB"></el-radio-button>
      </el-radio-group>
      <el-select v-model="FilterOf" placeholder="סנן לפי" class="Tselect">
        <el-option
          v-for="מ in ['שאלון', 'שאלה', 'סוג התשובה', 'אם אחרון', 'הכל']"
          :key="מ"
          :value="מ"
        ></el-option>
      </el-select>
      <div class="select">
        <select name="S" v-model="FilterChange">
          <option label="הכל" value="הכל" selected>הכל</option>
          <option
            v-for="n in Alldata.NameQuen"
            :key="n"
            :value="n"
            :label="n"
          ></option>
        </select>
      </div>
    </div>

    <el-table
      :data="data"
      class="table"
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
          <div class="Options" v-show="props.row.DescDataType === 'OptionId'">
            <div v-show="theOption.length > 0">
              <div class="parentsheaderOFAnswers">
                <h1 class="headerOFAnswers">אופציות</h1>
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
                          ></el-option>
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
                  type="success"
                  @click="
                    shows.showAddAnswer = true;
                    shows.showDivos = true;
                    ModelInputDivAnswer = '';
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
    <h1 class="loMatzanu" v-show="showZE">
      {{ `לא נמצא ערך זהה ל '${FilterChange}'` }}
    </h1>
    <div class="divos" v-if="shows.showDivos">
      <transition appear name="expand">
        <div
          class="indivos"
          :class="[
            {
              Edito: shows.showEdit,
              newQ: shows.shownewqustion,
              AddNewAnswer: shows.showAddAnswer,
              DeleteAnswer: shows.showDeleteAnswer,
              EditOption: shows.showEditOption,
            },
            shows.showWarnning
              ? 'w3-panel w3-pale-red w3-leftbar w3-border-red warning'
              : '',
          ]"
        >
          <i class="el-icon-close" @click="shows.showDivos = false"></i>
          <div v-show="shows.showEdit">
            <el-table :data="[rowEdit]">
              <el-table-column
                label="NextQuestionId"
                prop="NextQuestionId"
              ></el-table-column>
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
              <el-table-column
                label="שאלון"
                prop="DescQuestionnaire"
              ></el-table-column>
              <el-table-column label="סוג התשובה">
                <template slot-scope="scope">
                  {{ computedData(scope.row.DescDataType) }}
                </template>
              </el-table-column>
              <el-table-column label="שאלה" prop="Desc"></el-table-column>
            </el-table>
            <div class="inEdito w3-card-4">
              <div class="iteminEdit">
                <label>שם שאלה</label>
                <input
                  type="text"
                  class="w3-input"
                  v-model="rowEdit.Desc"
                  dir="auto"
                />
              </div>
              <div class="allitemsSelect">
                <div class="iteminEditSelct">
                  <label>סוג תשובה</label>
                  <el-select
                    v-model="rowEdit.DescDataType"
                    placeholder="סוג תשובה"
                  >
                    <el-option
                      v-for="(s, i) in Alldata.DataType"
                      :key="i"
                      :value="s"
                      :label="computedData(s)"
                    ></el-option>
                  </el-select>
                </div>
                <div class="iteminEditSelct">
                  <label>שאלון</label>
                  <el-select
                    v-model="rowEdit.DescQuestionnaire"
                    placeholder="שאלון"
                  >
                    <el-option
                      v-for="(q, i) in Alldata.NameQuen"
                      :key="i"
                      :value="q"
                    ></el-option>
                  </el-select>
                </div>
                <div class="iteminEditSelct Last">
                  <label>השאלה הבאה</label>
                  <el-select
                    :disabled="rowEdit.DescDataType === 'OptionId'"
                    v-model="rowEdit.NextQuestionDesc"
                    placeholder="שאלה הבאה"
                  >
                    <!-- <el-option value="ללא שאלה הבאה"></el-option> -->
                    <el-option
                      v-for="(a, i) in Alldata.Allquestions[
                        rowEdit.DescQuestionnaire
                      ]"
                      :key="i"
                      :value="a.Id"
                      :label="a.Desc"
                      v-show="a.Desc !== rowEdit.Desc"
                    ></el-option>
                  </el-select>
                </div>
                <div class="itemEditisEnd">
                  <label>אם אחרון</label>
                  <el-switch
                    :disabled="rowEdit.DescDataType === 'OptionId'"
                    v-model="rowEdit.IsEnd"
                    active-text="כן"
                    inactive-text="לא"
                  >
                  </el-switch>
                </div>
                <div class="itemEditisEnd Stat">
                  <label>אם פעיל</label>
                  <el-switch
                    v-model="rowEdit.StatusId"
                    active-text="כן"
                    inactive-text="לא"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
            <div class="butonas">
              <el-button
                type="danger"
                class="shmorTO"
                @click="shows.showDivos = false"
                >סגור</el-button
              >
              <el-button
                type="success"
                class="sgorTo"
                @click="EditQ()"
                :loading="LoadingButton"
                >שמור</el-button
              >
            </div>
          </div>
          <div v-show="shows.shownewqustion">
            <div class="innewQ w3-card-4">
              <div class="itemNewQA">
                <label>שם השאלה</label>
                <input
                  dir="auto"
                  type="text"
                  class="w3-input"
                  placeholder="שם השאלה"
                  v-model="newQuens.DescQ"
                />
              </div>
              <div class="itemNewQB">
                <label>שם השאלון</label>
                <el-select
                  v-model="newQuens.NameQ"
                  placeholder="שם השאלון"
                  size="small"
                >
                  <el-option
                    v-for="(s, i) in Alldata.NameQuen"
                    :key="i"
                    :value="s"
                  ></el-option>
                </el-select>
              </div>
              <div class="itemNewQC">
                <label>סוג התשובה</label>
                <el-select
                  v-model="newQuens.typeData"
                  placeholder="סוג התשובה"
                  size="small"
                >
                  <el-option
                    v-for="(s, i) in Alldata.DataType"
                    :key="i"
                    :value="s"
                    :label="computedData(s)"
                  ></el-option>
                </el-select>
              </div>
              <div class="itemNewQG">
                <label>אם אחרון</label>
                <el-switch
                  v-model="newQuens.IsEnd"
                  active-text="כן"
                  inactive-text="לא"
                ></el-switch>
              </div>
              <div class="itemNewQD">
                <label>אם פעיל</label>
                <el-switch
                  v-model="newQuens.StatusId"
                  active-text="כן"
                  inactive-text="לא"
                ></el-switch>
              </div>
            </div>
            <div class="butonas">
              <el-button
                type="success"
                class="shmorTO"
                @click="InsertQuestion"
                :loading="LoadingButton"
                >שמור</el-button
              >
              <el-button
                type="danger"
                class="sgorTo"
                @click="
                  shows.showDivos = false;
                  ResetAllNewQuan();
                "
                >סגור</el-button
              >
            </div>
          </div>
          <div v-show="shows.showWarnning">
            אם תמחק את השאלון הוא ימחק לצמיתות
            <el-button
              type="danger"
              size="small"
              class="dangero"
              @click="deletequen(idOfDel)"
              :loading="LoadingButton"
              >מחק</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="primaryo"
              @click="shows.showDivos = false"
              >סגור</el-button
            >
          </div>
          <div v-show="shows.showAddAnswer">
            <input
              type="text"
              dir="auto"
              class="w3-input"
              v-model="ModelInputDivAnswer"
            />
            <el-button
              type="success"
              class="ButAdANs"
              @click="ADDnewtAnswer(IdniFtah, ModelInputDivAnswer)"
              :loading="LoadingButton"
              ref="butnoc"
              >הוסף אופציה</el-button
            >
          </div>
          <div v-show="shows.showDeleteAnswer">
            <div class="text">הפריט ימחק לעולם ולא יחזור גם אם תרצה מאוד</div>
            <div class="butonascy">
              <el-button
                type="danger"
                size="mini"
                @click="shows.showDivos = false"
                >סגור</el-button
              >
              <el-button
                type="success"
                size="mini"
                @click="DelOfAnswer(idOfDelAnswer)"
                :loading="LoadingButton"
                >מחק</el-button
              >
            </div>
          </div>
          <div v-show="shows.showEditOption">
            <el-input
              dir="auto"
              placeholder="עדכן אופציה"
              v-model="ModelUpdateOption.Desc"
            ></el-input>
            <el-button
              type="primary"
              size="medium"
              @click="UpdateForOption"
              :loading="LoadingButton"
              >עדכן</el-button
            >
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  name: "BprevenQueshtinsView",

  data() {
    return {
      s: "",
      serch: "",
      ModelInputDivAnswer: "",
      ModelUpdateOption: "",
      TimeoutSerch: null,
      FilterChange: "הכל",
      FilterOf: "הכל",
      data: [],
      data2: [],
      shows: {
        showDivos: false,
        showEdit: false,
        showWarnning: false,
        shownewqustion: false,
        showAddAnswer: false,
        showDeleteAnswer: false,
        showEditOption: false,
      },
      //Alldata.Allquestions
      Alldata: {
        NameQuen: [],
        DataType: [],
        questionsOnly: [],
        Allquestions: [],
      },
      rowEdit: {},
      ModelQestions: {},
      OptheOption: {},
      showHosef: {},
      showSelectOfNextQuestion: {},
      ModelOfNewNextQuestion: {},
      disabledQushinnare: {},
      newQuens: {
        DescQ: "",
        NameQ: "",
        typeData: "",
        IsEnd: false,
        StatusId: true,
      },
      idOfDel: "",
      IdniFtah: "",
      idOfDelAnswer: "",
      IdOfOption: "",
      dialogVisible: false,
      LoadingButton: false,
      showZE: false,
      showRadio: false,
      RafreshTable: true,
      isIsEnd: false,
      loadingTABLE: false,
      LoadingOptionss: true,
      theOption: [],
    };
  },
  watch: {
    LoadingButton(val) {
      if (val && this.$refs.butnoc) {
        this.$refs.butnoc.$el.style.position = "absolute";
      }
    },
    LoadingOptionss(val) {
      // console.log(" LoadingOptionss(val)", val);
    },
    loadingTABLE(val) {
      if (!val && this.theOption.length === 0) {
        this.SortTable();
      }
    },
    FilterOf(val) {
      if (val === "אם אחרון") {
        this.showRadio = true;
      } else {
        this.showRadio = false;
        this.serch = "";
      }
    },
    serch(val) {
      this.loadingTABLE = true;
      if (this.TimeoutSerch) {
        clearTimeout(this.TimeoutSerch);
      }
      this.TimeoutSerch = setTimeout(() => {
        if (this.serch === "כן") {
          this.serch = true;
        } else if (this.serch === "לא") {
          this.serch = false;
        }
        this.SerchQuery(this.serch);
        this.TimeoutSerch = null;
      }, 500);
    },
    FilterChange(val) {
      //   console.log(val);
      this.data = this.data2;
      if (val !== "הכל") {
        this.$ax.post(URL + "FIndQustinnare", { val }).then((res) => {
          // console.log(res.data);
          this.data = res.data;
          if (this.data.length === 0) {
            this.showZE = true;
          } else {
            this.showZE = false;
            this.SortTable();
          }
        });
      } else {
        this.data = this.data2;
        window.location.reload();
      }
    },
    "shows.showDivos"(val) {
      if (val) {
        this.$store.commit("Setmessage", true);
      } else {
        this.$store.commit("Setmessage", false);
        for (const key in this.shows) {
          this.shows[key] = false;
        }
      }
    },
  },
  computed: {},
  async mounted() {
    try {
      let { data } = await this.$ax(URL + "GetQuestions");
      // console.log(data);
      this.data = data;
      this.data2 = data;
      let res = await this.$ax.get(URL + "GetData");
      // console.log(res.data);
      this.Alldata.DataType = res.data.DataType;
      this.Alldata.NameQuen = res.data.NameQuen;
      let allquestions = await this.$ax.get(URL + "GetallQuestions");
      // console.log(allquestions.data);
      this.Alldata.Allquestions = allquestions.data;
      // console.log(data);
      let groupCount = data.reduce((acc, item) => {
        acc[item.DescQuestionnaire] = 0;
        return acc;
      }, {});
      let idOnlyItem = data.find((e) => {
        return e.isIsEnd;
      });
      // console.log(idOnlyItem);
      data.forEach((item) => {
        if (item.IsEnd) {
          groupCount[item.DescQuestionnaire] += 1;
        }
      });
      this.disabledQushinnare = groupCount;
      console.log(groupCount);
      await this.$nextTick();
      this.SortTable();
      this.sortInput();
      this.sortRadio();
    } catch (error) {
      this.$message.error("משהו השתבש");
    }
  },

  methods: {
    async GetOptions(row, expanded) {
      await this.$nextTick();
      if (row.DescDataType === "OptionId") {
        this.IdniFtah = row.Id;
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
              this.$refs.inptutDiv.focus();
            }, 700);
          }
          setTimeout(() => {
            this.loadingTABLE = false;
            this.LoadingOptionss = true;
          }, 300);
        }
      }
      // console.log(data);
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
    computedOfisEnd(val) {
      if (val) {
        return "כן";
      } else {
        return "לא";
      }
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
          Array.from(tds).forEach((element, i) => {
            let elco = element.children[7].children[0].children[0].children[0];
            elco.classList = "el-icon-arrow-left";
            Array.from(element.children).forEach((el) => {
              el.style.textAlign = "right";
            });
          });
        }
      } catch (error) {}
    },
    sortInput() {
      let input = this.$refs.inputSerch.$el.children[0];
      input.style.background = "none";
      input.style.border = "none";
      input.style.borderBottom = "4px solid black";
      input.style.color = "black";
      let icon = this.$refs.iconOfInp.parentNode.parentNode;
      icon.style.transition = "left 2s";
      icon.style.top = "10px";
      icon.style.position = "absolute";
      icon.style.left = "-310px";
    },
    sortRadio() {
      let elRadA = this.$refs.itemRadioA.$el;
      let elRadB = this.$refs.itemRadioB.$el;
      elRadA.style.position = "absolute";
      elRadB.style.position = "absolute";
      elRadA.style.right = "0";
      elRadB.style.left = "0";
      elRadA.style.width = "50%";
      elRadB.style.width = "50%";
      elRadA.children[1].style.width = "100%";
      elRadB.children[1].style.width = "100%";
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
    SerchQuery(val) {
      this.data = this.data2;
      if (this.FilterOf !== "אם אחרון") {
        ["טקסט", "אופציות", "מספר", "תאריך"].forEach((text) => {
          if (Array.from(text).every((character) => val.includes(character))) {
            val = this.REVERScomputedData(text);
          }
        });
      }
      let ClumnSerch;
      if (this.FilterOf === "שאלון") {
        ClumnSerch = "Questionnaire.[Desc]";
      } else if (this.FilterOf === "שאלה") {
        ClumnSerch = "Questions.[Desc]";
      } else if (this.FilterOf === "סוג התשובה") {
        ClumnSerch = "DataTypes.[Desc]";
      } else if (this.FilterOf === "אם אחרון") {
        ClumnSerch = "Questions.IsEnd";
      } else if (this.FilterOf === "סטטוס") {
        ClumnSerch;
      } else if (this.FilterOf === "הכל") {
        ClumnSerch = "הכל";
      }
      this.$ax
        .post(URL + "Serch", { clumn: ClumnSerch, val: val })
        .then((res) => {
          // console.log(res.data);
          this.data = res.data;
          this.loadingTABLE = false;
        })
        .catch((e) => {
          this.$message.error("משהו השתבש");
          this.loadingTABLE = false;
        });

      if (val === "") {
        this.data = this.data2;
        this.sortInput();
      }
    },
    async ShmorEtHahu() {
      let elemntIsEndTRUE = this.data.find((e) => {
        return e.IsEnd && e.Id !== this.rowEdit.Id;
      });
      elemntIsEndTRUE.IsEnd = false;
      console.log("elemntIsEndTRUE", elemntIsEndTRUE);
      if (elemntIsEndTRUE.StatusId) {
        elemntIsEndTRUE.StatusId = 1;
      } else if (!elemntIsEndTRUE.StatusId) {
        elemntIsEndTRUE.StatusId = 0;
      }
      let { data } = await this.$ax.post(URL + "Updata", elemntIsEndTRUE);
      // console.log(data);
      if (data) {
        this.$message.success("ההוא בוטל בהצלחה");
        // window.location.reload();
      } else {
        this.$message.error("משהו השתבש אחינו");
        this.LoadingButton = false;
      }
    },
    Delete(row) {
      // console.log(row);
      this.shows.showDivos = true;
      this.shows.showWarnning = true;
      this.idOfDel = row.Id;
    },
    async deletequen(id) {
      // console.log(id);
      this.LoadingButton = true;
      let { data } = await this.$ax.delete(URL + "DeleteQustions/" + id);
      this.LoadingButton = false;
      if (data) {
        this.$message.success("השאלה נמחקה בהצלחה");
        window.location.reload();
      } else {
        this.$message.error("משהו השתבש");
      }
    },
    Edit(row) {
      this.rowEdit = row;
      console.log(this.rowEdit);
      this.shows.showDivos = true;
      this.shows.showEdit = true;
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
    },
    async EditQ() {
      if (this.rowEdit.StatusId) {
        this.rowEdit.StatusId = 1;
      } else if (!this.rowEdit.StatusId) {
        this.rowEdit.StatusId = 0;
      }
      let { data } = await this.$ax.post(URL + "Updata", this.rowEdit);
      console.log(data);
      if (data) {
        this.$message.success("עודכן בהצלחה");
        window.location.reload();
      } else {
        this.$message.error("משהו השתבש אחינו");
        this.LoadingButton = false;
      }
    },
    async InsertQuestion() {
      // console.log(this.newQuens);
      if (
        this.newQuens.DescQ &&
        this.newQuens.NameQ &&
        this.newQuens.typeData
      ) {
        if (this.newQuens.StatusId) {
          this.newQuens.StatusId = 1;
        } else {
          this.newQuens.StatusId = 0;
        }

        this.LoadingButton = true;
        let { data } = await this.$ax.post(URL + "AddQuestin", this.newQuens);
        this.LoadingButton = false;
        if (data) {
          this.$message.success("השאלה נוספה בהצלוחה");
          window.location.reload();
        } else {
          this.$message.error("משהו השתבש");
        }
      } else {
        this.$message.error("אחינו מלא את הכל");
      }
    },
    ResetAllNewQuan() {
      this.newQuens.DescQ = "";
      this.newQuens.NameQ = "";
      this.newQuens.typeData = "";
      this.newQuens.IsEnd = false;
      this.newQuens.StatusId = true;
    },
    addAnswer() {
      // this.$nextTick(function () {
      this.LoadingOptionss = false;
    },
    inptutDiv(e) {
      // console.log(e.target.innerText);
      this.ModelInputDivAnswer = e.target.innerText;
    },
    async ADDnewtAnswer(id, text) {
      this.LoadingButton = true;
      if (text) {
        try {
          await this.$ax.post(URL + "AddAnswer", { text, id });
          this.$message.success("התשובה נוספה");
          this.theOption.push({ Desc: text });
          this.shows.showDivos = false;
          // this.RafreseTable();
        } catch (error) {
          this.$message.error("משהו השתבש");
        } finally {
          this.LoadingButton = false;
        }
        console.log(data);
      }
    },
    DeleteAnswerTHEshows(id) {
      this.shows.showDivos = true;
      this.shows.showDeleteAnswer = true;
      // console.log(id);
      this.idOfDelAnswer = id;
    },
    async DelOfAnswer(id) {
      // console.log(id);
      this.LoadingButton = true;
      try {
        await this.$ax.delete(URL + "DeleteAnswer/" + id);
        this.$message.success("נמחק בהצלחה");
        this.shows.showDivos = false;
        let i = this.theOption.findIndex((e) => e.Id === id);
        // console.log(i);
        this.theOption.splice(i, 1);
      } catch (error) {
        this.$message.error("משהו השתבש");
      } finally {
        this.LoadingButton = false;
      }
    },
    UpdateOption(id) {
      this.shows.showDivos = true;
      this.shows.showEditOption = true;
      let OptionOfUp = this.theOption.find((e) => e.Id === id);
      this.ModelUpdateOption = OptionOfUp;
      // console.log(OptionOfUp);
      //UpdateOption
    },
    async UpdateForOption() {
      let id = this.ModelUpdateOption.Id;
      let text = this.ModelUpdateOption.Desc;
      const params = { id, text };
      this.LoadingButton = true;
      try {
        let { data } = await this.$ax.put(URL + "UpdateOP", params);
        if (data) {
          this.$message.success("עודכן בהצלחה");
          this.shows.showDivos = false;
          let i = this.theOption.findIndex((e) => e.Id === id);
          this.theOption[i].Desc = text;
        } else {
          this.$message.error("משהו השתבש");
        }
      } catch (error) {
      } finally {
        this.LoadingButton = false;
      }
    },
    async AddNewQuestion(idOfOption, nextQusions, IdQuestion) {
      const params = { idOfOption, nextQusions, IdQuestion };
      this.LoadingButton = true;

      let { data } = await this.$ax.post(URL + "addNewQustionsId", params);
      this.LoadingButton = false;
      if (data) {
        this.$message.success("השאלה הבאה עודכנה");
      } else {
        this.$message.error("משהו השתבש אחי");
      }
      this.OptheOption[`showButton-${idOfOption}`] = false;
    },
    changeEventOptions(val, id) {
      this.OptheOption[`showButton-${id}`] = true;
      console.log(this.ModelQestions);
      console.log(val);
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 0);
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
  },
};
</script>
<style scoped>
.optionsONtheTable {
  background: linear-gradient(rgb(158, 170, 170), rgb(59, 62, 70));
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  /* width: 76%; */
  width: 78%;
  top: 40px;
  height: 4em;
  /* left: 85px; */
  left: 80px;
}
.ButtonHosef {
  /* display: none; */
  position: absolute;
  top: 0;
  right: 0;
}
.ButtonHosef:hover {
  font-size: 22px;
}
.inputSerch {
  /* display: none; */
  position: relative;
  right: 170px;
  bottom: -8px;
  width: 360px;
}
.radio {
  position: relative;
  right: 170px;
  bottom: -8px;
  width: 360px;
  display: flex;
}
.Tselect {
  /* display: none; */
  position: relative;
  right: 220px;
  top: 8px;
}
.select {
  /* display: none; */
  position: absolute;
  left: 20px;
  top: 8px;
  display: flex;
  width: 20em;
  height: 2.7em;
  overflow: hidden;
}
.table {
  width: 78%;
  /* width: 76%; */
  position: absolute;
  top: 100px;
  margin-left: 80px;
  /* margin-left: 85px; */
}
.buttons {
  display: flex;
}
.Edito {
  background: rgb(209, 207, 194);
  /* width: 950px; */
  width: 660px;
  left: 300px;
  /* height: 540px; */
  height: 630px;
  /* top: 50px; */
  top: 30px;
  border-radius: 4px;
  padding-bottom: 60px;
}
.inEdito {
  border: 3px solid black;
  width: 540px;
  /* height: 290px; */
  height: 380px;
  border-radius: 20px;
  position: relative;
  left: 70px;
  top: 10px;
  padding: 30px;
  overflow-y: hidden;
  overflow-x: hidden;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}
.w3-input {
  background: none;
  border-bottom: 1px solid rgb(86, 76, 76);
  width: 60%;
}
.inEdito .w3-input {
  width: 170px;
}
.iteminEdit label {
  position: relative;
  left: 110px;
}
.butonas {
  position: relative;
  top: 29px;
}
.iteminEditSelct {
  margin-bottom: 80px;
}
.iteminEditSelct label {
  position: relative;
  bottom: 40px;
  left: 150px;
}
.itemEditisEnd label {
  position: relative;
  left: 70px;
  bottom: 30px;
}
.itemEditisEnd {
  position: relative;
  left: 320px;
  bottom: 70px;
}
.itemEditisEnd.Stat {
  position: relative;
  left: 320px;
  bottom: 10px;
}
.iteminEditSelct {
  margin-bottom: 40px;
}
.iteminEditSelct.Last {
  position: absolute;
  bottom: 30px;
  left: 33px;
}
.iteminEditSelct.Last label {
  position: absolute;
  top: -40px;
  left: 77px;
}
.iteminEditSelct:first-child {
  position: relative;
  right: 30px;
}
.allitemsSelect {
  width: 600px;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 30px;
}
.newQ {
  background: rgba(255, 255, 255, 0.879);
  border: 11px solid rgba(171, 192, 167, 0.645);
  border-radius: 20px;
  height: 520px;
  width: 800px;
  left: 280px;
  top: 60px;
}
.innewQ {
  border: 3px solid black;
  width: 600px;
  /* width: 480px; */
  height: 360px;
  position: relative;
  left: 100px;
  border-radius: 20px;
  top: 40px;
  overflow-y: hidden;
  display: flex;
  flex-direction: row-reverse;
}
.itemNewQA label {
  position: relative;
  left: 125px;
}
.itemNewQA .w3-input {
  width: 200px;
}
.itemNewQA {
  position: relative;
  right: 20px;
  top: 20px;
}
.itemNewQB {
  position: relative;
  right: 130px;
  top: 40px;
}
.itemNewQB label,
.itemNewQC label {
  position: relative;
  left: 80px;
  bottom: 20px;
}
.itemNewQC {
  position: relative;
  right: -25px;
  top: 160px;
}
.itemNewQG {
  position: relative;
  top: 160px;
  left: 440px;
}
.itemNewQG label {
  position: relative;
  left: 17px;
  bottom: 10px;
}
.itemNewQD {
  position: absolute;
  bottom: 60px;
  right: 75px;
}
.itemNewQD label {
  position: absolute;
  width: 50px;
  bottom: 30px;
  /* right: 31px; */
  right: 16px;
}
.newQ .butonas {
  position: relative;
  top: 50px;
  right: 26px;
  margin: 10px;
}
.warning {
  width: 300px;
  height: 210px;
  padding: 70px;
  text-align: center;
  left: 530px;
}
.loMatzanu {
  position: relative;
  top: 300px;
  left: 29%;
  z-index: -1;
}
select {
  /* display: none; */
  appearance: none;
  outline: 10px red;
  border: 0;
  flex: 1;
  padding: 0 1em;
  color: #fff;
  background-color: #2c3e50;
  background-image: none;
  cursor: pointer;
  transition: all 2s;
}
option {
  text-align: right;
  position: relative;
  top: 20px;
}
.select::after {
  /* display: none; */
  content: "\25BC";
  position: absolute;
  top: 0;
  left: 0;
  padding: 1em;
  background-color: #34495e;
  transition: 0.25s all ease;
  pointer-events: none;
}
.select:hover::after {
  /* display: none; */
  color: #f39c12;
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
}
.button-and-li span:hover {
  background: rgba(206, 69, 0, 0.821);
  cursor: grab;
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
.Answers .el-button--success:not(.EN .el-button--success) {
  width: 300px;
  background: rgb(46, 156, 46);
}
.Answers .el-button--success:hover:not(.EN .el-button--success) {
  width: 300px;
  background: rgba(46, 156, 46, 0.589);
  font-size: 18px;
}
.ButtonAndLi {
  display: flex;
}
.loadingDiv {
  text-align: right;
  font-size: 18px;
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
.AddNewAnswer {
  background: white;
  height: 300px;
  width: 400px;
  border-radius: 20px;
}
.AddNewAnswer .w3-input {
  background: rgb(183, 174, 174);
  border-radius: 10px;
  position: relative;
  left: 20%;
  top: 80px;
}
.ButAdANs {
  position: absolute;
  left: 28%;
  bottom: 30%;
  width: 180px;
  box-shadow: 0 0 7px 2px #34495e;
}
.ButAdANs:hover {
  box-shadow: 0 0 1px 1px;
  font-size: 20px;
}
.DeleteAnswer {
  width: 300px;
  height: 200px;
  background: rgba(226, 97, 97, 0.699);
  left: 35%;
  top: 35%;
  padding: 10px;
}
.DeleteAnswer .text {
  position: relative;
  top: 50px;
  left: 10px;
}
.butonascy {
  position: absolute;
  bottom: 50px;
  width: 100%;
  left: 0;
}
.butonascy .el-button--danger {
  position: absolute;
  left: 50px;
}
.butonascy .el-button--success {
  position: absolute;
  right: 50px;
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

.EditOption {
  background: rgb(0, 70, 132);
  height: 150px;
  width: 400px;
  border-radius: 20px;
  left: 30%;
  padding: 20px;
}
.EditOption .el-input {
  width: 300px;
  position: relative;
  left: 30px;
}
.EditOption .el-button {
  position: absolute;
  bottom: 30px;
  left: 140px;
  border: 2px solid black;
  width: 130px;
}
.EditOption .el-button:hover {
  border: 0 solid rgb(45, 43, 43);
}
.ButtonAddNewNextQustion {
  width: 130px;
}
</style>
