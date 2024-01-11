export default {
  namespaced: true,

  state: {
    items: "",
    data: [],
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
