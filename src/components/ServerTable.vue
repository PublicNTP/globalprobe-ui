<template>
    <div>
        <b-table hover :fields="fields" :items="servers" show-empty>
            <template slot="actions" slot-scope="row">
                <b-button-group>
                    <b-button :to="{ name: 'View-server', params: {serverUrl: row.item.url}}" variant="primary" ><i class="fas fa-info-circle"></i>Server Details</b-button>
                    <b-button :disabled="true"><i class="fas fa-edit"></i>Edit</b-button>
                    <b-button :to="{ name: 'Delete-server', params: {serverUrl: row.item.url}}" variant="danger"><i class="fas fa-trash"></i>Delete</b-button>
                </b-button-group>
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

<style lang="css" scoped>
i {
  padding-right: 0.4em

}
</style>
