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
      <div class="card--light notificationPresets">
        <h1 class="card__heading">Notification Presets</h1>
        <div @click="loadPreset(preset)" :key="preset.id" class="card" v-for="preset in notificationPresets"><p
            class="preset__name">
          {{preset.data.info.name}}</p>
          <p class="preset__time">{{preset.data.info.suggestedTime}}</p></div>

      </div>
    </div>
    <div class="notificationPresetsCreatorContainer">
      <div class="card--light ">
        <form @submit.prevent="addPreset">

          <input required v-model="notificationPresetToAdd.name" type="text" class="input" placeholder="name">
          <input v-model="notificationPresetToAdd.suggestedTime" class="input" type="text" placeholder="suggested time">
          <button v-if="!presetLoaded" class="btn">ADD PRESET</button>

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
        notificationPresets: [],
        presetLoaded: false,
        notification: {
          title: '',
          message: ''
        },
        notificationPresetToAdd: {
          name: '',
          suggestedTime: ''
        }

      }
    },
    mounted() {

      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
        this.loadingData = false
      })
      this.$firebase.firestore().collection('notificationPresets').onSnapshot(snap => {
        this.notificationPresets = []
        snap.forEach(i => {
          this.notificationPresets.push({data: i.data(), id: i.id})
        })
      })

    },
    methods: {
      loadPreset(preset) {
        console.log(preset)
        this.notification = preset.data.data


      },
      addPreset() {
        if (this.notification.title.length > 0 && this.notification.message.length > 0) {

          this.$firebase.firestore().collection('notificationPresets').add({
            info: this.notificationPresetToAdd, data: this.notification
          }).then(i => {
            this.presetLoaded = false
            this.notificationPresetToAdd = {
              name: '',
              suggestedTime: ''
            }
            this.notification = {
              title: '',
              message: ''
            }
          })


        }

      },
      send() {

        fetch('https://api.hyphen-hacks.com/api/v3/pushnotification', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
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
