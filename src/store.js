import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roster: {}
  },
  mutations: {
    setRoster(state, roster) {
      state.roster = roster
    }
  },
  actions: {

  }
})
