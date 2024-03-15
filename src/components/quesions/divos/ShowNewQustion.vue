<template>
  <div class="newQ">
    <i class="el-icon-close" @click="$store.commit('SgorDivos', true)"></i>
    <div class="innewQ w3-card-4">
      <div class="itemNewQA">
        <label>שם השאלה</label>
        <input
          dir="rtl"
          type="text"
          class="w3-input"
          placeholder="שם השאלה"
          v-model="newQuens.DescQ"
        />
      </div>
      <div class="itemNewQB">
        <label>שם השאלון</label>
        <el-select
          v-model="newQuens.NameQ"
          placeholder="שם השאלון"
          size="small"
        >
          <el-option
            v-for="(s, i) in Alldata.NameQuen"
            :key="i"
            :value="s"
          ></el-option>
        </el-select>
      </div>
      <div class="itemNewQC">
        <label>סוג התשובה</label>
        <el-select
          v-model="newQuens.typeData"
          placeholder="סוג התשובה"
          size="small"
        >
          <el-option
            v-for="(s, i) in Alldata.DataType"
            :key="i"
            :value="s"
            :label="$computedData(s)"
          ></el-option>
        </el-select>
      </div>
      <div class="itemNewQG">
        <label>אם אחרון</label>
        <el-switch
          v-model="newQuens.IsEnd"
          active-text="כן"
          inactive-text="לא"
        ></el-switch>
      </div>
      <div class="itemNewQD">
        <label>אם פעיל</label>
        <el-switch
          v-model="newQuens.StatusId"
          active-text="כן"
          inactive-text="לא"
        ></el-switch>
      </div>
    </div>
    <div class="butonas">
      <el-button
        type="success"
        class="shmorTO"
        @click="InsertQuestion"
        :loading="LoadingButton"
        >שמור</el-button
      >
      <el-button
        type="danger"
        class="sgorTo"
        @click="
          $store.commit('SgorDivos', true);
          ResetAllNewQuan();
        "
        >סגור</el-button
      >
    </div>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
export default {
  data() {
    return {
      LoadingButton: false,
      newQuens: {
        DescQ: "",
        NameQ: "",
        typeData: "",
        IsEnd: false,
        StatusId: true,
      },
      Alldata: {
        Allquestions: [],
        questionsOnly: [],
        DataType: [],
        NameQuen: [],
      },
    };
  },

  mounted() {
    this.Alldata.Allquestions = this.$store.state.AllData.Allquestions;
    this.Alldata.questionsOnly = this.$store.state.AllData.questionsOnly;
    this.Alldata.DataType = this.$store.state.AllData.DataType;
    this.Alldata.NameQuen = this.$store.state.AllData.NameQuen;
  },
  computed: {
    // data: [],
    // AllData: {},
    // theOption: [],
    wachtData() {
      return this.$store.state.data;
    },

    data() {
      return this.$store.state.data;
    },
    AllData() {
      return this.$store.state.AllData;
    },
    theOption() {
      return this.$store.state.theOption;
    },
  },
  watch: {
    wachtData(val) {
      this.data = val;
    },
  },

  methods: {
    async InsertQuestion() {
      // console.log(this.newQuens);
      if (
        this.newQuens.DescQ &&
        this.newQuens.NameQ &&
        this.newQuens.typeData
      ) {
        if (this.newQuens.StatusId) {
          this.newQuens.StatusId = 1;
        } else {
          this.newQuens.StatusId = 0;
        }

        this.LoadingButton = true;
        let { data } = await this.$ax.post(URL + "AddQuestin", this.newQuens);
        this.LoadingButton = false;
        if (data) {
          this.$store.commit("SgorDivos", true);
          this.$message.success("השאלה נוספה בהצלוחה");
          // window.location.reload();
          this.$emit("UpdateData");
        } else {
          this.$message.error("משהו השתבש");
        }
      } else {
        this.$message.error("אחינו מלא את הכל");
      }
    },
    ResetAllNewQuan() {
      this.newQuens.DescQ = "";
      this.newQuens.NameQ = "";
      this.newQuens.typeData = "";
      this.newQuens.IsEnd = false;
      this.newQuens.StatusId = true;
    },
  },
};
</script>
<style scoped lang="scss">
.newQ {
  background: rgba(255, 255, 255, 0.879);
  border: 11px solid rgba(171, 192, 167, 0.645);
  border-radius: 20px;
  height: 520px;
  width: 800px;
  left: 280px;
  top: 60px;
  .butonas {
    position: relative;
    top: 50px;
    right: 26px;
    margin: 10px;
  }
}
.innewQ {
  border: 3px solid black;
  width: 600px;
  /* width: 480px; */
  height: 360px;
  position: relative;
  left: 100px;
  border-radius: 20px;
  top: 40px;
  overflow-y: hidden;
  display: flex;
  flex-direction: row-reverse;

  .itemNewQA {
    position: relative;
    right: 20px;
    top: 20px;
    label {
      position: relative;
      left: 125px;
    }
    .w3-input {
      width: 200px;
      background: none;
    }
  }
  .itemNewQB {
    position: relative;
    right: 130px;
    top: 40px;
  }
  .itemNewQB,
  .itemNewQC {
    label {
      position: relative;
      left: 80px;
      bottom: 20px;
    }
  }
  .itemNewQC {
    position: relative;
    right: -25px;
    top: 160px;
  }
  .itemNewQG {
    position: relative;
    top: 160px;
    left: 440px;
    label {
      position: relative;
      left: 17px;
      bottom: 10px;
    }
  }
  .itemNewQD {
    position: absolute;
    bottom: 60px;
    right: 75px;
    label {
      position: absolute;
      width: 50px;
      bottom: 30px;
      /* right: 31px; */
      right: 16px;
    }
  }
}
.sgorTo {
  margin-right: 10px;
}
</style>
