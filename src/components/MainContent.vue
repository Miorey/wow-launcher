<template>
  <v-container id="main">
    <v-row class="text-center">
      <v-col cols="12">
        <v-checkbox v-for="item in getPatchList()" v-model="selectedPatch" :key="item.name" :label="item.name" :value="item.name"></v-checkbox>
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
    methods: {
        getPatchList() {
            console.log(patchManager.patchList)
            return patchManager.patchList[`optional`]
        }
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