import Vue from "Vue";
import Vuex from "Vuex";

Vue.use(Vuex);

const state = {
  limit: 1,
}

const actions = {
  cons({
    commit
  }, status) {
    commit("increment")
  },
}


const mutations = {
  increment(state) {
    state.limit++
  }
}

export default {
  state,
  actions,
  mutations
}
