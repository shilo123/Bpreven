<template>
  <div class="container">
    <el-button type="primary" class="AddCategory">הוסף קטגוריה</el-button>
    <el-button
      type="primary"
      class="AddEx"
      @click="$emit('newComponent', 'AddEx')"
      >הוסף תרגיל</el-button
    >
    <div class="inputzim">
      <el-select v-model="filterOf" placeholder="" size="medium">
        <el-option v-for="(O, i) in OpFilter" :key="i" :value="O"></el-option>
      </el-select>
      <input type="text" placeholder="חפש" v-model="serch" />
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenOptionForTableComp",

  data() {
    return {
      OpFilter: ["תיאור", "קטגוריה", "סטטוס", "סימן", "כותרת", "הכל"],
      filterOf: "הכל",
      serch: "",
      TimeoutSerch: null,
    };
  },
  watch: {
    serch(val) {
      this.$emit("LoadingTABLE", true);
      if (this.TimeoutSerch) {
        clearTimeout(this.TimeoutSerch);
      }
      this.TimeoutSerch = setTimeout(() => {
        // console.log(this.filterOf);
        this.SerchQuery(this.serch);
        this.TimeoutSerch = null;
      }, 500);
    },
  },
  mounted() {},

  methods: {
    SerchQuery(val) {
      let ClumnSerch;
      if (this.filterOf === "קטגוריה") {
        ClumnSerch = "ExercisesCategories.[Name]";
      } else if (this.filterOf === "תיאור") {
        ClumnSerch = "Exercises.About";
      } else if (this.filterOf === "סטטוס") {
        ClumnSerch = "Exercises.StatusId";
      } else if (this.filterOf === "סימן") {
        ClumnSerch = "Exercises.Symbol";
      } else if (this.filterOf === "כותרת") {
        ClumnSerch = "Exercises.Title";
      } else if (this.filterOf === "הכל") {
        ClumnSerch = "all";
      }
      this.$ax.post(URL + "serchExercises", { val, ClumnSerch }).then((res) => {
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
    rgb(255, 255, 255),
    rgb(233, 218, 218),
    rgb(209, 183, 183),
    rgb(164, 139, 139)
  );
  height: 80px;
  position: relative;
  top: 20px;
  padding: 20px;
}
input {
  background: none;
  border: none;
  width: 210px;
  border-bottom: 3px solid rgb(80, 80, 80);
}
input:focus {
  outline: none;
  animation: WidthInput 0.3 ease-in-out;
}
@keyframes WidthInput {
  from {
    width: 210px;
  }
  to {
    width: 300px;
  }
}
.inputzim {
  position: absolute;
  left: 55%;
  bottom: 20px;
}
.el-select {
  margin-right: 20px;
}
.AddCategory:hover {
  padding: 15px;
  font-size: 20px;
  position: relative;
  bottom: 8px;
}
.AddEx {
  margin-left: 50px;
  position: relative;
  left: 20px;
}
.AddEx:hover {
  padding: 15px;
  font-size: 20px;
  position: relative;
  bottom: 8px;
}
</style>
