module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true,
        "node": true
    },
    "extends": [
        `eslint:recommended`,
        `plugin:vue/essential`
    ],
    "globals": {
        "Atomics": `readonly`,
        "SharedArrayBuffer": `readonly`
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": `module`
    },
    "plugins": [
        `vue`
    ],
    rules: {
        "indent": [
            `error`,
            4
        ],
        "linebreak-style": [
            `error`,
            `unix`
        ],
        "semi": [2, `always`],
        "quotes": [
            `error`,
            `backtick`
        ],
        "no-console": `off`,
    },
};
