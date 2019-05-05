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
          }).catch( (error) =>{
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
      color:  $red;
      font-size: 0.9rem;
      font-weight: bold;
    }
    .support {
      font-size: 0.8rem;
      color: $grey;
      margin: 3% auto;
      font-weight: bold;

      a {
        color: $grey;
        text-decoration: underline;
      }
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
        -webkit-transition-duration: 0.25s;
        -moz-transition-duration: 0.25s;
        -ms-transition-duration: 0.25s;
        -o-transition-duration: 0.25s;
        transition-duration: 0.25s;
        background: $orange;
        font-size: 1rem;
        border: none;
        padding: 4%;
        margin-top: 5%;
        color: white;
        @include rounding;
        font-weight: bold;
        &:hover{
          background-color: $orange--hover;
        }
      }

      width: 80%;
      margin: auto;

      input {
        -webkit-transition-duration: 0.25s;
        -moz-transition-duration: 0.25s;
        -ms-transition-duration: 0.25s;
        -o-transition-duration: 0.25s;
        transition-duration: 0.25s;
        background: none;
        border: $yellow solid 2px;
        font-size: 1rem;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        padding: 4%;
        margin-bottom: 5%;
        color: $yellow;

        &:hover {
          @include shadow;
          background: $yellow;
          color: white;

        }

        &:focus {
          outline: none;
          @include shadow;
          background: $yellow;
          color: white;
        }
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