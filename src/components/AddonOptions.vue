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
export default {
    name: `AddonOptions`,
    data: () => ({
        patchManager: patchManager,
        language: patchManager.language,
        selected: false
    }),
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