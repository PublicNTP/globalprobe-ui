<template>
    <div>
        <b-table hover :fields="fields" :items="servers" show-empty>
            <template slot="actions" slot-scope="row">
                <b-button :to="{ name: 'View-server', params: {serverUrl: row.item.url}}">Server Details</b-button>
                <b-button :disabled="true">Edit</b-button>
                <b-button :to="{ name: 'Delete-server', params: {serverUrl: row.item.url}}" variant="danger">Delete</b-button>
            </template>
            <template slot="empty">
                <p class="font-italic text-info">Your are not monitoring any servers.</p>
            </template>
        </b-table>
  </div>
</template>

<script>

export default {
    props: {
        servers: {
            default: function () {
              return []
            },
            type: Array
        }
    },
    data: function() {
        return {
            fields: [
                {
                    key: "display_name",
                    label: "Name",
                },
                {
                    key: "actions",
                }
            ],
            items: []
        }
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>

</style>
