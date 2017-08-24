var available_extensions = [];
var xkit_global_start = Date.now();  // log start timestamp

(function() {

	if (typeof XKit !== "undefined") { return; }

	XKit = {
		version: framework_version,
		page: {
			standard: false,
			ask_frame: false,
			blog_frame: false,
			peepr: false,
			xkit: false
		},
		init: function() {

			// Check page then return control to init_extension.
			if (document.location.href.indexOf('://www.tumblr.com/xkit_reset') !== -1 ||
			document.location.href.indexOf('://www.tumblr.com/xkit_log') !== -1 ||
			document.location.href.indexOf('://www.tumblr.com/xkit_editor') !== -1 ||
			document.location.href.indexOf('://www.tumblr.com/xkit_update=') !== -1) {
				XKit.page.xkit = true;
				XKit.init_extension();
				return;
			}

			XKit.init_flags();
			// If not in an iframe
			if ((window.window === window.top) && document.location.href.indexOf("://www.tumblr.com/dashboard/iframe?") === -1) {
				XKit.page.standard = true;
				XKit.init_extension();
			} else {
				if (document.location.href.indexOf("://www.tumblr.com/send") !== -1) {
					XKit.console.add("In Fan Mail page.");
					XKit.page.blog_frame = true;
				}
				if (document.location.href.indexOf("://www.tumblr.com/dashboard/iframe?") !== -1 ||
					document.location.href.indexOf("://secure.assets.tumblr.com/assets/html/iframe/") !== -1) {
					XKit.page.blog_frame = true;
				}
				if ((document.location.href.indexOf("://www.tumblr.com/") !== -1 && document.location.href.indexOf("/peepr") !== -1) || document.location.href.indexOf("://www.tumblr.com/indash_blog/") !== -1) {
					XKit.page.peepr = true;
				}
				if (document.location.href.indexOf("://www.tumblr.com/ask_form/") !== -1) {
					XKit.page.ask_frame = true;
				}
				XKit.init_extension();
			}
		},
		init_extension: function() {
			XKit.console.add("init_extension: " + JSON.stringify(XKit.page));
			if (XKit.page.xkit) {
				xkit_init_special();
				return;
			}

			if (XKit.page.standard) {
				XKit.init_normal();
				return;
			}

			if (XKit.page.ask_frame || XKit.page.blog_frame || XKit.page.peepr) {
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
					XKit.window.show("XKit couldn't start.", "<b>Generated Error message:</b><br/><p>XKit Bridge Error<br/>" + bridge_status.error.message + "</p>Please reload the page to try again or click on the Troubleshooting Help button below to see how you can fix this error.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
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

				if (XKit.tools.get_setting("xkit_log_enabled", "") === "true") {
					XKit.console.show();
					XKit.console.add("Running on " + m_browser.name + ", version " + m_browser.version);
				}

				if (m_browser.spoofed === true) {
					// Nope, I won't be running here.
					XKit.window.show("Your browser is pretending to be something it is not.", "Spoofing your browser name/version can cause problems not just with XKit but other websites and extensions too. Please turn off any User Agent modifier you have installed. XKit will stop running now.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
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

				// It exists! Great.
				var xkit_main = XKit.installed.get("xkit_main");
				if (!xkit_main.errors && xkit_main.script) {
					XKit.console.add("Trying to run xkit_main.");
					try {
						eval(xkit_main.script + "\n//# sourceURL=xkit/xkit_main.js");
						XKit.extensions.xkit_main.run();
					} catch (e) {
						show_error_reset("Can't run xkit_main:" + e.message);
					}
				} else {
					if (xkit_main.error == "not_installed") {
						// Still not installed?
						XKit.console.add("xkit_main not found! Re-installing....");
						xkit_install();
						return;
					}
					if (xkit_main.error == "parse_error") {
						// Corrupt storage? Recomment reset.
						XKit.console.add("xkit_main is corrupt!");
						show_error_reset("Package xkit_main is corrupted!");
						return;
					}
				}

			} catch (e) {
				console.log(e);
				show_error_update("xkit_init(): " + e.message);
			}
		},
		init_frame: function() {

			// Load frame extensions.
			// First lets check if it actually exists.
			if (XKit.installed.check("xkit_main") === false) {
				XKit.console.add("xkit_main not found! Quitting.");
				return;
			}

			// It exists! Great.
			var xkit_main = XKit.installed.get("xkit_main");
			if (!xkit_main.errors && xkit_main.script) {
				XKit.console.add("Trying to run xkit_main.");
				try {
					eval(xkit_main.script + "\n//# sourceURL=xkit/xkit_main.js");
					XKit.frame_mode = true;
					XKit.extensions.xkit_main.run();
				} catch (e) {
					XKit.console.add("Can't run xkit_main:" + e.message);
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
		servers: {
			list: [
				"https://www.xkitcs.com"
			],
			count: 11,
			get: function() {
				return XKit.servers.list[XKit.servers.count];
			},
			next: function() {
				XKit.servers.count++;
				if (XKit.servers.count >= XKit.servers.list.length) {
					XKit.servers.count = 0;
				}
				return XKit.servers.list[XKit.servers.count];
			}
		},
		extensions: {},
		download: {
			try_count: 0,
			max_try_count: 5,
			// TODO: implement as module, lose most of this code
			github_fetch: function(path, callback, fallback) {
				var url = 'https://new-xkit.github.io/XKit/Extensions/dist/' + path;
				GM_xmlhttpRequest({
					method: "GET",
					url: url,
					onerror: function(response) {
						XKit.console.add("Server error, falling back for download of " + path);
						return fallback();
					},
					onload: function(response) {
						// We are done!
						var mdata = {};
						try {
							mdata = jQuery.parseJSON(response.responseText);
						} catch (e) {
							// Server returned bad thingy.
							XKit.console.add("Unable to download '" + path +
										"', server returned non-json object." + e.message);
							return fallback();
						}
						callback(mdata);
					}
				});
			},
			extension: function(extension_id, callback) {
				// Downloads the extension file.
				function fallback() {
					return XKit.download.page("get.php?extension=" + extension_id, callback);
				}

				XKit.download.github_fetch(extension_id + '.json', callback, fallback);
			},
			page: function(page, callback, fallingBack) {
				// Attempt to use Github distribution
				function fallback() {
					return XKit.download.page(page, callback, true);
				}

				if (!fallingBack) {
					if (page === 'list.php') {
						XKit.download.github_fetch('page/list.json', callback, fallback);
						return;
					}
					if (page === 'gallery.php') {
						XKit.download.github_fetch('page/gallery.json', callback, fallback);
						return;
					}
					if (page === 'themes/index.php') {
						XKit.download.github_fetch('page/themes.json', callback, fallback);
						return;
					}
					if (page === 'paperboy/index.php') {
						XKit.download.github_fetch('page/paperboy.json', callback, fallback);
						return;
					}
					if (page === 'framework_version.php') {
						XKit.download.github_fetch('page/framework_version.json', callback, fallback);
						return;
					}
				}
				// Downloads page from servers.
				if (XKit.download.try_count >= XKit.download.max_try_count) {
					XKit.download.try_count = 0;
					callback({errors: true, server_down: true});
					return;
				}
				var m_url = XKit.servers.next() + "/seven/" + page;
				if (m_url.indexOf("?") !== -1) {
					m_url = m_url + "&ftch_id=" + XKit.tools.random_string();
				} else {
					m_url = m_url + "?ftch_id=" + XKit.tools.random_string();
				}
				XKit.console.add("Trying to fetch: " + m_url);
				GM_xmlhttpRequest({
					method: "GET",
					url: m_url,
					onerror: function(response) {
						XKit.console.add("Server error, retrying download of page " + page);
						XKit.download.try_count++;
						return XKit.download.page(page, callback);
					},
					onload: function(response) {
						// We are done!
						var mdata = {};
						try {
							mdata = jQuery.parseJSON(response.responseText);
						} catch (e) {
							// Server returned bad thingy.
							XKit.console.add("Unable to download page '" + page + "', server returned non-json object." + e.message);
							XKit.download.try_count++;
							return XKit.download.page(page, callback);
						}
						if (mdata.errors) {
							XKit.download.try_count = 0;
							XKit.console.add("Fetch successful, but mdata.errors is true or script is empty.");
							callback(mdata);
						} else {
							XKit.download.try_count = 0;
							XKit.console.add("Fetch successful, calling callback.");
							callback(mdata);
						}
					}
				});
			}
		},
		install: function(extension_id, callback) {
			// Installs the extension.
			XKit.download.extension(extension_id, function(mdata) {
				XKit.console.add("download.extension of '" + extension_id + "' was successful. Calling callback.");
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
		browser: function() {
			var to_return = {
				name: "UNKNOWN",
				spoofed: false,
				chrome: false,
				firefox: false,
				safari: false,
				opera: false,
				version: 0
			};

			// First, let's check if it's chrome.
			if (window.chrome) {
				to_return.chrome = true;
			} else {
				// it can still be chrome?
				var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
				to_return.chrome = is_chrome;
			}

			function get_real_version(ua_prefix) {
				var ua_string = navigator.userAgent.toLowerCase();
				var index = ua_string.indexOf(ua_prefix);
				index += ua_prefix.length;
				return parseFloat(ua_string.substring(index));
			}

			if (to_return.chrome === true) {
					// Get version.
				to_return.name = "Google Chrome";
				to_return.version = get_real_version("chrome/");
			} else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
					// Then, let's check if it's firefox.
				to_return.name = "Mozilla Firefox";
				to_return.firefox = true;
				to_return.version = get_real_version("firefox/");
			} else if (navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
					// Is it Safari?
				to_return.name = "Apple Safari";
				to_return.safari = true;
					//Safari's actual version is actually after the version tag
				to_return.version = get_real_version("version/");
			}

			// Check if there is spoofing!
			// A lot of people now switch to IE.
			if (navigator.userAgent.indexOf('MSIE') > -1) {
				to_return.spoofed = true;
			}

			return to_return;
		},
		console: {
			shown: false,
			cache: "",
			show: function() {
				XKit.tools.add_css("#xkit_console { text-align: left; position: fixed; bottom: 0; left: 0; height: 110px; " +
					" z-index: 1000000; width: 100%; background: black; color: #75fa96; font-family: Courier; " +
					" padding: 10px; font-size: 10px; line-height: 14px; text-shadow: 0px 2px 3px black; " +
					" overflow: scroll; background: rgba(0,0,0,0.53); }" +
					" .xkit-toggle-extension-setting, .xkit-terminate-extension { " +
					" text-decoration: underline; display: inline-block; " +
					" cursor: pointer; margin-left: 15px; display: none; } ", "console");
				$("body").append("<div id=\"xkit_console\">Welcome to XKit console!</div>");

				if (XKit.console.cache !== "") {
					$("#xkit_console").append("<br/>" + XKit.console.cache);
					XKit.console.cache = "";
				}
			},
			hide: function() {
				XKit.tools.remove_css("console");
				$("#xkit_console").remove();
			},
			add: function(text) {
				if ($("#xkit_console").length > 0) {
					$("#xkit_console").append("<br/>" + text);
					var objDiv = document.getElementById("xkit_console");
					objDiv.scrollTop = objDiv.scrollHeight;
				} else {
					XKit.console.cache = XKit.console.cache + ("<br/>" + text);
				}
				console.log(text);
			}
		},
		window: {
			show: function(title, msg, icon, buttons) {
				show_message(title, msg, icon, buttons);
			},
			close: function() {
				$("#xkit-window-shadow").fadeOut('fast');
				$("#xkit-window-old").fadeOut('fast');
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
				XKit.notifications.count++;

				var m_class = "";
				if (type === "ok") { m_class = "notification-ok"; }
				if (type === "error") { m_class = "notification-error"; }
				if (type === "warning") { m_class = "notification-warning"; }

				if (sticky === true) {
					m_class = m_class + " sticky";
				}

				var m_html = "<div class=\"xkit-notification " + m_class + "\" id=\"xkit_notification_" + XKit.notifications.count + "\">" +
								message +
							"</div>";

				$("#xkit-notifications").append(m_html);

				XKit.console.add(" Notification > " + message);

				var m_notification_id = XKit.notifications.count;
				$("#xkit_notification_" + m_notification_id).slideDown('slow');
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
					XKit.window.show("Potential Extension Conflicts Found", "<b>XKit found the following potential conflicts:</b>" + m_obj.html + "It is highly recommended that you disable or remove the extensions/options listed below. You can click Ignore and Continue, which will prevent XKit from showing this window again, but no support will be provided to you if something goes wrong.", "warning", "<div class=\"xkit-button default\" id=\"xkit-disable-conflict-warning\">Ignore and Continue</div>" + "<a href=\"http://xkit.info/conflicts/\" class=\"xkit-button\">Learn More</a>");
				} else {
					XKit.window.show("Fatal Extension Conflicts Found", "<b>XKit found the following potential conflicts:</b>" + m_obj.html + "XKit can not continue loading before you disable other versions of XKit. Please check your browser's documentation on how to disable/remove extensions and remove other versions of XKit.", "warning", "<a href=\"http://xkit.info/conflicts/\" class=\"xkit-button\">Learn More</a>");
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
			get_blogs: function() {
				var m_blogs = [];

				$('script').each(function() {
					if ($(this).html().indexOf('require(\'context\').bootloader') >= 0) {

						var script_src = $(this).html();

						// This is quite hacky but quite frankly I don't give a fuck anymore.

						script_src = script_src.replace('require(\'context\').bootloader(', '');
						script_src = script_src.substring(0, script_src.length - 2);

						var obj = JSON.parse(script_src);
						var channels = obj.Context.userinfo.channels;

						for (var item in channels) {
							m_blogs.push(channels[item].name);
						}

						XKit.tools.set_setting('xkit_cached_blogs', m_blogs.join(';'));
						return m_blogs;
					}
				});

				var popoverBlogs = $('#popover_blogs');
				if (popoverBlogs && popoverBlogs.length > 0) {
					$('#popover_blogs > .popover_inner').children('.item')
						.not(':last-child').each(function() {
							var mX = $(this).attr('id');
							mX = mX.substring(9, mX.length);
							m_blogs.push(mX);
						});
					XKit.tools.set_setting('xkit_cached_blogs', m_blogs.join(';'));
					return m_blogs;
				} else {
					var cachedBlogs = XKit.tools.get_setting('xkit_cached_blogs', '');
					if (cachedBlogs !== '') {
						return cachedBlogs.split(';');
					}
				}
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
					XKit.console.add("Can not save " + setting_name + ": " + e.message);
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
			add_function: function(func, exec, addt) {
				try {
					var script = document.createElement("script");
					addt = addt.replace(/(\r\n|\n|\r)/gm, "");
					script.textContent = "var add_tag = '" + addt + "';";
					script.textContent = script.textContent + (exec ? "(" : "") + func.toString() + (exec ? ")();" : "");
					document.body.appendChild(script);
				} catch (e) { alert(e.message); }
			}
		},
		post_listener: {
			callbacks: [],
			callback_ids: [],
			count: 0,
			add: function(id, func) {
				XKit.post_listener.callbacks.push(func);
				XKit.post_listener.callback_ids.push(id);
			},
			remove: function(id) {
				var m_id = XKit.post_listener.callback_ids.indexOf(id);
				if (m_id !== -1) {
					XKit.post_listener.callback_ids.splice(m_id, 1);
					XKit.post_listener.callbacks.splice(m_id, 1);
				}
			},
			check: function() {
				if ($("#posts").length === 0) {
					return;
				}
				var post_count = $("#posts > .post").length;
				if (XKit.post_listener.count === 0) {
					XKit.post_listener.count = post_count;
				} else {
					if (post_count !== XKit.post_listener.count) {
						XKit.post_listener.count = post_count;
						XKit.post_listener.run_callbacks();
					}
				}
				setTimeout(XKit.post_listener.check, 3500);

			},
			run_callbacks: function() {
				if (XKit.post_listener.callbacks.length === 0) {
					return;
				}
				for (var i = 0; i < XKit.post_listener.callbacks.length; i++) {
					try {
						XKit.post_listener.callbacks[i]();
					} catch (e) {
						console.log("Can not call callback with id " + XKit.post_listener.callback_ids[i] + ": " + e.message);
					}
				}
			}
		},
		special: {

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
					XKit.console.add("Shutting down " + ext + "...");
					XKit.tools.remove_css(ext);
					XKit.extensions[ext].destroy();
				} catch (e) {
					XKit.console.add("Can not shut down " + ext + ".");
					continue;
				}

			}

		}
	};
}());


function xerror(message) {
	XKit.console.add(message);
	alert("XKit Error:\n" + message + "\n\nPlease refresh the page and try again or file a bug report at xkit.info.");
}

var centerIt = function(el /* (jQuery element) Element to center */) {
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
				eval(xhr.responseText + "\n//# sourceURL=xkit/editor.js");
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
	XKit.console.add("Storage Free space: " + free_zone + " bytes");
	if (free_zone <= 2048) {
		XKit.window.show("Running out of space", "Your browser reported that XKit has less than 2048 bytes available for storage. Please remove any unused extensions or try resetting XKit. If it completely runs out of space, you might encounter errors or XKit might not be able to boot up.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a>");
	}

}

function install_extension(mdata, callback) {

	try {

		if (mdata.errors || !mdata.script) {
			// Server returned an error or empty script.
			XKit.console.add("install_extension failed: Empty script or errors.");
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
		XKit.console.add("install_extension failed: " + e.message);

	}

}

function xkit_install() {

	XKit.window.show("Welcome to XKit " + framework_version + "!", "<b>Please wait while I initialize the setup. This might take a while.<br/>Please do not navigate away from this page.</b>", "info");
	XKit.console.add("Trying to retrieve XKit Installer.");

	XKit.install("xkit_installer", function(mdata) {
		if (mdata.errors) {
			if (mdata.storage_error === true) {
				show_error_installation("[Code: 401] Storage error:" + mdata.error);
			} else {
				if (mdata.server_down === true) {
					show_error_installation("[Code: 101] Can't reach XKit servers");
				} else {
					show_error_installation("[Code: 100] Server returned error/empty script");
				}
			}
			return;
		}

		try {
			eval(mdata.script + "\n//# sourceURL=xkit/xkit_installer.js");
			XKit.extensions.xkit_installer.run();
		} catch (e) {
			show_error_installation("[Code: 102]" + e.message);
		}

	});


}

function show_error_installation(message) {
	// Shortcut to call when there is an installation error.
	XKit.window.show("Can not install XKit", "<b>Generated Error message:</b><br/><p>" + message + "</p>Write down the error message above and click on the Troubleshooting Help button to see how you can fix this or reload the page to try again.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
}

function show_error_script(message) {
	// Shortcut to call when there is a javascript error.
	XKit.window.show("XKit ran into a scripting error.", "<b>Generated Error message:</b><br/><p>" + message + "</p>Write down the error message above and click on the Troubleshooting Help button to see how you can fix this or reload the page to try again.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
}

function show_error_reset(message) {
	// Shortcut to call when there is a javascript error.
	XKit.window.show("XKit ran into an error.", "<b>Generated Error message:</b><br/><p>" + message + "</p>It is recommended that you reset XKit. Alternatively, you can write down the error message above and click on the Troubleshooting Help button to see how you can fix this or reload the page to try again.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
}

function show_error_update(message) {
	// Shortcut to call when there is a javascript error.
	XKit.window.show("XKit ran into an error.", "<b>Generated Error message:</b><br/><p>" + message + "</p>You might need to update XKit manually. Please visit XKit Blog. Alternatively, you can write down the error message above and click on the Troubleshooting Help button to see how you can fix this or reload the page to try again.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://new-xkit-extension.tumblr.com\" class=\"xkit-button\">Go to XKit Blog</a><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
}
