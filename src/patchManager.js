class PatchManager {
    constructor () {
        this._patchList = {}
    }

    get patchList () {
        return this._patchList
    }

    set patchList(patchList) {
        this._patchList = patchList
    }

}
export const patchManager  = new PatchManager()