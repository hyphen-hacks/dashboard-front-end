import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store from './store'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import 'minireset.css'
import '@/assets/css/app.scss'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import swal from 'sweetalert'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
const version = require('../package.json').version
import VueAnalytics from 'vue-ua'
if (location.hostname !== "localhost") {
  Vue.use(VueAnalytics, {
    // [Required] The name of your app as specified in Google Analytics.
    appName: 'Hyphen-Hacks Dashboard',
    // [Required] The version of your app.
    appVersion: version,
    // [Required] Your Google Analytics tracking ID.
    trackingId: 'UA-146882664-1',
    // If you're using vue-router, pass the router instance here.
    vueRouter: router,

  })




  Sentry.init({
    dsn: 'https://949300d35f4c4577a5c1db564f95db04@sentry.io/1548331',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
    release: "hyphen-hacks-dashboard@" + version
  });
} else {
  console.log('devMode')
}


const firebaseConfig = {
  apiKey: "AIzaSyDCnWcOvTFf5P4mWeSl0KDxnGOEDRJTVwg",
  authDomain: "hyphen-hacks-2019.firebaseapp.com",
  databaseURL: "https://hyphen-hacks-2019.firebaseio.com",
  projectId: "hyphen-hacks-2019",
  storageBucket: "hyphen-hacks-2019.appspot.com",
  messagingSenderId: "496171471834",
  appId: "1:496171471834:web:1164beb02f7b594d"
};
firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase
Vue.prototype.$swal = swal
// Initialize Firebase
Vue.use(Vuex)


library.add(faEllipsisV)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
let app = false
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

