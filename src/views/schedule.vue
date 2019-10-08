<template>
  <main class="roster">
    <loader v-if="loadingData"></loader>
    <div class="roster__people">
      <nav class="people__nav">

        <div class="items">
          <p class="nav__name">Title</p>
          <p class="nav__time start">Start</p>
          <p class="nav__time">End</p>
          <p class="nav__location">Location</p>
        </div>

      </nav>
      <div v-for="item in [1,2,3,4,5]"
           :class="{chosen:false}" class="person">
        <p class="person__name">Opening Ceremony</p>
        <p class="person__time start">Sat, 10:00am</p>
        <p class="person__time">Sat, 11:00am</p>
        <p class="person__location">Gym</p>

      </div>
    </div>
    <div class="roster__info">
      <div class="info__nameRow">
        <div class="nameRow__nameContainer">
          <h1 class="nameRow__name">Opening Ceremony</h1>

          <p class="nameRow__school">Sat, 10:00am to Sat, 11:00am in Gym</p>


        </div>

      </div>
      <br>
      <form class="scheduleDetails" @submit.prevent>
        <label for="scheduleTitle">Title</label>
        <input id="scheduleTitle" type="text" placeholder="Title">
        <label for="scheduleStart">Start Time (ex. 2019-10-12 09:30) <span class="green">Valid</span></label>
        <input id="scheduleStart" type="text" placeholder="Start Time (ex. 2019-10-12 09:30)">
        <label for="scheduleEnd">End Time (ex. 2019-10-12 09:30) <span class="green">Valid</span></label>
        <input id="scheduleEnd" type="text" placeholder="End Time (ex. 2019-10-12 09:30)">
        <div class="row">
          <label for="scheduleLocation">Title</label>
          <input id="scheduleLocation" type="text" placeholder="Location">
          <label for="scheduleType">Title</label>
          <input id="scheduleType" type="text" placeholder="Type">
        </div>
        <label for="scheduleDesc">Description</label>
        <textarea id="scheduleDesc" placeholder="Description"></textarea>
        <button type="submit" class="btn">Save</button>
      </form>

    </div>
    <div v-if="!true" class="roster__info help">
      <p class="helpText">Click on someone from the roster to get more information about them</p>
    </div>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import moment from 'moment'
  import loader from '../components/loader'
  import draggable from 'vuedraggable'


  export default {
    name: 'schedule',
    components: {loader, draggable},

    data() {
      return {
        loadingData: true,

      }
    },
    mounted() {
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
        this.loadingData = false
      })


    },
    methods: {},


  }
</script>
