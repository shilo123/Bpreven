<template>
  <div>
    <i class="el-icon-close" @click="$emit('sgor')"></i>
    <div class="inEditQuen w3-card-4">
      <div class="rowEA">
        <div class="newName">
          <label>שם חדש</label>
          <input
            type="text"
            class="w3-input"
            v-model="newqunto.Desc"
            dir="rtl"
          />
        </div>
        <div class="newSymbol">
          <label class="labelBayaB">סימן חדש</label>
          <input
            type="text"
            class="w3-input"
            dir="rtl"
            v-model="newqunto.Symbol"
          />
        </div>
        <div class="newStat">
          <label>סטטוס חדש</label>
          <el-switch
            v-model="newqunto.StatusId"
            active-text="פעיל"
            inactive-text="לא פעיל"
          ></el-switch>
        </div>
      </div>
      <div class="rowEB">
        <div class="startQuesh">
          <label>שאלה ראשונית חדשה</label>
          <el-input
            placeholder="שאלה ראשונית חדשה"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            class="inputTextarea"
            dir="rtl"
            v-model="newqunto.StartQuestion"
          />
        </div>
        <div class="startQueshEnd">
          <label>משפט סיום</label>
          <el-input
            placeholder="שאלה אחרונה חדשה"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            class="inputTextarea"
            dir="rtl"
            v-model="newqunto.EndQuestion"
          />
        </div>
        <div class="ifMonthio" v-show="newqunto.QuestionnaireTypesId === 1">
          <label>אם שאלון יומי</label>
          <el-switch
            v-model="IfYomy"
            active-text="כן"
            inactive-text="לא"
          ></el-switch>
        </div>
        <div
          class="Date"
          v-show="IfYomy && newqunto.QuestionnaireTypesId === 1"
        >
          <label>תאריך יומי</label>
          <el-date-picker
            v-if="RafreshOtam"
            v-model="newqunto.Dayly"
            placeholder="תאריך חדש"
          ></el-date-picker>
        </div>
      </div>
      <div class="rowEC">
        <div class="QTYpe">
          <label class="Lablel">סוג שאלון</label>
          <el-select
            placeholder="סוג שאלון"
            class="ElSELECTZ"
            v-model="newqunto.QuestionnaireTypesId"
          >
            <el-option
              v-for="(o, i) in Optoz"
              :key="i"
              :label="o.Name"
              :value="o.Id"
            ></el-option>
          </el-select>
        </div>
        <div class="ifMonthi" v-show="newqunto.QuestionnaireTypesId === 1">
          <label>אם שאלון חודשי</label>
          <el-switch
            v-model="MonthiVal"
            active-text="כן"
            inactive-text="לא"
          ></el-switch>
        </div>
        <div
          class="Number"
          v-show="MonthiVal && newqunto.QuestionnaireTypesId === 1"
          v-if="RafreshOtam"
        >
          <label>חודש</label>
          <el-input
            size="medium"
            placeholder="מספר"
            v-model="newqunto.Monthly"
            dir="rtl"
          ></el-input>
        </div>

        <div class="rowED">
          <div class="SwitchDefaultId" v-if="RafreshOtam">
            <label>דפולט</label>
            <el-switch
              v-show="newqunto.QuestionnaireTypesId === 1"
              v-model="IFdefaultE"
              active-text="כן"
              inactive-text="לא"
            ></el-switch>
          </div>
        </div>
        <div
          class="DefaultId"
          v-show="IFdefaultE && newqunto.QuestionnaireTypesId === 1"
        >
          <label>דפולט</label>
          <el-input
            size="medium"
            placeholder="מספר"
            v-model="newqunto.DefaultId"
            dir="rtl"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="bottonsInD">
      <el-button
        type="primary"
        class="shmorTO"
        @click="EditQuen"
        :loading="loadingButton"
        >שמור</el-button
      >
      <el-button type="danger" class="sgorTo" @click="$emit('sgor')"
        >סגור</el-button
      >
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenUpdateComp",
  props: ["paramsOfComp"],
  data() {
    return {
      RafreshOtam: true,
      paramsOfCompp: this.paramsOfComp,
      loadingButton: false,
      newqunto: this.paramsOfComp.paramsModel,
      IfYomy: Boolean(
        this.paramsOfComp.paramsModel.Dayly ||
          this.paramsOfComp.paramsModel.Date
      ),
      IFdefaultE: Boolean(
        this.paramsOfComp.paramsModel.DefaultId ||
          this.paramsOfComp.paramsModel.default
      ),
      MonthiVal: Boolean(
        this.paramsOfComp.paramsModel.Monthly ||
          this.paramsOfComp.paramsModel.monthi
      ),
      WachDate: true,
      DateZ: "",
    };
  },

  mounted() {
    // console.log(this.paramsOfComp);
    if (this.paramsOfCompp.paramsModel.Date) {
      this.newqunto.Dayly = this.paramsOfCompp.paramsModel.Date;
    }
    if (this.paramsOfCompp.paramsModel.default) {
      this.newqunto.DefaultId = this.paramsOfCompp.paramsModel.default;
    }
    if (this.paramsOfCompp.paramsModel.monthi) {
      this.newqunto.Monthly = this.paramsOfCompp.paramsModel.monthi;
    }

    this.RafreshOtam = false;
    setTimeout(() => {
      this.RafreshOtam = true;
    }, 100);
    // console.log([
    //   this.paramsOfCompp.paramsModel.Date,
    //   this.paramsOfCompp.paramsModel.default,
    //   this.paramsOfCompp.paramsModel.monthi,
    // ]);
  },
  computed: {
    Optoz() {
      return this.$store.state.Questionaire.Optoz.data;
    },
  },
  watch: {
    IfYomy(val) {
      //newqunto.Dayly
      if (val) {
        this.MonthiVal = false;
        this.IFdefaultE = false;
        this.newqunto.Monthly = null;
        this.newqunto.DefaultId = null;
      }
    },
    MonthiVal(val) {
      //newqunto.Monthly
      if (val) {
        this.IfYomy = false;
        this.IFdefaultE = false;
        this.newqunto.Dayly = null;
        this.newqunto.DefaultId = null;
      }
    },
    IFdefaultE(val) {
      //newqunto.DefaultId
      if (val) {
        this.IfYomy = false;
        this.MonthiVal = false;
        this.newqunto.Dayly = null;
        this.newqunto.Monthly = null;
      }
    },
    "newqunto.Dayly"(val, Old) {
      //   console.log(Boolean(Old));
      //   console.log("val", val);
      if (Old) {
        let date = new Date(val);
        date.setDate(date.getDate() + 1);
        this.DateZ = date;
      } else {
        this.DateZ = val;
      }
    },
  },
  methods: {
    async EditQuen() {
      const Booleano = true || (true && true); //
      if (Booleano) {
        let AddYom;
        if (this.WachDate) {
          AddYom = true;
        } else {
          AddYom = false;
        }
        console.log(this.newqunto.Dayly);
        if (this.IfYomy) {
          if (this.DateZ) {
            //   this.newqunto.Dayly = this.DateZ;
          } else {
            this.newqunto.Dayly = new Date(this.newqunto.Dayly);
            this.newqunto.Dayly.setDate(this.newqunto.Dayly.getDate() - 1);
            this.newqunto.Dayly = this.newqunto.Dayly.toISOString();
          }
        }
        console.log(this.newqunto.Dayly);
        this.newqunto.AddYom = AddYom;
        this.loadingButton = true;
        if (this.newqunto.QuestionnaireTypesId !== 1) {
          this.newqunto.Dayly = null;
          this.newqunto.Monthly = null;
          this.newqunto.DefaultId = null;
        }
        let { data } = await this.$ax.post(URL + "EditOfquen", this.newqunto);
        if (data) {
          this.$message.success("עודכן בהצלחה");
          await this.$store.dispatch("Questionaire/GetDatas");
          this.$emit("sgor");
          this.loadingButton = false;
        } else {
          this.$message.error("משהו השתבש");
          this.loadingButton = false;
        }
      } else {
        if (this.IfYomy) {
          this.$message.error("כתוב תאריך");
        } else if (this.MonthiVal) {
          this.$message.error("כתוב חודש");
        } else if (this.IFdefaultE) {
          this.$message.error("הוסף ערך");
        } else if (
          !this.IFdefaultE &&
          !this.MonthiVal &&
          !this.IfYomy &&
          this.newqunto.QuestionnaireTypesId === 1
        ) {
          this.$message.error("בחר יומי או חודשי או דפולטיבי");
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.inEditQuen {
  border: 3px solid black;
  height: 400px;
  width: 90%;
  display: block;
  /* margin: 30px; */
  margin: 40px;
  border-radius: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  .ElSELECTZ {
    position: absolute;
    width: 220px;
    right: 110px;
    bottom: 130px;
  }
  .Lablel {
    position: absolute;
    width: 220px;
    left: 88% !important;
    bottom: -175px;
  }
  .w3-input {
    width: 220px;
    background: none;
    border-color: black;
  }
  label {
    &:not(.labelBaya, .labelBayaB) {
      position: relative;
      left: 170px;
    }
  }
  .el-row {
    position: relative;
    left: 50px;
    margin-bottom: 40px;
  }
  .labelBaya {
    position: relative;
    left: 90px;
    margin-bottom: 8px;
  }
  .labelBayaB {
    position: relative;
    left: 150px;
  }
  .inputTextarea {
    position: relative;
    top: 25px;
    width: 280px;
  }
  .rowEA {
    display: flex;
    flex-direction: row-reverse;
    margin: 25px;
    position: relative;
    .newSymbol {
      margin-right: 60px;
    }
    .newStat {
      // margin-right: 140px;
      margin-right: 60px;
      position: relative;
      top: 25px;
      label {
        position: absolute;
        top: -30px;
        width: 150px;
        left: 40px;
      }
    }
  }
  .rowEB {
    display: flex;
    flex-direction: row-reverse;
    margin: 25px;
    position: absolute;
    right: 70px;
    .Date {
      position: relative;
      top: 20px;
      left: -160px;
      .el-input {
        position: relative;
        left: 20px;
      }
      label {
        position: absolute !important;
        top: -27px;
        right: -60px !important;
      }
    }

    .ifMonthio {
      position: relative;
      right: 70px;
      top: 30px;
      transition: all 0.3s;
      label {
        position: absolute;
        top: -30px;
        left: 10px;
        width: 120px;
      }
    }

    .startQuesh {
      position: relative;
      bottom: 30px;
      label {
        position: absolute;
        top: -7px;
        width: 150px;
        left: 52% !important;
      }

      &End {
        position: absolute;
        bottom: -60px;
        label {
          //   position: absolute;
          //   top: -10px;
          //   width: 150px;
          //   background: #000;
          //   left: 79% !important;
          position: absolute;
          top: -7px;
          width: 150px;
          left: 72% !important;
        }
      }
    }
  }
  .rowEC {
  }

  .rowED {
    // display: flex;
    // flex-direction: row-reverse;
    // margin: 25px;
    // position: absolute;
    // right: 450px;
    // top: 0px;
  }
}
.ifMonthi {
  position: relative;
  right: -330px;
  top: 110px;
  width: 300px;
  label {
    position: absolute;
    top: -30px;
    left: 90px !important;
  }
}

.bottonsInD {
  position: relative;
  right: 20px;
}

.Number {
  position: absolute;
  left: 190px;
  bottom: 210px;
  //   right: 330px;
  //   bottom: 50px;
  label {
    font-size: 16px;
    position: absolute !important;
    right: -60px !important;
    top: -24px !important;
  }
}
.SwitchDefaultId {
  position: absolute;
  left: 437px;
  bottom: 140px;
  label {
    position: absolute;
    top: -30px;
    left: 68px !important;
  }
}
.DefaultId {
  position: absolute;
  left: 202px;
  bottom: 130px;
  width: 210px;
}
</style>
