<template>
    <b-container>
        <b-row>
          <b-col>
            <h1>Server History</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="font-weight-bold">Server URL</span>: {{ serverUrl }}
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <span class="font-weight-bold">Server IP</span>: {{ serverIpAddr }}
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <h4>NTP Time Offset</h4>
          </b-col>
        </b-row>
        <b-row>
            <b-col>
            <div id="ntp_offset_plot">
                <div v-if="this.isFetchingHistory">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                </div>
            </div>
            </b-col>
        </b-row>
        <b-table v-if="!this.isFetchingHistory" :fields="commonTblFields" :items="ntpOffsetTblItems"/>
        <b-row>
            <b-col>
                <h4>Response Delay</h4>
                <div id="latency_plot">
                    <div v-if="this.isFetchingHistory">
                        <b-spinner class="align-middle" />
                        <strong>Loading...</strong>
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-table v-if="!this.isFetchingHistory" :fields="commonTblFields" :items="responseDelayTblItems"/>
    </b-container>
</template>

<script>
const d3 = require("d3")

export default {
    props: {
        serverUrl: {
            default: function () {
                return undefined
            },
            type: String
        },
        serverIpAddr: {
            default: function () {
                return undefined
            },
            type: String
        }
    },
    data: function () {
        return {
            margin: {
                top: 20,
                right: 15,
                bottom: 60,
                left: 60
            },
            num_secs: 86400,  // 24 hours
            //num_secs: 3600,  // 1 hours
            history: undefined,
            isFetchingHistory: false,
            colorScheme: d3.scaleOrdinal(d3.schemeCategory10)
        }
    },
    computed: {
        width: function () {
            // TODO Handle resize event for constraining viewport into svg charts
            //console.log(`Screen says it is ${screen.width}`)
            //console.log(`Window says it's ${window.innerWidth} ${window.outerWidth}`)
            return 960 - this.margin.left - this.margin.right
        },
        height: function () {
            return 500 - this.margin.top - this.margin.bottom
        },
        probeSiteNames: function () {
            return Object.keys(this.history || {})
        },
        commonTblFields: function () {
            return [
                {
                    key: "probeSite",
                    label: "Probe Site",
                },
                {
                    key: "mean",
                    label: "Mean (ms)",
                },
                {
                    key: "stddev",
                    label: "Std. Dev (ms)",
                }
              ]
        },
        ntpOffsetTblItems: function () {
            return this.probeSiteNames.map(x => {
                return {
                    probeSite: x,
                    mean: this.getAvgNtpOffsetMs(x).toFixed(2),
                    stddev: this.getNtpOffsetDeviationMs(x).toFixed(2)
                }
            })
        },
        responseDelayTblItems: function () {
            return this.probeSiteNames.map(x => {
                return {
                    probeSite: x,
                    mean: this.getAvgRespDelayMs(x).toFixed(2),
                    stddev: this.getRespDelayDeviationMs(x).toFixed(2)
                }
            })
        }

    },
    methods: {
        fetchHistory: function () {
            this.isFetchingHistory = true
            let resourceUrl = `/server/history/last_n_secs/${this.num_secs}/fqdn/${this.serverUrl}`
            //console.log(`Get history from ${resourceUrl}`)
            this.$Amplify.API.get("GlobalProbeAPI", resourceUrl)
                .then((data) => {
                    // The data should be seen as "from this probe site to this IP address"
                    // console.log('raw data')
                    // console.log(data)
                    this.history = this.sanitizeHistoryData(data[this.serverUrl][this.serverIpAddr])
                    this.isFetchingHistory = false

                    this.drawNtpOffsetPlot('ntp_offset')
                    this.drawLatencyPlot()
                })
                .catch((err) => {
                    console.log('Error getting history')
                    console.error(err)
                    this.isFetchingHistory = false
                })
        },
        sanitizeHistoryData: function (data) {
            var series = {}
            data.forEach(element => {
                if (!series[element.probe_site]) {
                    series[element.probe_site] = []
                }
                series[element.probe_site].push({
                    time: Date.parse(element.response_received),
                    ntp_offset: 1000.0 * element.local_remote_utc_offset_secs,
                    latency: 1000.0 * element.round_trip_time_secs
                })
            });
            return series
        },
        drawNtpOffsetPlot: function (fieldName) {
            let color = this.colorScheme

            var chart = d3.select(`#${fieldName}_plot`)
                .append("svg:svg")
                .attr("width", this.width + this.margin.right + this.margin.left)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .attr("class", "chart")

            var main = chart.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("class", "main")

            var x = d3.scaleTime()
                .domain([ // Assumes the history list is in ascending order
                    d3.min(Object.values(this.history),
                        series => { return series[0].time }),
                    d3.max(Object.values(this.history),
                        series => { return series[series.length-1].time })
                ])
                .range([0, this.width])

            var xAxis = d3.axisBottom()
                .scale(x)

            var y = d3.scaleLinear()
                .domain([
                    d3.min(Object.values(this.history), series => {
                        return d3.min(series, element => { return element[fieldName] })
                    }),
                    d3.max(Object.values(this.history), series => {
                        return d3.max(series, element => { return element[fieldName] })
                    })])
                .range([this.height, 0])

            var yAxis = d3.axisLeft()
                .scale(y)

            main.append("g")
                .attr("transform", "translate(0," + this.height + ")")
                .attr("class", "main axis date")
                .call(xAxis)

            main.append('line')
                .style("stroke", "LightGray")
                .style("fill", "none")
                .style("shape-rendering", "crispEdges")
                .style("stroke-dasharray", "0.2em")
                .attr('x1', x(x.domain()[0]))
                .attr('y1', y(0))
                .attr('x2', x(x.domain()[1]))
                .attr('y2', y(0));

            main.append("text")
                .attr('transform', 'rotate(-90)')
                .attr("x", -0.5 * this.height )
                .attr("y", -50 )
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Milliseconds");

            main.append("g")
                .attr("transform", "translate(0,0)")
                .attr("class", "main axis date")
                .call(yAxis)

            for (let [probe_site, probe_history] of Object.entries(this.history)) {
                // Each probe site is a line
                let line = d3.line()
                    .x((d, i) => { return x(d.time)})
                    .y((d, i) => { return y(d[fieldName])})
                    .curve(d3.curveCardinal.tension(0.1))

                main.append("svg:path")
                    .attr("d", line(probe_history))
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", color(probe_site))
            }


            let legendY = this.height + 30
            let legendX = 40
            let height = this.height
            let width = this.width
            var legend = main.append("g")
                .attr("class", "legend")
                .attr("height", 100)
                .attr("width", 100)
                .style("fill", "none")
                .attr("transform", `translate(${legendX}, ${legendY})`)

            legend.selectAll("rect")
                .data(Object.keys(this.history))
                .enter()
                .append("rect")
                .attr("x", function (d, i) { return (i * 80) })
                .attr("y", 0)
                .attr("width", 16)
                .attr("height", 16)
                .style("fill", function (d, i) { return color(d)})

            legend.selectAll("text")
                .data(Object.keys(this.history))
                .enter()
                .append("text")
                .attr("x", function (d, i) { return (i * 80) + 16 } )
                .attr("y", 0)
                .attr("dy", "1em")
                .attr("dx", "0.2em")
                .style("fill", function (d, i) { return color(d)})
                .style("font", "12px sans-serif")
                .text(function (d) { return d;})


        },
        drawLatencyPlot: function () {
            let color = this.colorScheme
            var chart = d3.select("#latency_plot")
                .append("svg:svg")
                .attr("width", this.width + this.margin.right + this.margin.left)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .attr("class", "chart")

            var main = chart.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("class", "main")

            var x = d3.scaleTime()
                .domain([ // Assumes the history list is in ascending order
                    d3.min(Object.values(this.history),
                        series => { return series[0].time }),
                    d3.max(Object.values(this.history),
                        series => { return series[series.length-1].time })
                ])
                .range([0, this.width])

            var xAxis = d3.axisBottom()
                .scale(x)

            main.append("g")
                .attr("transform", "translate(0," + this.height + ")")
                .attr("class", "main axis date")
                .call(xAxis)

            main.append("text")
                .attr('transform', 'rotate(-90)')
                .attr("x", -0.5 * this.height )
                .attr("y", -50 )
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Milliseconds");

            var y = d3.scaleLinear()
                .domain([
                    0,
                    d3.max(Object.values(this.history), series => {
                        return d3.max(series, element => { return element.latency })
                    })
                ])
                .range([this.height, 0])

            var yAxis = d3.axisLeft()
                .scale(y)

            main.append("g")
                .attr("transform", "translate(0,0)")
                .attr("class", "main axis date")
                .call(yAxis)

            for (let [probe_site, probe_history] of Object.entries(this.history)) {
                // Each probe site is a line
                let line = d3.line()
                    .x((d, i) => { return x(d.time)})
                    .y((d, i) => { return y(d.latency)})
                    .curve(d3.curveCardinal.tension(0.1))

                main.append("svg:path")
                    .attr("d", line(probe_history))
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", color(probe_site))
            }


            let legendY = this.height + 30
            let legendX = 40
            let height = this.height
            let width = this.width
            var legend = main.append("g")
                .attr("class", "legend")
                .attr("height", 100)
                .attr("width", 100)
                .style("fill", "none")
                .attr("transform", `translate(${legendX}, ${legendY})`)

            legend.selectAll("rect")
                .data(Object.keys(this.history))
                .enter()
                .append("rect")
                .attr("x", function (d, i) { return (i * 80) })
                .attr("y", 0)
                .attr("width", 16)
                .attr("height", 16)
                .style("fill", function (d, i) { return color(d)})

            legend.selectAll("text")
                .data(Object.keys(this.history))
                .enter()
                .append("text")
                .attr("x", function (d, i) { return (i * 80) + 16 } )
                .attr("y", 0)
                .attr("dy", "1em")
                .attr("dx", "0.2em")
                .style("fill", function (d, i) { return color(d)})
                .style("font", "12px sans-serif")
                .text(function (d) { return d;})


        },
        getAvgNtpOffsetMs: function (probeSiteName) {
            return d3.mean(this.history[probeSiteName], d => { return d.ntp_offset})
        },
        getNtpOffsetDeviationMs: function (probeSiteName) {
            return d3.deviation(this.history[probeSiteName], d => { return d.ntp_offset})
        },
        getAvgRespDelayMs: function (probeSiteName) {
            return d3.mean(this.history[probeSiteName], d => { return d.latency})
        },
        getRespDelayDeviationMs: function (probeSiteName) {
            return d3.deviation(this.history[probeSiteName], d => { return d.latency})
        }

    },
    created: function () {
        this.fetchHistory()
    },
}

</script>

<style>


.main text {
    font: 10px sans-serif;
}

.axis line, .axis path {
    shape-rendering: crispEdges;
    stroke: black;
    fill: none;
}

.circle {
    fill: steelblue;
}


</style>
