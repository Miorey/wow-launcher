<template>
  <v-container id="main">
    <v-row class="text-left">
      <v-col cols="12">
        <span id="main_title" class="display-1 text_wow_style">{{ `main_title` | trans }}</span>
        <game-options></game-options>
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
const { EventBus } = require(`../event-bus`);
export default {
    name: `MainContent`,
    components: {GameOptions},
    data: () => ({
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

#main_title {
  font-family: "LifeCraft", serif !important;
}

.progress {
  border: 1px solid #d3b359;
  margin-bottom: 10px;
}
</style>