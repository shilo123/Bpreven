<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"> </i>
    אם תמחק את הפרוטוקול הוא ימחק לצמיתות
    <el-button
      type="danger"
      size="small"
      class="dangero"
      @click="Delete(id)"
      :loading="LoadingButton"
      :class="{ LoadingButton: LoadingButton }"
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
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenDeleteUserFlow",
  props: ["row"],
  data() {
    return {
      id: this.row.Id,
      LoadingButton: false,
    };
  },

  mounted() {},

  methods: {
    async Delete(id) {
      this.LoadingButton = true;
      let { data } = await this.$ax.delete(URL + "DeleteProtokol/" + id);
      this.LoadingButton = false;
      this.$Bool(data, "נמחק בהצלחה", "משהו השתבשש", true);
    },
  },
};
</script>

<style scoped lang="scss">
* {
  .dangero,
  .primaryo {
    margin-bottom: 15px;
  }
  .LoadingButton {
    position: absolute;
  }
}
</style>
