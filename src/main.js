import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import ExTableColumn from "ex-table-column";

import axios from "axios";
import store from "@/store/index";
import Input from "@/components/Score/Elenents/InitialInput.vue";
import * as GlobalFunction from "@/GlobalFunction";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
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
for (const [key, value] of Object.entries(GlobalFunction)) {
  Vue.prototype["$" + key] = value;
}
Vue.component("InitialInput", Input);
Vue.component(ExTableColumn.name, ExTableColumn);
// console.log(Vue.config);
Vue.use(ElementUI, { locale });
// Vue.use(Quasar);
Vue.prototype.$ax = axios;
Vue.prototype.$eventB = new Vue();
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
