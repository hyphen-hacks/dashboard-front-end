import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roster: false,
    rosterArray: [],
    counter: 5
  },
  mutations: {
    setRosterArray(state, roster) {
      state.rosterArray = roster
    },
    setRoster(state, roster) {
      state.roster = roster
    }
  },
  getters: {
    attendeesApplied(state) {
      let attendeesArray = state.rosterArray.filter((i) => {
        return i.ticket_class_name === 'High school Student' && i.testApplicant != true
      })
      return attendeesArray.length
    },
    mentorsApplied(state) {
      let array = state.rosterArray.filter((i) => {
        return i.ticket_class_name === 'Mentor/Judge' && i.testApplicant != true
      })
      return array.length
    },
    volunteersApplied(state) {
      let array = state.rosterArray.filter((i) => {
        return i.ticket_class_name === 'volunteer' && i.testApplicant != true
      })
      return array.length
    },
    attendeesCheckedIn(state) {
      let attendeesArray = state.rosterArray.filter((i) => {
        return i.checkedIn && i.ticket_class_name === 'High school Student'
      })
      return attendeesArray.length
    },
    mentorsCheckedIn(state) {
      let array = state.rosterArray.filter((i) => {
        return i.checkedIn && i.ticket_class_name === 'Mentor/Judge'
      })
      return array.length
    },
    volunteersCheckedIn(state) {
      let array = state.rosterArray.filter((i) => {
        return i.checkedIn && i.ticket_class_name === 'Volunteer'
      })
      return array.length
    },
    attendeesOnCampus(state) {
      let attendeesArray = state.rosterArray.filter((i) => {
        return i.onCampus && i.ticket_class_name === 'High school Student'
      })
      return attendeesArray.length
    },
    mentorsOnCampus(state) {
      let array = state.rosterArray.filter((i) => {
        return i.onCampus && i.ticket_class_name === 'Mentor/Judge'
      })
      return array.length
    },
    volunteersOnCampus(state) {
      let array = state.rosterArray.filter((i) => {
        return i.onCampus && i.ticket_class_name === 'Volunteer'
      })
      return array.length
    },
    attendeesWaivers(state) {
      let attendeesArray = state.rosterArray.filter((i) => {
        return i.ticket_class_name === 'High school Student'
      })
      let attendeesWaiverArray = state.rosterArray.filter((i) => {
        return i.waiverStatus === 2 && i.ticket_class_name === 'High school Student'
      })
      return Math.round((attendeesWaiverArray.length / attendeesArray.length) * 100)
    },
    mentorsWaivers(state) {
      let attendeesArray = state.rosterArray.filter((i) => {
        return i.ticket_class_name === 'Mentor/Judge'
      })
      let attendeesWaiverArray = state.rosterArray.filter((i) => {
        return i.waiverStatus === 2 && i.ticket_class_name === 'Mentor/Judge'
      })
      return Math.round((attendeesWaiverArray.length / attendeesArray.length) * 100)
    },
    volunteersWaivers(state) {
      let attendeesArray = state.rosterArray.filter((i) => {
        return i.ticket_class_name === 'Volunteer'
      })
      let attendeesWaiverArray = state.rosterArray.filter((i) => {
        return i.waiverStatus === 2 && i.ticket_class_name === 'Volunteer'
      })
      let result = Math.round((attendeesWaiverArray.length / attendeesArray.length) * 100)
      if (!result) {
        result = 0
      }
      return result
    },
  },
  actions: {
    updatePerson(context, params) {
      console.log('updating', params.id, params.data)
      firebase.firestore().collection('people').doc(params.id).set(params.data)
    }
  }
})
