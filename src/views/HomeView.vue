<template>
  <div class="all">
    <h1>היי</h1>
    <div class="content">שלום שלום שלום</div>
    <i class="fa-solid fa-paper-plane-top icon"></i>
  </div>
</template>
<script>
export default {
  name: "BprevenHomeView",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
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
