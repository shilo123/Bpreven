<template>
  <div dir="rtl">
    <div class="divos" v-if="showDivos">
      <transition appear name="expand">
        <div class="indivos">
          <div class="hazeShebatzad">
            <p class="group">ציון מטפל</p>
            <el-input
              v-model="Score"
              placeholder="הזן ציון"
              :disabled="SaveScoreMetape"
              :class="{ DisabledClass: SaveScoreMetape }"
            ></el-input>
            <el-button
              type="success"
              size="small"
              v-show="Score"
              @click="SaveTerapist()"
              v-if="!SaveScoreMetape"
              >שמור</el-button
            >
            <el-button
              type="primary"
              v-if="SaveScoreMetape"
              size="small"
              @click="SaveScoreMetape = false"
              >החלף ציון</el-button
            >
            <div v-if="SaveScoreMetape">
              <p class="group">ציון מטופל</p>
              <el-select v-model="ScoreMetupal" placeholder="בחר ציון מטופל">
                <el-option-group
                  v-for="(group, i) in groups"
                  :key="i"
                  :label="group.NameQ"
                >
                  <el-option
                    v-for="(Q, i) in objData[`Group-${group.QuId}`]"
                    :key="i"
                    :value="Q.Id"
                    :label="Q.QuestionnaireScore"
                  ></el-option>
                </el-option-group>
              </el-select>
              <el-button
                type="primary"
                size="small"
                class="HosefInyonim"
                :class="{ redyEdit: redyEdit }"
                v-if="ScoreMetupal"
                @click="redyEdit = true"
                >הוסף עיניינים</el-button
              >
            </div>
            <p class="group" style="margin-top: 20px" v-if="SaveScoreMetape">
              מחיקה
            </p>
            <el-popconfirm
              dir="rtl"
              confirm-button-text="כן"
              cancel-button-text="לא, תודה"
              icon="el-icon-info"
              icon-color="red"
              title="?בטוח שאתה רוצה למחוק"
              @confirm="DeleteScore(Score, activQushinnare, arrIDS)"
            >
              <el-button
                v-if="SaveScoreMetape"
                type="danger"
                size="medium"
                slot="reference"
                class="ButtonDelete"
                :disabled="Ifinyonim"
                :title="Ifinyonim ? 'לא ניתן למחוק משום שיש עינייונים' : 'מחק'"
                >מחק ציון</el-button
              >
            </el-popconfirm>
            <el-button type="danger" class="ButtonBack" @click="$emit('Sgor')"
              >סגור</el-button
            >
          </div>
          <Table
            :ScoreId="ScoreMetupal"
            :ScoreTerapist="ScoreId"
            v-if="ScoreId && ScoreMetupal && redyEdit"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import Table from "@/components/Score/PopPap/TableScoreActionTerapist.vue";
export default {
  name: "BprevenPopPapMetapel",
  components: { Table },
  props: ["activQushinnare", "arrIDS"],
  data() {
    return {
      showDivos: false,
      SaveScoreMetape: false,
      redyEdit: false,
      Ifinyonim: false,
      Score: "",
      ScoreMetupal: "",
      ScoreId: "",
      groups: [],
      objData: {},
    };
  },
  watch: {
    ScoreMetupal() {
      this.redyEdit = false;
      // console.log(this.ScoreMetupal);
    },
    async redyEdit(val) {
      if (val) {
        let { data } = await this.$ax.get(URL + "GetIdForScore/" + this.Score);
        // console.log(data);
        this.ScoreId = data;
      }
    },
  },
  async mounted() {
    let result = await this.$ax.post(URL + "IfScoreMeTapel", {
      arrIds: this.arrIDS,
    });
    // console.log(result.data);
    this.SaveScoreMetape = result.data.Bool;
    this.Score = result.data.score;
    this.Ifinyonim = result.data.Ifinyonim;
    this.showDivos = true;
    let { data } = await this.$ax.get(URL + "GetAllScore");
    const Groups = data
      .map((e) => ({ NameQ: e.NameQ, QuId: e.QuId }))
      .filter((el, i, arr) => arr.findIndex((e) => e.QuId === el.QuId) === i);
    this.groups = Groups;
    let objData = {};
    Groups.forEach((e) => {
      objData[`Group-${e.QuId}`] = [];
    });
    data.forEach((e) => {
      objData[`Group-${e.QuId}`].push(e);
    });
    this.objData = objData;
  },

  methods: {
    async SaveTerapist() {
      // console.log(this.activQushinnare);
      let { data } = await this.$ax.post(URL + "AddScore", {
        Score: this.Score,
        arrIds: this.arrIDS,
        Qushinnare: this.activQushinnare,
      });
      if (data) {
        this.Ifinyonim = true;
      }
      // console.log(this.arrIDS);
      this.SaveScoreMetape = data;
    },
    async DeleteScore(Score, activQushinnare, arrIDS) {
      const params = {
        Score: Score,
        Qushinnare: activQushinnare,
        arrIds: arrIDS.split(","),
      };
      let { data } = await this.$ax.post(URL + "deleteScore", params);
      this.$Bool(data, "נמחק בהצלחה", "משהו השתבש", true);
      // console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.indivos {
  background: #ffffffc0;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  .hazeShebatzad {
    display: flex;
    flex-direction: column;
    border-left: 3px solid black;
    width: 15%;
    height: 100%;
    position: relative;
    .group {
      font-size: 13px;
      text-align: center;
    }
    .ButtonBack {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .icon {
      position: relative;
      top: 10px;
      right: 20px;
      margin: 10px 0;
    }
    .DisabledClass {
      background: #000;
    }
    .HosefInyonim {
      margin-top: 15px;
      background: #5b5bff;
      width: 100%;
    }
    .redyEdit.HosefInyonim {
      border: 3px solid black;
    }
    .ButtonDelete {
      width: 100%;
    }
  }
}
</style>
