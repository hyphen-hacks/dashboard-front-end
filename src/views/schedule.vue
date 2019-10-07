<template>
  <main class="developer">
    <loader v-if="loadingData"></loader>

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
