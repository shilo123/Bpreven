<template>
  <div class="all">
    <h1>היי</h1>
    <div class="content">שלום שלום שלום</div>
    <!-- <i class="fa-solid fa-paper-plane-top icon"></i> -->
    <!-- <el-button ref="elButton" slot="reference" @click="Func"
      >Hover to activate</el-button
    > -->
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

  methods: {
    Asyncvisible() {
      console.log("sdf");
      setTimeout(() => {
        this.visible = false;
      }, 500);
    },
    Func() {
      const x = [""];
      console.log(Boolean(x.length));
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
