<template>
  <main class="login">
<div class="loginBox">
  <h1>Login</h1>
  <p>Pleas login to access Hyphen-Hacks 2019 dashboard.</p>
  <p>Hyphen-Hacks 2019 Dashboard was donated to Hyphen-Hacks from Stomprocket</p>
  <button>LOGIN</button>
</div>
  </main>
</template>
<script>
  export default {
    name: 'login'
  }
</script>
<style scoped lang="scss">
  @import '@/assets/css/vars.scss';
  .login {
    display: block;
    width: 100%;
    height: 100vh;
    position: absolute;
    background-image: linear-gradient(180deg, $yellow 0%, $orange 100%);
  }
</style>