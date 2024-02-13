import Vue from "vue";
import Vuex from "vuex";
import { URL } from "@/URL/url";
import axios from "axios";
import Score from "@/store/Score";
import Questionaire from "./Qustionaire";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    LoadingTable: false,
    message: false,
    TogelAnimate: false,
    SgorDivos: false,
    data: [],
    data2: [],
    AllData: {},
    theOption: [],
  },
  mutations: {
    Setmessage(state, mes) {
      state.message = mes;
    },
    SetTogel(state, val) {
      state.TogelAnimate = val;
    },
    SetLoadingTable(state, val) {
      state.LoadingTable = val;
    },
    SgorDivos(state, val) {
      state.SgorDivos = val;
    },
    setDataANDallData(state, val) {
      state.AllData = val.allo;
      state.data = val.data;
    },
    UptheOption(state, val) {
      state.theOption = val;
    },
    Update_DATA(state, val) {
      state.data = val;
    },
    SET_DATA(state, payload) {
      state.data = payload.data;
      state.data2 = payload.data;
      state.AllData = payload.allData;
    },
  },
  getters: {},
  actions: {
    async fetchData({ commit }) {
      try {
        let { data } = await axios.get(URL + "GetQuestions");
        let res = await axios.get(URL + "GetData");
        let allquestions = await axios.get(URL + "GetallQuestions");
        let allData = {
          DataType: res.data.DataType,
          NameQuen: res.data.NameQuen,
          Allquestions: allquestions.data,
        };

        commit("SET_DATA", { data, allData });
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    },
  },
  modules: {
    Score,
    Questionaire,
  },
});
