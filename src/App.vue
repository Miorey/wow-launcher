<template>
  <v-app id="app">
    <v-content>
      <main-content :patch-object="patchObject"></main-content>
    </v-content>
    <v-footer
            dark
            padless
    >

      <v-row>
        <v-col cols="12" class="text-right">
          <footer-action :patch-object="patchObject" />
        </v-col>
        <v-col cols="12" class="py-2 text_wow_style text-center">
          <span id="powered_by">{{ new Date().getFullYear() }} - Murloc Village</span>
        </v-col>
      </v-row>
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
