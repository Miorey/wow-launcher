<template>
  <v-app id="app">
    <page-loader></page-loader>
    <v-main>
      <main-content v-if="patchManager.patchList" />
    </v-main>
    <v-footer dark>
      <v-row>
        <v-col cols="12" class="text-right">
          <footer-action v-if="patchManager.patchList" />
        </v-col>
        <v-col cols="12" class="py-2 text_wow_style text-center">
          <span id="powered_by">Murloc Village Launcher - v{{ version }}</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import PageLoader from "./components/PageLoader";
import MainContent from './components/MainContent';
import FooterAction from "./components/FooterAction";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { patchManager } = require(`./patchManager`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EventBus } = require(`./event-bus`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const  pjson = require(`../package.json`);

export default {
  name: `App`,

  components: {
    PageLoader,
    MainContent,
    FooterAction,
  },

  data: () => ({
    patchManager: patchManager,
    version: pjson.version,
  }),
  async beforeCreate() {
    patchManager.selectedPatches = patchManager.findSelectedPatches();
    console.log(`patchManager.selectedPatches`, JSON.parse(JSON.stringify(patchManager.selectedPatches)));
    patchManager.selectedAddons = patchManager.findSelectedAddons();
    await patchManager.loadPatches().then(() => true);
  },

  watch: {
    'patchManager.patchList'(val) {
      if(val) {
        EventBus.$emit(`event_loader_stop`,  `patches`);
      }
    }
  }
};
</script>
<style>
  #app {
    height: 100%;
    width: 100%;
  }
  #powered_by {
    font-family: "LifeCraft",serif;
    font-size: large;
  }
</style>
