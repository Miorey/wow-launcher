<template>
    <div>
        <v-btn class="pt-5 pb-8 mr-3" @click="shellOpenExternal(`https://wotlk.murlocvillage.com/fr/register`)">
            {{ `repair` | trans }}
        </v-btn>
        <v-btn class="pt-5 pb-8 mr-3" v-if="canPlay" @click="play">
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
const Client = require(`ftp`)
const { config } = require(`../config`)
const { patchManager } = require(`../patchManager`)
const { ConnectionPromise, StreamPromise } = require(`../DownloadPromise`)
const { EventBus } = require(`../event-bus.js`)
const md5File = require(`md5-file`)
const child = require(`child_process`).execFile
const open = require(`open`)

export default {
    name: `FooterAction`,
    data: () => ({
        patchObject: {},
        patchManager: patchManager,
        canPlay: false,
        downloads: false,
        conn: null
    }),
    watch:{
        async 'patchManager.selectedPatches' () {
            this.canPlay = await this.isUpToDate()
        }
    },
    async mounted() {
        const _this = this
        if(Array.isArray(patchManager.selectedPatches)) {
            this.canPlay = await this.isUpToDate()
        }

        this.conn = new Client()

        this.conn.on(`ready`, function() {
            EventBus.$emit(`event_loader_stop`,  `ftp_cli`)
        })
        this.conn.on(`error`, function () {
            _this.connStart()
        })
        this.conn.on(`close`, function () {
            _this.connStart()
        })
        // connect to localhost:21 as anonymous
        this.connStart()
    },
    destroyed() {
        this.conn.destroy()
    },
    methods: {
        shellOpenExternal(url) {
            shell.openExternal(url)
        },

        connStart() {
            const connSettings = {
                host: config.conf.host
            }
            this.conn.connect(connSettings)
        },

        async play() {
            if(process.platform === `darwin`) {
                await open(`${this.getWowFolder()}Wow.app`)
            } else {
                child(`${this.getWowFolder()}Wow.exe`)
            }
        },

        async isUpToDate() {
            const toDownload = patchManager.generateDownloadFiles()
            const _this = this
            let ret = true
            for(const key in toDownload) {
                ret = ret && await fs.existsSync(_this.getBaseFolder(toDownload[key].targetPath))
            }
            const toDelete = patchManager.generateDeleteFiles()
            for(const key in toDelete) {
                ret = ret &&  !fs.existsSync(_this.getBaseFolder(toDelete[key].targetPath))
            }
            return ret
        },

        async downloadFtp() {
            this.downloads = true
            const _this = this
            const connPromise = new ConnectionPromise(this.conn)
            const toDelete = patchManager.generateDeleteFiles()

            EventBus.$emit(`event_file_path`,  `Delete old files`)
            EventBus.$emit(`event_file_percent`,  0)
            const partPercent = 100 / Object.keys(toDelete).length
            let count = 1
            for(const key in toDelete) {
                if(fs.existsSync(_this.getBaseFolder(toDelete[key].targetPath))) {
                    fs.unlinkSync(_this.getBaseFolder(toDelete[key].targetPath))
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
            if (!fs.existsSync(this.getBaseFolder(item.targetPath))) {
                return false
            }
            const checkSum = md5File.sync(this.getBaseFolder(item.targetPath))
            return (checkSum === item.md5)
        },

        /**
         *
         * @param {ConnectionPromise} conn
         * @param item
         * @returns {Promise<boolean>}
         */
        async downloadFile(conn, item) {

            const targetPath = this.getBaseFolder(item.targetPath)
            const fileUrl = item.sourcePath
            EventBus.$emit(`event_file_path`,  `Download ${item.targetPath}`)
            const size = await conn.connSize(fileUrl)
            const stream = await conn.connGet(fileUrl)
            const streamPromise  = new StreamPromise(stream)
            const nIntervId = setInterval(() => { EventBus.$emit(`event_file_percent`,  stream.bytesRead/size*100) }, 100)
            stream.pipe(fs.createWriteStream(targetPath))
            await streamPromise.once(`close`)
            clearInterval(nIntervId)
            return size
        },

        getBaseFolder(targetPath) {
            return this.getWowFolder() + targetPath
        },

        getWowFolder() {
            return this.patchManager.dirData + ( (process.platform === `win32`) ? `\\..\\` :  `/../`)
        }
    }
}
</script>

<style scoped>

</style>