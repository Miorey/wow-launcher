<template>
    <div>
        <v-btn class="pt-5 pb-8 mr-3" @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            Créer un compte
        </v-btn>
        <v-btn :disabled="!downloads" class="pt-5 pb-8 mr-3" v-if="canPlay" @click="downloadFtp">
            {{ `play` | trans }}
        </v-btn>
        <v-btn v-else  class="pt-5 pb-8 mr-5" @click="downloadFtp">
            {{ `download` | trans }}
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
        patchObject: {},
        patchManager: patchManager,
        canPlay: false,
        downloads: false
    }),
    watch:{
        async 'patchManager.selectedPatches' () {
            this.canPlay = await this.isUpToDate()
        }
    },
    async mounted() {
        if(Array.isArray(patchManager.selectedPatches)) {
            this.canPlay = await this.isUpToDate()
        }
    },
    methods: {
        shellOpenExternal(url) {
            shell.openExternal(url)
        },

        async isUpToDate() {
            EventBus.$emit(`event_loader_start`)
            const toDownload = patchManager.generateDownloadFiles()
            let ret = true
            for(const key in toDownload) {
                ret = ret && await this.checkFile(toDownload[key])
            }
            const toDelete = patchManager.generateDeleteFiles()
            for(const key in toDelete) {
                ret = ret &&  !fs.existsSync(toDelete[key].targetPath)
            }
            EventBus.$emit(`event_loader_stop`)
            return ret
        },

        async downloadFtp() {
            this.downloads = true
            const c = new ftp()
            c.connect({host: config.conf.host})
            const connPromise = new ConnectionPromise(c)
            await connPromise.connReady()
            const toDelete = patchManager.generateDeleteFiles()

            EventBus.$emit(`event_file_path`,  `Delete old files`)
            EventBus.$emit(`event_file_percent`,  0)
            const partPercent = 100 / Object.keys(toDelete).length
            let count = 1
            for(const key in toDelete) {
                if(fs.existsSync(toDelete[key].targetPath)) {
                    fs.unlinkSync(toDelete[key].targetPath)
                }
                EventBus.$emit(`event_file_percent`,  count*partPercent)
                count++
            }

            const toDownload = patchManager.generateDownloadFiles()
            const totalSize = await this.totalSize(connPromise, toDownload)
            let doneSize = 0
            EventBus.$emit(`event_total_percent`,  0)
            for(const key in toDownload) {
                while (!await this.checkFile(toDownload[key])) {
                    await this.downloadFile(connPromise, toDownload[key])
                }
                doneSize += await connPromise.connSize(toDownload[key].sourcePath)
                EventBus.$emit(`event_total_percent`,  doneSize/totalSize*100)
            }
            c.end()
            this.canPlay = await this.isUpToDate()
            EventBus.$emit(`event_file_path`,  `World of Warcraft is up to date`)
            EventBus.$emit(`event_file_percent`,  100)
            this.downloads = false
        },

        /**
         * @param {ConnectionPromise} conn
         * @param items
         * @returns {Promise<number>}
         */
        async totalSize(conn, items) {
            let ret = 0
            for(const key in items) {
                const size = await conn.connSize(items[key].sourcePath)
                ret += size
            }
            return ret
        },

        async checkFile(item) {
            if (!fs.existsSync(item.targetPath)) {
                return false
            }
            const checkSum = md5File.sync(item.targetPath)
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
            return size
        },
    }
}
</script>

<style scoped>

</style>