# wow-launcher
Wow launcher is a downloader for World of Warcraft files

## Setup as app

To setup the app you have to setup with your servers values:
```json
{
    "host": "ftp.murlocvillage.com",
    "available_language": ["frFR", "enUS"],
    "default_language": "enUS",
    "patchlist_endpoint": "https://wotlk.murlocvillage.com/api/launcher",
    "end_sound": "murloc.mp3",
    "extension": true
}
```
- `host` is the FTP server where you stored your files.
- `patchlist_endpoint` is the root level of your endpoint where are setup your patch requirements.
- `end_sound` (optional) is the name of the `mp3` file that should be played once the game is downloaded.
- `extension` `true` if `json` is required at end of file else `false` (default `false`)

### Test on localhost

In the directory `fixtures/json_server` you have an example of the server structure.
To test it locally you can do it with `http-server` node package.
Install it `npm install http-server -g` and launch:
```sh
http-server --cors=Authorization -p 9000 ./fixtures/json_server
```

Now you will need your `Data` directory with the language directory ex `enUS` 
on the root level of the project. Todo that you can copy it from `fixtures/client` directory to 
the project root level.

### Files installer structure


## Development
Vue electron [documentation](https://medium.com/@bromix/electron-application-with-vue-js-and-vuetify-f2a1f9c749b8)

To install the required packages
```
npm ci
```

### Compiles and hot-reloads for development
```
npm run electron:build
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

