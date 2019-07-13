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
    <div class="send-notification card--light"></div>
    <div class="stats card--light"></div>
  </main>
</template>

<script>

  export default {
    name: 'home',

  }
</script>
