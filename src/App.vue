<template>
  <div id="app">
    <div class="DivShelhalemaala"></div>
    <div class="HazeSham">
      <div class="Allmenu">
        <div @click="$router.push('/')">
          <el-row :class="{ row: true, active: $route.path === '/' }">
            <el-col :span="24">דף הבית</el-col>
          </el-row>
        </div>
        <div @click="$router.push('/queshtinnre')">
          <el-row
            :class="{ row: true, active: $route.path === '/queshtinnre' }"
          >
            <el-col :span="24">שאלונים</el-col>
          </el-row>
        </div>
        <div @click="$router.push('/queshtins')">
          <el-row :class="{ row: true, active: $route.path === '/queshtins' }">
            <el-col :span="24">שאלות</el-col>
          </el-row>
        </div>
        <div v-for="n in 26" :key="n">
          <el-row :class="{ row: true }">
            <el-col :span="24">{{ `item-${n}` }}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "BprevenZeshebatzad",

  data() {
    return {};
  },
  computed: {
    wachtStore() {
      return this.$store.state.message;
    },
  },
  watch: {
    wachtStore(val) {
      if (val) {
        let eles = document.querySelectorAll(".row");
        // console.log(eles);
        eles = eles.forEach((e) => (e.style.zIndex = "0"));
      } else {
        let eles = document.querySelectorAll(".row");
        // console.log(eles);
        eles.forEach((e) => (e.style.zIndex = "1"));
      }
    },
  },
  mounted() {
    // console.log(this.$store.state.message);
  },

  methods: {},
};
</script>
<style scoped>
.HazeSham {
  background: rgb(183, 173, 120);
  width: 200px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  overflow-y: auto;
  padding: 5px;
  padding-left: 40px;
}
.HazeSham::-webkit-scrollbar {
  display: none;
}
.Allmenu {
  text-align: center;
  position: relative;
  top: 40px;
}
.row {
  font-size: 20px;
  margin-bottom: 10px;
  background: rgb(249, 218, 218);
  border-radius: 20px 0 0 20px;
  padding: 10px;
  z-index: 1;
}
.row:hover {
  background: rgba(249, 218, 218, 0.53);
  cursor: pointer;
}
.DivShelhalemaala {
  position: absolute;
  background: rgba(0, 0, 0, 0.847);
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 500;
}
.active {
  background: rgb(53, 103, 203);
  font-size: 29px;
  color: white;
  position: relative;
  right: 30px;
  width: 200px;
}
.active:hover {
  background: rgb(31, 141, 205);
}
</style>
