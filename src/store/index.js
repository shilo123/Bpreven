import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: false,
    TogelAnimate: false,
  },
  mutations: {
    Setmessage(state, mes) {
      state.message = mes;
    },
    SetTogel(state, val) {
      state.TogelAnimate = val;
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
