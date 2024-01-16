<template>
  <div class="all">
    <h1>היי</h1>
    <div class="content">שלום שלום שלום</div>
    <i class="fa-solid fa-paper-plane-top icon"></i>
    <!-- <Select @changez="BodekTo($event)" :pleaceHolder="'בחר'" :Ops="theOption" /> -->
  </div>
</template>
<script>
// import Select from "@/components/ComponenetsCloly/SelectozComp.vue";
export default {
  name: "BprevenHomeView",
  // components: { Select },

  data() {
    return {
      theOption: ["היי", "שלום"],
    };
  },
  watch: {},
  mounted() {},

  methods: {
    BodekTo(e) {
      console.log(e);
    },
  },
};
</script>
<style scoped>
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
