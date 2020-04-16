<template>
    <div>
        <v-btn @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
        </v-btn>
        <strong class="subheading">Get connected with us on social networks!</strong>
        <v-btn @click="downloadFtp2">
            Download2
        </v-btn>
    </div>
</template>

<script>
const { shell } = require(`electron`)
const fs = require(`fs`)
const ftp = require(`ftp`)
const { config } = require(`../config`)
const { patchManager } = require(`../patchManager`)
const { ConnectionPromise, StreamPromise } = require(`../DownloadPromise`)
const { EventBus } = require(`../event-bus.js`)
const md5File = require(`md5-file`)

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
            EventBus.$emit(`event_file_percent`,  4)
            const c = new ftp()
            c.connect({host: config.conf.host})
            const connPromise = new ConnectionPromise(c)
            await connPromise.connReady()
            const toDownload = patchManager.generateDownloadFiles()
            for(const key in toDownload) {
                while (!await this.checkFile(toDownload[key])) {
                    console.log(`download`)
                    await this.downloadFile(connPromise, toDownload[key])
                }
                console.log(`not download`)
            }
            c.end()
            EventBus.$emit(`event_file_path`,  `World of Warcraft is up to date`)
            EventBus.$emit(`event_file_percent`,  100)
        },

        async checkFile(item) {
            console.log(`checkFile`)
            EventBus.$emit(`event_file_path`,  `Check ${item.targetPath}`)
            EventBus.$emit(`event_file_percent`,  50)
            if (!fs.existsSync(item.targetPath)) {
                console.log(`fs.existsSync(item.targetPath)`)
                return false
            }
            const checkSum = md5File.sync(item.targetPath)
            EventBus.$emit(`event_file_percent`,  100)
            console.log(`/checkFile`, checkSum)
            return (checkSum === item.md5)
        },

        /**
         *
         * @param {ConnectionPromise} conn
         * @param item
         * @returns {Promise<boolean>}
         */
        async downloadFile(conn, item) {
            const targetPath = item.targetPath
            const fileUrl = item.sourcePath
            EventBus.$emit(`event_file_path`,  `Download ${targetPath}`)
            const size = await conn.connSize(fileUrl)
            const stream = await conn.connGet(fileUrl)
            const streamPromise  = new StreamPromise(stream)
            const nIntervId = setInterval(() => { EventBus.$emit(`event_file_percent`,  stream.bytesRead/size*100) }, 100)
            stream.pipe(fs.createWriteStream(targetPath))
            await streamPromise.once(`close`)
            clearInterval(nIntervId)

        },
    }
}
</script>

<style scoped>

</style>