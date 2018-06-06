//* TITLE XKit Main **//
//* VERSION 1.3.4 **//
//* DESCRIPTION Boots XKit up **//
//* DEVELOPER STUDIOXENIX **//
(function() {
	if (typeof XKit.extensions.xkit_main !== "undefined") { return; }
	XKit.extensions.xkit_main = new Object({

		running: false,
		enabled_extensions: "",
		disabled_extensions: "",
		to_run: "",
		to_run_count: 0,

		run: function() {

			if (typeof document.location.href !== "undefined") {

				if (document.location.href.indexOf("www.tumblr.com/login") !== -1 || document.location.href.indexOf("www.tumblr.com/settings") !== -1) {
					console.log("Refusing to run XKit, login or settings page!");
					return;
				}

			}

			if (XKit.extensions.xkit_main.running === true) {
				return;
			}
			this.running = true;

			XKit.console.add("Welcome from XKit Main " + XKit.installed.version('xkit_main'));

			// Run XKit Patches first.
			if (XKit.flags.do_not_load_xkit_patches !== true) {

				var m_result = XKit.extensions.xkit_main.run_extension("xkit_patches", true, true);
				if (m_result === false) {
					XKit.console.add("Can not run xkit_patches! (version " + XKit.installed.version('xkit_patches') + ")");
				} else {
					XKit.console.add("Running xkit_patches (version " + XKit.installed.version('xkit_patches') + ")");
				}

			} else {

				XKit.console.add("Skipping xkit_patches (flag on)");

			}

			// Get currently running extensions.
			XKit.extensions.xkit_main.to_run = XKit.installed.list();

			if (XKit.extensions.xkit_main.should_slow_down() === true) {
				XKit.console.add("XKit Main: Slow-boot mode");
				$(document).ready(function() {
					setTimeout(function() { XKit.extensions.xkit_main.run_next_extension(); }, 300);
				});
			} else {
				XKit.console.add("XKit Main: Fast-boot mode");
				setTimeout(function() { XKit.extensions.xkit_main.run_next_extension(); }, 1);
			}

		},

		should_slow_down: function() {

			if (document.location.href.indexOf(':	//www.tumblr.com/new/') !== -1) { return true; }

			if (document.location.href.substring(0, 27) === ":	//www.tumblr.com/blog/") {
				if (document.location.href.indexOf('/new/') !== -1) {
					return true;
				}
			}

			return false;

		},

		run_next_extension: function() {
			XKit.extensions.xkit_main.to_run_count++;
			if (XKit.extensions.xkit_main.to_run_count < XKit.extensions.xkit_main.to_run.length) {
				XKit.extensions.xkit_main.run_extension(XKit.extensions.xkit_main.to_run[XKit.extensions.xkit_main.to_run_count]);
			} else {
				XKit.console.add("Enabled extensions: " + XKit.extensions.xkit_main.enabled_extensions);
				XKit.console.add("Disabled extensions: " + XKit.extensions.xkit_main.disabled_extensions);
				XKit.post_listener.check();
				setTimeout(function() {
					// defined in xkit.js
					/* globals xkit_global_start */
					var diff = new Date().getTime() - xkit_global_start;
					XKit.console.add("Booted XKit up in " + diff + " milliseconds.");
				}, 1);
			}
		},

		run_extension: function(extension_id, force, dont_run_next) {

			// We don't want an infinite loop now do we?
			if (extension_id === "xkit_main") { XKit.extensions.xkit_main.run_next_extension(); return; }

			// Just in case..
			if (extension_id === "xkit_installer" && force !== true) { XKit.extensions.xkit_main.run_next_extension(); return; }

			// We'll be running patches first.
			if (extension_id === "xkit_patches" && force !== true) { XKit.extensions.xkit_main.run_next_extension(); return; }

			var xkit_main = XKit.installed.get(extension_id);

			// Check if in Frame Mode.
			if (XKit.frame_mode === true && extension_id !== "xkit_patches") {
				// This is ugly: I don't want to eval script.
				eval(xkit_main.script + "\n//# sourceURL=xkit/" + extension_id + ".js");
				var frame_script = "";
				try {
					frame_script = XKit.extensions[extension_id].frame_run;
				} catch (e) {
					XKit.console.add("No frame_run on " + extension_id);
				}
				if (frame_script !== "" && typeof frame_script !== "undefined") {
					// This is a hybrid extension!
					// Run it!
					if (XKit.installed.enabled(extension_id) === true) {
						try {
							if (typeof XKit.extensions[extension_id].preferences !== "undefined") {
								XKit.extensions.xkit_main.load_extension_preferences(extension_id);
							}
							XKit.extensions[extension_id].frame_run();
						} catch (e) {
							XKit.console.add("Can not run " + extension_id + ": " + e.message);
							XKit.extensions.xkit_main.run_next_extension(); return;
						}
					}
					if (!dont_run_next) {
						XKit.extensions.xkit_main.run_next_extension();
					}
					return;
				}
				if (xkit_main.frame !== true) {
					// not a frame extension, quit.
					if (XKit.extensions.xkit_main.disabled_extensions === "") {
						XKit.extensions.xkit_main.disabled_extensions = extension_id + "(in frame)";
					} else {
						XKit.extensions.xkit_main.disabled_extensions = XKit.extensions.xkit_main.disabled_extensions + ", " + extension_id + "(in frame)";
					}
					if (!dont_run_next) {
						XKit.extensions.xkit_main.run_next_extension();
					}
					return;
				}
			} else {
				if (xkit_main.frame === true) {
					// is a frame extension, quit.
					try {
						eval(xkit_main.script + "\n//# sourceURL=xkit/" + extension_id + ".js");
					} catch (e) {
						XKit.console.add("Can't eval " + extension_id);
					}
					try {
						if (typeof XKit.extensions[extension_id].preferences !== "undefined") {
							XKit.extensions.xkit_main.load_extension_preferences(extension_id);
						}
					} catch (e) {
						XKit.console.add("Failed to load preferences for " + extension_id + ": " + e.message);
					}
					if (XKit.extensions.xkit_main.disabled_extensions === "") {
						XKit.extensions.xkit_main.disabled_extensions = extension_id + "(not in frame)";
					} else {
						XKit.extensions.xkit_main.disabled_extensions = XKit.extensions.xkit_main.disabled_extensions + ", " + extension_id + "(not in frame)";
					}
					if (!dont_run_next) {
						XKit.extensions.xkit_main.run_next_extension();
					}
					return;
				}
			}

			try {
				eval(xkit_main.script + "\n//# sourceURL=xkit/" + extension_id + ".js");
				if (XKit.installed.enabled(extension_id) === true) {
					if (XKit.extensions.xkit_main.enabled_extensions === "") {
						XKit.extensions.xkit_main.enabled_extensions = extension_id;
					} else {
						XKit.extensions.xkit_main.enabled_extensions = XKit.extensions.xkit_main.enabled_extensions + ", " + extension_id;
					}
					try {
						if (typeof XKit.extensions[extension_id].preferences !== "undefined") {

							XKit.extensions.xkit_main.load_extension_preferences(extension_id);

						}
						XKit.extensions[extension_id].run();
					} catch (e) {
						XKit.console.add("Can not run " + extension_id + ": " + e.message);
						XKit.extensions.xkit_main.run_next_extension(); return;
					}
					if (!dont_run_next) {
						XKit.extensions.xkit_main.run_next_extension();
					}
					return;
				} else {
					if (XKit.extensions.xkit_main.disabled_extensions === "") {
						XKit.extensions.xkit_main.disabled_extensions = extension_id;
					} else {
						XKit.extensions.xkit_main.disabled_extensions = XKit.extensions.xkit_main.disabled_extensions + ", " + extension_id;
					}
					if (!dont_run_next) {
						XKit.extensions.xkit_main.run_next_extension();
					}
					return;
				}
			} catch (e) {
				if (XKit.extensions.xkit_main.disabled_extensions === "") {
					XKit.extensions.xkit_main.disabled_extensions = extension_id + "(error)";
				} else {
					XKit.extensions.xkit_main.disabled_extensions = XKit.extensions.xkit_main.disabled_extensions + ", " + extension_id + "(error)";
				}
				// defined in xkit.js
				/* globals show_error_reset */
				show_error_reset("Can't run " + extension_id + ":" + e.message);
				if (!dont_run_next) {
					XKit.extensions.xkit_main.run_next_extension();
				}
				return;
			}

		},

		load_extension_preferences: function(extension_id) {

			for (var pref in XKit.extensions[extension_id].preferences) {

				if (typeof XKit.extensions[extension_id].preferences[pref].type === "undefined" ||  XKit.extensions[extension_id].preferences[pref].type === "" || XKit.extensions[extension_id].preferences[pref].type === "checkbox") {
					XKit.extensions[extension_id].preferences[pref].value = XKit.storage.get(extension_id, "extension__setting__" + pref, "");
					if ( XKit.extensions[extension_id].preferences[pref].value === "") {
						if (typeof XKit.extensions[extension_id].preferences[pref].default !== "undefined") {
							XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].default;
						} else {
							XKit.extensions[extension_id].preferences[pref].value = false;
						}
					} else {
						if (XKit.extensions[extension_id].preferences[pref].value === "true") {
							XKit.extensions[extension_id].preferences[pref].value = true;
						} else {
							XKit.extensions[extension_id].preferences[pref].value = false;
						}
					}
				}

				if (XKit.extensions[extension_id].preferences[pref].type === "text") {
					XKit.extensions[extension_id].preferences[pref].value = XKit.storage.get(extension_id, "extension__setting__" + pref, "");
					if (typeof XKit.extensions[extension_id].preferences[pref].value === "undefined" || XKit.extensions[extension_id].preferences[pref].value === "") {
						if (typeof XKit.extensions[extension_id].preferences[pref].default !== "undefined") {
							XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].default;
						}
					}
				}

				if (XKit.extensions[extension_id].preferences[pref].type === "combo") {
					XKit.extensions[extension_id].preferences[pref].value = XKit.storage.get(extension_id, "extension__setting__" + pref, "");
					if (typeof XKit.extensions[extension_id].preferences[pref].value === "undefined" || XKit.extensions[extension_id].preferences[pref].value === "") {
						if (typeof XKit.extensions[extension_id].preferences[pref].default !== "undefined") {
							XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].default;
						}
					}
				}

				if (XKit.extensions[extension_id].preferences[pref].type === "blog") {
					XKit.extensions[extension_id].preferences[pref].value = XKit.storage.get(extension_id, "extension__setting__" + pref, "");
					if (typeof XKit.extensions[extension_id].preferences[pref].value === "undefined" || XKit.extensions[extension_id].preferences[pref].value === "") {
						if (typeof XKit.extensions[extension_id].preferences[pref].default !== "undefined") {
							XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].default;
						}
					} else {
						XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].value.substring(1, XKit.extensions[extension_id].preferences[pref].value.length - 1);
					}
				}


			}

		},

		destroy: function() {
			this.running = false;
		}

	});
}());
