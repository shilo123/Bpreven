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
// import "./fontawesome.js";
Vue.use(ElementUI);
Vue.prototype.$ax = axios;
Vue.prototype.$eventB = new Vue();
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
