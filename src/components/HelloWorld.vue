<template>
  <v-container id="main">
    <v-row class="text-center">
      <v-col cols="12">
        Hello World
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
    }),
  }
</script>
<style>
#main {

  background: #211510 url(/images/mv.jpg) no-repeat fixed;
  width: 100%;
  height: 450px;
}
</style>