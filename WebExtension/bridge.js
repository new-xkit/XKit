/*

	Bridge2 for XKit
	Version 2.2

	(c) 2011 - 2013 STUDIOXENIX

*/

/* globals chrome, browser, msBrowser */

if (typeof(browser) === 'undefined') {
	if (typeof(chrome) !== 'undefined') {
		browser = chrome; // eslint-disable-line no-global-assign
	} else if (typeof(msBrowser) !== 'undefined') {
		browser = msBrowser; // eslint-disable-line no-global-assign
	}
}

var bridge_error = false;
var bridge_error_object;
var xkit_storage = {};
var bridge_ver = "2.1";

try {
	var storage = browser.storage.local;
	var storage_loaded = false;
	var framework_version = getVersion();
	var storage_used = 0;
	var storage_max = -1;
	init_bridge();
} catch (e) {
	console.log("[XKIT] Caught bridge error: " + e.message);
	bridge_error_object = e;
	bridge_error = true;
	try {
		call_xkit();
	} catch (em) {
		alert("Fatal XKit Error:\n" + em.message + "\n\nPlease go to new-xkit-extension.tumblr.com for support.");
		console.log("[XKIT] Caught bridge error: " + em.message);
	}
}

function getBridgeError() {
	var m_object = {};
	m_object.errors = bridge_error;
	m_object.error = bridge_error_object;
	return m_object;
}

function getVersion() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', browser.extension.getURL('manifest.json'), false);
	xhr.send(null);
	var manifest = JSON.parse(xhr.responseText);
	return manifest.version;
}

function call_xkit() {
	if (typeof XKit !== "undefined") {
		XKit.init();
	} else {
		setTimeout(function() { call_xkit(); }, 1);
	}
}

function init_bridge() {

	var last_error = "";

	console.log("[XKit Bridge] Hello from Bridge " + bridge_ver);
	console.log("[XKit Bridge] Retrieving storage..");

	try {

		storage.get(function(items) {

			if (browser.runtime.lastError) {
				last_error = browser.runtime.lastError.message;
				console.log("storage.get error: " + last_error);
			}

			if (last_error !== "") {

				XKit.window.show("Corrupt storage", "XKit noticed that your browser's storage area allocated for XKit is corrupt and will now reset itself and clear the storage area so it can save it data and function properly.<br/><br/><b>Your browser returned the following error message:</b><br/>\"" + last_error + "\"<br/><br/>If you keep seeing this message, it means your browser's profile file is corrupt, please try uninstalling and reinstalling New XKit", "error",  "<div class=\"xkit-button default\" id=\"xkit-bridge-reset-and-continue\">OK</div>");
				$("#xkit-bridge-reset-and-continue").click(function() {
					GM_flushStorage(function() {
						init_bridge();
					});
				});
				return;
			}
			if (typeof(chrome) === 'undefined') {
				if (!items.isProperlyMigrated) {
					XKit.window.show("Storage migration in progress", "XKit is still busy migrating your preferences from the old storage system to the new one. Please check back in a couple seconds by refreshing the page.", "warning",  "<div class=\"xkit-button default\" id=\"xkit-bridge-refresh\">Refresh</div>");
					$("#xkit-bridge-refresh").click(function() {
						window.location = window.location;
					});
					return;
				}

			}
			for (var key in items) {
				xkit_storage[key] = items[key];
			}
			storage_loaded = true;
			console.log("[XKit Bridge] Storage loaded, calling XKit.. bye!");

			if (storage.getBytesInUse) {
				storage.getBytesInUse(function(bytes) {
					storage_used = bytes;
					storage_max = -1;
					call_xkit();
				});
			} else {
				call_xkit();
			}

		});

	} catch (e) {
		XKit.window.show("Corrupt storage", "XKit noticed that your browser's storage area allocated for XKit is corrupt and will now reset itself and clear the storage area so it can save it data and function properly.<br/><br/><b>Your browser returned the following error message:</b><br/>\"" + last_error + "\"<br/><br/>If you keep seeing this message, it means your browser's profile file is corrupt, please try uninstalling and reinstalling New XKit", "error",  "<div class=\"xkit-button default\" id=\"xkit-bridge-reset-and-continue\">OK</div>");

		$("#xkit-bridge-reset-and-continue").click(function() {
			GM_flushStorage(function() {
				init_bridge();
			});
		});
		return;

	}
}

