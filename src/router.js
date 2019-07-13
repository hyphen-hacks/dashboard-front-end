import Vue from 'vue'
import Router from 'vue-router'
import roster from './views/roster.vue'
import person from './views/person.vue'
import waiver from './views/waiver'
import login from './views/login'
import admin from './views/admin'
import logs from './views/logs'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'Roster',
      component: roster
    },
    {
      path: '/logs',
      name: 'Logs',
      component: logs
    },
    {
      path: '/p/:personId',
      name: 'Person',
      component: person
    },
    {
      path: '/w/:personId',
      name: 'waiver Person',
      component: waiver
    },
    {
      path: '/w/',
      name: 'Waiver Wizard',
      component: waiver
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    }
  ]
})

export default router;