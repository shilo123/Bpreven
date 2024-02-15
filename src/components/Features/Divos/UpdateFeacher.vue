<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="in">
      <div class="item" style="z-index: 10">
        <label for="">שם הפיצ'ר</label>
        <input
          type="text"
          class="w3-input"
          placeholder="שם"
          v-model="Name"
          dir="rtl"
        />
      </div>
      <div class="item" style="z-index: 10">
        <label for="">שם הסימן</label>
        <input
          type="text"
          class="w3-input"
          placeholder="סימן"
          v-model="Symbol"
        />
      </div>
      <div class="Number" style="z-index: 1">
        <!-- <label for="">מספר</label> -->
        <input
          type="text"
          class="w3-input"
          placeholder="כתוב מספר"
          v-model="number"
          dir="rtl"
        />
      </div>
    </div>
    <div class="Buttons">
      <el-button
        type="success"
        class="shmorTO"
        @click="UpFeacher({ Name, Symbol, number }, id)"
        >הוסף</el-button
      >
      <el-button type="danger" class="sgorTo" @click="$emit('Close')"
        >סגור</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenUpdateFeacher",
  props: ["row"],

  data() {
    return {
      Symbol: this.row.Symbol,
      number: this.row.Number,
      Name: this.row.Desc,
      id: this.row.Id,
    };
  },

  mounted() {},

  methods: {
    async UpFeacher(row, id) {
      //   console.log(row, id);
      let { data } = await this.$ax.post(URL + "UpFeacher", { row, id });
      this.$Bool(data, "עודכן בהצלחה", "משהו השתבש", false);
      this.$emit("Updata");
    },
  },
};
</script>

<style scoped>
.in {
  border: 3px solid black;
  width: 80%;
  height: 280px;
  position: relative;
  left: 70px;
  top: 40px;
  border-radius: 13px;
  box-shadow: 0 0 7px 3px rgb(172, 141, 141);
}
.w3-input {
  background: none;
}
label {
  float: right;
}
.item {
  margin: 20px;
  width: 36%;
  float: right;
}
.Number {
  width: 36%;
  position: relative;
  left: 35%;
  top: 140px;
  height: 60px;
}
.Number input {
  position: absolute;
}
.Buttons {
  position: absolute;
  bottom: 20px;
  right: 10px;
}
</style>
