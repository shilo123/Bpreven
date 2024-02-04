<template>
  <div>
    <i
      class="el-icon-close"
      @click="$emit('Close')"
      @mouseover="over = true"
      @mouseleave="over = false"
    ></i>
    <el-button type="success" class="HosefCate" @click="newcategory"
      >הוסף קטגוריה</el-button
    >
    <div class="container">
      <div class="item" v-for="(n, i) in cateGory" :key="i">
        <span
          contenteditable="true"
          :ref="i === 0 ? 'Itemone' : 'Item'"
          @blur="
            n.ifNew
              ? SaveCategory($event.target.innerText, i)
              : EditCategory($event.target.innerText, n.Id)
          "
          >{{ n.Name }}</span
        >
        <div class="buttons">
          <el-popconfirm
            confirm-button-text="כן"
            cancel-button-text="לא, תודה"
            icon="el-icon-info"
            icon-color="red"
            title="בטוח שאתה רוצה?"
            @confirm="DeleteCategory(n.Id, i)"
          >
            <el-button type="danger" size="mini" slot="reference"
              >מחיקה</el-button
            >
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
export default {
  name: "BprevenAddCategory",

  data() {
    return {
      cateGory: [],
      over: false,
    };
  },

  async mounted() {
    let { data } = await this.$ax.get(URL + "GetCategiz");
    this.cateGory = data;
  },

  methods: {
    newcategory() {
      this.cateGory.unshift({ Name: "קטגוריה חדשה", ifNew: true });
      setTimeout(() => {
        if (this.$refs.Itemone) {
          let itemone = this.$refs.Itemone;
          itemone[0].focus();
          // console.log();
        } else {
          this.$message.error("חלה שגיאונות קטנטונת");
        }
      }, 0);
    },
    async SaveCategory(val, i) {
      if (!this.over) {
        let { data } = await this.$ax.post(URL + "AddCategory", { val });
        this.$Bool(data, "הקטגוריה נשמרה", "משהו השתבש", false);
        this.cateGory[i].ifNew = false;
      }
    },
    async EditCategory(val, id) {
      if (!this.over) {
        let { data } = await this.$ax.post(URL + "EditCategory", { val, id });
        this.$Bool(data, "הקטגוריה נשמרה", "משהו השתבש", false);
      }
    },
    async DeleteCategory(id, i) {
      console.log(id);
      let { data } = await this.$ax.delete(URL + "DeeteCategory/" + id);
      this.$Bool(data, "הקטגוריה נמחקה", "משהו השתבש", false);
      if (data) {
        this.cateGory.splice(i, 1);
      }
    },
  },
};
</script>

<style scoped>
.item {
  background: rgb(101, 85, 85);
  padding: 10px;
  margin: 10px;
  font-size: 20px;
}
.container {
  text-align: right;
}
.buttons {
  display: flex;
  flex-direction: row;
  position: relative;
  left: 5px;
}
span {
  padding: 10px;
}
.HosefCate {
  position: relative;
  left: 170px;
}
.HosefCate:hover {
  font-size: 24px;
  left: 160px;
}
</style>
