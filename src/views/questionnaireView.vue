<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
    "
    ref="Divos"
  >
    <div
      :class="{
        optionsONtheTable: !wachtStore,
        optionsONtheTableBig: wachtStore,
      }"
    >
      <el-button type="success" class="Newquen" @click="openNewQuen"
        >הוסף שאלון חדש</el-button
      >
      <el-input
        v-model="serch"
        :placeholder="pleace"
        :class="{ input: !wachtStore, inputBig: wachtStore }"
        dir="auto"
        ref="inputSerch"
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
          ref="iconInp"
        ></i></el-input
      ><el-select
        v-model="selcto"
        placeholder="חפש לפי.."
        :class="{ selectA: !wachtStore, selectABig: wachtStore }"
      >
        <el-option
          v-for="(d, i) in Allamudot"
          :key="i"
          :label="computedDat(d)"
          :value="d"
          v-show="d !== 'Id' && computedDat(d)"
        ></el-option>
      </el-select>
    </div>
    <h1 class="LoMatzanu" v-show="!data.length > 0">
      "{{ this.serch }}" לא נמצאו תוצאות ל
    </h1>
    <el-table
      :data="data"
      :class="{ table: !wachtStore, tableBig: wachtStore }"
      ref="Table"
      border
      v-loading="loadingTABLE"
      v-show="data.length > 0"
      @row-dblclick="Edit"
    >
      <el-table-column label="אפשרויות">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="Edit(scope.row)"
            ><i class="el-icon-edit"></i> עריכה</el-button
          >
          <el-button type="danger" size="mini" @click="DELETE(scope.row)"
            ><i class="el-icon-delete"></i> מחיקה</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="סטטוס" prop="StatusId">
        <template slot-scope="scope">
          <div>{{ Booleano(scope.row.StatusId) ? "פעיל" : "לא פעיל" }}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="שאלה ראשונית"
        prop="StartQuestion"
      ></el-table-column>

      <el-table-column label="סימן" prop="Symbol"></el-table-column>
      <el-table-column label="שם" prop="Desc"></el-table-column>
    </el-table>
    <div class="divos" v-if="shows.SHdivos">
      <transition appear name="expand">
        <div
          :class="[
            {
              indivos: true,
              queshens: shows.SHnewquestionnaire,
              EditQuen: shows.showeditQuen,
            },
            shows.showWarnning
              ? 'w3-panel w3-pale-red w3-leftbar w3-border-red warning'
              : '',
          ]"
        >
          <i class="el-icon-close" @click="shows.SHdivos = false"></i>
          <div v-show="shows.SHdivos && shows.SHnewquestionnaire">
            <div class="afterTable w3-card-4">
              <div class="rowA">
                <div class="nameQuest">
                  <label>שם שאלון</label>
                  <input
                    key="input-0"
                    type="text"
                    class="w3-input"
                    dir="auto"
                    v-model="newquen.Desc"
                    placeholder="שם שאלון"
                  />
                </div>
                <div class="symbolQuest">
                  <label>סימן</label>
                  <input
                    key="input-1"
                    type="text"
                    class="w3-input"
                    dir="auto"
                    v-model="newquen.Symbol"
                    placeholder="שם סימן "
                  />
                </div>
                <div class="statusQues">
                  <label>סטטוס</label>
                  <el-switch
                    class="stutus"
                    v-model="newquen.StatusId"
                    active-text="פעיל"
                    inactive-text="לא פעיל"
                  ></el-switch>
                </div>
              </div>
              <div class="rowB">
                <div class="Questorind">
                  <label>שאלה ראשונית</label>
                  <el-input
                    key="input-2"
                    type="textarea"
                    dir="auto"
                    :autosize="{ minRows: 2, maxRows: 34 }"
                    v-model="newquen.StartQuestion"
                    placeholder="שאלה ראשונית "
                  >
                  </el-input>
                </div>
                <div class="QuestorindEnd">
                  <label>משפט סיום</label>
                  <el-input
                    key="input-2"
                    type="textarea"
                    dir="auto"
                    :autosize="{ minRows: 2, maxRows: 34 }"
                    v-model="newquen.EndQuestion"
                    placeholder="משפט סיום"
                  >
                  </el-input>
                </div>
                <div class="MonthyQuen">
                  <label>שאלון יומי</label>
                  <el-switch
                    v-model="ifYom"
                    active-text="כן"
                    inactive-text="לא"
                  ></el-switch>
                </div>
                <div class="DateQuest" v-show="ifYom">
                  <label>בחר תאריך</label>
                  <el-date-picker
                    v-model="newquen.Date"
                    type="date"
                    placeholder="בחר תאריך"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div class="rowC">
                <div class="SwichIfMonthy">
                  <label>שאלון חודשי</label>
                  <el-switch
                    v-model="Ifmonthil"
                    active-text="כן"
                    inactive-text="לא"
                  ></el-switch>
                </div>
                <div class="defaultQuen" v-show="Ifmonthil">
                  <label>חודש</label>
                  <input
                    placeholder="חודש"
                    type="number"
                    class="w3-input"
                    v-model="newquen.monthi"
                  />
                </div>
                <el-select
                  placeholder="סוג שאלון"
                  class="ElSELECTZ1"
                  v-model="newquen.type"
                >
                  <el-option
                    v-for="(o, i) in Optoz"
                    :key="i"
                    :label="o.Name"
                    :value="o.Id"
                  ></el-option>
                </el-select>
              </div>
              <div class="rowD">
                <div class="swichIfMonchly">
                  <label>ערך דפולטיבי</label>
                  <el-switch
                    v-model="ifDefault"
                    active-text="כן"
                    inactive-text="לא"
                  ></el-switch>
                </div>
                <div class="Default" v-show="ifDefault">
                  <label>ערך דפולטיבי</label>
                  <input
                    type="text"
                    class="w3-input Inptutozy"
                    v-model="newquen.default"
                  />
                </div>
              </div>
            </div>
            <div class="buttons" v-show="true">
              <el-button
                type="success"
                class="ButtonNext"
                @click="Inserquen"
                :loading="loadingButton"
                ref="buttonNext"
                >צור</el-button
              >
              <el-button
                type="danger"
                class="ButtonNext"
                @click="shows.SHdivos = false"
                >סגור</el-button
              >
            </div>
          </div>
          <div v-show="shows.SHdivos && shows.showWarnning">
            אם תמחק את השאלון הוא ימחק לצמיתות
            <el-button
              type="danger"
              size="small"
              class="dangero"
              @click="deletequen(idOfDel)"
              :loading="loadingButton"
              >מחק</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="primaryo"
              @click="shows.SHdivos = false"
              >סגור</el-button
            >
          </div>
          <div v-show="shows.SHdivos && shows.showeditQuen">
            <div class="inEditQuen w3-card-4">
              <div class="rowEA">
                <div class="newName">
                  <label>שם חדש</label>
                  <input
                    type="text"
                    class="w3-input"
                    v-model="newqunto.Desc"
                    dir="auto"
                  />
                </div>
                <div class="newSymbol">
                  <label class="labelBayaB">סימן חדש</label>
                  <input
                    type="text"
                    class="w3-input"
                    dir="auto"
                    v-model="newqunto.Symbol"
                  />
                </div>
                <div class="newStat">
                  <label class="labelBayaB">סטטוס חדש</label>
                  <el-switch
                    v-model="newqunto.StatusId"
                    active-text="פעיל"
                    inactive-text="לא פעיל"
                  ></el-switch>
                </div>
              </div>
              <div class="rowEB">
                <div class="startQuesh">
                  <label>שאלה ראשונית חדשה</label>
                  <el-input
                    placeholder="שאלה ראשונית חדשה"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    class="inputTextarea"
                    dir="auto"
                    v-model="newqunto.StartQuestion"
                  />
                </div>
                <div class="startQueshEnd">
                  <label>משפט סיום</label>
                  <el-input
                    placeholder="שאלה אחרונה חדשה"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    class="inputTextarea"
                    dir="auto"
                    v-model="newqunto.EndQuestion"
                  />
                </div>
                <div
                  class="ifMonthio"
                  v-show="newqunto.QuestionnaireTypesId === 1"
                >
                  <label>אם שאלון יומי</label>
                  <el-switch
                    v-model="IfYomy"
                    active-text="כן"
                    inactive-text="לא"
                  ></el-switch>
                </div>
                <div
                  class="Date"
                  v-show="IfYomy && newqunto.QuestionnaireTypesId === 1"
                >
                  <label>תאריך יומי</label>
                  <el-date-picker
                    v-model="newqunto.Dayly"
                    placeholder="תאריך חדש"
                  ></el-date-picker>
                </div>
              </div>
              <div class="rowEC">
                <div class="QTYpe">
                  <label>סוג שאלון</label>
                  <el-select
                    placeholder="סוג שאלון"
                    class="ElSELECTZ"
                    v-model="newqunto.QuestionnaireTypesId"
                  >
                    <el-option
                      v-for="(o, i) in Optoz"
                      :key="i"
                      :label="o.Name"
                      :value="o.Id"
                    ></el-option>
                  </el-select>
                </div>
                <div
                  class="ifMonthi"
                  v-show="newqunto.QuestionnaireTypesId === 1"
                >
                  <label>אם שאלון חודשי</label>
                  <el-switch
                    v-model="MonthiVal"
                    active-text="כן"
                    inactive-text="לא"
                  ></el-switch>
                </div>
                <div
                  class="Number"
                  v-show="MonthiVal && newqunto.QuestionnaireTypesId === 1"
                >
                  <label>חודש</label>
                  <el-input
                    size="medium"
                    placeholder="מספר"
                    v-model="newqunto.Monthly"
                  ></el-input>
                </div>

                <div class="rowED">
                  <el-switch
                    v-show="newqunto.QuestionnaireTypesId === 1"
                    class="SwitchDefaultId"
                    v-model="IFdefaultE"
                    active-text="כן"
                    inactive-text="לא"
                  ></el-switch>
                </div>
                <div
                  class="DefaultId"
                  v-show="IFdefaultE && newqunto.QuestionnaireTypesId === 1"
                >
                  <label>דפולט</label>
                  <el-input
                    size="medium"
                    placeholder="מספר"
                    v-model="newqunto.DefaultId"
                  ></el-input>
                </div>
              </div>
            </div>
            <div class="bottonsInD">
              <el-button
                type="primary"
                class="shmorTO"
                @click="EditQuen"
                :loading="loadingButton"
                >שמור</el-button
              >
              <el-button
                type="danger"
                class="sgorTo"
                @click="shows.SHdivos = false"
                >סגור</el-button
              >
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
export default {
  data() {
    return {
      IFdefaultE: false,
      MonthiVal: false,
      ifDefault: false,
      ifYom: false,
      IfYomy: false,
      Ifmonthil: false,
      console,
      data: [],
      data2: [],
      serch: "",
      loadingTABLE: false,
      TimeoutSerch: "",
      loading: true,
      selcto: "Desc",
      Allamudot: [],
      newquen: {
        Desc: "",
        Symbol: "",
        StartQuestion: "",
        StatusId: true,
        Date: "",
        default: "",
        monthi: "",
        type: 1,
      },
      shows: {
        SHdivos: false,
        SHnewquestionnaire: false,
        showWarnning: false,
      },
      rowEdit: [],
      newqunto: {},
      Optoz: {},
      loadingButton: false,
      idOfDel: "",
      showeditQuen: "",
      WachDate: false,
      DateZ: "",
    };
  },
  computed: {
    Monthi() {
      return this.newquen.Monthly;
    },

    pleace() {
      return `סנן לפי ${this.computedDat(this.selcto)}...`;
    },
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },

  watch: {
    ifYom(val) {
      //newquen.Date
      if (val) {
        this.Ifmonthil = false;
        this.ifDefault = false;
        this.newquen.default = null;
        this.newquen.monthi = null;
      }
    },
    Ifmonthil(val) {
      //newquen.monthi
      if (val) {
        this.ifYom = false;
        this.ifDefault = false;
        this.newquen.Date = null;
        this.newquen.default = null;
      }
    },
    ifDefault(val) {
      //newquen.default
      if (val) {
        this.ifYom = false;
        this.Ifmonthil = false;
        this.newquen.Date = null;
        this.newquen.monthi = null;
      }
    },
    //
    IfYomy(val) {
      //newqunto.Dayly
      if (val) {
        this.MonthiVal = false;
        this.IFdefaultE = false;
        this.newqunto.Monthly = null;
        this.newqunto.DefaultId = null;
      }
    },
    MonthiVal(val) {
      //newqunto.Monthly
      if (val) {
        this.IfYomy = false;
        this.IFdefaultE = false;
        this.newqunto.Dayly = null;
        this.newqunto.DefaultId = null;
      }
    },
    IFdefaultE(val) {
      //newqunto.DefaultId
      if (val) {
        this.IfYomy = false;
        this.MonthiVal = false;
        this.newqunto.Dayly = "";
        this.newqunto.Monthly = "";
      }
    },
    //
    "newqunto.Dayly"(val, Old) {
      console.log(Boolean(Old));
      if (Old) {
        let date = new Date(val);
        date.setDate(date.getDate() + 1);
        this.DateZ = date;
      } else {
        this.DateZ = val;
      }
    },
    "shows.SHdivos"(val) {
      if (val) {
        this.$store.commit("Setmessage", true);
      } else {
        this.$store.commit("Setmessage", false);
        for (const key in this.shows) {
          this.shows[key] = false;
        }
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
  },
  async mounted() {
    const response = await this.$ax.get(URL + "GetOptionTypeQuesinnaire");
    // console.log(response.data);
    this.Optoz = response.data;
    let result = await this.$ax.get(URL);
    this.data = result.data;
    this.data2 = result.data;
    let { data } = await this.$ax(URL + "Getamudes");
    this.Allamudot = data;
    this.loading = false;
    let el = this.$refs.Divos;
    el.style.zIndex = "";
    el.style.position = "absolute";
    await this.$nextTick();
    this.SortTable();
    this.SortInput();
    //inputSerch
  },
  methods: {
    computedDat(val) {
      if (val === "Desc") {
        return "שם";
      } else if (val === "Symbol") {
        return "סימן";
      } else if (val === "StartQuestion") {
        return "שאלה ראשונית";
      } else if (val === "StatusId") {
        return "סטטוס";
      }
      return null;
    },
    SortTable() {
      let table = this.$refs.Table.$el;
      // console.log(table);
      let TableHeader =
        table.children[1].children[0].children[1].children[0].children;
      Array.from(TableHeader).forEach((element) => {
        element.style.textAlign = "center";
      });
      let tds = table.children[2].children[0].children[1].children;
      // console.log(tds);
      Array.from(tds).forEach((element) => {
        Array.from(element.children).forEach((el) => {
          el.style.textAlign = "right";
        });
      });
    },
    SortInput() {
      let inp = this.$refs.inputSerch.$el.children[0];
      inp.style.background = "none";
      inp.style.color = "black";
      inp.addEventListener("focus", () => {
        inp.style.backgroundColor = "white";
        inp.style.borderRadius = "20px";
      });
      inp.addEventListener("blur", () => {
        inp.style.background = "none";
        inp.style.borderRadius = "";
      });
      let icon = this.$refs.iconInp;
      icon.style.fontSize = "20px";
      icon.style.position = "absolute";
      icon.style.left = "0";
      icon.style.top = "-6px";
    },
    async SerchQuery(query) {
      const params = { query, clumn: this.selcto };
      // console.log(params);
      let { data } = await this.$ax.post(URL + "SerchQushinnere", params);
      // console.log(data);
      this.data = data;
      this.SortTable();

      this.loadingTABLE = false;
      setTimeout(() => {
        this.SortTable();
      }, 300);
    },
    Edit(row) {
      // this.idOfE = row.Id;
      console.log(row);
      this.rowEdit = [row];
      if (!row.QuestionnaireTypesId) this.newqunto.QuestionnaireTypesId = 1;
      let stat = row.StatusId;
      let M = row.Monthly;
      let Os = row.Dayly;
      let z = row.DefaultId;
      this.newqunto = row;
      // this.newqunto.Monthly = Boolean(M);
      this.newqunto.StatusId = Boolean(stat);
      // this.newqunto.EndQuestion = row.EndQuestion;
      this.IfYomy = Boolean(Os);
      this.MonthiVal = Boolean(M);
      this.IFdefaultE = Boolean(z);
      this.newquen.Symbol = row.Symbol;
      this.newquen.StartQuestion = row.StartQuestion;
      this.newquen.StatusId = row.StatusId;
      this.shows.SHdivos = true;
      this.shows.showeditQuen = true;
    },
    async EditQuen() {
      const Booleano =
        (this.IfYomy && this.newqunto.Dayly) ||
        (this.MonthiVal && this.newqunto.Monthly) ||
        (this.IFdefaultE && this.newqunto.DefaultId) ||
        this.newqunto.QuestionnaireTypesId !== 1;
      //
      if (Booleano) {
        let AddYom;
        if (this.WachDate) {
          AddYom = true;
        } else {
          AddYom = false;
        }
        this.newqunto.Dayly = this.DateZ;
        this.newqunto.AddYom = AddYom;
        this.loadingButton = true;
        if (this.newqunto.QuestionnaireTypesId !== 1) {
          this.newqunto.Dayly = null;
          this.newqunto.Monthly = null;
          this.newqunto.DefaultId = null;
        }
        let { data } = await this.$ax.post(URL + "EditOfquen", this.newqunto);
        if (data) {
          this.$message.success("עודכן בהצלחה");
          location.reload();
          this.loadingButton = false;
        } else {
          this.$message.error("משהו השתבש");
          this.loadingButton = false;
        }
      } else {
        if (this.IfYomy) {
          this.$message.error("כתוב תאריך");
        } else if (this.MonthiVal) {
          this.$message.error("כתוב חודש");
        } else if (this.IFdefaultE) {
          this.$message.error("הוסף ערך");
        } else if (
          !this.IFdefaultE &&
          !this.MonthiVal &&
          !this.IfYomy &&
          this.newqunto.QuestionnaireTypesId === 1
        ) {
          this.$message.error("בחר יומי או חודשי או דפולטיבי");
        }
      }
    },
    DELETE(row) {
      console.log(row);
      this.shows.SHdivos = true;
      this.shows.showWarnning = true;
      this.idOfDel = row.Id;
    },
    async deletequen(id) {
      // console.log(id);
      this.loadingButton = true;
      let { data } = await this.$ax.delete(URL + "Delquen/" + id);
      if (data) {
        this.$message.success("נמחק בהצלחה");
        this.loadingButton = false;
        this.shows.SHdivos = false;
        // console.log(Array.isArray(this.data));
        let i = this.data.findIndex((e) => e.Id === id);
        console.log(i);
        this.data.splice(i, 1);
      } else {
        this.$message.error("משהו השתבש אחי");
        this.loadingButton = false;
      }
    },
    openNewQuen() {
      this.shows.SHdivos = true;
      this.shows.SHnewquestionnaire = true;
      this.newquen.Desc = "";
      this.newquen.Symbol = "";
      this.newquen.StartQuestion = "";
      this.newquen.StatusId = "";
    },
    async Inserquen() {
      this.loadingButton = true;
      // console.log({ ...this.newquen });
      if (
        true
        // (this.ifYom && this.newquen.Date) ||
        // (this.newquen.monthi && this.newquen.default && this.newquen.Desc)
      ) {
        let { data } = await this.$ax.post(URL + "newequen", this.newquen);
        this.loadingButton = false;
        if (data) {
          this.$message.success("נוסף בהצלחה");
          this.shows.SHdivos = false;
          this.shows.SHnewquestionnaire = false;
          location.reload();
          this.newquen.Desc = "";
          this.newquen.Symbol = "";
          this.newquen.StartQuestion = "";
          this.newquen.StatusId = "";
        } else {
          this.$message.error("משהו השתבש");
          this.shows.SHdivos = false;
          this.shows.SHnewquestionnaire = false;
        }
      } else {
        if (this.ifYom) {
          this.$message.error("מלא תאריך אחינו");
        } else if (this.newquen.monthi) {
          this.$message.error("מלא חודש");
        } else if (!this.newquen.Desc) {
          this.$message.error("מלא שם");
        } else if (!this.ifYom && !this.newquen.monthi) {
          this.$message.error("בחר תאריך יומי או חודשי");
        }
        this.loadingButton = false;
      }
    },
    isNumeric(str) {
      if (typeof str !== "string") return false;
      return !isNaN(str) && !isNaN(parseFloat(str));
    },
    Booleano(val) {
      return Boolean(val);
    },
  },
};
</script>
<style scoped lang="scss">
.optionsONtheTable {
  background: linear-gradient(
    rgb(166, 209, 209),
    rgb(174, 107, 107),
    rgb(52, 55, 64)
  );
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  width: 69.9%;
  top: 40px;
  height: 3.9em;
  left: 117px;
  transition: all 0.3s;
  &Big {
    background: linear-gradient(
      rgb(166, 209, 209),
      rgb(174, 107, 107),
      rgb(52, 55, 64)
    );
    display: flex;
    flex-direction: row-reverse;
    position: absolute;
    width: 86%;
    top: 40px;
    height: 3.9em;
    left: 117px;
    transition: all 0.3s;
  }
}
.input {
  width: 400px;
  z-index: 501;
  position: relative;
  right: 250px;
  top: 8px;
  transition: all 0.3s;
  &Big {
    width: 650px;
    z-index: 501;
    position: relative;
    right: 250px;
    top: 8px;
    transition: all 0.3s;
  }
}
.selectA {
  z-index: 501;
  position: relative;
  right: 300px;
  top: 8px;
  &Big {
    z-index: 501;
    position: relative;
    right: 340px;
    top: 8px;
  }
}
.Newquen {
  position: absolute;
  top: 0;
  right: 0;
  &:hover {
    font-size: 23px;
    color: black;
  }
}
.table {
  width: 70%;
  position: absolute;
  top: 100px;
  left: 0;
  margin-left: 116px;
  height: 700px;
  z-index: 3;
  border: 3px solid black;
  overflow-y: auto;
  padding-bottom: 50px;
  transition: all 0.3s;
  &Big {
    width: 86%;
    position: absolute;
    top: 100px;
    right: 0;
    margin-right: 96.9px;
    height: 700px;
    z-index: 3;
    border: 3px solid black;
    overflow-y: auto;
    padding-bottom: 50px;
    transition: all 0.3s;
  }
}
.queshens {
  background: white;
  height: 600px;
  width: 990px;
  left: 200px;
  top: 60px;
  padding: 40px;
  border: 13px solid rgb(55, 55, 216);
  border-radius: 20px;
  overflow-y: hidden;
  /* padding-bottom: 40px; */
}
.TableB {
  position: relative;
  top: 0;
  right: 0;
}
.afterTable {
  position: relative;
  /* top: 10px; */
  border: 3px solid black;
  padding: 25px;
  padding-top: 10px;
  padding-bottom: 40px;
  height: 450px;
  border-radius: 10px;
  overflow-y: hidden;
  overflow-x: hidden;
  label {
    float: right;
    margin: 10px;
  }
  .w3-input {
    margin-bottom: 10px;
    text-align: right;
    &::placeholder {
      text-align: right;
      color: rgba(152, 132, 132, 0.771);
    }
  }
}
.ButtonNext {
  float: right;
  margin: 5px;
  width: 150px;
  box-shadow: 0 0 7px 2px rgb(136, 123, 123);
  &:hover {
    box-shadow: 0 0 2px 0;
  }
}
.buttons {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 40px;
}
.warning {
  /* background: rgb(255, 255, 255); */
  width: 300px;
  height: 210px;
  padding: 70px;
  text-align: center;
  left: 530px;
  /* border-radius: 20px; */
}
.EditQuen {
  width: 1020px;
  /* width: 880px; */
  background: rgba(255, 255, 255, 0.547);
  /* height: 640px; */
  height: 550px;
  top: 30px;
  border: 10px solid rgba(206, 215, 164, 0.586);
  padding-bottom: 50px;
  left: 240px;
  border-radius: 20px;

  .inEditQuen {
    border: 3px solid black;
    height: 400px;
    width: 90%;
    display: block;
    /* margin: 30px; */
    margin: 40px;
    border-radius: 20px;
    overflow-y: auto;
    overflow-x: hidden;

    .w3-input {
      width: 220px;
      background: none;
      border-color: black;
    }
    label {
      &:not(.labelBaya, .labelBayaB) {
        position: relative;
        left: 170px;
      }
    }
    .el-row {
      position: relative;
      left: 50px;
      margin-bottom: 40px;
    }
    .labelBaya {
      position: relative;
      left: 90px;
      margin-bottom: 8px;
    }
    .labelBayaB {
      position: relative;
      left: 150px;
    }
    .inputTextarea {
      position: relative;
      top: 25px;
      width: 280px;
    }
  }
  .bottonsInD {
    position: relative;
    right: 20px;
  }
}
.LoMatzanu {
  position: absolute;
  top: 30%;
  left: 30%;
}
//
.afterTable {
  .rowA {
    display: flex;
    flex-direction: row-reverse;
    margin: 15px;
    .symbolQuest {
      margin-right: 40px;
    }
    .statusQues {
      label {
        position: absolute;
      }
      .stutus {
        position: relative;
        right: 45px;
        top: 50px;
      }
    }
  }
  .rowB {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    right: 0;
    margin: 35px;
    .MonthyQuen {
      margin: 13px;
      position: relative;
      // right: 380px;
      right: 54px;
      top: 30px;
      label {
        position: absolute;
        top: -40px;
        right: -10px;
      }
    }
    .DateQuest {
      position: absolute;
      top: 40px;
      left: -310px;
      label {
        position: absolute;
        top: -40px;
        text-align: right;
        right: 0;
      }
    }
    .Questorind {
      position: relative;
      bottom: 50px;
      &End {
        position: absolute;
        bottom: -50px;
      }
    }
  }
  .rowC {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    right: -80px;
    margin: 35px;
    top: 150px;
    .defaultQuen {
      width: 140px;
      position: absolute;
      top: 40px;
      left: -680px;
    }
    .ElSELECTZ1 {
      position: absolute;
      left: -280px;
      bottom: -190px;
    }
  }
  .rowD {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    right: 350px;
    margin: 35px;
    top: 310px;
  }
}

.rowEA {
  display: flex;
  flex-direction: row-reverse;
  margin: 25px;
  position: relative;
  .newSymbol {
    margin-right: 60px;
  }
  .newStat {
    // margin-right: 140px;
    margin-right: 60px;
    position: relative;
    top: 25px;
    label {
      position: absolute;
      top: -30px;
      // left: 40px;
      left: 110px !important;
    }
  }
}
.rowEB {
  display: flex;
  flex-direction: row-reverse;
  margin: 25px;
  position: absolute;
  right: 70px;
  .startQuesh {
    position: relative;
    bottom: 30px;
    label {
      position: absolute;
      top: -30px;
      left: 68% !important;
    }
    &End {
      position: absolute;
      bottom: -60px;
      label {
        position: absolute;
        top: -30px;
        left: 79% !important;
      }
    }
  }
}
.rowEC {
  display: flex;
  flex-direction: row-reverse;
  margin: 25px;
  position: absolute;
  right: 70px;
  top: 300px;
  .Number {
    position: relative;
    // right: 290px;
    // bottom: 90px;
    right: 330px;
    bottom: 50px;
    label {
      font-size: 16px;
      position: absolute !important;
      right: -60px !important;
      top: -24px !important;
    }
  }
  .QTYpe {
    position: relative;
    top: 40px;
    left: 30px;
  }
}
.rowED {
  display: flex;
  flex-direction: row-reverse;
  margin: 25px;
  position: absolute;
  right: 450px;
  top: 0px;
}
.DefaultId {
  position: absolute;
  left: -560px;
  top: -10px;
}
.LabelAkshan {
  position: absolute;
  top: -80px;
  left: 64% !important;
}
.Date {
  position: relative;
  top: 20px;
  left: -10px;
  /* left: 60px; */
}
.Date .el-input {
  position: relative;
  left: 20px;
}
.Date label {
  position: absolute !important;
  top: -40px;
  right: -60px !important;
}
.ifMonthio {
  position: relative;
  right: -36px;
  top: 30px;
  transition: all 0.3s;
}
.ifMonthio label {
  position: absolute;
  top: -40px;
  left: 90px !important;
}
.ifMonthi {
  position: relative;
  right: 313px;
  top: -40px;
}
.ifMonthi label {
  position: absolute;
  top: -40px;
  left: 90px !important;
}
.ElSELECTZ {
  position: absolute;
  right: 50px;
  width: 220px;
}
.MonthyQuen {
  position: absolute;
}
.SwichIfMonthy {
  position: relative;
  right: 470px;
  top: 100px;
}
.SwichIfMonthy label {
  position: absolute;
  top: -40px;
  left: 0px !important;
  width: 100%;
}
.Inptutozy {
  width: 140px;
}
.swichIfMonchly {
  position: relative;
  right: 40px;
  top: 20px;
}
.swichIfMonchly {
  label {
    position: absolute;
    top: -40px;
    left: -10px !important;
    width: 110px;
    display: inline-block;
  }
}
.SwitchDefaultId {
  position: relative;
  left: 100px;
}
.Default {
  position: absolute;
  left: -330px;
}
</style>
<style></style>
