import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'
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
Vue.config.productionTip = false

//console.log('vue init')
firebase.auth().onAuthStateChanged(() => {

  if (!app) {
   // console.log('firebase init app')
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    const endInit = performance.now();
    console.log(`Init took ${(endInit - startInit)/1000}s`)
  }
})