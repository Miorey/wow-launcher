<template>
    <div>
        <v-btn :disabled="patchManager.downloadInProgress" class="pt-6 pb-6 mr-3" @click="downloadFtp(true)">
            {{ `repair` | trans }}
        </v-btn>
        <v-btn :disabled="patchManager.downloadInProgress" class="pt-6 pb-6 mr-3" v-if="canPlay" @click="play">
            {{ `play` | trans }}
        </v-btn>
        <v-btn :disabled="patchManager.downloadInProgress" v-else class="pt-6 pb-6 mr-5" @click="downloadFtp(false)">
            {{ `download` | trans }}
        </v-btn>
    </div>
</template>

<script>
const fs = require(`fs`);
const Client = require(`ftp`);
const { config } = require(`../config`);
const { patchManager } = require(`../patchManager`);
const { ConnectionPromise, StreamPromise } = require(`../DownloadPromise`);
const { EventBus } = require(`../event-bus.js`);
const md5File = require(`md5-file`);
const { spawn } = require(`child_process`).execFile;
const open = require(`open`);
const player = require(`sound-play`);
const rimraf = require(`rimraf`);
const unzipper = require(`unzipper`);
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
            this.canPlay = this.isUpToDate();
        },
        async 'patchManager.selectedAddons' () {
            this.canPlay = this.isUpToDate();
        }
    },
    async mounted() {
        const _this = this;
        if(Array.isArray(patchManager.selectedPatches)) {
            this.canPlay = this.isUpToDate();
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
                // eslint-disable-next-line no-case-declarations
                const child = spawn(`${this.getWowFolder()}Wow.exe`, [], {
                    detached: true,
                    stdio: `ignore`
                });
                child.unref();
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
            const _this = this;
            const patchToDownload = patchManager.generateDownloadFiles();
            for(const key in patchToDownload) {
                // Check if all mandatory / selected patch exists
                fs.existsSync(_this.getBaseFolder(patchToDownload[key].targetPath));
                if(!fs.existsSync(_this.getBaseFolder(patchToDownload[key].targetPath))) {
                    console.log(`patchToDownload is missing`, _this.getBaseFolder(patchToDownload[key].targetPath));
                    return false;
                }
            }
            const addonsToDownload = patchManager.generateDownloadAddons();
            for(const key in addonsToDownload) {
                // Check if all selected addons exists
                for(const dir of addonsToDownload[key].directories) {
                    const addonPath = addonsToDownload[key].unzipPath + dir;
                    if(!fs.existsSync(_this.getBaseFolder(addonPath))) {
                        console.log(`addonsToDownload is missing`, _this.getBaseFolder(addonPath));
                        return false;
                    }
                }
            }
            
            const toDelete = patchManager.generateDeleteFiles();
            for(const key in toDelete) {
                // Check if all the files to delete are not there
                if(fs.existsSync(_this.getBaseFolder(toDelete[key].targetPath))) {
                    console.log(`toDelete is there`, _this.getBaseFolder(toDelete[key].targetPath));
                    return false;
                }
            }
            const toDeleteAddons = patchManager.generateDeleteAddons();
            for(const key in toDeleteAddons) {
                // Check that all addons to delete are not there
                for(const dir of toDeleteAddons[key].directories) {
                    const addonPath = toDeleteAddons[key].unzipPath + dir;
                    if (fs.existsSync(_this.getBaseFolder(addonPath))) {
                        console.log(`toDeleteAddons is there`, _this.getBaseFolder(addonPath));
                        return false;
                    }
                }
            }
            return true;
        },
      
        deleteFiles() {
            const toDelete = patchManager.generateDeleteFiles();
            const toDeleteAddons = patchManager.generateDeleteAddons();
            const partPercent = 100 / (
                Object.keys(toDelete).length + toDeleteAddons.length
            );
            let count = 1;
            for(const key in toDelete) {
                console.info(`Delete ${toDelete[key].targetPath}`);
                if(fs.existsSync(this.getBaseFolder(toDelete[key].targetPath))) {
                    fs.unlinkSync(this.getBaseFolder(toDelete[key].targetPath));
                }
                EventBus.$emit(`event_file_percent`,  count*partPercent);
                count++;
            }
            for(const addon of toDeleteAddons) {
                for (const dir of addon.directories) {
                    const addonPath = addon.unzipPath + dir;
                    if (fs.existsSync(this.getBaseFolder(addonPath))) {
                        console.info(`Delete ${addonPath}`);
                        fs.rmSync(addonPath, {recursive: true, force: true});
                    }
                }
                console.info(`Delete ${addon.targetPath}`);
                if (fs.existsSync(this.getBaseFolder(addon.targetPath))) {
                    fs.unlinkSync(this.getBaseFolder(addon.targetPath));
                }
                EventBus.$emit(`event_file_percent`, count * partPercent);
                count++;
            }
        },

        /**
       *
       * @param {ConnectionPromise} connPromise
       * @returns {Promise<void>}
       */
        async downloadPatches(connPromise) {
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
        },

        /**
         *
         * @param {ConnectionPromise} connPromise
         * @param  {boolean} repair
         * @returns {Promise<void>}
         */
        async downloadAddons(connPromise, repair) {
            const _this = this;
            const addonsToDownload = patchManager.generateDownloadAddons();
            const totalSize = await this.totalSize(connPromise, addonsToDownload);
            let doneSize = 0;
            await EventBus.$emit(`event_total_percent`,  0);
            for(const key in addonsToDownload) {
                let skip = !repair;
                for (const dir of addonsToDownload[key].directories) {
                    const addonPath = addonsToDownload[key].unzipPath + dir;
                    skip = skip  && fs.existsSync(this.getBaseFolder(addonPath));
                }
                if (!skip) {
                    while (!await this.checkFile(addonsToDownload[key])) {
                        await this.downloadFile(connPromise, addonsToDownload[key]);
                    }
                    fs.createReadStream(addonsToDownload[key].targetPath)
                        .pipe(unzipper.Extract({ path: addonsToDownload[key].unzipPath }))
                        .on(`close`, () => {
                            console.log(`Extraction complete`);
                            _this.canPlay = _this.isUpToDate();
                        })
                        .on(`error`, (err) => {
                            console.error(`Error during extraction`, err);
                            _this.canPlay = _this.isUpToDate();
                        });
                    fs.unlinkSync(this.getBaseFolder(addonsToDownload[key].targetPath));
                }
                doneSize += await connPromise.connSize(addonsToDownload[key].sourcePath);
                await EventBus.$emit(`event_total_percent`,  doneSize/totalSize*100);
            }
        },

        async downloadFtp(repair) {
            patchManager.downloadInProgress = true;

            EventBus.$emit(`event_file_path`,  `Delete old files`);
            EventBus.$emit(`event_file_percent`,  0);

            this.deleteFiles();
            const connPromise = new ConnectionPromise(this.conn);
            await this.downloadPatches(connPromise);
            await this.downloadAddons(connPromise, repair);

            this.canPlay = this.isUpToDate();
            EventBus.$emit(`event_file_path`,  `Delete Cache`);
            rimraf.sync(`${this.getWowFolder()}Cache`);
            EventBus.$emit(`event_file_path`,  `World of Warcraft is up to date`);
            EventBus.$emit(`event_file_percent`,  100);
            if(config.conf.end_sound && [`win32`, `darwin`].includes(process.platform)) {
                console.log(`Play ${this.getWowFolder()}${config.conf.end_sound}`);
                player.play(`${this.getWowFolder()}${config.conf.end_sound}`, 1);
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
