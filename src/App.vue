<template>
  <v-app id="app">
    <v-content>
      <HelloWorld/>
    </v-content>
    <v-footer
            dark
            padless
    >
      <v-card
              class="flex"
              flat
              tile
      >
        <v-card-title class="teal">

          <v-btn @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
          </v-btn>
          <strong class="subheading">Get connected with us on social networks!</strong>

          <v-spacer></v-spacer>


          <v-btn @click="downloadFtp(`/WoW3.3.5a-Fr/Data/patch-3.MPQ`, `./patch-3.MPQ`)">
            Créer un compte
          </v-btn>
        </v-card-title>

        <v-card-text class="py-2 white--text text-center">
          <span id="powered_by">{{ new Date().getFullYear() }} - Murloc Village</span>
        </v-card-text>
      </v-card>
    </v-footer>

  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
const { shell } = require(`electron`)
const fs = require(`fs`)
const ftp = require(`ftp`)
const crypto = require(`crypto`)
const { config } = require(`./config`)

const hash = crypto.createHash(`md5`)
export default {
    name: `App`,

    components: {
        HelloWorld,
    },

    data: () => ({
    //
    }),

    methods: {
        shellOpenExternal(url) {
            shell.openExternal(url)
        },
        downloadFtp(fileUrl, targetPath) {
            const c = new ftp()
            c.on(`ready`, function() {
                c.size(fileUrl, (err, bytes) => { console.log(bytes)})
                c.get(fileUrl, function(err, stream) {
                    if (err) throw err
                    stream.once(`close`, () => {
                        console.log(config.getTest())
                        const input = fs.createReadStream(targetPath)
                        input.on(`readable`, () => {
                            // Only one element is going to be produced by the
                            // hash stream.
                            const data = input.read()
                            if (data)
                                hash.update(data)
                            else {
                                console.log(`${hash.digest(`hex`)} ${targetPath}`)
                            }
                        })
                        c.end()
                    })
                    stream.pipe(fs.createWriteStream(targetPath))
                })
            })
            c.connect({host: config.conf.host})
        }
    }
}
</script>
<style>
  @font-face {
    font-family: "LifeCraft";
    src: url(/images/LifeCraft_Font.ttf) format("truetype");

  }
  #app {
    height: 100%;
    width: 100%;
  }
  #powered_by {
    font-family: "LifeCraft";
    font-size: large;
  }
</style>
