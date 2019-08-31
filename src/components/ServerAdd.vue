<template>
    <b-container>
        <b-form class="w-75 mx-auto" @submit.prevent="onSubmitServer()">
            <b-form-group id="serverUrlInputGroup" label="Server URL" label-for="serverUrl">
                <b-form-input
                    id="serverUrl"
                    class=""
                    type="text"
                    v-model="serverUrl"
                    required
                    placeholder="Enter URL" />
            </b-form-group>
            <b-form-group id="serverNameInputGroup" label="Server Display Name" label-for="serverName">
            <b-form-input
                id="serverName"
                type="text"
                v-model="serverForm.display_name"
                required
                placeholder="Enter Name" />
            </b-form-group>
            <b-form-group id="serverLocationInputGroup" label="Server Location" label-for="serverLocation">
            <b-form-input
                id="serverLocation"
                type="text"
                v-model="serverForm.display_location"
                required
                placeholder="Enter Location" />
            </b-form-group>
            <b-form-group id="serverDescriptionInputGroup" label="Server Description" label-for="serverDescription">
            <b-form-input
                id="serverDescription"
                type="text"
                v-model="serverForm.display_description"
                required
                placeholder="Enter Description" />
            </b-form-group>
            <b-form-group id="serverNotesInputGroup" label="Server Notes" label-for="serverNotes">
            <b-form-textarea
                id="serverNotes"
                type="text"
                v-model="serverForm.notes"
                required
                placeholder="Enter Notes" />
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
                notes: ""
            }
        }
    },

    methods: {
        onSubmitServer: function () {
            // Example test server URL http://unittest2.globalprobe.dev.publicntp.org/

            var server = {}
            server[this.serverUrl] = this.serverForm
            this.$Amplify.API.post("GlobalProbeAPI", "/server", {body: server})
                .then((data) => {
                    this.$router.push({name: 'Dashboard'})
                })
                .catch((err) => {
                    console.log('Failed to add server')
                    console.log(err)
                })
        }
    }

}
</script>

<style>

</style>
