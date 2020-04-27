module.exports = {
    "transpileDependencies": [
        `vuetify`
    ],

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: `MV-Launcher`,
                icon: `./public/wow.ico`

            },
        }

    },
    
}