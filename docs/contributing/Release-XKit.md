## XKit release checklist

Manually building, submitting, and deploying an XKit version release currently takes many steps, but there is some Github Actions automation to combine some of them and allow them to be run from the web interface.

- Commit a version increase to [manifest.json](../../manifest.json).
- Commit a version increase to [xkit_patches.js](../../Extensions/xkit_patches.js).
  - `run_order` should have an additional entry added with the new version.
  - `patches` should have an additional entry added, corresponding with the new version. In most cases, this should consist of a) changing the key of the latest entry to the new version, and b) adding a new empty entry below it corresponding to the current version. This represents setting the entire current set of patches to apply to both the current and new versions.
- Run the **Generate Release** Github action. This will package the extension code and submit it to the Firefox addons store and Chrome web store for security review and signing, and generate a Github release draft if they succeed.
  - If Firefox review and signing causes the action to time out, wait for it to finish, then run the **Generate Release (after signing)** Github action.
- Edit the Github release draft to add release notes and any additional information.
- When ready, publish the Github release and run the **Publish Release** action. This will publish the new version for automatic update on the Chrome web store, and will create a pull request to update the repository metadata that triggers automatic update in Firefox and in-extension update notifications.
- Merge the resulting PR.
