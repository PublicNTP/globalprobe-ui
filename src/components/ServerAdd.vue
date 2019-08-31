<template>
    <b-container>
        <b-form class="w-75 mx-auto" @submit.prevent="onSubmitServer()">
            <b-form-group
                id="serverUrlInputGroup"
                label="Server URL"
                label-for="serverUrl"
                label-cols-md="3"
                label-align-md="right"
                >
                <b-form-input
                    id="serverUrl"
                    class=""
                    type="text"
                    v-model="serverUrl"
                    required
                    placeholder="Enter URL" />
            </b-form-group>
            <b-form-group
                id="serverNameInputGroup"
                label="Server Display Name"
                label-for="serverName"
                label-cols-md="3"
                label-align-md="right"
                >
            <b-form-input
                id="serverName"
                type="text"
                v-model="serverForm.display_name"
                required
                placeholder="Enter Name" />
            </b-form-group>
            <b-form-group
                id="serverLocationInputGroup"
                label="Server Location"
                label-for="serverLocation"
                label-cols-md="3"
                label-align-md="right"
                >
            <b-form-input
                id="serverLocation"
                type="text"
                v-model="serverForm.display_location"
                required
                placeholder="Enter Location" />
            </b-form-group>
            <b-form-group
                id="serverDescriptionInputGroup"
                label="Server Description"
                label-for="serverDescription"
                label-cols-md="3"
                label-align-md="right"
                >
            <b-form-input
                id="serverDescription"
                type="text"
                v-model="serverForm.display_description"
                required
                placeholder="Enter Description" />
            </b-form-group>
            <b-form-group
                id="serverNotesInputGroup"
                label="Server Notes"
                label-for="serverNotes"
                label-cols-md="3"
                label-align-md="right"
            >
                <b-form-textarea
                    id="serverNotes"
                    type="text"
                    v-model="serverForm.notes"
                    required
                    placeholder="Enter Notes"
                />
            </b-form-group>

            <b-form-checkbox
                v-model="serverForm.alerts_enabled"
            >
                Enable Alerts
            </b-form-checkbox>

            <b-form-group
                v-if="serverForm.alerts_enabled"
                id="serverAlertsEnabledGroup"
                label="Server Alerts"
            >

                <b-form-group
                    v-if="serverForm.alerts_enabled"
                    id="serverTimeDrift"
                    label="Time Drift (ms)"
                    label-for="serverTimeDrift"
                    label-cols-md="3"
                    label-align-md="right"
                >
                    <b-form-input
                        id="serverTimeDrift"  
                        v-model="serverForm.time_drift"
                        type="number"
                        min=5
                        step=5
                    />

                </b-form-group>

                <b-form-group
                    v-if="serverForm.alerts_enabled"
                    id="serverMinFailedPings"
                    label="Offline Alert (minutes)"
                    label-for="serverMinutesOffline"
                    label-cols-md="3"
                    label-align-md="right"
                >
                    <b-form-input
                        id="serverMinutesOffline"
                        v-model="serverForm.minutes_offline"
                        type="number"
                        min=1
                    />
                </b-form-group>

            </b-form-group>
            <b-button class="w-75" type="submit" variant="primary">Add Server</b-button>
        </b-form>
    </b-container>
</template>

<script>
export default {
    props: {
        serverUrl: {
            default: "",
            type: String
        }
    },
    data: function () {
        return {
            serverForm: {
                display_name: "",
                display_location: "",
                display_description: "",
                notes: "",
                alerts_enabled: false,
                time_drift: 10,
                minutes_offline: 5,
            }
        }
    },

    methods: {
        onSubmitServer: function () {
            // Example test server URL http://unittest2.globalprobe.dev.publicntp.org/

            var server = {}
            server[this.serverUrl] = this.serverForm
          /*
            this.$Amplify.API.post("GlobalProbeAPI", "/server", {body: server})
                .then((data) => {
                    this.$router.push({name: 'Dashboard'})
                })
                .catch((err) => {
                    console.log('Failed to add server')
                    console.log(err)
                })
           */
        }
    }

}
</script>

<style>

</style>
