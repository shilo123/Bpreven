<template>
  <div>
    <div class="Options" v-show="props.row.DescDataType === 'OptionId'">
      <div v-show="theOption.length > 0">
        <label
          :class="{
            DefaultSelectLabel: !wachtStore,
            DefaultSelectLabelBig: wachtStore,
          }"
          >כל האופציות</label
        >

        <el-select
          v-model="DefoltSelsct"
          placeholder="כל השאלות פה"
          :class="{
            DefaultSelect: !wachtStore,
            DefaultSelectBig: wachtStore,
          }"
          @change="SelectFromAll(DefoltSelsct, IdniFtah, props.row)"
        >
          <el-option value="לפי האופציה"></el-option>
          <el-option value="שאלה אחרונה"></el-option>
          <el-option
            v-for="(q, i) in Alldata.questionsOnly"
            :key="i"
            :value="q.Desc"
          ></el-option>
        </el-select>
        <div class="parentsheaderOFAnswers">
          <h1
            :class="{
              headerOFAnswers: !wachtStore,
              headerOFAnswersBig: !!wachtStore,
            }"
          >
            אופציות
          </h1>
        </div>
        <ul class="Answers">
          <draggable
            v-model="theOption"
            @end="EventChangeOption($event, props.row.Id)"
          >
            <li
              v-for="(O, i) in theOption"
              :key="i"
              class="button-and-li"
              :class="{ bigScreenOPtion: wachtStore }"
              :id="O.Id"
            >
              <span>{{ O.Desc }}</span>
              <div class="ParentsAdcen">
                <el-button
                  class="buttonUP"
                  type="primary"
                  size="mini"
                  v-show="O.Id"
                  @click="UpdateOption(O.Id)"
                  >עדכן</el-button
                >
              </div>

              <div class="Del-andComp">
                <div class="indeSel">
                  <el-select
                    v-model="ModelQestions[`op-${O.Id}`]"
                    placeholder="השאלה הבאה"
                    size="medium"
                    @change="
                      changeEventOptions(ModelQestions[`op-${O.Id}`], O.Id)
                    "
                  >
                    <el-option value="ללא שאלה הבאה"></el-option>
                    <el-option
                      v-for="(q, i) in Alldata.questionsOnly"
                      :key="i"
                      :value="q.Desc"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="primary"
                    size="mini"
                    class="buutonOF"
                    :loading="LoadingButton"
                    v-show="OptheOption[`showButton-${O.Id}`]"
                    @click="
                      AddNewQuestion(
                        O.Id,
                        ModelQestions[`op-${O.Id}`],
                        IdniFtah
                      )
                    "
                    >שמור</el-button
                  >
                </div>
                <el-button
                  type="danger"
                  size="mini"
                  @click="DeleteAnswerTHEshows(O.Id)"
                  v-show="O.Id"
                  >מחק</el-button
                >
              </div>
            </li>
          </draggable>
          <el-divider></el-divider>
          <el-button
            :class="{
              buttonSuccessBig: wachtStore,
              buttonSuccess: !wachtStore,
            }"
            type="success"
            @click="
              $emit('newComponent', 'AddAnswer');
              ModelInputDivAnswer = 'AddAnswer';
            "
            >הוספה</el-button
          >
        </ul>
      </div>
      <div v-show="!theOption.length > 0" class="Div-else-show">
        <ul class="Answers">
          <li class="button-and-li EN">
            <span
              contenteditable="true"
              ref="inptutDiv"
              @input="inptutDiv"
            ></span>
            <el-button
              type="success"
              @click="ADDnewtAnswer(props.row.Id, ModelInputDivAnswer)"
              :loading="LoadingButton"
              v-show="ModelInputDivAnswer"
              >הוסף</el-button
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="Date" v-show="props.row.DescDataType === 'Date'">תאריך</div>
    <div class="Text" v-show="props.row.DescDataType === 'Text'">טקסט</div>
    <div class="Numeric" v-show="props.row.DescDataType === 'Numeric'">
      מספר
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },
  props: [
    "props",
    "theOption",
    "IdniFtah",
    "Alldata",
    "ModelQestions",
    "LoadingButton",
    "OptheOption",
  ],
  data() {
    return {
      DefoltSelsct: "",
      inptutDiv: "",
      ModelInputDivAnswer: "",
    };
  },

  mounted() {
    console.log(this.theOption);
  },

  methods: {
    DeleteAnswerTHEshows(id) {
      // console.log(id);
      //   this.$message.success("ds");
      this.$emit("paramsOfDeleteOp", id, this.theOption);
      this.$emit("newComponent", "DeleteAnswer");
    },
    UpdateOption(id) {
      let OptionOfUp = this.theOption.find((e) => e.Id === id);
      console.log(OptionOfUp);
      this.$emit("newComponent", "EditOption");
      this.$emit("ParamsEditOption", OptionOfUp);

      // console.log(OptionOfUp);
      //UpdateOption
    },
    async AddNewQuestion(idOfOption, nextQusions, IdQuestion) {
      this.beforModelQestions = this.ModelQestions;
      let values = Object.values(this.ModelQestions);
      const boolian = values.every((val) => val === values[0]);
      if (boolian) {
        this.DefoltSelsct = values[0];
      } else {
        this.DefoltSelsct = "לפי האופציה";
      }
      const params = { idOfOption, nextQusions, IdQuestion };
      this.LoadingButton = true;

      let { data } = await this.$ax.post(URL + "addNewQustionsId", params);
      this.LoadingButton = false;
      if (data) {
        this.$message.success("השאלה הבאה עודכנה");
      } else {
        this.$message.error("משהו השתבש אחי");
      }
      this.OptheOption[`showButton-${idOfOption}`] = false;
    },
    changeEventOptions(val, id) {
      this.OptheOption[`showButton-${id}`] = true;
      //   console.log(this.ModelQestions);
      //   console.log(val);
      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 0);
    },
    async EventChangeOption(val, id) {
      await this.$nextTick();
      console.log(val.from.children);
      let arr = [];
      Array.from(val.from.children).forEach((item, i) => {
        // console.log(item.id, i + 1);
        arr.push({ id: item.id, newSek: i + 1 });
      });
      console.log(arr);
      let QuestionId = id;
      const params = { arr, QuestionId };
      // console.log(params);
      let { data } = await this.$ax.post(URL + "updateSek", params);
      if (data) {
        this.$message.success("סדר האופציות עודכן בהצלחה");
      } else {
        this.$message.error("משהו השתבש");
      }
    },
    SelectFromAll(val, id, row) {
      if (val !== "לפי אופציה") {
        this.beforModelQestions = this.ModelQestions;
      }
      if (val !== "שאלה אחרונה" && val !== "לפי אופציה") {
        for (const key in this.ModelQestions) {
          if (val !== "לפי האופציה") {
            this.ModelQestions[key] = val;
          }
        }
      }
      if (
        val === "לפי האופציה" &&
        Object.keys(this.beforModelQestions).length !== 0
      ) {
        this.ModelQestions = this.beforModelQestions;
      }
      if (val === "שאלה אחרונה") {
        for (const key in this.ModelQestions) {
          this.ModelQestions[key] = "ללא שאלה הבאה";
        }
      }
      // console.log(this.ModelQestions);

      const IdofQuestions = id;
      console.log(this.ModelQestions);
      for (const key in this.ModelQestions) {
        let idofOpt = key.split("-")[1];
        let valTheOp = this.ModelQestions[key];
        setTimeout(() => {
          this.AddNewQuestion(idofOpt, valTheOp, IdofQuestions);
        }, 500);
      }

      this.LoadingOptionss = false;
      setTimeout(() => {
        this.LoadingOptionss = true;
      }, 100);
    },
    async ADDnewtAnswer(id, text) {
      this.LoadingButton = true;
      if (text) {
        try {
          await this.$ax.post(URL + "AddAnswer", { text, id });
          this.$message.success("התשובה נוספה");
          this.theOption.push({ Desc: text });
          this.shows.showDivos = false;
          // this.RafreseTable();
        } catch (error) {
          this.$message.error("משהו השתבש");
        } finally {
          this.LoadingButton = false;
        }
        console.log(data);
      }
    },
    inptutDiv(e) {
      // console.log(e.target.innerText);
      this.ModelInputDivAnswer = e.target.innerText;
    },
  },
};
</script>
<style scoped>
.parentsheaderOFAnswers {
  background: linear-gradient(
    rgb(255, 251, 184),
    rgb(210, 206, 136),
    rgb(226, 219, 161)
  );
  padding: 30px;
  position: relative;
  top: 11px;
}
.headerOFAnswers {
  text-align: center;
  /* margin-bottom: 20px; */
  /* background: rgb(255, 116, 116); */
  width: 400px;
  margin: 0;
  position: relative;
  left: 32.7%;
  border-radius: 15px;
  color: black;
}
.headerOFAnswersBig {
  position: relative;
  left: 52.3%;
}
.Del-andComp .indeSel {
  position: absolute;
  left: 90px;
  width: 190px;
}
.Del-andComp .indeSel .buutonOF {
  background: rgb(73, 0, 200);
  position: absolute;
  left: -80px;
  top: 5px;
}
.Del-andComp .indeSel .shord {
  position: absolute;
  left: -80px;
  top: 5px;
}
.button-and-li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button-and-li .el-button {
  position: relative;
  /* left: 360px; */
  left: 313px;
  margin-bottom: 20px;
}
.button-and-li .el-button--primary.buttonUP {
  background: rgba(4, 82, 252, 0.822);
}
.button-and-li .el-button--primary:hover {
  background: rgba(4, 83, 252, 0.434);
}
.button-and-li .el-button--danger {
  background: rgba(252, 4, 4, 0.822);
}
.button-and-li .el-button--danger:hover {
  background: rgba(252, 4, 4, 0.327);
}
.button-and-li span {
  flex-grow: 1;
  background: rgb(206, 69, 0);
  flex-basis: 190px; /* רוחב התחלתי */
  max-width: 190px; /* מקסימום רוחב */
  margin-bottom: 20px;
  height: auto;
  color: white;
  position: relative;
  right: 450px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 20px;
  transition: all 0.3s;
}
.button-and-li span:hover {
  background: rgba(206, 69, 0, 0.821);
  cursor: grab;
}
.bigScreenOPtion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  left: 140px;
}
.bigScreenOPtion span {
  position: relative;
  right: 620px;
}

