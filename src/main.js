import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
const { patchManager } = require(`./patchManager`)

Vue.config.productionTip = false

const Translator = require(`./trans/translator`)

/**
 *
 * @param value
 * @param {{}} params
 * @returns {*}
 */
Translator.qTranslate = function (value, params) {
    return this.translate(patchManager.language, value, params)
}

// translate filter
Vue.filter(`trans`, function (value, params) {
    return Translator.qTranslate(value, params)
})

new Vue({
    vuetify,
    render: h => h(App)
}).$mount(`#app`)