/* globals require, exports, Promise */
let prefs = require('sdk/preferences/service');
let {setTimeout} = require('sdk/timers');
let prefRoot = 'extensions.xkit7.';

function migratePreference(port, prefKey) {
	let name = prefKey.substring(prefRoot.length);
	let value = prefs.get(prefKey, null);
	let msg = {};
	msg[name] = value;
	// postMessage doesn't return a promise even though it could :(
	port.postMessage(msg);
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			if (port.error) {
				reject(port.error);
			} else {
				resolve();
			}
		}, 10);
	});
}

function migratePreferences(port, existingKeys) {
	if (existingKeys.length === 0) {
		return Promise.resolve();
	}
	let key = existingKeys.pop();
	return migratePreference(port, key).then(function() {
		return migratePreferences(port, existingKeys);
	});
}

exports.setSyncLegacyDataPort = function(port) {

	// Get all and broadcast to webext one at a time
	let existingKeys = prefs.keys(prefRoot);

	migratePreferences(port, existingKeys).then(() => {
		return port.postMessage({isProperlyMigrated: true});
	}).catch(err => {
		console.error('preferences not migrated', err);
	});
};
