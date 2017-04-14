/* globals require, exports */
let prefs = require('sdk/preferences/service');
let prefRoot = 'extensions.xkit7.';

exports.setSyncLegacyDataPort = function(port) {

	// Get all and broadcast to webext
	let existingKeys = prefs.keys(prefRoot);
	let xkitStorage = {};
	for (let properName of existingKeys) {
		let name = properName.substring(prefRoot.length);
		let value = prefs.get(properName, null);
		xkitStorage[name] = value;
	}
	port.postMessage(xkitStorage);
};
