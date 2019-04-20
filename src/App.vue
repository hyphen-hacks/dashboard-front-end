<template>
  <div id="app">
    <nav id="nav--top">
      <h1>Hyphen-Hacks</h1>
    </nav>
    <nav id="nav--side">
      <img class="nav__profileImage" :src="user.photoURL" alt="">
      <h1 class="nav__username">{{user.displayName}}</h1>
      <button @click="signOut" class="nav__signout">Sign Out</button>
      <hr>
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script>
  import 'minireset.css'
  import '@/assets/css/global.scss'

  export default {
    name: 'appContainer',
    computed: {
      user() {
        return this.$store.getters.getUser
      }
    },
    mounted() {

      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
         // console.log('user')
          this.$store.dispatch('updateUser')
        } else {
          this.$store.dispatch('updateUser')
          // No user is signed in.
          //console.log('no user')
          const google = new this.$firebase.auth.GoogleAuthProvider();
          this.$firebase.auth().signInWithRedirect(google);
        }
      });
    },
    methods: {
      signOut() {
        this.$firebase.auth().signOut()
      }

    }
  }
</script>
