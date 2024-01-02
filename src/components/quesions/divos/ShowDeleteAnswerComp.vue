<template>
  <div class="DeleteAnswer">
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>

    <div class="text">הפריט ימחק לעולם ולא יחזור גם אם תרצה מאוד</div>
    <div class="butonascy">
      <el-button
        type="danger"
        size="mini"
        @click="$store.commit('SgorDivos', true)"
        >סגור</el-button
      >
      <el-button
        type="success"
        size="mini"
        @click="DelOfAnswer(idOfDelAnswer)"
        :loading="LoadingButton"
        >מחק</el-button
      >
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";

export default {
  props: ["ParamsOfDelOP"],
  data() {
    return {
      idOfDelAnswer: this.ParamsOfDelOP,
      LoadingButton: false,
      theOption: [],
      AllData: [],
      data: [],
    };
  },
  computed: {
    // data: [],
    // AllData: {},
    // theOption: [],
    wachtData() {
      return this.$store.state.data;
    },
  },
  watch: {
    wachtData(val) {
      this.data = val;
    },
  },

  mounted() {
    this.theOption = this.$store.state.theOption;
    this.AllData = this.$store.state.AllData;
    this.data = this.$store.state.data;
  },

  methods: {
    async DelOfAnswer(id) {
      // console.log(id);
      this.LoadingButton = true;
      try {
        await this.$ax.delete(URL + "DeleteAnswer/" + id);
        this.$message.success("נמחק בהצלחה");

        if (this.theOption) {
          let i = this.theOption.findIndex((e) => e.Id === id);
          this.theOption.splice(i, 1);
        }
        this.$store.commit("UptheOption", this.theOption);
        this.$store.commit("SgorDivos", true);
      } catch (error) {
        this.$message.error("משהו השתבש");
        console.log(error);
      } finally {
        this.LoadingButton = false;
      }
    },
  },
};
</script>
<style scoped>
.DeleteAnswer {
  width: 300px;
  height: 200px;
  background: rgba(226, 97, 97, 0.699);
  left: 35%;
  top: 35%;
  padding: 10px;
}
.DeleteAnswer .text {
  position: relative;
  top: 50px;
  left: 10px;
}
.butonascy {
  position: absolute;
  bottom: 50px;
  width: 100%;
  left: 0;
}
.butonascy .el-button--danger {
  position: absolute;
  left: 50px;
}
.butonascy .el-button--success {
  position: absolute;
  right: 50px;
}
</style>
