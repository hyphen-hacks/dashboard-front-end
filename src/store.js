import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'

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
    updatePerson(context, params) {
      console.log('updating', params.id, params.data)
      firebase.firestore().collection('people').doc(params.id).set(params.data)
    }
  }
})
