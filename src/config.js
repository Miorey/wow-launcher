const { configData } = require(`../config.js`)

class Config {
    constructor () {
        this.conf = configData
    }
}

export const config  = new Config()