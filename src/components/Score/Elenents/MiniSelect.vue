<template>
  <div>
    <el-select
      v-model="val"
      size="mini"
      :placeholder="placeholder"
      ref="Selectos"
      @visible-change="sort($event)"
      @change="$emit('change', { val, i })"
    >
      <el-option value="ריק"></el-option>
      <el-option label="ללא" value=""></el-option>
      <el-option
        ref="Op"
        v-for="(Op, i) in Option"
        :value="Op.Desc"
        :key="i"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: ["Option", "value", "placeholder", "i"],
  name: "BprevenMiniSelect",

  data() {
    return { val: "" };
  },
  watch: {
    val(v) {
      this.$emit("value", v);
    },
  },
  mounted() {
    this.val = this.value;
    let select = this.$refs.Selectos.$el.children[0].children[0];
    let options = this.$refs.Selectos.$el.children[1];
    options.style.background = "#E6A23C";
    options.style.color = "red";
    options.style.textAlign = "right";
    select.style.background = "#cd9848";
    // select.addEventListener("blur", (e) => {
    //   e.target.style.outline = "none";
    // });
  },

  methods: {
    sort(boll) {
      if (boll) {
        let TextOp = this.$refs.Op;
        TextOp = TextOp.map((e) => (e = e.$el));
        TextOp.forEach((el) => {
          el.style.color = "black";
        });
      }
    },
    resizeTo() {
      this.val = "";
    },
  },
};
</script>
<style scoped>
.el-select {
  border: none;
  width: 100px;
  background: #cd9848;
}
</style>
