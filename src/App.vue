<template>
    <div id="app">

      <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-brand :to="{name: 'Dashboard'}">PublicNTP Global Probe</b-navbar-brand>

        <b-navbar-toggle target="nav_collapse" />

        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="ml-auto">
            <!-- <b-nav-item v-if="!isSignedIn" :to="{name: 'Sign-in'}">Sign In</b-nav-item> -->
            <b-nav-item v-if="isSignedIn" :to="{name: 'Dashboard'}">Dashboard</b-nav-item>
            <b-nav-item v-if="isSignedIn" :to="{name: 'View-profile'}">Profile</b-nav-item>
            <b-nav-item v-if="isSignedIn" :to="{name: 'Sign-out'}">Sign Out</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <!-- <b-navbar-nav v-if="user" class="ml-auto">
            <b-nav-item-dropdown right> -->
              <!-- Using button-content slot -->
              <!-- <template slot="button-content"><em>{{ user ? user.attributes.email : "" }}</em></template>
              <b-dropdown-item :to="{name: 'View-profile'}">Profile</b-dropdown-item>
              <b-dropdown-item>
                <b-link :to="{name: 'Sign-out'}">Sign Out</b-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav> -->

        </b-collapse>
      </b-navbar>

      <!-- <keep-alive> -->
        <router-view/>
      <!-- </keep-alive> -->

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
  data () {
    return {

    }
  },
  computed: {
    isSignedIn: function () {
      return this.$root.$data.userProfile !== null
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
