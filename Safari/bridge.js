/* globals safari */
var framework_version = 0;
var storage_max = -1;
var storage_used = -1;

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};
}

(function() {

	if (typeof XBridge !== "undefined") { return; }

	XBridge = {

		version: 1,
		framework_version: 0,
		storage_area: {},

		init: function() {

			console.log("XBridge: Version " + XBridge.version + ": Initializing..");
			console.log("XBridge: Page is " + document.location.href);

			if (top !== self && typeof safari === "undefined") {
				console.log("XBridge: Quitting, top!==self and safari is undefined.");
				return;
			}

			// Let's first fetch the storage and framework version.
			safari.self.addEventListener("message", XBridge.message, false);
			XBridge.dispatchMessage("framework_version", {});
		},

		dispatchMessage: function(name, message) {
			message.location = document.location.href;
			safari.self.tab.dispatchMessage(name, message);
		},

		message: function(ev) {

			if (typeof XBridge.messages[ev.name] != "undefined")
				return XBridge.messages[ev.name](ev);

			console.log("XBridge: Unknown message '" + ev.name + "'");

		},

		messages: {

			framework_version: function(ev) {

				// Called after XBackground loads the storage and reads Framework version.

				console.log("XBridge: Running on Framework " + ev.message.version);
				framework_version = ev.message.version;
				XBridge.framework_version = ev.message.version;
				XBridge.storage_area = JSON.parse(ev.message.storage);

				console.log(XBridge.storage_area);

				if (typeof jQuery == 'undefined') {
					console.log("XBridge: Warning! jQuery is not found!");
					XBridge.init_XKit(0);
				} else {
					jQuery(document).ready(function() {
						XBridge.init_XKit(0);
					});
				}

			},

			http_response: function(ev) {

				// Called after a network request is complete.

				console.log("XBridge: Received HTTP Request for ID " + ev.message.request_id);
				ev.message.request = JSON.parse(ev.message.request);

				ev.message.request.f_headers = ev.message.headers.split("\r\n");

				ev.message.request.getResponseHeader = function(header) {

					for (var i = 0; i < this.f_headers.length; i++) {
						if (this.f_headers[i].substring(0, header.length + 1) === header + ":") {
							return this.f_headers[i].substring(header.length + 2);
						}
					}

					return "";

				};

				for (var i = 0; i < XBridge.network.callbacks.length; i++) {

					var callback = XBridge.network.callbacks[i];

					if (callback.id == ev.message.request_id) {

						if (ev.message.status === 200) {
							if (typeof callback.onload !== "undefined") {
								callback.onload(ev.message.request, ev.message.request, ev.message.request);
							}
						} else {
							if (typeof callback.onerror !== "undefined") {
								callback.onerror(ev.message.request, ev.message.request, ev.message.request);
							}
						}

						XBridge.network.callbacks.splice(i, 1);
						return;

					}

				}

				console.log("XBridge: Warning! Callback for HTTP Request " +  ev.message.request_id + " not found!");

			},

			delete_storage_complete: function(ev) {

				// Called after XBackground deletes all storage data.

				for (var i = 0; i < XBridge.storage.callbacks.length; i++) {

					var callback = XBridge.storage.callbacks[i];

					if (callback.id == ev.message.id) {
						XBridge.storage.callbacks[i].callback();
						XBridge.storage.callbacks.splice(i, 1);
						return;
					}

					console.log("XBridge: Warning! Callback for Storage Deletion Request " +  ev.message.id + " not found!");

				}

			}

		},

		init_XKit: function(tryCount) {

			if (typeof XKit == 'undefined') {
				if (tryCount <= 5) {
					setTimeout(function() { XBridge.init_XKit(tryCount + 1); }, 100);
				} else {
					console.log("XBridge: Fatal Error! XKit object is not found!");
				}
				return false;
			}

			// Add the CSS here. By default, Safari adds our CSS first, and Tumblr's
			// CSS completely overwrites stuff like DIV and A, making our CSS useless
			// unless loaded after theirs.
			var link = document.createElement("link");
			link.href = safari.extension.baseURI + "xkit.css";
			link.type = "text/css";
			link.rel = "stylesheet";
			link.media = "screen";
			document.getElementsByTagName("head")[0].appendChild(link);

			XKit.version = framework_version;
			XKit.init();

		},

		make_id: function() {

			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for ( var i = 0; i < 50; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;

		},

		network: {

			callbacks: [],

			request: function(settings) {

				settings.url = settings.url.replace("http://api.tumblr.com", "https://api.tumblr.com");

				if (settings.url == "http://www.tumblr.com/dashboard" || settings.url == "http://www.tumblr.com/dashboard/") {
					settings.url = settings.url.replace("http://", "https://");
				}

				if (settings.url.indexOf("http://") != -1 && settings.url.indexOf("tumblr.com/svc/") != -1) {
					settings.url = settings.url.replace("http://", "https://");
				}

				var toSend = {};
				toSend.settings = settings;
				toSend.request_id = XBridge.make_id();

				console.log("XBridge: Sending network request for " + settings.url);
				console.log("XBridge: Network request ID is " + toSend.request_id);

				var callbacks = {};
				callbacks.id = toSend.request_id;
				callbacks.onload = settings.onload;
				callbacks.onerror = settings.onerror;
				XBridge.network.callbacks.push(callbacks);

				// Safari does not like us passing functions.
				delete toSend.settings.onload;
				delete toSend.settings.onerror;
				toSend.settings.headers = JSON.stringify(toSend.settings.headers);

				XBridge.dispatchMessage("http_request", toSend);

			}

		},

		storage: {

			callbacks: [],

			write: function(name, value) {

				var toWrite = '%' + (typeof value)[0] + window.btoa(encodeURIComponent(value));
				XBridge.storage_area[name] = toWrite;

				// Send data to background page so it would get saved.
				XBridge.dispatchMessage("save_storage_value", {
					name: name,
					value: toWrite
				});

			},

			read: function(name, defaultValue) {

				var value = XBridge.storage_area[name];
				if (!value) { return defaultValue; }

				var type = value[0];
				// Leading '%' denotes escaped encoding
				if (type === '%') {
					type = value[1];
					value = decodeURIComponent(window.atob(value.substring(2)));
				} else {
					value = value.substring(1);
				}

				switch (type) {
				case 'b':
					return value === 'true';
				case 'n':
					return Number(value);
				default:
					return value;
				}

			},

			erase: function(name) {

				delete XBridge.storage_area[name];
				XBridge.dispatchMessage("delete_storage_value", {name: name});

			},

			erase_all: function(callback) {
				var callbackObject = {
					id: XBridge.make_id(),
					callback: callback
				};
				XBridge.storage.callbacks.push(callbackObject);

				XBridge.dispatchMessage("delete_storage", {id: callbackObject.id});
			}
		},
	};
	XBridge.init();
}());

// Legacy/Unused/GM functions
function getBridgeError() { return ""; }
function GM_log(message) { console.log(message); }
function GM_openInTab(url) { return window.open(url, "_blank"); }
function GM_xmlhttpRequest(settings) { XBridge.network.request(settings); }
function GM_setValue(name, value) { XBridge.storage.write(name, value); }
function GM_getValue(name, defaultValue) { return XBridge.storage.read(name, defaultValue); }
function GM_deleteValue(name, no_save) { XBridge.storage.erase(name); }
function GM_deleteAllValues(callback) { XBridge.storage.erase_all(callback); }
