<template>
  <div id="app">
    <div class="DivShelhalemaala">
      <div class="avater" v-show="!togelAnimate">
        <span class="text"> שלום ישראל ישראלי </span>
        <el-avatar icon="el-icon-user-solid" v-if="true"></el-avatar>
      </div>
      <!-- v-show="$route.path === '/Score'" -->
      <div
        class="icons"
        @click="togelAnimate = !togelAnimate"
        @mouseover="over = true"
        @mouseleave="over = false"
        :class="{ close: togelAnimate, open: !togelAnimate }"
      >
        <i v-for="(c, i) in classes" :class="getClassNames(c)" :key="i"></i>
      </div>
    </div>
    <div
      class="HazeSham"
      :class="{ closeMen: togelAnimate, openMen: !togelAnimate }"
    >
      <div class="Allmenu">
        <div @click="$router.push('/')">
          <el-row :class="{ row: true, active: $route.path === '/' }">
            <el-col :span="24"><i class="el-icon-s-home"></i> דף הבית </el-col>
          </el-row>
        </div>
        <div @click="$router.push('/queshtinnre')">
          <el-row
            :class="{ row: true, active: $route.path === '/queshtinnre' }"
          >
            <el-col :span="24"><i class="el-icon-question"></i> שאלונים</el-col>
          </el-row>
        </div>
        <div @click="$router.push('/queshtins')">
          <el-row :class="{ row: true, active: $route.path === '/queshtins' }">
            <el-col :span="24"
              ><i class="fa-regular fa-block-question"></i> שאלות</el-col
            >
          </el-row>
        </div>
        <div @click="$router.push('/Score')">
          <el-row :class="{ row: true, active: $route.path === '/Score' }">
            <el-col :span="24"
              ><i class="fa-sharp fa-regular fa-hundred-points"></i>
              ציונים</el-col
            >
          </el-row>
        </div>
        <div @click="$router.push('/Users')">
          <el-row :class="{ row: true, active: $route.path === '/Users' }">
            <el-col :span="24"><i class="fa-solid fa-user"></i> משתמשים</el-col>
          </el-row>
        </div>
        <div v-for="n in 16" :key="n">
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
import { URL } from "@/URL/url";

export default {
  name: "BprevenZeshebatzad",

  data() {
    return {
      togelAnimate: false,
      over: false,
      classes: [
        {
          normalClass: "fa-solid fa-left-long fa-rotate-180 fa-2xl",
          OverClass: "fa-solid fa-left-long fa-rotate-180 fa-2xl",
          Last: "fa-solid fa-check fa-2xl",
        },
        {
          normalClass: "fa-sharp fa-solid fa-grip-lines-vertical fa-2xl",
          OverClass: "fa-sharp fa-solid fa-xmark fa-2xl",
          Last: "fa-solid fa-left-long  fa-2xl",
        },
      ],
      Alldata: {},
    };
  },
  computed: {
    wachtStore() {
      return this.$store.state.message;
    },
    watchtogelAnimate() {
      return this.$store.state.TogelAnimate;
    },
  },
  watch: {
    togelAnimate(val) {
      this.$store.commit("SetTogel", val);
    },
    watchtogelAnimate(val) {
      this.togelAnimate = val;
    },

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
    $route(to, from) {
      let path = to.path;
      if (path === "/") {
        document.body.style.background = "";
      }
      if (path === "/queshtinnre") {
        document.body.style.background = "";
      }
      if (path === "/queshtins") {
        document.body.style.background = "";
      }
      if (path === "/Score") {
        document.body.style.background =
          "linear-gradient(to right, #c0a59f, #4f4e64, #616f79)";
        setTimeout(() => {
          this.togelAnimate = true;
        }, 500);
      }
      if (path === "/Users") {
        document.body.style.background = "";
      }
    },
  },
  async mounted() {
    // console.log(this.$store.state.message);
    if (this.$route.path === "/") {
      document.body.style.background = "";
    }
    if (this.$route.path === "/queshtinnre") {
      document.body.style.background = "";
    }
    if (this.$route.path === "/queshtins") {
      document.body.style.background = "";
      this.$store.commit("SetLoadingTable", true);
      await this.$store.dispatch("fetchData");
      this.$store.commit("SetLoadingTable", false);
    }
    if (this.$route.path === "/Score") {
      document.body.style.background =
        "linear-gradient(to right, #c0a59f, #4f4e64, #616f79)";
      setTimeout(() => {
        this.togelAnimate = true;
      }, 500);
    }
    if (this.$route.path === "/Users") {
      document.body.style.background = "";
    }
  },

  methods: {
    getClassNames(c) {
      let classes = "";
      if (!this.over && !this.togelAnimate) {
        classes = c.normalClass;
      }
      if (this.over && !this.togelAnimate) {
        classes = c.OverClass;
      }
      if (!this.over && this.togelAnimate) {
        classes = "fa-solid fa-bars fa-xl";
      }
      if (this.over && this.togelAnimate) {
        classes = c.Last;
      }

      return classes;
    },
  },
};
</script>
<style scoped>
body {
  background: linear-gradient(to right, #c0a59f, #4f4e64, #616f79);
}
.HazeSham {
  background: rgb(183, 173, 120);
  height: 140%;
  position: absolute;
  right: 0;
  top: 0;
  overflow-y: auto;
  padding: 5px;
  padding-left: 40px;
  transition: all 0.3s;
}
.HazeSham.openMen {
  width: 200px;
}
.HazeSham.closeMen {
  width: 0;
  right: -40px;
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
.icons {
  position: absolute;
  color: aliceblue;
  transition: all 0.3s;
}
.icons:hover {
  color: rgba(240, 248, 255, 0.8);
  cursor: pointer;
}
.icons.open {
  right: 200px;
  top: 5px;
}
.icons.close {
  right: 10px;
  top: 10px;
}
.avater {
  position: absolute;
  right: 0;
  color: white;
}
.text {
  position: absolute;
  top: 5px;
  width: 190px;
  left: -130px;
}
</style>
<style>
body {
  background: rgb(170, 170, 170);
  padding-bottom: 1000px;
  width: 100%;
}
input {
  text-align: right;
}
input::placeholder {
  text-align: right;
}
textarea::placeholder {
  text-align: right;
}
</style>
