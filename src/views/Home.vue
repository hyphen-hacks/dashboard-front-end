<template>
  <main class="home notReady">
    <div class="stats-row">
      <div class="card--dark stat-block">
        <p class="heading">ATTENDEES</p>
        <p class="value">400</p>
      </div>
      <div class="card--dark stat-block">
        <p class="heading">MENTORS</p>
        <p class="value">50</p>
      </div>
      <div class="card--dark stat-block">
        <p class="heading">VOLUNTEERS</p>
        <p class="value">20</p>
      </div>
      <div class="card--dark stat-block">
        <p class="heading">WAIVERS COMPLETED</p>
        <p class="value">80%</p>
      </div>
      <div class="card--dark stat-block">
        <p class="heading">PEOPLE WITH A TEAM</p>
        <p class="value">30%</p>
      </div>
    </div>
    <div class="send-notification notReady card--light">
      <h1 class="card__heading">Send Notification</h1>
      <form @submit.prevent>
        <input disabled placeholder="title" type="text">
        <textarea disabled placeholder="message"></textarea>
        <button disabled type="submit">SEND</button>
      </form>
    </div>
    <div class="stats card--light">
      <h1 class="card__heading">Stats</h1>
    </div>
  </main>
</template>

<script>

  export default {
    name: 'home',
    mounted() {
      if (this.$route.path === '/' && this.$parent.user) {
        this.$swal({
          title: 'Work In Progress',
          text: 'when this page is finished you will be able to see realtime stats about our attendees and demographics.',
          buttons: {
            cancel: {
              text: 'don\'t show this again',
              visible: false,
              value: true
            },
            cantWait: {
              text: 'Can\'t Wait!',
              default: true,
              value: false
            }
          }
        })
      }

    }


  }
</script>
