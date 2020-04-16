<template>
  <v-app id="app">
    <v-content>
      <main-content :patch-object="patchObject"></main-content>
    </v-content>
    <v-footer
            dark
            padless
    >
      <v-card
              class="flex"
              flat
              tile
      >
        <footer-action :patch-object="patchObject" />
        <v-card-text class="py-2 white--text text-center">
          <span id="powered_by">{{ new Date().getFullYear() }} - Murloc Village</span>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import MainContent from './components/MainContent'
import FooterAction from "./components/FooterAction"
export default {
    name: `App`,

    components: {
        MainContent,
        FooterAction,
    },

    data: () => ({
        patchObject: {}
    }),
}
</script>
<style>
  @font-face {
    font-family: "LifeCraft";
    src: url(/images/LifeCraft_Font.ttf) format("truetype");

  }
  #app {
    height: 100%;
    width: 100%;
  }
  #powered_by {
    font-family: "LifeCraft";
    font-size: large;
  }
</style>
