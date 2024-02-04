export default {
  namespaced: true,

  state: {
    loadingTable: false,
  },
  mutations: {
    UpItems(state, val) {
      state.items = val;
    },
    UpData(state, val) {
      state.data = val;
    },
  },
  // actions, getters...
};
