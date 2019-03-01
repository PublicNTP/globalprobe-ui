<template>
    <div>
        <div v-if='profile' class='display-4'>
        Dashboard for profile: {{ profile.attributes.email }}
        <!-- <div v-if="!profile"><h1>Im a public dashboard</h1></div>
        <div v-if="profile"><h1>Im an authenticated dashboard for {{profile.email}} </h1></div> -->
        </div>
    </div>
    
</template>

<script>
export default {
    props: {
        profile: {
            default: null,
            type: Object
        }
    }
}
</script>

<style scoped>


</style>