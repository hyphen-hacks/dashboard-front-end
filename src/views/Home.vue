<template>
  <main class="home">
    <loader v-if="loadingData"/>
    <p>Updated {{updatedTime}}</p>
    <div class="stats-row">
      <div v-if="headerRow" v-for="item in headerRow" class="card--dark stat-block"
           :class="{margined: headerRow.indexOf(item) !== 0 && headerRow.indexOf(item) !== 4 }">
        <p class="heading">{{item.title}}</p>
        <p class="value">{{item.value}}</p>
      </div>

    </div>
    <div class="card--light">
      <h1 class="card__heading">Event Analytics</h1>
      <canvas id="eventAnalyticsChart"></canvas>
    </div>
    <br>
    <div class="stats card--light">
      <h1 class="card__heading">Stats <span class="secondaryHeading">Updated {{updatedTime}}</span></h1>
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
      let eventAnalyticsChart;
      this.$firebase.firestore().collection('eventAnalytics').onSnapshot(snap => {
        let analyticsData = {
          labels: [],
          datasets: [{
            data: [],
            label: 'Attendees (Diff scale)',
            borderColor: "#f6e58d",
            fill: false,
            yAxisID: "B",
            lineTension: 0
          },
            {
              data: [],
              label: 'Attendees On Campus',
              borderColor: "#ffbe76",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Attendees Checked In',
              borderColor: "#ff7979",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            }, {
              data: [],
              label: 'Mentors',
              borderColor: "#badc58",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Mentors On Campus',
              borderColor: "#dff9fb",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Mentors Checked In',
              borderColor: "#7ed6df",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Volunteers',
              borderColor: "#e056fd",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Volunteers On Campus',
              borderColor: "#686de0",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Volunteers Checked In',
              borderColor: "#95afc0",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            },
            {
              data: [],
              label: 'Waivers Completed',
              borderColor: "#e67e22",
              fill: false,
              yAxisID: "A",
              lineTension: 0
            }]
        }
        let minValue = 1222123123123123123123203948;
        let maxValue = 0;
        snap.forEach(time => {
          //analyticsData.push(time.data())
          const data = time.data()
          // console.log(data.timeStamp, moment.unix(data.timeStamp).toObject(), new Date(data.timeStamp).toLocaleString())
          analyticsData.labels.push(moment.unix(data.timeStamp).format('dddd, MMMM Do YYYY, h:mm:ss a'))
          //const timeToUse = moment.unix(data.timeStamp).toDate()
          const timeToUse = new Date(moment.unix(data.timeStamp).toDate())
          if (data.timeStamp < minValue) {
            minValue = data.timeStamp
           // console.log(minValue, 'new min')
          }
         // console.log(timeToUse, 'time to use')
          analyticsData.datasets[0].data.push({t: timeToUse, y: data.attendees.total})
          analyticsData.datasets[1].data.push({t: timeToUse, y: data.attendees.onCampus})
          analyticsData.datasets[2].data.push({t: timeToUse, y: data.attendees.checkedIn})
          analyticsData.datasets[3].data.push({t: timeToUse, y: data.mentors.total})
          analyticsData.datasets[4].data.push({t: timeToUse, y: data.mentors.onCampus})
          analyticsData.datasets[5].data.push({t: timeToUse, y: data.mentors.checkedIn})
          analyticsData.datasets[6].data.push({t: timeToUse, y: data.volunteers.total})
          analyticsData.datasets[7].data.push({t: timeToUse, y: data.volunteers.onCampus})
          analyticsData.datasets[8].data.push({t: timeToUse, y: data.volunteers.checkedIn})
          analyticsData.datasets[9].data.push({
            t: timeToUse,
            y: (data.attendees.waiversComplete + data.volunteers.waiversComplete + data.mentors.waiversComplete)
          })
          /*analyticsData.datasets[0].data.push({x: data.timeStamp, y: data.attendees.total})
          analyticsData.datasets[1].data.push({x: data.timeStamp, y: data.attendees.onCampus})
          analyticsData.datasets[2].data.push({x: data.timeStamp, y: data.attendees.checkedIn})
          analyticsData.datasets[3].data.push({x: data.timeStamp, y: data.mentors.total})
          analyticsData.datasets[4].data.push({x: data.timeStamp, y: data.mentors.onCampus})
          analyticsData.datasets[5].data.push({x: data.timeStamp, y: data.mentors.checkedIn})
          analyticsData.datasets[6].data.push({x: data.timeStamp, y: data.volunteers.total})
          analyticsData.datasets[7].data.push({x: data.timeStamp, y: data.volunteers.onCampus})
          analyticsData.datasets[8].data.push({x: data.timeStamp, y: data.volunteers.checkedIn})
          analyticsData.datasets[9].data.push({
            x: data.timeStamp,
            y: (data.attendees.waiversComplete + data.volunteers.waiversComplete + data.mentors.waiversComplete)
          })*/

        })
        //console.log(analyticsData, minValue)
        const ctx = document.getElementById('eventAnalyticsChart').getContext('2d');
        eventAnalyticsChart = new Chart(ctx, {
          type: 'line',
          data: analyticsData  /*{
            labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
            datasets: [{
              data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
              label: "Africa",
              borderColor: "#3e95cd",
              fill: false
            }, {
              data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
              label: "Asia",
              borderColor: "#8e5ea2",
              fill: false
            }, {
              data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
              label: "Europe",
              borderColor: "#3cba9f",
              fill: false
            }, {
              data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
              label: "Latin America",
              borderColor: "#e8c3b9",
              fill: false
            }, {
              data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
              label: "North America",
              borderColor: "#c45850",
              fill: false
            }
            ]
          }*/,
          options: {
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  //unit: "day",
                  distribution: "linear",
                  bounds: 'data',
                  min: moment.unix(minValue).toDate()
                }
              }],
              yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
              }, {
                id: 'B',
                type: 'linear',
                position: 'right',
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            title: {
              display: false,
              text: 'P'
            }
          }
        })
      })

    },
    methods: {}


  }
</script>
