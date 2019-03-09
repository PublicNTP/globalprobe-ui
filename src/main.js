import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin, AmplifyEventBus } from 'aws-amplify-vue'

// The amplify cli node module does not give enough control to the developer so we manually
// set up based off the amplify cli configuration in aws-config.js
//import awsmobile from './aws-exports'
import awsmobile from './aws-config'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueRouter)
Vue.use(BootstrapVue)

Amplify.configure(awsmobile.dev)

Vue.use(AmplifyPlugin, AmplifyModules)

Vue.config.productionTip = false

import Dashboard from './components/Dashboard.vue'
import Authenticator from './components/AwsAuthenticator.vue'
import ServerViewVue from './components/ServerView.vue'
import ServerAddVue from './components/ServerAdd.vue'
import ServerDeleteVue from './components/ServerDelete.vue'


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { name: "Dashboard",
      path: '/',
      component: Dashboard,
      props: true,
      meta: {
        private: true
      }
    },
    { name: "Sign-out",
      path: '/sign-out',
      component: Authenticator,
      beforeEnter: (to, from, next) => {
        Amplify.Auth.signOut()
          .then(() => {
            AmplifyEventBus.$emit('authState', 'signedOut')
          })
        next({ name: 'Sign-in'})
      }
    },
    { name: "Sign-in",
      path: '/sign-in',
      component: Authenticator
    },
    {
      name: "Add-server",
      path: "/server/add/:serverUrl",
      component: ServerAddVue,
      props: true,
      meta: {
        private: true
      }
    },
    {
      name: "View-server",
      path: "/server/view/:serverUrl",
      component: ServerViewVue,
      meta: {
        private: true
      },
      props: true
    },
    {
      name: "Edit-server",
      path: "/server/edit/:serverUrl",
      // component: ServerEditVue,
      props: true,
      meta: {
        private: true
      }
    },
    {
      name: "Delete-server",
      path: "/server/edit/:serverUrl",
      component: ServerDeleteVue,
      props: true,
      meta: {
        private: true
      }
    },


    /*
    { path: '/', component: Hello }, // No props, no nothing
    { path: '/hello/:name', component: Hello, props: true }, // Pass route.params to props
    { path: '/static', component: Hello, props: { name: 'world' }}, // static values
    { path: '/dynamic/:years', component: Hello, props: dynamicPropsFn }, // custom logic for mapping between route and props
    { path: '/attrs', component: Hello, props: { name: 'attrs' }}
  */ ],
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.private)) {
    Amplify.Auth.currentAuthenticatedUser()
      .then(data => {
        next()
      })
      .catch(err => {
        next({
          name: "Sign-in",
          query: {
            redirect: to.fullPath
          }
        })
      })
    }
    next()
})


new Vue({
  data: {
    userProfile: null,
    userServers: []
  },
  created: function () {
    this.$Amplify.Auth.currentAuthenticatedUser()
      .then((user) => {
        this.userProfile = user
      })
      .catch((err) => {
        this.userProfile = null
      })

      AmplifyEventBus.$on('authState', info => {
        /* const awsAuthStates = [
          'signedOut',
          'signUp',
          'confirmSignUp',
          'confirmSignIn',
          'forgotPassword',
          'signedIn',
          'setMfa',
          'requireNewPassword'
        ]*/
        console.log(`auth event: ${info}`)
        if (info === 'signedIn') {
          this.$Amplify.Auth.currentAuthenticatedUser()
            .then((user) => {
              this.userProfile = user
              this.$router.push({name: 'Dashboard'})
            })
            .catch((err) => {
              this.userProfile = null
            })
        } else if (info === 'signedOut') {
          this.userProfile = null
        }
      });
  },
  router,
  render: h => h(App),
}).$mount('#app')
