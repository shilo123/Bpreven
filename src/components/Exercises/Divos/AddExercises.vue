<template>
  <div>
    <i class="el-icon-close" @click="$emit('Close')"></i>
    <div class="inAddEx">
      <div class="rowA">
        <InitialInput
          :background="'#67C23A'"
          :placeHolder="'כותרת התרגיל'"
          class="CompInput"
          @value="NewE.Title = $event"
        />
        <InitialInput
          :background="'#67C23A'"
          :placeHolder="'הקלד סימן'"
          class="CompInput"
          @value="NewE.Symbol = $event"
        />
        <div class="SwichStatus">
          <el-switch
            v-model="NewE.stuts"
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
            @value="NewE.descrip = $event"
            @focus="
              showArea = true;
              FocusArea();
            "
            :val="NewE.descrip"
          />
          <el-input
            @blur="showArea = false"
            ref="InputArea"
            v-show="showArea"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="תיאור התרגיל"
            v-model="NewE.descrip"
            class="item-rowB"
            dir="rtl"
          >
          </el-input>
          <el-select
            placeholder="בחר קטגוריה"
            class="Select"
            v-model="NewE.categityId"
            @input="AlowUp = true"
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
          v-show="AlowUp"
          class="upload-demo"
          ref="upload"
          :action="URLaction"
          :on-success="GetFile"
        >
          <div
            :class="{
              Upload: !afterUp,
              noUpload: afterUp,
            }"
          >
            <i class="fa-duotone fa-up-from-bracket fa-2xl"></i>
          </div>
        </el-upload>
        <video
          autoplay
          v-show="afterUp"
          class="video"
          v-if="afterUp"
          width="540"
          height="210"
          controls
          :src="NewE.link"
        ></video>
      </div>
    </div>
    <div class="botons">
      <el-button type="success" class="su" @click="AddEx(NewE)"
        >צור תרגיל חדש
      </el-button>
      <el-button
        type="danger"
        class="da"
        @click="
          $emit('Close');
          DeleteFile(NewE.categityId, GetNameFile);
        "
        >סגור</el-button
      >
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
      URL: URL,
      showArea: false,
      cateGory: [],
      afterUp: false,
      NewE: {
        Title: "",
        Symbol: "",
        descrip: "",
        categityId: "",
        stuts: true,
        link: "",
      },
      AlowUp: false,
    };
  },
  computed: {
    URLaction() {
      return `${URL}postFilee/${this.NewE.categityId}`;
    },
    GetNameFile() {
      return this.NewE.link
        ? this.NewE.link.split("/")[this.NewE.link.split("/").length - 1]
        : "none";
    },
  },
  async mounted() {
    let { data } = await this.$ax.get(URL + "GetCategiz");
    this.cateGory = data;
  },

  methods: {
    FocusArea() {
      let inp = this.$refs.InputArea.$el.children[0];
      setTimeout(() => {
        inp.focus();
      }, 0);
    },
    GetFile(res) {
      this.NewE.link = res;
      this.afterUp = true;
    },
    async AddEx(newE) {
      let { data } = await this.$ax.post(URL + "AddNewExires", newE);
      this.$Bool(data, "התרגיל נוסף בהצלחה", "משהו השתבש", false);
      this.$emit("Updata");
    },
    async DeleteFile(floader, name) {
      if (floader && name) {
        await this.$ax.delete(URL + "deleFile/" + name + "/" + floader);
      }
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
  bottom: 30px;
  right: 90px;
}
.Upload {
  border: 3px solid black;
  width: 250px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(110, 107, 107);
  transition: all 0.3s;
  border-radius: 10px;
}
.Upload:hover {
  border: 4px dashed #000000;
  border-radius: 15px;
  /* background: linear-gradient(to right, #808080, #352929); */
  animation: bacgroundU 1s infinite;
}
.Upload:active {
  border: 4px dashed #000000;
  border-radius: 15px;
  background: linear-gradient(to right, #808080, #352929);
}
.noUpload {
  pointer-events: none;
  border: 3px solid black;
  width: 250px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(156, 193, 169);
  transition: all 0.3s;
  position: absolute;
  right: 10px;
  bottom: 25px;
  border-radius: 10px;
}
.noUpload::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(89, 89, 89, 0.49);
  z-index: 1;
}
.noUpload:hover {
  cursor: not-allowed;
}
@keyframes bacgroundU {
  0% {
    background-color: #808080;
  }
  50% {
    background-color: #9fa9af;
  }
  100% {
    background-color: #808080;
  }
}
.video {
  position: absolute;
  bottom: 20px;
  left: 60px;
  border: 2px solid black;
}
.botons {
  position: absolute;
  right: 30px;
  bottom: 10px;
  display: flex;
  flex-direction: row-reverse;
  margin: 20px;
}
.su {
  font-size: 20px;
  box-shadow: 0 0 7px 3px #544c4c;
}
.da {
  font-size: 20px;
  margin-right: 20px;
  box-shadow: 0 0 7px 3px #544c4c;
}
.su:hover,
.da:hover {
  box-shadow: 0 0 4px 0;
  font-size: 22px;
}
</style>
