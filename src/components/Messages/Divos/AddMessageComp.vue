<template>
  <div>
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div class="inAddmes">
      <div class="InputName">
        <!-- <label>שם ההודעה</label> -->
        <input
          placeholder="שם ההודעה"
          class="w3-input"
          v-model="NewMes.DescMes"
        />
      </div>
      <div class="inputSymbol">
        <input
          placeholder="שם הסימן"
          class="w3-input"
          v-model="NewMes.SymbolMes"
        />
      </div>
      <div class="Swichoz">
        <label>סטטוס</label>
        <el-switch
          active-text="פעיל"
          inactive-text="לא פעיל"
          v-model="NewMes.status"
        ></el-switch>
      </div>
    </div>
    <div class="Buttons">
      <el-button type="success" class="shmorTO" @click="AddMessage(NewMes)"
        >הוסף</el-button
      >
      <el-button
        type="danger"
        class="sgorTo"
        @click="$store.commit('SgorDivos', true)"
        >סגור</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenAddMessageComp",

  data() {
    return {
      NewMes: {
        status: false,
        DescMes: "",
        SymbolMes: "",
      },
    };
  },

  mounted() {},

  methods: {
    async AddMessage(newMes) {
      let { data } = await this.$ax.post(URL + "AddMes", newMes);
      if (data) {
        this.$message.success("נוסף בהצלחה");
        window.location.reload();
      } else {
        this.$message.error("משהו השתבש");
      }
    },
  },
};
</script>

<style scoped>
.inAddmes {
  border: 3px solid black;
  width: 80%;
  height: 260px;
  position: relative;
  left: 70px;
  top: 30px;
  border-radius: 20px;
  box-shadow: 0 0 7px 5px rgb(123, 113, 113);
}
label {
  position: relative;
  left: 70%;
  margin-bottom: 10px;
}
.InputName {
  width: 40%;
  float: right;
  margin: 30px;
}
.InputName .w3-input {
  background: rgba(126, 114, 114, 0.26);
  border-radius: 10px 10px 0 0;
  position: relative;
  top: 5px;
}
.inputSymbol {
  width: 40%;
  float: left;
  margin: 30px;
  position: relative;
  bottom: 98px;
}
.inputSymbol .w3-input {
  background: rgba(126, 114, 114, 0.26);
  border-radius: 10px 10px 0 0;
  position: relative;
  top: 5px;
}
.Swichoz {
  position: relative;
  top: 140px;
  left: 50px;
  width: 170px;
  height: 60px;
  padding: 10px;
  background: rgb(127, 116, 116);
  border-radius: 20px;
  left: 33%;
}
.Swichoz .el-switch {
  position: absolute;
  bottom: 20px;
  /* left: 38%; */
}
.Swichoz label {
  display: none;
  position: absolute;
  top: 20px;
  left: 38%;
}
.Buttons {
  position: absolute;
  bottom: 20px;
  right: 10px;
  margin: 10px;
}
</style>
