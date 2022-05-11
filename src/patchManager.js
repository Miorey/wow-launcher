const fs = require(`fs`);
const { config } = require(`./config`);
const axios = require(`axios`);

class PatchManager {
    constructor () {
        this._patchList = undefined;
        this._currentFile = undefined;
        this._selectedPatches = {};
        this._downloadInProgress = false;
        this._dirData = (process.platform === `darwin` && process.env.NODE_ENV === `production`) ? `${process.resourcesPath}/../../../Data` : `./Data`;
        this._language = fs
            .readdirSync(this.dirData)
            .find(e => config.conf.available_language.includes(e));
        this.loadPatches();
    }

    loadPatches () {
        const _this = this;
        const patchListEndpoint = `${config.conf.patchlist_endpoint}/${process.platform}/${_this.language}${config.conf.path_end}`;
        console.info(`Get patch list from ${patchListEndpoint}`);
        axios({
            method: `get`,
            url: patchListEndpoint
        }).then(function (response) {
            if(response.data instanceof Object) {
                _this.patchList = response.data;
            } else {
                // eslint-disable-next-line no-debugger
                _this.patchList = JSON.parse(response.data);
            }
        });
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
     * Returns the list of files to delete
     * @returns {[]}
     */
    generateDeleteFiles() {
        //Get all files mandatory + optionals + delete
        const deleteFiles = this.patchList.optional
            .reduce((acc, currentVal) => Object.assign(acc, currentVal.files), { ...this.patchList.delete , ...this.patchList.mandatory });

        const keysToRemove = Object.keys(this.generateDownloadFiles());
        for(const key of keysToRemove) {
            // delete files will contain (mandatory + optionals + delete) - (files to download)
            // this way if a file is not in (files to download) it will be removed
            delete deleteFiles[key];
        }
        return deleteFiles;
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

    get selectedPatches () {
        return this._selectedPatches;
    }

    set selectedPatches(selectedPatches) {
        this._selectedPatches = selectedPatches;
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