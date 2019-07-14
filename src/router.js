import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Roster from './views/roster.vue'

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
    }
  ]
})
