<template>
  <div>
    <span class="section_title display-1 text_wow_style">{{ `lbl_addons` | trans }}</span>
    <div v-for="item in getAddons()" :key="item.id">
      <input
          :disabled="patchManager.downloadInProgress"
          v-model="selected" type="checkbox"
          :id="item.id" :value="item.id"
          style="margin-right: 10px;"
      >
      <label class="wow_text" :for="item.id">
        {{ item.name }}
      </label>
    </div>
  </div>
</template>

<script>
const { patchManager } = require(`../patchManager`);
const storage = require(`electron-json-storage`);
const { EventBus } = require(`../event-bus`);
export default {
    name: `AddonOptions`,
    data: () => ({
        selectedAddon: null,
        patchManager: patchManager,
        language: patchManager.language,
        selected: false
    }),
    async  mounted() {
        this.selectedAddon = await this.findSelectedAddons();
        patchManager.selectedAddons = this.selectedAddon;
    },
    watch: {
        'selectedAddon'(val) {
            storage.set(`selectedAddon${this.language}`, { updated: (new Date()), patches: val }, (error) => {
                if (error) throw error;
            });
            patchManager.selectedAddons =  (val) ? val : [];
        }
    },
    methods: {
        getAddons() {
            return patchManager.patchList.addons;
        },

        /**
         *
         * @returns {Promise<unknown>}
         */
        findSelectedAddons() {
            return new Promise((resolve, reject) => {
                storage.get(`selectedAddon${this.language}`, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        EventBus.$emit(`event_loader_stop`,  `storage`);
                    }
                    if(!data.updated) {

                        resolve([]);
                    } else {
                        resolve(data.addons);
                    }
                });
            });
        },
    }
};
</script>
<style scoped>
.section_title {
  font-family: "LifeCraft", serif !important;
}
</style>