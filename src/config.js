const { configData } = require(`../config.js`)

class Config {
    constructor () {
        console.log(configData)
        this.conf = configData
    }
}

export const config  = new Config()