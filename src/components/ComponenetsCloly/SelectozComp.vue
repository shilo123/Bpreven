<template>
  <div>
    <div
      class="Container"
      @mouseover="OverAllSel = true"
      @mouseleave="OverAllSel = false"
    >
      <div
        class="title"
        @mouseover="OverIcon = true"
        @mouseleave="OverIcon = false"
        @click="clickAllTitle = !clickAllTitle"
        :style="
          !OverIcon ? { background: '' } : { background: 'rgb(0, 170, 255)' }
        "
      >
        <input
          v-model="ActivOpt"
          :placeholder="pleaceHolder"
          :style="
            !OverIcon
              ? { background: '', textAlign: 'center' }
              : { background: 'rgb(0, 170, 255)', textAlign: 'center' }
          "
          type="text"
          readonly
          @mouseover="OverIcon = true"
          @mouseleave="OverIcon = false"
        />
        <i
          :class="{ Open: !clickAllTitle, Close: clickAllTitle }"
          class="fa-solid fa-caret-up fa-xl icon"
          :style="
            !OverIcon ? { color: '#000000' } : { color: 'rgb(0, 108, 158)' }
          "
          @mouseover="OverIcon = true"
          @mouseleave="OverIcon = false"
        ></i>
      </div>
      <div
        :class="{ OpenAllItems: clickAllTitle, CloseAllItems: !clickAllTitle }"
      >
        <i
          class="fa-solid fa-caret-up iconito"
          style="color: rgb(68, 155, 198)"
        ></i>
        <input
          readonly
          type="text"
          v-for="(n, i) in Ops"
          :key="i"
          :value="n"
          @click="
            ActivOpt = n;
            clickAllTitle = !clickAllTitle;
            emitOs(n);
          "
          :class="{ TrueClick: clickAllTitle, FalseClick: !clickAllTitle }"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BprevenSelectozComp",
  props: ["pleaceHolder", "Ops"],
  data() {
    return {
      OverIcon: false,
      clickAllTitle: false,
      OverAllSel: false,
      ActivOpt: "",
    };
  },
  watch: {},

  mounted() {
    document.body.addEventListener("click", (e) => {
      if (!this.OverAllSel) {
        this.clickAllTitle = false;
      }
    });
  },

  methods: {
    emitOs(val) {
      // console.log(val);
      this.$emit("changez", val);
    },
  },
};
</script>
<style scoped>
body {
  background: rgb(0, 108, 158);
}
.title {
  border-radius: 20px;
  background: rgb(68, 155, 198);
  border: none;
}
.title input {
  border-radius: 20px;
  background: rgb(68, 155, 198);
  border: none;
}
.title input:hover {
  cursor: pointer;
}
.title:hover {
  cursor: pointer;
}
input:focus {
  outline: none;
}
input::placeholder {
  text-align: center;
  color: rgba(0, 0, 0, 0.358);
}
.icon {
  position: relative;
  right: 10px;
  top: 2px;
  transition: all 0.3s;
}
.Open {
  transform: rotate(180deg);
}
.Close {
  transform: rotate(0deg);
}
.OpenAllItems {
  margin-top: 5px;
  max-height: 200px; /* או כל גובה אחר שמתאים לך */
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  /* box-shadow: 0 0 7px 2px; */
}
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* עיצוב המגלגל (החלק שנע) */
::-webkit-scrollbar-thumb {
  background: rgb(158, 181, 255); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
  position: relative;
  top: 40px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(87, 87, 87, 0.7); /* צבע המגלגל */
  border-radius: 5px; /* עיגול פינות המגלגל */
}

.CloseAllItems {
  max-height: 0;
  transition: max-height 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.TrueClick,
.FalseClick {
  border: none;
  margin-bottom: 0.7px;
  width: 90%;
  position: relative;
  left: 7%;
  text-align: center;
  transition: all 0.3 ease;
}
.TrueClick {
  background: rgb(192, 192, 255);
  transition: all 0.3 ease;
  animation: backGroundoz 0.3s;
  padding: 7px;
}
.TrueClick:first-of-type {
  /* background: #000; */
  border-radius: 10px 10px 0 0;
}
.TrueClick:last-child {
  /* background: #000; */
  border-radius: 0 0 10px 10px;
}
.TrueClick:hover {
  background: rgb(68, 155, 198);
  transition: all 0.3;
  cursor: pointer;
  border-radius: 20px;
  color: rgb(255, 253, 137);
  padding: 6px;
}
@keyframes backGroundoz {
  from {
    background: rgb(68, 155, 198);
    opacity: 0;
  }
  to {
    background: rgb(200, 200, 200);
    opacity: 1;
  }
}
.FalseClick {
  background: rgb(68, 155, 198);
  transition: all 0.3;
  animation: backio 0.3s;
  opacity: 0;
}
@keyframes backio {
  from {
    background: rgb(200, 200, 200);
    opacity: 1;
  }
  to {
    background: rgb(68, 155, 198);
    opacity: 0;
  }
}
.iconito {
  position: relative;
  left: 76%;
  top: 2px;
}
</style>
