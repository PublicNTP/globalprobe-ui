<template>
    <b-container>
        <b-row class="py-2 w-75 mx-auto">
            <b-col>
                Are you sure you want to delete {{ serverUrl }}?
            </b-col>
        </b-row>
        <b-row class="py-1 w-75 mx-auto">
            <b-col>
                <b-button @click.prevent="onConfirmDelete" variant="danger">Delete Server</b-button>
            </b-col>
            <b-col>
                <b-button :to="{name: 'Dashboard'}" variant="primary">Cancel</b-button>
            </b-col>
        </b-row>
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
    methods: {
        onConfirmDelete: function () {
            // FUTURE Should we be cleaner than straight interpolation on this path?
            this.$Amplify.API.del("GlobalProbeAPI", `/server/${this.serverUrl}`)
                .then((data) => {
                    this.$router.push({name: "Dashboard"})
                })
                .catch((err) => {
                    console.log("Error deleting server")
                    console.log(err)
                })
        }
    }
}
</script>
