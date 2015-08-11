//* TITLE XKit Updates **//
//* VERSION 1.2.3 **//
//* DESCRIPTION Provides automatic updating of extensions **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_updates = new Object({

	running: false,

	default_interval: 18000000,
	min_interval: 3600000,
	max_interval: 86400000,

	preferences: {
		"show_notifications": {
			text: "Show update notifications",
			default: true,
			value: true
		},
		"check_interval": {
			text: "Update check interval (in milliseconds)",
			default: "18000000",
			value: "18000000",
			type: "text"
		},
	},

	run: function() {
		try {
			XKit.tools.init_css("xkit_updates");
			this.running = true;
			var d = new Date();
			var ms = d.getTime();
			var last_time = parseFloat(XKit.storage.get("xkit_updates", "last_update_check", "0"));
			var difference = ms - last_time;
			XKit.console.add("Updates: difference = " + difference);
			if (isNaN(XKit.extensions.xkit_updates.preferences.check_interval.value)) {
				XKit.console.add("Invalid check interval, reverting to default: not a number.");
				XKit.extensions.xkit_updates.preferences.check_interval.value = XKit.extensions.xkit_updates.default_interval;
			} else {
				var m_interval = XKit.extensions.xkit_updates.preferences.check_interval.value;
				if (m_interval > XKit.extensions.xkit_updates.max_interval || m_interval < XKit.extensions.xkit_updates.min_interval) {
					XKit.extensions.xkit_updates.preferences.check_interval.value = XKit.extensions.xkit_updates.default_interval;
					XKit.console.add("Invalid check interval, reverting to default: too small or big.");
				}
			}
			if (difference <= -1 ||difference >= XKit.extensions.xkit_updates.preferences.check_interval.value) {
				XKit.console.add("Starting update checking..");
				XKit.extensions.xkit_updates.get_list();
				XKit.extensions.xkit_updates.update_packs();
			} else {
				XKit.console.add("Skipping update checking.");
			}
		} catch(e) {
			XKit.extensions.xkit_updates.show_update_failure();
		}
	},

	to_update: "",
	to_update_index: 0,
	updated_list: "",
	updated_list_versions: "",

	pack_to_update: "",
	pack_to_update_index: 0,

	update_packs: function() {

		XKit.extensions.xkit_updates.pack_to_update_index = 0;
		XKit.extensions.xkit_updates.pack_to_update = [];

		try {

			var list = XKit.installed.list();

			for (var i=0;i<list.length;i++) {

				var ext_object = XKit.installed.get(list[i]);

				try {

					if (ext_object.pack) {

						XKit.extensions.xkit_updates.pack_to_update.push(ext_object);

					}

				} catch(e) {

					console.log("Can't read " + list[i] + " for update procedure.");

				}

			}

			if (XKit.extensions.xkit_updates.pack_to_update.length > 0) {

				console.log("Going to update " + XKit.extensions.xkit_updates.pack_to_update.length + " packs.");
				XKit.extensions.xkit_updates.update_next_pack();

			} else {
				console.log("No packs found to update.");
			}

		} catch(e) {

			// Eh.

		}

	},

	update_next_pack: function() {

		if (XKit.extensions.xkit_updates.pack_to_update_index >= XKit.extensions.xkit_updates.pack_to_update.length) {
			return;
		}

		var to_update = XKit.extensions.xkit_updates.pack_to_update[XKit.extensions.xkit_updates.pack_to_update_index];

		XKit.extensions.xkit_updates.update_pack(to_update.id, function(data) {

			if (data.errors) {
				console.log("Can't update the pack " + to_update.id + "..");
			} else {
				console.log("Successfully updated the pack " + to_update.id + "..");
			}

			XKit.extensions.xkit_updates.pack_to_update_index++;
			XKit.extensions.xkit_updates.update_next_pack();

		});

	},

	get_list: function(force_mode) {

		if (force_mode) {
			$("#xkit-forced-auto-updates-message").html("Fetching the latest changes from XKit servers...");
		}

		XKit.download.page("list.php", function(mdata) {

			if (mdata.server_down) {

				XKit.extensions.xkit_updates.show_update_failure();
				return;
			}

			XKit.extensions.xkit_updates.to_update_index = 0;
			XKit.extensions.xkit_updates.to_update = [];
			XKit.extensions.xkit_updates.updated_list = [];
			XKit.extensions.xkit_updates.updated_list_versions = [];

			for(var extension in mdata.extensions) {

				if (force_mode) {

					var check_this = false;
					if (XKit.installed.check(mdata.extensions[extension].name)) {

						if (mdata.extensions[extension].version !== XKit.installed.get(mdata.extensions[extension].name).version) {
							check_this = true;
						}

						if (mdata.extensions[extension].name.substring(0,5) === "xkit_") {
							// Always update internals no matter what.
							check_this = true;
						}

						if (check_this) {
							XKit.extensions.xkit_updates.to_update.push(mdata.extensions[extension].name);
						}
					}

				} else {

					if (mdata.extensions[extension].version !== XKit.installed.get(mdata.extensions[extension].name).version) {
						if (XKit.installed.check(mdata.extensions[extension].name)) {
							XKit.extensions.xkit_updates.to_update.push(mdata.extensions[extension].name);
						}
					}

				}

			}

			if (XKit.extensions.xkit_updates.to_update.length > 0) {
				$("body").append("<div id=\"xkit-updating-indicator\">XKit Auto-Update</div>");
				if (force_mode) {
					$("#xkit-forced-auto-updates-message").html("Downloading extensions from the servers...");
				}
				XKit.extensions.xkit_updates.update_next(force_mode);
			} else {
				var d = new Date();
				var ms = d.getTime();
				XKit.storage.set("xkit_updates", "last_update_check", ms);
				XKit.console.add("Update complete: no new extensions");
			}

		});

	},

	show_update_failure: function() {

		XKit.notifications.add("<b>Could not update XKit:</b><br/>I could not reach the XKit servers to update myself. You might be running an old and buggy version of XKit. Click here for details.", "error", true, function() {

			XKit.window.show("Auto-Update failed.","XKit automatically updates itself from time to time in the background to bring you the latest features and bug fixes. Unfortunately, it was unable to contact the servers and download the latest updates. This might be a temporary server error or a problem with your connection.<br/><br/><b>If you have received this message more than twice in the last three days, it is highly recommended that you reset XKit.</b> If you don't, you'll be running an out-of-date XKit which might not work properly and cause problems.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a>");

		});

	},

	update_next: function(force_mode) {

		if (XKit.extensions.xkit_updates.to_update_index >= XKit.extensions.xkit_updates.to_update.length) {

			var d = new Date();
			var ms = d.getTime();
			XKit.storage.set("xkit_updates", "last_update_check", ms);

			// Completed all?

			if (!force_mode) {

				var to_show = XKit.tools.get_setting("xkit_show_update_notifications","true");

				if (to_show === "true") {

					XKit.notifications.add("XKit updated " + XKit.extensions.xkit_updates.updated_list.length + " extension(s). Click here to view them.", "ok", true, function() {
						var m_result = "";
						for (i=0;i<XKit.extensions.xkit_updates.updated_list.length;i++) {
							m_result = m_result + "<br/>" + XKit.extensions.xkit_updates.updated_list[i] + " &middot; " + XKit.extensions.xkit_updates.updated_list_versions[i];
						}
						XKit.window.show("Auto-Update results","<b>XKit updated the following extension(s):</b>" + m_result, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					});

				}

			} else {

				XKit.window.show("Complete!","<b>XKit updated all the extensions with version mismatch.</b><br/>Changes will be active when you refresh the page.","info","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

			}

			$("#xkit-updating-indicator").remove();
			return;
		}

		if (force_mode) {
			$("#xkit-forced-auto-updates-message").html("Downloading " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index] + " (" + (XKit.extensions.xkit_updates.to_update_index + 1) + " of " + XKit.extensions.xkit_updates.to_update.length + ")");
		}


		XKit.extensions.xkit_updates.update(XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index], function(mdata) {

			if (mdata.errors) {
				if (mdata.error_not_found) {
					// Probably removed.
					XKit.console.add("Can not update " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index] + ": not found.");
				}else{
					XKit.extensions.xkit_updates.show_update_failure();
					return;
				}
			}

			XKit.extensions.xkit_updates.updated_list.push(mdata.title);
			XKit.extensions.xkit_updates.updated_list_versions.push(mdata.version);
			XKit.console.add("Updated " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index]);
			XKit.extensions.xkit_updates.to_update_index++;
			XKit.extensions.xkit_updates.update_next(force_mode);

		});

	},

	update_pack: function(extension_id, callback) {

		var m_result = {};

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://xds1.puaga.com/xpacks/" + extension_id + "/app.js?ftch_id=" + XKit.tools.random_string(),
			onerror: function(response) {
				m_result.errors = true;
				m_result.error_not_found = true;
				m_result.error = "Pack can't be found: It might've been removed from XCloud. Please try again later or contact the developer.";
				callback(m_result);
			},
			onload: function(response) {
				// We are done!
				try {
					var mdata = JSON.parse(response.responseText);

					if (mdata.malicious || mdata.malicious == "true") {

						XKit.installed.remove(mdata.id);
						XKit.notifications.add("<b>Removed malicious extension " + mdata.title + "</b>. Please click here for more information.","warning",true, function() {

								XKit.window.show("Malicious extension removed.", "One of the extensions you were using with the title \"" + mdata.title + "\" was found to be malicious, so XKit removed it from your computer. Please refresh this page for changes to take effect.<br/><br/><b>It is highly recommended</b> that you change your Tumblr password. Please be more careful in the future when selecting which Packs to install and which developers to trust.","warning","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

							});
						return;

					}

					GM_xmlhttpRequest({
						method: "GET",
						url: "http://xds1.puaga.com/xpacks/" + extension_id + "/icon.js?ftch_id=" + XKit.tools.random_string(),
						onerror: function(response) {
							m_result.errors = true;
							m_result.error_not_found = true;
							m_result.error = "Pack can't be found: It might've been removed from XCloud. Please try again later or contact the developer.";
							callback(m_result);
						},
						onload: function(response) {
							// We are done!
							try {

								var m_object = {};
								m_object.script = atob(mdata.script);
								m_object.id = mdata.id;
								m_object.support_blog = mdata.support_blog;
								m_object.icon = "data:image/png;base64," + response.responseText;

								if (typeof mdata.css !== "undefined") {
									m_object.css = atob(mdata.css);
								} else {
									m_object.css = "";
								}

								if (typeof mdata.title !== "undefined") {
									m_object.title = mdata.title;
								} else {
									m_object.title = mdata.id;
								}

								if (typeof mdata.description !== "undefined") {
									m_object.description = mdata.description;
								} else {
									m_object.description = "";
								}

								if (typeof mdata.owner !== "undefined") {
									m_object.developer = mdata.owner;
								} else {
									m_object.developer = "";
								}

								if (typeof mdata.version !== "undefined") {
									m_object.version = mdata.version;
								} else {
									m_object.version = "";
								}

								if (typeof mdata.frame !== "undefined") {
									if (mdata.frame === "true" || mdata.frame === " true") {
										m_object.frame = true;
									} else {
										m_object.frame = false;
									}
								} else {
									m_object.frame = false;
								}

								if (typeof mdata.beta !== "undefined") {
									if (mdata.beta === "true" || mdata.beta === " true") {
										m_object.beta = true;
									} else {
										m_object.beta = false;
									}
								} else {
									m_object.beta = false;
								}

								if (typeof mdata.slow !== "undefined") {
									if (mdata.slow === "true" || mdata.slow === " true") {
										m_object.slow = true;
									} else {
										m_object.slow = false;
									}
								} else {
									m_object.slow = false;
								}

								if (typeof mdata.details !== "undefined") {
									m_object.details = mdata.details;
								} else {
									m_object.details = "";
								}

								m_object.pack = true;

								v_result = XKit.tools.set_setting("extension_" + mdata.id, JSON.stringify(m_object));

								m_result.errors = false;
								m_result.error = "";
								callback(m_result);

							} catch(e) {
								m_result.errors = true;
								m_result.error_not_found = true;
								m_result.error = "Pack can't be installed: " + e.message;
								callback(m_result);
							}
						}
					});

				} catch(e) {
					m_result.errors = true;
					m_result.error_not_found = true;
					m_result.error = "Pack can't be installed: " + e.message;
					callback(m_result);
				}
			}
		});

	},

	update: function(extension_id, callback) {

		var m_result = {};


		XKit.install(extension_id, function(mdata) {

			if (mdata.errors) {
				if (mdata.storage_error) {
					m_result.errors = true;
					m_result.error = "Can't store data on browser";
					callback(m_result);
					return;
				}
				if (mdata.server_down) {
					m_result.errors = true;
					m_result.error = "Can't reach servers";
					callback(m_result);
				} else {
					if (mdata.file === "not_found") {
						m_result.errors = true;
						m_result.error_not_found = true;
						m_result.error = "Extension can't be found: It might've been removed from the extension gallery.";
						callback(m_result);
					} else {
						m_result.errors = true;
						m_result.error = "Unknown error. Code: #UPDATE-1026";
						callback(m_result);
					}
				}
				return;
			}

			try {
				// Try evaling the script.
				// If it's working, then move to the next one.
				m_result.errors = false;
				m_result.error = "";
				m_result.title = mdata.title;
				m_result.version = mdata.version;
				callback(m_result);
			} catch(e) {
				m_result.errors = true;
				m_result.error = "UP-ER:" + e.message;
				callback(m_result);
			}

		});

	},

	destroy: function() {
		this.running = false;
	}

});
