<template>
  <div class="w3-panel w3-pale-red w3-leftbar w3-border-red warning">
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>

    אם תמחק את השאלון הוא ימחק לצמיתות
    <el-button
      type="danger"
      size="small"
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

  mounted() {},
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

  methods: {
    async deletequen(id) {
      // console.log(id);
      this.LoadingButton = true;
      let { data } = await this.$ax.delete(URL + "DeleteQustions/" + id);
      this.LoadingButton = false;
      if (data) {
        this.$message.success("השאלה נמחקה בהצלחה");
        window.location.reload();
      } else {
        this.$message.error("משהו השתבש");
      }
    },
  },
};
</script>
<style scoped>
.warning {
  width: 300px;
  height: 210px;
  padding: 70px;
  text-align: center;
  left: 530px;
}
</style>
