<template>
  <div>
    <span class="display-1 text_wow_style section_title">{{ `lbl_addons` | trans }}</span>
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

export default {
    name: `AddonOptions`,
    data: () => ({
        selected: null,
        patchManager: patchManager,
        language: patchManager.language
    }),
    mounted() {
        this.selected = patchManager.selectedAddons;
    },
    watch: {
        'selected'(val) {
            storage.set(`selectedAddon${this.language}`, { updated: (new Date()), addons: val }, (error) => {
                if (error) throw error;
            });
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