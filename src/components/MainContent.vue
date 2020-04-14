<template>
  <v-container id="main">
    <v-row class="text-center">
      <v-col cols="12">
        <div v-if="selectedPatch">
          <v-checkbox v-for="item in getPatchList()" v-model="selectedPatch" :key="item.name" :label="item.name" :value="item.name"></v-checkbox>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>


// eslint-disable-next-line no-unused-vars
const { config } = require(`../config`)
const { patchManager } = require(`../patchManager`)
const storage = require(`electron-json-storage`)
export default {
    name: `MainContent`,
    data: () => ({
        selectedPatch: null
    }),
    watch: {
        'selectedPatch'(val) {
            storage.set(`selectedPatch`, { updated: (new Date()), patches: val }, function(error) {
                if (error) throw error
            })

            patchManager.selectedPatches = val
            console.log(val)
            console.log(patchManager.generateDownloadFiles())
        }
    },
    mounted() {
        const _this = this
        storage.get(`selectedPatch`, (error, data) => {
            if (error) { throw error }
            if(!data.updated) {
                _this.selectedPatch = patchManager.allPatches()
            } else {
                _this.selectedPatch = data.patches
            }
            patchManager.selectedPatches = _this.selectedPatch
        })
    },
    methods: {
        getPatchList() {
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