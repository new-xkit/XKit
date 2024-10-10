var available_extensions = [];
var xkit_global_start = Date.now();  // log start timestamp

(function() {

	if (typeof XKit !== "undefined") { return; }

	XKit = {
		version: framework_version,
		api_key: "kZSI0VnPBJom8cpIeTFw4huEh9gGbq4KfWKY7z5QECutAAki6D",
		page: {
			standard:
				window.window === window.top &&
				document.location.href.indexOf("://www.tumblr.com/dashboard/iframe?") === -1,
			form_frame:
				document.location.href.indexOf("://www.tumblr.com/neue_web/iframe/") !== -1,
			ask_frame:
				document.location.href.indexOf("://www.tumblr.com/ask_form/") !== -1,
			blog_frame:
				document.location.href.indexOf("://www.tumblr.com/send") !== -1 ||
				document.location.href.indexOf("://www.tumblr.com/dashboard/iframe?") !== -1 ||
				document.location.href.indexOf("://secure.assets.tumblr.com/assets/html/iframe/") !== -1,
			xkit:
				document.location.href.indexOf('://www.tumblr.com/xkit_') !== -1
		},
		init: function() {
			if (!XKit.page.xkit) {
				XKit.init_flags();
			}
			$(document).ready(XKit.init_extension);
		},
		init_extension: function() {
			console.log("init_extension: " + JSON.stringify(XKit.page));
			if (XKit.page.xkit) {
				xkit_init_special();
				return;
			}

			if (XKit.page.standard || XKit.page.form_frame) {
				XKit.init_normal();
				return;
			}

			if (XKit.page.ask_frame || XKit.page.blog_frame) {
				XKit.init_frame();
				return;
			}

		},
		init_normal: function() {

			try {

				// Check for Bridge errors.
				var bridge_status = getBridgeError();
				if (bridge_status.errors === true) {
					// Bridge encountered an error!
					XKit.window.show("XKit couldn't start.", "<b>Generated Error message:</b><br/><p>XKit Bridge Error<br/>" + bridge_status.error.message + "</p>Please reload the page to try again or get in contact with New XKit Support.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"https://new-xkit-support.tumblr.com\" class=\"xkit-button\">Support</a>");
					return;
				}

				var conflicts_check_results = XKit.conflicts.check();
				if (conflicts_check_results.count > 0) {
					if (XKit.tools.get_setting("xkit_disable_conflicts", "false") !== "true") {
						XKit.conflicts.show(conflicts_check_results);
					}
					if (conflicts_check_results.fatal === true) {
						return;
					}
				}

				// Load dashboard extensions.
				XKit.notifications.init();
				var m_browser = XKit.browser();

				if (m_browser.spoofed === true) {
					// Nope, I won't be running here.
					XKit.window.show("Your browser is pretending to be something it is not.", "Spoofing your browser name/version can cause problems not just with XKit but other websites and extensions too. Please turn off any User Agent modifier you have installed. XKit will stop running now.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"https://new-xkit-support.tumblr.com\" class=\"xkit-button\">Support</a>");
					return;
				}

				xkit_check_storage();

				if (XKit.tools.get_setting("xkit_installation_complete", "") !== "true") {
					// We need to install XKit!
					console.log("Installation complete is not true, it is = " + XKit.tools.get_setting("xkit_installation_complete", ""));
					xkit_install();
					return;
				}

				// Okay lets boot our extensions now. This is actually done
				// by xkit_main.js so let's just call it.

				// First lets check if it actually exists.
				if (XKit.installed.check("xkit_main") === false) {
					console.log("xkit_main not found! Re-installing....");
					xkit_install();
					return;
				}

				// Before we run main--if patches is a broken version,
				// we need to force an update.
				if (XKit.installed.version('xkit_patches') === '7.2.8') {
					XKit.special.force_update();
				}

				// It exists! Great.
				var xkit_main = XKit.installed.get("xkit_main");
				if (!xkit_main.errors && xkit_main.script) {
					console.log("Trying to run xkit_main.");
					try {
						new Function(xkit_main.script + "\n//# sourceURL=xkit/xkit_main.js")();
						XKit.extensions.xkit_main.run();
					} catch (e) {
						show_error_reset("Can't run xkit_main: " + e.message);
					}
				} else {
					if (xkit_main.error == "not_installed") {
						// Still not installed?
						console.log("xkit_main not found! Re-installing....");
						xkit_install();
						return;
					}
					if (xkit_main.error == "parse_error") {
						// Corrupt storage? Recomment reset.
						console.error("xkit_main is corrupt!");
						show_error_reset("Package xkit_main is corrupted!");
						return;
					}
				}

			} catch (e) {
				console.error(e);
				show_error_update("xkit_init(): " + e.message);
			}
		},
		init_frame: function() {

			// Load frame extensions.
			// First lets check if it actually exists.
			if (XKit.installed.check("xkit_main") === false) {
				console.log("xkit_main not found! Quitting.");
				return;
			}

			// It exists! Great.
			var xkit_main = XKit.installed.get("xkit_main");
			if (!xkit_main.errors && xkit_main.script) {
				console.log("Trying to run xkit_main.");
				try {
					new Function(xkit_main.script + "\n//# sourceURL=xkit/xkit_main.js")();
					XKit.frame_mode = true;
					XKit.extensions.xkit_main.run();
				} catch (e) {
					console.error("Can't run xkit_main: " + e.message);
				}
			}

		},
		init_flags: function() {
			for (var flag in XKit.flags) {
				var m_value = XKit.tools.get_setting("xkit__flag__" + flag, "");
				if (m_value === "true") { m_value = true; } else { m_value = false; }
				XKit.set_flag(flag, m_value);
			}
		},
		flags: {
			do_not_limit_extension_storage: false,
			disable_notifications: false,
			do_not_load_xkit_patches: false,
			do_not_show_news: false,
			allow_removal_of_internal_extensions: false
		},
		read_flag: function(flag_id) {
			if (typeof XKit.flags[flag_id] === "undefined") {
				return false;
			} else {
				return XKit.flags[flag_id];
			}
		},
		set_flag: function(flag_id, value) {
			if (typeof XKit.flags[flag_id] === "undefined") {
				return false;
			}
			if (value === "true") { value = true; }
			if (value === "false") { value = false; }
			if (value === "" || typeof value === "undefined") { return; }
			XKit.flags[flag_id] = value;
			XKit.tools.set_setting("xkit__flag__" + flag_id, value);
		},
		extensions: {},
		download: {
			// TODO: implement as module, lose most of this code
			github_fetch: function(path, callback) {
				fetch(browser.runtime.getURL('/Extensions/dist/' + path))
					.then(response => response.json())
					.then(callback);
			},
			extension: function(extension_id, callback) {
				XKit.download.github_fetch(extension_id + '.json', callback);
			},
			page: function(page, callback) {
				if (page === 'list.php') {
					XKit.download.github_fetch('page/list.json', callback);
					return;
				}
				if (page === 'gallery.php') {
					XKit.download.github_fetch('page/gallery.json', callback);
					return;
				}
				if (page === 'themes/index.php') {
					XKit.download.github_fetch('page/themes.json', callback);
					return;
				}
				if (page === 'paperboy/index.php') {
					XKit.download.github_fetch('page/paperboy.json', callback);
					return;
				}
			}
		},
		install: function(extension_id, callback) {
			// Installs the extension.
			XKit.download.extension(extension_id, function(mdata) {
				console.log("download.extension of '" + extension_id + "' was successful. Calling callback.");
				install_extension(mdata, callback);
			});
		},
		installed: {
			add: function(extension_id) {
				// Add extension to the installed list.
				if (XKit.installed.check(extension_id) === true) {
					// Already added, stop.
					return;
				}
				var m_string = XKit.tools.get_setting("xkit_installed_extensions", "");
				var installed_extensions;
				try {
					installed_extensions = JSON.parse(m_string);
				} catch (e) {
					installed_extensions = {extensions: []};
				}
				installed_extensions.extensions.push(extension_id);
				m_string = JSON.stringify(installed_extensions);
				XKit.tools.set_setting("xkit_installed_extensions", m_string);
			},
			remove: function(extension_id) {
				// Remove extension from installed list.
				var current_extensions = XKit.installed.list();
				for (var i = 0; i < current_extensions.length; i++) {
					if (current_extensions[i] == extension_id) {
						current_extensions.splice(i, 1);
					}
				}
				var installed_extensions = {extensions: current_extensions};
				var m_string = JSON.stringify(installed_extensions);
				XKit.tools.set_setting("xkit_installed_extensions", m_string);
			},
			list: function() {
				// Get an array containing all installed extensions.
				var m_string = XKit.tools.get_setting("xkit_installed_extensions", "");
				var installed_extensions;
				try {
					installed_extensions = JSON.parse(m_string);
				} catch (e) {
					installed_extensions = {extensions: []};
				}
				return installed_extensions.extensions;
			},
			check: function(extension_id) {
				// Check if an extension is installed.
				var current_extensions = XKit.installed.list();
				for (var i = 0; i < current_extensions.length; i++) {
					if (current_extensions[i] == extension_id) {
						return true;
					}
				}
				return false;
			},
			is_running: function(extension) {
				return XKit.installed.check(extension) &&
					typeof(XKit.extensions[extension]) !== "undefined" &&
					XKit.extensions[extension].running;
			},
			when_running: function(extension, onRunning, onFailure) {
				if (!XKit.installed.check(extension)) {
					if (onFailure) {
						onFailure();
					}
					return;
				}
				// Wait up to 8 seconds for the extension to begin running
				var tries = 20;
				var timeout = 400;
				function check() {
					if (tries < 0) {
						if (onFailure) {
							onFailure();
						}
						return;
					}
					if (!XKit.installed.is_running(extension)) {
						tries--;
						setTimeout(check, timeout);
						return;
					}
					// The extension exists and has been installed
					onRunning(XKit.extensions[extension]);
				}
				setTimeout(check, 0);
			},
			get: function(extension_id) {
				// Returns the object.
				var app_data = XKit.tools.get_setting("extension_" + extension_id, "");
				if (app_data === "") {
					return {
						errors: true,
						error: "not_installed"
					};
				}
				try {
					var m_object = JSON.parse(app_data);
					m_object.errors = false;
					return m_object;
				} catch (e) {
					return {
						errors: true,
						error: "parse_error"
					};
				}
			},
			update: function(extension_id, new_object) {
				XKit.tools.set_setting("extension_" + extension_id, JSON.stringify(new_object));
				if (XKit.installed.check(extension_id) === false) {
					XKit.installed.add(extension_id);
				}
			},
			enable: function(extension_id) {
				XKit.tools.set_setting("extension__" + extension_id + "__enabled", "true");
			},
			disable: function(extension_id) {
				XKit.tools.set_setting("extension__" + extension_id + "__enabled", "false");
			},
			enabled: function(extension_id) {
				var m_result = XKit.tools.get_setting("extension__" + extension_id + "__enabled", "true");
				if (m_result !== "false") {
					return true;
				} else {
					return false;
				}
			},
			version: function(extension_id) {
				// Returns extension version if it's installed.
				return XKit.installed.get(extension_id).version || "";
			},
			title: function(extension_id) {
				// Returns extension title if it's installed.
				return XKit.installed.get(extension_id).title || "";
			},
			developer: function(extension_id) {
				// Returns extension developer if it's installed.
				return XKit.installed.get(extension_id).developer || "";
			},
			description: function(extension_id) {
				// Returns extension description if it's installed.
				return XKit.installed.get(extension_id).description || "";
			},
			script: function(extension_id) {
				// Returns extension script if it's installed.
				return XKit.installed.get(extension_id).script || "";
			},
			icon: function(extension_id) {
				// Returns extension icon if it's installed.
				return XKit.installed.get(extension_id).icon || "";
			},
			css: function(extension_id) {
				// Returns extension css if it's installed.
				return XKit.installed.get(extension_id).css || "";
			}
		},
		progress: {
			add: function(id) {
				return "<div id=\"xkit-progress-" + id + "\" class=\"xkit-progress-bar\"><div id=\"xkit-progress-inner-" + id + "\" class=\"xkit-progress-bar-inner\">&nbsp;</div></div>";
			},
			value: function(id, value) {
				$("#xkit-progress-inner-" + id).css("width", value + "%");
			}
		},
		storage: {
			// Extension storage.
			// Each extension is limited to 50 kb storage.
			// Each extension's data is stored as a stringified JSON object.
			max_area_size: 51200,
			unlimited_storage: false,
			size: function(extension_id) {
				return XKit.tools.get_setting("xkit_extension_storage__" + extension_id, "").length;
			},
			quota: function(extension_id) {
				var m_size = XKit.tools.get_setting("xkit_extension_storage__" + extension_id, "").length;
				return XKit.storage.max_area_size - m_size;
			},
			get: function(extension_id, key, default_value) {
				var m_storage = XKit.storage.get_all(extension_id);
				if (typeof m_storage[key] === "undefined") {
					if (typeof default_value !== "undefined") {
						return default_value;
					} else {
						return "";
					}
				} else {
					if (!m_storage[key].value || /^\s*$/.test(m_storage[key].value)) {
						return "";
					}
					if (isNaN(m_storage[key].value) === true && isNaN(parseFloat(m_storage[key].value)) === true) {
						return m_storage[key].value;
					} else {
						return parseFloat(m_storage[key].value);
					}
				}
			},
			set: function(extension_id, key, value) {
				var m_storage = XKit.storage.get_all(extension_id);
				if (typeof m_storage[key] === "undefined") {
					m_storage[key] = {value: value};
				} else {
					m_storage[key].value = value;
				}
				var save_this = true;
				if (JSON.stringify(m_storage).length >= XKit.storage.max_area_size) {
					save_this = false;
				}
				if (XKit.flags.do_not_limit_extension_storage === true) {
					save_this = true;
				}
				if (!save_this) {
					XKit.storage.show_error(extension_id, JSON.stringify(m_storage).length);
					return false;
				} else {
					var mresult = XKit.tools.set_setting("xkit_extension_storage__" + extension_id, JSON.stringify(m_storage));
					if (mresult.errors === false) {
						return true;
					} else {
						return false;
					}
				}
			},
			remove: function(extension_id, key) {
				var m_storage = XKit.storage.get_all(extension_id);
				if (!m_storage.hasOwnProperty(key)) return true;
				delete m_storage[key];
				// We're going to skip the storage limit checks, on the basis that:
				//   - the previous serialisation should have fit within limits; and
				//   - deletion shouldn't increase the size of our new serialisation.
				var mresult = XKit.tools.set_setting("xkit_extension_storage__" + extension_id, JSON.stringify(m_storage));
				return !mresult.errors;
			},
			get_all: function(extension_id) {
				var m_data = XKit.tools.get_setting("xkit_extension_storage__" + extension_id, "");
				if (m_data !== "") {
					try {
						return JSON.parse(m_data);
					} catch (e) {
					}
				}
				return {};
			},
			clear: function(extension_id) {
				XKit.tools.set_setting("xkit_extension_storage__" + extension_id, "");
			},
			show_error: function(extension_id, size) {
				var m_extension = XKit.installed.get(extension_id);
				var m_max_size = Math.round(XKit.storage.max_area_size / 1024);
				var m_my_size = Math.round(size / 1024);
				var m_html = "<b>The extension " + m_extension.title + " reached it's storage quota.</b><br/><br/>Every extension can store up to " + m_max_size + " kilobytes on your computer, but this extension is storing or trying to store ~" + m_my_size + " kilobytes.<br/><br/>You can clean the storage area of this extension, which might delete it's settings (recommended) or disable this extension.";
				XKit.window.show("Extension error", m_html, "error", "<div class=\"xkit-button default\" id=\"xkit-delete-extension-storage-area\">Reset this extensions' storage and restart it</div><div class=\"xkit-button\" id=\"xkit-disable-extension-for-storage-area\">Disable this extension</div>");

				$("#xkit-disable-extension-for-storage-area").click(function() {
					XKit.extensions[extension_id].destroy();
					XKit.installed.disable(extension_id);
					XKit.window.close();
				});

				$("#xkit-delete-extension-storage-area").click(function() {
					XKit.storage.clear(extension_id);
					XKit.extensions[extension_id].destroy();
					setTimeout(function() {
						XKit.extensions[extension_id].run();
					}, 1000);
					XKit.window.close();
				});

			}
		},
		/**
		 * @return {Object} An overview of the browser's information:
		 *	name: "Google Chrome" | "Mozilla Firefox" | "Apple Safari" - The browser's human-readable name
		 *	spoofed: boolean - Whether XKit suspects the user of spoofing an IE user agent.
		 *	chrome: boolean - Whether the browser is Chrome
		 *	firefox: boolean - Whether the browser is Firefox
		 *	safari: boolean - Whether the browser is Safari
		 *	opera: boolean - Whether the browser is Opera (Always false as implemented currently)
		 *	version: number - The numerical representation of the browser's version or 0 if unknown
		 *	mobile: boolean - Whether Tumblr is serving the mobile version of the site
		 */
		browser: function() {

			var to_return = {};

			to_return.name = "UNKNOWN";
			to_return.spoofed = false;
			to_return.chrome = false;
			to_return.firefox = false;
			to_return.safari = false;
			to_return.opera = false;
			to_return.version = 0;
			to_return.mobile = false;

			// First, let's check if it's chrome.
			if (window.chrome) {
				to_return.chrome = true;
			} else {
				// it can still be chrome?
				var is_chrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
				to_return.chrome = is_chrome;
			}

			function get_ua_version(user_agent) {
				var index = navigator.userAgent.toLowerCase().indexOf(user_agent);
				var real_version = parseFloat(navigator.userAgent.toLowerCase().substring(index + (user_agent.length)));
				return real_version;
			}

			if (to_return.chrome === true) {
				// Get version.
				to_return.name = "Google Chrome";
				to_return.version = get_ua_version("chrome/");
			}

			// Then, let's check if it's firefox.
			if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
				to_return.name = "Mozilla Firefox";
				to_return.firefox = true;
				to_return.version = get_ua_version("firefox/");
			}

			// Blahblah Safari blah.
			if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
				to_return.name = "Apple Safari";
				to_return.safari = true;
				to_return.firefox = false;
				to_return.version = get_ua_version("safari/");
			}

			to_return.ug = navigator.userAgent.toLowerCase();

			// Check if there is spoofing!
			// A lot of people now switch to IE.
			if (navigator.userAgent.indexOf('MSIE') > -1) {
				to_return.spoofed = true;
			}

			// Check if you're viewing the mobile version
			if ($('.is_mobile').length > 0) {
				to_return.mobile = true;
			}

			return to_return;

		},
		iframe: {

			/**
			 * @return {String} Id of blog which the iframe refers to (usually
			 *                  the blog in which the iframe is embedded)
			 */
			get_tumblelog: function() {
				var new_channel_id = document.location.href.match(/[&?]tumblelogName=([\w-]+)/);
				var archive_channel_id = document.location.href.match(/[&?]name=([\w-]+)/);
				var old_channel_id = $("#tumblelog_name").attr('data-tumblelog-name');
				return (new_channel_id && new_channel_id[1]) || (archive_channel_id && archive_channel_id[1]) || old_channel_id;
			},

			/**
			 * @return {String} Post to which this iframe refers
			 */
			single_post_id: function() {
				var all_post_ids = document.location.href.match(/[&?](singlePostId|pid|postId)=(\d+)/);
				return all_post_ids[2];
			},

			/**
			 * @return {String} Form key of the iframe (the data to use in a
			 *                  reblog or other API request)
			 */
			form_key: function() {
				var new_form_key = $("meta[name=tumblr-form-key]").attr("content");
				var old_form_key = $(".btn.reblog").attr('data-form-key');
				return new_form_key || old_form_key;
			},

			/**
			 * Hide the text of a button in the iframe.
			 * @param {JQuery} button
			 */
			hide_button: function(button) {
				button.addClass("no_label");
				button.addClass("no-text").contents()
					.filter(function() {
						return this.nodeType === 3;
					}).wrap('<span class="hidden">');

				button.children(".button-label").hide();
			},

			/**
			 * @param  {String} name: the css class name of the button
			 * @return {JQuery} the element for that css class name
			 */
			tx_button_selector: function(name) {
				return $(`.tx-button.${name}-button, .tx-icon-button.${name}-button`);
			},

			/**
			 * @return {JQuery} The follow button in the iframe
			 */
			follow_button: function() {
				return this.tx_button_selector("follow");
			},

			/**
			 * @return {JQuery} The unfollow button in the iframe
			 */
			unfollow_button: function() {
				return this.tx_button_selector("unfollow");
			},

			/**
			 * @return {JQuery} The delete button in the iframe
			 */
			delete_button: function() {
				return this.tx_button_selector("delete");
			},

			/**
			 * @return {JQuery} The reblog button in the iframe
			 */
			reblog_button: function() {
				return this.tx_button_selector("reblog");
			},

			/**
			 * @return {JQuery} The dashboard button in the iframe
			 */
			dashboard_button: function() {
				return this.tx_button_selector("dashboard");
			},

			/**
			 * Uses tumblr's built-in RPC functionality to resize the in-blog iframe.
			 * The iframe will be resized to the maximum of the current body size or
			 * the iframe-controls-container size.
			 *
			 * This is the same postMessage call that happens when you click on the
			 * profile menu, without the body classes arguments. (Tumblr also allows
			 * for the code to set classes on the iframe element and the body of the page)
			 */
			size_frame_to_fit: function() {
				var button_container = $(".iframe-controls-container")[0] || {};

				var width = Math.max(
					button_container.scrollWidth || -Infinity,
					document.body.scrollWidth);

				var height = Math.max(
					button_container.scrollHeight || -Infinity,
					document.body.scrollHeight);

				var payload = {
					method: "tumblr-unified-controls:IframeControls:size",
					args: [{
						width: width,
						height: height
					}]
				};

				window.top.postMessage(JSON.stringify(payload), "*");
			}
		},
		window: {
			/**
			 * Show an XKit alert window
			 * @param {String} title - Text for alert window's title bar
			 * @param {String} msg - Text for body of window, can be HTML
			 * @param {"error"|"warning"|"question"|"info"} icon - Window's
			 *   icon type, determined by CSS class `icon`.
			 *   See also xkit_patches.css.
			 * @param {String} buttons - The HTML to be used in the button area of the window.
			 *                           Usually divs with class "xkit-button".
			 * @param {boolean} wide - Whether the XKit window should be wide.
			 */
			show: function(title, msg, icon, buttons, wide) {
				if (typeof icon === "undefined") {
					icon = "";
				}

				var additional_classes = "";

				if (wide) {
					additional_classes = "xkit-wide-window";
				}

				if ($("#xkit-window").length > 0) {
					$("#xkit-window").attr('id', "xkit-window-old");
					$("#xkit-window-old").fadeOut('fast', function() {
						$(this).remove();
					});
				}

				var m_html = "<div id=\"xkit-window\" class=\"" + icon + " " + additional_classes + "\" style=\"display: none;\">" +
									"<div class=\"xkit-window-title\">" + title + "</div>" +
									"<div class=\"xkit-window-msg\">" + msg + "</div>";

				if (typeof buttons !== "undefined") {
					m_html = m_html + "<div class=\"xkit-window-buttons\">" + buttons + "</div>";
				}

				if ($("#xkit-window-shadow").length === 0) {
					m_html = m_html + "</div><div id=\"xkit-window-shadow\"></div>";
				}

				$("body").prepend(m_html);

				$("#tiptip_holder").css("z-index", "99000000");

				centerIt($("#xkit-window"));
				$("#xkit-window").fadeIn('fast');

				$("#xkit-close-message").click(function() {
					$("#xkit-window-shadow").fadeOut('fast', function() {
						$(this).remove();
					});
					$("#xkit-window").fadeOut('fast', function() {
						$(this).remove();
					});
				});
			},
			close: function() {
				$("#xkit-window-shadow").fadeOut('fast');
				$("#xkit-window-old").fadeOut('fast');
				$("#tiptip_holder").css("z-index", "99999");
				$("#xkit-window").fadeOut('fast', function() {
					$(this).remove();
					$("#xkit-window-shadow").remove();
					$("#xkit-window-old").remove();
				});
			}
		},
		notifications: {
			count: 0,
			init: function() {
				if (XKit.flags.disable_notifications !== true) {
					$("body").append("<div id=\"xkit-notifications\"></div>");
				}
			},
			show_error: function(id, e) {
				XKit.notifications.add("<b>Can not load " + id + "</b>: " + e.message, "error");
			},
			add: function(message, type, sticky, callback) {
				if ($("#xkit-notifications").length <= 0) {
					setTimeout(function() { XKit.notifications.add(message, type, sticky, callback); }, 500);
					return;
				}

				XKit.notifications.count++;

				var m_class = "";
				if (type === "mail") { m_class = "notification-mail"; }
				if (type === "ok") { m_class = "notification-ok"; }
				if (type === "error") { m_class = "notification-error"; }
				if (type === "warning") { m_class = "notification-warning"; }
				if (type === "pokes") { m_class = "notification-pokes"; }

				if (sticky === true) {
					m_class = m_class + " sticky";
				}

				var m_html = "<div class=\"xkit-notification " + m_class + "\" id=\"xkit_notification_" + XKit.notifications.count + "\">" +
										message +
									"</div>";

				$("#xkit-notifications").append(m_html);

				// console.log(" Notification > " + message);

				var m_notification_id = XKit.notifications.count;
				setTimeout(function() {
					$("#xkit_notification_" + m_notification_id).slideDown('slow');
				}, 100);
				$("#xkit_notification_" + m_notification_id).click(function() {
					if (typeof callback !== undefined) {
						try {
							callback();
						} catch (e) {
							// Meh.
						}
					}
					$("#xkit_notification_" + m_notification_id).slideUp('slow');
				});
				if (sticky !== true) {
					setTimeout(function() {
						$("#xkit_notification_" + m_notification_id).slideUp('slow');
					}, 5000);
				}
			}
		},
		toast: {
			count: 0,

			/**
			 * Simulates a tumblr notification ("toast")
			 * @param {Boolean} created - true if post was not queued/drafted
			 * @param {String} action - post action description (i.e. "Reblogged to ")
			 * @param {String} url - tumblr blog name (for both notification and API)
			 * @param {Integer/String} id - created post id for peepr (optional)
			 * @param {String} crumb - arbitrary class for "crumb" (optional)
			 */
			add: function(created, action, url, id, crumb) {
				var toastno = XKit.toast.count;
				XKit.toast.count++;

				if (created) {
					action = "<strong>" + action;
				} else {
					action += "<strong>";
				}

				var endData = "}";
				if (typeof id !== "undefined") {
					endData = `,"postId": ${id}}`;
				}
				if (typeof crumb === "undefined") {
					crumb = "";
				}

				var toast =
					`<li class="toast blog-sub xtoast-${toastno}" data-subview="toast" data-peepr='{"tumblelog": "${url}"${endData}'>
						<img class="toaster avatar" src="https://api.tumblr.com/v2/blog/${url}/avatar/128">
						<div class="crumb ${crumb}"></div>
						<span class="toast-bread">
							${action}${url}</strong>
						</span>
					</li>`;

				$(".toastr").addClass("show-toast");
				$(".multi-toasts").append(toast);

				var $toast = $(".xtoast-" + toastno);
				setTimeout(function() {
					$toast.addClass("fade-out");
				}, 4000);
				setTimeout(function() {
					$toast.remove();
					if (!$(".toast").length) {
						$(".toastr").removeClass("show-toast");
					}
				}, 5000);
			}
		},
		conflicts: {
			check: function() {
				var m_return = {
					count: 0,
					fatal: false,
					// Checks for modes that might break XKit.
					html: "<ol>"
				};

				if ($("#xkit-control").length > 0) {
					m_return.html = m_return.html + "<li>Old XKit found</li>";
					m_return.fatal = true;
					m_return.count++;
				}

				if ($("#xkit-control-panel-icon").length > 0) {
					m_return.html = m_return.html + "<li>XKit Next found</li>";
					m_return.fatal = true;
					m_return.count++;
				}

				if ($("#xkit_top_button").length > 0) {
					m_return.html =	m_return.html + "<li>XKit 5.x/6.x found</li>";
					m_return.fatal = true;
					m_return.count++;
				}

				if ($("#missinge_button").length > 0) {
					m_return.html =	m_return.html + "<li>Missing E found (removal optional)</li>";
					m_return.count++;
				}

				if ($("archive_btn").length > 0) {
					m_return.html = m_return.html + "<li>Archive Poster found (removal optional)</li>";
					m_return.count++;
				}

				if ($("body").hasClass("dashboard_index") === true) {
					var conflicting_extension = false;

					if ($("#bt_NewPost").length > 0) {
						conflicting_extension = true;
					}

					if (conflicting_extension) {
						m_return.html =	m_return.html + "<li>Unknown extension found (removal optional)</li>";
						m_return.count++;
					}
				}

				if (m_return.fatal === true) {
					XKit.tools.set_setting("xkit_disable_conflicts", "false");
				}

				m_return.html = m_return.html + "</ol>";
				return m_return;
			},
			show: function(m_obj) {
				if (m_obj.fatal === false) {
					if (XKit.tools.get_setting("xkit_disable_conflicts", "false") === "true") {
						return;
					}
				}

				if (m_obj.fatal === false) {
					XKit.window.show("Potential Extension Conflicts Found", "<b>New XKit found the following potential conflicts:</b>" + m_obj.html + "It is highly recommended that you disable or remove the extensions/options listed below. You can click Ignore and Continue, which will prevent XKit from showing this window again, but no support will be provided to you if something goes wrong.", "warning", "<div class=\"xkit-button default\" id=\"xkit-disable-conflict-warning\">Ignore and Continue</div>");
				} else {
					XKit.window.show("Fatal Extension Conflicts Found", "<b>New XKit found the following conflicts:</b>" + m_obj.html + "XKit can not continue loading before you disable other versions of XKit. Please check your browser's documentation on how to disable/remove extensions and remove other versions of XKit.", "warning");
				}

				$("#xkit-disable-conflict-warning").click(function() {

					XKit.tools.set_setting("xkit_disable_conflicts", "true");
					XKit.window.close();

				});
			}
		},
		tools: {
			init_css: function(ext_id) {
				var my_css = XKit.installed.get(ext_id).css;
				if (my_css !== "") {
					XKit.tools.add_css(my_css, ext_id);
				}
			},
			add_css: function(css, ext_id) {
				if ($("#xkit-css-added-by-" + ext_id).length === 0) {
					$("head").append("<style id=\"xkit-css-added-by-" + ext_id + "\">" + css + "</style>");
				} else {
					$("#xkit-css-added-by-" + ext_id).append(css);
				}
			},
			remove_css: function(ext_id) {
				$("#xkit-css-added-by-" + ext_id).remove();
			},
			random_string: function() {
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for (var i = 0; i < 30; i++ ) {
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				return text;
			},
			blog_list_message_listener: function(e) {
				if (e.origin == window.location.protocol + "//" + window.location.host &&
			e.data.hasOwnProperty("xkit_blogs")) {

					XKit.blogs_from_tumblr = e.data.xkit_blogs.map(XKit.tools.escape_html);
					XKit.tools.set_setting('xkit_cached_blogs', XKit.blogs_from_tumblr.join(';'));
				}
			},
			/**
			 * @return {Array<String>} user's blogs' IDs
			 */
			get_blogs: function() {
				var m_blogs = [];

				// Approach 1: Scrape the tumblelog models for ones we control
				// code is above

				if (XKit.blogs_from_tumblr) {
					m_blogs = XKit.blogs_from_tumblr;
					XKit.tools.set_setting('xkit_cached_blogs', m_blogs.join(';'));
					return m_blogs;
				}

				// Approach 2: Scrape from the dynamically-created popover element.

				var blog_menu_items = $("[data-js-channel-list] .popover_menu_item_blog");
				if (blog_menu_items.length) {

					blog_menu_items.each(function() {
						var blog_url = this.id.split("--")[1];
						if (blog_url) {
							m_blogs.push(blog_url);
						}
					});

					if (m_blogs.length) {
						XKit.tools.set_setting('xkit_cached_blogs', m_blogs.join(';'));
						return m_blogs;
					}
				}

				// Approach 3: Use the last good cached data that we saved in settings
				m_blogs = XKit.tools.get_setting("xkit_cached_blogs", "");
				if (m_blogs !== "") {
					return m_blogs.split(";");
				}
			},
			/**
			 * Get the user's currently selected blog.
			 * @return {String} blog id, e.g. new-xkit-extension.
			 */
			get_current_blog: function() {
				var avatar = $("#post_controls_avatar");
				if (avatar.length > 0) {
					var image = avatar.find(".post_avatar_image");
					if (image.length > 0) {
						return image.attr("alt");
					}
				}
				console.warn('XKit.tools.get_current_blog: Warning, fell back to main blog');
				return XKit.tools.get_blogs()[0];
			},
			replace_all: function(txt, replace, with_this) {
				return txt.replace(new RegExp(replace, 'g'), with_this);
			},
			get_setting: function(setting_name, default_value) {
				try {
					return GM_getValue(setting_name, default_value);
				} catch (e) {
					return "";
				}
			},
			set_setting: function(setting_name, new_value) {
				try {
					GM_setValue(setting_name, new_value);
					return {errors: false};
				} catch (e) {
					console.error("Can not save " + setting_name + ": " + e.message);
					return {
						errors: true,
						error: e.message
					};
				}
			},
			get_extension_setting: function(ext_id, setting_name, default_value) {
				var m_value = GM_getValue(ext_id + "_____" + setting_name, default_value);
				if (m_value === "true" || m_value === true) {
					return true;
				} else {
					if (m_value === "false" || m_value === false) {
						return false;
					} else {
						return m_value;
					}
				}
			},
			set_extension_setting: function(ext_id, setting_name, new_value) {
				return GM_setValue(ext_id + "_____" + setting_name, new_value);
			},

			/**
			 * Parse an XKit extension version string of form X.Y.Z or X.Y REV Z
			 * @param {String} versionString
			 * @return {Object} version descriptor with keys major, minor, and patch
			 */
			parse_version: function(versionString) {
				if (typeof(versionString) === "undefined" || versionString === "") {
					return {major: 0, minor: 0, patch: 0};
				}
				var version = {};
				var versionSplit = versionString.split(".");
				if (versionSplit.length < 3) {
					var revisionString = versionSplit[1].toLowerCase().split("rev");
					version.major = parseInt(versionSplit[0]);
					version.minor = parseInt(revisionString[0].trim());
					if (typeof(revisionString[1]) === "undefined") {
						version.patch = 0;
					} else {
						// No need for toLowerCase here since we already do that when we split versionSplit above
						version.patch = revisionString[1].trim().charCodeAt(0) - "a".charCodeAt(0);
					}
				} else {
					version.major = parseInt(versionSplit[0]);
					version.minor = parseInt(versionSplit[1]);
					version.patch = parseInt(versionSplit[2]);
				}
				return version;
			},
			/**
			 * Cached nonce for use in script injection to overcome CSP
			 */
			add_function_nonce: "",
			/**
			 * Copies a function from the addon context into the page context. This
			 * function will be serialized to a string, and then injected as a script tag
			 * into the page.
			 * @param {Function} func
			 * @param {boolean} exec - Whether to execute the function immediately
			 * @param {Object} addt - The desired contents of the global variable
			 *                        `add_tag`. Only useful if `exec` is true
			 */
			add_function: function(func, exec, addt) {
				if (!XKit.tools.add_function_nonce) {
					var scripts = document.querySelectorAll('script');
					for (var i = 0; i < scripts.length; i++) {
						var nonce = scripts[i].getAttribute('nonce');
						if (nonce) {
							XKit.tools.add_function_nonce = nonce;
							break;
						}
					}
				}

				try {
					var script = document.createElement("script");
					script.textContent = "var add_tag = " + JSON.stringify(addt) + ";";
					script.textContent = script.textContent + (exec ? "(" : "") + func.toString() + (exec ? ")();" : "");
					if (XKit.tools.add_function_nonce) {
						script.setAttribute('nonce', XKit.tools.add_function_nonce);
					}
					document.body.appendChild(script);
				} catch (e) {
					XKit.window.show("Error",
						"XKit failed to inject a script." +
						"<p>" + e.message + "</p>",
						"error",
						'<div class="xkit-button default" id="xkit-close-message">OK</div>'
					);
				}
			},
			/**
			 * Create and trigger download of data
			 * @param {String} filename
			 * @param {Array|String} data - the file's contents
			 * @param {Object} options - Blob type/endings object (optional, defaults to plaintext)
			 * @return {Boolean} success
			 */
			make_file: function(filename, data, options) {
				try {

					if (!Array.isArray(data)) {
						data = [data];
					}

					var blob = new Blob(data, options || { type: "text/plain" });
					var fakelink = document.createElement("a");
					var url = window.URL.createObjectURL(blob);

					fakelink.style.display = "none";
					fakelink.href = url;
					fakelink.download = filename || true;

					document.body.appendChild(fakelink);
					fakelink.click();
					window.URL.revokeObjectURL(url);
					return true;

				} catch (e) {
					console.error(e.message);
					return false;
				}
			},
			/**
			 * Creates a link to a github issue with error text and template
			 * @param {String} title - the title of the github issue--should be unique and useful
			 * @param {Object?} data - Key-value pairs to list at the top of the issue.
			 * @param {Error?} error - An exception to serialize, if availible
			 * @return {String} The url to link the user to
			 */
			github_issue: function(title, data, error) {

				if (!data) {
					data = {};
				}

				data['User Agent'] = window.navigator.userAgent;
				data['XKit Version'] = XKit.version;
				data['Patches Version'] = XKit.installed.get("xkit_patches").version;
				data['Extensions'] = XKit.installed.list().join(", ");
				data['URL'] = window.location.toString();

				var body = "\xA0\n*Please describe what actions we can take to reproduce the bug you found, " +
				  "including any links or screenshots that might help us figure out what's going on.*\n\n\n" +
			   "-----------\n\n";

				if (error) {
					body += "```\n" +
					error.stack +
					"\n```\n\n";
				}

				body += "System Data | \xA0 \n";
				body += "----------- | -----------\n";
				$.each(data, function(key, value) {
					body += key + " | " + value + "\n";
				});

				return "https://github.com/new-xkit/XKit/issues/new?" + $.param({body: body, title: title});
			},
			/**
			 * Quick-and-dirty function debouncing.
			 * Debounced functions will only occur 'delay' milliseconds after their last call.
			 * Multiple calls before the function is executed resets the timer.
			 * @param {Function} func - Function to wrap. Will be executed with
										the *last* passed 'this' values and arguments
			 * @param {Number} wait - Milliseconds to pass to setTimeout. Delay that occurs after the last function call
			 * @return {Function} The wrapped, debounced function.
			 */
			debounce: function(func, wait) {
				var timeout_id;
				return function() {
					var last_context = this;
					var last_args = arguments;

					var exec = function() {
						timeout_id = null;
						func.apply(last_context, last_args);
					};
					clearTimeout(timeout_id);
					timeout_id = setTimeout(exec, wait);
				};
			},
			/**
			 * @return {Object} The elements of XKit's storage as a map from setting key to
			 *                  setting value
			 */
			dump_config: function() {
				if (XKit.browser().safari) {
					var obj = XBridge.storage_area;
					for (var x in obj) {
						obj[x] = XBridge.storage.read(x);
					}
					return obj;
				} else {
					// from WebExtension/bridge.js
					/* globals xkit_storage */
					return xkit_storage;
				}
			},
			/**
			 * @param {String} text - the text to be escaped
			 * @return {String} Will return the passed text, with all potentially
			 *                  dangerous-for-HTML characters escaped
			 *
			 * see also https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#XSS_Prevention_Rules
			 * for the source of the list of escaping rules in this function.
			 *
			 * Under no circumstances should the output of this function be injected into
			 * an unquoted element attribute, as there are many ways to escape from an
			 * unquoted attribute that aren't covered here. Don't use unquoted attributes
			 */
			escape_html: function(text) {
				return String(text)
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;")
					.replace(/\//g, "&#x2F;");
			},
			/**
			 * @param {String} name - Name of URL parameter to retrieve
			 * @return {String} Value of parameter or ""
			 */
			getParameterByName: function(name) {
				// http://stackoverflow.com/a/901144/2073440
				name = encodeURIComponent(name);
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(location.search);
				if (results === null) {
					return "";
				} else {
					var parameter = results[1];
					return decodeURIComponent(parameter.replace(/\+/g, " "));
				}
			},
			/**
			 * @param {Object} details - GM_xmlhttpRequest style parameter object
			 *
			 * Used to cheat the Origin/Referer headers by combining `add_function`
			 * and a standard XHR, which posts a message back when it's done.
			 */
			Nx_XHR: function(details) {
				details.timestamp = new Date().getTime() + Math.random();

				XKit.tools.add_function(function() {
					var xhr = new XMLHttpRequest();
					xhr.open(add_tag.method, add_tag.url, add_tag.async || true);

					if (add_tag.json === true) {
						xhr.setRequestHeader("Content-type", "application/json");
					}
					for (var header in add_tag.headers) {
						xhr.setRequestHeader(header, add_tag.headers[header]);
					}

					function callback(result) {
						var bare_headers = xhr.getAllResponseHeaders().split("\r\n");
						var cur_headers = {}, splitter;
						for (var x in bare_headers) {
							splitter = bare_headers[x].indexOf(":");
							if (splitter === -1) { continue; }
							cur_headers[bare_headers[x].substring(0, splitter).trim().toLowerCase()] = bare_headers[x].substring(splitter + 1).trim();
						}
						window.postMessage({
							response: {
								status: xhr.status,
								responseText: xhr.response,
								headers: cur_headers
							},
							timestamp: "xkit_" + add_tag.timestamp,
							success: result
						}, window.location.protocol + "//" + window.location.host);
					}

					xhr.onerror = function() { callback(false); };
					xhr.onload = function() { callback(true); };

					if (typeof add_tag.data !== "undefined") {
						xhr.send(add_tag.data);
					} else {
						xhr.send();
					}
				}, true, details);

				function handler(e) {
					if (e.origin === window.location.protocol + "//" + window.location.host && e.data.timestamp === "xkit_" + details.timestamp) {
						window.removeEventListener("message", handler);

						if (typeof e.data.response.headers["x-tumblr-kittens"] !== "undefined") {
							XKit.interface.kitty.set(e.data.response.headers["x-tumblr-kittens"]);
						}

						if (e.data.success) {
							details.onload(e.data.response);
						} else {
							details.onerror(e.data.response);
						}
					}
				}

				window.addEventListener("message", handler);
			},

			show_timestamps_help: function() {

				XKit.window.show("Timestamp formatting",
					"This extension allows you to format the date by using a formatting syntax. Make your own and type it in the Timestamp Format box to customize your timestamps.<br/><br/>" +
					"Please be careful while customizing the format. Improper/invalid formatting can render Timestamps unusable. " +
					"In that case, just delete the text you've entered completely and XKit will revert to its default formatting.",

					"info",

					'<div class="xkit-button default" id="xkit-timestamps-view-formatting">Formatting Syntax</div>' +
					'<div class="xkit-button" id="xkit-close-message">Close</div>'
				);

				$("#xkit-timestamps-view-formatting").click(function() {
					$("#xkit-timestamps-view-formatting").off("click");
					XKit.window.show("Timestamps Format",
						"You can customize your timestamps using the syntax below.<br>XKit uses <a href=\"https://momentjs.com/\" target=\"_blank\">moment.js</a>, so it uses it's syntax." +
						`<div class="two-column-table">
							<div class="row header">
								<div class="column-1">Token</div>
								<div class="column-2">Description</div>
								<div class="column-3">Example</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Month</div>
							</div>

							<div class="row">
								<div class="column-1">M</div>
								<div class="column-2">Month number</div>
								<div class="column-3">6</div>
							</div>

							<div class="row">
								<div class="column-1">Mo</div>
								<div class="column-2">Month number</div>
								<div class="column-3">6th</div>
							</div>

							<div class="row">
								<div class="column-1">MM</div>
								<div class="column-2">Month number with leading zeros</div>
								<div class="column-3">06</div>
							</div>

							<div class="row">
								<div class="column-1">MMM</div>
								<div class="column-2">Short month name</div>
								<div class="column-3">Dec</div>
							</div>

							<div class="row">
								<div class="column-1">MMMM</div>
								<div class="column-2">Long month name</div>
								<div class="column-3">December</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Day</div>
							</div>

							<div class="row">
								<div class="column-1">D</div>
								<div class="column-2">Day of month</div>
								<div class="column-3">1</div>
							</div>

							<div class="row">
								<div class="column-1">Do</div>
								<div class="column-2">Day of month</div>
								<div class="column-3">1st</div>
							</div>

							<div class="row">
								<div class="column-1">DD</div>
								<div class="column-2">Day of month with leading zeros</div>
								<div class="column-3">01</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Day of Week</div>
							</div>

							<div class="row">
								<div class="column-1">d</div>
								<div class="column-2">Day of week as a number</div>
								<div class="column-3">0, 1, 2, .... 6</div>
							</div>

							<div class="row">
								<div class="column-1">ddd</div>
								<div class="column-2">Day of week as short text</div>
								<div class="column-3">Sun, Mon, ... Fri, Sat</div>
							</div>

							<div class="row">
								<div class="column-1">dddd</div>
								<div class="column-2">Day of week as long text</div>
								<div class="column-3">Sunday, ... Saturday</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Year</div>
							</div>

							<div class="row">
								<div class="column-1">YY</div>
								<div class="column-2">Short Year</div>
								<div class="column-3">84, 94, 04</div>
							</div>

							<div class="row">
								<div class="column-1">YYYY</div>
								<div class="column-2">Long Year</div>
								<div class="column-3">1984, 1994, 2004</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Time</div>
							</div>

							<div class="row">
								<div class="column-1">A</div>
								<div class="column-2">AM/PM, uppercase</div>
								<div class="column-3">AM</div>
							</div>

							<div class="row">
								<div class="column-1">a</div>
								<div class="column-2">AM/PM, lowercase</div>
								<div class="column-3">am</div>
							</div>

							<div class="row">
								<div class="column-1">h</div>
								<div class="column-2">Hour (12-hour)</div>
								<div class="column-3">1, 2, ... 11, 12</div>
							</div>

							<div class="row">
								<div class="column-1">hh</div>
								<div class="column-2">Hour with leading zeros (12-hour)</div>
								<div class="column-3">01, 02, ... 11, 12</div>
							</div>

							<div class="row">
								<div class="column-1">H</div>
								<div class="column-2">Hour (24-hour)</div>
								<div class="column-3">0, 1, ... 22, 23</div>
							</div>

							<div class="row">
								<div class="column-1">HH</div>
								<div class="column-2">Hour with leading zeros (24-hour)</div>
								<div class="column-3">00, 01 ... 22, 23</div>
							</div>

							<div class="row">
								<div class="column-1">m</div>
								<div class="column-2">Minute</div>
								<div class="column-3">0, 1, ... 58, 59</div>
							</div>

							<div class="row">
								<div class="column-1">mm</div>
								<div class="column-2">Minute with leading zeros</div>
								<div class="column-3">00, 01, ... 58, 59</div>
							</div>

							<div class="row">
								<div class="column-1">s</div>
								<div class="column-2">Second</div>
								<div class="column-3">0, 1, ... 58, 59</div>
							</div>

							<div class="row">
								<div class="column-1">ss</div>
								<div class="column-2">Second with leading zeros</div>
								<div class="column-3">00, 01, ... 58, 59</div>
							</div>


							<div class="row separator">
								<div class="column-separator"> Miscellaneous </div>
							</div>

							<div class="row">
								<div class="column-1">[ <i>text</i> ]</div>
								<div class="column-2">Escape text, used to add text to timestamps</div>
								<div class="column-3">See example below</div>
							</div>

							<div class="row">
								<div class="column-1">Z</div>
								<div class="column-2">Timezone</div>
								<div class="column-3">-07:00</div>
							</div>

							<div class="row">
								<div class="column-1">X</div>
								<div class="column-2">Unix Timestamp</div>
								<div class="column-3">1360033296</div>
							</div>
							<div class="row header">
								<div class="column-1" style="width: 50%">What to type</div>
								<div class="column-2" style="width: 50%; text-align: center">Example</div>
							</div>

							<div class="row">
								<div class="column-1" style="width: 50%">MMMM Do YYYY, h:mm:ss a</div>
								<div class="column-2" style="width: 50%; text-align: center">June 16th 2013, 1:19:00 pm</div>
							</div>

							<div class="row">
								<div class="column-1" style="width: 50%">dddd, h:mm:ss A</div>
								<div class="column-2" style="width: 50%; text-align: center">Sunday, 1:19:00 PM</div>
							</div>

							<div class="row">
								<div class="column-1" style="width: 50%">[on the day] MMM DD [around] hh:mma</div>
								<div class="column-2" style="width: 50%; text-align: center">on the day Jun 16 around 01:19pm</div>
							</div>
						</div>`, "info",
						'<div class="xkit-button default" id="xkit-close-message">OK</div>',
						true
					);
				});
			}
		},
		interface: {
			revision: 2,

			added_icon: [],
			added_icon_icon: [],
			added_icon_text: [],

			post_window_listener_id: [],
			post_window_listener_func: [],
			post_window_listener_running: false,
			post_window_listener_window_id: 0,

			/**
			 * Interface for tracking the secure_form_key used in Tumblr API
			 * requests.
			 */
			kitty: {

				stored: "",
				store_time: 0,
				expire_time: 600000,

				/**
				 * @param {String} kitty - The new secure_form_key value.
				 */
				set: function(kitty) {

					if (typeof kitty === "undefined") { kitty = ""; }
					//// console.log("XKitty: Setting kitty to \"" + kitty + "\"");
					XKit.interface.kitty.stored = kitty;

				},

				/**
				 * Get the secure_form_key through a request using the current form_key
				 * @param {Function} callback invoked with `{errors: boolean, kitten: String}`
				 */
				get: function(callback) {

					var m_object = {};
					m_object.errors = false;
					m_object.kitten = "";

					var current_ms = new Date().getTime();
					var kitty_diff = current_ms - XKit.interface.kitty.store_time;

					if (XKit.interface.kitty.stored !== "") {
						if (kitty_diff >= XKit.interface.kitty.expire_time || kitty_diff < 0) {
							//// console.log("XKitty: Kitty expired? Let's try again.");
						} else {
							//// console.log("XKitty: Kitty already received, passing: " + XKit.interface.kitty.stored);
							m_object.kitten = XKit.interface.kitty.stored;
							callback(m_object);
							return;
						}
					}

					//// console.log("XKitty: Kitty blank / expired, requesting new feline.");

					XKit.tools.Nx_XHR({
						method: "POST",
						url: "https://www.tumblr.com/svc/secure_form_key",
						headers: {
							"X-tumblr-form-key": XKit.interface.form_key(),
						},
						onload: function(response) {
							//// console.log("XKitty: YAY! Kitty request complete!");
							XKit.interface.kitty.store_time = new Date().getTime();
							var kitty_text = response.headers["x-tumblr-secure-form-key"];
							XKit.interface.kitty.stored = kitty_text;
							m_object.kitten = XKit.interface.kitty.stored;
							m_object.response = response;
							callback(m_object);
						},
						onerror: function(response) {
							//// console.warn("XKitty: DAMN IT! Kitty request FAILED!");
							m_object.errors = true;
							m_object.kitten = "";
							m_object.response = response;
							XKit.interface.kitty.stored = "";
							callback(m_object);
						}
					});

				},


			},

			post_window: {

				added_icon: [],
				added_icon_icon: [],
				added_icon_text: [],

				/**
				 * Create a specification for a control button that can be added to
				 * future posts using `XKit.post_window.add_control_button`.
				 * @param {String} class_name - CSS class of the button to be created
				 * @param {String} icon - URL of the button's icon
				 * @param {String} text - Hover text of the button
				 * @param {EventListener} func - Function called on click of control button
				 */
				create_control_button: function(class_name, icon, text, func) {

					XKit.interface.post_window.added_icon.push(class_name);
					XKit.interface.post_window.added_icon_icon.push(icon);
					XKit.interface.post_window.added_icon_text.push(text);

					XKit.tools.add_css("." + class_name + " {" +
							" background-image: url('" + icon + "') !important;" +
							" background-size: auto auto !important;" +
							"}", "xkit_interface_post_window_icon___" + class_name);

					$(document).on('click', '.' + class_name, function() {
						if ($(this).hasClass("xkit-interface-working") || $(this).hasClass("xkit-interface-disabled")) { return; }
						if (typeof func === "function") { func.call(this, event); }
					});

				},

				/**
				 * Instantiate and add a previously "created" button to the
				 * current post window.
				 * @param {String} class_name - CSS class of the button to be added
				 * @param {String?} additional - String inserted into the button's div tag
				 */
				add_control_button: function(class_name, additional) {

					if (typeof additional == "undefined") {additional = ""; }

					if (XKit.interface.post_window.added_icon.indexOf(class_name) === -1) {
						// console.warn("Interface -> Can't add icon, button not created, use create_control_button.");
						return;
					}

					var m_text = XKit.interface.post_window.added_icon_text[XKit.interface.post_window.added_icon.indexOf(class_name)];
					var m_html = "<div title=\"" + m_text + "\" class=\"xkit-interface-control-button " + class_name + "\" " + additional + "></div>";

					// Add to area above controls
					var control_area = $(".post-form--controls");
					if (control_area.length > 0) {
						var xkit_area = control_area.find("#xkit-interface-buttons");
						if (xkit_area.length > 0) {
							xkit_area.prepend(m_html);
						} else {
							control_area.prepend("<div id=\"xkit-interface-buttons\">" + m_html + "</div>");
						}
					}
				},

				/**
				 * @return {String} HTML content of the current post window
				 */
				get_content_html: function() {
					if ($(".html-field").css("display") === "none") {
						//rich text editor
						var content_editor = $('.post-form--form').find('.editor.editor-richtext');
						if (content_editor.length === 0) {
							console.error('ERROR: unable to get content html');
							return '';
						}
						return content_editor.html();
					} else if ($('.chat-field').length > 0 && $('.chat-field').css("display") !== "none") {
						//chat post editor
						return $('editor-plaintext').html();
					} else {
						var html_or_markdown = $(".tab-label[data-js-srclabel]").text();
						if (html_or_markdown === 'HTML') {
							var text = $('.ace_editor .ace_text-layer').text();
							// replace nonebreaking spaces with normal ones
							text = text.replace(/\xa0/g, ' ');
							return text;
						}
						throw "Invalid editor type.";
					}
				},

				/**
				 * Sets the content of the post window.
				 * @param {String} new_content
				 */
				set_content_html: function(new_content) {
					if ($(".html-field").css("display") === "none") {
						var content_editor = $('.post-form--form').find('.editor.editor-richtext');
						if (content_editor.length === 0) {
							console.error('unable to set content html');
							return;
						}
						content_editor.focus();
						content_editor.html(new_content);
						content_editor.addClass("editor-richtext-has-text");
						content_editor.blur();
						return;
					}

					var html_or_markdown = $(".tab-label[data-js-srclabel]").text();
					XKit.tools.add_function(function() {
						/* globals require */
						/* eslint-disable no-shadow */
						var new_content = add_tag[0];
						var html_or_markdown = add_tag[1];
						/* eslint-enable no-shadow */
						var editor_div = document.getElementsByClassName("ace_editor");
						if (html_or_markdown === "Markdown") {
							new_content = require('to-markdown').toMarkdown(new_content);
						}
						if (editor_div.length === 1) {
							var editor = window.ace.edit(editor_div[0]);
							editor.setValue(new_content);
							setTimeout(function() {
								jQuery(".ace_marker-layer").empty();
							}, 500);
						}
					}, true, [new_content, html_or_markdown]);
				},

				/**
				 * Adds tags to the post window.
				 * @param {String|Array<String>} tag_or_tags
				 */
				add_tag: function(tag_or_tags) {
					var tag_editor = $(".post-form--tag-editor").find(".editor-plaintext");
					function add_single_tag(tag) {
						tag_editor.focus();
						tag_editor.text(tag);
						tag_editor.addClass("editor-plaintext-has-text");
						tag_editor.blur();
					}
					if (typeof tag_or_tags !== "string") {
						tag_or_tags.forEach(function(tag) {
							add_single_tag(tag.trim());
						});
					} else {
						add_single_tag(tag_or_tags);
					}
				},

				/**
				 * @param {String} tag
				 * @return {boolean} Whether the tag exists in the current post window's tag input
				 */
				tag_exists: function(tag) {

					var found = false;
					tag = tag.toLowerCase();

					$(".post-form--tag-editor").find(".tag-label").each(function() {
						var this_tag = $(this).text();
						this_tag = this_tag.toLowerCase();
						if (this_tag.substring(0) === "\"") {
							this_tag = this_tag.substring(1, this_tag.length - 1);
						}
						if (this_tag === tag) {
							found = true;
						}
					});

					return found;

				},

				/**
				 * Remove all tags from the current post window
				 */
				remove_all_tags: function() {
					$(".post-form--tag-editor").find(".tag-label").click();
				},

				/**
				 * Remove a specific tag from the current post window
				 * @param {String} tag
				 */
				remove_tag: function(tag) {

					tag = tag.toLowerCase();


					$(".post-form--tag-editor").find(".tag-label").each(function() {

						var this_tag = $(this).text();
						this_tag = this_tag.toLowerCase();
						if (this_tag.substring(0) === "\"") {
							this_tag = this_tag.substring(1, this_tag.length - 1);
						}
						if (this_tag === tag) {
							$(this).click();
						}

					});
				},

				/**
				 * @return {Object} State of the post, with keys
				 *	publish: boolean - Whether the post will be published (default new post)
				 *	draft: boolean - Whether the post will be drafted
				 *	queue: boolean - Whether the post will be queued
				 *	private: boolean - Whether the post will be "published privately"
				 */
				state: function() {

					var to_return = {};

					to_return.publish = $("#post_state").val() == "0";
					to_return.draft = $("#post_state").val() == "1";
					to_return.queue = $("#post_state").val() == "2";
					to_return.private = $("#post_state").val() == "private";

					return to_return;

				},

				/**
				 * @return {Object} Description of post type, see keys in function source
				 */
				post_type: function() {
					var post_form = $(".post-form");
					return {
						text: post_form.hasClass("post-form--text"),
						photo: post_form.hasClass("post-form--photo"),
						video: post_form.hasClass("post-form--video"),
						chat: post_form.hasClass("post-form--chat"),
						note: post_form.hasClass("post-form--note"),		// Tumblr calls published answers notes
						quote: post_form.hasClass("post-form--quote"),
						audio: post_form.hasClass("post-form--audio"),
						link: post_form.hasClass("post-form--link")
					};
				},

				/**
				 * @return {String} Blog making the post
				 */
				blog: function() {

					return $("#channel_id").val();

				},

				/**
				 * @param {String} url - URL of blog to which to switch the post window
				 * @return {boolean} Whether the switch succeeded
				 */
				switch_blog: function(url) {

					$("#tumblelog_choices").find(".option").each(function() {

						if ($(this).attr('data-option-value') === url) {
							$(this).trigger('click');
							return true;
						}

					});

					return false;

				},

				/**
				 * @return {boolean} Whether the post window is currently open
				 */
				open: function() {

					return XKit.interface.post_window_listener_window_id !== 0;

				},

				/**
				 * @return {String} Type of post, see also XKit.interface.post_window.post_type
				 */
				type: function() {
					var types = ['text', 'photo', 'quote', 'link', 'chat', 'audio', 'video'];
					var form = $('.post-form');
					for (var i = 0; i < types.length; i++) {
						var type = types[i];
						if (form.hasClass('post-form--' + type)) {
							return type;
						}
					}
					// Default to text
					return 'text';
				},

				/**
				 * @return {Object} Description of originality of post with boolean
				 *                  keys is_reblog and is_original for the two cases.
				 */
				origin: function() {

					var to_return = {};

					to_return.is_reblog = $(".post-form--header").find(".reblog_source").length > 0;
					to_return.is_original = $(".post-form--header").find(".reblog_source").length <= 0;

					return to_return;

				}

			},

			post_window_listener: {

				/**
				 * Begin running the post_window_listener
				 */
				run: function() {

					if (XKit.interface.post_window_listener_running) { return; }

					XKit.interface.post_window_listener_running = true;
					XKit.interface.post_window_listener.set_listen();

				},

				/**
				 * Schedule the execution of XKit.interface.post_window_listener
				 */
				set_listen: function() {

					setTimeout(function() { XKit.interface.post_window_listener.do(); }, 800);

				},

				/**
				 * Perform the logic of the post_window_listener, running all
				 * registered post_window_listener callbacks if there is a
				 * newly opened post window. Otherwise schedules itself to run
				 * later using set_listen.
				 */
				do: function() {

					if (!XKit.interface.post_window_listener_running) {
						XKit.interface.post_window_listener_window_id = 0;
						XKit.interface.post_window_listener.set_listen();
						return;
					}

					var post_content = $(".post-form");
					var ask_form = $(".post_ask_answer_form");

					if (post_content.length <= 0 || ask_form.length > 0 || post_content.css('display') === 'none') {
						// No post window yet. Do nothing.
						XKit.interface.post_window_listener_window_id = 0;
						XKit.interface.post_window_listener.set_listen();
						return;
					}

					if (XKit.interface.post_window_listener_window_id !== 0) {
						// Already ran the functions here?
						XKit.interface.post_window_listener.set_listen();
						return;
					} else {
						XKit.interface.post_window_listener_window_id = XKit.tools.random_string();
					}

					if (XKit.interface.post_window_listener_id.length === 0) {
						// We got not functions to run.
						XKit.interface.post_window_listener.set_listen();
						return;
					}

					// console.log("interface -> Post Window found, running attached functions. [" + XKit.interface.post_window_listener_window_id + "]");

					for (var i = 0; i < XKit.interface.post_window_listener_id.length; i++) {

						if (typeof XKit.interface.post_window_listener_func[i] === "function") {

							try {
								XKit.interface.post_window_listener_func[i].call();
							} catch (e) {
								// console.log("interface -> post_window_listener -> can't run \"" + XKit.interface.post_window_listener_id[i] + "\": " + e.message);
							}
						}

					}

					XKit.interface.post_window_listener.set_listen();


				},

				/**
				 * Call func whenever a new create post window appears
				 * @param {String} id - globally unique identifier of function for removal
				 * @param {Function} func - function to call
				 */
				add: function(id, func) {
					// Call a function when the manual reblog window appears.
					XKit.interface.post_window_listener_id.push(id);
					XKit.interface.post_window_listener_func.push(func);
					XKit.interface.post_window_listener.run();

					if (XKit.interface.post_window.open()) {
						// This is one of the many reasons why nearly every extension uses
						// fully qualified names
						func.call();
					}
				},

				/**
				 * @param {String} id - ID of function to remove as provided in
				 *                      XKit.interface.post_window_listener.add
				 */
				remove: function(id) {

					var m_id = XKit.interface.post_window_listener_id.indexOf(id);

					if (m_id === -1) { return; }

					XKit.interface.post_window_listener_id.splice(m_id, 1);
					XKit.interface.post_window_listener_func.splice(m_id, 1);


				}


			},

			update_view: {

				// Each function here requires a Interface Post Object,
				// you can get using interface.post.

				/**
				 * Set the tags of a post
				 * @param {Object} post_obj - Interface Post Object provided by XKit.interface.post
				 * @param {String} tags - Comma-separated array of tags
				 */
				tags: function(post_obj, tags) {

					var post_div = $("#post_" + post_obj.id);

					var m_inner = "";
					var tags_array = tags.split(",");
					var added_tag_count = 0;

					for (var i = 0; i < tags_array.length; i++) {

						var formatted = encodeURIComponent(tags_array[i]);

						if (tags_array[i] === "" || tags_array[i] === " ") { continue; }

						if (tags_array[i].substring(0, 1) === " ") {
							tags_array[i] = tags_array[i].substring(1);
						}

						m_inner = m_inner + "<a class=\"post_tag\" href=\"/tagged/" + formatted + "\">#" + tags_array[i] + "</a>";
						added_tag_count++;

					}

					if (added_tag_count > 0) {
						$(post_div).removeClass("no_body");
					} else {
						$(post_div).addClass("no_body");
					}

					if ($(post_div).find(".post_tags").length > 0) {

						$(post_div).find(".post_tags").find("div:first-child").html(m_inner);

					} else {

						var m_html = "<div class=\"source-clear\"></div><div class=\"post_tags fadeable fadeable-source\"><div class=\"post_tags_inner\">" +
									m_inner +
								"</div>";
						$(post_div).find(".post_footer").before(m_html);

					}

				}

			},

			/**
			 * Override parameters of a post object
			 * @param {Object} tumblr_object
			 * @param {Object} settings - Object with keys `tags` and/or `caption` which
			 *                            will override tumblr_object's corresponding keys.
			 * @return {Object} Updated tumblr_object (same as the param) or an
			 *                  error object with keys `error` and `message`
			 */
			edit_post_object: function(tumblr_object, settings) {

				// Used to modify a Tumblr Post Object.
				// NEVER edit it yourself, it might change in the
				// future rendering your code useless. Use this.

				// Takes the Tumblr Object (get it using Fetch below, don't modify)
				// and a settings object. The settings object can have the following:

				/*
					[ settings] - object
						|
						|--- tags
						|--- caption
				*/

				if (typeof tumblr_object.post === "undefined") {
					// Jump one object in.
					tumblr_object = {};
					tumblr_object.error = true;
					tumblr_object.message = "Wrong/corrupt tumblr object, post object not found.";
					// console.log(tumblr_object.message);
					return tumblr_object;
				}

				if (typeof settings.tags !== "undefined") {

					tumblr_object.post.tags = settings.tags;

				}

				if (typeof settings.caption !== "undefined") {

					if (tumblr_object.post.type === "link") {
						tumblr_object.post.three = settings.caption;
					} else {
						tumblr_object.post.two = settings.caption;
					}

				}

				return tumblr_object;

			},

			/**
			 * Edit a post
			 * @param {Object} tumblr_object - Tumblr information corresponding to post
			 * @param {Function} func - Callback upon edit completion or error. If error,
			 *                          argument has keys error:true and message:String. Otherwise
			 *                          it contains JSON data of Tumblr's response to the edit.
			 * @param {boolean?} retry_mode - True if this function has failed and is
			 *                                attempting to retry the edit
			 */
			edit: function(tumblr_object, func, retry_mode) {

				// Used to edit a post.
				// Takes a Tumblr Post Object (get it using Fetch.)

				var m_object = {};

				m_object.form_key = XKit.interface.form_key();
				m_object.channel_id = tumblr_object.post_tumblelog.name_or_id;
				m_object.context_id = tumblr_object.post_tumblelog.name_or_id;
				m_object.post_id = tumblr_object.post.id;

				m_object.edit = true;
				m_object.safe_edit = true; // whatever the fuck this is.
				m_object.errors = false;
				m_object.message = "Post edited on " + m_object.channel_id;
				m_object.silent = true;
				m_object.post_context_page = "dashboard";
				m_object.editor_type = "rich";

				// m_object.post = {};

				/*

					{
						"form_key": "----", --OK
						"channel_id": "xenix", -- OK
						"post_id": "58790345774", -- OK
						"edit": true, -- OK
						"safe_edit": true, -- OK
						"errors": false, -- OK
						"created_post": true, -- OK
						"context_page": "dashboard", -- OK
						"post_context_page": "dashboard", --- OK
						"message": "Post edited on xenix", --- OK
						"silent": true, --- OK
						"context_id": "xenix", --- OK
						"editor_type": "rich", --- OK
						"is_rich_text[one]": "0",
						"is_rich_text[two]": "1",
						"is_rich_text[three]": "0",
						"post[slug]": "", --- OK
						"post[date]": "Aug 20th, 2013 5:44pm",
						"MAX_FILE_SIZE": "10485760",
						"post[type]": "photo",	--- OK
						"post[two]": "", --- OK
						"post[tags]": "omg,hahah", --- OK
						"post[state]": "0", --- OK
						"post[photoset_layout]": "1",
						"post[photoset_order]": "o1",
						"images[o1]": ""
					}

				*/

				m_object.post = tumblr_object.post;

				m_object['post[type]'] = tumblr_object.post.type;

				if (typeof tumblr_object.post.one !== "undefined") {
					m_object['post[one]'] = tumblr_object.post.one;
				}

				m_object['post[two]'] = tumblr_object.post.two;

				if (tumblr_object.post.type !== "photo" && tumblr_object.post.type !== "photoset") {
					if (typeof tumblr_object.post.three !== "undefined") {
						m_object['post[three]'] = tumblr_object.post.three;
					}
				}

				var m_tags = tumblr_object.post.tags;
				if (typeof m_tags === "undefined" || m_tags === "null") { m_tags = ""; }

				m_object['post[tags]'] = m_tags;
				m_object['post[slug]'] = tumblr_object.post.slug;

				if (tumblr_object.post.type === "photo" || tumblr_object.post.type === "photoset") {

					// This is retarded but it's whatever.

					m_object['post[photoset_layout]'] = "\"" + tumblr_object.post.photoset_layout + "\"";

					var m_photos = "";
					for (var photo in tumblr_object.post.photos) {
						if (m_photos === "") {
							m_photos = tumblr_object.post.photos[photo].id;
						} else {
							m_photos = m_photos + "," + tumblr_object.post.photos[photo].id;
						}
						m_object['images[' + tumblr_object.post.photos[photo].id + ']'] = "";
					}

					m_object['post[photoset_order]'] = m_photos;


				}

				var m_state = tumblr_object.post.state;
				if (isNaN(tumblr_object.post.state) === false) {
					m_state = tumblr_object.post.state.toString();
				}
				m_object['post[state]'] = m_state;

				// Not sure about this part:
				m_object["is_rich_text[one]"] = "0";
				m_object["is_rich_text[two]"] = "1";
				m_object["is_rich_text[three]"] = "0";

				m_object.created_post = tumblr_object.created_post;
				m_object.context_page = tumblr_object.post_context_page;
				m_object.post_context_page = tumblr_object.post_context_page;
				m_object.silent = false;
				m_object.errors = false;

				m_object.edit = true;

				var to_return = {};

				to_return.error = false;
				to_return.error_message = "";
				to_return.status = 200;
				to_return.data = "";

				XKit.interface.kitty.get(function(kitty_data) {

					if (kitty_data.errors === true) {

						// We fucked up. Let's try again.
						if (retry_mode === false) {
							XKit.interface.edit(tumblr_object, func, true);
						} else {
							to_return.error = true;
							to_return.status = kitty_data.response.status;

							if (kitty_data.response.status === 401) {
								to_return.message = "Permission Denied";
							} else {
								if (kitty_data.response.status === 404) {
									to_return.message = "Post Not Found";
								} else {
									to_return.message = "Unknown";
								}
							}

							func(to_return);

						}

						return;

					}

					GM_xmlhttpRequest({
						method: "POST",
						url: "http://www.tumblr.com/svc/post/update",
						data: JSON.stringify(m_object),
						json: true,
						headers: {
							"X-tumblr-puppies": kitty_data.kitten,
							"X-tumblr-form-key": XKit.interface.form_key(),
						},
						onerror: function(response) {

							XKit.interface.kitty.set(response.getResponseHeader(""));
							to_return.error = true;
							to_return.status = response.status;

							if (response.status === 401) {
								to_return.message = "Permission Denied";
							} else {
								if (response.status === 404) {
									to_return.message = "Post Not Found";
								} else {
									to_return.message = "Unknown";
								}
							}

							func(to_return);

						},
						onload: function(response) {

							XKit.interface.kitty.set(response.getResponseHeader("X-Tumblr-Kittens"));

							try {
								to_return.data = JSON.parse(response.responseText);
								func(to_return);
							} catch (e) {
								to_return.error = true;
								to_return.error_message = "Error parsing JSON";
								func(to_return);
							}

						}
					});

				});

			},

			/**
			 * @param {Object} post_object - Interface Post Object provided by XKit.interface.post
			 * @param {Function} func - Called on error or on completion with an object describing
			 *                          the results of the fetch. The object has key error: true
			 *                          if there is an error.
			 * @param {boolean} reblog_mode - Whether the post is a reblog
			 */
			fetch: function(post_object, func, reblog_mode) {

				// Fetches internal Tumblr object for a post, then calls callback (func)
				// You need to feed this an Interface Post Object.

				var m_object = {};

				m_object.form_key = XKit.interface.form_key();

				if (reblog_mode === true) {
					m_object.post_type = false; // Not sure why.
					m_object.reblog_key = post_object.reblog_key;
					m_object.reblog_id = post_object.id;
					m_object.channel_id = post_object.owner;
				} else {
					m_object.post_type = false; // Not sure why.
					m_object.post_id = post_object.id;
					m_object.channel_id = post_object.owner;
				}

				var to_return = {};

				to_return.error = false;
				to_return.error_message = "";
				to_return.status = 200;
				to_return.data = "";

				GM_xmlhttpRequest({
					method: "POST",
					url: "http://www.tumblr.com/svc/post/fetch",
					data: JSON.stringify(m_object),
					json: true,
					onerror: function(response) {

						to_return.error = true;
						to_return.status = response.status;

						if (response.status === 401) {
							to_return.message = "Permission Denied";
						} else {
							if (response.status === 404) {
								to_return.message = "Post Not Found";
							} else {
								to_return.message = "Unknown";
							}
						}

						func(to_return);

					},
					onload: function(response) {

						try {
							to_return.data = JSON.parse(response.responseText);
							func(to_return);
						} catch (e) {
							to_return.error = true;
							to_return.error_message = e.message;
							func(to_return);
						}

					}
				});

			},

			/**
			 * Adds or removes the "working" animation from the control button.
			 * @param {JQuery} obj
			 * @param {boolean} working - Whether the button should be "working"
			 */
			switch_control_button: function(obj, working) {


				if (working) {
					$(obj).addClass("xkit-interface-working");
				} else {
					$(obj).removeClass("xkit-interface-working");
				}


			},

			/**
			 * Adds or removes the "disabled" animation from the control button.
			 * @param {JQuery} obj
			 * @param {boolean} disabled - Whether the button should be "disabled"
			 */
			disable_control_button: function(obj, disabled) {


				if (disabled) {
					$(obj).addClass("xkit-interface-disabled");
				} else {
					$(obj).removeClass("xkit-interface-disabled");
				}


			},

			/**
			 * Adds or removes the "green/completed" animation from the control button.
			 * @param {JQuery} obj
			 * @param {boolean} completed - Whether the button should be "green/completed"
			 */
			completed_control_button: function(obj, completed) {


				if (completed) {
					$(obj).addClass("xkit-interface-completed");
				} else {
					$(obj).removeClass("xkit-interface-completed");
				}


			},

			/**
			 * Create a specification for a control button that can be added to
			 * future posts using `XKit.interface.add_control_button`.
			 * @param {String} class_name - CSS class of the button to be created
			 * @param {String} icon - URL of the button's icon
			 * @param {String} text - Hover text of the button
			 * @param {EventListener} func - Function called on click of control button
			 * @param {String?} ok_icon - URL of icon displayed when the button is
			 *                            "completed" (e.g. reblog button turning green)
			 */
			create_control_button: function(class_name, icon, text, func, ok_icon) {

				XKit.interface.added_icon.push(class_name);
				XKit.interface.added_icon_icon.push(icon);
				XKit.interface.added_icon_text.push(text);

				XKit.tools.add_css("." + class_name + ":after {" +
						" background-image: url('" + icon + "') !important;" +
						" background-size: auto auto !important;" +
						" margin-top: -7px !important; " +
						"}", "xkit_interface_icon___" + class_name);

				if (typeof ok_icon !== "undefined") {
					XKit.tools.add_css("." + class_name + ".xkit-interface-completed:after {" +
						" background-image: url('" + ok_icon + "') !important;" +
						" background-size: auto auto !important;" +
						" opacity: 1 !important; " +
						"}", "xkit_interface_icon___completed___" + class_name);
				}

				$(document).on('click', '.' + class_name, function() {
					if ($(this).hasClass("xkit-interface-working") || $(this).hasClass("xkit-interface-disabled")) { return; }
					if (typeof func === "function") { func.call(this, event); }
				});

			},

			/**
			 * Instantiate and add a previously "created" button to the
			 * specified post.
			 * @param {Object} obj - Interface Post Object
			 * @param {String} class_name - CSS class of the button to be added
			 * @param {String?} additional - String inserted into the button's div tag
			 */
			add_control_button: function(obj, class_name, additional) {

				if (typeof additional == "undefined") {additional = ""; }

				if (XKit.interface.added_icon.indexOf(class_name) === -1) {
					// console.log("Interface -> Can't add icon, button not created, use create_control_button.");
					return;
				}

				var m_text = XKit.interface.added_icon_text[XKit.interface.added_icon.indexOf(class_name)];

				var post_obj = XKit.interface.post(obj);
				var post_id = post_obj.id;
				var post_type = post_obj.type;
				var post_permalink = post_obj.permalink;

				var m_data = "data-post-id = \"" + post_id + "\" data-post-type=\"" + post_type + "\" data-permalink=\"" + post_permalink + "\"";

				var m_html = "<div " + m_data + " title=\"" + m_text + "\" class=\"xkit-interface-control-button post_control post_control_icon " + class_name + "\" " + additional + "></div>";

				if ($(obj).find(".post_controls_inner").length > 0) {
					$(obj).find(".post_controls_inner").prepend(m_html);
				} else if (XKit.browser().mobile) {
					$(obj).find(".mh_post_foot_control.show_notes").after(m_html);
				} else {
					$(obj).find(".post_controls").prepend(m_html);
				}

				if (XKit.interface.where().search) {
					XKit.interface.trigger_reflow();
				}
			},

			/**
			 * Get the posts on the screen without the given tag
			 * @param {String} without_tag - Class that the posts should not have
			 * @param {Boolean} mine - Whether the posts must be the user's
			 * @param {Boolean} can_edit - Whether the posts must be editable
			 * @return {Array<Object>} The posts
			 */
			get_posts: function(without_tag, mine, can_edit) {
				var posts = [];

				var selector = ".post";
				var where = XKit.interface.where();

				if (mine && !where.channel && !where.drafts && !where.queue) {
					selector = ".post.is_mine";
				}

				var selection = $(selector);

				var exclusions = [".radar", ".new_post_buttons", ".post_micro"];

				if (typeof without_tag !== "undefined") {
					exclusions.push("." + without_tag);
				}

				for (var i = 0; i < exclusions.length; i++) {
					selection = selection.not(exclusions[i]);
				}

				selection.each(function() {
					// If can_edit is requested and we don't have an edit post control,
					// don't push the post
					if (can_edit && $(this).find(".delete").length === 0) {
						return;
					}
					posts.push($(this));
				});
				return posts;
			},

			/**
			 * @param {String} post_id
			 * @return {Object} Interface Post Object of post with given id
			 */
			find_post: function(post_id) {

				// Return a post object based on post ID.

				if ($("body").find("#post_" + post_id).length > 0) {
					return XKit.interface.post($("#post_" + post_id));
				} else if ($(".mh_post").length > 0) {
					return XKit.interface.post($(".mh_post"));
				} else {
					var m_error = {};
					m_error.error = true;
					m_error.error_message = "Object not found on page.";
					return m_error;
				}

			},

			/**
			 * @param {JQuery} obj - Post element
			 * @return {Object} Interface Post Object or {error: true}
			 */
			post: function(obj) {

				var m_return = {};

				if (typeof $(obj).attr('data-post-id') == "undefined" && $(".mh_post_head_link").length === 0) {
					// Something is wrong.
					m_return.error = true;

					return;

				} else if ($(".mh_post_head_link").length > 0) {

					m_return.error = false;

					m_return.id = $(obj).find(".mh_post_head_link").attr('href').split('/')[4];

					m_return.permalink = $(obj).find(".mh_post_head_link").attr('href');

					if ($(obj).hasClass("post_type_regular")) {
						m_return.type = 'regular';
					} else if ($(obj).hasClass("post_type_audio")) {
						m_return.type = 'audio';
					} else if ($(obj).hasClass("post_type_quote")) {
						m_return.type = 'quote';
					} else if ($(obj).hasClass("post_type_photo")) {
						m_return.type = 'photo';
					} else if ($(obj).hasClass("post_type_photoset")) {
						m_return.type = 'photoset';
					} else if ($(obj).hasClass("post_type_video")) {
						m_return.type = 'video';
					} else if ($(obj).hasClass("post_type_panorama")) {
						m_return.type = 'panorama';
					}

					return m_return;
				}

				m_return.error = false;

				m_return.id = $(obj).attr('data-post-id');
				m_return.root_id = $(obj).attr('data-root_id');
				m_return.reblog_key = $(obj).attr('data-reblog-key');
				m_return.owner = $(obj).attr('data-tumblelog-name');
				m_return.tumblelog_key = $(obj).attr('data-tumblelog-key');

				m_return.liked = $(obj).find(".post_control.like").hasClass("liked");
				m_return.permalink = $(obj).find(".post_permalink").attr('href');

				m_return.type = $(obj).attr('data-type');

				if ($(obj).find(".post_content_inner").length > 0) {
					m_return.body = $(obj).find(".post_content_inner").html();
				} else {
					if ($(obj).find(".post_body").length > 0) {
						m_return.body = $(obj).find(".post_body").html();
					} else {
						m_return.body = "";
					}
				}

				m_return.animated = $(obj).hasClass("is_animated");
				m_return.is_reblogged = $(obj).hasClass("is_reblog") || $(obj).find(".reblog_info").length > 0;
				m_return.is_mine = $(obj).hasClass("is_mine");
				m_return.is_following = ($(obj).attr('data-following-tumblelog') === true);
				m_return.can_edit = $(obj).find(".post_control.edit").length > 0;


				if (m_return.is_reblogged && $(obj).attr('data-json')) {
					try {
						var json = $(obj).attr('data-json');
						var parsedJson = JSON.parse(json);
						m_return.source_owner = parsedJson['tumblelog-root-data'].name;
					} catch (e) {
						console.log('Error retrieving data-json attribute of post');
					}
				} else if ($(obj).hasClass("has_source")) {
					// Different pages (such as the sidebar) don't always have data-json defined,
					// so fall back to checking for source elements
					try {
						var sourceJson = $(obj).find('.post-source-link').attr('data-peepr');
						var parsedSourceJson = JSON.parse(sourceJson);
						m_return.source_owner = parsedSourceJson.tumblelog;
					} catch (e) {
						console.log('Error retrieving data-peepr attribute of post-source-link');
					}
				} else if ($(obj).find(".reblog_info").length > 0) {
					// If there is no source link but there is a reblog link, then
					// the reblog source is the source
					try {
						var reblogJson = $(obj).find(".reblog_info").attr('data-peepr');
						var parsedReblogJson = JSON.parse(reblogJson);
						m_return.source_owner = parsedReblogJson.tumblelog;
					} catch (e) {
						console.log('Error retrieving data-peepr attribute of reblog_info');
					}
				} else {
					// If there is no reblog or source link, consider the
					// post owner to be the original source
					m_return.source_owner = m_return.owner;
				}

				if (m_return.is_reblogged) {

					try {

						m_return.reblog_link = $(obj).find(".reblog_source").find("a").first().attr('href');
						m_return.reblog_owner = $(obj).find(".reblog_source").find("a").first().text();
						m_return.reblog_original_id = m_return.reblog_link.split('/')[4];

					} catch (e) {


					}

				}

				var n_count = 0;

				if ($(obj).find(".note_link_current").length > 0) {
					if ($(obj).find(".note_link_current").html() === "") {
						n_count = 0;
					} else {
						n_count = $(obj).find(".note_link_current").html().replace(/\D/g, '');
					}
				}

				m_return.note_count = n_count;

				m_return.avatar = $(obj).find(".post_avatar_image").attr('src');

				m_return.tags = "";
				if ($(obj).find(".post_tags").length > 0) {
					var to_return = "";
					$(obj).find(".post_tags").find(".post_tag").each(function() {
						if ($(this).hasClass("post_ask_me_link") === true) { return; }
						var m_tag = $(this).text();
						if (m_tag[0] === "#") {
							m_tag = m_tag.substring(1);
						}
						if (to_return === "") {
							to_return = m_tag;
						} else {
							to_return = to_return + "," + m_tag;
						}
					});
					m_return.tags = to_return;
				}

				return m_return;

			},

			/**
			 * @return {String} The current Tumblr form_key used for authentication
			 */
			form_key: function() {

				var to_return = $('meta[name=tumblr-form-key]').attr("content");

				if (typeof to_return === "undefined" || to_return === "") {
					// console.log(" --- XKit Interface: Form Key could not be fetched, using stored one.");
					to_return = window.atob(XKit.storage.get("xkit_patches", "last_stored_form_key", ""));
				} else {
					// console.log(" --- XKit Interface: Got form key, storing that one.");
					XKit.storage.set("xkit_patches", "last_stored_form_key", window.btoa(to_return));
				}
				return to_return;

			},

			/**
			 * @return {String} The concatentation of two form keys. Unused and likely a typo.
			 */
			check_key: function() {

				return $("body").attr('data-form-key') + $("body").attr('data-form-key');

			},

			/**
			 * @return {Object} Various information about the current user with keys
			 *	posts: number - Number of posts
			 *	followers: number - Number of followers
			 *	drafts: number - Number of drafts
			 *	processing: number - Number of posts "processing" (may be defunct)
			 *	queue: number - Number of posts in queue
			 *	activity: String - Activity data as a stringified array
			 *	name: String - username
			 *  title: String - blog title
			 */
			user: function() {

				var m_return = {};

				// Init variables
				m_return.posts = 0;
				m_return.followers = 0;
				m_return.drafts = 0;
				m_return.processing = 0;
				m_return.queue = 0;
				m_return.activity = '[0,0,0,0,0,0,0,0,0,0,0,0]';

				// Needs to be in a variable, otherwise account button can't be clicked. (Weird as fuck)
				var m_account = $("#account_button");

				m_account.click(); // Because tab must be open to steal data from it

				if ($(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-name").length > 0) {
					m_return.name = $(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-name").html().replace(",", "");
				} else {
					m_return.name = 'ERROR';
				}

				if ($(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-title").length > 0) {
					m_return.title = $(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-title").html().replace(",", "");
				} else {
					m_return.title = 'ERROR';
				}


				if ($(".blog-sub-nav-details").find(".blog-sub-nav-item").length > 0) {
					$(".blog-sub-nav-details").children(".blog-sub-nav-item").each(function(index, obj) {
						if ($(this).find(".blog-sub-nav-item-label").html() === 'Posts') {
							m_return.posts = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
						}
						if ($(this).find(".blog-sub-nav-item-label").html() === 'Followers') {
							m_return.followers = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
						}
						if ($(this).find(".blog-sub-nav-item-label").html() === 'Activity') {
							// Hax. Won't properly retrieve $(this).find(".blog-sub-nav-item-data.sparkline") for some reason.
							m_return.activity = $(this).find(".blog-sub-nav-item-link").html().slice(113).slice(0, -8);
						}
						if ($(this).find(".blog-sub-nav-item-label").html() === 'Drafts') {
							m_return.drafts = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
						}
						if ($(this).find(".blog-sub-nav-item-label").html() === 'Processing') {
							m_return.processing = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
						}
						if ($(this).find(".blog-sub-nav-item-label").html() === 'Queue') {
							m_return.queue = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
						}
					});
				}

				window.setTimeout(function() {
					m_account.click();
				}, 500);

				return m_return;

			},

			/**
			 * @return {Object} Information about the browser's current location in Tumblr with keys
			 *	inbox: boolean - Whether viewing inbox
			 *	activity: boolean - Whether viewing activity
			 *	queue: boolean - Whether viewing queue
			 *	channel: boolean - Whether viewing a channel
			 *	search: boolean - Whether viewing a search
			 *	drafts: boolean - Whether viewing drafts
			 *	followers: boolean - Whether viewing followers
			 *	channel: boolean - Whether viewing a channel
			 *	tagged: boolean - Whether viewing tagged posts
			 *	user_url: String - The url of the currently viewed side blog.
			 *	                   Otherwise the user's main URL
			 *	endless: boolean - Whether the current view scrolls endlessly
			 *	following: boolean - Whether the viewed blog follows the user
			 */
			where: function() {
				var m_return = {
					inbox: false,
					user_url: "",
					activity: false,
					queue: false,
					channel: false,
					search: false,
					drafts: false,
					followers: false,
					endless: false,
					dashboard: false,
					likes: false,
					following: false,
					tagged: false,
					explore: false
				};

				if ($("body").hasClass("dashboard_messages_inbox") === true || $("body").hasClass("dashboard_messages_submissions") === true) {
					m_return.inbox = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/inbox") !== -1) {
						m_return.inbox = true;
					} else {
						if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
							var m_array = document.location.href.split("/");
							if (m_array[5] === "messages") {
								m_return.inbox = true;
							}
						}
					}
				}

				var href_parts = document.location.href.split("/");
				if ($("body").hasClass("notifications_index")) {
					m_return.activity = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						if (href_parts[5] === "activity") {
							m_return.activity = true;
							m_return.user_url = href_parts[4].replace("#", "");
						}
					}
				}

				if ($("body").hasClass("dashboard_post_queue")) {
					m_return.queue = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						if (href_parts[5] === "queue") {
							m_return.queue = true;
							m_return.user_url = href_parts[4].replace("#", "");
						}
					}
				}

				if ($("body").hasClass("dashboard_drafts")) {
					m_return.drafts = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						if (href_parts[5] === "drafts") {
							m_return.drafts = true;
							m_return.user_url = href_parts[4].replace("#", "");
						}
					}
				}

				if ($("body").hasClass("dashboard_useraction_followers")) {
					m_return.followers = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						if (href_parts[5] === "followers") {
							m_return.followers = true;
							m_return.user_url = href_parts[4].replace("#", "");
						}
					}
				}

				if ($("body").hasClass("dashboard_useraction_following")) {
					m_return.following = true;
				}

				if ($("body").hasClass("tagged_actions_display") && document.location.href.indexOf("/tagged") !== 1) {
					m_return.tagged = true;
				}

				if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
					if (href_parts[3] === "blog") {
						m_return.user_url = href_parts[4].replace("#", "");
					}
				}

				if (document.location.href.indexOf("tumblr.com/search/") !== -1) {
					m_return.search = true;
				}

				if ($("body").hasClass("discover") ||
						document.location.href.indexOf("tumblr.com/explore/") !== -1) {
					m_return.explore = true;
				}

				if ($("body").hasClass("dashboard_posts_likes") ||
						document.location.href.indexOf("tumblr.com/likes/") !== -1) {
					m_return.likes = true;
				}

				if ($('link[type="application/rss+xml"]').length) {
					m_return.user_url = $('link[type="application/rss+xml"]').attr("href").replace(/\/rss.*$/, '');
				}

				m_return.dashboard = $("body").hasClass("is_dashboard") === true;
				m_return.channel = $("body").hasClass("is_channel") === true;
				m_return.endless = $("body").hasClass("without_auto_paginate") === false;

				return m_return;
			},

			/**
			 * Whether the page is an "official" tumblr page like the dashboard or
			 * if it is a user-styled page like a blog.
			 * @return {Boolean}
			 */
			is_tumblr_page: function() {
				// Effectively if the href is of the form https://www.tumblr.com
				return !!document.location.href.match(/^https?:\/\/(www\.)?tumblr\.com/);
			},


			/**
			 * Tell Tumblr to reflow the page. Used to recalculate post dimensions
			 * and j/k scrolling.
			 */
			trigger_reflow: function() {
				XKit.tools.debounce(function() {
					if (this.where().search) {
						// Found by logging calls to Tumblr.Events.trigger on the search page
						// search:post:photo_expanded is where the magic happens
						XKit.tools.add_function(function() {
							Tumblr.Events.trigger("post:photo_expanded");
							Tumblr.Events.trigger("search:post:photo_expanded");
							Tumblr.Events.trigger("search:layout:updated");
						}, true, "");
					} else {
						XKit.tools.add_function(function() {
							Tumblr.Events.trigger("DOMEventor:updateRect");
						}, true, "");
					}
				}, 250);
			},
			show_peepr_for: function(blog, post) {
				var payload = {
					tumblelog_name: blog
				};
				if (post) {
					payload.post_id = post;
				}

				XKit.tools.add_function(function() {
					Tumblr.Events.trigger("peepr-open-request", add_tag);
				}, true, payload);
			},

			/**
			 * Determines whether a user is following the given blog.
			 * The logged-in user must be a member of the given blog to determine this.
			 * @param {String} username
			 * @param {String} blog
			 * @return {Promise<Boolean>}
			 */
			is_following: function(username, blog) {
				return $.ajax({
					type: "GET",
					url: "https://www.tumblr.com/svc/blog/followed_by",
					data: "tumblelog=" + blog + "&query=" + username,
					dataType: "json",
				}).then(function(msg) {
					return msg.response.is_friend == 1;
				});
			}
		},
		post_listener: {
			callbacks: {},
			add: function(id, func) {
				try {
					if (typeof XKit.post_listener.callbacks[id] === "undefined") {
						XKit.post_listener.callbacks[id] = [func];
					} else {
						XKit.post_listener.callbacks[id].push(func);
					}
				} catch (e) {
					console.error("Could not add function to " + id + "'s post listener callbacks: " + e.message);
				}
			},
			remove: function(id, func) {
				if (typeof func === "undefined") {
					delete XKit.post_listener.callbacks[id];
				} else {
					var index = XKit.post_listener.callbacks[id].indexOf(func);
					if (index !== -1) {
						XKit.post_listener.callbacks[id].splice(index);
					} else {
						console.warn("Could not remove function from " + id + "'s post listener callbacks: not found.");
					}
				}
			},
			observer: new MutationObserver(function(mutations) {
				for (var mutation in mutations) {
					var $target = $(mutations[mutation].target);
					if ($target.hasClass("posts") || $target.parent().hasClass("posts") || $(mutations[mutation].addedNodes).find(".post").length) {
						for (var x in XKit.post_listener.callbacks) {
							for (var i in XKit.post_listener.callbacks[x]) {
								try {
									XKit.post_listener.callbacks[x][i]();
								} catch (e) {
									console.error("Could not run callback for " + x + ": " + e.message);
								}
							}
						}
						break;
					}
				}
			}),
			check: function() {
				XKit.post_listener.observer.observe($("body")[0], {
					childList: true,
					subtree: true
				});
			}
		},
		special: {

			force_update: function() {
				XKit.install("xkit_updates", data => {
					if (data.errors) {
						if (data.storage_error === true) {
							show_error_installation("[Code: 401] Storage error: " + data.error);
						} else {
							if (data.server_down === true) {
								show_error_installation("[Code: 101] Can't reach New XKit servers");
							} else {
								show_error_installation("[Code: 100] Server returned error/empty script");
							}
						}
						return;
					}

					try {
						new Function(data.script + "\n//# sourceURL=xkit/xkit_updates.js")();
						XKit.window.show("Forcing Extension Updates",
							"Please do not navigate away from this page. Your extensions are being updated for compatibility with the latest XKit version." +
							'<div id="xkit-forced-auto-updates-message">Initializing...</div>', "info");
						XKit.extensions.xkit_updates.get_list(true);
					} catch (e) {
						show_error_installation("[Code: 102] " + e.message);
					}
				});
			},

			reset: function() {

				XKit.window.show("Reset XKit", "Really delete all the data stored in XKit?<br/>Your settings will be lost. You can not undo this action.", "question", "<div id=\"reset-xkit-yes\" class=\"xkit-button default\">Yes, reset XKit</div><div id=\"reset-xkit-no\" class=\"xkit-button\">Cancel</div>");
				$("#reset-xkit-no").click(function() {
					XKit.window.close();
				});
				$("#reset-xkit-yes").click(function() {
					$(this).addClass("disabled");
					$("#reset-xkit-no").addClass("disabled");
					$(this).html("Resetting, please wait...");
					XKit.shutdown();
					setTimeout(function() {
						GM_deleteAllValues(function() {
							XKit.window.show("Reset complete.", "XKit finished resetting itself.<br/>Please restart your browser and visit your dashboard to re-install XKit.", "info", "<div id=\"reset-xkit-close\" class=\"xkit-button default\">OK</div>");
							$("#reset-xkit-close").click(function() {
								XKit.window.close();
							});
						});
					}, 500);
				});
			}

		},
		shutdown: function() {

			for (var ext in XKit.extensions) {

				try {
					console.log("Shutting down " + ext + "...");
					XKit.tools.remove_css(ext);
					XKit.extensions[ext].destroy();
				} catch (e) {
					console.error("Can not shut down " + ext + ".");
					continue;
				}

			}

		}
	};
}());

