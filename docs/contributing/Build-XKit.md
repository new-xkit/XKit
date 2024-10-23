## Prerequisites:

* Download [Node.js](https://nodejs.org/download/) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Install the [EditorConfig](http://editorconfig.org/#download) plugin for your favourite editor.  We use this to enforce some style rules not covered by code linting.
* Make a clone of the project, or update an existing copy.
* Install project dependencies with `npm install`.

## Scripts:

#### `npm test`

Shortcut for `eslint .`.

#### `npm build-extensions`

Builds the extension and themes distribution from source, including the JSON-ified extension files, `list.json`, `gallery.json`, and`themes.json`.

#### `npm run build`

Uses `web-ext build` with the necessary file exclusions to build and pack the WebExtension (unsigned).

