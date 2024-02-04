<template>
  <div class="Edito">
    <button v-show="false" ref="ButtonStam"></button>

    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>

    <el-table :data="[rowEdit]" border v-if="false">
      <el-table-column
        align="center"
        label="NextQuestionId"
        prop="NextQuestionId"
      ></el-table-column>
      <el-table-column label="אם פעיל" align="center">
        <template slot-scope="scope">
          {{
            scope.row.StatusId === 1 || scope.row.StatusId
              ? "כן"
              : scope.row.StatusId === 0 || !scope.row.StatusId
              ? "לא"
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column label="אם אחרון" align="center">
        <template slot-scope="scope">
          {{ computedOfisEnd(scope.row.IsEnd) }}
        </template>
      </el-table-column>
      <el-table-column
        label="שאלון"
        prop="DescQuestionnaire"
        align="center"
      ></el-table-column>
      <el-table-column label="סוג התשובה" align="center">
        <template slot-scope="scope">
          {{ computedData(scope.row.DescDataType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="שאלה"
        prop="Desc"
        align="center"
      ></el-table-column>
    </el-table>
    <div class="inEdito w3-card-4">
      <div class="iteminEdit">
        <label>שם שאלה</label>
        <input type="text" class="w3-input" v-model="rowEdit.Desc" dir="auto" />
      </div>
      <div class="allitemsSelect">
        <div class="iteminEditSelct">
          <label>סוג תשובה</label>
          <el-select v-model="rowEdit.DescDataType" placeholder="סוג תשובה">
            <el-option
              v-for="(s, i) in Alldata.DataType"
              :key="i"
              :value="s"
              :label="computedData(s)"
            ></el-option>
          </el-select>
        </div>
        <div class="iteminEditSelct">
          <label>שאלון</label>
          <el-select v-model="rowEdit.DescQuestionnaire" placeholder="שאלון">
            <el-option
              v-for="(q, i) in Alldata.NameQuen"
              :key="i"
              :value="q"
            ></el-option>
          </el-select>
        </div>

        <div class="iteminEditSelct Last">
          <label>השאלה הבאה</label>
          <!-- :disabled="rowEdit.DescDataType === 'OptionId'" -->
          <el-select
            slot="reference"
            v-model="rowEdit.NextQuestionDesc"
            placeholder="שאלה הבאה"
            @input="rowEdit.DescDataType === 'OptionId' ? warnningOp() : ''"
          >
            <el-option
              value="לפי האופציה"
              v-show="rowEdit.DescDataType === 'OptionId' && !rowEdit.IsEnd"
            ></el-option>
            <el-option
              v-for="(a, i) in Alldata.Allquestions[rowEdit.DescQuestionnaire]"
              :key="i"
              :value="a.Id"
              :label="a.Desc"
              v-show="
                a.Desc !== rowEdit.Desc &&
                rowEdit.DescDataType === 'OptionId' &&
                !rowEdit.IsEnd
              "
            ></el-option>
          </el-select>
        </div>

        <div class="itemEditisEnd">
          <label>אם אחרון</label>
          <!-- :disabled="rowEdit.DescDataType === 'OptionId' && !rowEdit.IsEnd" -->
          <el-switch
            v-model="rowEdit.IsEnd"
            active-text="כן"
            inactive-text="לא"
          >
          </el-switch>
        </div>
        <div class="itemEditisEnd Stat">
          <label>אם פעיל</label>
          <el-switch
            v-model="rowEdit.StatusId"
            active-text="כן"
            inactive-text="לא"
          >
          </el-switch>
        </div>
      </div>
    </div>
    <div class="butonas">
      <el-button
        type="danger"
        class="shmorTO"
        @click="$store.commit('SgorDivos', true)"
        >סגור</el-button
      >
      <el-popconfirm
        confirm-button-text="בסדר"
        cancel-button-text="לא תודה"
        icon="el-icon-info"
        icon-color="red"
        title="אם תשנה כאן זה ישנה את כל האופציות"
        @confirm="
          EditQ();
          $store.commit('SgorDivos', true);
        "
      >
        <el-button
          slot="reference"
          type="success"
          class="sgorTo"
          :loading="LoadingButton"
          v-show="rowEdit.DescDataType === 'OptionId'"
          >שמור</el-button
        >
      </el-popconfirm>
      <el-button
        v-show="rowEdit.DescDataType !== 'OptionId'"
        type="success"
        class="shmorTO"
        @click="
          EditQ();
          $store.commit('SgorDivos', true);
        "
        :loading="LoadingButton"
        >שמור</el-button
      >
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
export default {
  props: ["paramsEdit"],
  data() {
    return {
      LoadingButton: false,
      rowEdit: this.paramsEdit,
      Alldata: {
        Allquestions: [],
        questionsOnly: [],
        DataType: [],
        NameQuen: [],
      },
      showWarningOp: false,
      oldNextQ: "",
    };
  },
  computed: {
    wachtData() {
      return this.$store.state.data;
    },

    data() {
      return this.$store.state.data;
    },
    theOption() {
      return this.$store.state.theOption;
    },
  },
  watch: {
    "rowEdit.IsEnd"(val) {
      if (val) {
        this.rowEdit.NextQuestionDesc = "שאלה אחרונה";
      } else {
        this.rowEdit.NextQuestionDesc = this.oldNextQ;
      }
    },
    "rowEdit.NextQuestionDesc"(val, old) {
      this.oldNextQ = old;
    },
    showWarningOp(val) {
      if (val) {
      }
    },
    wachtData(val) {
      this.data = val;
    },
  },

  mounted() {
    this.Alldata.Allquestions = this.$store.state.AllData.Allquestions;
    this.Alldata.questionsOnly = this.$store.state.AllData.questionsOnly;
    this.Alldata.DataType = this.$store.state.AllData.DataType;
    this.Alldata.NameQuen = this.$store.state.AllData.NameQuen;
    // console.log(this.paramsEdit);
  },

  methods: {
    computedOfisEnd(val) {
      if (val) {
        return "כן";
      } else {
        return "לא";
      }
    },
    computedData(val) {
      //   console.log(val);
      if (val === "Text") {
        return "טקסט";
      } else if (val === "Numeric") {
        return "מספר";
      } else if (val === "OptionId") {
        return "אופציות";
      } else if (val === "Date") {
        return "תאריך";
      }
    },
    REVERScomputedData(val) {
      // console.log(val);
      if (val === "טקסט") {
        return "Text";
      } else if (val === "מספר") {
        return "Numeric";
      } else if (val === "אופציות") {
        return "OptionId";
      } else if (val === "תאריך") {
        return "Date";
      } else {
        return val;
      }
    },
    async EditQ() {
      console.log(this.rowEdit);
      let { data } = await this.$ax.post(URL + "Updata", this.rowEdit);
      console.log(data);
      if (data) {
        this.$message.success("עודכן בהצלחה");
        window.location.reload();
      } else {
        this.$message.error("משהו השתבש אחינו");
        this.LoadingButton = false;
      }
    },
    warnningOp() {
      this.showWarningOp = true;
    },
  },
};
</script>
<style scoped>
.Edito {
  background: rgb(209, 207, 194);
  /* width: 950px; */
  width: 660px;
  left: 300px;
  /* height: 540px; */
  height: 630px;
  /* top: 50px; */
  top: 30px;
  border-radius: 24px;
  padding-bottom: 60px;
}
.inEdito {
  border: 3px solid black;
  width: 540px;
  /* height: 290px; */
  height: 380px;
  border-radius: 20px;
  position: relative;
  left: 70px;
  top: 10px;
  padding: 30px;
  overflow-y: hidden;
  overflow-x: hidden;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}
.w3-input {
  background: none;
  border-bottom: 1px solid rgb(86, 76, 76);
  width: 60%;
}
.inEdito .w3-input {
  width: 170px;
}
.iteminEdit label {
  position: relative;
  left: 110px;
}
.butonas {
  position: relative;
  top: 29px;
  right: 20px;
}
.iteminEditSelct {
  margin-bottom: 80px;
}
.iteminEditSelct label {
  position: relative;
  bottom: 40px;
  left: 150px;
}
.itemEditisEnd label {
  position: relative;
  left: 70px;
  bottom: 30px;
}
.itemEditisEnd {
  position: relative;
  left: 320px;
  bottom: 70px;
}
.itemEditisEnd.Stat {
  position: relative;
  left: 320px;
  bottom: 10px;
}
.iteminEditSelct {
  margin-bottom: 40px;
}
.iteminEditSelct.Last {
  position: absolute;
  bottom: 30px;
  left: 33px;
}
.iteminEditSelct.Last label {
  position: absolute;
  top: -40px;
  left: 77px;
}
.iteminEditSelct:first-child {
  position: relative;
  right: 30px;
}
.allitemsSelect {
  width: 600px;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 30px;
}
.el-dialog {
  z-index: 999999;
}
.sgorTo {
  margin-right: 20px;
}
</style>
