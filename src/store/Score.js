export default {
  namespaced: true,

  state: {
    width: "",
    data: [],
    ActivType: {},
  },
  mutations: {
    Upwidth(state, val) {
      state.width = val;
    },
    UpData(state, val) {
      state.data = val;
    },
    ActivType(state, val) {
      state.ActivType = val;
    },
  },
  // actions, getters...
};
