/* global browser */

// From the MDN WebExtensions hybrid addon example

// Ask to the legacy part to dump the needed data and send it back
// to the background page...
browser.storage.local.get('isProperlyMigrated').then(function(item) {
	if (item.isProperlyMigrated) {
		console.warn('Skipping migration', item);
		return;
	}

	var port = browser.runtime.connect({name: "sync-legacy-addon-data"});
	port.onMessage.addListener((msg) => {
		if (msg) {
			// The corresponding code in XKit is GM_setValue(name, value) -> set({name: value})
			browser.storage.local.set(msg);
		}
	});
});
