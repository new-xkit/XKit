var storage_used = 0;
var storage_max = -1;

/**
 * Implement the storage component of XKit
 */
var AddonStorage = (function() {
	var database = {};

	self.port.on('set', function(data) {
		database[data.name] = data.value;
	});

	function storageUsed() {
		let size = 0;
		for (let key of listKeys()) {
			size += get(key, '').length;
		}
		return size;
	}

	function set(name, value) {
		database[name] = value;

		self.port.emit('set', {
			name: name,
			value: value
		});
	}

	function get(name, defaultValue) {
		if (database.hasOwnProperty(name)) {
			return database[name];
		}
		return defaultValue;
	}

	function resetAll() {
		self.port.emit('reset_all', {});
	}

	function reset(name) {
		self.port.emit('reset', {name: name});
	}

	function listKeys() {
		return Object.keys(database);
	}

	return {
		storageUsed: storageUsed,
		get: get,
		set: set,
		resetAll: resetAll,
		reset: reset,
		listKeys: listKeys
	};
})();