function GM_flushStorage(callback) {

	storage.remove("xkit_something", function() {
		storage.clear(function(items) {
			var last_error = 'unknown error';
			if (browser.runtime.lastError) {
				last_error = browser.runtime.lastError.message;
			}
			console.log("storage.clear error: " + last_error);
			callback();
		});
	});

}

function GM_deleteAllValues(callback) {

	storage.get(function(items) {
		for (var key in items) {
			storage.remove(key);
		}
		storage.clear();
		callback();
	});

}

function GM_getValue(name, defaultValue) {

	//console.log("Bridge : GM_getValue for " + name);
	var value = xkit_storage[name];
	if (!value) {
		// console.log("   --- Returning default value.");
		return defaultValue;
	} else {
		// console.log("   --- Returning " + value.substring(0,60) + "...");
		return value;
	}

}

function GM_deleteValue(name) {

	//console.log("Bridge : GM_deleteValue for " + name);
	storage.remove(name);

}

function GM_setValue(name, value) {

	var m_object = {};
	var m_name = name;
	m_object[ m_name ] = value;
	xkit_storage[name] = value;
	storage.set(m_object);
	return true;

}

function GM_log(message) {

	console.log(message);

}

function GM_openInTab(url) {

	return window.open(url, "_blank");

}

function GM_listValues() {

	// // console.log("Bridge : GM_listValues");
	try {
		var list = [];
		var reKey = new RegExp("^" + "");
		for (var i = 0, il = window.localStorage.length; i < il; i++) {
			// only use the script's own keys
			var key = window.localStorage.key(i);
			if (key.match(reKey)) {
				list.push(key);
			}
		}
		return list;
	} catch (e) {
		return "";
	}

}

function GM_xmlhttpRequest(settings) {

	try {

		var request = new XMLHttpRequest();
		var timeout = 1;

		if (settings.url.indexOf("http://") != -1 && settings.url.indexOf("tumblr.com/svc/") != -1) {

			try {
				console.log(" -- Bridge forwarding to HTTPS!");
				settings.url = settings.url.replace("http://", "https://");
				timeout = 1;
			} catch (e) {
				console.log(" -- Bridge forwarding to HTTPS FAIL..!");
			}

		}

		settings.url = settings.url.replace("http://api.tumblr.com", "https://api.tumblr.com");

		if (settings.url.indexOf("http://www.tumblr.com/") === 0) {

			try {
				console.log(" -- Bridge forwarding to HTTPS! (Dashboard)");
				settings.url = settings.url.replace("http://", "https://");
				timeout = 1;
			} catch (e) {
				console.log(" -- Bridge forwarding to HTTPS FAIL..!");
			}

		}

		setTimeout(function() {

			if (settings.method === "POST") {
				request.open('POST', settings.url, true);
			} else {
				request.open('GET', settings.url, true);
			}

			request.onreadystatechange = function(oEvent) {
				if (request.readyState === 4) {
					if (request.status === 200) {
						if (typeof settings.onload !== "undefined") {
							settings.onload.call(request, request);
						}
					} else {
						if (typeof settings.onerror !== "undefined") {
							settings.onerror.call(request, request);
						}
					}
				}
			};

			if (typeof settings.headers !== "undefined") {
				for (var obj in settings.headers) {
					request.setRequestHeader(obj, settings.headers[obj]);
				}
			}

			if (settings.method === "POST") {
				if (settings.json === true) {
					request.setRequestHeader('Content-Type', "application/json");
					console.log(" -- Bridge requesting post with json mode on");
				} else {
					request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
					console.log(" -- Bridge requesting post with json mode off");
				}
				request.send(settings.data);
			} else {
				request.send(null);
			}

		}, timeout);

	} catch (e) {
		console.log("Bridge can not make request: " + e.message);
	}

}
