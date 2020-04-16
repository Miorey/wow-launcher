/**
 * Created by clem on 25/02/17.
 */
'use strict'

const translator = {

    readProp: function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop) ? obj[prop] : false
    },

    translate: function (lang, label, params) {
        if (!lang || !label) {
            throw new Error(`Translator input error`)
        }

        if (!this.dictionary) {
            throw new Error(`Translator dictionary is missing`)
        }

        const element = this.readProp(this.dictionary, label)

        if (!element) {
            return label
        }

        const translation = this.readProp(element, lang)

        if (!translation) {
            return label
        }

        return this.replaceParams(translation, params)
    },

    /**
     * Replace each keyword from translated text by params
     * @param {string} translated
     * @param {{}} params;
     * @returns {string}
     */
    replaceParams (translated, params) {
        let retStr = translated

        for (const key in params) {
            if (!Object.prototype.hasOwnProperty.call(params, key)) {
                continue
            }

            retStr = retStr.replace(key, params[key])
        }
        return retStr
    }
}

translator.dictionary = require(`./dictionary`)

module.exports = translator
