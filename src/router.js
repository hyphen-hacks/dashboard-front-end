import Vue from 'vue'
import Router from 'vue-router'
import roster from './views/roster.vue'
import person from './views/person.vue'
import waiver from './views/waiver'
import login from './views/login'
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

export default router;