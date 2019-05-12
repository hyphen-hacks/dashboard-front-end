import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    roster: {},
    ticketTypes: false
  },
  mutations: {
    updateUser(state) {
      state.user = firebase.auth().currentUser
    },
    updateRoster(state, data) {
      state.roster = data
    },
    addPerson(state, {person: person, firebase: pushToFirebase}) {
      state.roster[person.id] = person
      if (pushToFirebase) {
        firebase.firestore().collection('people').doc(person.id).set(person).then(() => {
          console.log('written to FB')
        })
      }
    },
    removePerson(state, person) {
      delete state.roster[person.id]
    },
    setTicketTypes(state, data) {
      state.ticketTypes = data
    },
    updateTicket(state, data) {
      if (data.name === false) {
        delete state.ticketTypes[data.id]
      } else {
        state.ticketTypes[data.id] = data
      }

    }
  },
  actions: {
    updateTicket(ct, data) {
     // console.log('action active', data)
      ct.commit('updateTicket', data)
   //   console.log(ct.getters.getTicketTypes)
      firebase.firestore().collection('secrets').doc('eventbriteTicketTypes').set(ct.getters.getTicketTypes)
    },
    updatePerson(ct, person) {
      ct.commit('addPerson', {person: person, firebase: true})
    },
    toggleCheckedIn(ct, person) {
      // console.log(person)
      person.checkedIn = !person.checkedIn
      ct.commit('addPerson', {person: person, firebase: true})

    },
    toggleOnCampus(ct, person) {
      // console.log(person)
      person.onCampus = !person.onCampus
      ct.commit('addPerson', {person: person, firebase: true})

    },
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

    },
    updateTicketTypes(ct) {
      firebase.firestore().collection('secrets').doc('eventbriteTicketTypes').get().then(e => {
       // console.log(e.data())
        ct.commit('setTicketTypes', e.data())
      })
    },
    liveUpdateRoster(context) {
      firebase.firestore().collection('people').onSnapshot((e) => {
        e.docChanges().forEach(function (change) {
          let doc = change.doc.data()
          if (change.type === "added") {
            // console.log("New person: ", doc);
            context.commit('addPerson', {person: doc, firebase: false})
          }
          if (change.type === "modified") {
            //  console.log("Modified person: ", doc);
            context.commit('addPerson', {person: doc, firebase: false})

          }
          if (change.type === "removed") {
            //   console.log("Removed person: ", doc);
            context.commit('removePerson', doc)

          }
        });
      });
    }

  },
  getters: {
    getTicketTypes(state) {
      return state.ticketTypes
    },
    getUser(state) {
      return state.user
    },
    getRoster(state) {
      return state.roster

    }
  }
})
