<template>
  <main class="home">
    <loader v-if="loadingData"/>
    <div class="stats-row final">
      <div v-if="headerRow" v-for="item in headerRow" class="card--dark stat-block"
           :class="{margined: headerRow.indexOf(item) !== 0 && headerRow.indexOf(item) !== 4 }">
        <p class="heading">{{item.title}}</p>
        <p class="value">{{item.value}}</p>
      </div>

    </div>

    <br>
    <div class="stats card--light">
      <h1 class="card__heading">Stats</h1>
      <chart v-for="dataSet in chartData" :input="dataSet" :key="dataSet.title"></chart>
    </div>
    <br>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import Chart from 'chart.js'
  import moment from 'moment'

  import DataStorage from '../dataStorage.js'
  import chart from '../components/chart.vue'
  import loader from '../components/loader'
  import {parse} from 'zipson'

  Chart.defaults.global.defaultFontColor = "#fff";
  const DS = new DataStorage()

  function percent(a, b) {
    return Math.round((a / b) * 100)
  }

  function calculateBest(i) {
    //console.log(i)
    let result = {
      name: '',
      count: 1
    }
    for (let key in i) {
      if (i.hasOwnProperty(key)) {
        if (i[key] > result.count) {
          result = {
            name: key,
            count: i[key]
          }
        }
      }
    }
    return result.name
  }

  export default {
    name: 'home',
    components: {chart, loader},

    data() {
      return {
        loadingData: true,
        headerRow: [],
        updatedTime: null,
        stats: [],
        chartData: []

      }
    },
    mounted() {

      if (this.$route.path === '/' && this.$parent.user) {

      }
      this.loadingData = true
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
        this.$firebase.firestore().collection('secrets').doc('peopleWhoShowed').get().then(snap => {
          const data = snap.data().compressed
          const parsed = parse(data);
          // console.log(parsed)
          DS.loadJSON(parsed)
          console.log(DS.textStat.get({path: 'totalPeople'}))
          this.headerRow.push({
            title: 'Total People',
            value: DS.singleStat.get({path: 'totalPeople'})
          })
          this.headerRow.push({
            title: 'Total Attendees',
            value: 97
          })
          this.headerRow.push({
            title: 'Total Mentors',
            value: DS.singleStat.get({path: 'mentors'})
          })
          this.headerRow.push({
            title: 'Total Volunteers',
            value: DS.singleStat.get({path: 'volunteers'})
          })
          this.headerRow.push({
            title: 'People Who Showed Up',
            value: Object.keys(DS.singleStat.get({path: 'dayofpeople'})).length
          })
          this.headerRow.push({
            title: '% Female',
            value: percent(DS.textStat.get({path: 'attendeeGenderDistribution', value: 'female'}), 97)
          })
          console.log(DS.textStat.get({path: 'laptops'}))
          this.headerRow.push({
            title: 'Laptop People',
            value: DS.textStat.get({path: 'laptops', value: 'i would like to borrow a laptop for this event'})
          })
          this.headerRow.push({
            title: 'Best Attendee Referrer',
            value: calculateBest(DS.textStat.get({path: 'referrers'}))
          })

          this.$firebase.firestore().collection('secrets').doc('dashboardChartsFlexible').get().then(doc => {
            let charts = doc.data().data
            //this.updatedTime = moment(DS.getMeta({path: 'timeStamp'})).fromNow()
            //console.log(charts)
            charts.forEach(i => {
              let chartData = {
                title: i.title,
                type: i.type
              }
              if (i.type === 'scatter') {
                const hold = DS.dateStat.toChart({path: i.path})
                chartData.labels = hold.labels
                chartData.chartData = hold.data
                chartData.start = hold.start
                chartData.end = hold.end
              } else {
                const hold = DS.textStat.toChart({path: i.path})
                chartData.labels = hold.labels
                chartData.chartData = hold.data
              }
              this.chartData.push(chartData)
            })

            this.loadingData = false
          })



        })

      })


    },
    methods: {}


  }
</script>
