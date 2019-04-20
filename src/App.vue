<template>
  <div id="app">
    <nav id="nav--top">
      <h1>Hyphen-Hacks</h1>
    </nav>
    <nav id="nav--side">
      <img class="nav__profileImage" src="https://via.placeholder.com/150" alt="">
      <h1 class="nav__username">Sam Sam The Triangle Man</h1>
      <button class="nav__signout">Sign Out</button>
      <hr>
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script>
  import 'minireset.css'
  import '@/assets/css/global.scss'

  export default {
    name: 'appContainer'
  }
</script>
