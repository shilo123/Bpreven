<template>
  <div class="w3-panel w3-pale-red w3-leftbar w3-border-red warning">
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div v-if="!ifOp">
      אם תמחק את השאלה היא תימחק לצמיתות
      <el-button
        type="danger"
        size="small"
        ref="Bu"
        class="dangero"
        @click="deletequen(idOfDel)"
        :loading="LoadingButton"
        >מחק</el-button
      >
      <el-button
        type="primary"
        size="small"
        class="primaryo"
        @click="$store.commit('SgorDivos', true)"
        >סגור</el-button
      >
    </div>
    <div v-else>
      <p class="TextOfV-Else">
        השאלה הזו היא חלק מציון
        <br />
        <i class="fa-solid fa-circle-exclamation"></i>
      </p>
      <!-- <el-button
        type="danger"
        size="small"
        ref="Bu"
        class="dangero"
        @click="deletequen(idOfDel)"
        :loading="LoadingButton"
        >מחק</el-button
      > -->
      <el-button
        type="primary"
        size="small"
        class="primaryo"
        @click="$store.commit('SgorDivos', true)"
        >סגור</el-button
      >
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";

export default {
  props: ["ParamsDelQ"],
  data() {
    return {
      idOfDel: this.ParamsDelQ,
      LoadingButton: false,
    };
  },

  mounted() {
    // console.log("this.$store.state.rowDelete", this.$store.state.rowDelete);
  },
  computed: {
    ifOp() {
      return this.$store.state.rowDelete.IfOp;
    },
    wachtData() {
      return this.$store.state.data;
    },
    data() {
      return this.$store.state.data;
    },
    AllData() {
      return this.$store.state.AllData;
    },
    theOption() {
      return this.$store.state.theOption;
    },
  },
  watch: {
    wachtData(val) {
      this.data = val;
    },
    LoadingButton(val) {
      try {
        this.$refs.Bu.$el.style.position = "absolute";
      } catch (error) {
        console.log(error);
      }
    },
  },

  methods: {
    async deletequen(id) {
      // console.log(id);
      this.LoadingButton = true;
      let { data } = await this.$ax.delete(URL + "DeleteQustions/" + id);
      setTimeout(() => {
        this.LoadingButton = false;
        if (data) {
          this.$message.success("השאלה נמחקה בהצלחה");
          this.$emit("UpdateData");
          this.$store.commit("SgorDivos", true);
          // window.location.reload();
        } else {
          this.$message.error("משהו השתבש");
        }
      }, 5000);
    },
  },
};
</script>
<style scoped>
.el-icon-close {
  position: absolute;
  top: 27px;
}
.warning {
  width: 300px;
  height: 210px;
  padding: 70px;
  text-align: center;
  left: 530px;
}
.TextOfV-Else {
  position: relative;
  bottom: 40px;
  right: 60px;
  background: white;
  padding: 10px;
  border-radius: 5px;
  width: 170%;
}
</style>
