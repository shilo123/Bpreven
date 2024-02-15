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
        class="Newquen"
        @click="$emit('AddQuestionaire')"
        >הוסף שאלון חדש</el-button
      >
      <el-input
        v-model="serch"
        :placeholder="pleace"
        :class="{ input: !wachtStore, inputBig: wachtStore }"
        dir="rtl"
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
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenOptable",

  data() {
    return {
      serch: "",
      selcto: "Desc",
      TimeoutSerch: null,
      loadingTABLE: null,
    };
  },

  async mounted() {
    await this.$nextTick();
    this.SortInput();
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
    Allamudot() {
      return this.$store.state.Questionaire.Allamudot.data;
    },
    pleace() {
      return `סנן לפי ${this.computedDat(this.selcto)}...`;
    },
  },
  watch: {
    loadingTABLE(val) {
      this.$emit("LoadnigTABL", val);
    },
    serch() {
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
  methods: {
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
    async SerchQuery(query) {
      const params = { query, clumn: this.selcto };
      // console.log(params);
      //   console.log(query);
      this.loadingTABLE = true;
      this.$store.dispatch("Questionaire/UpdateDataSerch", {
        URL: URL + "SerchQushinnere",
        params,
      });
      //   let { data } = await this.$ax.post(URL + "SerchQushinnere", params);
      // console.log(data);
      //   this.data = data;
      //   this.SortTable();

      this.loadingTABLE = false;
      //   setTimeout(() => {
      //     this.SortTable();
      //   }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
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
    // right: 250px;
    right: 20%;
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
    // right: 340px;
    right: 25%;
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
    // width: 86%;
    width: 86%;
    top: 40px;
    height: 3.9em;
    // left: 117px;
    left: 7.7%;
    transition: all 0.3s;
  }
}
</style>
