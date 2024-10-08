//* TITLE XKit Main **//
//* VERSION 2.1.2 **//
//* DESCRIPTION Boots XKit up **//
//* DEVELOPER New-XKit **//
(function() {
	if (typeof XKit.extensions.xkit_main !== "undefined") { return; }
	XKit.extensions.xkit_main = new Object({

		running: false,
		enabled_extensions: ["xkit_main"],
		disabled_extensions: [],

		run: async function() {

			XKit.page.react = Boolean($("link[href*='/pop/']").length);

			const excludedPage = location.href.includes("://www.tumblr.com/login") || location.href.includes("://www.tumblr.com/settings");
			if (excludedPage && !XKit.page.react) {
				console.log("Refusing to run XKit, login or settings page!");
				return;
			}

			if (!document.doctype || document.doctype.name !== "html") {
				console.log("Refusing to run XKit, not an HTML document!");
				return;
			}

			if (XKit.extensions.xkit_main.running === true) {
				return;
			}

			if (XKit.page.react) {
				$("body").addClass('xkit--react');

				const isReactLoaded = () => $('[data-rh]').length === 0;
				const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

				while (!isReactLoaded()) {
					await sleep(100);
				}
			}

			this.running = true;

			console.log("Welcome from XKit Main " + XKit.installed.version('xkit_main'));

			for (let x of XKit.installed.list()) {
				var extension = XKit.installed.get(x);

				if (extension.id === "xkit_main") {
					continue;
				}

				if (extension.id === "xkit_patches") {
					if (XKit.flags.do_not_load_xkit_patches) {
						continue;
					} else if (XKit.frame_mode) {
						extension.frame = true;
					}
				}

				try {
					new Function(extension.script + "\n//# sourceURL=xkit/" + extension.id + ".js")();

					if (typeof XKit.extensions[extension.id].preferences !== "undefined") {
						this.load_extension_preferences(extension.id);
					}

					if (XKit.installed.enabled(extension.id)) {
						let promise;

						if (XKit.frame_mode) {
							if (extension.frame) {
								promise = XKit.extensions[extension.id].run();
							} else if (typeof XKit.extensions[extension.id].frame_run !== "undefined") {
								promise = XKit.extensions[extension.id].frame_run();
							} else {
								this.disabled_extensions.push(extension.id + " (in frame)");
								continue;
							}
						} else if (!extension.frame) {
							promise = XKit.extensions[extension.id].run();
						} else {
							this.disabled_extensions.push(extension.id + " (not in frame)");
							continue;
						}

						if (promise instanceof Promise) {
							promise.catch(e => {
								console.error(
									`[XKit Main] Could not run ${extension.id} (async)\n`,
									e
								);
							});
						}
					} else {
						this.disabled_extensions.push(extension.id);
						continue;
					}
				} catch (e) {
					var fatal = false;

					console.error("[XKit Main] Could not run " + extension.id + ": " + e.message);
					this.disabled_extensions.push(extension.id + " (error)");

					switch (extension.id) {
						case "xkit_patches":
						case "xkit_preferences":
						case "xkit_updates":
							// defined in xkit.js
							/* globals show_error_reset */
							show_error_reset("Can't run " + extension.id + ": " + e.message);
							fatal = true;
					}

					if (fatal) {
						break;
					} else {
						continue;
					}
				}
				this.enabled_extensions.push(extension.id);
			}

			XKit.post_listener.check();
			console.log("Enabled extensions: " + this.enabled_extensions.join(", "));
			console.log("Disabled extensions: " + this.disabled_extensions.join(", "));
		},

		load_extension_preferences: function(extension_id) {

			for (var pref in XKit.extensions[extension_id].preferences) {

				if (XKit.extensions[extension_id].preferences[pref].type !== "separator") {
					XKit.extensions[extension_id].preferences[pref].value = XKit.storage.get(extension_id, "extension__setting__" + pref, XKit.extensions[extension_id].preferences[pref].default);
				}

				switch (XKit.extensions[extension_id].preferences[pref].type) {
					case "text":
						break;
					case "blog":
						XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].value.substring(1, XKit.extensions[extension_id].preferences[pref].value.length - 1);
						break;
					case undefined:
					case "checkbox":
						if (typeof XKit.extensions[extension_id].preferences[pref].value !== "boolean") {
							XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].value === "true";
						}
				}

			}

		},

		destroy: function() {
			this.running = false;
		}

	});
}());
