class PatchManager {
    constructor () {
        this._patchList = {}
        this._downloadFiles = {}
        this._toDelete = {}
        this._selectedPatches = {}
        this.loadPatches()
    }

    loadPatches () {
        if(process.env.NODE_ENV !== `production`) {
            this.patchList = require(`../remote-example`)
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

}

export const patchManager  = new PatchManager()