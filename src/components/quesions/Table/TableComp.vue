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
                size="mini"
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
              <div class="ManagerGroups" v-if="IfGroups">
                <h4>ניהול קבוצות</h4>
                <div
                  class="Buttonsz"
                  v-if="
                    !ManagerGroup.IfUpdate &&
                    !ManagerGroup.IfDelete &&
                    !ManagerGroup.IfAdd
                  "
                >
                  <el-button
                    type="success"
                    size="medium"
                    @click="ManagerGroup.IfAdd = true"
                    >הוסף</el-button
                  >
                  <el-button
                    type="danger"
                    size="medium"
                    @click="ManagerGroup.IfDelete = true"
                    >מחק קבוצה</el-button
                  >
                  <el-button
                    type="primary"
                    size="medium"
                    @click="ManagerGroup.IfUpdate = true"
                    >עדכן</el-button
                  >
                </div>
                <div
                  v-if="
                    ManagerGroup.IfUpdate ||
                    ManagerGroup.IfDelete ||
                    ManagerGroup.IfAdd
                  "
                  class="AllmangGroup"
                >
                  <div v-if="ManagerGroup.IfUpdate" class="UpdateG">
                    <el-button
                      type="danger"
                      size="small"
                      class="Back"
                      @click="
                        ManagerGroup.IfUpdate = false;
                        ManagerGroup.IfDelete = false;
                        ManagerGroup.IfAdd = false;
                      "
                      >חזור</el-button
                    >
                    <el-select
                      dir="rtl"
                      v-model="ManagerGroup.UpdateId"
                      placeholder="בחר איזו קבוצה תרצה לעדכן"
                      size="medium"
                      @change="FocusInputUp"
                    >
                      <el-option
                        v-for="({ Name, Id, QuestionsId }, i) in ArrGroups"
                        :key="i"
                        :label="Name"
                        :value="Id"
                        v-show="QuestionsId === activQ.Id"
                        dir="rtl"
                      ></el-option>
                    </el-select>
                    <div v-show="ManagerGroup.ModelUpdate">
                      <el-input
                        dir="rtl"
                        size="medium"
                        v-model="ManagerGroup.ModelUpdate"
                        placeholder="עדכן את שם הקבוצה"
                        class="InputUPDate"
                        ref="InputUPDate"
                      ></el-input>
                      <el-button
                        type="primary"
                        size="small"
                        class="ButUp"
                        @click="
                          UpdateGroup(
                            ManagerGroup.ModelUpdate,
                            ManagerGroup.UpdateId
                          )
                        "
                        >עדכן</el-button
                      >
                    </div>
                  </div>
                  <div v-if="ManagerGroup.IfDelete" class="DeleteG">
                    <el-button
                      type="danger"
                      size="small"
                      @click="
                        ManagerGroup.IfUpdate = false;
                        ManagerGroup.IfDelete = false;
                        ManagerGroup.IfAdd = false;
                      "
                      >חזור</el-button
                    >
                    <el-popconfirm
                      confirm-button-text="כן"
                      cancel-button-text="לא, תודה"
                      icon="el-icon-info"
                      icon-color="red"
                      title="בטוח שאתה רוצה למחוק?"
                      @confirm="DeleteGroup(ManagerGroup.DeleteId)"
                    >
                      <el-button
                        slot="reference"
                        type="danger"
                        v-show="ManagerGroup.DeleteId"
                        size="small"
                        >מחק</el-button
                      >
                    </el-popconfirm>
                    <el-select
                      dir="rtl"
                      v-model="ManagerGroup.DeleteId"
                      placeholder="בחר איזו קבוצה תרצה למחוק"
                      size="medium"
                    >
                      <el-option
                        v-for="({ Name, Id, QuestionsId }, i) in ArrGroups"
                        :key="i"
                        :label="Name"
                        :value="Id"
                        v-show="QuestionsId === activQ.Id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div v-if="ManagerGroup.IfAdd" class="AddG">
                    <div class="Butnosy">
                      <el-button
                        type="success"
                        size="small"
                        @click="AdddGroup(ManagerGroup.AddGroup, activQ.Id)"
                        >הוסף</el-button
                      >
                      <el-button
                        type="danger"
                        size="small"
                        @click="
                          ManagerGroup.IfUpdate = false;
                          ManagerGroup.IfDelete = false;
                          ManagerGroup.IfAdd = false;
                        "
                        >חזור</el-button
                      >
                    </div>
                    <el-input
                      dir="rtl"
                      v-model="ManagerGroup.AddGroup"
                      placeholder="הוסף אחי"
                      size="medium"
                      ref="InputAddG"
                      class="InputAdd"
                    ></el-input>
                  </div>
                </div>
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
                            :value="q.Id"
                            :label="q.Desc"
                            v-show="q.Seq > activQ.Seq"
                          >
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
                      <!-- {{ $ConSol(O) }} -->
                      <el-select
                        placeholder="בחר קבוצה"
                        class="El_select_Groups"
                        v-if="IfGroups"
                        v-model="Groups[`ItemGroups-${O.Id}`]"
                        size="medium"
                        @change="
                          AddGroupFromOption(Groups[`ItemGroups-${O.Id}`], O.Id)
                        "
                      >
                        <el-option label="ללא" :value="0"></el-option>
                        <el-option
                          v-for="(Group, i) in ArrGroups"
                          :key="i"
                          :label="Group.Name"
                          :value="Group.Id"
                          v-show="Group.QuestionsId === activQ.Id"
                        ></el-option>
                      </el-select>
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
      wit: window.innerWidth,
      data: [],
      loadingTABLE: false,
      LoadingButton: false,
      LoadingOptionss: true,
      RafreshTable: true,
      overSpan: false,
      IfGroups: false,
      ManagerGroup: {
        IfUpdate: false,
        IfDelete: false,
        IfAdd: false,
        AddGroup: "",
        ModelUpdate: "",
        DeleteId: "",
        UpdateId: "",
      },
      ArrGroups: [],
      Groups: {},
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
    DescDefaultSelect() {
      return this.DefoltSelsct !== "לפי האופציה"
        ? this.$store.state.data.find((e) => e.Id === this.DefoltSelsct).Desc
        : this.DefoltSelsct;
    },
  },
  watch: {
    "ManagerGroup.IfAdd"(val) {
      if (val) {
        try {
          setTimeout(() => {
            this.$refs.InputAddG.$el.children[0].focus();
            // console.log(this.$refs.InputAddG.$el);
          }, 200);
        } catch (error) {
          console.log("errrr");
        }
      }
    },
    "ManagerGroup.UpdateId"(val) {
      let { Name } = this.ArrGroups.find((e) => e.Id === val);
      this.ManagerGroup.ModelUpdate = Name;
    },
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
    Groups: {
      handler(val) {
        // console.log({ ...val });
      },
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
      this.ModelQestions = [];
      this.ManagerGroup.IfUpdate = false;
      this.ManagerGroup.IfDelete = false;
      this.ManagerGroup.IfAdd = false;

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
          try {
            this.IdShinuy[`Item-${row.Id}`] = this.DescDefaultSelect;
          } catch (error) {
            console.log("הייתה שגיאה אחי");
          }
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
            // console.log(element);
            if (element.GroupId) {
              this.Groups[`ItemGroups-${element.Id}`] = element.GroupId;
            } else {
              this.Groups[`ItemGroups-${element.Id}`] = 0;
            }
            if (element.Nextques) {
              this.ModelQestions[`op-${element.Id}`] = element.NextQuestionId;
            } else {
              this.ModelQestions[`op-${element.Id}`] = "ללא שאלה הבאה";
            }
          });
          // console.log(this.OptheOption);
          if (row.TypeQ === 4) {
            // console.log(row);
            let { data } = await this.$ax.get(URL + "GetGroups/" + row.Id);
            console.log(data);
            this.ArrGroups = data;
          }
          this.IfGroups = row.TypeQ === 4;

          //
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
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 0);
    },
    async EventChangeOption(val, id) {
      await this.$nextTick();
      // console.log(val.from.children);
      let arr = [];
      Array.from(val.from.children).forEach((item, i) => {
        // console.log(item.id, i + 1);
        arr.push({ id: item.id, newSek: i + 1 });
      });
      // console.log(arr);
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
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
        setTimeout(() => {
          this.$emit("UpdateData");
        }, 400);
      }, 100);
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
          table.children[1] &&
          table.children[1].children[0] &&
          table.children[1].children[0].children[1] &&
          table.children[1].children[0].children[1].children[0] &&
          table.children[1].children[0].children[1].children[0].children
        ) {
          if (
            table.children[1] &&
            table.children[1].children[0] &&
            table.children[1].children[0].children[1] &&
            table.children[1].children[0].children[1].children[0]
          ) {
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
                el.dir = "rtl";
              });
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    RafreshColumnOfOption(id) {
      setTimeout(() => {
        this.RafreseTable();
        // console.log(id);
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
      // console.log("sd");
    },
    //////////////////////////////
    FocusInputUp() {
      setTimeout(() => {
        try {
          // console.log(this.$refs);
          this.$refs.InputUPDate.$el.children[0].focus();
        } catch (error) {
          console.log(error);
          console.log("errr");
        }
      }, 100);
    },
    async AdddGroup(text, id) {
      const params = { text, id };
      let { data } = await this.$ax.post(URL + "AddGroups", params);
      if (!data) {
        this.$message.error("משהו השתבש");
      } else {
        this.ArrGroups = data;
        this.ManagerGroup.IfAdd = false;
      }
    },
    async DeleteGroup(id) {
      // console.log(id);
      let { data } = await this.$ax.delete(URL + "DeleteGroup/" + id);
      if (data) {
        this.ArrGroups = data;
      } else {
        this.$message.error("משהו השתבש");
      }
      this.ManagerGroup.DeleteId = "";
      this.ManagerGroup.IfDelete = false;
    },
    async UpdateGroup(text, id) {
      let { data } = await this.$ax.put(URL + "UpdateGroup", { text, id });
      if (data) {
        this.ArrGroups = data;
      } else {
        this.$message.error("משהו השתבש");
      }
      this.ManagerGroup.ModelUpdate = "";
      this.ManagerGroup.IfUpdate = false;
    },
    //
    async AddGroupFromOption(IdGroup, id) {
      // console.log({ IdGroup, id });
      // this.RafreshColumnOfOption
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 30);
      let { data } = await this.$ax.post(URL + "AddGroupFromOption", {
        IdGroup,
        id,
      });
      this.$Bool(data, "הקבוצה עודכנה בהצלחה", "משהו השתבש", false);
      if (data) {
        // this.ArrGroups = data
      } else {
      }
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
.ManagerGroups {
  position: absolute;
  right: 0;
  top: 20px;
  width: 40%;
  height: 20%;
  text-align: right;
  h4 {
    border-bottom: 2px solid black;
  }
  .Buttonsz {
    // margin: 7px;
    text-align: center;
    .el-button {
      margin-left: 40px;
    }
  }
  .AllmangGroup {
    display: flex;
    flex-direction: row-reverse;
    // width: 100%;
    // .Butnosy {
    //   width: 100%;
    // }
    .AddG {
      margin-right: 40px;
      width: 100%;
      .InputAdd {
        width: 55%;
      }
      .Butnosy {
        width: 40%;
        position: absolute;
      }
    }
    .DeleteG {
      margin-right: 40px;
      .el-button {
        margin-right: 5px;
      }
    }
    .UpdateG {
      margin-right: 20px;
      .el-select {
        width: 40%;
      }
      .el-button.Back {
        margin: 0 10px;
      }

      .InputUPDate {
        position: absolute;
        left: 25%;
        width: 30%;
        top: 48%;
      }
      .ButUp {
        position: absolute;
        left: 15%;
        top: 48%;
      }
    }
  }
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
.Options {
  .Del-andComp {
    .indeSel {
      position: absolute;
      left: 90px;
      width: 190px;
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
  .button-and-li {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    .el-button--primary.buttonUP {
      background: rgba(4, 82, 252, 0.822);
      position: absolute;
      right: 30%;
      top: 0;
      &:hover {
        background: rgba(4, 83, 252, 0.434);
      }
    }
    .el-button--danger {
      background: rgba(252, 4, 4, 0.822);
      position: absolute;
      top: 0;
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
    .El_select_Groups {
      position: absolute;
      right: 70px;
      top: 0;
    }
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
// $ TypeText :

@media screen and (max-width: 1300px) {
  .table {
    width: 73%;
    position: absolute;
    top: 100px;
    margin-left: 80px;
    transition: all 0.3s;
    .ButtonAddNewNextQustion {
      width: 80px;
    }
    ///
    ///
    ///
    ///
    ///
    .button-and-li {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      position: relative;
      right: -80px;
      .el-button--primary.buttonUP {
        background: rgba(4, 82, 252, 0.822);
        position: absolute;
        right: 30%;
        top: 5px;
        &:hover {
          background: rgba(4, 83, 252, 0.434);
        }
      }
      .el-button--danger {
        background: rgba(252, 4, 4, 0.822);
        position: absolute;
        top: 5px;
        left: 25%;
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
        .el-select {
          position: relative;
          right: 100px;
        }
      }
      .El_select_Groups {
        position: absolute;
        right: 70px;
        top: 0;
      }
    }

    ///
    ///
    ///
    ///
    ///
  }
  .bigTable {
    .DefaultSelectLabelBig {
      position: relative;
      left: 130px;
      top: 60px;
    }
    .DefaultSelectBig {
      position: relative;
      left: -82px;
      top: 120px;
    }
    //
    //
    // $
    .button-and-li {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      position: relative;
      right: -30px;
      .el-button--primary.buttonUP {
        background: rgba(4, 82, 252, 0.822);
        position: absolute;
        right: 30%;
        top: 0;
        &:hover {
          background: rgba(4, 83, 252, 0.434);
        }
      }
      .el-button--danger {
        background: rgba(252, 4, 4, 0.822);
        position: absolute;
        top: 0;
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
      .El_select_Groups {
        position: absolute;
        right: 70px;
        top: 0;
      }
    }

    // $
    //
    //
  }
}
</style>
<style></style>
