<template>
  <div class="all">
    <h1>היי</h1>
    <div class="content">שלום שלום שלום</div>
    <!-- <el-button type="primary" @click="Func">Click</el-button>
    {{ counter }} -->
  </div>
</template>
<script>
export default {
  name: "BprevenHomeView",

  data() {
    return {
      visible: false,
      theOption: ["היי", "שלום"],
      over: false,
      counter: 0,
    };
  },
  watch: {
    over(val) {
      console.log(val);
    },
    visible(val) {
      console.log(this.$refs.elButton.$slots);
    },
  },
  mounted() {
    // console.log({ ...this.$store.state.Questionaire });
  },
  methods: {
    async Func() {
      await this.delay(1000);
      console.log(1);
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
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
