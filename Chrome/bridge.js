/*

	Bridge2 for XKit
	Version 2.2.1

	(c) 2011 - 2013 STUDIOXENIX

*/

var bridge_error = false;
var bridge_error_object;
var xkit_storage = {};
var bridge_ver = "2.2.1";

try {
	var storage = chrome.storage.local;
	var storage_loaded = false;
	var framework_version = getVersion();
	var storage_used = -1;
	var storage_max = -1;
	init_bridge();
} catch(e) {
	console.log("[XKIT] Caught bridge error: " + e.message);
	bridge_error_object = e;
	bridge_error = true;
	try {
		call_xkit();
	} catch(em) {
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
	var version = 'NaN';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
	xhr.send(null);
	var manifest = JSON.parse(xhr.responseText);
	return manifest.version;
}

function call_xkit() {
	if(typeof XKit !== "undefined") {
		XKit.init();
	} else {
		setTimeout(function() { call_xkit(); }, 1);
	}
}

function init_bridge() {

	console.log("[XKit Bridge] Hello from Bridge " + bridge_ver);
	console.log("[XKit Bridge] Retrieving storage..");

	try {

	storage.get(function(items) {

		last_error = "";

		if (typeof chrome.runtime.lastError !== "undefined") {
			last_error = chrome.runtime.lastError.message;
			console.log("storage.get error: " + last_error);
		}

		if (last_error !== "") {

			XKit.window.show("Corrupt storage","XKit noticed that your browser's storage area allocated for XKit is corrupt and will now reset itself and clear the storage area so it can save it data and function properly.<br/><br/><b>Your browser returned the following error message:</b><br/>\"" + last_error + "\"<br/><br/>If you keep seeing this message, it means your Chrome's profile file is corrupt, please click on the button below for more information and learn how to fix it.", "error","<div class=\"xkit-button default\" id=\"xkit-bridge-reset-and-continue\">OK</div><a href=\"http://xkit-extension.tumblr.com/post/52742121604/chrome-system-restores-corrupt-profile-settings-and\" class=\"xkit-button\">Didn't fix your problem?</a>");
			$("#xkit-bridge-reset-and-continue").click(function() {
				GM_flushStorage(function() {
					init_bridge();
				});
			});
			return;
		}
		for (var key in items) {
			xkit_storage[key] = items[key];
		}
		storage_loaded = true;
		console.log("[XKit Bridge] Storage loaded, calling XKit.. bye!");

		storage.getBytesInUse(function(bytes) {
			storage_used = bytes;
			storage_max = -1;
			call_xkit();
		});



	});

	} catch(e) {

		XKit.window.show("Corrupt storage","XKit noticed that your browser's storage area allocated for XKit is corrupt and will now reset itself and clear the storage area so it can save it data and function properly.<br/><br/><b>Your browser returned the following error message:</b><br/>\"" + last_error + "\"<br/><br/>If you keep seeing this message, it means your Chrome's profile file is corrupt, please click on the button below for more information and learn how to fix it.", "error","<div class=\"xkit-button default\" id=\"xkit-bridge-reset-and-continue\">OK</div><a href=\"http://xkit-extension.tumblr.com/post/52742121604/chrome-system-restores-corrupt-profile-settings-and\" class=\"xkit-button\">Didn't fix your problem?</a>");
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
			var last_error = chrome.runtime.lastError.message;
			console.log("storage.clear error: " + last_error);
			callback();
		});
	});

}

function GM_deleteAllValues(callback) {

	storage.get(function(items) {
		for (var key in items) {
			GM_deleteValue(key);
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
	delete xkit_storage[name];

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
	return Object.keys(xkit_storage);

}

function GM_xmlhttpRequest(settings) {

	try {

		var request = new XMLHttpRequest();
		var timeout = 1;

		if (settings.url.indexOf("http://") != -1 && settings.url.indexOf("tumblr.com/svc/") != -1) {

			try {
				console.log(" -- Bridge forwarding to HTTPS!");
				settings.url = settings.url.replace("http://","https://");
				timeout = 1;
			} catch(e) {
				console.log(" -- Bridge forwarding to HTTPS FAIL..!");
			}

		}

		settings.url = settings.url.replace("http://api.tumblr.com","https://api.tumblr.com");

		if (settings.url.indexOf("http://www.tumblr.com/") === 0) {

			try {
				console.log(" -- Bridge forwarding to HTTPS! (Dashboard)");
				settings.url = settings.url.replace("http://","https://");
				timeout = 1;
			} catch(e) {
				console.log(" -- Bridge forwarding to HTTPS FAIL..!");
			}

		}

		setTimeout(function() {

			if (settings.method === "POST") {
				request.open('POST', settings.url, true);
			} else {
				request.open('GET', settings.url, true);
			}

			request.onreadystatechange = function (oEvent) {
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

	} catch(e) {
		console.log("Bridge can not make request: " + e.message);
	}

}
