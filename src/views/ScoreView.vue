<template>
  <div>
    <!-- <div :style="{ width: `${Screen}px` }" class="D"></div> -->
    <InputAutoComplitade
      :class="{ inlineInput: !wachtStore, BigScreen: wachtStore }"
      @nivhar="
        activQushinnare = $event;
        sortTabs();
      "
    />
    <h1
      class="LoMatzanu"
      v-show="
        activQushinnare
          ? !ObjDataQuestions[activQushinnare].length > 0
          : !null && activQushinnare !== ''
      "
    >
      "לא נמצע ערך זהה ל "{{ activQushinnare }}
    </h1>
    <div v-if="shomes">
      <el-row>
        <el-col
          :span="6"
          v-for="(q, i) in ObjDataQuestions[activQushinnare]"
          :key="i"
          class="content"
          ref="contentCOL"
        >
          <div class="HeaderQuestions" ref="HeaderQuestions">
            {{ q.Desc }}/<span>{{ computedData(q.DescDateTypes) }}</span>
          </div>
          <div ref="ItemsNoheader">
            <div
              v-for="(s, i) in ComputedOptions({ arrOptions, Desco: q.Desc })"
              :key="i"
              class="Item-content"
              ref="ItemContent"
            >
              <span>
                {{ s.Desc }}
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
import InputAutoComplitade from "@/components/Elements/inputAutoComp.vue";
export default {
  components: {
    InputAutoComplitade,
  },
  name: "BprevenScoreView",
  data() {
    return {
      ObjDataQuestions: [],
      arrOptions: [],
      activQushinnare: "",
      shomes: false,
      Screen: window.innerWidth - 240,
    };
  },
  computed: {
    wachtStore() {
      return this.$store.state.TogelAnimate;
    },
  },
  watch: {
    async activQushinnare(val) {
      this.shomes = false;
      let res = await this.$ax.get(URL + "GetOPtionForQuestion/" + val);
      this.arrOptions = res.data;
      this.shomes = true;
    },
    wachtStore(val) {
      if (val) {
        this.Screen = window.innerWidth;
      } else {
        this.Screen = window.innerWidth - 240;
      }
      this.sortTabs();
    },
  },
  async mounted() {
    let { data } = await this.$ax.get(URL + "GetallQuestions");
    // console.log(data);

    this.ObjDataQuestions = data;
    await this.$nextTick();
  },

  methods: {
    bdika(val) {
      console.log(val);
    },
    computedData(val) {
      //   console.log(val);
      if (val === "Text") {
        return "טקסט";
      } else if (val === "Numeric") {
        return "מספר";
      } else if (val === "OptionId") {
        return "אופציות";
      } else if (val === "Date") {
        return "תאריך";
      }
    },
    async sortTabs() {
      await this.$nextTick();
      setTimeout(async () => {
        let widtho;
        let col;
        if (this.$refs.contentCOL) {
          let ItemsOnly = this.$refs.ItemsNoheader;
          // console.log(ItemsOnly);
          col = this.$refs.contentCOL;
          widtho = this.Screen / col.length - 65 + "px";

          // console.log(col.length);
          col.forEach((e) => {
            e = e.$el;

            // console.log(e);
            if (col.length === 2) {
              widtho = this.Screen / col.length - 75 + "px";
            } else if (col.length === 1) {
              widtho = this.Screen / col.length - 175 + "px";
            }
            e.style.width = widtho;
            e.style.marginRight = "30px";
          });
          let item = this.$refs.ItemContent;
          if (!item) {
            await this.delay(500);
          }
          if (item) {
            item.forEach((elo) => {
              elo.style.position = "relative";
              elo.style.left = "50%";
              elo.style.transform = "translateX(-50%)";
            });
          }
        }
      }, 200);
    },
    ComputedOptions(val) {
      // console.log(val);
      const result = val.arrOptions.find((e) => {
        return e[val.Desco];
      });
      // console.log(result);
      // console.log(result[val.Desco]);
      return result[val.Desco];
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>
<style scoped>
/* .D {
  background: #000;
  height: 30px;
  position: absolute;
  top: 200px;
  left: 0;
  transition: all 2s;
} */
.HeaderQuestions {
  background: rgb(255, 255, 255);
  color: crimson;
  padding: 6px;
}
.HeaderQuestions span {
  font-size: 12px;
  color: crimson;
}
.content:not(.HeaderQuestions) {
  position: relative;
  top: 200px;
  left: 90px;
  display: flex;
  flex-direction: column;
  /* width: 250px; */
  /* margin-right: 50px; */
  text-align: center;
  transition: width 0.3s;
}
.Item-content {
  background: rgb(159, 195, 101);
  padding: 5px;
  width: 200px;
  margin-top: 30px;
  border-radius: 10px;
  font-size: 20px;
  position: relative;
  left: 30px;
  transition: all 0.4s;
}
.Item-content:not(:last-child)::after {
  content: "";
  position: absolute;
  height: 100%;
  border-left: 2px solid black;
  left: 50%;
  bottom: -100%;
}
/* .content span:hover {
  padding: 5px;
  width: 100px;
  text-align: right;
} */
.inlineInput {
  position: absolute;
  left: 30%;
  top: 80px;
  width: 360px;
  transition: all 0.3s;
  z-index: 1;
}
.BigScreen {
  z-index: 1;
  position: absolute;
  left: 40%;
  top: 80px;
  width: 360px;
  transition: all 0.3s;
}
.block {
  width: 20%;
  position: relative;
  top: 100px;
}
.el-card {
  height: 100px;
  font-size: 15px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 10px;
}
.option,
.score {
  width: 40%; /* מגדיל את הרוחב מ-50% ל-40% כדי ליצור מרחב באמצע */
}

.option {
  text-align: center;
  position: absolute;
  right: 18px;
  top: 20px;
}

.score {
  text-align: center;
  position: absolute;
  left: 18px;
  top: 24px;
}

/* מוסיף קו באמצע הכרטיס */
.el-card::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  border-left: 1px solid #ccc; /* יוצר קו אנכי */
  transform: translateX(-50%); /* ממקם את הקו במרכז האלמנט */
}
.LoMatzanu {
  position: absolute;
  left: 22%;
  top: 30%;
}
</style>
