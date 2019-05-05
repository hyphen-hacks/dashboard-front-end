<template>
  <div class="page admin">
    <div class="admin__createNewAccount">
      <h1>Create A New Admin Account</h1>
      <form @submit.prevent="makeNewUser">
        <input required v-model="newName" type="text" placeholder="Full Name (used for authorizing waivers)">
        <input required v-model="newEmail" type="email" placeholder="email">
        <input required v-model="newPass" type="password" @keypress.13="makeNewUser" placeholder="password">
        <p class="error" v-if="error">{{error}}</p>
        <button @click="makeNewUser" type="submit">LOGIN</button>
        <p class="support">Having trouble? Email <a href="mailto:ronan@hyphen-hacks.com">ronan@hyphen-hacks.com</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import '@/assets/css/admin.scss'

  export default {
    name: 'admin',
    data() {
      return {
        newName: '',
        newEmail: '',
        newPass: '',
        error: ''
      }
    },
    methods: {
      makeNewUser() {
        this.$firebase.auth().createUserWithEmailAndPassword(this.newEmail, this.newPass).then(user => {
          console.log(user.user)

            fetch('https://api.hyphen-hacks.com/api/v1/updateUserName', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({uid: user.user.uid, name: this.newName})
            }).then(resp => resp.json()).then(res => {
              if (res.success) {
                this.$swal({
                  icon: 'success',
                  tittle: 'Success!',
                  text: `user: ${this.newEmail} created`
                })
                this.newName = ''
                this.newEmail = ''
                this.newPass = ''
                this.error = false
              } else {
                this.error = res.error.message
              }

            })


          }
        ).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          this.error = errorMessage;
          console.log(error, 'create user')
          // ...
        });
      }
    }

  }
</script>
