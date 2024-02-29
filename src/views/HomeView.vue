<template>
  <div class="all">
    <h1>היי</h1>
    <div class="content">שלום שלום שלום</div>
    <!-- <el-button type="primary" @click="Func">Click</el-button> -->
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
      let x = "sd";
      setTimeout(() => {
        console.log(2);
      }, 2);
      setTimeout(() => {
        console.log(1);
      }, 1);
      setTimeout(() => {
        console.log(x);
      }, 0);
      setTimeout(() => {
        console.log(x);
      }, 0);
      setTimeout(() => {
        console.log(x);
      }, 0);
      setTimeout(() => {
        console.log(x);
      }, 0);
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
