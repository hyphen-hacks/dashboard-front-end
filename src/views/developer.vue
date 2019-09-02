<template>
  <main class="developer">
    <loader v-if="loadingData"></loader>
    <div class="red" v-if="this.$parent.user.displayName !== 'Ronan Furuta' || hostname === 'localhost'">
      <p>DON'T EDIT PAGE THIS IF YOU DON'T KNOW EXACTLY WHAT YOUR DOING!</p>
      <p>THIS PAGE LOOKS BAD CUZ YOUR NOT SUPPOSED TO WANT TO EDIT IT</p>
      <p>MAKE SURE U HAVE CHECKED ALL STUFF BEFORE YOU SAVE IT</p>
    </div>

    <div class="card--light">
      <h1 class="card__heading">Header Row Data <span class="red" v-if="unsaved">UNSAVED</span><span class="green"
                                                                                                     v-if="!unsaved">SAVED</span>
      </h1>
      <br>
      <draggable v-model="headerRow.raw" @start="drag=true; unsaved = true" @end="drag=false">
        <div v-for="row in headerRow.raw" class="headerRowItem chartItem">
          <select @change="unsaved = true" v-model="row.type">
            <option value="singleStat">Single Stat</option>
            <option value="percent">Percent</option>
            <option value="bestTextStat">Best textStat</option>

          </select>
          <input class="title" @keypress="unsaved = true" v-model="row.title" type="text" placeholder="Title">
          <input @keypress="unsaved = true" class="path" v-model="row.path" type="text" placeholder="path(s)">
          <button class="btn redBG" @click="removeStat(row)">remove</button>
        </div>
      </draggable>
      <br>
      <button class="btn" @click="save">Save</button>
      <button class="btn black" @click="addStat">ADD</button>
    </div>
    <div class="card--light">
      <h1 class="card__heading">Chart Data <span class="red" v-if="unsavedChart">UNSAVED</span><span class="green"
                                                                                                     v-if="!unsavedChart">SAVED</span>
      </h1>

      <p>drag to reorder</p>
      <br>
      <draggable v-model="chartData" @start="drag=true; unsavedChart = true" @end="drag=false">
        <div v-for="row in chartData" class="headerRowItem chartItem">
          <input class="title" @keypress="unsavedChart = true" v-model="row.title" type="text" placeholder="Title">
          <input class="type" @keypress="unsavedChart = true" v-model="row.type" type="text" placeholder="Type">
          <input @keypress="unsavedChart = true" class="pathChart" v-model="row.path" type="text" placeholder="path">
          <button class="btn redBG" @click="removeChart(row)">remove</button>
        </div>


      </draggable>

      <button class="btn" @click="saveCharts">Save</button>
      <button class="btn black" @click="addChart">ADD
      </button>
    </div>

  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import Chart from 'chart.js'
  import moment from 'moment'
  import loader from '../components/loader'
  import draggable from 'vuedraggable'

  import DataStorage from '../dataStorage.js'
  import chart from '../components/chart.vue'

  Chart.defaults.global.defaultFontColor = "#fff";

  export default {
    name: 'home',
    components: {chart, loader, draggable},

    data() {
      return {
        hostname: location.hostname,
        loadingData: true,
        headerRow: false,
        chartData: [],
        unsaved: false,
        unsavedChart: false

      }
    },
    mounted() {
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;


      })
      this.$firebase.firestore().collection('secrets').doc('dashboardHeaderRowFlexible').get().then(doc => {


        this.headerRow = doc.data()
        this.loadingData = false


      })
      this.$firebase.firestore().collection('secrets').doc('dashboardChartsFlexible').get().then(doc => {


        this.chartData = doc.data().data
        this.loadingData = false


      })


    },
    methods: {
      removeChart(row) {
        let index = this.chartData.indexOf(row);
        if (index > -1) {
          this.chartData.splice(index, 1);
        }
        this.unsavedChart = true
      },
      removeStat(row) {
        let index = this.headerRow.raw.indexOf(row);
        if (index > -1) {
          this.headerRow.raw.splice(index, 1);
        }
        this.unsaved = true
      },
      addChart() {
        this.chartData.push({
          title: '',
          path: '',
          type: ''
        });
        this.unsavedChart = true
      },
      addStat() {
        this.headerRow.raw.push({
          title: '',
          path: '',
          type: ''
        });
        this.unsaved = true
      },
      save() {
        console.log(this.headerRow)
        this.$firebase.firestore().collection('secrets').doc('dashboardHeaderRowFlexible').set(this.headerRow).then(e => {
          this.unsaved = false
        })
      },
      saveCharts() {
        console.log(this.chartData)
        this.$firebase.firestore().collection('secrets').doc('dashboardChartsFlexible').set({data: this.chartData}).then(e => {
          this.unsavedChart = false
        })
      }
    }


  }
</script>
