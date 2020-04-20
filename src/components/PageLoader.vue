<template>
    <v-overlay :value="countOverlay !== 0 || !loaded.storage || !loaded.ftp_cli">
        <v-card v-if="!loaded.storage || !loaded.ftp_cli">
            <v-card-title>
                {{ `page_loading` | trans }}
            </v-card-title>
            <v-card-text>
                {{`warning_message` | trans}}
                <ul>
                    <li>
                        {{ `warn_storage` | trans }} {{ (loaded.storage)?`ok`:`...` }}
                    </li>
                    <li>
                        {{ `warn_ftp` | trans }} {{ (loaded.ftp_cli)?`ok`:`...` }}
                    </li>
                </ul>
            </v-card-text>
        </v-card>
        <img src="/images/murloc_swim.gif">
    </v-overlay>
</template>

<script>
const { EventBus } = require(`../event-bus`)
export default {
    name: `PageLoader`,
    data: () => ({
        countOverlay: 0,
        loaded: {
            storage: false,
            ftp_cli: false
        }
    }),
    async  mounted() {
        const _this = this
        EventBus.$on(`event_loader_start`,  () => {
            _this.countOverlay++
            console.log(`event_loader_start`, _this.countOverlay)
        })
        EventBus.$on(`event_loader_stop`,  (val) => {
            if(val ) { _this.loaded[val] = true }
            else _this.countOverlay--
            console.log(`event_loader_stop`, _this.countOverlay)
        })
    }

}
</script>

<style scoped>

</style>