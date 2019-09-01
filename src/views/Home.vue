<template>
  <main class="home">
    <div class="stats-row">
      <div v-if="headerRow" v-for="item in headerRow" class="card--dark stat-block">
        <p class="heading">{{item.title}}</p>
        <p class="value">{{item.value}}</p>
      </div>

    </div>
    <div class="send-notification notReady card--light">
      <h1 class="card__heading">Send Notification</h1>
      <form @submit.prevent>
        <input disabled placeholder="title" type="text">
        <textarea disabled placeholder="message"></textarea>
        <button disabled type="submit">SEND</button>
      </form>
    </div>
    <div class="stats card--light">
      <h1 class="card__heading">Stats <span class="secondaryHeading">Updated {{updatedTime}}</span></h1>
      <chart v-for="dataSet in stats" :input="dataSet" :key="dataSet.title"></chart>
    </div>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import Chart from 'chart.js'
  import moment from 'moment'

  import DataStorage from '../dataStorage.js'
  import chart from '../components/chart.vue'

  Chart.defaults.global.defaultFontColor = "#fff";

  export default {
    name: 'home',
    components: {chart},

    data() {
      return {
        headerRow: false,
        updatedTime: null,
        stats: []

      }
    },
    mounted() {

      if (this.$route.path === '/' && this.$parent.user) {

      }
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
        fetch('https://api.hyphen-hacks.com/api/v2/headerRow', {
          // fetch('http://localhost:3000/api/v2/headerRow', {
          method: 'GET',
          headers: {
            "authorization": this.$parent.apiKey,
          }
        }).then(res => res.json()).then(res => {

          res = JSON.parse(res)

          if (res.data) {
            const bytes = CryptoJS.AES.decrypt(res.data, this.$parent.apiKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            //console.log(decryptedData)
            this.headerRow = decryptedData.headerRow
          } else {
            console.log('no data')
          }


        })
        fetch('https://api.hyphen-hacks.com/api/v3/statsBlock', {
          //fetch('http://localhost:3000/api/v3/statsBlock', {
          method: 'GET',
          headers: {
            "authorization": this.$parent.apiKey,
          }
        }).then(res => res.json()).then(res => {

          res = JSON.parse(res)

          if (res.data) {
            const bytes = CryptoJS.AES.decrypt(res.data, this.$parent.apiKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            console.log(decryptedData)

            let DS = new DataStorage()
            DS.loadJSON(decryptedData.store)
            console.log(DS.getMeta({path: 'timeStamp'}))
            const referrers = DS.multiTextStat.toChart({path: 'referrers'})
            const genderBreakdown = DS.textStat.toChart({path: 'attendeeGenderDistribution'})
            const codeBreakdown = DS.textStat.toChart({path: 'attendeeSoftwareExperience'})
            const gradeBreakdown = DS.textStat.toChart({path: 'graduationdistribution'})
            const raceBreakdown = DS.textStat.toChart({path: 'attendeeRaceDistribution'})
            const shirtSizeDistribution = DS.textStat.toChart({path: 'shirtSizeDistribution'})
            const applicationDistribution = DS.dateStat.toChart({path: 'attendeesSignedUp'})
            //console.log(applicationDistribution)
            // console.log(referrers, genderBreakdown, 'rfom store')
            this.updatedTime = moment(DS.getMeta({path: 'timeStamp'})).fromNow()

            this.stats.push({
              title: 'Gender Breakdown',
              labels: genderBreakdown.labels,
              chartData: genderBreakdown.data,
              type: 'pie'
            })

            this.stats.push({
              title: 'Grade Breakdown',
              labels: gradeBreakdown.labels,
              chartData: gradeBreakdown.data,
              type: 'bar'
            })
            this.stats.push({
              title: 'Race Breakdown',
              labels: raceBreakdown.labels,
              chartData: raceBreakdown.data,
              type: 'bar'
            })
            this.stats.push({
              title: 'Coding Experience',
              labels: codeBreakdown.labels,
              chartData: codeBreakdown.data,
              type: 'bar'
            })
            this.stats.push({
              title: 'Shirts',
              labels: shirtSizeDistribution.labels,
              chartData: shirtSizeDistribution.data,
              type: 'bar'
            })
            this.stats.push({
              title: 'Referral Sources',
              labels: referrers.labels,
              chartData: referrers.data,
              type: 'pie'
            })
            this.stats.push({
              title: 'Application Breakdown',
              chartData: applicationDistribution.data,
              type: 'line',
              labels: applicationDistribution.labels,
              end: applicationDistribution.end,
              start: applicationDistribution.start
            })

          } else {
            console.log('no data')
          }


        })

      })


    },
    methods: {}


  }
</script>
