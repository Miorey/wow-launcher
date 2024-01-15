import Vue from 'vue';
import vuetify from './plugins/vuetify';
try {

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { patchManager } = require(`./patchManager`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const App = require(`./App.vue`).default;
  Vue.config.productionTip = false;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Translator = require(`./trans/translator`);

  /**
     *
     * @param value
     * @param {{}} params
     * @returns {*}
     */
  Translator.qTranslate = function (value, params) {
    return this.translate(patchManager.language, value, params);
  };

  Vue.config.errorHandler = function(err, vm, info) {
    console.error(`Vue Launcher Error: ${err.toString()}\nInfo: ${info}`);
    alert(Translator.qTranslate(`app_error`, {}));
  };

  // translate filter
  Vue.filter(`trans`, function (value, params) {
    return Translator.qTranslate(value, params);
  });

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