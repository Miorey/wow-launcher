<template>
    <v-overlay :value="countOverlay !== 0">
        {{ countOverlay }}
        <img src="/images/murloc_swim.gif">
    </v-overlay>
</template>

<script>
const { EventBus } = require(`../event-bus`)
export default {
    name: `PageLoader`,
    data: () => ({
        countOverlay: 0
    }),
    async  mounted() {
        const _this = this
        EventBus.$on(`event_loader_start`,  () => {
            _this.countOverlay++
            console.log(`event_loader_start`, _this.countOverlay)
        })
        EventBus.$on(`event_loader_stop`,  () => {
            _this.countOverlay--
            console.log(`event_loader_stop`, _this.countOverlay)
        })
    }

}
</script>

<style scoped>

</style>