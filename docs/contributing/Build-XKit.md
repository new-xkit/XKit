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
2. Navigate to `https://localhost:31337` and create a security exception for the `localhost` domain.  The project uses self-signed SSL/TLS certificates that are untrusted by default in order to work around mixed-content warnings for websites like Tumblr that are served over HTTPS.
3. Change [the relevant line](https://github.com/new-xkit/XKit/blob/db88af1f6d232a4f3e8ba4626f28a0d64240e2a0/xkit.js#L233) with the URL string in `xkit.js` to `https://localhost:31337/Extensions/dist/` to point XKit at `localhost`.
4. Reload the XKit extension in the browser under test:
  - Chrome: [reload the unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked)
  - Firefox: [reload the temporary add-on](https://developer.mozilla.org/en-US/docs/Tools/about:debugging#Extensions)
5. Open the XKit settings menu and navigate to Other > Update All and click "Update all my extensions".

> **Note**: changes to extension and theme files are not automatically propagated to the XKit extension in the browser.  Each time changes are made, XKit must be force-updated through "Update all my extensions" before the changes will be reflected.

## Gulp Tasks:

#### `gulp` (default)

The default task.

See also: [`gulp lint`](#gulp-lint).

#### `gulp lint`

Top-level linting task.

See also [`gulp lint:scripts`](#gulp-lintscripts).

#### `gulp lint:scripts`

Lints JavaScript files using ESLint, and reports the output.

#### `gulp build`

Top-level build task.

See also: [`gulp build:extensions`](#gulp-buildextensions), [`gulp build:themes`](#gulp-buildthemes).

#### `gulp build:extensions`

Builds the extension distribution from source, including the JSON-ified extension files, `list.json`, and `gallery.json`.

See also: [`gulp lint:scripts`](#gulp-lintscripts).

#### `gulp build:themes`

Builds the themes distribution from source, including `themes.json`.

See also: [`gulp lint:css`](#gulp-lintcss).

#### `gulp server`

Serve extension and theme files locally.

See also: [`gulp build:extensions`](#gulp-buildextensions), [`gulp build:themes`](#gulp-buildthemes).
