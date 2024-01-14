<template>
  <div>
    <el-input
      ref="InputAuto"
      v-model="ModelAutoComplited"
      placeholder="בחר שאלון"
      @input="SerchQuery(ModelAutoComplited)"
      @focus="showAutoComplited = true"
      @blur="blurInp"
      clearable
      @clear="$emit('clear')"
    ></el-input>
    <div class="ParentsItemsComplited" v-if="showAutoComplited">
      <div
        class="Itemcomplited"
        v-for="(W, i) in itemsAutoComplited"
        :key="i"
        @click="
          ModelAutoComplited = W.nameQuesinnare;
          $emit('Inp');
        "
      >
        {{ W.nameQuesinnare }}
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  data() {
    return {
      ObjDataQuestions: {},
      responseData: [],
      ModelAutoComplited: "",
      itemsAutoComplited: [],
      showAutoComplited: false,
      OldQ: "",
    };
  },
  async mounted() {
    let { data } = await this.$ax.get(URL + "GetallQuestions");
    this.ObjDataQuestions = data;
    let arr = [];
    for (const key in data) {
      arr.push({ nameQuesinnare: key, qustions: data[key] });
    }
    this.responseData = arr;
    this.itemsAutoComplited = arr;
    await this.$nextTick();
    this.sortInput();
  },
  watch: {
    wachtStore(val, old) {
      // console.log(val);
      if (!val) {
        this.ModelAutoComplited = "";
      } else {
        this.ModelAutoComplited = this.OldQ;
      }
    },
    ModelAutoComplited(val, old) {
      this.OldQ = old;
    },
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },

  methods: {
    sortInput() {
      let inp = this.$refs.InputAuto.$el.children[0];
      inp.style.background = " rgba(0, 0, 0, 0.595)";
      inp.style.border = "none";
      inp.style.color = "white";
      inp.style.borderRadius = "20px";
      inp.style.borderBottom = "3px solid black";
      let styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = `input::placeholder { font-style: italic;}`;
      document.head.appendChild(styleSheet);
    },
    blurInp() {
      setTimeout(() => {
        this.showAutoComplited = false;
        this.$emit("nivhar", this.ModelAutoComplited);
      }, 300);
    },
    SerchQuery(query) {
      if (query) {
        this.itemsAutoComplited = this.responseData.filter((e) =>
          e.nameQuesinnare.includes(query)
        );
      } else {
        this.itemsAutoComplited = this.responseData;
      }
    },
  },
};
</script>
<style scoped>
.ParentsItemsComplited {
  position: absolute;
  left: 0%;
  top: 50px;
  animation: fadeInHeight 0.5s ease-in-out forwards;
  width: 360px;
  font-size: 25px;
  background: rgb(229, 218, 218);
  border-radius: 20px;
  z-index: 5000;
}
.ParentsItemsComplited::after {
  content: "";
  position: absolute;
  top: -10px; /* ממקם את המשולש מעל האלמנט */
  left: 50%; /* ממקם את המשולש במרכז האלמנט */
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid rgb(229, 218, 218); /* צבע המשולש */
  transform: translateX(-50%); /* מתקן את המיקום האופקי של המשולש */
}
@keyframes fadeInHeight {
  0% {
    max-height: 0;
  }
  100% {
    max-height: 1000px;
  }
}

.Itemcomplited {
  text-align: center;
  border-radius: 20px;
  margin-bottom: 5px;
}
.Itemcomplited:hover {
  background: rgb(255, 172, 172);
  cursor: pointer;
}
.el-input:focus {
  border: 3px solid white;
}
</style>
