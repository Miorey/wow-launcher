const { defineConfig } = require(`@vue/cli-service`)
module.exports = defineConfig({
    transpileDependencies: [
        `vuetify`
    ],

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: `MV-Launcher`,
                icon: (process.platform === `darwin`)?`./public/wow.png`:`./public/wow.ico`,
            },
        }

    },
    configureWebpack: {
        target: `electron-renderer`
    }
    
})