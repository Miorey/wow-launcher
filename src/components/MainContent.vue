<template>
  <v-container id="main">
    <v-row class="text-left">
      <v-col cols="12">
        <v-tabs
            v-model="tab"
            right
            background-color="transparent"
        >
          <v-tab>Game options</v-tab>
          <v-tab>Addons</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" id="download_options">
          <v-tab-item key="Game options">

            <game-options></game-options>
          </v-tab-item>
          <v-tab-item key="Addons">
            <addon-options></addon-options>
          </v-tab-item>
        </v-tabs-items>
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
      >TOTAL: {{ percentTotal }}%</v-progress-linear>
    </div>
  </v-container>
</template>

<script>



import GameOptions from "@/components/GameOptions";
import AddonOptions from "@/components/AddonOptions";
const { EventBus } = require(`../event-bus`);
export default {
    name: `MainContent`,
    components: {AddonOptions, GameOptions},
    data: () => ({
        tab: null,
        percent: undefined,
        filePath: undefined,
        percentTotal: 0,
    }),
  
    async  mounted() {
        const _this = this;
        EventBus.$on(`event_file_percent`,  (percent) => {
            _this.percent = Math.round(percent * 100) / 100;
        });
        EventBus.$on(`event_total_percent`,  (percentTotal) => {
            _this.percentTotal = Math.round(percentTotal * 100) / 100;
        });
        EventBus.$on(`event_file_path`,  (filePath) => {
            _this.filePath = filePath;
        });
    },

};
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

#download_options {
  background-color: transparent;
}
.progress {
  border: 1px solid #d3b359;
  margin-bottom: 10px;
}
</style>