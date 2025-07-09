## Prerequisites:

* Download [Node.js](https://nodejs.org/download/) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Install the [EditorConfig](http://editorconfig.org/#download) plugin for your favourite editor.  We use this to enforce some style rules not covered by code linting.
* Make a clone of the project, or update an existing copy.
* Install project dependencies with `npm install`.

## Serving Resources Locally

Serving extensions and themes locally is useful for rapid development without requiring the use of the XKit Editor, but some initial set up is required:

1. Run `npm run watch-extensions` to start the resource server. This task will automatically build the extension and theme files from source whenever they are changed, storing them in `Extensions/dist`.
2. Change these lines in xkit.js and manifest.json to point the XKit updater at `Extensions/dist`:

```diff
diff --git a/manifest.json b/manifest.json
index 9e964097..52c4119c 100644
--- a/manifest.json
+++ b/manifest.json
@@ -33,7 +33,7 @@
   "author": "New XKit Team",
   "permissions": ["storage", "unlimitedStorage", "*://*.tumblr.com/*", "https://new-xkit.github.io/XKit/*", "https://cloud.new-xkit.com/*" ],
   "version": "7.9.2",
-  "web_accessible_resources": [ "manifest.json", "editor.js" ],
+  "web_accessible_resources": [ "*.json", "editor.js" ],
   "applications": {
     "gecko": {
       "id": "@new-xkit",
diff --git a/xkit.js b/xkit.js
index d5b0cfd8..719402e1 100755
--- a/xkit.js
+++ b/xkit.js
@@ -192,7 +192,7 @@ var xkit_global_start = Date.now();  // log start timestamp
 		download: {
 			// TODO: implement as module, lose most of this code
 			github_fetch: function(path, callback) {
-				var url = 'https://new-xkit.github.io/XKit/Extensions/dist/' + path;
+				var url = browser.runtime.getURL('/Extensions/dist/') + path;
 				GM_xmlhttpRequest({
 					method: "GET",
 					url: url,
```

4. Reload the XKit extension in the browser under test:
  - Chrome: [reload the unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked)
  - Firefox: [reload the temporary add-on](https://developer.mozilla.org/en-US/docs/Tools/about:debugging#Extensions)
5. Open the XKit settings menu and navigate to Other > Update All and click "Update all my extensions".

> **Note**: changes to extension and theme files are not automatically propagated to the XKit extension in the browser.  Each time changes are made, XKit must be force-updated through "Update all my extensions" before the changes will be reflected.

## Scripts:

#### `npm test`

Shortcut for `eslint .`.

#### `npm run build-extensions`

Builds the extension and themes distribution from source, including the JSON-ified extension files, `list.json`, `gallery.json`, and`themes.json`.

#### `npm run watch-extensions`

Starts a task that builds the extension and themes distribution from source whenever they are changed.

#### `npm run build`

Uses `web-ext build` with the necessary file exclusions to build and pack the WebExtension (unsigned).

