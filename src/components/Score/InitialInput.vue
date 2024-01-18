<template>
  <div>
    <div class="conteniar">
      <label class="Labelo" v-show="showFocus" :style="{ color: background }">{{
        placeHolder
      }}</label>
      <label
        class="LabeloD"
        v-show="!showFocus"
        :style="{ color: background }"
        >{{ placeHolder }}</label
      >
      <input
        v-model="value"
        type="text"
        :placeholder="placeHolder"
        @focus="showFocus = true"
        @blur="showFocus = false"
        :class="{ FocusInp: showFocus, BlurInp: !showFocus }"
      />
      <div class="focus-lineL" v-if="showFocus" :style="{ background }"></div>
      <div class="focus-lineR" v-if="showFocus" :style="{ background }"></div>
      <div class="blur-lineL" v-if="!showFocus" :style="{ background }"></div>
      <div class="blur-lineR" v-if="!showFocus" :style="{ background }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["background", "placeHolder", "val"],
  data() {
    return { showFocus: false, value: "" };
  },
  watch: {
    value(val) {
      this.$emit("value", val);
    },
    val(val) {
      console.log(val);
      this.value = val;
    },
  },

  mounted() {
    this.value = this.val;
  },

  methods: {},
};
</script>
<style scoped>
input {
  border: none;
  border-bottom: 2px solid black;
  text-align: right;
  width: 280px;
  font-size: 20px;
  background: none;
}
input:focus {
  outline: none;
}
.focus-lineR {
  position: absolute;
  bottom: 0;
  right: 50%;
  /* background: rgb(121, 255, 76); */
  width: 50%;
  height: 2px;
  animation: animationWidth 0.7s;
}
.focus-lineL {
  position: absolute;
  bottom: 0;
  left: 50%;
  /* background: rgb(121, 255, 76); */
  width: 50%;
  height: 2px;
  animation: animationWidth 0.7s;
}
/* .BlurInp {
  
  } */
.blur-lineL {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  animation: animationWidthD 0.7s;
}
.blur-lineR {
  position: absolute;
  bottom: 0;
  right: 50%;
  width: 0;
  height: 2px;
  animation: animationWidthD 0.7s;
}
@keyframes animationWidthD {
  from {
    width: 50%;
  }
  to {
    width: 0;
  }
}
@keyframes animationWidth {
  from {
    width: 0;
  }
  to {
    width: 50%;
  }
}
input::placeholder {
  font-family: italic;
  font-size: 15px;
}
.FocusInp::placeholder {
  display: none;
  position: absolute;
  top: 200px;
}
.Labelo {
  position: absolute;
  right: 0;
  font-size: 20px;
  animation: topo 0.7s;
  top: -20px;
}
.LabeloD {
  position: absolute;
  right: 0;
  animation: topoD 0.7s;
  top: -20px;
  font-size: 20px;
  opacity: 0;
}
@keyframes topoD {
  from {
    top: -20px;
    font-size: 20px;
    opacity: 1;
  }
  to {
    top: 0;
    font-size: 15px;
  }
}
@keyframes topo {
  from {
    top: 0;

    font-size: 15px;
  }
  to {
    top: -20px;
    font-size: 20px;
  }
}
</style>
