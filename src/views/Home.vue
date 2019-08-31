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
      <canvas id="genderDistribution"></canvas>
      <canvas id="gradeDistribution"></canvas>
      <canvas id="codingExperience"></canvas>
    </div>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import Chart from 'chart.js'
  import moment from 'moment'

  Chart.defaults.global.defaultFontColor = "#fff";

  export default {
    name: 'home',

    data() {
      return {
        headerRow: false,
        updatedTime: null

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
            console.log(decryptedData)
            this.headerRow = decryptedData.headerRow
          } else {
            console.log('no data')
          }


        })
        fetch('https://api.hyphen-hacks.com/api/v2/statsBlock', {
        //fetch('http://localhost:3000/api/v2/statsBlock', {
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
            console.log(moment(decryptedData.timeStamp).fromNow())
            this.updatedTime = moment(decryptedData.timeStamp).fromNow()
            const ctx = document.getElementById('genderDistribution').getContext('2d');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Male', 'Female', 'Non Gender Binary', 'Prefer Not To Say'],
                datasets: [{
                  label: 'Gender Break Down',
                  data: [decryptedData.maleAttendees, decryptedData.femaleAttendees, decryptedData.nonGenderBinaryAttendees, decryptedData.preferNotToSayAttendees],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scaleFontColor: 'white',
                legend: {
                  fontColor: 'white',
                  defaultFontColor: 'white',
                  labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    defaultFontColor: 'white'
                  }
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
            const gradeDist = document.getElementById('gradeDistribution').getContext('2d');
            new Chart(gradeDist, {
              type: 'bar',
              data: {
                labels: ['2020', '2021', '2022', '2023'],
                datasets: [{
                  label: 'Grade Break Down',
                  data: [decryptedData.gradeDistribution[2020], decryptedData.gradeDistribution[2021], decryptedData.gradeDistribution[2022], decryptedData.gradeDistribution[2023]],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scaleFontColor: 'white',
                legend: {
                  fontColor: 'white',
                  defaultFontColor: 'white',
                  labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    defaultFontColor: 'white'
                  }
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
            const codeExp = document.getElementById('codingExperience').getContext('2d');
            new Chart(codeExp, {
              type: 'bar',
              data: {
                labels: ['none', 'a little', 'some', 'a lot', 'this is my life'],
                datasets: [{
                  label: 'Coding Experience',
                  data: [decryptedData.codingExperience['none'], decryptedData.codingExperience['a little bit'], decryptedData.codingExperience['some amount'], decryptedData.codingExperience['a lot'],decryptedData.codingExperience['this is my life']],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scaleFontColor: 'white',
                legend: {
                  fontColor: 'white',
                  defaultFontColor: 'white',
                  labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    defaultFontColor: 'white'
                  }
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });

          } else {
            console.log('no data')
          }


        })

      })


    },
    methods: {}


  }
</script>
