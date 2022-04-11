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
http-server -c-1 --cors=Authorization -p 9000 ./fixtures/json_server
```

Now you will need your `Data` directory with the language directory ex `enUS` 
on the root level of the project. Todo that you can copy it from `fixtures/client` directory to 
the project root level.

### Files installer structure
The patch-list files are divided in 3 section `delete`, `mandatory` and `optional`.
- Delete will remove a list of files.
- Mandatory will download files in a given path
- Optional will download a list of files required for one option. (The optional section might be rework in the future)

#### Delete structure
Type: Object
Ex:
```json
{
  "delete": {
    "Test.txt": {
      "targetPath": "./Data/Test.txt"
    }
  },
  ...
}
```
This will delete `./Data/Test.txt` from the root path of the launcher executable.

### Mandatory structure
Type: Object
Ex:
```json
{
  ...
  "mandatory": {
    "Logo_800.avi": {
      "md5": "ad7c1a061ef0bf8b93936f2386a72311",
      "sourcePath": "/mandatory/enUS/Data/enUS/Interface/Cinematics/Logo_800.avi",
      "targetPath": "./Data/enUS/Interface/Cinematics/Logo_800.avi"
    }
  },
  ...
}
```
This will download `sourcePath` on the `host` server in `targetPath`.
Once downloaded a md5 checksum of the downloaded file will be compared with the value of the `md5` attribute.

### Optional structure
Type: List of Objects
The optional files contains mainly graphical improvements. 
Sometimes these improvements are dispatched in multiple files. 
```json
{
  ...
  "optional": [
    {
      "id": "characters",
      "name": {
        "enUS": "Win32 option 1 enUS",
        "frFR": "Win32 option 1 frFR"
      },
      "files": {
        "WOW_Intro_LK_800.avi": {
          "md5": "9445487724a0c399f200c3887420d1f8",
          "sourcePath": "/mandatory/enUS/Data/enUS/Interface/Cinematics/WOW_Intro_LK_800.avi",
          "targetPath": "./Data/enUS/Interface/Cinematics/WOW_Intro_LK_800.avi"
        }
      }
    }
}
```
Each options need a unique `id` attribute, this will be used client side to save the list of optional 
installed features. 
The name attribute contains an Object with key the language and value the title in this language (this part may change).
The `files` is as list of objects which has exactly the same structure as [Mandatory structure](#mandatory-structure)



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

