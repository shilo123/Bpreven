<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="in" v-if="ComplitedDate">
      <div class="rowA">
        <div class="quesinnaire">
          <el-select v-model="NewStepUserFlow.Quesinnaire" placeholder="שאלון">
            <el-option
              v-for="(q, i) in objData.Questionnaire"
              :key="i"
              :value="q.Id"
              :label="`${q.Desc}/${q.Symbol}`"
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
        @click="AddUserFlowStep(NewStepUserFlow)"
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
  name: "BprevenAddUserFlowStep",
  props: ["row", "data"],
  data() {
    return {
      ComplitedDate: false,
      objData: {},
      NewStepUserFlow: {
        StatusId: true,
        TYpeUser: "",
        Quesinnaire: "",
      },
      loadingButton: false,
    };
  },

  async mounted() {
    let { data } = await this.$ax.get(URL + "GetAlldataTheUserFlow");
    this.objData = data;
    this.ComplitedDate = true;
  },

  methods: {
    async AddUserFlowStep(NewData) {
      if (this.NewStepUserFlow.Quesinnaire && this.NewStepUserFlow.TYpeUser) {
        // console.log({ ...NewData });
        const { data } = await this.$ax.post(URL + "AddUserFlowStep", NewData);
        this.$Bool(data, "נוסף בהצלחה", "משהו השתבש", false);
        this.$emit("Updata");
      } else {
        this.$message.warning("לא מילאת את השדות");
      }
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
.TypeUser {
  position: absolute;
  margin: 20px;
  left: 0;
}
label {
  position: absolute;
  right: 0;
  top: 0;
}
.quesinnaire {
  margin: 20px;
  /* margin-right: 290px; */
  position: absolute;
  right: 0;
}
.el-switch {
  position: relative;
  left: 40%;
  top: 130px;
}
.el-select {
  border: 1px solid black;
  border-radius: 4px;
}
</style>
