<template>
  <v-app id="app">
    <v-content>
      <HelloWorld/>
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
        <v-card-title class="teal">

          <v-btn @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
          </v-btn>
          <strong class="subheading">Get connected with us on social networks!</strong>

          <v-spacer></v-spacer>


          <v-btn @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
          </v-btn>
        </v-card-title>

        <v-card-text class="py-2 white--text text-center">
          <span id="powered_by">{{ new Date().getFullYear() }} - Murloc Village</span>
        </v-card-text>
      </v-card>
    </v-footer>

  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
const { shell } = require('electron')

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),

  methods: {
    shellOpenExternal(url) {
      shell.openExternal(url);
    }
  }
};
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
