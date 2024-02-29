<template>
  <div>
    <i class="el-icon-close" @click="$emit('sgor')"></i>
    <div v-if="!ifQ">
      אם תמחק את השאלון הוא ימחק לצמיתות

      <el-button
        type="danger"
        size="small"
        class="dangero"
        @click="deletequen(paramsOfComp.Id)"
        :loading="loadingButton"
        ref="butnonn"
        >מחק</el-button
      >
      <el-button
        type="primary"
        size="small"
        class="primaryo"
        @click="$emit('sgor')"
        >סגור</el-button
      >
    </div>
    <div v-else>
      <p class="ElseDiv">
        אם תמחק את השאלון ימחקו כל השאלות של השאלון הנוכחי והאופציות של אותן
        השאלות
        <br />
        <i class="fa-solid fa-circle-exclamation"></i>
      </p>
      <el-button
        type="danger"
        size="small"
        class="dangero"
        @click="deletequen(paramsOfComp.Id)"
        :loading="loadingButton"
        ref="butnonn"
        >מחק</el-button
      >
      <el-button
        type="primary"
        size="small"
        class="primaryo"
        @click="$emit('sgor')"
        >סגור</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  props: ["paramsOfComp"],
  name: "BprevenDeleteComp",

  data() {
    return { loadingButton: false, Paramso: this.paramsOfComp };
  },

  mounted() {
    console.log(this.ifQ);
  },
  computed: {
    ifQ() {
      return this.paramsOfComp.ifQ;
    },
  },
  watch: {
    loadingButton(val) {
      if (val) {
        let but = this.$refs.butnonn.$el;
        but.style.position = "absolute";
      }
    },
    Paramso(val) {
      console.log("🚀 ~ Paramso ~ val:", val);
    },
  },
  methods: {
    async deletequen(id) {
      // console.log(id);
      this.loadingButton = true;
      let { data } = await this.$ax.delete(URL + "Delquen/" + id);
      if (data) {
        this.$message.success("נמחק בהצלחה");
        this.loadingButton = false;
        // let data = this.$store.state.Questionaire.data.data;
        // let i = data.findIndex((e) => e.Id === id);
        // console.log([...data]);
        // data.splice(i, 1);
        // console.log([...data]);
        this.$store.commit("Questionaire/SliceData", id);
        this.$emit("sgor");
      } else {
        this.$message.error("משהו השתבש אחי");
        this.loadingButton = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ElseDiv {
  background: rgb(255, 255, 255);
  position: relative;
  bottom: 40px;
  right: 60px;
  padding: 10px 10px;
  width: 275px;
}
</style>
