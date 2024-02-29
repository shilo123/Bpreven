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
        <div>
          <!-- v-if="afterUp" -->
          <div :class="{ File: true, fileUp: afterUp }" v-if="iFUrl">
            <video
              autoplay
              :src="NewData.link"
              width="380"
              height="220"
              controls
              v-if="(showVideo && type === 'video') || type === 'audio'"
              @error="iFUrl = false"
            ></video>
            <img
              :src="NewData.link"
              v-if="showVideo && type === 'image'"
              alt="יש כאן בעיה"
              width="380"
              height="220"
              @error="iFUrl = false"
            />
            <el-upload :action="URLaction" :on-success="successFile">
              <el-button type="primary" class="BofUp"
                >העלה קובץ אחר במקום הקיים</el-button
              >
            </el-upload>
            <el-button type="danger" class="BofUpa" @click="DeleteFile"
              >מחק את הקובץ</el-button
            >
          </div>
          <div v-else-if="!iFUrl" class="FileElse">
            <el-upload :action="URLaction" :on-success="successFile">
              <el-button type="primary" class="BofUp">
                <i class="fa-solid fa-upload"></i> אין לך כאן קבצים זה הזמן
                להעלות</el-button
              >
            </el-upload>
          </div>
        </div>
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
      type: "",
      iFUrl: true,
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
    //image,video,audio
    // await this.IfURL(this.NewData.link);
    // this.CheckURL(this.NewData.link);
    console.log("this.NewData.link", this.NewData.link);
    // console.log(
    //   " await this.IfURL(this.NewData.link):",
    //   await this.CheckURL(this.NewData.link)
    // );
    let beforTypos =
      this.NewData.link.split("/")[this.NewData.link.split("/").length - 1];
    let typos = beforTypos.split(".")[beforTypos.split(".").length - 1];
    // console.log(beforTypos);
    await this.IfURL(this.NewData.link);
    if (typos === "png") {
      this.type = "image";
    } else if (typos === "mp4") {
      this.type = "video";
    } else if (typos === "mp3") {
      this.type = "audio";
    } else {
      // this.NewData.link.split("/");
      console.log("אחי אין סוג");
      this.iFUrl = false;
      // console.log(typos);
    }
    console.log(this.type);
    let { data } = await this.$ax.get(URL + "GetCategiz");
    this.cateGory = data;
    await this.IfURL(this.NewData.link);
    // console.log(this.NewData);
  },

  methods: {
    //image,video,audio
    async IfURL(URLO) {
      // console.log(URLO);
      this.iFUrl = await this.CheckURL(URLO);
      this.showVideo = false;
      setTimeout(() => {
        this.showVideo = true;
      }, 500);
    },
    async successFile(res) {
      // console.log(res);
      this.NewData.link = res.response;
      // // console.log(res);
      await this.IfURL(res.response);

      this.type = res.Type;
      this.showVideo = false;
      setTimeout(() => {
        this.showVideo = true;
      }, 500);
      this.afterUp = true;
    },
    async UpdateExares(New) {
      this.LoadingButton = true;
      let { data } = await this.$ax.post(URL + "UpdateEx", New);
      this.LoadingButton = false;
      this.$Bool(data, "התרגיל עודכן בהצלחה!", "משהו השתבש", false);
      this.$emit("Updata");
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
      this.iFUrl = !data;
    },
    /**, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        } */
    async CheckURL(url) {
      // try {
      //   const response = await this.$ax.head(url);
      //   console.log(response);
      //   return response.status === 200; // מחזיר true אם הקובץ קיים, false אחרת
      // } catch (error) {
      //   console.log("Error:", error);
      //   return false;
      // }
      return true;
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
.FileElse {
  position: absolute;
  bottom: -80px;
  margin: 20px;
  padding: 20px;
  width: 250px;
  /* width: 250px; */
  height: 300px;
  left: 470px;
}
</style>
