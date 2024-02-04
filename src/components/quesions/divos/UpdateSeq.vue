<template>
  <div>
    <div class="w3-panel w3-pale-red w3-leftbar w3-border-red warn">
      <p>אם תשנה כאן את הסדר השאלה הבאה לכל אופציה בשאלה תשתנה</p>
    </div>

    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div class="parentsAll">
      <!-- HTML !-->
      <draggable v-model="Ques" @end="Upsq">
        <div v-for="(q, i) in Ques" :key="i">
          <button class="button-29" role="button" :id="q.Id">
            {{ q.Desc }}
          </button>
          <i class="Index">{{ i + 1 }}</i>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import draggable from "vuedraggable";

export default {
  name: "BprevenUpdateSeq",
  props: ["Idq"],
  components: { draggable },
  data() {
    return { Ques: [] };
  },

  async mounted() {
    let { data } = await this.$ax.get(
      URL + "GetQuestinsFromQueshennaire/" + this.Idq
    );
    this.Ques = data;
    // console.log(data);
  },

  methods: {
    async Upsq(e) {
      let elements = e.to.children;
      let arr = [];
      Array.from(elements).forEach((e, i) => {
        let id = e.children[0].id;
        let newSeq = i + 1;
        arr.push({ id, newSeq });
      });
      let newI = this.Ques[e.newIndex];
      //   console.log(arr, newI);
      let params = { arr, newI, Idq: this.Idq };
      let { data } = await this.$ax.post(URL + "UpdateSeqTheQuestions", params);
      this.$Bool(data, "הסדר עודכן בהצלחה", "משהו השתבש", false);
    },
  },
};
</script>

<style scoped>
/* CSS */
.button-29 {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(
    100% 100% at 100% 0,
    #5adaff 0,
    #5468ff 100%
  );
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
  width: 300px;
}

.button-29:focus {
  box-shadow: #3c4fe0 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
}

.button-29:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-29:active {
  box-shadow: #3c4fe0 0 3px 7px inset;
  transform: translateY(2px);
}
/* // */
.parentsAll {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 20px;
  border: 3px solid black;
  border-radius: 6px;
  top: 130px;
  /* max-height: 300px; */
  background: rgb(147, 135, 135);
  overflow-y: auto;
}
.Index {
  padding: 5px;
  border-bottom: 3px solid #000;
  position: relative;
  top: 5px;
}
.warn {
  position: absolute;
  top: 15px;
  left: 20px;
  width: 360px;
  text-align: center;
}
::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

/* עיצוב המגלגל (החלק שנע) */
::-webkit-scrollbar-thumb {
  background: rgb(121, 122, 115); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
  position: relative;
  top: 40px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(87, 87, 87, 0.7); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
}
</style>
