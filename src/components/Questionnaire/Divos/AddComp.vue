<template>
  <div>
    <i class="el-icon-close" @click="$emit('sgor')"></i>

    <div class="afterTable w3-card-4">
      <div class="rowA">
        <div class="nameQuest">
          <label>שם שאלון</label>
          <input
            key="input-0"
            type="text"
            class="w3-input"
            dir="auto"
            v-model="newquen.Desc"
            placeholder="שם שאלון"
          />
        </div>
        <div class="symbolQuest">
          <label>סימן</label>
          <input
            key="input-1"
            type="text"
            class="w3-input"
            dir="auto"
            v-model="newquen.Symbol"
            placeholder="שם סימן "
          />
        </div>
        <div class="statusQues">
          <label>סטטוס</label>
          <el-switch
            class="stutus"
            v-model="newquen.StatusId"
            active-text="פעיל"
            inactive-text="לא פעיל"
          ></el-switch>
        </div>
      </div>
      <div class="rowB">
        <div class="Questorind">
          <label>שאלה ראשונית</label>
          <el-input
            key="input-2"
            type="textarea"
            dir="auto"
            :autosize="{ minRows: 2, maxRows: 34 }"
            v-model="newquen.StartQuestion"
            placeholder="שאלה ראשונית "
          >
          </el-input>
        </div>
        <div class="QuestorindEnd">
          <label>משפט סיום</label>
          <el-input
            key="input-2"
            type="textarea"
            dir="auto"
            :autosize="{ minRows: 2, maxRows: 34 }"
            v-model="newquen.EndQuestion"
            placeholder="משפט סיום"
          >
          </el-input>
        </div>
        <div class="MonthyQuen" v-show="newquen.type === 1">
          <label>שאלון יומי</label>
          <el-switch
            v-model="ifYom"
            active-text="כן"
            inactive-text="לא"
          ></el-switch>
        </div>
        <div class="DateQuest" v-show="ifYom">
          <label>בחר תאריך</label>
          <el-date-picker
            v-model="newquen.Date"
            type="date"
            placeholder="בחר תאריך"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="rowC">
        <div class="SwichIfMonthy" v-show="newquen.type === 1">
          <label>שאלון חודשי</label>
          <el-switch
            v-model="Ifmonthil"
            active-text="כן"
            inactive-text="לא"
          ></el-switch>
        </div>
        <div class="defaultQuen" v-show="Ifmonthil">
          <label>חודש</label>
          <input
            placeholder="חודש"
            type="number"
            class="w3-input"
            v-model="newquen.monthi"
          />
        </div>
        <el-select
          placeholder="סוג שאלון"
          :class="{
            ElSELECTZ1: newquen.type === 1,
            ElSELECTZ1S: newquen.type !== 1,
          }"
          v-model="newquen.type"
        >
          <el-option
            v-for="(o, i) in Optoz"
            :key="i"
            :label="o.Name"
            :value="o.Id"
          ></el-option>
        </el-select>
      </div>
      <div class="rowD">
        <div class="swichIfMonchly" v-show="newquen.type === 1">
          <label>ערך דפולטיבי</label>
          <el-switch
            v-model="ifDefault"
            active-text="כן"
            inactive-text="לא"
          ></el-switch>
        </div>
        <div class="Default" v-show="ifDefault">
          <label>ערך דפולטיבי</label>
          <input
            type="text"
            class="w3-input Inptutozy"
            v-model="newquen.default"
          />
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button
        type="success"
        class="ButtonNext"
        @click="Inserquen"
        :loading="loadingButton"
        ref="buttonNext"
        >צור</el-button
      >
      <el-button type="danger" class="ButtonNext" @click="$emit('sgor')"
        >סגור</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenAddComp",

  data() {
    return {
      newquen: {
        Desc: "",
        Symbol: "",
        StartQuestion: "",
        StatusId: true,
        Date: "",
        default: "",
        monthi: "",
        type: 1,
      },
      Ifmonthil: false,
      ifDefault: false,
      ifYom: false,

      loadingButton: false,
    };
  },

  mounted() {},
  computed: {
    Optoz() {
      return this.$store.state.Questionaire.Optoz.data;
    },
    LastId() {
      return this.$store.getters["Questionaire/LastId"];
    },
  },

  watch: {
    ifYom(val) {
      //newquen.Date
      if (val) {
        this.Ifmonthil = false;
        this.ifDefault = false;
        this.newquen.default = null;
        this.newquen.monthi = null;
      }
    },
    Ifmonthil(val) {
      //newquen.monthi
      if (val) {
        this.ifYom = false;
        this.ifDefault = false;
        this.newquen.Date = null;
        this.newquen.default = null;
      }
    },
    ifDefault(val) {
      //newquen.default
      if (val) {
        this.ifYom = false;
        this.Ifmonthil = false;
        this.newquen.Date = null;
        this.newquen.monthi = null;
      }
    },
  },
  methods: {
    async Inserquen() {
      try {
        this.loadingButton = true;
        if (true) {
          //   console.log("Befor", this.newquen);
          let { data } = await this.$ax.post(URL + "newequen", this.newquen);
          if (data) {
            this.$message.success("נוסף בהצלחה");
            // location.reload();
            // this.data.push();
            // console.log(newId);
            // console.log(this.LastId);
            // this.$store.commit("Questionaire/pushItemData", {
            //   ...this.newquen,
            //   Id: this.LastId,
            // });
            await this.$store.dispatch("Questionaire/GetDatas");

            this.$emit("sgor");
            this.$emit("SortTable");
          } else {
            this.$message.error("משהו השתבש");
            this.loadingButton = false;
          }
        } else {
          // if (this.ifYom) {
          //   this.$message.error("מלא תאריך אחינו");
          // } else if (this.newquen.monthi) {
          //   this.$message.error("מלא חודש");
          // } else if (!this.newquen.Desc) {
          //   this.$message.error("מלא שם");
          // } else if (!this.ifYom && !this.newquen.monthi) {
          //   this.$message.error("בחר תאריך יומי או חודשי");
          // }
          // this.loadingButton = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingButton = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.afterTable {
  position: relative;
  /* top: 10px; */
  border: 3px solid black;
  padding: 25px;
  padding-top: 10px;
  padding-bottom: 40px;
  height: 450px;
  border-radius: 10px;
  overflow-y: hidden;
  overflow-x: hidden;
  label {
    float: right;
    margin: 10px;
  }
  .w3-input {
    margin-bottom: 10px;
    text-align: right;
    &::placeholder {
      text-align: right;
      color: rgba(152, 132, 132, 0.771);
    }
  }

  .rowA {
    display: flex;
    flex-direction: row-reverse;
    margin: 15px;
    .symbolQuest {
      margin-right: 40px;
    }
    .statusQues {
      label {
        position: absolute;
      }
      .stutus {
        position: relative;
        right: 45px;
        top: 50px;
      }
    }
  }
  .rowB {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    right: 0;
    margin: 35px;
    .MonthyQuen {
      margin: 13px;
      position: relative;
      right: 380px;
      //   right: 54px;
      top: 0px;

      position: absolute;

      label {
        position: absolute;
        top: -40px;
        right: -10px;
      }
    }

    .DateQuest {
      position: absolute;
      top: 10px;
      left: -430px;
      label {
        position: absolute;
        top: -40px;
        text-align: right;
        right: 0;
      }
    }
    .Questorind {
      position: relative;
      bottom: 50px;
      &End {
        position: absolute;
        bottom: -50px;
      }
    }
  }
  .rowC {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    right: -80px;
    margin: 35px;
    top: 150px;
    .defaultQuen {
      width: 140px;
      position: absolute;
      top: 20px;
      left: -730px;
    }
    .ElSELECTZ1 {
      position: absolute;
      left: -260px;
      bottom: -190px;
      &S {
        position: absolute;
        left: -340px;
        bottom: -210px;
      }
    }
    .SwichIfMonthy {
      position: relative;
      right: 470px;
      top: 70px;
      label {
        position: absolute;
        top: -40px;
        left: 0px !important;
        width: 100%;
      }
    }
  }
  .rowD {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    right: 350px;
    margin: 35px;
    top: 310px;
    .Default {
      position: absolute;
      left: -330px;
      width: 200px;
      top: -60px;
    }
    .swichIfMonchly {
      position: relative;
      right: 40px;
      top: -10px;
      label {
        position: absolute;
        top: -40px;
        left: -5px;
        width: 110px;
        display: inline-block;
      }
    }
  }
}
.ButtonNext {
  float: right;
  margin: 5px;
  width: 150px;
  box-shadow: 0 0 7px 2px rgb(136, 123, 123);
  &:hover {
    box-shadow: 0 0 2px 0;
  }
}

// .Inptutozy {
//   width: 140px;
// }

.buttons {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>
