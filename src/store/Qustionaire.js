import axios from "axios";
import { URL } from "@/URL/url";
export default {
  namespaced: true,

  state: {
    loadingTable: false,
    Optoz: [],
    data: [],
    Allamudot: [],
  },
  mutations: {
    UpdateOptoz(state, Optoz) {
      state.Optoz = Optoz;
    },
    Updatedata(state, data) {
      state.data = data;
    },
    UpdateAllamudot(state, Allamudot) {
      state.Allamudot = Allamudot;
    },
    pushItemData(state, item) {
      state.data.data.push(item);
    },
    SliceData(state, id) {
      let i = state.data.data.findIndex((e) => e.Id === id);
      //   console.log(index);
      state.data.data.splice(i, 1);
    },
  },
  getters: {
    LastId(state) {
      return state.data.data.length === 0
        ? 1
        : state.data.data[state.data.data.length - 1].Id + 1;
    },
  },
  actions: {
    async GetDatas({ commit }) {
      let Optoz = await axios.get(URL + "GetOptionTypeQuesinnaire");
      let data = await axios.get(URL);
      let Allamudot = await axios.get(URL + "Getamudes");
      commit("UpdateOptoz", Optoz);
      commit("Updatedata", data);
      commit("UpdateAllamudot", Allamudot);
    },
    async UpdateDataSerch({ commit }, P) {
      let data = await axios.post(P.URL, P.params);
      commit("Updatedata", data);
    },
  },
};
