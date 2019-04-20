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
      <div class="roster__person " v-for="person in roster" :key="person.id">
        <p class="person__info--name ">{{person.profile.name}}</p>
        <p class="person__info--role">{{roleCheck(person.ticket_class_id)}}</p>
        <p class="person__info--gender">{{person.profile.gender}}</p>
        <p class="person__info--school">{{person.answers[0].answer}}</p>
        <p class="person__info--waiverStatus" :class="{yellow: person.waiverStatus === 0, blue: person.waiverStatus === 1, orange: person.waiverStatus === 2, red: person.waiverStatus === 3 }">
          {{waiverStatus(person.waiverStatus)}}</p>
      </div>
    </div>
  </main>
</template>

<script>
  import '@/assets/css/roster.scss'

  export default {
    name: "roster.vue",
    computed: {
      roster() {
        return this.$store.getters.getRoster

      }
    },
    mounted() {
      this.$store.dispatch('updateRoster')

    },
    methods: {
      waiverStatus(id) {
        if (id === 0) {
          return 'Waiver Not Submited'
        } else if (id === 1) {
          return 'Submitted For Review'
        } else if (id === 2) {
          return 'Submitted and Reviewed'
        } else if (id === 3) {
          return 'Waiver Declined'
        } else {
          return `Error CODE: ${id}`
        }
      },
      roleCheck(id) {
        if (id == '111244170') {
          return 'Attendee'
        } else if (id == '111414717') {
          return 'Volunteer'
        } else {
          return 'unknown ticket type'
        }
      }
    }
  }
</script>

<style scoped>

</style>