const fs = require(`fs`);
const { config } = require(`./config`);
const axios = require(`axios`);
const storage = require(`electron-json-storage`);
const { EventBus } = require(`./event-bus`);

class PatchManager {
    constructor () {

        this._patchList = undefined;
        this._currentFile = undefined;
        // TODO _selectedPatches / _selectedAddons should be get from storage file
        this._selectedPatches = undefined;
        this._selectedAddons = undefined;
        this._downloadInProgress = false;
        this._dirData = (process.platform === `darwin` && process.env.NODE_ENV === `production`) ? `${process.resourcesPath}/../../../Data` : `./Data`;
        this._language = fs
            .readdirSync(this.dirData)
            .find(e => config.conf.available_language.includes(e));
        const _this = this;


        this.loadPatches().then(() => true);
        this.findSelectedPatches().then(r => _this.selectedPatches = r);
        this.findSelectedAddons().then(r => _this.selectedAddons = r);
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async loadPatches () {
        const _this = this;
        const patchListEndpoint = `${config.conf.patchlist_endpoint}/${process.platform}/${_this.language}${config.conf.path_end}`;
        console.info(`Get patch list from ${patchListEndpoint}`);
        const response = await axios({
            method: `get`,
            url: patchListEndpoint
        });

        if(response.data instanceof Object) {
            _this.patchList = response.data;
        } else {
            // eslint-disable-next-line no-debugger
            _this.patchList = JSON.parse(response.data);
        }
    }

    /**
     * Return an object containing the list of files to be download
     * @returns {*}
     */
    generateDownloadFiles() {
        return this.patchList.optional
            .filter(e => this.selectedPatches.includes(e.id) )
            .reduce((acc, currentVal) => Object.assign(acc, currentVal.files), {...this.patchList.mandatory});
    }


    /**
     * Return an object containing the list of files to be downloaded
     * @returns {[]}
     */
    generateDownloadAddons() {
        console.log(`YOLO`, this.selectedAddons);
        const _this = this;
        return this.patchList.addons.filter(
            (e) => {
                console.log(e.id);
                console.log(this.selectedAddons);
                return _this.selectedAddons.includes(e.id);
            });
    }

    /**
     * Returns unselected addons
     * @returns {{}}
     */
    generateDeleteAddons() {
        const _this = this;
        return this.patchList.addons.filter(
            (e) => {
                console.log(e.id);
                console.log(this.selectedAddons);
                return !_this.selectedAddons.includes(e.id);
            });
    }


    /**
     * Returns the list of files to delete
     * @returns {[]}
     */
    generateDeleteFiles() {
        //Get all files mandatory + optionals + delete
        const deleteFiles = this.patchList.optional
            .reduce((acc, currentVal) => Object.assign(acc, currentVal.files), { ...this.patchList.delete , ...this.patchList.mandatory });

        console.log(`deleteFiles`, deleteFiles);
        // eslint-disable-next-line no-debugger
        const keysToRemove = Object.keys(this.generateDownloadFiles());
        console.log(keysToRemove);
        for(const key of keysToRemove) {
            // delete files will contain (mandatory + optionals + delete) - (files to download)
            // this way if a file is not in (files to download) it will be removed
            delete deleteFiles[key];
        }
        return deleteFiles;
    }


    /**
     *
     * @returns {Promise<unknown>}
     */
    async findSelectedAddons() {
        return new Promise((resolve, reject) => {
            storage.get(`selectedAddon${this.language}`, (error, data) => {
                if (error) {
                    reject(error);
                }
                console.log(`findSelectedAddons`, data);
                EventBus.$emit(`event_loader_stop`,  `storage`);
                const resolveVal = (!data.updated) ? [] : data.addons;
                resolve(resolveVal);
            });
        });
    }



    /**
     *
     * @returns {Promise<unknown>}
     */
    findSelectedPatches() {
        return new Promise((resolve, reject) => {
            console.info(`getDefaultDataPath`, storage.getDefaultDataPath());
            storage.get(`selectedPatch${this.language}`, (error, data) => {
                if (error) {
                    reject(error);
                }
                console.log(`findSelectedPatches`, data);
                EventBus.$emit(`event_loader_stop`,  `storage`);
                const resolveVal = (!data.updated) ? [] : data.patches;
                resolve(resolveVal);
            });
        });
    }

    allPatches() {
        return this.patchList.optional.map(e => e.name);
    }

    get patchList () {
        return this._patchList;
    }

    set patchList(patchList) {
        this._patchList = patchList;
    }

    /**
     *
     * @returns {*|Promise<Array>}
     */
    get selectedPatches () {
        if(typeof this._selectedPatches === `undefined`) {
            return this.findSelectedPatches();
        }
        return this._selectedPatches;
    }

    set selectedPatches(selectedPatches) {
        this._selectedPatches = selectedPatches;
    }

    /**
     *
     * @returns {*|Promise<Array>}
     */
    get selectedAddons () {
        if(typeof this._selectedAddons === `undefined`) {
            return this.findSelectedAddons();
        }
        return this._selectedAddons;
    }

    set selectedAddons(selectedAddons) {
        console.log(`set selectedAddons`, selectedAddons);
        this._selectedAddons = selectedAddons;
    }

    get currentFile () {
        return this._currentFile;
    }

    set currentFile(currentFile) {
        this._currentFile = currentFile;
    }

    get language() {
        return this._language;
    }

    get dirData() {
        return this._dirData;
    }

    get downloadInProgress() {
        return this._downloadInProgress;
    }

    set downloadInProgress(downloadInProgress) {
        this._downloadInProgress = downloadInProgress;
    }

}

export const patchManager  = new PatchManager();