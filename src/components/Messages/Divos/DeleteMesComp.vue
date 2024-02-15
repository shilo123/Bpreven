<template>
  <div>
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div class="warn">אם תמחק לא תוכל להחזיר גם אם ממש תרצה</div>
    <div class="buttons">
      <el-button
        type="danger"
        size="small"
        class="dangero"
        @click="Delete(row.Id)"
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
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  props: ["row"],
  name: "BprevenDeleteMesComp",

  data() {
    return {
      LoadingButton: false,
    };
  },

  mounted() {},

  methods: {
    async Delete(id) {
      this.LoadingButton = true;
      let { data } = await this.$ax.delete(URL + "DeleteMes/" + id);
      this.LoadingButton = false;
      if (data) {
        this.$message.success("נמחק בהצלחה");
        // window.location.reload();
        this.$emit("Updata");
      } else {
        this.$message.error("משהו השתבש");
      }
    },
  },
};
</script>

<style scoped>
.warn {
  margin: 14px;
  margin-top: 60px;
  font-size: 20px;
}
.buttons {
  position: relative;
  top: 140px;
}
</style>
