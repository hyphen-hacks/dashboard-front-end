import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import swal from 'sweetalert';
import { directive as onClickOutside } from 'vue-on-click-outside'
Vue.use(VueClazyLoad)
import VueClazyLoad from 'vue-clazy-load'
import moment from 'moment'
const startInit = performance.now();
const firebaseConfig = {
  apiKey: "AIzaSyDCnWcOvTFf5P4mWeSl0KDxnGOEDRJTVwg",
  authDomain: "hyphen-hacks-2019.firebaseapp.com",
  databaseURL: "https://hyphen-hacks-2019.firebaseio.com",
  projectId: "hyphen-hacks-2019",
  storageBucket: "hyphen-hacks-2019.appspot.com",
  messagingSenderId: "496171471834"
};
let app
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase
Vue.prototype.$swal = swal
Vue.prototype.$moment = moment
Vue.config.productionTip = false

Vue.directive('on-click-outside', onClickOutside)
//console.log('vue init')
firebase.auth().onAuthStateChanged(() => {

  if (!app) {
    router.beforeEach((to, from, next) => {
      if (!firebase.auth().currentUser && to.path != '/login') {
        console.log('no user')
        next('/login')
      } else {
        next()
      }
    })
    // console.log('firebase init app')
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    const endInit = performance.now();
    console.log(`Init took ${(endInit - startInit) / 1000}s`)
  }
})