<template>
  <main class="page waiverReview">
    <div v-if="person" class="personInfo" :class="{small: wizardMode}">
      <h1 @click="goToPerson">{{person.profile.name}}</h1>
      <h2 @click="goToPerson">Born: {{person.profile.birth_date}}</h2>
      <p @click="goToPerson"
         :class="{yellow: person.waiverStatus === 2, blue: person.waiverStatus === 1, orange: person.waiverStatus === 0, red: person.waiverStatus === 3 }">
        {{waiverStatus(person.waiverStatus)}}</p>
      <div class="buttonRow">
        <button v-if="this.person.waiverStatus === 1 || this.person.waiverStatus === 3" @click="approve">APPROVE
        </button>
        <button @click="decline" class="orange--bg" v-if="this.person.waiverStatus !== 3">DECLINE</button>
      </div>

    </div>
    <div v-if="wizardMode" class="controls">

      <button @click="backPerson">BACK</button>
      <button @click="nextPerson">NEXT</button>

    </div>
    <div class="waiverContainer">
      <img class="waiver" :src="waiverSrc">


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
        waiverQuePosition: false

      }
    },
    methods: {
      backPerson() {
        console.log('back', this.waiverQuePosition, this.waiverQue.length)
        if (this.waiverQuePosition > 0) {
          this.waiverQuePosition--
        } else {
          this.waiverQuePosition = this.waiverQue.length
        }
        this.figureOutId()
      },
      nextPerson() {
        console.log('next', this.waiverQuePosition, this.waiverQue.length)
        if (this.waiverQuePosition < this.waiverQue.length) {
          this.waiverQuePosition++
        } else {
          this.waiverQuePosition = 0
        }
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
              this.id = this.waiverQue[0]
              this.$route.params.personId = this.id
              this.wizardMode = true;
              this.loadData()
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
          }
        });

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

