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

const storage = require(`electron-json-storage`)

const dataPath = storage.getDataPath()
console.log(dataPath)
storage.set(`foobar`, { foo: `bar` }, function(error) {
    if (error) throw error
})

storage.get(`foobar2`, function(error, data) {
    if (error) throw error

    console.log(data)
})
export const patchManager  = new PatchManager()