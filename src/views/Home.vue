<template>
  <main class="home">
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
    <div class="send-notification card--light">
      <h1 class="card__heading">Send Notification</h1>
      <form @submit.prevent>
        <input placeholder="title" type="text">
        <textarea placeholder="message"></textarea>
       <button type="submit">SEND</button>
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

  }
</script>
