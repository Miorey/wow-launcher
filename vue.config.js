module.exports = {
    "transpileDependencies": [
        `vuetify`
    ],

    pluginOptions: {
        i18n: {
            locale: `en`,
            fallbackLocale: `en`,
            localeDir: `locales`,
            enableInSFC: true
        },
        electronBuilder: {
            builderOptions: {
                "productName": `Tern-Subtitle File Translator`
            },
        }
    },
    
}