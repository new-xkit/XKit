/* globals safari */
// XKit Bridge for Safari Background Page.

function XBackground() {
	this.version = 1;
	this.framework_version = safari.extension.displayVersion;
	this.storageData = {};

	safari.application.addEventListener("message", this.onMessage.bind(this), false);
	this.readAllStorage();
}

XBackground.prototype.readAllStorage = function() {
	this.storageData = {};

	var localStorageLength = localStorage.length;
	for (var i = 0; i < localStorageLength; i++) {
		var key = localStorage.key(i);
		this.storageData[key] = localStorage.getItem(key);
	}
	return this.storageData;
};

XBackground.prototype.getStorageSize = function() {
	return 0;
};

XBackground.prototype.onMessage = function(event) {
	try {
		var handler = this.messageHandlers[event.name];
		if (handler) {
			// Call handler with event using XBackground as this
			return handler.call(this, event);
		}
		console.log("XBackground: Unknown message '" + event.name + "'");
	} catch (e) {
		alert("XBackground Error: " + e + " with event " + JSON.stringify(event));
	}
};

XBackground.prototype.dispatchEventMessage = function(event, name, message) {
	if (!event || !event.target || !event.target.page) {
		console.warn("XBackground: Dispatching to dead or private page");
		return;
	}
	try {
		event.target.page.dispatchMessage(name, message);
	} catch (e) {
		console.error("XBackground Error: During dispatchEventMessage " + e);
	}
};

XBackground.prototype.messageHandlers = {
	framework_version: function(ev) {
		this.dispatchEventMessage(ev, "framework_version", {
			version: this.framework_version,
			storage: JSON.stringify(this.storageData)
		});
	},
	save_storage_value: function(ev) {
		this.storageData[ev.message.name] = ev.message.value;
		localStorage[ev.message.name] = ev.message.value;
	},

	delete_storage_value: function(ev) {
		delete this.storageData[ev.message.name];
		delete localStorage[ev.message.name];
	},

	delete_storage: function(ev) {
		this.storageData = {};
		localStorage.clear();

		this.dispatchEventMessage(ev, "delete_storage_complete", ev.message);
	},

	http_request: function(ev) {

		var background = this;
		var settings = ev.message.settings;
		var request = new XMLHttpRequest();

		// Save our settings to the XMLHttpRequest object.
		request.xkit_request_object = ev.message;

		if (settings.method === "POST") {
			request.open('POST', settings.url, true);
		} else {
			request.open('GET', settings.url, true);
		}

		// Learn to listen to event changes.
		request.onreadystatechange = function(event) {

			if (request.readyState !== 4)
				return;

			// Create response object.
			var response = {};
			// Manually copy request object because Safari Technology Preview
			// doesn't stringify it properly
			var objRequest = {};
			for (var key in request) {
				objRequest[key] = request[key];
			}
			response.request = JSON.stringify(objRequest);
			response.status = request.status;
			response.settings = request.settings;
			response.request_id = request.xkit_request_object.request_id;
			response.headers = request.getAllResponseHeaders();

			background.dispatchEventMessage(ev, "http_response", response);

		};

		// Set headers if available.
		if (typeof settings.headers !== "undefined") {
			settings.headers = JSON.parse(settings.headers);
			console.log(" ------      FOUND HEADERS YAY XKIT   ----- ");
			console.log(settings.headers);
			for (var header in settings.headers) {
				request.setRequestHeader(header, settings.headers[header]);
			}
		} else {
			console.log(" ------ !! ----- NO HEADERS ------ !! ----- ");
		}

		if (settings.method === "POST") {
			if (settings.json === true) {
				request.setRequestHeader('Content-Type', "application/json");
			} else {
				request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
			}
			request.send(settings.data);
		} else {
			request.send(null);
		}
	}
};
