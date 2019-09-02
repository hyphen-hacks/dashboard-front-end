<template>
  <main class="login">
    <div class="card--light loginDiv">
      <h1 class="card__heading">Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" required class="input" type="email" placeholder="email">
        <input v-model="password" required class="input" type="password" placeholder="password">
        <button type="submit" class="btn">LOGIN</button>
        <router-link class="login__resetPassword" to="/reset">reset password</router-link>
        <p class="red error">{{error}}</p>
      </form>
    </div>
  </main>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        email: null,
        password: null,
        error: null
      }
    },
    methods: {
      login() {
        if (this.email && this.password) {
          this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
            if (user) {
              this.$router.push('/')
            }
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
              this.error = 'The email or password is incorrect'
            } else {
              this.error = errorMessage
            }
            // ...
          });
        }
      }
    }
  }
</script>
<style lang="scss">
  .login {
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

    .loginDiv {
      width: 35vw;
      height: 30vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .card__heading {
      margin-right: auto;
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

    .input {
      width: 100%;
      margin-bottom: 5%;
    }
  }
</style>