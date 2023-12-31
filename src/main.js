import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import store from "@/store/index";
import "./w3Style.css";
import "./transInput.css";
import "./claly.css";
import "../FileTheFontAwemson/css/all.css"; // כולל את כל הסגנונות
import "../FileTheFontAwemson/css/all.min.css"; // כולל את כל הסגנונות
import "../FileTheFontAwemson/css/brands.css"; // כולל את כל האייקונים של המותגים
import "../FileTheFontAwemson/css/brands.min.css"; // כולל את כל האייקונים של המותגים
import "../FileTheFontAwemson/css/fontawesome.min.css"; // הקובץ המרכזי של Font Awesome
import "../FileTheFontAwemson/css/solid.min.css"; // כולל אייקונים בסגנון מלא
import "../FileTheFontAwemson/css/regular.min.css"; // כולל אייקונים בסגנון רגיל
import "../FileTheFontAwemson/css/light.min.css"; // כולל אייקונים בסגנון דק
import "../FileTheFontAwemson/css/thin.min.css"; // כולל אייקונים בסגנון דק מאוד
import "../FileTheFontAwemson/css/duotone.css"; // כולל אייקונים בסגנון דו-גווני
import "../FileTheFontAwemson/css/duotone.min.css"; // כולל אייקונים בסגנון דו-גווני
import "../FileTheFontAwemson/css/v4-shims.min.css"; // עבור תאימות עם גרסה 4
import "../FileTheFontAwemson/css/svg-with-js.min.css"; // עבור שילוב עם JavaScript ו-SVG
import "../FileTheFontAwemson/css/sharp-solid.min.css"; // סגנון נוסף של אייקונים מלאים

Vue.use(ElementUI);
Vue.prototype.$ax = axios;
Vue.prototype.$eventB = new Vue();
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
