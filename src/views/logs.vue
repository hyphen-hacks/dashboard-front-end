<template>
  <main class="page logs">

  </main>
</template>

<script>
  import CryptoJS from '../../node_modules/crypto-js/crypto-js'
  export default {
    name: "logs",
    data() {
      return {
        apiKey: false,
        logs: ''
      }
    },
    methods: {
      loadLogs() {
        fetch('http://localhost:3000/api/v1/logs', {
          method: 'get',
          headers: {
            'Authorization': this.apiKey
          }
        }).then(res=> res.json()).then(res => {
          console.log(JSON.parse(res).data)
          const bytes = CryptoJS.AES.decrypt(JSON.parse(res).data, this.apiKey);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log(decryptedData)
          this.logs = decryptedData
        })
      },
      updateApiKey() {
        this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
          this.apiKey = doc.data().key;
          this.$parent.loading = false
          this.loadLogs()
        })
      },
    },
    mounted() {
      this.updateApiKey()


    }

  }
</script>

<style scoped>

</style>