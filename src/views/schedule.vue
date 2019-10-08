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
      <div @click="choose(item.id, item.data)" :key="item.id" v-for="item in schedule"
           :class="{chosen:false}" class="person">
        <p class="person__name">{{item.data.title}}</p>
        <p class="person__time start">{{parseTime(item.data.startTime)}}</p>
        <p class="person__time">{{parseTime(item.data.endTime)}}</p>
        <p class="person__location">{{item.data.location}}</p>

      </div>
      <button class="btn" @click="createNew">New</button>
    </div>
    <div v-if="selectedItem" class="roster__info">
      <div class="info__nameRow">
        <div class="nameRow__nameContainer">
          <h1 class="nameRow__name">{{selectedItem.data.title}}</h1>

          <p class="nameRow__school">{{parseTime(selectedItem.data.startTime)}} <span v-if="selectedItem.data.endTime">to {{parseTime(selectedItem.data.endTime)}}</span>
            <span v-if="selectedItem.data.location"> in {{selectedItem.data.location}}</span></p>


        </div>

      </div>
      <br>
      <form class="scheduleDetails" @submit.prevent="saveSchedule(selectedItem.id,selectedItem.data)">
        <label for="scheduleTitle">Title</label>
        <input class="input" id="scheduleTitle" type="text" placeholder="Title" v-model="selectedItem.data.title">
        <label for="scheduleStart">Start Time (ex. 2019-10-12 09:30) <span class="green">Valid</span></label>
        <input class="input" id="scheduleStart" type="text" placeholder="Start Time (ex. 2019-10-12 09:30)"
               v-model="selectedItem.data.startTime">
        <label for="scheduleEnd">End Time (ex. 2019-10-12 09:30) <span class="green">Valid</span></label>
        <input class="input" id="scheduleEnd" type="text" placeholder="End Time (ex. 2019-10-12 09:30)"
               v-model="selectedItem.data.endTime">
        <div class="row">
          <label for="scheduleLocation">Location</label>
          <input class="input" id="scheduleLocation" type="text" placeholder="Location"
                 v-model="selectedItem.data.location">
          <label for="scheduleType">Type</label>
          <input class="input" id="scheduleType" type="text" placeholder="Type" v-model="selectedItem.data.type">
        </div>
        <label for="scheduleDesc">Description</label>
        <textarea class="input" id="scheduleDesc" placeholder="Description"
                  v-model="selectedItem.data.description"></textarea>
        <button type="submit" class="btn" v-if="needToSave">
          save
        </button>
      </form>

    </div>
    <div v-if="!selectedItem" class="roster__info help">
      <p class="helpText">Click on an event to edit the details</p>
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
        schedule: [],
        scheduleJSON: {},
        selectedItem: false,


      }
    },
    computed: {
      needToSave() {
        return JSON.stringify(this.selectedItem.data) !== JSON.stringify(this.scheduleJSON[this.selectedItem.id])
      },
      saved() {
        if (JSON.stringify(this.selectedItem.data) === JSON.stringify(this.scheduleJSON[this.selectedItem.id])) {
          return 'saved'
        } else {
          return 'save'
        }
      }
    },
    mounted() {
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;

      })
      this.$firebase.firestore().collection('schedule').onSnapshot(snap => {
        this.schedule = []
        let schedule = []
        snap.forEach(item => {
          schedule.push({id: item.id, data: item.data()})
          this.scheduleJSON[item.id] = item.data()

        })

        function compare(a, b) {
          console.log(a, b)
          let aStart = moment(a.data.startTime).unix()
          let bStart = moment(b.data.startTime).unix()
          console.log(aStart, a.data.startTime, bStart)

          return aStart - bStart
        }

        this.schedule = schedule.sort(compare)


        this.loadingData = false
      })


    },
    methods: {
      createNew() {
        const id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now()
        console.log('new', id)
        this.schedule.push({id: id, data: {}})
        this.scheduleJSON[id] = {}
        this.selectedItem = {
          id: id, data: {}
        }

      },
      saveSchedule(id, data) {

        this.$firebase.firestore().collection('schedule').doc(id).set(data).then(e => {
          this.scheduleJSON[id] = data
          console.log('saved')
          this.selectedItem = false
        })
      },
      choose(id, data) {
        this.selectedItem = {
          id: id,
          data: data
        }
        console.log('chosen', id)
      },
      parseTime: (time) => {
        if (moment(time).isValid() && time) {
          return moment(time).format('ddd, h:mma')
        } else {
          return null
        }

      }
    },


  }
</script>
