<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="inAddEx">
      <div class="rowA">
        <InitialInput
          :background="'#67C23A'"
          :placeHolder="'כותרת התרגיל'"
          class="CompInput"
        />
        <InitialInput
          :background="'#67C23A'"
          :placeHolder="'הקלד סימן'"
          class="CompInput"
        />
        <div class="SwichStatus">
          <el-switch
            v-model="value1"
            active-text="פעיל"
            inactive-text="לא פעיל"
          ></el-switch>
        </div>
        <div class="rowB">
          <InitialInput
            :background="'#67C23A'"
            :placeHolder="'תיאור התרגיל'"
            class="item-rowB Textarea"
            v-show="!showArea"
            @focus="
              showArea = true;
              FocusArea();
            "
          />
          <el-input
            @blur="showArea = false"
            ref="InputArea"
            v-show="showArea"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="תיאור התרגיל"
            v-model="textarea2"
            class="item-rowB"
          >
          </el-input>
          <el-select
            placeholder="בחר קטגוריה"
            class="Select"
            v-model="Category"
          >
            <el-option
              v-for="(c, i) in cateGory"
              :key="i"
              :value="c.Id"
              :label="c.Name"
            ></el-option>
          </el-select>
        </div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="URL + 'postFile'"
          :auto-upload="true"
        >
          <el-button slot="trigger" type="primary"
            ><i class="fa-duotone fa-up-from-bracket"></i> העלה קובץ</el-button
          >
          <div class="el-upload__tip" slot="tip">העלה קובץ</div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";
import InitialInput from "@/components/Exercises/Elements/InTutComp.vue";
export default {
  name: "BprevenAddExercises",
  components: { InitialInput },

  data() {
    return {
      value1: true,
      showArea: false,
      textarea2: "",
      cateGory: [],
      Category: "",
    };
  },

  async mounted() {
    let { data } = await this.$ax.get(URL + "GetCategiz");
    // console.log(data);
    this.cateGory = data;
  },

  methods: {
    FocusArea() {
      let inp = this.$refs.InputArea.$el.children[0];
      setTimeout(() => {
        inp.focus();
      }, 0);
    },
  },
};
</script>

<style scoped>
.inAddEx {
  border: 3px solid black;
  width: 1000px;
  height: 430px;
  border-radius: 10px;
  box-shadow: 0 0 7px 5px rgb(118, 110, 110);
  position: relative;
  left: 50px;
  top: 30px;
}
.rowA {
  display: flex;
  flex-direction: row-reverse;
  margin: 20px;
  margin-right: 70px;
}
.rowB {
  position: absolute;
  right: 70px;
  top: 80px;
  display: flex;
  flex-direction: row-reverse;
}
.CompInput {
  position: relative;
  /* width: 26%; */
  margin: 26px;
}
.SwichStatus {
  position: relative;
  right: 70px;
  top: 40px;
  height: 40px;
}
.item-rowB {
  position: relative;
  top: 30px;
  margin: 26px;
}
.Select {
  position: relative;
  top: 50px;
  right: 60px;
}
.upload-demo {
  position: absolute;
  bottom: 70px;
  right: 280px;
}
</style>
