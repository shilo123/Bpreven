<template>
  <div v-if="ComplitedDate">
    <i class="el-icon-close" @click="$emit('Close')"></i>

    <div class="in">
      <div class="rowA">
        <div class="quesinnaire">
          <label for="quesinnaire">שאלון</label>
          <el-select v-model="NewStepUserFlow.Quesinnaire" placeholder="שאלון">
            <el-option
              v-for="(q, i) in objData.Questionnaire"
              :key="i"
              :value="q.Id"
              :label="`${q.Desc}/${q.Symbol}`"
              v-show="IfCurronetQushinaire(q.Id)"
            ></el-option>
          </el-select>
        </div>
        <div class="TypeUser">
          <el-select v-model="NewStepUserFlow.TYpeUser" placeholder="סוג משתמש">
            <el-option
              v-for="(u, i) in objData.UsersFlow"
              :key="i"
              :value="u.Id"
              :label="`${u.Desc}/${u.Symbol}`"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="rowB">
        <el-switch
          v-model="NewStepUserFlow.StatusId"
          active-text="פעיל"
          inactive-text="לא פעיל"
        ></el-switch>
      </div>
    </div>
    <div class="buttons">
      <el-button
        type="success"
        class="shmorTO"
        @click="Edit(NewStepUserFlow)"
        :loading="loadingButton"
        >שמור</el-button
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
  name: "BprevenEditUserFlow",
  props: ["row", "data"],
  data() {
    return {
      ComplitedDate: false,
      objData: {},
      NewStepUserFlow: {
        StatusId: Boolean(this.row.StatusId),
        TYpeUser: this.row.UserId,
        Quesinnaire: this.row.QushinnareId,
        id: this.row.Id,
      },
      loadingButton: false,
    };
  },

  async mounted() {
    let { data } = await this.$ax.get(URL + "GetAlldataTheUserFlow");
    // console.log(data);
    this.objData = data;
    this.ComplitedDate = true;
  },

  methods: {
    async Edit(NewData) {
      this.loadingButton = true;
      let { data } = await this.$ax.put(URL + "EditUserFlowStep", {
        ...NewData,
      });
      this.loadingButton = false;
      this.$Bool(data, "עודכן בהצלחה", "משהו השתבש", false);
      this.$emit("Updata");
    },
    IfCurronetQushinaire(id) {
      const CuronetQ = this.row.QushinnareId;
      let bool = this.data.some((e) => {
        return e.QushinnareId !== id && e.QushinnareId === CuronetQ;
      });
      return bool;
    },
  },
};
</script>

<style scoped>
.in {
  width: 785px;
  border-radius: 20px;
  height: 260px;
  border: 3px solid black;
  box-shadow: 0 0 3px 7px rgb(104, 93, 93);
  position: relative;
  left: 30px;
  top: 40px;
}
.buttons {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 20px;
}
.shmorTO {
  margin-left: 10px;
}
.rowA {
  display: flex;
  flex-direction: row-reverse;
}
.quesinnaire {
  position: relative;
  margin: 20px;
}
.quesinnaire .w3-input {
  margin-top: 20px;
}
label {
  position: absolute;
  right: 0;
  top: 0;
}
.TypeUser {
  margin: 20px;
  margin-right: 290px;
}
.el-switch {
  position: relative;
  left: 40%;
  top: 50px;
}
</style>
