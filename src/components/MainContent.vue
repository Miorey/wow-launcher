<template>
  <v-container id="main">
    <v-row class="text-left">
      <v-col v-if="selectedPatch !== null" cols="12">
        <span id="main_title" class="display-1 text_wow_style">{{ `main_title` | trans }}</span>
        <div v-for="item in getPatchList()" :key="item.id">
          <input :disabled="patchManager.downloadInProgress" v-model="selectedPatch" type="checkbox" :id="item.id" :value="item.id" style="margin-right: 10px;">
          <label class="wow_text" :for="item.id">{{ item.name[language] }}</label>
        </div>
      </v-col>
    </v-row>
    <div id="progress">
      <v-progress-linear
              :value="percent"
              class="progress"
              color="blue accent-4"
              height="30"
              background-opacity="0.5"
      >{{ filePath }}</v-progress-linear>
      <v-progress-linear
              :value="percentTotal"
              class="progress"
              color="blue accent-4"
              height="30"
              background-opacity="0.5"
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
        percentTotal: undefined,
        patchManager: patchManager,
        language: patchManager.language
    }),
    watch: {
        'selectedPatch'(val) {
            storage.set(`selectedPatch${this.language}`, { updated: (new Date()), patches: val }, function(error) {
                if (error) throw error
            })
            patchManager.selectedPatches =  (val) ? val : []
        }
    },
  
    async  mounted() {
        const _this = this
        EventBus.$on(`event_file_percent`,  (percent) => {
            _this.percent = percent
        })
        EventBus.$on(`event_total_percent`,  (percentTotal) => {
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
                storage.get(`selectedPatch${this.language}`, (error, data) => {
                    if (error) {
                        reject(error)
                    } else {
                        EventBus.$emit(`event_loader_stop`,  `storage`)
                    }
                    if(!data.updated) {

                        resolve([])
                    } else {
                        resolve(data.patches)
                    }
                })
            })
        },
    }
}
</script>
<style>
#main {
  width: 100%;
  height: 400px;
  position: relative;
}

#progress {
  position: absolute;
  bottom: 30px;
  width: calc(100% - 30px);
  margin: auto;
}

#main_title {
  font-family: "LifeCraft" !important;
}

.progress {
  border: 1px solid #d3b359;
  margin-bottom: 10px;
}
</style>