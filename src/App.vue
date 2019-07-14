<template>
  <div id="app">
    <nav id="topNav">
      <img src="@/assets/logo.svg" class="brand__image" alt="">
      <h1 class="brand">Hyphen-Hacks Dashboard</h1>
      <input v-model="search" v-if="user" type="text" placeholder="Search for a name, email, date, and more">
      <div v-if="user" id="user">
        <div class="text">
          <h1>{{user.displayName}}</h1>
          <p>{{user.email}}</p>
        </div>
        <font-awesome-icon icon="ellipsis-v" class="fa-2x icon"/>
      </div>
    </nav>
    <nav v-if="user" id="sideNav">
      <router-link to="/" :class="{'active': $route.name === 'Home'}" class="link">Home</router-link>
      <router-link to="/roster" :class="{'active': $route.name === 'Roster'}" class="link">Roster</router-link>
      <router-link to="/" :class="{'active': $route.name === 'Settings'}" class="link">Settings</router-link>
      <router-link to="/" :class="{'active': $route.name === 'Developer'}" class="link">Developer</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data() {
      return {
        user: false,
        search: null
      }
    },
    mounted() {
      this.$firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.user = false
          this.$router.push('/login')
        } else {
          this.user = user
          const rosterRef = this.$firebase.firestore().collection('people');
          let observer = rosterRef.onSnapshot(docSnapshot => {
            console.log(docSnapshot);
            let roster = {}
            docSnapshot.docs.forEach(i => {
              const data = i.data()
              roster[data.id] = data
            })
            this.$store.commit('setRoster', roster)
            // ...
          }, err => {
            console.log(`Encountered error: ${err}`);
          });


        }
      })
    }

  }
</script>
