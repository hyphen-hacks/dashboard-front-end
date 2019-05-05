<template>
  <main class="login">
    <div class="loginBox">
      <h1>Login</h1>
      <!--<p>Pleas login to access Hyphen-Hacks 2019 dashboard. <br> Accidentally got here? return to the main site: <a
          href="https://hyphen-hacks.com">https://hyphen-hacks.com</a></p>-->
      <form @submit.prevent="login">
        <input required v-model="email" type="email" placeholder="email">
        <input required v-model="pass" type="password" @keypress.13="login" placeholder="password">
        <p class="error" v-if="error">{{error}}</p>
        <button @click="login" type="submit">LOGIN</button>
        <p class="support">Trouble logging in? Email <a href="mailto:ronan@hyphen-hacks.com">ronan@hyphen-hacks.com</a>
        </p>
      </form>


    </div>
    <small>Hyphen-Hacks 2019 Dashboard was donated to Hyphen-Hacks from Stomprocket</small>
  </main>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        pass: '',
        error: ''
      }

    },
    methods: {
      login() {
        // console.log('auth')
        if (this.email && this.pass) {
          // console.log('loggingin')
          this.$firebase.auth().signInWithEmailAndPassword(this.email, this.pass).then(user => {
            this.$router.push('/')
          }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            this.error = errorMessage
            console.log(error)
            // ...
          });
        }

      }
    },
    mounted() {
      if (this.$firebase.auth().currentUser) {
        this.$router.push('/')
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '@/assets/css/vars.scss';

  .login {
    display: flex;
    width: 100%;
    height: 100vh;
    position: absolute;
    background-image: linear-gradient(180deg, $yellow 0%, $orange 100%);
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  a {
    color: $yellow;

    &:hover {
      text-decoration: underline;
    }
  }

  small {
    margin-top: auto;
  }

  .loginBox {
    .error {
      color: $red;
      font-size: 0.9rem;
      font-weight: bold;
    }

   

    p {
      margin-top: auto;
      font-weight: lighter;
    }

    margin-top: auto;
    background: $dark--background;
    padding: 2%;
    @include rounding;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 35%;
    height: 50vh;

    h1 {
      font-size: 4rem;
      font-weight: bold;
    }

    form {
      button {
        @include button;
        margin-top: 5%;
      }

      width: 80%;
      margin: auto;

      input {
       @include textInput;
        margin-bottom: 5%;
      }


      max-height: 20vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

  }

  ::-webkit-input-placeholder {
    color: white;
  }
</style>