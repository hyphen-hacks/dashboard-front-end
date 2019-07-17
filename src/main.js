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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
