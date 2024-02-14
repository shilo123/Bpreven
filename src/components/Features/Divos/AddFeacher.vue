<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="InputName">
      <label>שם הפיצ'ר</label>
      <el-input v-model="Name" placeholder="שם הפיצ'ר" dir="rtl"></el-input>
    </div>
    <div class="Symbol">
      <label>שם הסימן</label>
      <el-input v-model="Symbol" placeholder="שם סימן" dir="rtl"></el-input>
    </div>
    <div class="number">
      <label>מספר</label>
      <el-input-number v-model="number" placeholder="מספר"></el-input-number>
    </div>
    <div class="Buttons">
      <el-button
        type="success"
        class="shmorTO"
        @click="AddFeacher({ Name, Symbol, number })"
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
  name: "BprevenAddFeacher",

  data() {
    return {
      Name: "",
      Symbol: "",
      number: "",
    };
  },

  mounted() {},

  methods: {
    async AddFeacher(newF) {
      console.log(newF);
      let { data } = await this.$ax.post(URL + "Addfeacher", newF);
      this.$Bool(data, "נוסף בהצלחה", "משהו השתבש", true);
    },
  },
};
</script>

<style scoped>
.InputName {
  width: 40%;
  margin: 20px;
  float: right;
}
.InputName label {
  float: right;
  margin: 10px;
}
.Symbol {
  width: 40%;
  margin: 20px;
  float: right;
}
.Symbol label {
  float: right;
  margin: 10px;
}
.number label {
  position: absolute;
  left: 42%;
  top: -30px;
}
.number {
  position: absolute;
  bottom: 130px;
  left: 35%;
}
.Buttons {
  position: absolute;
  bottom: 20px;
  right: 0;
}
</style>
