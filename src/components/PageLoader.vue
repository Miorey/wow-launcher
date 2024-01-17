<template>
    <v-overlay :value="isLoaded">
        <v-card v-if="isLoaded">
            <v-card-title>
                {{ `page_loading` }}
            </v-card-title>
            <v-card-text>
                {{`warning_message`}}
                <ul>
                    <li>
                        {{ `warn_storage` }} {{ (loaded.storage)?`ok`:`...` }}
                    </li>
                    <li>
                        {{ `warn_ftp` }} {{ (loaded.ftp_cli)?`ok`:`...` }}
                    </li>
                    <li>
                        {{ `patches` }} {{ (loaded.patches)?`ok`:`...` }}
                    </li>
                </ul>
            </v-card-text>
        </v-card>
        <div class="swimming_murloc"></div>
    </v-overlay>
</template>

<script>
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loaded } = require(`../event-bus`);
export default {
  name: `PageLoader`,
  data: () => ({
    loaded: loaded
  }),

  computed: {
    isLoaded: function () {
      return !this.loaded.storage || !this.loaded.ftp_cli || !this.loaded.patches;
    }
  },

};
</script>

<style>
</style>