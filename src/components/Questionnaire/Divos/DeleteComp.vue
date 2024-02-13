<template>
  <div>
    <i class="el-icon-close" @click="$emit('sgor')"></i>
    <div>
      אם תמחק את השאלון הוא ימחק לצמיתות

      <el-button
        type="danger"
        size="small"
        class="dangero"
        @click="deletequen(paramsOfComp)"
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
    return { loadingButton: false };
  },

  mounted() {},

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

<style scoped></style>
