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
    <el-button type="success" class="Newquen" @click="openNewQuen"
      >הוסף שאלון חדש</el-button
    >
    <el-input v-model="serch" :placeholder="pleace" class="input" dir="auto">
      <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input
    ><el-select v-model="selcto" placeholder="חפש לפי.." class="selectA">
      <el-option
        v-for="(d, i) in Allamudot"
        :key="i"
        :label="computedDat(d)"
        :value="d"
        v-show="d !== 'Id'"
      ></el-option>
    </el-select>
    <el-table :data="data" class="table" ref="Table" border>
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
      <el-table-column label="סטטוס" prop="StatusId"></el-table-column>

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
              <!-- <div class="title" v-if="active !== 4">{{ titleFornewquen }}</div> -->
              <label>שם שאלון</label>
              <input
                key="input-0"
                type="text"
                class="w3-input"
                dir="auto"
                v-model="newquen.Desc"
                placeholder="שם שאלון"
              />
              <!-- v-if="active === 0" -->
              <label>סימן</label>
              <input
                key="input-1"
                type="text"
                class="w3-input"
                dir="auto"
                v-model="newquen.Symbol"
                placeholder="שם סימן "
              />
              <!-- v-if="active === 1" -->
              <label>שאלה ראשונית</label>
              <el-input
                key="input-2"
                type="textarea"
                dir="auto"
                :autosize="{ minRows: 4, maxRows: 34 }"
                v-model="newquen.StartQuestion"
                placeholder="שאלה ראשונית "
              >
                <!-- v-if="active === 2" -->
              </el-input>
              <label>סטטוס</label>
              <input
                key="input-3"
                type="text"
                class="w3-input"
                dir="auto"
                v-model="newquen.StatusId"
                placeholder="סטטוס"
              />
              <!-- v-if="active === 3" -->
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
            <el-table :data="rowEdit">
              <el-table-column label="שם" prop="Desc"></el-table-column>
              <el-table-column label="סימן" prop="Symbol"></el-table-column>
              <el-table-column
                label="שאלה ראשונית"
                prop="StartQuestion"
              ></el-table-column>
              <el-table-column label="סטטוס" prop="StatusId"></el-table-column>
            </el-table>
            <div class="inEditQuen w3-card-4">
              <el-row>
                <el-col :span="12">
                  <label>שם חדש</label>
                  <input
                    type="text"
                    class="w3-input"
                    v-model="newqunto.Desc"
                    dir="auto"
                  />
                </el-col>
                <el-col :span="12">
                  <label class="labelBayaB">סימן חדש</label>
                  <input
                    type="text"
                    class="w3-input"
                    dir="auto"
                    v-model="newqunto.Symbol"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="position: relative; left: 140px">
                  <label class="labelBayaB">סטטוס חדש</label>
                  <input
                    type="text"
                    class="w3-input"
                    dir="auto"
                    v-model="newqunto.StatusId"
                  />
                </el-col>
              </el-row>
              <el-row style="position: relative; left: 140px">
                <el-col :span="12">
                  <label class="labelBaya">שאלה ראשונית חדשה</label>
                  <el-input
                    placeholder="שאלה ראשונית חדשה"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    class="inputTextarea"
                    dir="auto"
                    v-model="newqunto.StartQuestion"
                  />
                </el-col>
              </el-row>
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
      data: [],
      data2: [],
      serch: "",
      loading: true,
      selcto: "Desc",
      Allamudot: [],
      newquen: {
        Desc: "",
        Symbol: "",
        StartQuestion: "",
        StatusId: "",
      },
      shows: {
        SHdivos: false,
        SHnewquestionnaire: false,
        showWarnning: false,
      },
      rowEdit: [],
      newqunto: {},
      loadingButton: false,
      idOfDel: "",
      showeditQuen: "",
      // idOfE: "",
    };
  },
  watch: {
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
      this.data = this.data.filter((e) => {
        console.log(e);
        // console.log(e[this.selcto]);
        if (e[this.selcto]) {
          return e[this.selcto].includes(val);
        } else {
          return false;
        }
      });
      if (val === "") {
        this.data = this.data2;
        this.SortTable();
      }
      this.SortTable();
    },
  },
  computed: {
    pleace() {
      return `סנן לפי ${this.selcto}...`;
    },
  },
  async mounted() {
    let result = await this.$ax.get(URL);
    this.data = result.data;
    this.data2 = result.data;
    let { data } = await this.$ax(URL + "Getamudes");
    this.Allamudot = data;
    this.loading = false;
    let el = this.$refs.Divos;
    el.style.zIndex = "";
    await this.$nextTick();
    this.SortTable();
    document.addEventListener("DOMContentLoaded", function () {
      let inputs = document.querySelectorAll('input[type="text"]');
      inputs.forEach(function (input) {
        input.setAttribute("dir", "auto");
      });
    });
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

      return "val";
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
    Edit(row) {
      // this.idOfE = row.Id;
      this.rowEdit = [row];
      this.newqunto = row;
      this.newquen.Desc = row.Desc;
      this.newquen.Symbol = row.Symbol;
      this.newquen.StartQuestion = row.StartQuestion;
      this.newquen.StatusId = row.StatusId;
      this.shows.SHdivos = true;
      this.shows.showeditQuen = true;
    },
    async EditQuen() {
      // let id = this.idOfE;
      this.newqunto.StatusId = this.newqunto.StatusId;
      if (!this.isNumeric(this.newqunto.StatusId)) {
        this.$message.error("תגיד אחי מה אתה משוגע חייב מספרים");
        this.loadingButton = false;
        return;
      }
      this.loadingButton = true;
      let { data } = await this.$ax.post(URL + "EditOfquen", this.newqunto);
      if (data) {
        this.$message.success("עודכן בהצלחה");
        location.reload();
      } else {
        this.$message.error("משהו השתבש");
        this.loadingButton = false;
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
      // console.log(typeof +this.newquen.StatusId);
      if (!this.isNumeric(this.newquen.StatusId)) {
        this.$message.error("תגיד אחי מה אתה משוגע חייב מספרים");
        this.loadingButton = false;
        return;
      }
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
    },
    isNumeric(str) {
      if (typeof str !== "string") return false;
      return !isNaN(str) && !isNaN(parseFloat(str));
    },
  },
};
</script>
<style scoped>
.table {
  width: 70%;
  position: absolute;
  top: 100px;
  right: 0;
  margin-right: 340px;
  height: 700px;
  z-index: 3;
  border: 3px solid black;
  overflow-y: auto;
  padding-bottom: 50px;
}
.input {
  position: absolute;
  top: 40px;
  right: 35.7%;
  width: 400px;
  z-index: 501;
}
.selectA {
  position: absolute;
  top: 40px;
  right: 61.8%;
  z-index: 501;
}
.Newquen {
  position: absolute;
  top: 40px;
  right: 22.2%;
}
.Newquen:hover {
  font-size: 23px;
  color: black;
}
.queshens {
  background: white;
  height: 600px;
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
}
.afterTable label {
  float: right;
  margin: 10px;
}
.afterTable .w3-input {
  margin-bottom: 10px;
  text-align: right;
}
.w3-input::placeholder {
  text-align: right;
  color: rgba(152, 132, 132, 0.771);
}
.ButtonNext {
  float: right;
  margin: 5px;
  width: 150px;
  box-shadow: 0 0 7px 2px rgb(136, 123, 123);
}
.ButtonNext:hover {
  box-shadow: 0 0 2px 0;
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
  background: rgba(255, 255, 255, 0.547);
  height: 630px;
  top: 50px;
  border: 10px solid rgba(206, 215, 164, 0.586);
  padding-bottom: 50px;
}
.inEditQuen {
  border: 3px solid black;
  height: 400px;
  width: 90%;
  display: block;
  margin: 30px;
  border-radius: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
.inEditQuen .w3-input {
  width: 220px;
  background: none;
  border-color: black;
}
.inEditQuen label:not(.labelBaya, .labelBayaB) {
  position: relative;
  left: 170px;
}
.labelBaya {
  position: relative;
  left: 90px;
  margin-bottom: 8px;
  /* border-bottom: 3px solid black; */
}
.inEditQuen .el-row {
  position: relative;
  left: 50px;
  margin-bottom: 40px;
}
.labelBayaB {
  position: relative;
  left: 150px;
}
.inputTextarea {
  position: relative;
  top: 25px;
}
.bottonsInD {
  position: relative;
  right: 20px;
}
</style>
<style>
body {
  background: rgb(170, 170, 170);
  padding-bottom: 1000px;
}
input {
  text-align: right;
}
input::placeholder {
  text-align: right;
}
textarea::placeholder {
  text-align: right;
}
</style>
