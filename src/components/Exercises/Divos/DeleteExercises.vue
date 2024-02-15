<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="content">
      אם תמחוק את "{{ params.Title }}" הוא לא יחזור לעולם גם אם תרצה ממש
    </div>
    <div class="boutons">
      <el-button type="danger" @click="$emit('Close')" size="medium"
        >סגור</el-button
      >

      <el-button type="success" @click="DeleteExar(id)" size="medium"
        >מחק</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  props: ["params"],
  name: "BprevenDeleteExercises",

  data() {
    return {
      id: this.params.Id,
    };
  },

  mounted() {
    // console.log(this.params);
  },

  methods: {
    async DeleteExar(id) {
      // console.log(id);
      let nameFile = "";
      if (this.params.Link) {
        nameFile =
          this.params.Link.split("/")[this.params.Link.split("/").length - 1];
      } else {
        nameFile = "none";
      }
      const URI = `${URL}delEx/${id}/${nameFile}/${this.params.ExercisesCategoriesId}`;
      // console.log(URI);
      let { data } = await this.$ax.delete(URI);
      this.$Bool(data, "נמחק בהצלחה", "משהו השתבש", false);
      this.$emit("Updata");
    },
  },
};
</script>

<style scoped>
.content {
  font-size: 23px;
  margin: 50px;
  text-align: right;
}
.el-button--danger {
  background: red;
  margin-right: 30px;
}
.boutons {
  position: relative;
  left: 250px;
  top: 64px;
}
</style>
