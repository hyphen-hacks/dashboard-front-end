<template>
  <div id="app">
    <nav v-if="user" id="nav--top">
      <h1>Hyphen-Hacks</h1>
    </nav>
    <nav v-if="user" id="nav--side">
      <h1 v-if="user.displayName" class="nav__username">{{user.displayName}}</h1>
      <button @click="signOut" class="nav__signout">Sign Out</button>
      <hr>
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/w/">Waiver Wizard</router-link>
      <router-link class="nav__link" to="/admin">Admin</router-link>
    </nav>
    <router-view/>
    <div v-if="loading" id="loading">
      <div>
        <div class="loader">
          <svg viewBox="0 0 80 80">
            <circle id="test" cx="40" cy="40" r="32"></circle>
          </svg>
        </div>

        <div class="loader triangle">
          <svg viewBox="0 0 86 80">
            <polygon points="43 8 79 72 7 72"></polygon>
          </svg>
        </div>

        <div class="loader">
          <svg viewBox="0 0 80 80">
            <rect x="8" y="8" width="64" height="64"></rect>
          </svg>
        </div>
      </div>

      <h1>LOADING</h1>
    </div>

  </div>
</template>
<script>
  import 'minireset.css'
  import '@/assets/css/global.scss'


  export default {
    name: 'appContainer',
    data() {
      return {
        loading: true
      }
    },
    computed: {
      user() {
        return this.$store.getters.getUser
      }

    },
    mounted() {
      this.loading = true;
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          //   console.log('user')

          this.$store.dispatch('updateUser')
          this.$store.dispatch('updateRoster')
          this.$store.dispatch('updateTicketTypes')
          this.$store.dispatch('liveUpdateRoster')

        } else {

          this.$store.dispatch('updateUser')
          // No user is signed in.
          //  console.log('no user')
          this.$router.push('/login')
          this.loading = false
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
