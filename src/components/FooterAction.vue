<template>
    <div>
        <v-btn :disabled="patchManager.downloadInProgress" class="pt-6 pb-6 mr-3" @click="downloadFtp">
            {{ `repair` | trans }}
        </v-btn>
        <v-btn :disabled="patchManager.downloadInProgress" class="pt-6 pb-6 mr-3" v-if="canPlay" @click="play">
            {{ `play` | trans }}
        </v-btn>
        <v-btn :disabled="patchManager.downloadInProgress" v-else  class="pt-6 pb-6 mr-5" @click="downloadFtp">
            {{ `download` | trans }}
        </v-btn>
    </div>
</template>

<script>
const { shell } = require(`electron`);
const fs = require(`fs`);
const Client = require(`ftp`);
const { config } = require(`../config`);
const { patchManager } = require(`../patchManager`);
const { ConnectionPromise, StreamPromise } = require(`../DownloadPromise`);
const { EventBus } = require(`../event-bus.js`);
const md5File = require(`md5-file`);
const child = require(`child_process`).execFile;
const open = require(`open`);
const player = require(`play-sound`)({});
const rimraf = require(`rimraf`);
const { createDirIfNotExists } = require(`../utils`);

export default {
    name: `FooterAction`,
    data: () => ({
        patchObject: {},
        patchManager: patchManager,
        canPlay: false,
        conn: null
    }),
    watch:{
        async 'patchManager.selectedPatches' () {
            this.canPlay = await this.isUpToDate();
        }
    },
    async mounted() {
        const _this = this;
        if(Array.isArray(patchManager.selectedPatches)) {
            this.canPlay = await this.isUpToDate();
        }

        this.conn = new Client();

        this.conn.on(`ready`, function() {
            EventBus.$emit(`event_loader_stop`,  `ftp_cli`);
        });
        this.conn.on(`error`, function () {
            _this.connStart();
        });
        this.conn.on(`close`, function () {
            _this.connStart();
        });
        // connect to localhost:21 as anonymous
        this.connStart();
    },
    destroyed() {
        this.conn.destroy();
    },
    methods: {
        shellOpenExternal(url) {
            shell.openExternal(url);
        },

        connStart() {
            const connSettings = {
                host: config.conf.host
            };
            this.conn.connect(connSettings);
        },

        async play() {
            switch (process.platform) {
            case `darwin`:
                await open(`${this.getWowFolder()}Wow.app`);
                break;
            case `win32`:
                child(`${this.getWowFolder()}Wow.exe`);
                break;
            case `linux`:
                alert(`Play is not available, to start the game please execute "wine Wow.exe" in the game directory`);
                break;
            default:
                throw new Error(`No play function for ${process.platform}`);
            }
        },

        /**
         * Returns true if the game is updated else false.
         * @returns {boolean}
         */
        isUpToDate() {
            const patchToDownload = patchManager.generateDownloadFiles();
            const _this = this;
            for(const key in patchToDownload) {
                if(!fs.existsSync(_this.getBaseFolder(patchToDownload[key].targetPath)))
                    return false;
            }
            const toDelete = patchManager.generateDeleteFiles();
            for(const key in toDelete) {
                if(fs.existsSync(_this.getBaseFolder(toDelete[key].targetPath)))
                    return false;
            }
            return true;
        },

        async downloadFtp() {
            patchManager.downloadInProgress = true;
            const _this = this;
            const connPromise = new ConnectionPromise(this.conn);
            const toDelete = patchManager.generateDeleteFiles();

            EventBus.$emit(`event_file_path`,  `Delete old files`);
            EventBus.$emit(`event_file_percent`,  0);
            const partPercent = 100 / Object.keys(toDelete).length;
            let count = 1;
            for(const key in toDelete) {
                console.info(`Delete ${toDelete[key].targetPath}`);
                if(fs.existsSync(_this.getBaseFolder(toDelete[key].targetPath))) {
                    fs.unlinkSync(_this.getBaseFolder(toDelete[key].targetPath));
                }
                EventBus.$emit(`event_file_percent`,  count*partPercent);
                count++;
            }

            const patchToDownload = patchManager.generateDownloadFiles();
            const totalSize = await this.totalSize(connPromise, patchToDownload);
            let doneSize = 0;
            await EventBus.$emit(`event_total_percent`,  0);
            for(const key in patchToDownload) {
                while (!await this.checkFile(patchToDownload[key])) {
                    await this.downloadFile(connPromise, patchToDownload[key]);
                }
                doneSize += await connPromise.connSize(patchToDownload[key].sourcePath);
                await EventBus.$emit(`event_total_percent`,  doneSize/totalSize*100);
            }
            this.canPlay = this.isUpToDate();
            EventBus.$emit(`event_file_path`,  `Delete Cache`);
            rimraf.sync(`${this.getWowFolder()}Cache`);
            EventBus.$emit(`event_file_path`,  `World of Warcraft is up to date`);
            EventBus.$emit(`event_file_percent`,  100);
            if(config.conf.end_sound && [`win32`, `darwin`].includes(process.platform)) {
                player.play(`${this.getWowFolder()}${config.conf.end_sound}`);
            }
            patchManager.downloadInProgress = false;
        },

        /**
         * @param {ConnectionPromise} conn
         * @param items
         * @returns {Promise<number>}
         */
        async totalSize(conn, items) {
            let ret = 0;
            for(const key in items) {
                const size = await conn.connSize(items[key].sourcePath);
                ret += size;
            }
            return ret;
        },

        /**
         *
         * @param item {{targetPath: string, sourcePath: string, md5: string}}
         * @returns {Promise<boolean>}
         */
        async checkFile(item) {
            EventBus.$emit(`event_file_path`,  `Check ${item.targetPath}`);
            if (!fs.existsSync(this.getBaseFolder(item.targetPath))) {
                return false;
            }
            const checkSum = md5File.sync(this.getBaseFolder(item.targetPath));
            return (checkSum === item.md5);
        },

        /**
         * Download and put file
         * @param {ConnectionPromise} conn
         * @param item {{targetPath: string, sourcePath: string, md5: string}}
         * @returns {Promise<boolean>}
         */
        async downloadFile(conn, item) {
            const targetPath = this.getBaseFolder(item.targetPath);
            const fileUrl = item.sourcePath;
            EventBus.$emit(`event_file_path`,  `Download ${item.targetPath}`);

            console.info(`Download file in ${targetPath}`);
            const size = await conn.connSize(fileUrl);
            const stream = await conn.connGet(fileUrl);
            const streamPromise  = new StreamPromise(stream);
            const nIntervId = setInterval(() => { EventBus.$emit(`event_file_percent`,  stream.bytesRead/size*100); }, 100);
            const dirPath = targetPath.substr(0, targetPath.lastIndexOf(`\\`)) || targetPath.substr(0, targetPath.lastIndexOf(`/`));
            createDirIfNotExists(dirPath);
            console.info(`Put file in ${targetPath}`);
            stream.pipe(fs.createWriteStream(targetPath));
            await streamPromise.once(`close`);
            clearInterval(nIntervId);
            return size;
        },

        getBaseFolder(targetPath) {
            return this.getWowFolder() + targetPath;
        },

        getWowFolder() {
            return this.patchManager.dirData + ( (process.platform === `win32`) ? `\\..\\` :  `/../`);
        }
    }
};
</script>
