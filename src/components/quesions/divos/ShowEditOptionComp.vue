<template>
  <div class="EditOption">
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>

    <div>
      <el-input
        dir="auto"
        placeholder="עדכן אופציה"
        v-model="ModelUpdateOption.Desc"
      ></el-input>
      <el-button
        type="primary"
        size="medium"
        @click="UpdateForOption"
        :loading="LoadingButton"
        >עדכן</el-button
      >
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
export default {
  props: ["ParamsEditO"],
  data() {
    return {
      LoadingButton: false,
      ModelUpdateOption: this.ParamsEditO,
    };
  },
  computed: {
    // data: [],
    // AllData: {},
    // theOption: [],
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
  },

  mounted() {},

  methods: {
    async UpdateForOption() {
      let id = this.ModelUpdateOption.Id;
      let text = this.ModelUpdateOption.Desc;
      const params = { id, text };
      this.LoadingButton = true;
      try {
        let { data } = await this.$ax.put(URL + "UpdateOP", params);
        if (data) {
          this.$message.success("עודכן בהצלחה");
          this.$store.commit("SgorDivos", true);
        } else {
          this.$message.error("משהו השתבש");
        }
      } catch (error) {
        this.$message.error("משהו השתבש");
      } finally {
        this.LoadingButton = false;
      }
    },
  },
};
</script>
<style scoped>
.EditOption {
  background: rgb(0, 70, 132);
  height: 150px;
  width: 400px;
  border-radius: 20px;
  left: 30%;
  padding: 20px;
}
.EditOption .el-input {
  width: 300px;
  position: relative;
  left: 30px;
}
.EditOption .el-button {
  position: absolute;
  bottom: 30px;
  left: 140px;
  border: 2px solid black;
  width: 130px;
}
.EditOption .el-button:hover {
  border: 0 solid rgb(45, 43, 43);
}
</style>
