<template>
  <div id="app">
    <nav v-if="user" id="nav--top">
      <h1>Hyphen-Hacks</h1>
    </nav>
    <nav v-if="user" id="nav--side">
      <h1 class="nav__username">{{user.displayName}}</h1>
      <button @click="signOut" class="nav__signout">Sign Out</button>
      <hr>
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/w/">Waiver Wizard</router-link>
      <router-link class="nav__link" to="/admin">Admin</router-link>
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
        //   console.log('user')

          this.$store.dispatch('updateUser')
          this.$store.dispatch('updateRoster')
          this.$store.dispatch('liveUpdateRoster')
        } else {
          this.$store.dispatch('updateUser')
          // No user is signed in.
        //  console.log('no user')
          this.$router.push('/login')
        }
      });
    },
    methods: {
      signOut() {
        this.$firebase.auth().signOut()
        this.router.push('/login')
      }

    }
  }
</script>
