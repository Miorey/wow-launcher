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

    allPatches() {
        return this.patchList.optional.map(e => e.name)
    }

    get patchList () {
        return this._patchList
    }

    set patchList(patchList) {
        this._patchList = patchList
    }

}

export const patchManager  = new PatchManager()