<template>
    <div>
        <v-btn @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
        </v-btn>
        <strong class="subheading">Get connected with us on social networks!</strong>
        <v-btn @click="downloadFtp(`/WoW3.3.5a-Fr/Data/patch-3.MPQ`, `./patch-3.MPQ`)">
            Créer un compte
        </v-btn>
    </div>
</template>

<script>
const { shell } = require(`electron`)
const fs = require(`fs`)
const ftp = require(`ftp`)
const crypto = require(`crypto`)
const { config } = require(`../config`)
const hash = crypto.createHash(`md5`)
const { patchManager } = require(`../patchManager`)
export default {
    name: `FooterAction`,
    methods: {
        shellOpenExternal(url) {
            console.log(patchManager)
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

<style scoped>

</style>