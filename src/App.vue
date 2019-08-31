<template>
    <div id="app">
      <div v-if="!signedIn">
         <amplify-authenticator :authConfig="amplifyAuthConfig"></amplify-authenticator>
      </div>
      <div v-if="signedIn">
        <amplify-sign-out class="signout"></amplify-sign-out>
        <h1>Hello World</h1>
      </div>
    </div>
</template>

<script>

import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'

export default {
  name: 'app',
  async beforeCreate() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.signedIn = true
    } catch (err) {
      this.signedIn = false
    }
    AmplifyEventBus.$on('authState', info => {
      if (info === 'signedIn') {
        this.signedIn = true
      } else {
        this.signedIn = false
      }
    });
  },
  data () {
    return {
      signedIn: false,
      amplifyAuthConfig: {
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
              label: "your password",
              key: "password",
              required: true,
              displayOrder: 2,
              type: "password",
              custom: false
            },
          ],
        }
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
</style>
