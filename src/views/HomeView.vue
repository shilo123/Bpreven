<template>
  <div class="all">
    <h1>היי</h1>
    <div class="content">שלום שלום שלום</div>
    <i class="fa-solid fa-paper-plane-top icon"></i>
    <Select @changez="BodekTo($event)" :pleaceHolder="'בחר'" :Ops="theOption" />
    <el-popover placement="top" width="210" v-model="visible">
      <p style="text-align: right">האם אתה בטוח שתרצה לעשות את זה?</p>
      <div style="text-align: right">
        <el-button size="mini" type="danger" @click="visible = false"
          >ביטול</el-button
        >
        <el-button size="mini" type="success" @click="visible = false"
          >zv</el-button
        >
        <el-button size="mini" type="success" @click="visible = false"
          >פעולה נוספת</el-button
        >
        <el-button size="mini" type="success" @click="visible = false"
          >פעולה 2</el-button
        >
      </div>
      <el-button slot="reference">לחץ עליי</el-button>
    </el-popover>
  </div>
</template>
<script>
import Select from "@/components/ComponenetsCloly/SelectozComp.vue";
export default {
  name: "BprevenHomeView",
  components: { Select },

  data() {
    return {
      visible: false,
      theOption: ["היי", "שלום"],
    };
  },
  watch: {},
  mounted() {
    // console.log(this.$random(1, 20));
  },

  methods: {},
};
</script>
<style scoped>
.el-button {
  margin: 5px;
}
.all {
  position: absolute;
  right: 0;
  top: 80px;
  margin: 30px;
  margin-right: 270px;
}
.content {
  position: relative;
  right: 50px;
}
.icon {
  font-size: 50px;
  position: absolute;
  left: -520%;
  top: 55%;
}
</style>
