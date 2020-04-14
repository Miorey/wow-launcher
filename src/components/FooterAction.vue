<template>
    <div>
        <v-btn @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
        </v-btn>
        <strong class="subheading">Get connected with us on social networks!</strong>
        <v-btn @click="downloadFtp2">
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
const { patchManager } = require(`../patchManager`)
const { ConnectionPromise, StreamPromise, FsPromise } = require(`../DownloadPromise`)
export default {
    name: `FooterAction`,
    data: () => ({
        patchObject: {}
    }),
    methods: {
        shellOpenExternal(url) {
            console.log(patchManager.patchList)
            shell.openExternal(url)
        },

        // eslint-disable-next-line no-unused-vars
        async downloadFtp2() {
            const c = new ftp()
            c.connect({host: config.conf.host})
            const connPromise = new ConnectionPromise(c)
            await connPromise.connReady()
            const toDownload = patchManager.generateDownloadFiles()
            for(const key in toDownload) {
                const targetPath = toDownload[key].targetPath
                const fileUrl = toDownload[key].sourcePath
                const size = await connPromise.connSize(fileUrl)
                const stream = await connPromise.connGet(fileUrl)
                const streamPromise  = new StreamPromise(stream)
                const nIntervId = setInterval(() => { console.log(`size: `, stream.bytesRead/size*100) }, 100)
                await streamPromise.once(`close`)
                clearInterval(nIntervId)
                stream.pipe(fs.createWriteStream(targetPath))
                const input = fs.createReadStream(targetPath)
                const fsPromise = new FsPromise(input)
                await fsPromise.on(`readable`)
                const data = input.read()
                const hash = crypto.createHash(`md5`)
                if (data) {
                    hash.update(data)
                }
                else {
                    console.log(`${hash.digest(`hex`)} ${targetPath}`)
                }
            }
            c.end()
        },

        downloadFtp(fileUrl, targetPath) {
            const c = new ftp()
            c.on(`ready`, function() {
                c.size(fileUrl, (err, bytes) => { console.log(bytes)})
                c.get(fileUrl, function(err, stream) {
                    if (err) throw err
                    stream.once(`close`, () => {
                        const input = fs.createReadStream(targetPath)
                        input.on(`readable`, () => {
                            // Only one element is going to be produced by the
                            // hash stream.
                            const data = input.read()
                            const hash = crypto.createHash(`md5`)
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