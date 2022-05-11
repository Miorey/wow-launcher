const fs = require(`fs`);


class Config {
    constructor () {
        const rawdata = fs.readFileSync(`${this.rootDir}config.json`);
        this.conf = JSON.parse(rawdata);
    }
    get rootDir() {
        return (
            process.platform === `darwin` && process.env.NODE_ENV === `production`
        ) ? `${process.resourcesPath}/../../../` : `./`;
    }
}

export const config  = new Config();