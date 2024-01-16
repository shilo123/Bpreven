<template>
  <div>
    <div
      :class="{
        optionsONtheTable: !wachtStore,
        optionsONtheTableBig: wachtStore,
      }"
    >
      <el-button
        type="success"
        class="ButtonHosef"
        @click="$emit('newComponent', 'NewQustion')"
        ><i class="fa-solid fa-square-plus"></i> הוסף שאלה</el-button
      >
      <el-input
        v-show="!showRadio"
        v-model="serch"
        dir="auto"
        placeholder="חפש"
        :class="{ inputSerch: !wachtStore, inputSerchBig: wachtStore }"
        ref="inputSerch"
        ><i slot="suffix" class="el-icon-search" ref="iconOfInp"></i
      ></el-input>
      <el-radio-group v-model="serch" v-show="showRadio" class="radio">
        <el-radio-button label="כן" ref="itemRadioA"></el-radio-button>
        <el-radio-button label="לא" ref="itemRadioB"></el-radio-button>
      </el-radio-group>
      <el-select
        v-model="FilterOf"
        placeholder="סנן לפי"
        :class="{ Tselect: !wachtStore, TselectBig: wachtStore }"
      >
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
  </div>
</template>
<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenOptionsONtheTableComp",

  data() {
    return {
      serch: "",
      TimeoutSerch: null,
      FilterChange: "הכל",
      FilterOf: "הכל",

      theOption: [],
      Alldata: {
        Allquestions: [],
        questionsOnly: [],
        DataType: [],
        NameQuen: [],
      },
      data: [],
      data2: [],
      showRadio: false,
    };
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },
  watch: {
    FilterOf(val) {
      if (val === "אם אחרון") {
        this.showRadio = true;
      } else {
        this.showRadio = false;
        this.serch = "";
      }
    },
    serch(val) {
      this.$emit("LoadingTABLE", true);
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
      this.$emit("Changosy", val);
      if (val !== "הכל") {
        this.$ax.post(URL + "FIndQustinnare", { val }).then((res) => {
          // console.log(res.data);
          //   this.data = res.data;
          this.$store.commit("Update_DATA", res.data);
          if (this.data.length === 0) {
          } else {
            this.$emit("YeshLanu");
          }
        });
      } else {
        this.data = this.data2;
        window.location.reload();
      }
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("fetchData");
      this.Alldata.Allquestions = this.$store.state.AllData.Allquestions;
      this.Alldata.questionsOnly = this.$store.state.AllData.questionsOnly;
      this.Alldata.DataType = this.$store.state.AllData.DataType;
      this.Alldata.NameQuen = this.$store.state.AllData.NameQuen;
      //   console.log(this.$store.state.AllData);
      this.data = this.$store.state.data;
      this.data2 = this.$store.state.data;
      await this.$nextTick();
      this.sortInput();
      this.sortRadio();
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
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
      if (!this.wachtStore) {
        icon.style.left = "-310px";
      } else {
        icon.style.left = "-470px";
      }
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
    SerchQuery(val) {
      //   this.data = this.data2;
      this.$store.commit("Update_DATA", this.$store.state.data2);
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
          //   this.data = res.data;
          this.$store.commit("Update_DATA", res.data);
          this.$emit("YeshLanu", res.data);
          this.$emit("LoadingTABLE", false);
          this.$emit("Sortable");
          this.$emit("upSetch", val);
        })
        .catch((e) => {
          this.$message.error("משהו השתבשש");
          this.$emit("LoadingTABLE", false);
        });

      if (val === "") {
        this.$store.commit("Update_DATA", this.$store.state.data2);
        this.sortInput();
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
  width: 78%;
  top: 40px;
  height: 4em;
  left: 80px;
  transition: all 0.3s;
}
.optionsONtheTableBig {
  background: linear-gradient(rgb(158, 170, 170), rgb(59, 62, 70));
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  width: 90%;
  top: 40px;
  height: 4em;
  left: 80px;
  transition: all 0.3s;
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
  transition: all 0.3s;
}
.inputSerchBig {
  position: relative;
  right: 170px;
  bottom: -8px;
  width: 500px;
  transition: all 0.3s;
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
  transition: all 0.3s;
}
.TselectBig {
  position: relative;
  right: 240px;
  top: 8px;
  transition: all 0.3s;
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
</style>
