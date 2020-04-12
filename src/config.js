
const configFile = require(`../config`)

class Config {
    constructor () {
        this.conf = configFile
    }
}

export const config  = new Config()