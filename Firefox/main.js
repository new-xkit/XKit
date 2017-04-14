/* globals require, browser */
const webext = require("sdk/webextension");
const {setSyncLegacyDataPort} = require("./sync-data");

webext.startup().then(({browser}) => {
	browser.runtime.onConnect.addListener(port => {
		if (port.name === "sync-legacy-addon-data") {
			setSyncLegacyDataPort(port);
		}
	});
});

