import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyDCnWcOvTFf5P4mWeSl0KDxnGOEDRJTVwg",
  authDomain: "hyphen-hacks-2019.firebaseapp.com",
  databaseURL: "https://hyphen-hacks-2019.firebaseio.com",
  projectId: "hyphen-hacks-2019",
  storageBucket: "hyphen-hacks-2019.appspot.com",
  messagingSenderId: "496171471834"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
