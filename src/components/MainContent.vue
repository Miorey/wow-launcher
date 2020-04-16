<template>
  <v-container id="main">
    <v-row class="text-center">
      <v-col cols="12">
        <div v-if="selectedPatch">
          <v-checkbox v-for="item in getPatchList()" v-model="selectedPatch" :key="item.name" :label="item.name" :value="item.name"></v-checkbox>
        </div>
      </v-col>
    </v-row>
    Teeeeee
    <div id="progress">
      <v-progress-linear
              v-model="percent"
              class="progress"
              color="blue accent-4"
              height="30"
              reactive
      >{{ filePath }}</v-progress-linear>
      BOOM
      <v-progress-linear
              v-model="percentTotal"
              class="progress"
              color="blue accent-4"
              height="30"
              reactive
      >TOTAL</v-progress-linear>
    </div>
  </v-container>
</template>

<script>


// eslint-disable-next-line no-unused-vars
const { config } = require(`../config`)
const { patchManager } = require(`../patchManager`)
const { EventBus } = require(`../event-bus`)
const storage = require(`electron-json-storage`)
export default {
    name: `MainContent`,
    data: () => ({
        selectedPatch: null,
        percent: undefined,
        filePath: undefined,
        percentTotal: undefined
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
  
    async  mounted() {
        const _this = this
        EventBus.$on(`event_file_percent`,  (percent) => {
            _this.percent = percent
        })
        EventBus.$on(`event_total_percent`,  (percentTotal) => {
            console.log(`event_total_percent`, percentTotal)
            _this.percentTotal = percentTotal
        })
        EventBus.$on(`event_file_path`,  (filePath) => {
            _this.filePath = filePath
        })

        this.selectedPatch = await this.findSelectedPatches()
        patchManager.selectedPatches = this.selectedPatch
    },

    methods: {
        getPatchList() {
            return patchManager.patchList[`optional`]
        },

        /**
         *
         * @returns {Promise<unknown>}
         */
        findSelectedPatches() {
            return new Promise((resolve, reject) => {
                storage.get(`selectedPatch`, (error, data) => {
                    if (error) { reject(error) }
                    if(!data.updated) {
                        resolve([])
                    } else {
                        resolve(data.patches)
                    }
                })
            })
        }
        
    }
}
</script>
<style>
#main {
  background: #211510 url(/images/mv.jpg) no-repeat fixed;
  width: 100%;
  height: 450px;
  position: relative;
}

#progress {
  position: absolute;
  bottom: 30px;
  width: calc(100% - 30px);
  margin: auto;
}
.progress {
  border: 1px solid yellow;
}
</style>