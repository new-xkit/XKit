## Prerequisites:

* Download [Node.js](https://nodejs.org/download/) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Install the [EditorConfig](http://editorconfig.org/#download) plugin for your favourite editor.  We use this to enforce some style rules not covered by code linting.
* Make a clone of the project, or update an existing copy.
* Install project dependencies with `npm install`.

## Scripts:

#### `npm test`

Shortcut for `eslint .`.

#### `npm run dev`

Installs XKit into a temporary browser instance for testing.

> **Note**: changes to extension and theme files are not automatically propagated to the XKit extension in the browser.  Each time changes are made, XKit must be force-updated through "Update all my extensions" before the changes will be reflected.

You can run `npm run dev -- --f=nightly`, `npm run dev -- --f=deved` or `npm run dev -- --t=chromium` to run the test in Firefox Nightly, Firefox Developer Edition, or Chrome, respectively, if you have those browsers installed.

#### `npm run build`

Uses `web-ext build` with the necessary file exclusions to build and pack the WebExtension (unsigned).

