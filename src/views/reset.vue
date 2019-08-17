<template>
  <main class="reset">
    <div class="card--light resetDiv">
      <h1 v-if="!sent" class="card__heading">Reset Password</h1>
      <p v-if="!sent" class="reset__text">To reset your password enter your email and click on the link emailed to
        you.</p>
      <form v-if="!sent" @submit.prevent="reset">
        <input v-model="email" required class="input--light" type="email" placeholder="email">
        <button type="submit" class="btn">RESET</button>
        <router-link class="login__resetPassword" to="/login">login</router-link>
        <p class="red error">{{error}}</p>
      </form>
      <h1 v-if="sent" class="reset__sent">SENT!</h1>
      <router-link class="login__resetPassword" v-if="sent" to="/login">login</router-link>
    </div>
  </main>
</template>
<script>
  export default {
    name: 'reset',
    data() {
      return {
        email: null,
        error: null,
        sent: false
      }
    },
    methods: {
      reset() {
        if (this.email) {
          this.$firebase.auth().sendPasswordResetEmail(this.email).then(() => {
            // Email sent.
            this.sent = true
          }).catch((error) => {
            // An error happened.
            this.error = error.message
          });

        }
      }
    }
  }
</script>
<style lang="scss">
  .reset {
    .reset__sent {
      color: #111721;
      font-size: 60px;
      font-weight: bold;

    }
    grid-column: 1/3;
    padding: 2vw;
    display: flex;
    align-items: center;
    justify-content: center;

    form {
      margin-top: auto;
      width: 30vw;
      margin-bottom: auto;
    }

    .resetDiv {
      width: 35vw;
      height: 30vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
    }

    .reset__text {
      color: #414E63;
    }

    .card__heading {
      margin-right: auto;
      color: #111721;
      font-size: 60px;
    }

    .error {
      font-weight: bold;
      text-align: center;
      margin-top: 2%;
    }

    .login__resetPassword {
      text-align: center;
      color: #A8ADB3;
      display: block;

      margin-top: 2%;
    }

    .input--light {
      width: 100%;
      margin-bottom: 5%;
      padding: 1vw;

      border: none;
      border-bottom: #111721 solid 2px;

      margin-left: auto;
      margin-right: auto;
      color: #111721;
      font-size: 16px;
    }

  }
</style>