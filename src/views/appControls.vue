<template>
  <main class="notifications">
    <loader v-if="loadingData"></loader>
    <div class="notificationBoxContainer">
      <div class="card--light">
        <h1 class="card__heading">Send Notification</h1>
        <form @submit.prevent="send">
          <input required v-model="notification.title" type="text" class="input" placeholder="title">
          <textarea required v-model="notification.message" class="input" placeholder="message"></textarea>
          <button class="btn">SEND</button>
        </form>
      </div>
    </div>
    <div class="notificationPresetsContainer">
      <div class="card--light">
        <h1 class="card__heading">Notification Presets</h1>

      </div>
    </div>
    <div class="notificationPresetsCreatorContainer">
      <div class="card--light">
        <form @submit.prevent>
          <input type="text" class="input" placeholder="name">
          <input class="input" type="text" placeholder="suggested time">
          <button class="btn">ADD PRESET</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import moment from 'moment'
  import loader from '../components/loader'
  import draggable from 'vuedraggable'


  export default {
    name: 'Notifications',
    components: {loader, draggable},

    data() {
      return {
        loadingData: true,
        notification: {
          title: '',
          message: ''
        }

      }
    },
    mounted() {
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
        this.loadingData = false
      })


    },
    methods: {
      send() {
        fetch('https://api.hyphen-hacks.com/api/v3/pushnotification', {
          method: 'POST',
          headers: {
            authorization: this.$parent.apiKey
          },
          body: JSON.stringify(this.notification)
        }).then(res => res.json()).then(res => {
          console.log(res)
          this.notification = {
            title: '',
            message: ''
          }
          this.$swal({
            icon: 'success',
            title: 'SENT!',
            text: `sent to ${res.number} phones`
          })
        })
      }
    },


  }
</script>
