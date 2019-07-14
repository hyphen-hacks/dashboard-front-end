<template>
  <main v-if="$parent.user" class="roster">
    <div class="roster__people">
      <nav class="people__nav">
        <p class="nav__name">Name</p>
        <p class="nav__role">Role</p>
        <p class="nav__school">School/Work</p>
        <p class="nav__waiver">Waiver</p>
        <p class="nav__checkedIn">Checked In</p>
        <p class="nav__onCampus">On Campus</p>
      </nav>
      <div @click="choosePerson(person)" :key="person.id" v-for="person in roster "
           :class="{chosen: chosenPerson === person.id}" class="person">
        <p class="person__name">{{person.name}}</p>
        <p v-if="person.ticket_class_name === 'High school Student'" class="person__role">Attendee</p>
        <p v-if="person.ticket_class_name === 'Mentor/Judge'" class="person__role">Mentor</p>
        <p v-if="person.ticket_class_name === 'High school Student'" class="person__school">
          {{person.answers[1].answer}}</p>
        <p v-if="person.ticket_class_name === 'Mentor/Judge'" class="person__school">{{person.answers[15].answer}}</p>
        <p :class="waiverStatusColor(person.waiverStatus)" class="person__waiver">
          {{waiverStatus(person.waiverStatus)}}</p>
        <div class="person__checkedIn"></div>
        <div class="person__onCampus"></div>
      </div>
    </div>
    <div v-if="chosenPerson" class="roster__info">
      <div class="info__nameRow">
        <div class="nameRow__nameContainer">
          <h1 class="nameRow__name">{{roster[chosenPerson].name}}</h1>
          <p v-if="roster[chosenPerson].ticket_class_name === 'High school Student'" class="nameRow__school">
            {{roster[chosenPerson].answers[1].answer}}, {{roster[chosenPerson].answers[0].answer}}</p>
          <p v-if="roster[chosenPerson].ticket_class_name === 'Mentor/Judge'" class="nameRow__school">
            {{roster[chosenPerson].answers[15].answer}}</p>
        </div>
        <p v-if="roster[chosenPerson].ticket_class_name === 'High school Student'" class="person__role">Attendee</p>
        <p v-if="roster[chosenPerson].ticket_class_name === 'Mentor/Judge'" class="person__role">Mentor</p>
      </div>
      <div class="info__statusButtons">
        <button class="statusButtons__checkmark">Checked In <span class="checkmark__mark"></span></button>
        <button class="statusButtons__checkmark">On Campus <span class="checkmark__mark"></span></button>
        <p class="statusButtons__waiverStatus">Waiver Status: <span
            :class="waiverStatusColor(roster[chosenPerson].waiverStatus)">{{waiverStatus(roster[chosenPerson].waiverStatus)}}</span>
        </p>
      </div>
      <div class="info__contact">
        <p class="info__data">Email: <a :href="'mailto:'+roster[chosenPerson].profile.email" class="info__data__value">{{roster[chosenPerson].profile.email}}</a>
        </p>
        <p class="info__data">Phone: <a class="info__data__value"
                                        :href="'tel:'+roster[chosenPerson].profile.cell_phone">{{roster[chosenPerson].profile.cell_phone}}</a>
        </p>
        <p v-if="roster[chosenPerson].profile.addresses.home" class="info__data">Address: <span
            class="info__data__value">{{roster[chosenPerson].profile.addresses.home.address_1}} {{roster[chosenPerson].profile.addresses.home.city}}</span>
        </p>
      </div>
      <details v-if="roster[chosenPerson].ticket_class_name === 'High school Student'" class="info__card">
        <summary>Demographics</summary>
        <p class="info__data">Race/Ethnicity: <span
            class="info__data__value">{{roster[chosenPerson].answers[3].answer}}</span></p>
        <p class="info__data">Gender: <span class="info__data__value">{{roster[chosenPerson].answers[4].answer}}</span>
        </p>
      </details>
      <details class="info__card">
        <summary>Notes/Special Needs</summary>
        <p class="info__data">Food Allergies: <span
            class="info__data__value">{{roster[chosenPerson].answers[5].answer}}</span></p>
        <p class="info__data">Dietary Restrictions: <span class="info__data__value">{{roster[chosenPerson].answers[6].answer}}</span>
        </p>
        <p class="info__data">Special Needs: <span
            class="info__data__value">{{roster[chosenPerson].answers[7].answer}}</span></p>
      </details>
      <details class="info__card">
        <summary>Profile</summary>
        <p class="info__data">Why are you attending Hyphen-Hacks:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[8].answer}}</p>
        <p class="info__data">Experience with software:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[9].answer}}</p>
        <p class="info__data">Experience with hardware:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[10].answer}}</p>
        <p class="info__data">Experience with hackathons:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[11].answer}}</p>
        <p class="info__data">Experience with team coding:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[12].answer}}</p>
        <p class="info__data">desc of compsci and hackathon exp:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[13].answer}}</p>
        <p class="info__data">Laptop:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[21].answer}}</p>
        <p class="info__data">Do you have a team:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[22].answer}}</p>
        <p class="info__data">How did you hear about us:</p>
        <p class="info__data__value">{{roster[chosenPerson].answers[23].answer}}</p>
      </details>
      <div class="info__waiver">
        <div class="waiver__header">
          <h1>Waiver</h1>
          <p class="green">Accepted</p>
        </div>
        <div class="waiver__waiverDisplay"></div>
        <button class="waiver__control">ACCEPT</button>
        <button class="waiver__openInNewTab">OPEN IN NEW TAB</button>
      </div>
    </div>
    <div v-if="!chosenPerson" class="roster__info">
      <p>Click on someone from the roster to get more information about them</p>
    </div>
  </main>
</template>

<script>
  export default {
    name: 'Roster',
    computed: {
      unfilterdRoster() {
        return this.$store.state.roster
      },
      roster() {
        let roster = this.unfilterdRoster
        let filteredRoster = {}
        if (this.$parent.search) {
          for (let key in roster) {
            if (roster.hasOwnProperty(key)) {
              console.log(key, roster[key]);
              if (roster[key].email.toLowerCase().includes(this.$parent.search.toLowerCase()) || roster[key].name.toLowerCase().includes(this.$parent.search.toLowerCase())|| roster[key].profile.cell_phone.toLowerCase().includes(this.$parent.search.toLowerCase())){
                filteredRoster[key] = roster[key]
              }
            }
          }
        } else {
          filteredRoster = roster
        }

        return filteredRoster
      },

    },
    data() {
      return {
        chosenPerson: false
      }
    },
    mounted() {

    },
    methods: {
      choosePerson(person) {
        this.chosenPerson = person.id
      },
      waiverStatus(id) {
        switch (id) {
          case 0:
            return 'None'
          case 1:
            return 'Submitted'
          case 2:
            return 'Accepted'
          case 3:
            return 'Declined'

        }
      },
      waiverStatusColor(id) {
        switch (id) {
          case 0:
            return 'red'
          case 1:
            return 'orange'
          case 2:
            return 'green'
          case 3:
            return 'red'

        }
      }
    }
  }
</script>