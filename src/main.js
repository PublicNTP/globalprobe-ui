import Vue from 'vue'
// FUTURE import VueRouter from 'vue-router'
import App from './App.vue'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

// The amplify node module does not give enough control to the developer so we manually
// set up based off the amplify cli configuration in aws-config.js
//import awsmobile from './aws-exports'
import awsmobile from './aws-config'

// FUTURE import SignIn from './components/AwsSignIn.vue'
// FUTURE import Dashboard from './components/Dashboard.vue'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Amplify.configure(awsmobile.dev)

Vue.use(AmplifyPlugin, AmplifyModules)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
