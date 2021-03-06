<template>
  <div id="app">
    <nav id="topNav">
      <img src="@/assets/logo.svg" class="brand__image" alt="">
      <h1 class="brand">Hyphen-Hacks Dashboard v<span>{{version}}</span></h1>
      <a class="frontDeskLink" href="https://frontdesk.hyphen-hacks.com">Front Desk</a>
      <input @focus="inputFocused = true"
             @blur="inputFocused = false" id="search" @keypress="searching" v-model="search" v-if="user" type="text"
             :placeholder="placeholder" autofocus autocomplete="off"
             @keypress.enter="proccessCommand">
      <div class="searchOptions" v-if="false">
        <div class="options">
          <h3>Search Options</h3>
          <p>You can use powerful filters in your search. The syntax is: filter: (type), (ascending or descending);</p>
          <h4>Filter type options:</h4>
          <p>waiver: <span>filters based off of waiver status</span></p>
          <p>school: <span>filters alphabetically based off of school name</span></p>
          <hr>
        </div>
      </div>
      <div @click="toggleUserOptions" v-if="user" id="user">
        <div class="text">
          <h1>{{user.displayName}}</h1>
          <p>{{user.email}}</p>
        </div>
        <font-awesome-icon icon="ellipsis-v" class="fa-2x icon"/>
      </div>
      <div v-if="userOptions" class="userOptions">
        <button @click="logOut" class="btn grey logout">LOGOUT</button>
      </div>
    </nav>
    <nav v-if="user" id="sideNav">
      <router-link to="/" :class="{'active': $route.name === 'Home'}" class="link">Home</router-link>
      <router-link to="/roster" :class="{'active': $route.name === 'Roster'}" class="link">Roster</router-link>
      <router-link to="/finalanalytics" :class="{'active': $route.name === 'finalanalytics'}" class="link">People Who Showed Up</router-link>
      <router-link to="/notifications" :class="{'active': $route.name === 'notifications'}" class="link">Notifications</router-link>
      <router-link to="/schedule" :class="{'active': $route.name === 'schedule'}" class="link">Schedule</router-link>
      <router-link to="/emails" :class="{'active': $route.name === 'Emails'}" class="link">Admin</router-link>

      <router-link v-if="settingsReady" to="/" :class="{'active': $route.name === 'Settings'}" class="link">Settings
      </router-link>

      <router-link v-if="developerValidate" to="/developer" :class="{'active': $route.name === 'Developer'}"
                   class="link">
        Developer
      </router-link>

      <div v-if="attendeesApplied" class="counters card--light">

        <h3 class="heading">Checked In</h3>
        <p class="stat">Attendees: <span>{{attendeesCheckedIn}}</span></p>
        <p class="stat">Mentors: <span>{{mentorsCheckedIn}}</span></p>
        <p class="stat">Volunteers: <span>{{volunteersCheckedIn}}</span></p>

        <h3 class="heading">On Campus</h3>
        <p class="stat">Attendees: <span>{{attendeesOnCampus}}</span></p>
        <p class="stat">Mentors: <span>{{mentorsOnCampus}}</span></p>
        <p class="stat">Volunteers: <span>{{volunteersOnCampus}}</span></p>


      </div>
    </nav>
    <router-view/>
  </div>
</template>
<script>

  export default {
    name: 'app',
    data() {
      return {

        inputFocused: false,
        user: false,
        search: null,
        apiKey: false,
        settingsReady: false,
        notificationsRead: false,
        preventFocus: false,
        userOptions: false,
        version: require('../package.json').version
      }
    },
    methods: {
      logOut() {
        this.$firebase.auth().signOut()
        this.userOptions = false
      },
      toggleUserOptions() {
        this.userOptions = !this.userOptions
      },
      proccessCommand() {
        if (this.search === 'home') {
          this.search = null
          this.$router.push('/')
        } else if (this.search === 'roster') {
          this.search = null
          this.$router.push('/roster')
        } else {
          this.search = null
        }
      },
      handleKeyPress(i) {
        //console.log(i)
        if (!this.preventFocus && this.user && i.key === '/') {
          document.getElementById("search").focus();
        }

      },
      searching() {
        if (this.$route.name != 'Roster') {
          this.$router.push('/roster')
        }
      }
    }
    ,
    created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('keyup', this.handleKeyPress)
        document.title = `Hyphen-Hacks Admin Dashboard v${this.version}`
      }
    }
    ,
    beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keydown', this.handleKeyPress)
      }
    }
    ,
    computed: {
      placeholder() {
        if (this.inputFocused) {
          return 'Search for a name, email, date, and more'
        } else {
          return 'search the roster. press / to focus '
        }

      },
      attendeesApplied() {
        return this.$store.getters.attendeesApplied
      }
      ,
      mentorsApplied() {
        return this.$store.getters.mentorsApplied
      }
      ,
      volunteersApplied() {
        return this.$store.getters.volunteersApplied
      }
      ,
      attendeesCheckedIn() {
        return this.$store.getters.attendeesCheckedIn
      }
      ,
      mentorsCheckedIn() {
        return this.$store.getters.mentorsCheckedIn
      }
      ,
      volunteersCheckedIn() {
        return this.$store.getters.volunteersCheckedIn
      }
      ,
      attendeesOnCampus() {
        return this.$store.getters.attendeesOnCampus
      }
      ,
      mentorsOnCampus() {
        return this.$store.getters.mentorsOnCampus
      }
      ,
      volunteersOnCampus() {
        return this.$store.getters.volunteersOnCampus
      }
      ,
      developerValidate() {
        return this.user.displayName === "Ronan Furuta" || this.user.displayName === "Ben Grant";
      }
      ,
      attendeesWaivers() {
        return this.$store.getters.attendeesWaivers
      }
      ,
      mentorsWaivers() {
        return this.$store.getters.mentorsWaivers
      }
      ,
      volunteersWaivers() {
        return this.$store.getters.volunteersWaivers
      }
    }
    ,
    mounted() {
      this.$firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.user = false
          this.$router.push('/login')
        } else {
          this.user = user
          const rosterRef = this.$firebase.firestore().collection('people');
          let observer = rosterRef.onSnapshot(docSnapshot => {
            //console.log(docSnapshot);
            let roster = {}
            let rosterArray = []
            docSnapshot.docs.forEach(i => {
              const data = i.data()
              roster[data.id] = data
              rosterArray.push(data)
            })
            this.$store.commit('setRoster', roster)
            this.$store.commit('setRosterArray', rosterArray)
            // ...
          }, err => {
            console.log(`Encountered error: ${err}`);
          });
          this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
            this.apiKey = doc.data().key;
          })

        }
      })
    }

  }
</script>
