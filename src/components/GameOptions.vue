<template>
  <div>
    <span class="display-1 text_wow_style section_title">{{ `lbl_game_options` | trans }}</span>
    <div v-for="item in getPatchList()" :key="item.id">
      <input
          :disabled="patchManager.downloadInProgress"
          v-model="selected" type="checkbox"
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
// eslint-disable-next-line no-unused-vars
const { config } = require(`../config`);
export default {
    name: `GameOptions`,

    data: () => ({
        selected: null,
        percent: undefined,
        filePath: undefined,
        percentTotal: 0,
        patchManager: patchManager,
        language: patchManager.language
    }),
    mounted() {
        this.selected = patchManager.selectedPatches;
    },
    watch: {
        'selected'(val) {
            storage.set(`selectedPatch${this.language}`, { updated: (new Date()), patches: val }, (error) => {
                if (error) throw error;
            });
            patchManager.selectedPatches =  (val) ? val : [];
        }
    },

    methods: {
        getPatchList() {
            return patchManager.patchList.optional;
        }
    }
};
</script>
<style scoped>
.section_title {
  font-family: "LifeCraft", serif !important;
}
</style>