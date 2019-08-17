import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Roster from './views/roster.vue'
import Login from './views/login.vue'
import Reset from './views/reset.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/roster',
      name: "Roster",
      component: Roster
    },
    {
      path: '/login',
      name: "Login",
      component: Login
    },
    {
      path: '/reset',
      name: "reset",
      component: Reset
    }
  ]
})
