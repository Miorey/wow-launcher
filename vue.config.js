// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require(`@vue/cli-service`);
module.exports = defineConfig({
  transpileDependencies: [
    `vuetify`
  ],

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: `MV-Launcher`,
        icon: (process.platform === `darwin`)?`./public/wow.png`:`./public/murloc_village.ico`,
        files: [
          `**/*`,
          `dist/**/*`,
          `node_modules/**/*`,
          `package.json`,
          `background.js`,
          `*.js`,
          `build`,
          `node_modules`
        ]
      },
    }

  },
  configureWebpack: {
    target: `electron-renderer`
  }
    
});
