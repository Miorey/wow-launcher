<template>
  <v-container id="main">
    <v-row class="text-center">
      <v-col cols="12">
        <v-checkbox v-model="selectedPatch" label="John" value="John"></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>


// eslint-disable-next-line no-unused-vars
const { config } = require(`../config`)
const { patchManager } = require(`../patchManager`)
export default {
    name: `MainContent`,
    data: () => ({
        selectedPatch: []
    }),
    mounted() {
        patchManager.patchList = `test`
    }
}
</script>
<style>
#main {

  background: #211510 url(/images/mv.jpg) no-repeat fixed;
  width: 100%;
  height: 450px;
}
</style>