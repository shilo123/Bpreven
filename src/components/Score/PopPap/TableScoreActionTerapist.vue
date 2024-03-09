<template>
  <div>
    <div class="HazeLemaala" dir="rtl" v-if="ComplitedData">
      <el-select
        v-model="MaLehosif"
        placeholder="בחר מה להוסיף"
        class="SelectFilter"
      >
        <el-option label="תרגילים" :value="0"></el-option>
        <el-option label="הודעות" :value="1"></el-option>
        <el-option label="פיצ'רים" :value="2"></el-option>
      </el-select>
      <el-select v-model="AddMashehu" placeholder="הוסף" class="Addd">
        <el-option
          v-for="(ac, i) in activedArr"
          :key="i"
          :label="`${ac.Desc}/${ac.Symbol}`"
          :value="ac.value"
        ></el-option>
      </el-select>
      <el-button
        type="success"
        size="medium"
        class="ButtonADD"
        @click="AddInyon(ScoreId, ScoreTerapist, MaLehosif, AddMashehu)"
        >הוסף</el-button
      >
    </div>
    <el-table
      :data="dataTable"
      dir="rtl"
      class="Table"
      height="70%"
      border
      v-if="ComplitedData"
      :row-style="getRowStyle"
      empty-text="אין כאן כלום עדיין זה הזמן להוסיף"
    >
      <el-table-column
        label="תרגילים"
        align="center"
        prop="ExercisesT"
      ></el-table-column>
      <el-table-column
        label="הודעות"
        align="center"
        prop="DescMes"
      ></el-table-column>
      <el-table-column
        label="פיצ'רים"
        align="center"
        prop="DescFeacher"
      ></el-table-column>
      <el-table-column label="מחיקה" align="center">
        <template v-slot:default="scope">
          <el-popover
            placement="top"
            width="160"
            v-model="visible[`Modeloz-${scope.$index}`]"
          >
            <p style="text-align: center; font-size: 17px">מה תרצה למחוק?</p>
            <div class="ParentsButonsDelte">
              <el-button
                v-show="scope.row.ExercisesT"
                type="success"
                size="mini"
                class="Zuz"
                @click="
                  DeleteActionScore(
                    ScoreId,
                    ScoreTerapist,
                    scope.row,
                    'ExercisesId',
                    'ExercisesT'
                  )
                "
                >תרגיל</el-button
              >
              <el-button
                v-show="scope.row.DescFeacher"
                type="success"
                size="mini"
                @click="
                  DeleteActionScore(
                    ScoreId,
                    ScoreTerapist,
                    scope.row,
                    'FeaturesId',
                    'DescFeacher'
                  )
                "
                >פיצ'ר</el-button
              >
              <el-button
                v-show="scope.row.DescMes"
                type="success"
                size="mini"
                @click="
                  DeleteActionScore(
                    ScoreId,
                    ScoreTerapist,
                    scope.row,
                    'MessagesId',
                    'DescMes'
                  )
                "
                >הודעה</el-button
              >
            </div>
            <el-button type="danger" size="mini" slot="reference">
              <i class="fa-solid fa-trash-check"></i>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenTableScoreActionTerapist",
  props: ["ScoreId", "ScoreTerapist"],
  data() {
    return {
      ComplitedData: false,
      MaLehosif: 0,
      AddMashehu: "",
      data: [],
      dataTable: [],
      visible: {},
    };
  },
  computed: {
    activedArr() {
      return this.data
        .map((e) => {
          if (this.MaLehosif === 0) {
            return { Desc: e.DescEx, Symbol: e.SymbolEx, value: e.valEx };
          }
          if (this.MaLehosif === 1) {
            return { Desc: e.DescMe, Symbol: e.SymbolMe, value: e.valMe };
          }
          if (this.MaLehosif === 2) {
            return { Desc: e.DescFe, Symbol: e.SymbolFe, value: e.valFe };
          }
        })
        .filter(
          (el, i, arr) =>
            el.Desc &&
            el.Symbol &&
            arr.findIndex(
              (e) => e.Desc === el.Desc && e.Symbol === el.Symbol
            ) === i
        );
    },
  },
  watch: {
    MaLehosif(val) {
      this.AddMashehu = "";
    },
    AddMashehu(val) {
      console.log(val);
    },
  },
  async mounted() {
    // setTimeout(() => {
    //   console.log(this.activedArr);
    // }, 2000); // console.log({ ScoreId: this.ScoreId, ScoreTerapist: this.ScoreTerapist });
    const URI = `${URL}${"GetScoreActionFromTerapist"}/${this.ScoreId}/${
      this.ScoreTerapist
    }`;
    let { data } = await this.$ax.get(URI);
    // console.log(data);
    if (data) {
      this.data = data.dataSheen;
      // this.dataTable = data.dataSheyesh;
      this.dataTable = data.dataSheyesh.map((e) => {
        return {
          ExercisesT: e.DescEx,
          DescFeacher: e.DescFe,
          DescMes: e.DescMe,
        };
      });
      //
      //
      //
      //
      //
      let Newdata = [];
      let exercisesTSet = new Set(
        this.dataTable
          .map((item) => item.ExercisesT)
          .filter((item) => item !== null)
      );
      let descFeacherSet = new Set(
        this.dataTable
          .map((item) => item.DescFeacher)
          .filter((item) => item !== null)
      );
      let descMesSet = new Set(
        this.dataTable
          .map((item) => item.DescMes)
          .filter((item) => item !== null)
      );
      for (
        let i = 0;
        i < Math.max(exercisesTSet.size, descFeacherSet.size, descMesSet.size);
        i++
      ) {
        Newdata.push({
          ExercisesT: Array.from(exercisesTSet)[i] || null,
          DescFeacher: Array.from(descFeacherSet)[i] || null,
          DescMes: Array.from(descMesSet)[i] || null,
        });
      }
      // console.log("Newdata", Newdata);
      this.dataTable = Newdata;
      //
      //
      this.ComplitedData = true;
    } else {
      this.$message.error("משהו השתבשש");
    }
    // console.log(data);
  },

  methods: {
    async AddInyon(ScoreId, ScoreTerapist, Ma, val) {
      if (val) {
        const params = { ScoreTerapist, ScoreId, Ma, val };
        let response = await this.$ax.post(
          URL + "AddScoreActionTerapist",
          params
        );
        if (response.data) {
          ////////////////////////////////
          this.SortedData();
        } else {
          this.$message.error("משהו השתבש");
        }
      } else {
        this.$message.error("תבחר משהו");
      }
    },
    async DeleteActionScore(ScoreId, ScoreTerapist, row, column, TheSyntax) {
      const params = {
        ScoreId,
        ScoreTerapist,
        stringos: row[TheSyntax],
        column,
      };
      let res = await this.$ax.post(URL + "DeleteScoreActionTerapist", params);
      this.$Bool(res.data, "נמחק בהצלחה", "משהו השתבש", false);
      //
      //
      //
      this.SortedData();
    },
    async SortedData() {
      const URI = `${URL}${"GetScoreActionFromTerapist"}/${this.ScoreId}/${
        this.ScoreTerapist
      }`;
      let { data } = await this.$ax.get(URI);
      // console.log(data);
      if (data) {
        this.data = data.dataSheen;
        // this.dataTable = data.dataSheyesh;
        this.dataTable = data.dataSheyesh.map((e) => {
          return {
            ExercisesT: e.DescEx,
            DescFeacher: e.DescFe,
            DescMes: e.DescMe,
          };
        });
      }
      let Newdata = [];
      let exercisesTSet = new Set(
        this.dataTable
          .map((item) => item.ExercisesT)
          .filter((item) => item !== null)
      );
      let descFeacherSet = new Set(
        this.dataTable
          .map((item) => item.DescFeacher)
          .filter((item) => item !== null)
      );
      let descMesSet = new Set(
        this.dataTable
          .map((item) => item.DescMes)
          .filter((item) => item !== null)
      );
      for (
        let i = 0;
        i < Math.max(exercisesTSet.size, descFeacherSet.size, descMesSet.size);
        i++
      ) {
        Newdata.push({
          ExercisesT: Array.from(exercisesTSet)[i] || null,
          DescFeacher: Array.from(descFeacherSet)[i] || null,
          DescMes: Array.from(descMesSet)[i] || null,
        });
      }
      // console.log("Newdata", Newdata);
      this.dataTable = Newdata;
      this.AddMashehu = "";
      this.visible = {};
    },
    getRowStyle({ row, rowIndex }) {
      return { backgroundColor: "#3300ff3a" }; // כל השורות יקבלו צבע רקע אדום
    },
  },
};
</script>

<style lang="scss" scoped>
.HazeLemaala {
  // background: #3300ff3a;
  width: 70%;
  height: 5em;
  position: absolute;
  top: 0;
  left: 8%;
  border: 3px solid black;
  border-radius: 20px;
  padding: 5px;
  background: rgba(148, 48, 255, 0.377);
  .SelectFilter {
    margin-top: 10px;
    position: absolute;
    right: 10%;
  }
  .Addd {
    margin-top: 10px;
    position: absolute;
    left: 30%;
  }
  .ButtonADD {
    margin-top: 10px;
    position: absolute;
    left: 10%;
  }
}
.Table {
  position: absolute;
  left: 7%;
  top: 17%;
  width: 71%;
  border-radius: 10px;
}
.ParentsButonsDelte {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  .el-button {
    margin-bottom: 8px;
    width: 90%;
    position: relative;
    right: 4px;
  }
  .Zuz {
    margin-left: 9px;
  }
}
</style>
