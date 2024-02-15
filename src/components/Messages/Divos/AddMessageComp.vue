<template>
  <div>
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div class="inAddmes">
      <div class="InputName">
        <!-- <label>שם ההודעה</label> -->
        <input
          dir="rtl"
          placeholder="שם ההודעה"
          class="w3-input"
          v-model="NewMes.DescMes"
          v-show="!showTextArea"
          @focus="
            showTextArea = true;
            FocusTexArea();
          "
        />
        <el-input
          dir="rtl"
          ref="textareaZ"
          @blur="showTextArea = false"
          v-show="showTextArea"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="שם ההודעה"
          v-model="NewMes.DescMes"
        >
        </el-input>
      </div>
      <div class="inputSymbol">
        <input
          dir="rtl"
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
        status: true,
        DescMes: "",
        SymbolMes: "",
      },
      showTextArea: false,
    };
  },

  mounted() {},

  methods: {
    async AddMessage(newMes) {
      let { data } = await this.$ax.post(URL + "AddMes", newMes);
      this.$Bool(data, "נוסף בהצלחה", "משהו השתבש", false);
      this.$emit("Updata");
      // this.$store.commit("SgorDivos", true);
    },
    FocusTexArea() {
      if (this.$refs.textareaZ && this.$refs.textareaZ.$el) {
        let inp = this.$refs.textareaZ.$el.children[0];
        if (inp) {
          setTimeout(() => {
            inp.style.background = "none";
            inp.style.color = "black";
            inp.focus();
          }, 0);
        }
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
  /* float: right; */
  margin: 30px;
  position: absolute;
  top: 0px;
  right: 0;
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
  position: absolute;
  top: 0;
}
.inputSymbol .w3-input {
  background: rgba(126, 114, 114, 0.26);
  border-radius: 10px 10px 0 0;
  position: relative;
  top: 5px;
}
.Swichoz {
  position: relative;
  top: 150px;
  width: 170px;
  height: 60px;
  padding: 10px;
  background: rgb(127, 116, 116);
  border-radius: 20px;
  left: 36%;
}
.Swichoz .el-switch {
  position: absolute;
  left: 14px;
  top: 20px;
  /* bottom: 20px; */
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
input::placeholder {
  color: rgba(0, 0, 0, 0.729);
}
</style>
