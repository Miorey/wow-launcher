<template>
  <div>
    <span class="display-1 text_wow_style section_title">{{ $t(`lbl_addons`) }}</span>
    <div class="addons_list">

      <div v-for="item in getAddons()" :key="item.id">
        <input
            :disabled="patchManager.downloadInProgress"
            v-model="selected" type="checkbox"
            :id="item.id" :value="item.id"
            style="margin-right: 10px;"
        >
        <label class="wow_text" :for="item.id">
          {{ item.name }}:
        </label>
        <span class="addon_text">
        {{ item.description }}
      </span>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { patchManager } = require(`../patchManager`);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Store = require(`electron-store`);

export default {
  name: `AddonOptions`,
  data: () => ({
    selected: null,
    patchManager: patchManager,
    language: patchManager.language
  }),
  async mounted() {
    this.selected = await patchManager.selectedAddons;
  },
  watch: {
    'selected'(val) {
      const store = new Store({
        cwd: `storage`,
        name: `selectedAddon${this.language}`
      });
      store.set(`updated`, new Date());
      store.set(`addons`, val);
      patchManager.selectedAddons = val ? val : [];
    }
  },
  methods: {
    getAddons() {
      return patchManager.patchList.addons;
    }
  }
};
</script>
<style scoped>
.section_title {
  font-family: "LifeCraft", serif !important;
}
</style>