var centerIt = function(el /* (jQuery element) Element to center */) { // eslint-disable-line no-redeclare
	if (!el) {
		return;
	}
	var moveIt = function() {
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		el.css("position", "fixed").css("left", ((winWidth / 2) - (el.width() / 2)) + "px").css("top", ((winHeight / 2) - (el.height() / 2)) + "px");
	};
	$(window).resize(moveIt);
	moveIt();
};

function show_message(title, msg, icon, buttons) {

	if (typeof icon === "undefined") {
		icon = "";
	}

	if ($("#xkit-window").length > 0) {
		$("#xkit-window").attr('id', "xkit-window-old");
		$("#xkit-window-old").fadeOut('fast', function() {
			$(this).remove();
		});
	}

	var m_html = "<div id=\"xkit-window\" class=\"" + icon + "\" style=\"display: none;\">" +
						"<div class=\"xkit-window-title\">" + title + "</div>" +
						"<div class=\"xkit-window-msg\">" + msg + "</div>";

	if (typeof buttons !== "undefined") {
		m_html = m_html + "<div class=\"xkit-window-buttons\">" + buttons + "</div>";
	}

	if ($("#xkit-window-shadow").length === 0) {
		m_html = m_html + "</div><div id=\"xkit-window-shadow\"></div>";
	}

	$("body").prepend(m_html);
	centerIt($("#xkit-window"));
	$("#xkit-window").fadeIn('fast');

	$("#xkit-close-message").click(function() {
		$("#xkit-window-shadow").fadeOut('fast', function() {
			$(this).remove();
		});
		$("#xkit-window").fadeOut('fast', function() {
			$(this).remove();
		});
	});
}

