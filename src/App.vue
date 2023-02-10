<template>
  <v-app id="app">
    <page-loader></page-loader>
    <v-main>
      <v-toolbar dense v-if="remoteVersion.version !== version">
        <v-spacer></v-spacer>
        <v-btn :disabled="patchManager.downloadInProgress" :href="remoteVersion.link">
          {{ `download_launcher` | trans }}
        </v-btn>
      </v-toolbar>
      <main-content v-if="patchManager.patchList" />
    </v-main>
    <v-footer
            dark
    >
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
import MainContent from './components/MainContent';
import FooterAction from "./components/FooterAction";
import PageLoader from "./components/PageLoader";
const { patchManager } = require(`./patchManager`);
const { EventBus } = require(`./event-bus`);
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
        remoteVersion: {version: pjson.version}
    }),
    async beforeCreate() {
        await patchManager.findSelectedPatches().then(r => patchManager.selectedPatches = r);
        await patchManager.findSelectedAddons().then(r => patchManager.selectedAddons = r);
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
