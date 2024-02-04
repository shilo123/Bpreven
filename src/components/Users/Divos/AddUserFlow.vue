<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <input
      type="text"
      placeholder="חפש"
      v-show="!shows.showAdd && !shows.showUP"
      v-model="serch"
    />
    <el-button
      type="success"
      size="mini"
      class="ButtonHosef"
      @click="shows.showAdd = true"
      v-show="!shows.showAdd && !shows.showUP"
      >הוסף</el-button
    >
    <div class="ShowAdd" v-show="shows.showAdd || shows.showUP">
      <el-input
        v-model="Addinp"
        placeholder="כתוב שם"
        size="mini"
        class="InputAddName"
      ></el-input>
      <el-input
        class="InputSymbol"
        v-model="AddStmbol"
        placeholder="כתוב סימן"
        size="mini"
      ></el-input>
      <div class="buts">
        <el-button
          type="danger"
          size="mini"
          style="width: 90px"
          @click="
            shows.showAdd = false;
            shows.showUP = false;
            Addinp = '';
            AddStmbol = '';
          "
          >סגור</el-button
        >

        <el-button
          type="success"
          size="mini"
          style="width: 90px"
          v-if="shows.showUP"
          @click="Update(idIt)"
          >שמור</el-button
        >
        <el-button
          type="success"
          size="mini"
          style="width: 90px"
          v-if="shows.showAdd"
          @click="Add"
          >שמור</el-button
        >
      </div>
    </div>
    <el-table :data="data" border height="400" v-if="ifTable">
      <el-table-column label="אפשרויות" prop="" align="center">
        <template slot-scope="scope">
          <el-button
            class="Prim"
            type="primary"
            size="mini"
            @click="
              shows.showUP = true;
              Addinp = scope.row.Desc;
              AddStmbol = scope.row.Symbol;
              idIt = scope.row.Id;
            "
            >עריכה</el-button
          >
          <el-popconfirm
            confirm-button-text="כן"
            cancel-button-text="לא"
            icon="el-icon-info"
            icon-color="red"
            title="בטוח שברצונך למחוק?"
            @confirm="Delete(scope.row.Id)"
          >
            <el-button type="danger" size="mini" slot="reference"
              >מחיקה</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column
        label="סימן"
        prop="Symbol"
        align="center"
      ></el-table-column>
      <el-table-column label="שם" prop="Desc" align="center"></el-table-column>
      <el-table-column label="אם פעיל" prop="StatusId" align="center">
        <template slot-scope="scope">
          <div
            @click="
              ShowUpS[`Item-${scope.row.Id}`] = true;
              RafReshon();
            "
            class="DivMakif"
          >
            <div v-show="!ShowUpS[`Item-${scope.row.Id}`]">
              {{ scope.row.StatusId === 1 ? "פעיל" : "לא פעיל" }}
            </div>
            <div v-show="ShowUpS[`Item-${scope.row.Id}`]">
              <el-select
                v-model="StatusId"
                placeholder="בחר סטטוס"
                size="mini"
                @change="UpStat(scope.row.Id, StatusId)"
              >
                <el-option :value="1" label="פעיל"></el-option>
                <el-option :value="0" label="לא פעיל"></el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenAddUserFlow",
  props: ["dataUserFlow"],
  data() {
    return {
      idIt: "",
      ShowUpS: {},
      data: this.dataUserFlow,
      data2: this.dataUserFlow,
      Addinp: "",
      AddStmbol: "",
      shows: {
        showAdd: false,
        showUP: false,
      },
      paramsEdit: {},
      StatusId: "",
      ifTable: true,
      serch: "",
    };
  },
  watch: {
    serch(val) {
      this.data = this.data2;
      this.data = this.data.filter((e) => {
        return e.Desc.includes(val) || e.Symbol.includes(val);
      });
      if (val === "") {
        this.data = this.data2;
      }
    },
    "shows.showAdd"(val) {
      if (val) {
        this.shows.showUP = false;
      }
    },
    "shows.showUP"(val) {
      if (val) {
        this.shows.showAdd = false;
      }
    },
  },
  mounted() {
    // setTimeout(() => {
    //   console.log(this.ShowUpS);
    // }, 5000);
    // console.log(this.dataUserFlow.map((e) => (e = { ...e })));
  },

  methods: {
    async Update(id) {
      const Desc = this.Addinp;
      const Symbol = this.AddStmbol;
      const params = { Desc, Symbol, id };
      let { data } = await this.$ax.put(URL + "PutOfUserFlow", params);
      this.$Bool(data, "עודכן בהצלחה", "משהו השתבש", false);
      this.UpData();
      // console.log({ Desc, Symbol });
    },
    async Add() {
      const Desc = this.Addinp;
      const Symbol = this.AddStmbol;
      const stat = 1;
      let { data } = await this.$ax.post(URL + "AddUserFlow", {
        Desc,
        Symbol,
        stat,
      });
      this.$Bool(data, "נוסף בהצלחה", "משהו השתבש", false);
      if (data) {
        this.UpData();
      }
    },
    async Delete(id) {
      console.log(id);
      let { data } = await this.$ax.delete(URL + "DelUserFlow/" + id);
      this.$Bool(data, "נמחק בהצלחה", "משהו השתבש", false);
      if (data) {
        this.UpData();
      }
    },
    RafReshon() {
      this.ifTable = false;
      setTimeout(() => {
        this.ifTable = true;
      }, 30);
      // alert();
    },
    async UpStat(id, newstat) {
      this.StatusId = "";
      this.ShowUpS[`Item-${id}`] = false;
      this.RafReshon();
      let { data } = await this.$ax.put(URL + "UpdateStatUserFlow", {
        id,
        newstat,
      });
      this.$Bool(data, "הסטטוס עודכן בהצלחה", "משהו השתבש", false);
      if (data) {
        this.UpData();
      }
    },
    async UpData() {
      const response = await this.$ax.get(URL + "GetTypeUser");
      this.data = response.data;
      this.data2 = response.data;
    },
  },
};
</script>

<style scoped>
.el-table {
  width: 90%;
  border: 2px solid black;
  position: relative;
  left: 40px;
  top: 50px;
}
input {
  background: none;
  border: none;
  width: 210px;
  border-bottom: 3px solid rgb(80, 80, 80);
  position: relative;
  left: 430px;
  top: 30px;
}
input:focus {
  outline: none;
  animation: WidthInput 0.3 ease-in-out;
}
@keyframes WidthInput {
  from {
    width: 210px;
  }
  to {
    width: 300px;
  }
}
.InputAddName {
  width: 210px;
  position: absolute;
  top: 40px;
  left: 210px;
}
.InputSymbol {
  position: absolute;
  top: 40px;
  left: 43px;
  width: 150px;
}
.ButtonHosef {
  top: 40px;
  position: absolute;
  width: 150px;
  left: 43px;
}
.ShowAdd {
  position: relative;
  bottom: 30px;
  left: 250px;
  margin-bottom: 20px;
  z-index: 1;
}
.ShowAdd .buts {
  position: absolute;
  left: -210px;
  top: 40px;
}
.Prim {
  margin-right: 5px;
}
.DivMakif {
  width: 100%;
  height: 100%;
}
.DivMakif:hover {
  background: rgba(107, 102, 102, 0.107);
  cursor: pointer;
}
</style>
