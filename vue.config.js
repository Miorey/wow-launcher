module.exports = {
    "transpileDependencies": [
        `vuetify`
    ],

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: `MV-Launcher`,
                icon: (process.platform === `darwin`)?`./public/wow.png`:`./public/wow.ico`

            },
        }

    },
    
}