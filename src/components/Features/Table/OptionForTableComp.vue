<template>
  <div class="container">
    <el-button type="success" class="Add" @click="$emit('AddFeacher')"
      ><i class="fa-regular fa-plus-large"></i> הוסף פיצ'ר</el-button
    >
    <div class="serch">
      <el-input
        v-model="Serch"
        :placeholder="placeHolder"
        ref="inputSerch"
        dir="rtl"
      >
        <i
          class="fa-solid fa-magnifying-glass fa-xl iconzo"
          slot="prefix"
          style="color: #000"
        >
        </i>
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
      Serch: "",
      filterOf: "הכל",
      OptOfilter: ["הכל", "סימן", "שם", "מספר"],
      TimeoutSerch: null,
    };
  },
  watch: {
    Serch() {
      this.$emit("LoadingTABLE", true);
      if (this.TimeoutSerch) {
        clearTimeout(this.TimeoutSerch);
      }
      this.TimeoutSerch = setTimeout(() => {
        this.SerchQuery(this.Serch);
        this.TimeoutSerch = null;
      }, 500);
    },
  },
  computed: {
    placeHolder() {
      return `${this.filterOf} סנן לפי .. `;
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
      input.classList.add("addPleceHolder");
      //   console.log(input);
      var style = document.createElement("style");
      document.head.appendChild(style);

      style.sheet.insertRule(
        `.${"addPleceHolder"}::placeholder {color: black; }`,
        0
      );
    },
    SerchQuery(val) {
      let ClumnSerch;
      if (this.filterOf === "שם") {
        ClumnSerch = "[Desc]";
      } else if (this.filterOf === "סימן") {
        ClumnSerch = "Symbol";
      } else if (this.filterOf === "מספר") {
        ClumnSerch = "Number";
      } else if (this.filterOf === "הכל") {
        ClumnSerch = "all";
      }
      this.$ax.post(URL + "serchFeach", { val, ClumnSerch }).then((res) => {
        // console.log(res.data);
        this.$emit("NewData", res.data);
        !Boolean(res.data.length) ? this.$emit("Noserch", val) : "";
        this.$emit("LoadingTABLE", false);
      });
    },
  },
};
</script>

<style scoped>
.container {
  background: linear-gradient(
    rgb(171, 188, 228),
    rgb(179, 213, 239),
    rgb(162, 155, 224),
    rgb(201, 153, 229)
  );
  height: 70px;
  position: relative;
  top: 30px;
}
.serch {
  width: 50%;
  float: right;
  position: relative;
  top: 15px;
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
  font-size: 20px;
  padding: 10px;
  box-shadow: 0 0 0 0;
}
.el-input__inner {
  background: #000;
}
</style>
