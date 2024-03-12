export default {
  namespaced: true,

  state: {
    width: "",
    data: [],
    ActivType: {},
    loading: false,
  },
  mutations: {
    Upwidth(state, val) {
      state.width = val;
      console.log(val);
    },
    UpData(state, val) {
      state.data = val;
    },
    ActivType(state, val) {
      state.ActivType = val;
    },
    Uploading(state, val) {
      state.loading = !val;
    },
  },
  // actions, getters...
};
