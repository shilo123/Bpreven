<template>
  <div class="container">
    <select v-model="filterOf" class="SelectFilterOf" size="medium">
      <option v-for="(o, i) in amudzot" :key="i" :value="o" :label="o"></option>
    </select>
    <select v-model="valueSelect" class="SelectType">
      <option
        v-for="(Op, i) in option"
        :key="i"
        :value="Op.Id"
        :label="Op.Desc"
        :selected="i === 0"
      ></option>
    </select>
    <el-button
      type="primary"
      size="medium"
      class="but"
      @click="$emit('newComponenet', 'Add')"
      >הוסף סוג משתמש</el-button
    >
    <el-button
      size="medium"
      type="primary"
      @click="$emit('newComponenet', 'AddStep')"
      >הוסף פרוטוקול</el-button
    >
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenOpTableComp",
  props: ["opt", "amudzot"],
  data() {
    return {
      option: this.opt,
      valueSelect: "",
      filterOf: "הכל",
    };
  },
  watch: {
    valueSelect(val) {
      this.$emit("ChangeType", val);
    },
    filterOf(val) {
      this.$emit("FilterData", val);
    },
  },
  computed: {},
  async mounted() {
    if (this.option[0]) {
      this.valueSelect = this.option[0].Id;
    }
  },

  methods: {},
};
</script>

<style scoped>
.container {
  background: linear-gradient(
    rgb(206, 194, 173),
    rgb(152, 175, 137),
    rgb(143, 121, 121),
    rgb(166, 140, 141)
  );
  height: 80px;
  position: relative;
  top: 30px;
  padding: 10px;
}
.SelectType {
  width: 200px;
  padding: 8px;
  text-align: right;
}
.but {
  margin-left: 20px;
}
.Inptuz {
  position: absolute;
  width: 210px;
  right: 50px;
}
.SelectFilterOf {
  padding: 5px;
  position: absolute;
  width: 210px;
  right: 30px;
}
option {
  text-align: right;
}
</style>
