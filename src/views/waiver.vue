<template>
  <main class="page waiverReview">
    <div class="waiverReview__allDone" v-if="allDone">
      <div>
        <img src="@/assets/done.svg" alt="">
        <h1>All Submitted Waivers Approved!</h1>
      </div>

    </div>
    <div v-if="person" class="personInfo" :class="{small: wizardMode && waiverQue.length > 1}">
      <h1 @click="goToPerson">{{person.profile.name}}</h1>
      <h2 @click="goToPerson">Born: {{person.profile.birth_date}}</h2>
      <p @click="goToPerson"
         :class="{yellow: person.waiverStatus === 2, blue: person.waiverStatus === 1, orange: person.waiverStatus === 0, red: person.waiverStatus === 3 }">
        {{waiverStatus(person.waiverStatus)}}</p>
      <div class="buttonRow">
        <button v-if="this.person.waiverStatus === 1 || this.person.waiverStatus === 3" @click="approve">APPROVE
        </button>
        <button @click="decline" class="orange--bg" v-if="this.person.waiverStatus !== 3 && person.waiverImage">
          DECLINE
        </button>
      </div>

    </div>
    <div v-if="!person && !allDone">
      <div class="spinner personInfo">
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle class="length" fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
      </div>
      <br>
      <p>Loading person data</p>
    </div>
    <div v-if="wizardMode && waiverQue.length > 1" class="controls">

      <button @click="backPerson">BACK</button>
      <button @click="nextPerson">NEXT</button>

    </div>
    <div v-if="person" class="waiverContainer">
      <p v-if="person.profile.name && !person.waiverImage ">No Waiver Submitted</p>
      <div v-if="!waiverSrc">
        <div v-if="!person.profile.name" class="spinner">
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="length" fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
          </svg>
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
          </svg>
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
          </svg>
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
          </svg>
        </div>
        <br v-if="!person.profile.name">
        <p v-if="!person.profile.name">Loading person data</p>
      </div>
      <clazy-load v-if="waiverSrc" :src="waiverSrc">
        <img class="waiver" :src="waiverSrc">
        <div class="preloader" slot="placeholder">
          <div class="spinner">
            <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="length" fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33"
                      r="28"></circle>
            </svg>
            <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
            </svg>
            <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
            </svg>
            <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
            </svg>
          </div>
          <br>
          <p>Loading Waiver</p>
        </div>
      </clazy-load>


    </div>
    <div v-if="declineModal" class="centeredBox">
      <div v-if="declineModal" v-on-click-outside="closeDeclineModal" class="waiver__declineModal">
        <h1>Decline Waiver Message</h1>
        <form @submit.prevent="sendDeclineMessage">
          <p>Dear {{person.profile['first_name']}},</p>
          <br>
          <textarea required v-model="declineMessage"
                    placeholder="Write a 2-5 sentences clearly stating why their waiver was declined."></textarea>
          <br>
          <p>You can resubmit your waiver here: https://waivers.hyphen-hacks.com/#/p/{{this.person.id}}</p>
          <br>
          <p>If you think this is a mistake or if you have any questions, please email us,</p>
          <p>-The Hyphen-Hacks Team</p>
          <a>team@hyphen-hacks.com</a>
          <button type="submit">SEND</button>
        </form>

      </div>
    </div>

  </main>
</template>

