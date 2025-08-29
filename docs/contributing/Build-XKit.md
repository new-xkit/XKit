While you can use the XKit Editor to make and test minor changes to an individual extension with minimal setup, as described in [Fixing a Bug](./Fixing-a-Bug.md), loading a development build of XKit allows you to make and test changes to XKit itself and can enable faster iteration of extension modifications.

## Prerequisites:

* Download [Node.js](https://nodejs.org/en/download) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Install the [EditorConfig](http://editorconfig.org/#download) plugin for your favourite editor.  We use this to enforce some style rules not covered by code linting.
* Make a clone of the project, or update an existing copy.
* Install project dependencies with `npm install`.

## Loading XKit for Development

You can either load XKit into your current browser installation or you can use Mozilla's web-ext tool to launch a temporary, clean browser installation with XKit automatically loaded.

To load XKit into your current browser installation:

- Disable your current XKit installation, if you have one.
- Follow the [Firefox](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html#extensions) or [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) instructions to select the XKit repository folder as an "unpacked" extension.

This is convenient for testing with your primary account and any other browser extensions you use.

To to launch a temporary, clean browser installation with XKit automatically loaded:

- Run `npx web-ext run --no-reload` (Firefox) or `npx web-ext run -t chromium --no-reload` (Chrome).

You will have to log in to Tumblr each time you do this, but it is ideal for developing with a test account and/or for confirming functionality in a clean environment.

After performing these steps, edits can be made to the XKit core files in your local development environment. Reloading the extension and refreshing Tumblr will apply them.

> **Note**: The deployed versions of extensions and theme files will be downloaded from GitHub. They must be edited using the XKit Editor unless the following steps are also followed.

## Serving Extensions Locally

Serving extensions locally is useful for rapid development without requiring the use of the XKit Editor, but some additional set up is required:

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

4. Reload the XKit extension, if you have already loaded it in your browser.

After performing these steps, edits can be made to the extension files in your local development environment. Pressing "update" on the relevant entry in the "My XKit" tab of the XKit control panel and refreshing Tumblr will apply them.

> **Note**: The "update all my extensions" button in the "other" tab of the XKit control panel will only update extensions if their version numbers have been increased.

## Scripts:

#### `npm test`

Shortcut for `eslint .`.

#### `npm run build-extensions`

Builds the extension and themes distribution from source, including the JSON-ified extension files, `list.json`, `gallery.json`, and`themes.json`.

#### `npm run watch-extensions`

Starts a task that builds the extension and themes distribution from source whenever they are changed.

#### `npm run build`

Uses `web-ext build` with the necessary file exclusions to build and pack the WebExtension (unsigned).

