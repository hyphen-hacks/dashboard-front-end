<template>
  <main class="home">
    <loader v-if="loadingData"/>
    <div class="stats-row">
      <div v-if="headerRow" v-for="item in headerRow" class="card--dark stat-block"
           :class="{margined: headerRow.indexOf(item) !== 0 && headerRow.indexOf(item) !== 4 }">
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
      <chart v-for="dataSet in chartData" :input="dataSet" :key="dataSet.title"></chart>
    </div>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import Chart from 'chart.js'
  import moment from 'moment'

  import DataStorage from '../dataStorage.js'
  import chart from '../components/chart.vue'
  import loader from '../components/loader'

  Chart.defaults.global.defaultFontColor = "#fff";

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
            //console.log(decryptedData)

            let DS = new DataStorage()
            DS.loadJSON(decryptedData.store)
            this.$firebase.firestore().collection('secrets').doc('dashboardChartsFlexible').get().then(doc => {
              let charts = doc.data().data
              this.updatedTime = moment(DS.getMeta({path: 'timeStamp'})).fromNow()
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


            })
            // console.log(DS.getMeta({path: 'timeStamp'}))
            this.$firebase.firestore().collection('secrets').doc('dashboardHeaderRowFlexible').get().then(doc => {
              function percent(a, b) {
                let dividen = 0;
                a.forEach(i => {
                  dividen += i
                })
                return Math.round((dividen / b) * 100)
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

              const row = doc.data().raw
              row.forEach(i => {
                // console.log(i)
                if (i.type === 'singleStat') {
                  let value = 0
                  let data = 0
                  let additions = i.path.split(',')
                  if (additions.length === 1) {
                    let params = i.path.split('.')

                    if (params.length === 1) {
                      data = DS.singleStat.get({path: i.path})
                    } else {
                      data = DS.textStat.get({path: params[0], value: params[1]})
                    }
                  } else {
                    additions.forEach(a => {


                      let params = a.split('.')
                      //console.log(a,params)
                      if (params.length === 1) {

                        data += DS.singleStat.get({path: a})
                      } else {
                        data += DS.textStat.get({path: params[0], value: params[1]})
                      }

                    })
                  }


                  this.headerRow.push({
                    title: i.title,
                    value: data
                  })
                } else if (i.type === 'percent') {

                  let params = i.path.split(',')
                  let values = []
                  // console.log(i.path, params)
                  params.forEach(b => {
                    let miniParams = b.split('.')
                    //console.log(miniParams)
                    if (miniParams.length === b) {
                      values.push(DS.singleStat.get({path: b}))
                    } else {
                      values.push(DS.textStat.get({path: miniParams[0], value: miniParams[1]}))
                    }
                  })
                  //  console.log(values)
                  let dividen = []
                  for (let a in values) {

                    if (a < values.length - 1) {
                      dividen.push(values[a])
                    }
                  }


                  this.headerRow.push({
                    title: i.title,
                    value: percent(dividen, values[values.length - 1]) + '%'
                  })
                } else if (i.type === 'bestTextStat') {
                  let value = calculateBest(DS.textStat.get({path: i.path}))
                  this.headerRow.push({
                    title: i.title,
                    value: value
                  })
                }


              })
              this.loadingData = false

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
