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
        <div class="person__checkedIn" @click="toggleCheck({id: person.id, value: 'checkedIn'})"
             :class="{greenBG: person.checkedIn, redBG: !person.checkedIn}"></div>
        <div class="person__onCampus" @click="toggleCheck({id: person.id, value: 'onCampus'})"
             :class="{greenBG: person.onCampus, redBG: !person.onCampus}"></div>
      </div>
    </div>
    <div v-if="chosenPerson" class="roster__info">
      <div class="info__nameRow">
        <div class="nameRow__nameContainer">
          <h1 class="nameRow__name">{{unfilterdRoster[chosenPerson].name}}</h1>
          <p v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'High school Student'" class="nameRow__school">
            {{unfilterdRoster[chosenPerson].answers[1].answer}}, {{unfilterdRoster[chosenPerson].answers[0].answer}}</p>
          <p v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'Mentor/Judge'" class="nameRow__school">
            {{unfilterdRoster[chosenPerson].answers[15].answer}}</p>
        </div>
        <p v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'High school Student'" class="person__role">
          Attendee</p>
        <p v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'Mentor/Judge'" class="person__role">Mentor</p>
      </div>
      <div class="info__statusButtons">
        <button @click="toggleCheck({id: chosenPerson, value: 'checkedIn'})" class="statusButtons__checkmark">Checked In
          <span
              :class="{greenBG: unfilterdRoster[chosenPerson].checkedIn, redBG: !unfilterdRoster[chosenPerson].checkedIn}"
              class="checkmark__mark"></span></button>
        <button @click="toggleCheck({id: chosenPerson, value: 'onCampus'})" class="statusButtons__checkmark">On Campus
          <span
              :class="{greenBG: unfilterdRoster[chosenPerson].onCampus, redBG: !unfilterdRoster[chosenPerson].onCampus}"
              class="checkmark__mark"></span></button>
        <p class="statusButtons__waiverStatus">Waiver Status: <span
            :class="waiverStatusColor(unfilterdRoster[chosenPerson].waiverStatus)">{{waiverStatus(unfilterdRoster[chosenPerson].waiverStatus)}}</span>
        </p>
      </div>
      <div class="info__contact">
        <p class="info__data">Email: <a :href="'mailto:'+unfilterdRoster[chosenPerson].profile.email"
                                        class="info__data__value">{{unfilterdRoster[chosenPerson].profile.email}}</a>
        </p>
        <p class="info__data">Phone: <a class="info__data__value"
                                        :href="'tel:'+unfilterdRoster[chosenPerson].profile.cell_phone">{{unfilterdRoster[chosenPerson].profile.cell_phone}}</a>
        </p>
        <p v-if="unfilterdRoster[chosenPerson].profile.addresses.home" class="info__data">Address: <span
            class="info__data__value">{{unfilterdRoster[chosenPerson].profile.addresses.home.address_1}} {{unfilterdRoster[chosenPerson].profile.addresses.home.city}}</span>
        </p>
        <p class="info__data">EventID: <a class="info__data__value" target="_blank"
                                          :href="'https://waivers.hyphen-hacks.com/#/p/'+unfilterdRoster[chosenPerson].id">{{unfilterdRoster[chosenPerson].id}}</a>
        </p>
      </div>
      <details v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'High school Student'" class="info__card">
        <summary>Demographics</summary>
        <p class="info__data">Race/Ethnicity: <span
            class="info__data__value">{{unfilterdRoster[chosenPerson].answers[3].answer}}</span></p>
        <p class="info__data">Gender: <span class="info__data__value">{{unfilterdRoster[chosenPerson].answers[4].answer}}</span>
        </p>
      </details>
      <details class="info__card">
        <summary>Notes/Special Needs</summary>
        <p class="info__data">Food Allergies: <span
            class="info__data__value">{{unfilterdRoster[chosenPerson].answers[5].answer}}</span></p>
        <p class="info__data">Dietary Restrictions: <span class="info__data__value">{{unfilterdRoster[chosenPerson].answers[6].answer}}</span>
        </p>
        <p class="info__data">Special Needs: <span
            class="info__data__value">{{unfilterdRoster[chosenPerson].answers[7].answer}}</span></p>
      </details>
      <details v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'High school Student'" class="info__card">
        <summary>Profile</summary>
        <p class="info__data">Why are you attending Hyphen-Hacks:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[8].answer}}</p>
        <p class="info__data">Experience with software:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[9].answer}}</p>
        <p class="info__data">Experience with hardware:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[10].answer}}</p>
        <p class="info__data">Experience with hackathons:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[11].answer}}</p>
        <p class="info__data">Experience with team coding:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[12].answer}}</p>
        <p class="info__data">desc of compsci and hackathon exp:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[13].answer}}</p>
        <p class="info__data">Laptop:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[21].answer}}</p>
        <p class="info__data">Do you have a team:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[22].answer}}</p>
        <p class="info__data">How did you hear about us:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[23].answer}}</p>
      </details>
      <details v-if="unfilterdRoster[chosenPerson].ticket_class_name === 'Mentor/Judge'" class="info__card">
        <summary>Profile</summary>
        <p class="info__data">Mentor or Judge:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[14].answer}}</p>
        <p class="info__data">Company/program:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[15].answer}}</p>
        <p class="info__data">Position at company:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[16].answer}}</p>
        <p class="info__data">Desc exp attending hackathons:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[17].answer}}</p>
        <p class="info__data">Desc exp mentoring or judging hackathons:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[18].answer}}</p>
        <p class="info__data">Experience working with high schoolers:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[19].answer}}</p>
        <p class="info__data">Areas of expertise:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[20].answer}}</p>
        <p class="info__data">Laptop:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[21].answer}}</p>
        <p class="info__data">How did you hear about us:</p>
        <p class="info__data__value">{{unfilterdRoster[chosenPerson].answers[23].answer}}</p>
      </details>
      <div class="info__waiver">
        <div class="waiver__header">
          <h1>Waiver</h1>
          <p :class="waiverStatusColor(unfilterdRoster[chosenPerson].waiverStatus)">
            {{waiverStatus(unfilterdRoster[chosenPerson].waiverStatus)}}</p>

        </div>
        <a :href="chosenPersonWaiver" target="_blank" v-if="chosenPersonWaiver" class="waiver__waiverDisplay">
          <!--<iframe v-if="pdf" :src="chosenPersonWaiver" frameborder="0"></iframe>-->
          <embed v-if="pdf" :src="chosenPersonWaiver" type="application/pdf"/>
          <img v-if="!pdf" :src="chosenPersonWaiver">
          <p class="error" v-if="pdf">PDF preview is in very early beta. If something doesn't look right click open in
            new tab</p>
        </a>
        <button @click="approve"
                v-if="unfilterdRoster[chosenPerson].waiverStatus === 1 || unfilterdRoster[chosenPerson].waiverStatus === 3"
                class="waiver__control btn">APPROVE
        </button>
        <button @click=""
                v-if="unfilterdRoster[chosenPerson].waiverStatus === 2"
                class="waiver__control btn">DECLINE
        </button>
        <a v-if="unfilterdRoster[chosenPerson].waiverStatus > 0 && unfilterdRoster[chosenPerson].waiverStatus < 3"
           class="waiver__openInNewTab btn grey" :href="chosenPersonWaiver" target="_blank">OPEN IN NEW TAB</a>
      </div>
    </div>
    <div v-if="!chosenPerson" class="roster__info help">
      <p class="helpText">Click on someone from the roster to get more information about them</p>
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
              if (roster[key].answers[1].answer) {
                if (roster[key].email.toLowerCase().includes(this.$parent.search.toLowerCase()) || roster[key].name.toLowerCase().includes(this.$parent.search.toLowerCase()) || roster[key].profile.cell_phone.toLowerCase().includes(this.$parent.search.toLowerCase()) || roster[key].answers[1].answer.toLowerCase().includes(this.$parent.search.toLowerCase())) {
                  filteredRoster[key] = roster[key]
                }
              } else {
                if (roster[key].email.toLowerCase().includes(this.$parent.search.toLowerCase()) || roster[key].name.toLowerCase().includes(this.$parent.search.toLowerCase()) || roster[key].profile.cell_phone.toLowerCase().includes(this.$parent.search.toLowerCase())) {
                  filteredRoster[key] = roster[key]
                }
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
        chosenPerson: false,
        chosenPersonWaiver: false,
        pdf: false
      }
    },
    mounted() {
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
      })
    },
    methods: {
      toggleCheck(params) {
        console.log('toggling', params, !this.unfilterdRoster[params.id][params.value])
        let person = this.unfilterdRoster[params.id]
        person[params.value] = !person[params.value]
        this.$store.dispatch('updatePerson', {
          id: params.id,
          data: person
        })


      },
      approve() {
        if (this.$parent.apiKey && this.unfilterdRoster[this.chosenPerson].waiverStatus === 1 || this.unfilterdRoster[this.chosenPerson].waiverStatus === 3) {
          console.log('ready to approve')
          let person = this.unfilterdRoster[this.chosenPerson]
          person.waiverStatus = 2
          const emailBody = {
            type: 'waiverAccepted',
            name: this.unfilterdRoster[this.chosenPerson].profile["first_name"],
            email: this.unfilterdRoster[this.chosenPerson].profile.email
          }
          console.log('sending email', emailBody)
          fetch('https://api.hyphen-hacks.com/api/v1/sendEmail', {
            method: 'post',
            headers: {
              "authorization": this.$parent.apiKey,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailBody)
          }).then(resp => resp.json()).then(resp => {
            console.log(resp)
            this.$store.dispatch('updatePerson', {
              id: person.id,
              data: person
            })
            if (resp.error) {
              this.$swal('ERROR In Email Sending (Waiver Still Aprroved)', resp.error)
            } else {
              this.$swal("Approved!", `${this.unfilterdRoster[this.chosenPerson].profile.name}'s waiver has been approved. They will get an email notifying them`, "success").then(() => {

              })
            }
          })


        } else {
          console.log('error approving')
        }
      },
      choosePerson(person) {
        this.chosenPersonWaiver = false
        this.pdf = false
        this.chosenPerson = person.id
        if (this.unfilterdRoster[this.chosenPerson].waiverStatus > 0) {
          let waiverStorageRef = this.$firebase.storage().ref().child(this.unfilterdRoster[this.chosenPerson].waiverImage)
          waiverStorageRef.getDownloadURL().then((url) => {
            //console.log(url)
            this.chosenPersonWaiver = url
          })
          waiverStorageRef.getMetadata().then((metadata) => {
            //  console.log(metadata.contentType)
            if (metadata.contentType === 'application/pdf') {
              this.pdf = true
            }
            // Metadata now contains the metadata for 'images/forest.jpg'
          }).catch(function (error) {
            // Uh-oh, an error occurred!
          });
        } else {
          this.chosenPersonWaiver = false
        }

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