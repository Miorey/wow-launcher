class PatchManager {
    constructor () {
        this._patchList = {}
        this.loadPatches()
    }

    loadPatches () {
        if(process.env.NODE_ENV !== `production`) {
            this.patchList = require(`../remote-example`)
        } else {
            console.log(`Production`)
        }
    }

    get patchList () {
        return this._patchList
    }

    set patchList(patchList) {
        this._patchList = patchList
    }

}
export const patchManager  = new PatchManager()