<template>
    <v-overlay :value="isLoaded">
        <v-card v-if="isLoaded">
            <v-card-title>
              {{ $t(`page_loading`) }}
            </v-card-title>
            <v-card-text>
              {{ $t(`warning_message`) }}
                <ul>
                    <li>
                      {{ $t(`warn_storage`) }} {{ (loaded.storage)?`ok`:`...` }}
                    </li>
                    <li>
                      {{ $t(`warn_ftp`) }} {{ (loaded.ftp_cli)?`ok`:`...` }}
                    </li>
                    <li>
                      {{ $t(`patches`) }} {{ (loaded.patches)?`ok`:`...` }}
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