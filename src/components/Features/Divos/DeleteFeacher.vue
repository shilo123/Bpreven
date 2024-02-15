<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="content">אם תמחק הפיצ'ר לא יחזור גם אם תרצה מאוד</div>
    <div class="buttons">
      <el-button
        type="danger"
        size="small"
        class="dangero"
        @click="Delete(row.Id)"
        :loading="LoadingButton"
        ref="BU"
        >מחק</el-button
      >
      <el-button
        type="primary"
        size="small"
        class="primaryo"
        @click="$emit('Close')"
        >סגור</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  props: ["row"],
  name: "BprevenDeleteFeacher",

  data() {
    return {
      LoadingButton: false,
    };
  },
  watch: {
    LoadingButton(val) {
      if (val) {
        let but = this.$refs.BU.$el;
        but.style.position = "absolute";
      }
    },
  },
  mounted() {},

  methods: {
    async Delete(id) {
      this.LoadingButton = true;
      let { data } = await this.$ax.delete(URL + "DeleteFeacher/" + id);
      this.$Bool(data, "הוסר בהצלחה", "משהו השתבש", false);
      this.LoadingButton = false;
      this.$emit("Updata");
    },
  },
};
</script>

<style scoped>
.content {
  margin: 60px;
  font-size: 20px;
}
</style>
