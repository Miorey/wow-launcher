<template>
  <div>
    <span class="display-1 text_wow_style section_title">{{ $t(`lbl_game_options`) }}</span>
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
const Store = require(`electron-store`);


export default {
  name: `GameOptions`,

  data: () => ({
    selected: null,
    patchManager: patchManager,
    language: patchManager.language
  }),
  async mounted() {
    this.selected = patchManager.selectedPatches;
  },
  watch: {
    'selected'(val) {

      const store = new Store({
        cwd: `storage`,
        name: `selectedPatch${this.language}`
      });
      store.set(`updated`, new Date());
      store.set(`patches`, val);
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