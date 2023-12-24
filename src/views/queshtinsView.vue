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
        >הוסף שאלה</el-button
      >
      <el-input
        v-show="!showRadio"
        v-model="serch"
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
      <el-table-column
        label="NextQuestionId"
        prop="NextQuestionId"
      ></el-table-column>
      <el-table-column label="StatusId" prop="StatusId"></el-table-column>
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
      <el-table-column label="שאלה" prop="Desc"></el-table-column>
      <el-table-column label="שאלון" prop="DescQuestionnaire"></el-table-column>
      <el-table-column type="expand" v-if="LoadingOptionss">
        <template>
          <div v-show="theOption.length > 0">
            <div class="parentsheaderOFAnswers">
              <h1 class="headerOFAnswers">אופציות</h1>
            </div>
            <ul class="Answers">
              <li v-for="(O, i) in theOption" :key="i" class="button-and-li">
                <span>{{ O.Desc }}</span>
                <el-button type="primary" size="mini">עדכן</el-button>
                <el-button type="danger" size="mini">מחק</el-button>
              </li>
              <el-divider></el-divider>
              <el-button type="success">הוספה</el-button>
            </ul>
          </div>
          <div v-show="!theOption.length > 0" class="Div-else-show">
            <el-button type="success">אין כאן כלום זמן להוסיף</el-button>
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
            { Edito: shows.showEdit, newQ: shows.shownewqustion },
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
              <el-table-column
                label="StatusId"
                prop="StatusId"
              ></el-table-column>
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
                <input type="text" class="w3-input" v-model="rowEdit.Desc" />
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
                <div class="itemEditisEnd">
                  <label>אם אחרון</label>
                  <el-switch
                    v-model="rowEdit.IsEnd"
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
                @click="shows.showDivos = false"
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
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import _ from "lodash";

export default {
  name: "BprevenQueshtinsView",

  data() {
    return {
      serch: "",
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
      },
      Alldata: {
        NameQuen: [],
        DataType: [],
      },
      rowEdit: {},
      newQuens: {
        DescQ: "",
        NameQ: "",
        typeData: "",
        IsEnd: false,
      },
      idOfDel: "",
      LoadingButton: false,
      showZE: false,
      loadingTABLE: false,
      showRadio: false,
      theOption: [],
      LoadingOptionss: true,
    };
  },
  watch: {
    LoadingOptionss(val) {
      console.log(" LoadingOptionss(val)", val);
    },
    loadingTABLE(val) {
      if (!val) {
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
    let { data } = await this.$ax(URL + "GetQuestions");
    // console.log(data);
    this.data = data;
    this.data2 = data;
    let res = await this.$ax.get(URL + "GetData");
    // console.log(res.data);
    this.Alldata.DataType = res.data.DataType;
    this.Alldata.NameQuen = res.data.NameQuen;
    await this.$nextTick();
    this.SortTable();
    this.sortInput();
    this.sortRadio();
  },

  methods: {
    async GetOptions(row, expanded) {
      await this.$nextTick();
      // console.log("Row:", row);
      // console.log("Expanded:", expanded.length);
      if (expanded.length === 0) {
        this.theOption = [];
        // this.$message("נסגר");
      } else if (expanded.length !== 0) {
        // this.$message("פתוח");
        this.loadingTABLE = true;
        this.LoadingOptionss = false;
        let { data } = await this.$ax.get(URL + "GetOption/" + row.Id);
        this.theOption = data;
        // console.log("this.theOption", this.theOption);
        // console.log(this.LoadingOptionss);
        setTimeout(() => {
          this.loadingTABLE = false;
          this.LoadingOptionss = true;
        }, 500);
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
      let table = this.$refs.Table.$el;
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
    SerchQuery(val) {
      this.data = this.data2;
      ["טקסט", "אופציות", "מספר", "תאריך"].forEach((text) => {
        if (Array.from(text).every((character) => val.includes(character))) {
          val = this.REVERScomputedData(text);
        }
      });
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
      // console.log(row);
      this.rowEdit = row;
      this.shows.showDivos = true;
      this.shows.showEdit = true;
      this.rowEdit.DescDataType = this.computedData(this.rowEdit.DescDataType);
    },
    async EditQ() {
      //   console.log(this.rowEdit);
      this.rowEdit.DescDataType = this.REVERScomputedData(
        this.rowEdit.DescDataType
      );
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
  },
};
</script>
<style scoped>
.optionsONtheTable {
  background: linear-gradient(rgb(158, 170, 170), rgb(59, 62, 70));
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  width: 76%;
  top: 40px;
  height: 4em;
  left: 85px;
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
  right: 200px;
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
  width: 76%;
  position: absolute;
  top: 100px;
  margin-left: 85px;
}
.buttons {
  display: flex;
}
.Edito {
  background: rgb(209, 207, 194);
  /* width: 950px; */
  width: 660px;
  left: 300px;
  height: 540px;
  top: 50px;
  border-radius: 4px;
  padding-bottom: 60px;
}
.inEdito {
  border: 3px solid black;
  width: 540px;
  height: 290px;
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
.iteminEditSelct label {
  position: relative;
  bottom: 40px;
  left: 230px;
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
.iteminEditSelct {
  margin-bottom: 40px;
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
  height: 440px;
  width: 800px;
  left: 280px;
  top: 60px;
}
.innewQ {
  border: 3px solid black;
  width: 600px;
  /* width: 480px; */
  height: 300px;
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
/* Transition */
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
  left: 33%;
  border-radius: 15px;
  color: black;
}
.button-and-li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button-and-li .el-button {
  position: relative;
  left: 300px;
  /* top: 5px; */
  margin-bottom: 20px;
}
.button-and-li .el-button--primary {
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
.Answers .el-button--success {
  width: 300px;
  background: rgb(46, 156, 46);
}
.Answers .el-button--success:hover {
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
</style>
