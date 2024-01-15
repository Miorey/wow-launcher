import Vue from 'vue';
import vuetify from './plugins/vuetify';
try {

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const App = require(`./App.vue`).default;
  Vue.config.productionTip = false;

  // eslint-disable-next-line @typescript-eslint/no-var-requires

  Vue.config.errorHandler = function(err, vm, info) {
    console.error(`Vue Launcher Error: ${err.toString()}\nInfo: ${info}`);
    alert(`APP ERROR`);
  };

  new Vue({
    vuetify,
    render: h => h(App)
  }).$mount(`#app`);
} catch (e) {
  if(process.env.NODE_ENV !== `production`) {
    // DEV
    throw (e);
  } else {
    // Production
    alert(e);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(`electron`).remote.getCurrentWindow().close();
  }
}