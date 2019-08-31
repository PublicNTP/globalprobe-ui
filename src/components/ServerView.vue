<template>
    <b-container>
        <b-row>
            <b-col>
                <h3>Server Details</h3>
                <b-table stacked :busy="isFetchingServer" :fields="fields" :items="[this.server]">
                    <template slot="table-busy" class="text-center text-danger my-2">
                        <b-spinner class="align-middle" />
                        <strong>Loading...</strong>
                    </template>
                    <template slot="server_addresses" slot-scope="row">
                    <p v-for="addr in row.item.server_addresses" v-bind:key="addr" class="text-sm-left">
                        {{ addr }} <router-link :to="{name: 'View-server-history', params: {serverUrl, serverIpAddr: addr}}">View History</router-link>
                    </p>
                    </template>
                </b-table>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h3>Server Alerts</h3>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

export default {
    props: {
        serverUrl: {
            default: null,
            type: String
        },
    },
    data: function () {
        return {
            server: null,
            serverHistoryData: undefined,
            isFetchingServer: true,
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
                      console.log(x)

                      return x.map((addr) => {
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
            serverHistory: [],
            isFetchingServerHistory: true,
            sortServerHistoryBy: "response_received",
            sortServerHistoryDesc: true,
            serverHistoryCurPage: 1,
            serverHistoryPerPage: 10,
            /* historyTblFields: [
                {
                    key: "request_sent",
                    label: "Request Sent",
                }
            ] */
        }
    },
    computed: {
        items: function () {
            if (this.server) {
                return [this.server]
            }
            return []
        },
        serverIpAddresses: function () {
            if (this.server && this.serverHistoryData) {
                return this.server.server_addresses
            }
            return []
        },
        probeSites: function () {
            if (this.server && this.serverHistoryData) {
                for (var ipaddr in this.serverHistoryData[this.serverUrl]) {
                    
                }
                return []
            }
            return []
        },
        /*
        serverHistoryDataSeries: function () {
            var dataSeries = {}
            for (var ipaddr in this.serverHistoryData) {
                for (var i in this.serverHistoryData[ipaddr]) {
                    let dataSeriesLabel = `${this.serverHistoryData[ipaddr][i].probe_site} to ${ipaddr}`
                    dataSeries[dataSeriesLabel] = this.serverHistoryData[ipaddr][i]
                }
            }
            return dataSeries
        }*/
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
                        console.log("Fetching server history")
                        //this.fetchHistory()

                    }
                    // TODO Error flash
                    this.isFetchingServer = false
                })
                .catch((err) => {
                    this.isFetchingServer = false
                    console.log('Error fetching server details')
                    console.error(err)
                })
        },
        fetchHistory: function () {
            if (this.server) {
                this.isFetchingServerHistory = true
                //let num_secs = 86400;  // 24 hours
                let num_secs = 3600;  // 1 hours
                let resourceUrl = `/server/history/last_n_secs/${num_secs}/fqdn/${this.serverUrl}`
                console.log(`Get history from ${resourceUrl}`)
                this.$Amplify.API.get("GlobalProbeAPI", resourceUrl)
                    .then((data) => {
                        // The data should be seen as "from this probe site to this IP address"
                        console.log('raw data')
                        console.log(data)
                        this.serverHistoryData = data[this.serverUrl]
                        this.isFetchingServerHistory = false
                    })
                    .catch((err) => {
                        console.log('Error getting history')
                        console.error(err)
                        this.isFetchingServerHistory = false
                    })
            } else {
                console.error("No server set")
                this.isFetchingServerHistory = false
            }
            
        },
    }
}
</script>

<style>

</style>
