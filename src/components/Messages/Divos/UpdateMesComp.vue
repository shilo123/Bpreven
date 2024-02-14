<template>
  <div>
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div class="inUp">
      <div class="ItemUp">
        <input
          type="text"
          class="w3-input"
          placeholder="הקלד סימן חדש"
          v-model="Symbol"
        />
      </div>

      <div class="ItemUp">
        <input
          dir="rtl"
          type="text"
          class="w3-input"
          placeholder="הקלד שם חדש"
          v-model="Desc"
          v-show="!showTextarea"
          @focus="showTextarea = true"
        />
        <el-input
          dir="rtl"
          @blur="showTextarea = false"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="הקלד שם חדש"
          v-model="Desc"
          v-show="showTextarea"
        >
        </el-input>
      </div>
      <div class="swichtoz">
        <el-switch
          v-model="StatusId"
          active-text="פעיל"
          inactive-text="לא פעיל"
        >
        </el-switch>
      </div>
    </div>
    <div class="Buttons">
      <el-button
        type="success"
        class="shmorTO"
        @click="SaveTheUpdate({ Desc, Symbol, StatusId, ID })"
        >שמור</el-button
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
  name: "BprevenUpdateMesComp",
  props: ["row"],
  data() {
    return {
      Desc: this.row.Desc,
      Symbol: this.row.Symbol,
      StatusId: Boolean(this.row.StatusId),
      ID: this.row.Id,
      showTextarea: false,
    };
  },
  computed: {},
  mounted() {
    console.log(this.row);
  },

  methods: {
    async SaveTheUpdate(row) {
      if (this.Desc && this.Symbol) {
        let { data } = await this.$ax.post(URL + "UpdateMessage", row);
        if (data) {
          this.$message.success("עודכן בהצלחה");
          window.location.reload();
        } else {
          this.$message.success("משהו השתבש");
        }
      } else {
        this.$message.error("אבל כתוב משהו אחיי");
      }
    },
  },
};
</script>

<style scoped>
.inUp {
  border: 3px solid black;
  width: 640px;
  height: 290px;
  padding: 5px;
  position: absolute;
  left: 30px;
  top: 30px;
  border-radius: 20px;
  box-shadow: 0 0 7px 3px rgb(183, 154, 154);
}
.ItemUp {
  display: flex;
  flex-direction: column;
  /* float: right; */
  width: 40%;
  margin: 30px;
}
.swichtoz {
  position: relative;
  left: 390px;
  top: -60px;
}
.Buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
