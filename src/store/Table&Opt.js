import axios from "axios";
import { URL } from "@/URL/url";
export default {
  namespaced: true,

  state: {
    DefaultSelect: "לפי האופציה",
  },
  mutations: {
    Set_Select(state, val) {
      state.DefaultSelect = val;
    },
  },
  getters: {},
  actions: {},
};
