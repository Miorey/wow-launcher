<template>
  <div>
    <div v-for="item in getPatchList()" :key="item.id">
      <input
          :disabled="patchManager.downloadInProgress"
          v-model="selectedPatch" type="checkbox"
          :id="item.id" :value="item.id"
          style="margin-right: 10px;"
      >
      <label class="wow_text" :for="item.id">
        {{ item.name[language] }}
      </label>
    </div>
  </div>
</template>

<script>
const { patchManager } = require(`../patchManager`);
const storage = require(`electron-json-storage`);
const { EventBus } = require(`../event-bus`);
// eslint-disable-next-line no-unused-vars
const { config } = require(`../config`);
export default {
    name: `c`,

    async  mounted() {
        console.log(`GameOptions`);
        this.selectedPatch = await this.findSelectedPatches();
        patchManager.selectedPatches = this.selectedPatch;
    },
    data: () => ({
        selectedPatch: null,
        percent: undefined,
        filePath: undefined,
        percentTotal: 0,
        patchManager: patchManager,
        language: patchManager.language
    }),
    watch: {
        'selectedPatch'(val) {
            storage.set(`selectedPatch${this.language}`, { updated: (new Date()), patches: val }, function(error) {
                if (error) throw error;
            });
            patchManager.selectedPatches =  (val) ? val : [];
        }
    },

    methods: {
        getPatchList() {
            return patchManager.patchList[`optional`];
        },

        /**
         *
         * @returns {Promise<unknown>}
         */
        findSelectedPatches() {
            console.error(`findSelectedPatches`);
            return new Promise((resolve, reject) => {
                storage.get(`selectedPatch${this.language}`, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        EventBus.$emit(`event_loader_stop`,  `storage`);
                    }
                    if(!data.updated) {

                        resolve([]);
                    } else {
                        resolve(data.patches);
                    }
                });
            });
        },
    }
};
</script>

<style scoped>

</style>