<template>
  <div class="AddNewAnswer">
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>

    <input
      type="text"
      dir="rtl"
      class="w3-input"
      v-model="ModelInputDivAnswer"
      @keydown.enter="ADDnewtAnswer(IdniFtah, ModelInputDivAnswer)"
    />
    <el-button
      type="success"
      class="ButAdANs"
      @click="ADDnewtAnswer(IdniFtah, ModelInputDivAnswer)"
      :loading="LoadingButton"
      ref="butnoc"
      >הוסף אופציה</el-button
    >
    <!-- // $store.commit('SgorDivos', true); -->
  </div>
</template>
<script>
import { URL } from "@/URL/url";
export default {
  props: ["IdniFtah"],
  data() {
    return {
      LoadingButton: false,
      ModelInputDivAnswer: "",
      data: [],
      AllData: {},
      theOption: [],
    };
  },
  computed: {
    wachtData() {
      return this.$store.state.data;
    },
  },
  watch: {
    wachtData(val) {
      this.data = val;
    },
    LoadingButton(val) {
      try {
        let bu = this.$refs.butnoc.$el;
        if (val) {
          bu.style.position = "absulote";
          bu.style.top = "60%";
        }
      } catch (error) {}
    },
  },
  mounted() {
    this.theOption = this.$store.state.theOption;
    this.AllData = this.$store.state.AllData;
    this.data = this.$store.state.data;
  },

  methods: {
    async ADDnewtAnswer(id, text) {
      // console.log(id);
      this.LoadingButton = true;
      if (text) {
        try {
          let { data } = await this.$ax.post(URL + "AddAnswer", { text, id });
          if (data) {
            // this.theOption.push({ Desc: text });
            // this.$store.commit("UptheOption", this.theOption);
            await this.$store.dispatch("UpdateOption", id);
            // this.$store.commit("SgorDivos", true);
            this.ModelInputDivAnswer = "";
            this.$emit("RafreshTable", id);
            this.$message.success("התשובה נוספה");
          } else {
            this.$message.error("משהו השתבש");
          }
          // this.RafreseTable();
        } catch (error) {
          this.$message.error("משהו השתבש");
        } finally {
          this.LoadingButton = false;
        }
      }
    },
  },
};
</script>
<style scoped>
.AddNewAnswer {
  background: white;
  height: 300px;
  width: 400px;
  border-radius: 20px;
}
.AddNewAnswer .w3-input {
  background: rgb(183, 174, 174);
  border-radius: 10px;
  position: relative;
  left: 16%;
  top: 80px;
  width: 70%;
}
.ButAdANs {
  position: absolute;
  left: 28%;
  bottom: 30%;
  width: 180px;
  box-shadow: 0 0 7px 2px #34495e;
}
.ButAdANs:hover {
  box-shadow: 0 0 1px 1px;
  font-size: 20px;
}
</style>
