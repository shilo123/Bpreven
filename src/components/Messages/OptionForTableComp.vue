<template>
  <div class="container">
    <el-button type="success" class="Add" @click="$emit('AddMessage')"
      ><i class="fa-solid fa-message-plus"></i> הוסף הודעה</el-button
    >
    <div class="serch">
      <el-input
        v-model="Serch"
        :placeholder="placeHolder"
        ref="inputSerch"
        dir="rtl"
      >
        <i class="fa-solid fa-magnifying-glass fa-xl iconzo" slot="prefix"> </i>
      </el-input>
      <el-select placeholder="חפש לפי" v-model="filterOf">
        <el-option v-for="(s, i) in OptOfilter" :key="i" :value="s"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenOptionForTableComp",

  data() {
    return {
      OptOfilter: ["הכל", "שם", "סימן", "סטטוס"],
      filterOf: "הכל",
      Serch: "",
      TimeoutSerch: null,
    };
  },
  computed: {
    placeHolder() {
      return `..חפש לפי ${this.filterOf}`;
    },
  },
  watch: {
    Serch(val) {
      this.$emit("LoadingTABLE", true);
      if (this.TimeoutSerch) {
        clearTimeout(this.TimeoutSerch);
      }
      this.TimeoutSerch = setTimeout(() => {
        if (this.filterOf === "סטטוס") {
          if (this.serch === "פעיל") {
            this.serch = true;
          }
          if (this.serch === "לא פעיל") {
            this.serch = false;
          }
        }
        this.SerchQuery(this.Serch);
        this.TimeoutSerch = null;
      }, 500);
    },
  },
  mounted() {
    this.sortInput();
  },

  methods: {
    sortInput() {
      let input = this.$refs.inputSerch.$el.children[0];
      input.style.background = "none";
      input.style.border = "none";
      input.style.borderBottom = "4px solid black";
      input.style.color = "black";
    },
    SerchQuery(val) {
      let ClumnSerch;
      if (this.filterOf === "שם") {
        ClumnSerch = "[Desc]";
      } else if (this.filterOf === "סימן") {
        ClumnSerch = "Symbol";
      } else if (this.filterOf === "סטטוס") {
        ClumnSerch = "StatusId";
      } else if (this.filterOf === "הכל") {
        ClumnSerch = "all";
      }
      this.$ax.post(URL + "serchMes", { val, ClumnSerch }).then((res) => {
        // console.log(res.data);
        this.$emit("NewData", res.data);
        let ifData = Boolean(res.data.length);
        !ifData ? this.$emit("Noserch", val) : "";
        this.$emit("LoadingTABLE", false);
      });
    },
  },
};
</script>

<style scoped>
.container {
  background: linear-gradient(
    rgb(94, 100, 114),
    rgb(108, 108, 108),
    rgb(91, 90, 90),
    rgb(154, 154, 154)
  );
  height: 110px;
  position: relative;
  top: 30px;
}
.serch {
  width: 50%;
  float: right;
  position: relative;
  top: 25px;
  margin-right: 270px;
  display: flex;
  flex-direction: row-reverse;
}
.iconzo {
  position: relative;
  top: 7px;
}
.el-select {
  margin-right: 20px;
}
.Add {
  position: absolute;
  right: 0;
  top: 0;
  margin: 10px;
  box-shadow: 0 0 1px 1px rgb(138, 120, 120);
  transition: all 0.3s ease-in-out;
}
.Add:hover {
  font-size: 25px;
  padding: 20px;
  box-shadow: 0 0 0 0;
}
</style>