.button-and-li span:active {
  cursor: move;
  background: rgb(255, 0, 0);
}
.Answers {
  /* background: rgba(252, 255, 152, 0.619); */
  background: linear-gradient(
    rgb(255, 251, 184),
    rgb(210, 206, 136),
    rgb(226, 219, 161)
  );
  text-align: center;
  direction: rtl;
  list-style-position: inside;
  padding: 15px;
}
.buttonSuccess:not(.EN .el-button--success) {
  background: rgb(46, 156, 46);
  width: 300px;
  transition: all 0.3s;
  position: relative;
  left: 30px;
}
.buttonSuccess:hover:not(.EN .el-button--success) {
  background: rgba(46, 156, 46, 0.589);
  width: 300px;
  font-size: 18px;
  transition: all 0.3s;
}
.ButtonAndLi {
  display: flex;
}
.Div-else-show {
  text-align: center;
}
.Div-else-show .el-button {
  width: 400px;
  font-size: 20px;
  margin: 50px;
  height: 70px;
}
.Div-else-show .el-button:hover {
  width: 430px;
  font-size: 25px;
  /* margin: 30px; */

  height: 60px;
  color: #000;
}
.EN span {
  margin: 0;
}
.EN .el-button--success {
  width: 200px;
  font-size: 15px;
  height: 3em;
  position: absolute;
  bottom: -11px;
  left: 50px;
  margin-left: 220px;
}
.EN .el-button--success:hover {
  width: 200px;
  font-size: 15px;
  height: 3em;
  color: #34495e;
}
.Date,
.Text,
.Numeric {
  text-align: center;
  font-size: 20px;
  background: rgba(227, 224, 47, 0.615);
  border-radius: 15px;
  padding: 15px;
}
.ButtonAddNewNextQustion {
  width: 130px;
}
.DefaultSelect {
  position: absolute;
  left: 20px;
  z-index: 2;
  top: 60px;
  width: 350px;
  color: blue;
  transition: all 0.3s;
}
.DefaultSelectLabel {
  position: absolute;
  left: 160px;
  z-index: 2;
  top: 30px;
  font-size: 20px;
  transition: all 0.3s;
}
.DefaultSelectBig {
  position: absolute;
  left: 160px;
  z-index: 2;
  top: 80px;
  width: 350px;
  color: blue;
  transition: all 0.3s;
}
.DefaultSelectLabelBig {
  position: absolute;
  left: 300px;
  z-index: 2;
  top: 50px;
  font-size: 20px;
  transition: all 0.3s;
}
.buttonSuccessBig {
  background: rgb(46, 156, 46);
  width: 310px;
  position: relative;
  left: 80px;
  transition: all 0.3s;
}
.buttonSuccessBig:hover {
  background: rgba(46, 156, 46, 0.589);
  width: 310px;
  font-size: 20px;
  transition: all 0.3s;
}
</style>
