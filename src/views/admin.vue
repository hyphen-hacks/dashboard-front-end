<template>
  <div class="page admin">
    <div class="admin__createNewAccount">
      <h1>Create A New Admin Account</h1>
      <form @submit.prevent="makeNewUser">
        <input required v-model="newName" type="text" placeholder="Full Name (used for authorizing waivers)">
        <input required v-model="newEmail" type="email" placeholder="email">
        <input required v-model="newPass" type="password" @keypress.13="makeNewUser" placeholder="password">
        <p class="error" v-if="error">{{error}}</p>
        <button type="submit">LOGIN</button>
        <p class="support">Having trouble? Email <a href="mailto:ronan@hyphen-hacks.com">ronan@hyphen-hacks.com</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import '@/assets/css/admin.scss'
  import CryptoJS from '../../node_modules/crypto-js/crypto-js'

  export default {
    name: 'admin',
    data() {
      return {
        newName: '',
        newEmail: '',
        newPass: '',
        error: '',
        apiKey: ''
      }
    },
    mounted() {
      this.updateApiKey()
    },
    methods: {
      updateApiKey() {
        this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
          this.apiKey = doc.data().key;
        })
      },
      makeNewUser() {
        this.updateApiKey()
        if (this.newName && this.newEmail && this.newPass) {
          this.error = ""
          let reqbody = CryptoJS.AES.encrypt(JSON.stringify({
            name: this.newName, email: this.newEmail, pass: this.newPass
          }), this.apiKey).toString()
          console.log(reqbody)
          const options = {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.apiKey
            },
            body: JSON.stringify({user: reqbody})

          }
          console.log(options)
          fetch('https://api.hyphen-hacks.com/api/v1/newAdminAccount', options).then(res => res.json()).then(res => {
            console.log(res)
            if (res.error) {
              this.$swal({
                icon: "error",
                title: "error",
                text: res.error.message
              })

            } else {
              this.$swal({
                icon: "success",
                title: "Success",
                text: `Successfully created user ${this.newName}`
              })
              this.newName = ''
              this.newEmail = ''
              this.newPass = ''
              this.error = ''
            }
          })
        } else {
          this.error = "all fields required"
        }
      }
    }

  }
</script>
