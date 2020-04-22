const fs = require(`fs`)
const { config } = require(`./config`)
const axios = require(`axios`)

class PatchManager {
    constructor () {
        this._patchList = undefined
        this._currentFile = undefined
        this._selectedPatches = {}
        this._language = fs
            .readdirSync(`./Data`)
            .find(e => config.conf.available_language.includes(e))
        this.loadPatches()
    }

    loadPatches () {
        const _this = this
        axios({
            method: `get`,
            url: `${config.conf.patchlist_endpoint}/${process.platform}/${_this.language}/`,
        }).then(function (response) {
            _this.patchList = response.data
        })
    }

    /**
     * Return an object containing the list of files to be download
     * @returns {*}
     */
    generateDownloadFiles() {
        return this.patchList.optional
            .filter(e => this.selectedPatches.includes(e.id) )
            .reduce((acc, currentVal) => Object.assign(acc, currentVal.files), {...this.patchList.mandatory})
    }


    generateDeleteFiles() {
        const allFiles = this.patchList.optional
            .reduce((acc, currentVal) => Object.assign(acc, currentVal.files), { ...this.patchList.delete , ...this.patchList.mandatory })

        const keysToRemove = Object.keys(this.generateDownloadFiles())
        for(const key of keysToRemove) {
            delete allFiles[key]
        }
        return allFiles
    }

    allPatches() {
        return this.patchList.optional.map(e => e.name)
    }

    get patchList () {
        return this._patchList
    }

    set patchList(patchList) {
        this._patchList = patchList
    }

    get selectedPatches () {
        return this._selectedPatches
    }

    set selectedPatches(selectedPatches) {
        this._selectedPatches = selectedPatches
    }

    get currentFile () {
        return this._currentFile
    }

    set currentFile(currentFile) {
        this._currentFile = currentFile
    }

    get language() {
        return this._language
    }

}

export const patchManager  = new PatchManager()