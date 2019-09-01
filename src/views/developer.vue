<template>
  <main class="developer">

    <chart v-for="dataSet in stats" :input="dataSet" :key="dataSet.title"></chart>

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
        // fetch('https://api.hyphen-hacks.com/api/v3/statsBlock', {
        fetch('http://localhost:3000/api/v3/statsBlock', {
          method: 'GET',
          headers: {
            "authorization": this.$parent.apiKey,
          }
        }).then(res => res.json()).then(res => {

          res = JSON.parse(res)

          if (res.data) {
            const bytes = CryptoJS.AES.decrypt(res.data, this.$parent.apiKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
           // console.log(decryptedData)

            let DS = new DataStorage()
            DS.loadJSON(decryptedData.store)
            console.log(DS.getMeta({path: 'timeStamp'}))
            const applicationDistribution = DS.dateStat.toChart({path: 'attendeesSignedUp'})
            //console.log(JSON.stringify(applicationDistribution.data))
            // console.log(referrers, genderBreakdown, 'rfom store')
            this.updatedTime = moment(DS.getMeta({path: 'timeStamp'})).fromNow()
            this.stats.push({
              title: 'Application Breakdown',
              chartData: applicationDistribution.data,
              type: 'line',
              labels: applicationDistribution.labels
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
