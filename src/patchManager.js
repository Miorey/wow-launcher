
class PatchManager {
    constructor () {
        this._patchList = {}
        this._currentFile = undefined
        this._currentPercent = undefined
        this._selectedPatches = {}
        this.loadPatches()
    }

    loadPatches () {
        if(process.env.NODE_ENV !== `production`) {
            this.patchList = require(`./remote-example`)
        } else {
            console.log(`Production`)
        }
    }

    /**
     * Return an object containing the list of files to be download
     * @returns {*}
     */
    generateDownloadFiles() {
        return this.patchList.optional
            .filter(e => this.selectedPatches.includes(e.name) )
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

    get currentPercent () {
        return this._currentPercent
    }

    set currentPercent(currentPercent) {
        this._currentPercent = currentPercent
    }

}

export const patchManager  = new PatchManager()