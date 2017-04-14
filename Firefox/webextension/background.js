/* global browser */

// From the MDN WebExtensions hybrid addon example

// Ask to the legacy part to dump the needed data and send it back
// to the background page...
var port = browser.runtime.connect({name: "sync-legacy-addon-data"});
port.onMessage.addListener((msg) => {
	if (msg) {
		browser.storage.local.get('isMigrated').then(function(item) {
			if (item.isMigrated) {
				console.warn('Skipping migration');
				return;
			}
			// The corresponding code in XKit is GM_setValue(name, value) -> set({name: value})
			msg.isMigrated = true;
			console.log('Migrating pref storage', msg);
			browser.storage.local.set(msg);
		});
	}
});
