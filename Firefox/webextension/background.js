/* global browser, Promise */

// From the MDN WebExtensions hybrid addon example

// Ask to the legacy part to dump the needed data and send it back
// to the background page...
browser.storage.local.get('isProperlyMigrated').then(function(item) {
	if (item.isProperlyMigrated) {
		console.warn('Skipping migration', item);
		return;
	}

	var port = browser.runtime.connect({name: "sync-legacy-addon-data"});
	function onMessage(msg) {
		if (!msg) {
			return;
		}
		let setPromises = Object.keys(msg).map(function(key) {
			return browser.storage.local.get({key: null}).then(function(msgItem) {
				if (typeof(msgItem[key]) === 'string') {
					if (msgItem[key].length > msg[key].length) {
						// Do not update the storage
						return Promise.resolve();
					}
				}
				// The corresponding code in XKit is GM_setValue(name, value) -> set({name: value})
				return browser.storage.local.set(msg);
			});
		});
		Promise.all(setPromises).catch(function(err) {
			let errorMessage = "XKit failed to migrate your preferences to the new storage system. The migration reported the following error messag: " + err + ". Please restart your browser to try again.";
			if (typeof(XKit) === 'undefined') {
				alert(errorMessage);
			} else {
				XKit.window.show("Storage migration in progress", errorMessage, "error",  "<div class=\"xkit-button default\">OK</div>");
			}
			browser.storage.local.set({isProperlyMigrated: false});
			port.onMessage.removeListener(onMessage);
		});
	}

	port.onMessage.addListener(onMessage);
});
