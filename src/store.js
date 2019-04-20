import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    roster: false
  },
  mutations: {
    updateUser(state) {
      state.user = firebase.auth().currentUser
    },
    updateRoster(state, data) {
      state.roster = data

    }
  },
  actions: {
    updateUser(context) {
      context.commit('updateUser')
    },
    updateRoster(context) {
      firebase.firestore().collection('people').get().then(e => {
        let docs = {}
         e.forEach((doc) => {
           // doc.data() is never undefined for query doc snapshots
           //console.log(doc.id, " => ", doc.data());
           docs[doc.id] = doc.data()
         });
          context.commit('updateRoster', docs)
        }
      )

    }

  },
  getters: {
    getUser(state) {
      return state.user
    },
    getRoster(state) {
      return state.roster

    }
  }
})
