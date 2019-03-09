<template>
    <b-container>
        <b-row>
            <b-col>
                Dashboard for {{ profileEmail }}
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                Add a new Monitored NTP Server
            <b-form >
                <b-form-group>
                    <b-input-group>
                        <b-form-input v-model="addServerUrl" placeholder="NTP Server Hostname" />
                        <b-input-group-append>
                            <b-button variant="primary" :disabled="!addServerUrl" :to="{name: 'Add-server', params: {serverUrl: addServerUrl}}">Add Server</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-form>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                Monitored NTP Servers
                <server-table-vue :servers="serversList"/>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>

import { API } from "aws-amplify"
import ServerTableVue from './ServerTable.vue';


export default {
    components: {
        "server-table-vue": ServerTableVue,
    },
    methods: {
        updateServerList: function () {
            this.$Amplify.API.get("GlobalProbeAPI", "/server/list")
                .then((data) => {
                    this.servers = data.servers
                })
                .catch((err) => {
                    console.log("Error retrieving servers list")
                    console.log(err)
                })
        },
    },
    data: function() {
        return {
            addServerUrl: "",
            servers: {},
        }
    },

    computed: {
        profileEmail: function () {
            return this.$root.$data.userProfile ? this.$root.$data.userProfile.attributes.email : ""
        },
        serversList: function () {
            var arr = []
            for (var server in this.servers) { // FUTURE Would be nice if this could just return a list so the copies are unnecessary
                var entry = {
                    url: server,
                    display_name: this.servers[server].display_name,
                    display_location: this.servers[server].display_location,
                    display_description: this.servers[server].display_description,
                    notes: this.servers[server].notes,
                    server_addresses: this.servers[server].server_addresses,
                }
                arr.push(entry)
            }
            return arr
        }
    },
    created: function () {
        this.updateServerList()
    },
    watch: {
        '$route': 'updateServerList'
    }

}
</script>

<style scoped>


</style>
