<template>
  <div>
    <i
      class="el-icon-close"
      @click="$emit('Close')"
      @mouseover="over = true"
      @mouseleave="over = false"
    ></i>
    <!-- <div class="container">
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
    </div> -->
    <el-card class="box-card">
      <div slot="header" class="header">
        <el-button
          type="success"
          class="HosefCate"
          @click="
            showNewCategory = true;
            NewCategory = '';
          "
          size="mini"
          >הוסף קטגוריה</el-button
        >
        <el-button
          type="danger"
          size="mini"
          v-if="showNewCategory || showEditCategory"
          @click="restShows"
          >הסתר</el-button
        >
        <span>קטגוריות</span>
      </div>
      <el-input
        v-model="NewCategory"
        placeholder="קטגוריה חדשה"
        size="medium"
        v-if="showNewCategory || showEditCategory"
        class="NewCateGory"
        dir="rtl"
      ></el-input>
      <el-button
        type="primary"
        size="medium"
        v-if="showNewCategory"
        class="ButtonShmor"
        @click="SaveCategory(NewCategory)"
        >שמור</el-button
      >
      <el-button
        type="primary"
        size="medium"
        v-if="showEditCategory"
        class="ButtonShmor"
        @click="EditCategory(NewCategory, IdEdit, indexEdit)"
        >שמור</el-button
      >
      <div v-for="(n, i) in cateGory" :key="i" class="item">
        {{ n.Name }}
        <el-button
          type="success"
          size="mini"
          class="Up"
          @click="
            IdEdit = n.Id;
            showEditCategory = true;
            NewCategory = n.Name;
            indexEdit = i;
          "
          >עריכה</el-button
        >

        <el-popconfirm
          confirm-button-text="כן"
          cancel-button-text="לא, תודה"
          icon="el-icon-info"
          icon-color="red"
          title="בטוח שאתה רוצה?"
          @confirm="DeleteCategory(n.Id, i)"
        >
          <el-button type="danger" size="mini" class="Del" slot="reference"
            >מחק</el-button
          >
        </el-popconfirm>
      </div>
    </el-card>
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
      showNewCategory: false,
      showEditCategory: false,
      NewCategory: "",
      IdEdit: "",
      indexEdit: "",
    };
  },

  async mounted() {
    let { data } = await this.$ax.get(URL + "GetCategiz");
    this.cateGory = data;
  },

  methods: {
    restShows() {
      this.showNewCategory = false;
      this.showEditCategory = false;
    },
    async SaveCategory(val) {
      if (!this.over) {
        let { data } = await this.$ax.post(URL + "AddCategory", { val });
        this.$Bool(data, "הקטגוריה נשמרה", "משהו השתבש", false);
        let res = await this.$ax.get(URL + "GetCategiz");
        this.cateGory = res.data;
        this.restShows();
      }
    },
    async EditCategory(val, id, i) {
      if (!this.over) {
        let { data } = await this.$ax.post(URL + "EditCategory", { val, id });
        this.$Bool(data, "הקטגוריה נשמרה", "משהו השתבש", false);
      }
      this.cateGory[i].Name = val;
      this.restShows();
    },
    async DeleteCategory(id, i) {
      // console.log(id);
      let { data } = await this.$ax.delete(URL + "DeeteCategory/" + id);
      this.$Bool(data, "הקטגוריה נמחקה", "משהו השתבש", false);
      if (data) {
        this.cateGory.splice(i, 1);
      }
      this.restShows();
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  .ButtonShmor {
    position: absolute;
    left: 40px;
  }
  .NewCateGory {
    width: 310px;
    position: relative;
    left: 100px;
  }
  .header {
    span {
      position: absolute;
      right: 40px;
      top: 10px;
      font-size: 20px;
    }
    .HosefCate {
      &:hover {
        font-size: 24px;
        left: 160px;
      }
    }
  }
  .item {
    background: rgba(26, 5, 255, 0.301);
    padding: 10px;
    margin: 10px;
    font-size: 20px;
    text-align: right;
    border: 3px solid rgba(0, 0, 0, 0.304);
    border-radius: 5px;
    .Del {
      position: absolute;
      left: 44px;
    }
    .Up {
      position: absolute;
      left: 104px;
    }
  }
}
// .container {
//   text-align: right;
// }
// .buttons {
//   display: flex;
//   flex-direction: row;
//   position: relative;
//   left: 5px;
// }
// span {
//   padding: 10px;
// }
</style>
