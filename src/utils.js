const fs = require(`fs`);
const path = require(`path`);

/**
 *
 * @param dir {string}
 */
export const createDirIfNotExists = (dir) => {
    if (fs.existsSync(dir)){
        return;
    }

    try{
        console.info(`Create ${dir}`);
        fs.mkdirSync(dir);
    }catch(err){
        if(err.code === `ENOENT`){
            createDirIfNotExists(path.dirname(dir)); //create parent dir
            createDirIfNotExists(dir); //create dir
        }
    }
};