function xkit_init_special() {

	$("body").html("");
	document.title = "XKit";

	XKit.notifications.init();
	XKit.notifications.add("<b>Welcome to XKit " + framework_version + "</b><br/>&copy; 2011-2013 STUDIOXENIX");

	if (document.location.href.indexOf("/xkit_reset") !== -1) {
		XKit.special.reset();
	}

	if (document.location.href.indexOf("/xkit_log") !== -1) {
		XKit.window.show("Enable XKit Log?", "If you enable the log, a green/black box will appear on the bottom of your screen showing you debugging data. When you run into a problem, copy that data and send it to the XKit blog if you run into a problem. It will help me find and fix the error.<br/><br/>When you are done, you can come back here and disable the log.", "info", "<div id=\"xkit-enable-log\" class=\"xkit-button default\">Enable Log</div><div id=\"xkit-disable-log\" class=\"xkit-button\">Disable Log</div>");
		$("#xkit-enable-log").click(function() {
			XKit.window.show("Logging turned on", "Now you can go back to your dashboard.", "info");
			XKit.tools.set_setting("xkit_log_enabled", "true");
		});
		$("#xkit-disable-log").click(function() {
			XKit.window.show("Logging turned off", "Now you can go back to your dashboard.", "info");
			XKit.tools.set_setting("xkit_log_enabled", "false");
		});
	}

	if (document.location.href.indexOf("/xkit_editor") !== -1) {
		if (typeof(browser) !== 'undefined') {
			/* global browser */
			var xhr = new XMLHttpRequest();
			xhr.open('GET', browser.extension.getURL('editor.js'), false);
			xhr.send(null);
			try {
				new Function(xhr.responseText + "\n//# sourceURL=xkit/editor.js")();
				XKit.extensions.xkit_editor.run();
			} catch (e) {
				XKit.window.show("Can't launch XKit Editor", "<p>" + e.message + "</p>", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			}
		} else if (XKit.extensions.xkit_editor) {
			XKit.extensions.xkit_editor.run();
		} else {
			XKit.window.show("Can't launch XKit Editor",
				"Extension platform unsupported or broken.", "error",
				"<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		}
	}

}

function xkit_init_frame() {

	// Redirect to object.
	XKit.init_frame();

}

function xkit_init() {

	// Redirect to object.
	XKit.init_normal();

}

function xkit_check_storage() {
	if (storage_used === -1) {
		setTimeout(function() { xkit_check_storage(); }, 2000);
		return;
	}

	if (storage_max === -1) {
		// No storage limit.
		XKit.storage.unlimited_storage = true;
		return;
	}

	var free_zone = storage_max - storage_used;
	console.log("Storage Free space: " + free_zone + " bytes");
	if (free_zone <= 2048) {
		XKit.window.show("Running out of space", "Your browser reported that XKit has less than 2048 bytes available for storage. Please remove any unused extensions or try resetting XKit. If it completely runs out of space, you might encounter errors or XKit might not be able to boot up.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a>");
	}

}

function install_extension(mdata, callback) {

	try {

		if (mdata.errors || !mdata.script) {
			// Server returned an error or empty script.
			console.warn("install_extension failed: Empty script or errors.");
			return callback(mdata);
		}

		var m_object = {
			script: mdata.script,
			id: mdata.id
		};

		if (typeof mdata.icon !== "undefined") {
			m_object.icon = mdata.icon;
		} else {
			m_object.icon = "";
		}

		if (typeof mdata.css !== "undefined") {
			m_object.css = mdata.css;
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

		if (typeof mdata.developer !== "undefined") {
			m_object.developer = mdata.developer;
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

		var m_result = XKit.tools.set_setting("extension_" + mdata.id, JSON.stringify(m_object));
		if (m_result.errors === false) {
			// Saved data without any errors!
			XKit.installed.add(mdata.id);
			var ext_id = mdata.id;
			Object.defineProperty(m_object, 'script', {
				enumerable: true,
				get: function() {
					return XKit.installed.script(ext_id);
				}
			});
			Object.defineProperty(m_object, 'icon', {
				enumerable: true,
				get: function() {
					return XKit.installed.icon(ext_id);
				}
			});
			Object.defineProperty(m_object, 'css', {
				enumerable: true,
				get: function() {
					return XKit.installed.css(ext_id);
				}
			});
			callback(m_object);
		} else {
			// Something awful has happened.
			m_result.storage_error = true;
			return m_result;
		}

	} catch (e) {

		show_error_script("install_extension failed: " + e.message);
		console.error("install_extension failed: " + e.message);

	}

}

function xkit_install() {

	XKit.window.show("Welcome to New XKit " + framework_version + "!", "<b>Please wait while I initialize the setup. This might take a while.<br/>Please do not navigate away from this page.</b>", "info");
	console.log("Trying to retrieve XKit Installer.");

	XKit.install("xkit_installer", function(mdata) {
		if (mdata.errors) {
			if (mdata.storage_error === true) {
				show_error_installation("[Code: 401] Storage error: " + mdata.error);
			} else {
				if (mdata.server_down === true) {
					show_error_installation("[Code: 101] Can't reach New XKit servers");
				} else {
					show_error_installation("[Code: 100] Server returned error/empty script");
				}
			}
			return;
		}

		try {
			new Function(mdata.script + "\n//# sourceURL=xkit/xkit_installer.js")();
			XKit.extensions.xkit_installer.run();
		} catch (e) {
			show_error_installation("[Code: 102] " + e.message);
		}

	});


}

function show_error_installation(message) {
	// Shortcut to call when there is an installation error.
	XKit.window.show("Can not install New XKit",

		"<b>Generated Error message:</b><br/>" +
		"<p>" + message + "</p>" +
		"Click on the Troubleshooting button below for help resolving this issue.",

		"error",

		'<div id="xkit-close-message" class="xkit-button default">OK</div>'
	);
}

function show_error_script(message) {
	// Shortcut to call when there is a javascript error.
	XKit.window.show("XKit ran into a scripting error.", "<b>Generated Error message:</b><br/><p>" + message + "</p>Write down the error message above and contact New XKit Support to see how you can fix this or reload the page to try again.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"https://new-xkit-support.tumblr.com\" class=\"xkit-button\">New XKit Support</a>");
}

function show_error_reset(message) {
	// Shortcut to call when there is a javascript error.
	XKit.window.show(
		"XKit ran into an error.",

		"<b>Generated Error message:</b><br/><p>" + message + "</p>" +
		"It is recommended that you update XKit.<br><br>" +
		"If you've seen this message more than once, try restarting your browser. " +
		"If you continue to see this message after completing the update process and restarting your browser, please contact us at New XKit Support.",

		"error",

		'<div id="xkit-close-message" class="xkit-button">OK</div>' +
		'<div id="xkit-force-update" class="xkit-button default">Update Extensions</div>' +
		'<a href="https://new-xkit-support.tumblr.com" class="xkit-button">New XKit Support</a>'
	);
	$("#xkit-force-update").click(XKit.special.force_update);
}

function show_error_update(message) {
	// Shortcut to call when there is a javascript error.
	XKit.window.show("XKit ran into an error.", "<b>Generated Error message:</b><br/><p>" + message + "</p>You might need to update XKit manually. Please visit the New XKit Blog. Alternatively, you can write down the error message above and contact New XKit Support to see how you can fix this or reload the page to try again.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"https://new-xkit-extension.tumblr.com\" class=\"xkit-button\">New XKit Blog</a><a href=\"https://new-xkit-support.tumblr.com\" class=\"xkit-button\">New XKit Support</a>");
}
