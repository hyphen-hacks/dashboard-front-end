import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Roster from './views/roster.vue'
import Login from './views/login.vue'
import Reset from './views/reset.vue'
import Developer from './views/developer.vue'
import Emails from './views/emails'
import AppControls from './views/appControls'
import schedule from './views/schedule'

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
      path: '/developer',
      name: "Developer",
      component: Developer
    }, {
      path: '/emails',
      name: "Emails",
      component: Emails
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
    },
    {
      path: '/notifications',
      name: "notifications",
      component: AppControls
    },
    {
      path: '/schedule',
      name: "schedule",
      component: schedule
    }
  ]
})
