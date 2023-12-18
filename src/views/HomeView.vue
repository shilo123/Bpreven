<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
    "
    ref="Divos"
  >
    <div class="DivShelhalemaala"></div>
    <div class="HazeSham">
      <div class="Allmenu">
        <div>
          <el-row class="row">
            <el-col :span="24">שאלונים</el-col>
          </el-row>
        </div>
        <div v-for="n in 26" :key="n">
          <el-row class="row">
            <el-col :span="24">{{ `item-${n}` }}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-input v-model="serch" :placeholder="pleace" class="input">
      <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input
    ><el-select v-model="selcto" placeholder="חפש לפי.." class="selectA">
      <el-option
        v-for="(d, i) in Allamudot"
        :key="i"
        :value="d"
        v-show="d !== 'Id'"
      ></el-option>
    </el-select>
    <el-table :data="data" class="table" stripe>
      <el-table-column label="Desc" prop="Desc"></el-table-column>
      <el-table-column label="Symbol" prop="Symbol"></el-table-column>
      <el-table-column
        label="StartQuestion"
        prop="StartQuestion"
      ></el-table-column>
      <el-table-column label="StatusId" prop="StatusId"></el-table-column>
      <el-table-column label="אפשרויות">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="Edit(scope.row)"
            ><i class="el-icon-edit"></i> עריכה</el-button
          >
          <el-button type="danger" size="mini" @click="DELETE(scope.row)"
            ><i class="el-icon-delete"></i> מחיקה</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { URL } from "@/URL/url";
export default {
  data() {
    return {
      data: [],
      data2: [],
      serch: "",
      loading: true,
      selcto: "Desc",
      Allamudot: [],
    };
  },
  watch: {
    serch(val) {
      this.data = this.data.filter((e) => {
        console.log(e);
        // console.log(e[this.selcto]);
        if (e[this.selcto]) {
          return e[this.selcto].includes(val);
        } else {
          return false;
        }
      });
      if (val === "") {
        this.data = this.data2;
      }
    },
  },
  computed: {
    pleace() {
      return `סנן לפי ${this.selcto}...`;
    },
  },
  async mounted() {
    let result = await this.$ax.get(URL);
    this.data = result.data;
    this.data2 = result.data;
    console.log(this.data);
    let { data } = await this.$ax(URL + "Getamudes");
    // console.log(data);
    this.Allamudot = data;
    this.loading = false;
    let el = this.$refs.Divos;
    el.style.zIndex = "";
    console.log(el);
    // this.$refs.Divos.style.position = "relative";
  },

  methods: {
    Edit(row) {
      console.log(row);
    },
    DELETE(row) {
      console.log(row);
    },
  },
};
</script>
<style scoped>
.HazeSham {
  background: rgb(183, 173, 120);
  width: 200px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  overflow-y: auto;
}
.HazeSham::-webkit-scrollbar {
  display: none;
}
.table {
  width: 70%;
  position: absolute;
  top: 12.7%;
  right: 0;
  margin-right: 340px;
  height: 700px;
  z-index: 3;
}
.Allmenu {
  text-align: center;
  position: relative;
  top: 40px;
}
.row {
  font-size: 20px;
  margin-bottom: 10px;
  background: rgb(249, 218, 218);
  border-radius: 20px 0 0 20px;
  padding: 10px;
}
.row:hover {
  background: rgba(249, 218, 218, 0.53);
  cursor: pointer;
}
.DivShelhalemaala {
  position: absolute;
  background: rgba(0, 0, 0, 0.847);
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 500;
}
.input {
  position: absolute;
  top: 40px;
  right: 35.7%;
  width: 400px;
  z-index: 501;
}
.selectA {
  position: absolute;
  top: 40px;
  right: 61.8%;
  z-index: 501;
}
</style>
<style>
body {
  background: rgb(139, 115, 115);
}
input {
  text-align: right;
}
input::placeholder {
  text-align: right;
}
</style>
