To re-create this or update the bridge files, do the following:
* Build the extension regularly (without changing anything - as it is on the repo).
* Using [Microsoft's Edge Extension Toolkit](https://www.microsoft.com/store/p/microsoft-edge-extension-toolkit/9nblggh4txvb), load the Chrome (Webext) build results directory.
* Fix any problems (if any) and hit "save files"
* It will patch "manifest.json" and generate two additional files: "backgroundScriptsAPIBridge.js" and "contentScriptsAPIBridge". Copy all three to "/Edge"
* Rebuild