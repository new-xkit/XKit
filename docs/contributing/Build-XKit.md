## Prerequisites:

* Download [Node.js](https://nodejs.org/download/) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Install `gulp` globally: `npm install -g gulp`.
* Install the [EditorConfig](http://editorconfig.org/#download) plugin for your favourite editor.  We use this to enforce some style rules not covered by code linting.
* Make a clone of the project, or update an existing copy.
* Install project dependencies with `npm install`.

## Serving Resources Locally

Serving extensions and themes locally is useful for rapid development without requiring the use of the XKit Editor, but some initial set up is required:

1. Run `gulp server` to start the resource server.  This task will automatically build the extension and theme files from source before the server starts.  See [`gulp server`](#gulp-server) for more information.
1. Navigate to `https://localhost:31337` and create a security exception for the `localhost` domain.  The project uses self-signed SSL/TLS certificates that are untrusted by default in order to work around mixed-content warnings for websites like Tumblr that are served over HTTPS.
1. Change [the relevant line](https://github.com/new-xkit/XKit/blob/db88af1f6d232a4f3e8ba4626f28a0d64240e2a0/xkit.js#L233) with the URL string in `xkit.js` to `https://localhost:31337/Extensions/dist/` to point XKit at `localhost`.
  - **Note**: Ensure the above URL is copied exactly.  Malformed URLs will result in XKit falling back to the old servers.
1. Build the XKit extension from source with `gulp build:PLATFORM`, where `PLATFORM` is one of the supported platforms.  See [`gulp build`](#gulp-build) for more information.
1. Reload the XKit extension in the browser under test:
  - Chrome: simply reload the unpacked extension
  - Firefox: remove any previous versions of XKit used for development and re-install it from the `.xpi` file in `build/firefox/`
1. Open the XKit settings menu and navigate to Other > Update All and click "Update all my extensions".

> **Note**: changes to extension and theme files are not automatically propagated to the XKit extension in the browser.  Each time changes are made, XKit must be force-updated through "Update all my extensions" before the changes will be reflected.

## Gulp Tasks:

#### `gulp` (default)

The default task.

See also: [`gulp lint`](#gulp-lint).

#### `gulp watch`

Watches filesystem and lints files on change.

See also: [`gulp lint:scripts`](#gulp-lintscripts), [`gulp lint:css`](#gulp-lintcss).

#### `gulp clean`

Top-level cleaning task.

See also: [`gulp clean:build`](#gulp-cleanbuild).

#### `gulp clean:build`

Cleans the `build/` directory, deleting it and any subfolders.

#### `gulp clean:modules`

Cleans the `node_modules/` directory, deleting it and any subfolders.

#### `gulp clean:chrome`

Cleans the `build/chrome/` directory, deleting the previous build for Chrome.

#### `gulp clean:firefox`

Cleans the `build/firefox/` directory, deleting the previous build for Firefox.

#### `gulp clean:safari`

Cleans the `build/safari.safariextension/` directory, deleting the previous build for Safari.

#### `gulp lint`

Top-level linting task.

See also [`gulp lint:scripts`](#gulp-lintscripts), [`gulp lint:css`](#gulp-lintcss).

#### `gulp lint:scripts`

Lints JavaScript files using ESLint, and reports the output.

#### `gulp lint:css`

Lints CSS files using CSSLint and reports the output.

#### `gulp build`

Top-level build task.

See also: [`gulp build:chrome`](#gulp-buildchrome), [`gulp build:firefox`](#gulp-buildfirefox), [`gulp build:safari`](#gulp-buildsafari).

#### `gulp build:chrome`

Builds the Chrome browser extension from source and outputs it to `build/chrome/`.  Also creates an archive, `new-xkit-x.x.x.zip`, and outputs it to `build/chrome/`.

#### `gulp copy:chrome`

Builds the Chrome browser extension from source and outputs it to `build/chrome/`.

See also: [`gulp build`](#gulp-build), [`gulp build:chrome`](#gulp-buildchrome), [`gulp compress:chrome`](#gulp-compresschrome).

#### `gulp compress:chrome`

Creates an archive, `new-xkit-x.x.x.zip`, from an existing Chrome source build and outputs it to `build/chrome/`.

See also: [`gulp build`](#gulp-build), [`gulp build:chrome`](#gulp-buildchrome), [`gulp copy:chrome`](#gulp-copychrome).

#### `gulp build:firefox`

Builds the Firefox browser extension from source and outputs it to `build/firefox/`.  Also creates a [Cross-platform Installer Module](https://developer.mozilla.org/en/docs/XPI), `@new-xkit-x.x.x.xpi`, and outputs it to `build/firefox/`.

See also: [`gulp compress:firefox`](#gulp-compressfirefox), [`gulp copy:firefox`](#gulp-copyfirefox).

#### `gulp copy:firefox`

Builds the Firefox browser extension from source and outputs it to `build/firefox/`.

See also: [`gulp build`](#gulp-build), [`gulp build:firefox`](#gulp-buildfirefox), [`gulp compress:firefox`](#gulp-compressfirefox).

#### `gulp compress:firefox`

Creates a [Cross-platform Installer Module](https://developer.mozilla.org/en/docs/XPI), `@new-xkit-x.x.x.xpi`, from an existing Firefox source build and outputs it to `build/firefox/`.

See also: [`gulp build`](#gulp-build), [`gulp build:firefox`](#gulp-buildfirefox), [`gulp copy:firefox`](#gulp-copyfirefox).

#### `gulp build:safari`

Builds the Safari browser extension from source and outputs it to `build/safari.safariextension/`.

See also: [`gulp copy:safari`](#gulp-copysafari).

#### `gulp copy:safari`

Builds the Safari browser extension from source and outputs it to `build/safari.safariextension/`.

See also: [`gulp build`](#gulp-build), [`gulp build:safari`](#gulp-buildsafari).

#### `gulp build:extensions`

Builds the extension distribution from source, including the JSON-ified extension files, `list.json`, and `gallery.json`.

See also: [`gulp lint:scripts`](#gulp-lintscripts).

#### `gulp build:themes`

Builds the themes distribution from source, including `themes.json`.

See also: [`gulp lint:css`](#gulp-lintcss).

#### `gulp server`

Serve extension and theme files locally.

See also: [`gulp build:extensions`](#gulp-buildextensions), [`gulp build:themes`](#gulp-buildthemes).
