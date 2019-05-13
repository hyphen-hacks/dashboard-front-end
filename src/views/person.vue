<template>
  <main class="page personInfo">
    <div v-if="person">
      <h1>{{person.profile.name}}</h1>
      <h2>{{roleCheck(person.ticket_class_id)}}</h2>
      <a :href="'mailto:'+person.profile.email"><span class="personInfo__type">Email:</span>
        {{person.profile.email}}</a>
      <p><span class="personInfo__type">Birth Date:</span> {{person.profile.birth_date}}</p>
      <p><span class="personInfo__type">Gender:</span> {{person.profile.gender}}</p>
      <a target="_blank" :href='"https://waivers.hyphen-hacks.com/#/p/" + person.id'><span
          class="personInfo__type">Waiver URL:</span> https://waivers.hyphen-hacks.com/#/p/{{person.id}}</a>
      <br>
      <router-link :to="'/w/'+person.id" class="personInfo__waiverStatus"
                   :class="{yellow: person.waiverStatus === 2, blue: person.waiverStatus === 1, orange: person.waiverStatus === 0, red: person.waiverStatus === 3 }">
        {{waiverStatus(person.waiverStatus)}}
      </router-link>
      <div class="personInfo__checkedIn">
        <input @click.prevent="$store.dispatch('toggleCheckedIn', person)" :id="person.id + 'checkedIn'" type="checkbox"
               :checked="person.checkedIn" @input="$store.dispatch('toggleCheckedIn', person)">
        <label @click.prevent="$store.dispatch('toggleCheckedIn', person)" :for="person.id + 'checkedIn'">Checked
          In</label>
      </div>
      <div class="personInfo__onCampus">
        <input @click.prevent="$store.dispatch('toggleOnCampus', person)" :id="person.id + 'oncampus'" type="checkbox"
               :checked="person.onCampus" @input="$store.dispatch('toggleOnCampus', person)">
        <label @click.prevent="$store.dispatch('toggleOnCampus', person)" :for="person.id + 'oncampus'">On
          Campus</label>
      </div>
    </div>

  </main>
</template>

<script>
  import '@/assets/css/person.scss'

  export default {
    name: "person.vue",
    data() {
      return {
        personId: this.$route.params.personId,
        loaded: false
      }
    },
    mounted() {


    },
    watch: {
      person() {
        //console.log('roster', this.loaded)
        if (!this.loaded && this.person) {
          this.loaded = true;
          this.$parent.loading = false;
        }
      }
    },
    methods: {
      waiverStatus(id) {
        if (id === 0) {
          return 'Waiver Not Submited'
        } else if (id === 1) {
          return 'Submitted For Review'
        } else if (id === 2) {
          return 'Submitted and Approved'
        } else if (id === 3) {
          return 'Waiver Declined'
        } else {
          return `Error CODE: ${id}`
        }
      },
      roleCheck(id) {
        if (id) {
          // console.log(this.ticketTypes[id])
          if (this.ticketTypes[id]) {

            if (this.ticketTypes[id].name) {
              return this.ticketTypes[id].name
            } else {
              return 'unknown ticket type'
            }
          } else {
            // console.log('ticket not loaded')
            return 'loading ticket types'
          }

        } else {
          return 'no id specified'
        }

      }
    },
    computed: {
      person: {
        get: function () {
          return this.$store.getters.getRoster[this.personId]
        },
        set: function (newValue) {
          console.log(newValue)
        }

      },
      ticketTypes() {
        return this.$store.getters.getTicketTypes
      }
    }
  }
</script>
