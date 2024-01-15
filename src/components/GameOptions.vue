<template>
  <div>
    <span class="display-1 text_wow_style section_title">{{ `lbl_game_options` }}</span>
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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { patchManager } = require(`../patchManager`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const storage = require(`electron-json-storage`);

export default {
  name: `GameOptions`,

  data: () => ({
    selected: null,
    patchManager: patchManager,
    language: patchManager.language
  }),
  async mounted() {
    this.selected = await patchManager.selectedPatches;
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