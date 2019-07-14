<template>
  <div id="app">
    <nav id="topNav">
      <img src="@/assets/logo.svg" class="brand__image" alt="">
      <h1 class="brand">Hyphen-Hacks Dashboard</h1>
      <input type="text" placeholder="Search for a name, email, date, and more">
      <div id="user">
        <div class="text">
          <h1>Ronan Furuta</h1>
          <p>ronan.furuta@hyphen-hacks.com</p>
        </div>
        <font-awesome-icon icon="ellipsis-v" class="fa-2x icon" />
      </div>
    </nav>
    <nav id="sideNav">
      <router-link to="/" :class="{'active': $route.name === 'Home'}" class="link">Home</router-link>
      <router-link to="/roster" :class="{'active': $route.name === 'Roster'}" class="link">Roster</router-link>
      <router-link to="/" :class="{'active': $route.name === 'Settings'}" class="link">Settings</router-link>
      <router-link to="/" :class="{'active': $route.name === 'Developer'}" class="link">Developer</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script>
  export default  {
    name: 'app'

  }
</script>
