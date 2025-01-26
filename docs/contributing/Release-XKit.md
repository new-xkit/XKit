## XKit release checklist

Manually building, submitting, and deploying an XKit version release currently takes many steps, but there is some Github Actions automation to combine some of them and allow them to be run from the web interface.

- Commit a version increase to [manifest.json](../../manifest.json).
- Run the **Generate Release** Github action. This will package the extension code and submit it to the Firefox addons store and Chrome web store for security review and signing, and generate a Github release draft if they succeed.
  - If Firefox review and signing causes the action to time out, wait for it to finish, then run the **Generate Release (after signing)** Github action.
- Edit the Github release draft to add release notes and any additional information.
- When ready, publish the Github release and run the **Publish Release** action. This will publish the new version for automatic update on the Chrome web store, and will create a pull request to update the repository metadata that triggers automatic update in Firefox and in-extension update notifications (currently disabled; see #2171).
- Merge the resulting PR.
