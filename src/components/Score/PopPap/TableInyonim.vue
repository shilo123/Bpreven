<template>
  <div>
    <i class="el-icon-close" @click="$emit('SgorDivos')"></i>
    <div class="opTable">
      <el-select v-model="AddTo" size="medium">
        <el-option
          v-for="(O, i) in OpL"
          :key="i"
          :value="O.val"
          :label="O.name"
        ></el-option>
      </el-select>
      <el-select
        v-model="Selected"
        class="Elselected"
        size="medium"
        placeholder="אין מידע"
        no-data-text="נגמר אחי"
      >
        <el-option
          v-for="(O, i) in ObjAlldata[AddTo]"
          :key="i"
          :label="
            AddTo === 'DescFeacher' || AddTo === 'DescMes'
              ? `${O.Desc}/${O.Symbol}`
              : `${O.Title}/${O.Symbol}`
          "
          :value="O.Id"
        ></el-option>
      </el-select>
      <el-button
        :disabled="DisabledButton"
        type="primary"
        class="ButtonHosef"
        size="medium"
        @click="AddActionScore(Selected, AddTo)"
        >הוסף</el-button
      >
    </div>
    <el-table
      :data="data"
      border
      ref="Table"
      class="Tabloz"
      height="510"
      empty-text="אין נתונים זה הזמן למלאות"
    >
      <el-table-column :label="NameOfScore" align="center">
        <el-table-column label="מחיקה" width="130" align="center">
          <template v-slot:default="scope">
            <el-popover
              placement="top"
              width="160"
              v-model="visible[`Modeloz-${scope.$index}`]"
            >
              <p style="text-align: center; font-size: 17px">מה תרצה למחוק?</p>
              <div class="ParentsButonsDelte">
                <el-button
                  v-show="scope.row.ExercisesT"
                  type="success"
                  size="mini"
                  class="ButtonPuper Zuz"
                  @click="
                    DeleteActionScore(
                      'ExercisesId',
                      scope.row,
                      'ExercisesT',
                      'Exercises'
                    )
                  "
                  >תרגיל</el-button
                >
                <el-button
                  v-show="scope.row.DescFeacher"
                  type="success"
                  size="mini"
                  class="ButtonPuper"
                  @click="
                    DeleteActionScore(
                      'FeaturesId',
                      scope.row,
                      'DescFeacher',
                      'DescFeacher'
                    )
                  "
                  >פיצ'ר</el-button
                >
                <el-button
                  v-show="scope.row.DescMes"
                  type="success"
                  size="mini"
                  class="ButtonPuper"
                  @click="
                    DeleteActionScore(
                      'MessagesId',
                      scope.row,
                      'DescMes',
                      'DescMes'
                    )
                  "
                  >הודעה</el-button
                >
              </div>
              <el-button type="danger" size="mini" slot="reference">
                <i class="fa-solid fa-trash-check"></i>
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="הודעות"
          prop="DescMes"
          align="center"
        ></el-table-column>
        <el-table-column
          label="פיצ'רים"
          prop="DescFeacher"
          align="center"
        ></el-table-column>
        <el-table-column
          label="תרגילים"
          prop="ExercisesT"
          align="center"
        ></el-table-column
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenTableInyonim",
  props: ["Params", "NameOfScore", "que"],
  data() {
    return {
      visible: {},
      Selected: "",
      AddTo: "Exercises",
      data: [],
      arrIds: this.Params,
      OpL: [
        { name: "פיצ'רים", val: "DescFeacher" },
        { name: "הודעות", val: "DescMes" },
        { name: "תרגילים", val: "Exercises" },
      ],
      ObjAlldata: {},
      showTableEL: true,
      DisabledButton: false,
    };
  },
  watch: {
    visible(val) {
      //   console.log(val);
    },
    AddTo(val) {
      setTimeout(() => {
        if (this.ObjAlldata[val][0]) {
          this.Selected = this.ObjAlldata[val][0].Id;
        } else {
          this.Selected = "";
        }
        if (Boolean(this.ObjAlldata[val].length)) {
          this.DisabledButton = false;
        } else {
          this.DisabledButton = true;
        }
      }, 220);
    },
  },
  async mounted() {
    try {
      // console.log([...this.arrIds]);
      let arrIdso;
      if (Boolean([...this.arrIds].length)) {
        arrIdso = [...this.arrIds].join(",");
      } else {
        arrIdso = null;
      }
      console.log({
        Params: arrIdso,
        NameOfScore: this.NameOfScore,
        q: this.que,
      });

      let { data } = await this.$ax.get(
        URL + "GetScoreAction/" + arrIdso + "/" + this.que
      );
      if (Boolean(data)) {
        this.data = data;
        let res = await this.$ax.post(URL + "GetDataForTableScoreAction", data);
        this.ObjAlldata = res.data;
        console.log({ ...this.ObjAlldata });
        await this.$nextTick();
        this.SortTable();
        //   console.log(this.ObjAlldata);
        if (this.ObjAlldata[this.AddTo][0]) {
          this.Selected = this.ObjAlldata[this.AddTo][0].Id;
        } else {
          this.Selected = "";
        }
        if (Boolean(this.ObjAlldata[this.AddTo].length)) {
          this.DisabledButton = false;
        } else {
          this.DisabledButton = true;
        }
      } else {
        this.$message.error("משהו השתבש");
      }
    } catch (error) {
      console.log(error);
      this.$message.error("משהו השתבש");
    }
  },

  methods: {
    SortTable() {
      let table = this.$refs.Table.$el;

      let tds = table.children[2].children[0].children[1].children;
      //   console.log(tds);
      Array.from(tds).forEach((element) => {
        Array.from(element.children).forEach((el, i) => {
          el.style.textAlign = "center";
          el.style.background = "rgba(255, 137, 137, 0.667)";
          if (i % 2 === 0) {
          }
        });
      });
    },
    async AddActionScore(val, Colomn) {
      let arrIDS;
      if (Boolean([...this.arrIds].length)) {
        arrIDS = this.arrIds.join(",");
      } else {
        arrIDS = null;
      }
      let find = this.ObjAlldata[this.AddTo].find((e) => e.Id === val);
      let IND = this.ObjAlldata[this.AddTo].findIndex((e) => e.Id === val);
      let key = "";
      if (this.AddTo === "Exercises") {
        key = "ExercisesT";
      } else if (this.AddTo === "DescMes") {
        key = "DescMes";
      } else if (this.AddTo === "DescFeacher") {
        key = "DescFeacher";
      }
      if (this.AddTo === "Exercises") {
        find[key] = find.Title;
        delete find.Title;
      } else {
        find[key] = find.Desc;
        delete find.Desc;
      }
      //
      if (this.AddTo === "Exercises") {
        find.ExercisesT ? find.ExercisesT : null;
      } else if (this.AddTo === "DescMes") {
        find.DescMes ? find.DescMes : null;
      } else if (this.AddTo === "DescFeacher") {
        find.DescFeacher ? find.DescFeacher : null;
      }
      let { data } = await this.$ax.post(URL + "AddActionScore", {
        val,
        Colomn,
        arrIDS,
        Q: this.que,
      });
      this.$Bool(data, "נוסף בהצלחה", "משהו השתבש", false);
      let LastData = this.data[this.data.length - 1];
      if (this.data.length === 0) {
        LastData = { ExercisesT: null, DescMes: null, DescFeacher: null };
      }
      let lastIndex = this.data.length - 1;
      if (data) {
        if (LastData[key] === undefined) {
          LastData[key] = "";
        }
        if (!LastData[key]) {
          LastData[key] = find[key];
          this.data.splice(lastIndex, 1);
          setTimeout(() => {
            this.data.push(LastData);
          }, 0);
          console.log("LastData", LastData);
        } else {
          this.data.push(find);
          console.log("find", find);
        }
        this.ObjAlldata[this.AddTo].splice(IND, 1);
      }
      setTimeout(() => {
        this.SortTable();
        if (Boolean(this.ObjAlldata[this.AddTo].length)) {
          this.DisabledButton = false;
        } else {
          this.DisabledButton = true;
        }
        if (this.ObjAlldata[this.AddTo][0]) {
          this.Selected = this.ObjAlldata[this.AddTo][0].Id;
        } else {
          this.Selected = "";
        }
      }, 200);
      setTimeout(() => {
        this.IfData();
      }, 1000);
    },
    async DeleteActionScore(Colomn, row, property) {
      // let findo = this.data.find((e) => e[property] === row[property]);

      const Desco = row[property];
      const arrIdso = this.arrIds.join(",");
      const URI = `${URL}DeleteScoreAction?arrIdso=${arrIdso}&Q=${this.que}&Desco=${Desco}&Colomn=${Colomn}`;
      let { data } = await this.$ax.delete(URI);
      this.$Bool(data, "נמחק בהצלחה", "משהו השתבש", false);
      if (data) {
        let i = this.data.findIndex((e) => e[property] === Desco);
        this.data[i][property] = null;
        let res = await this.$ax.post(
          URL + "GetDataForTableScoreAction",
          this.data
        );
        this.ObjAlldata = res.data;
      }
      setTimeout(() => {
        this.IfData();
      }, 1000);
    },
    IfData() {
      this.data = this.data.filter((obj) => {
        return !Object.values(obj).every((value) => value === null);
      });
    },
  },
};
</script>

<style scoped>
.Tabloz {
  width: 80%;
  position: relative;
  margin: 20px;
  left: 90px;
  top: 20px;
}
body {
  background: rgba(255, 137, 137, 0.667);
}
.opTable {
  width: 80%;
  position: relative;
  left: 110px;
  top: 20px;
  background: rgba(255, 58, 58, 0.744);
  padding: 15px;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 120px;
  border-radius: 20px;
}
.Elselected {
  position: relative;
  right: 100px;
}
.ButtonHosef {
  position: relative;
  right: 200px;
}
.ButtonPuper {
  margin: 5px;
  width: 110px;
}
.Zuz {
  position: relative;
  left: 5px;
}
.ParentsButonsDelte {
  display: flex;
  flex-direction: column;
}
</style>
