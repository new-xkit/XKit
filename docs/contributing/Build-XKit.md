## Prerequisites:

* Download [Node.js](https://nodejs.org/download/) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Install the [EditorConfig](http://editorconfig.org/#download) plugin for your favourite editor.  We use this to enforce some style rules not covered by code linting.
* Make a clone of the project, or update an existing copy.
* Install project dependencies with `npm install`.

## Serving Resources Locally

Serving extensions and themes locally is useful for rapid development without requiring the use of the XKit Editor, but some initial set up is required:

1. Run `gulp server` to start the resource server.  This task will automatically build the extension and theme files from source before the server starts.  See [`gulp server`](#gulp-server) for more information.
2. Navigate to `https://localhost:31337` and create a security exception for the `localhost` domain.  The project uses self-signed SSL/TLS certificates that are untrusted by default in order to work around mixed-content warnings for websites like Tumblr that are served over HTTPS.
3. Change [the relevant lines](https://gist.github.com/hobinjk/4b0ae4698d4e35320d3c977753946cf5) in xkit.js and manifest.json to point to and allow serving XKit from `localhost`.
4. Reload the XKit extension in the browser under test:
  - Chrome: [reload the unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked)
  - Firefox: [reload the temporary add-on](https://developer.mozilla.org/en-US/docs/Tools/about:debugging#Extensions)
5. Open the XKit settings menu and navigate to Other > Update All and click "Update all my extensions".

> **Note**: changes to extension and theme files are not automatically propagated to the XKit extension in the browser.  Each time changes are made, XKit must be force-updated through "Update all my extensions" before the changes will be reflected.

## Scripts:

#### `npm test`

Shortcut for `eslint .`.

#### `npm build-extensions`

Builds the extension and themes distribution from source, including the JSON-ified extension files, `list.json`, `gallery.json`, and`themes.json`.

#### `npm run build`

Uses `web-ext build` with the necessary file exclusions to build and pack the WebExtension (unsigned).

