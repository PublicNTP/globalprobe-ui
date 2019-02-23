<template>
    <div id="app">

      <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-brand @click="showDashboard" href="#">PublicNTP Global Probe</b-navbar-brand>

        <b-navbar-toggle target="nav_collapse" />

        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav v-if="!signedIn" class="ml-auto">
            <b-nav-item @click="signIn">Sign In</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav v-if="signedIn" class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using button-content slot -->
              <template slot="button-content"><em>{{ signedInProfile ? signedInProfile.attributes.email : "" }}</em></template>
              <b-dropdown-item @click="showProfile">Profile</b-dropdown-item>
              <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>

      <div v-if="displayMap.showAuthenticator" class="container" >
        <div  id="aws-authenticator" >
          <amplify-authenticator :authConfig="awsAuthOptions"></amplify-authenticator>
        </div>
      </div>

      <div v-if="displayMap.showDashboard" class="container">
       <dashboard-view :profile="signedInProfile"/>
      </div>
    </div>
</template>

<script>

import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'app',
  components: {
    'dashboard-view': Dashboard
  },
  async beforeCreate() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.signedInProfile = user
      this.signedIn = true
      
    } catch (err) {
      this.signedIn = false
      this.signedInProfile = null
    }

    AmplifyEventBus.$on('authState', info => {
      const awsAuthStates = [
        'signedOut',
        'signUp',
        'confirmSignUp',
        'confirmSignIn',
        'forgotPassword',
        'signedIn',
        'setMfa',
        'requireNewPassword'
      ]
      console.log(`auth event: ${info}`)
      if (info === 'signedIn') {
        Auth.currentAuthenticatedUser()
          .then((user) => {
            console.log(this)
            this.signedInProfile = user
            this.signedIn = true
            this.displayMap = this.updateDisplayMap('dashboard')
          })
          .catch((err) => {
            this.signedInProfile = null
            this.signedIn = false
          })
      } else if (awsAuthStates.indexOf(info) > -1) {
        this.displayMap = this.updateDisplayMap('authenticator')
      } else {
        this.signedInProfile = null
        this.signedIn = false
        this.displayMap = this.updateDisplayMap('dashboard')
      }
     
    });
  },
  data () {
    return {
      displayMap: {
        showDashboard: true,
        showAuthenticator: false
      },
      signedIn: false,
      signedInProfile: null,
      awsAuthOptions: {
        signInConfig: {
          header: this.$Amplify.I18n.get('Sign In Account'),
          username: '',
          isSignUpDisplayed: true
        },
        signUpConfig: {
          hideAllDefaults: true,
          hiddenDefaults: ['phone_number', 'email'],
          signUpFields: [ {
              label: "Email Address",
              key: "username",
              required: true,
              displayOrder: 1,
              type: "email",
              custom: false
            }, {
              label: "Password",
              key: "password",
              required: true,
              displayOrder: 2,
              type: "password",
              custom: false
            }
          ]
        }
      }
    }
  },
  methods: {
    signOut: function () {
      Auth.signOut()
        .then(() => {
          console.log('Signed out')
        })
        .catch((err) => {
          console.log("Error signing out")
          console.log(err)
        })

      this.signedInProfile = null
      this.signedIn = false
      this.displayMap = this.updateDisplayMap('dashboard')
    },
    signIn: function () {
      this.displayMap = this.updateDisplayMap('authenticator')
    },
    showProfile: function () {
      // console.log('show profile')
    },
    showDashboard: function () {
      this.displayMap = this.updateDisplayMap('dashboard')
    },
    updateDisplayMap: function (state) {
      return {
        showAuthenticator: state === 'authenticator',
        showDashboard: state === 'dashboard'
      }
    }
  }
}
</script>

<style>
body {
  margin: 0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.signout {
  background-color: #ededed;
  margin: 0;
  padding: 11px 0px 1px;
}

#aws-authenticator {
  padding: 1em;
}

</style>
