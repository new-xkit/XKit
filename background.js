/* globals browser, chrome */

if (typeof browser === "undefined") {
	// eslint-disable-next-line no-global-assign
	browser = chrome;
}

function isUserScriptsAvailable() {
	try {
		browser.userScripts;
		return true;
	} catch {
		return false;
	}
}

if (isUserScriptsAvailable) {
	browser.userScripts.configureWorld({
		csp: "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
		messaging: true,
	});

	browser.runtime.onInstalled.addListener(async () => {
		const existingScripts = await browser.userScripts.getScripts({
			ids: ["new-xkit"],
		});
		browser.userScripts[existingScripts.length > 0 ? "update" : "register"]([
			{
				id: "new-xkit",
				// allFrames: true,
				runAt: "document_start",
				excludeMatches: [
					"*://*.tumblr.com/*/audio_player_iframe/*",
					"*://*.tumblr.com/*/photoset_iframe/*",
					"*://assets.tumblr.com/*",
					"*://*.media.tumblr.com/*",
					"*://www.tumblr.com/upload/image*",
					"*://www.tumblr.com/video/*",
				],
				matches: ["*://*.tumblr.com/*"],
				js: [
					"bridge.js",
					"vendor/lodash.min.js",
					"vendor/jquery.js",
					"vendor/tiptip.js",
					"vendor/moment.js",
					"vendor/nano.js",
					"xkit.js",
				].map(file => ({file})),
				world: "USER_SCRIPT",
			},
		]);
	});
}

// must use synchronous callback form due to https://issues.chromium.org/issues/40753031
browser.runtime.onUserScriptMessage.addListener((request, sender, sendResponse) => {
	console.log("onUserScriptMessage", {request, sender, sendResponse});

	if (request.func) {
		(async () => {
			const {func, args = []} = request;

			switch (func) {
				case "browser.runtime.getManifest":
					sendResponse(await browser.runtime.getManifest(...args));
					break;
				case "browser.storage.local.get":
					sendResponse(await browser.storage.local.get(...args));
					break;
				case "browser.storage.local.getBytesInUse":
					sendResponse(await browser.storage.local.getBytesInUse(...args));
					break;
				case "browser.storage.local.remove":
					sendResponse(await browser.storage.local.remove(...args));
					break;
				case "browser.storage.local.clear":
					sendResponse(await browser.storage.local.clear(...args));
					break;
				case "browser.storage.local.set":
					sendResponse(await browser.storage.local.set(...args));
					break;
				case "browser.runtime.getURL":
					sendResponse(await browser.runtime.getURL(...args));
					break;
			}
		})();
	}

	return true;
});
