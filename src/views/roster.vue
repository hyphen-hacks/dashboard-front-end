<template>
  <main class="page roster">
    <div class="roster__buttonRow">
      <select name="sortby" id="sortby">
        <option value="sortbyname">Sort By Name</option>
        <option value="sortbywaiver">Sort By Waiver</option>
        <option value="sortbycheckedin">Sort By Checked In</option>
      </select>
      <button class="buttonRow__checkbox">
        <div class="buttonRow__checkbox__box"></div>
        <p>Invert Sort</p>
      </button>
      <button class="buttonRow__checkbox">
        <div class="buttonRow__checkbox__box"></div>
        <p>Include Attendees</p>
      </button>
      <button class="buttonRow__checkbox">
        <div class="buttonRow__checkbox__box"></div>
        <p>Include Volunteers</p>
      </button>
      <button class="buttonRow__addPerson">Add A Person</button>
    </div>
    <div v-if="roster" class="roster__roster">
      <router-link :to="'/p/'+person.id" class="roster__person" v-for="person in roster" :key="person.id">
        <p class="person__info--name ">{{person.profile.name}}</p>
        <p  class="person__info--role">{{roleCheck(person.ticket_class_id)}}</p>
        <p class="person__info--gender">{{person.profile.gender}}</p>
        <p class="person__info--school">{{person.answers[0].answer}}</p>
        <p class="person__info--waiverStatus"
           :class="{yellow: person.waiverStatus === 2, blue: person.waiverStatus === 1, orange: person.waiverStatus === 0, red: person.waiverStatus === 3 }">
          {{waiverStatus(person.waiverStatus)}}</p>
        <div class="person__checkbox--checkedIn">
          <input @click.prevent="$store.dispatch('toggleCheckedIn', person)" :id="person.id + 'checkedIn'"
                 type="checkbox" :checked="person.checkedIn" @input="$store.dispatch('toggleCheckedIn', person)">
          <label @click.prevent="$store.dispatch('toggleCheckedIn', person)" :for="person.id + 'checkedIn'">Checked
            In</label>
        </div>
        <div class="person__checkbox--onCampus">
          <input @click.prevent="$store.dispatch('toggleOnCampus', person)" :id="person.id + 'oncampus'" type="checkbox"
                 :checked="person.onCampus" @input="$store.dispatch('toggleOnCampus', person)">
          <label @click.prevent="$store.dispatch('toggleOnCampus', person)" :for="person.id + 'oncampus'">On
            Campus</label>
        </div>

      </router-link>
    </div>
  </main>
</template>

<script>
  import '@/assets/css/roster.scss'

  export default {
    name: "roster.vue",
    data() {
      return {
      loaded: false
      }
    },
    watch: {
      roster() {
        //console.log('roster', this.loaded)
        if (!this.loaded && this.roster) {
          this.loaded = true;
          this.$parent.loading = false;
        }
      }
    },
    computed: {
      roster: {
        get: function () {
          return this.$store.getters.getRoster
        },
        set: function (newValue) {
          console.log(newValue)
        }

      },
      ticketTypes() {
        return this.$store.getters.getTicketTypes
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
       // console.log('checking id role')
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
    }
  }
</script>

<style scoped>

</style>