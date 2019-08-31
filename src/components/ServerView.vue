<template>
    <b-container>
        <h3>Server Details</h3>
        <b-table stacked :busy="isFetchingServer" :fields="fields" :items="[this.server]">
            <template slot="table-busy" class="text-center text-danger my-2">
                <b-spinner class="align-middle" />
                <strong>Loading...</strong>
            </template>
            <template slot="server_addresses" slot-scope="row">
              <p v-for="addr in row.item.server_addresses" class="text-sm-left">{{ addr }}</p>
            </template>
        </b-table>
    </b-container>
</template>

<script>
export default {
    props: {
        serverUrl: {
            default: null,
            type: String
        }
    },
    data: function () {
        return {
            server: null,
            isFetchingServer: false,
            fields: [
                {
                    label: "Server URL",
                    key: "server_url",
                    class: "text-sm-left",
                    formatter: () => {
                        return this.serverUrl
                    }
                },
                {
                    key: "display_name",
                    label: "Name",
                    class: "text-sm-left"
                },
                {
                    key: "display_location",
                    label: "Location",
                    class: "text-sm-left"
                },
                {
                    key: "display_description",
                    label: "Description",
                    class: "text-sm-left"
                },
                {
                    key: "server_addresses",
                    label: "Server IP Addresses",
                    formatter: (x) => {
                      console.log("FORMAT")
                      console.log(x)

                      return x.map((addr) => {
                        console.log("MAP")
                        console.log(addr)
                        return `<p>${addr}</p>`
                      })
                    }
                },
                {
                    key: "notes",
                    label: "Notes",
                    class: "text-sm-left"
                },
            ],
        }
    },
    computed: {
        items: function () {
            if (this.server) {
                return [this.server]
            }
            return []
        },
    },
    created: function () {
        this.fetchServer()
    },
    methods: {
        fetchServer: function () {
            this.isFetchingServer = true
            this.$Amplify.API.get("GlobalProbeAPI", "/server/list") // FUTURE This should be able to access individual server or cached data
                .then((data) => {
                    this.isFetchingServer = false
                    var server = data.servers[this.serverUrl]
                    if (server) {
                        this.server = server
                        console.log('server deets')
                        console.log(server)
                    }
                    // TODO Error flash
                    this.isFetchingServer = false
                })
                .catch((err) => {
                    this.isFetchingServer = false
                    console.log('Error fetching server details')
                    console.log(err)
                })
        }

    }

}
</script>

<style>

</style>
