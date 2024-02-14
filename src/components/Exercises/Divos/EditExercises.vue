<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="in">
      <div class="rowA">
        <input type="text" class="w3-input" v-model="NewData.Title" dir="rtl" />
        <input
          type="text"
          class="w3-input"
          v-model="NewData.Symbol"
          dir="rtl"
        />
        <el-switch
          v-model="NewData.stuts"
          active-text="פעיל"
          inactive-text="לא פעיל"
        ></el-switch>
      </div>
      <div class="rowB">
        <el-input
          type="textarea"
          class="textarea"
          :autosize="{ minRows: 13, maxRows: 14 }"
          placeholder="תיאור"
          v-model="NewData.descrip"
          dir="rtl"
        >
        </el-input>
        <el-select v-model="NewData.categityId" placeholder="קטגוריה">
          <el-option
            v-for="(s, i) in cateGory"
            :key="i"
            :value="s.Id"
            :label="s.Name"
          ></el-option>
        </el-select>
      </div>
      <div :class="{ File: true, fileUp: afterUp }">
        <video
          autoplay
          :src="NewData.link"
          width="380"
          height="220"
          controls
          v-if="showVideo"
        ></video>
        <el-upload :action="URLaction" :on-success="successFile">
          <!-- <div slot="tip" class="el-upload__tip">
            בהעלאת הקובץ הקובץ המקורי ימחק
          </div> -->
          <el-button type="primary" class="BofUp"
            >העלה קובץ אחר במקום הקיים</el-button
          >
        </el-upload>
        <el-button type="danger" class="BofUpa" @click="DeleteFile"
          >מחק את הקובץ</el-button
        >
      </div>
    </div>
    <div class="butons">
      <el-button type="danger" class="da" @click="$emit('Close')"
        >סגור</el-button
      >
      <el-button
        type="success"
        class="su"
        @click="UpdateExares(NewData)"
        :loading="LoadingButton"
        >עדכן
      </el-button>
    </div>
  </div>
</template>

<script>
import { URL } from "@/URL/url";

export default {
  name: "BprevenEditExercises",
  props: ["params"],

  data() {
    return {
      LoadingButton: false,
      URL: URL,
      NewData: {
        Title: this.params.Title,
        Symbol: this.params.Symbol,
        descrip: this.params.About,
        categityId: this.params.ExercisesCategoriesId,
        stuts: Boolean(this.params.StatusId),
        link: this.params.Link,
        id: this.params.Id,
      },
      cateGory: [],
      showVideo: true,
      afterUp: false,
    };
  },
  computed: {
    GetNameFile() {
      return this.NewData.link
        ? this.NewData.link.split("/")[this.params.Link.split("/").length - 1]
        : "none";
    },
    URLaction() {
      return `${URL}postFileUpdate/${this.GetNameFile}/${this.NewData.categityId}`;
    },
  },
  async mounted() {
    console.log(this.NewData.link);
    let { data } = await this.$ax.get(URL + "GetCategiz");
    this.cateGory = data;
    // console.log(this.NewData);
  },

  methods: {
    successFile(res) {
      this.NewData.link = res;
      console.log(res);
      this.showVideo = false;
      setTimeout(() => {
        this.showVideo = true;
      }, 200);
      this.afterUp = true;
    },
    async UpdateExares(New) {
      this.LoadingButton = true;
      let { data } = await this.$ax.post(URL + "UpdateEx", New);
      this.LoadingButton = false;
      this.$Bool(data, "התרגיל עודכן בהצלחה!", "משהו השתבש", true);
    },
    async DeleteFile() {
      const URI =
        URL + "deleFile/" + this.GetNameFile + "/" + this.NewData.categityId;
      // console.log(URI);
      let { data } = await this.$ax.delete(URI);
      this.$Bool(data, "הקובץ נמחק", "משהו השתבש", false);
      if (data) {
        this.showVideo = false;
        setTimeout(() => {
          this.showVideo = true;
        }, 200);
      }
    },
  },
};
</script>

<style scoped>
.in {
  border: 3px solid black;
  width: 1000px;
  height: 450px;
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
}
.rowA input {
  width: 30%;
  margin: 30px;
}
.rowB {
  display: flex;
  flex-direction: row-reverse;
  margin: 20px;
}
.rowB .textarea {
  width: 30%;
  margin: 30px;
  bottom: 30px;
}
.rowB .el-select {
  position: relative;
  right: 30px;
}
.el-switch {
  position: relative;
  right: 70px;
  top: 40px;
}
.File {
  position: absolute;
  bottom: -30px;
  margin: 20px;
  padding: 10px;
  left: 210px;
}
.fileUp {
  bottom: -80px;
}
video {
  border: 3px solid black;
}
.BofUp {
  position: absolute;
  /* bottom: 40px;
  left: 100%; */
  top: 10px;
  left: -50%;
}
.BofUpa {
  position: absolute;
  top: 60px;
  left: -30%;
}
.su {
  font-size: 20px;
  box-shadow: 0 0 7px 3px #544c4c;
  width: 140px;
}
.da {
  width: 140px;
  font-size: 20px;
  margin-right: 20px;
  box-shadow: 0 0 7px 3px #544c4c;
}
.su:hover,
.da:hover {
  box-shadow: 0 0 4px 0;
  font-size: 22px;
}
.butons {
  position: absolute;
  right: 40px;
  bottom: 20px;
}
</style>
