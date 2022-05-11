const { defineConfig } = require(`@vue/cli-service`);
module.exports = defineConfig({
    transpileDependencies: [
        `vuetify`
    ],

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: `MV-Launcher`,
                icon: (process.platform === `darwin`)?`./public/wow.png`:`./public/wow.ico`,
                files: [
                    `dist/**/*`,
                    `node_modules/**/*`,
                    `package.json`,
                    `background.js`
                ]
            },
        }

    },
    configureWebpack: {
        target: `electron-renderer`
    }
    
});
