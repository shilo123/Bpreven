import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: false,
  },
  mutations: {
    Setmessage(state, mes) {
      state.message = mes;
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