<script>
  import '@/assets/css/waiver.scss'

  export default {
    name: "waiver.vue",
    data() {
      return {
        id: this.$route.params.personId,
        waiverSrc: '',
        person: false,
        apiKey: '',
        waiverQue: [],
        wizardMode: false,
        waiverQuePosition: false,
        allDone: false,
        declineModal: false,
        declineMessage: ''

      }
    },
    methods: {
      closeDeclineModal: function () {
        // console.log(this.declineModal)
        if (this.declineModal) {
          this.declineModal = false
        }
      },
      backPerson() {
        console.log('back', this.waiverQuePosition, this.waiverQue.length)
        if (this.waiverQuePosition > 0) {
          this.waiverQuePosition--
        } else {
          this.waiverQuePosition = this.waiverQue.length - 1
        }
        this.waiverSrc = false;
        this.person = false;
        this.figureOutId()
      },
      nextPerson() {
        console.log('next', this.waiverQuePosition, this.waiverQue.length)
        if (this.waiverQuePosition < this.waiverQue.length - 1) {
          this.waiverQuePosition++
        } else {
          this.waiverQuePosition = 0
        }
        this.waiverSrc = false;
        this.person = false;
        this.figureOutId()

      },
      updateApiKey() {
        this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
          this.apiKey = doc.data().key;
        })
      },
      figureOutId() {
        this.updateApiKey()
        if (this.waiverQuePosition) {
          this.$parent.loading = false
          this.id = this.waiverQue[this.waiverQuePosition]
          this.$route.params.personId = this.id
          this.wizardMode = true;
          this.loadData()
        } else if (this.$route.params.personId) {
          this.id = this.$route.params.personId;
          this.loadData()
        } else {
          this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
            this.apiKey = doc.data().key;
            fetch('https://api.hyphen-hacks.com/api/v1/waiverQue', {
              method: 'get',
              headers: {
                "Authorization": this.apiKey
              }
            }).then(resp => resp.json()).then(resp => {
              console.log(resp)
              this.$parent.loading = false
              this.waiverQue = resp.que

              if (this.waiverQue.length === 0) {
                this.person = false
                //console.log(window.localStorage.getItem('preventWaiverNotice'))
                if (!window.localStorage.getItem('preventWaiverNotice')) {
                  this.$swal({
                    icon: "success",
                    title: "congratulations!",
                    text: 'All submitted waivers have been approved!'
                  })
                }

                window.localStorage.setItem('preventWaiverNotice', 'true')
                this.person = false
                this.allDone = true;

              } else {
                window.localStorage.removeItem('preventWaiverNotice')
                this.id = this.waiverQue[0]
                this.$route.params.personId = this.id
                this.wizardMode = true;
                this.loadData()
              }

            })

          })


        }

      },
      loadData() {
        if (this.id) {
          this.person = this.$store.getters.getRoster[this.id]
          let gsReference = this.$firebase.storage().refFromURL('gs://hyphen-hacks-2019.appspot.com/' + this.person.waiverImage);
          console.log(gsReference)
          gsReference.getDownloadURL().then((url) => {
            console.log(url)
            this.waiverSrc = url;

          })
          this.$parent.loading = false
          console.log('waiver loading done')
        }

      },
      goToPerson() {
        this.$router.push('/p/' + this.$person.id)
      },
      approve() {

        if (this.person.waiverStatus === 1 || this.person.waiverStatus === 3) {


          this.person.waiverStatus = 2
          this.person.waiverReviewedBy = {name: this.$parent.user.displayName, email: this.$parent.user.email}
          this.$store.dispatch('updatePerson', this.person)
          const emailBody = {
            type: 'waiverAccepted',
            name: this.person.profile["first_name"],
            email: this.person.profile.email
          }
          console.log('sending email', emailBody)
          fetch('https://api.hyphen-hacks.com/api/v1/sendEmail', {
            method: 'post',
            headers: {
              "authorization": this.apiKey,
              'Accept': 'application/json',
              'Content-Type': 'application/json'

            },
            body: JSON.stringify(emailBody)
          }).then(resp => resp.json()).then(resp => {
            console.log(resp)
            if (resp.error) {
              this.$swal('ERROR In Email Sending', resp.error)
            }
          })
          this.$swal("Approved!", `${this.person.profile.name}'s waiver has been approved. They will get an email notifying them`, "success").then(() => {
            if (this.wizardMode) {
              this.waiverQue.splice(this.waiverQuePosition, 1)

            }
          })


        }

      },
      decline() {
        this.$swal({
          title: "Are you sure?",
          text: `You are about to decline ${this.person.profile.name}'s waiver. They will get an email notifying them to submit another.`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {

          if (willDelete) {
            this.declineMessage = ''
            this.declineModal = true
            /*
            this.$swal("Please write a message explaining why the waiver was declined", {
              content: "input",
            })
            .then((value) => {
              this.person.waiverStatus = 3
              this.person.waiverMessage = value
              this.person.waiverReviewedBy = {name: this.$parent.user.displayName, email: this.$parent.user.email}
              this.$store.dispatch('updatePerson', this.person)
              this.$swal("Declined", `${this.person.profile.name}'s waiver has been declined. They will get an email notifying them`, "success").then(() => {
                if (this.wizardMode) {
                  this.waiverQue.splice(this.waiverQuePosition, 1)

                }
              })
            });
            */
          }
        });

      },
      sendDeclineMessage() {
        this.declineModal = false
        let person = this.person
        person.waiverStatus = 3
        person.waiverMessage = this.declineMessage;
        person.waiverReviewedBy = {name: this.$parent.user.displayName, email: this.$parent.user.email}

        const emailBody = {
          type: 'waiverDeclined',
          name: person.profile["first_name"],
          email: person.profile.email,
          message: this.declineMessage,
          url: `https://waivers.hyphen-hacks.com/#/p/${person.id}`
        }
        console.log(emailBody)
        fetch('https://api.hyphen-hacks.com/api/v1/sendEmail', {
          method: 'post',
          headers: {
            "authorization": this.apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailBody)
        }).then(resp => resp.json()).then(resp => {
          this.declineModal = false;
          console.log(resp)
          if (resp.error) {
            this.$swal("Error", `Error in sending the email to ${person.email}`, "warning").then(() => {

            })
          }
          if (resp.success) {
            this.person = person
            this.$store.dispatch('updatePerson', person)
            this.$swal("Declined", `${this.person.profile.name}'s waiver has been declined. They will get an email notifying them`, "success").then(() => {
              if (this.wizardMode) {
                this.waiverQue.splice(this.waiverQuePosition, 1)
              }
            })
          }
        })


      },
      waiverStatus(id) {
        if (id === 0) {
          return 'Waiver Not Submited'
        } else if (id === 1) {
          return 'Submitted For Review'
        } else if (id === 2) {
          return 'Submitted and Approved'
        } else if (id === 3) {
          return 'Waiver Declined'
        } else {
          return `Error CODE: ${id}`
        }
      },
      updateIdFromRoute() {
        if (this.$route.params.personId) {
          this.id = this.$route.params.personId;
        }
      }
    },
    computed: {
      roster() {
        return this.$store.getters.getRoster
      }
    },
    watch: {
      roster() {
        console.log('data udpate')
        this.loadData()
      }

      /*  waiverImage(newPerson, oldPerson) {
          console.log('waiver update')
          console.log(newPerson, oldPerson)
          if (newPerson) {

            // console.log(this.person + 'person')
            console.log('gs://hyphen-hacks-2019.appspot.com/' + newPerson)
            let gsReference = this.$firebase.storage().refFromURL('gs://hyphen-hacks-2019.appspot.com/' + newPerson);
            console.log(gsReference)
            gsReference.getDownloadURL().then((url) => {
              console.log(url)
              this.waiverSrc = url;
            })
          }
        },

       */

    },
    mounted() {
      this.updateApiKey()
      console.log('waiver loading started')
      this.$parent.loading = true
      this.figureOutId()
    }
  }
</script>

