//* TITLE XCloud **//
//* VERSION 1.1.1 **//
//* DESCRIPTION Sync XKit data on clouds **//
//* DETAILS XCloud stores your XKit configuration on New-XKit servers so you can back up your data and synchronize it with other computers and browsers easily. Also compatable with STUDIOXENIX servers.**//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.xcloud = new Object({

	running: false,
	username: "",
	password: "",
	useoldserver: true,
	gallery_available: {},
	extensions_upgraded: false,


	get_xcloud_url: function() {
		if (XKit.extensions.xcloud.useoldserver) {
			return "https://uyjv93kxna.execute-api.us-west-2.amazonaws.com/production";
		} else {
			return "https://cloud.new-xkit.com";
		}
	},

	run: function() {
		this.running = true;

		XKit.tools.init_css("xcloud");
		this.load_user_login();
		$("#xkit-cp-tab-xcloud").css("display", "block");
	},

	reload_welcome_panel: function() {

		$("#xcloud-welcome-panel").remove();
		$("#xcloud-panel-right").append(XKit.extensions.xcloud.return_panel_welcome(true));


	},

	return_panel_welcome: function(is_reloading) {

		var m_html = "";

		var m_class = "current";
		if (is_reloading) {
			m_class = "previous forced";
		}

		if (XKit.extensions.xcloud.username === "") {
			XKit.extensions.xcloud.useoldserver = false;
			m_html =	"<div class=\"xcloud-panel logged_out " + m_class + "\" id=\"xcloud-welcome-panel\">" +
							"<div class=\"xcloud-title\" style=\"margin-top: 60px;\">Welcome to XCloud!</div>" +
							"<div class=\"xcloud-information\">" +
								"XCloud lets you synchronize your XKit data such as your blacklisted words " +
								"and posts, and your preferences across computers and browsers using XKit servers." +
								'<hr> <input type="checkbox" class="xkit-checkbox" id="xcloud-use-old" /> Check to use the old XCloud servers' +
							"</div>" +
							"<div class=\"xcloud-welcome-buttons\">" +
								"<div class=\"xcloud-welcome-button\" id=\"xcloud-login\">Sign In</div>" +
								"<div class=\"xcloud-welcome-button\" id=\"xcloud-signup\">Create Account</div>" +
							"</div>" +
						"</div>";

		} else {

			m_html =	"<div class=\"xcloud-panel logged_in " + m_class + "\" id=\"xcloud-welcome-panel\">" +
							"<div class=\"xcloud-title\" style=\"margin-top: 60px;\">Welcome, " + XKit.extensions.xcloud.username + "!</div>" +
							"<div class=\"xcloud-information\">" +
								"Click <b>Sync</b> to upload your XKit settings to your XCloud.<br/>" +
								"Click <b>Restore</b> to restore your settings stored on your XCloud.<br/>" +
							"</div>" +
							"<div class=\"xcloud-welcome-buttons\">" +
								"<div class=\"xcloud-welcome-button\" id=\"xcloud-upload\">Sync</div>" +
								"<div class=\"xcloud-welcome-button\" id=\"xcloud-restore\">Restore</div>" +
								"<div class=\"xcloud-welcome-button\" id=\"xcloud-logout\">Logout</div>" +
							"</div>" +
						"</div>";

		}

		return m_html;

	},

	return_panel_upload: function() {

		var m_html = "";

		m_html =	"<div class=\"xcloud-title\" style=\"margin-top: 25px;\">Synchronize</div>" +
					"<div class=\"xcloud-information\">" +
						"<b>Replace your XCloud data with your current XKit configuration.</b><br/> " +
						"Depending on your internet connection and the amount of extensions you have installed, this might take several minutes. It is highly recommended that you close other Tumblr tabs and not navigate away from this page." +
					"</div>" +
					"<div id=\"xcloud-upload-do\" class=\"xcloud-inline-button xkit-button default\">Continue</div>" +
					"<div id=\"xcloud-signup-cancel\" class=\"xcloud-inline-button xkit-button\">Cancel</div>" +
					"</div>";

		return m_html;

	},

	return_panel_restore: function() {

		var m_html = "";

		m_html =	"<div class=\"xcloud-title\" style=\"margin-top: 25px;\">Restore</div>" +
					"<div class=\"xcloud-information\">" +
						"<b>Replace your XKit configuration with the one on XCloud.</b><br/> " +
						"Depending on your internet connection and the amount of extensions you have installed, this might take several minutes. It is highly recommended that you close other Tumblr tabs and not navigate away from this page." +
					"</div>" +
					"<div id=\"xcloud-restore-do\" class=\"xcloud-inline-button xkit-button default\">Continue</div>" +
					"<div id=\"xcloud-signup-cancel\" class=\"xcloud-inline-button xkit-button\">Cancel</div>" +
					"</div>";

		return m_html;

	},

	return_panel_signup: function() {

		var m_html = "";

		m_html =	"<div class=\"xcloud-title\" style=\"margin-top: 15px;\">Sign up</div>" +
					"XCloud is free of charge and only needs a username and password." +
					"<input type=\"text\" id=\"xcloud-login-username\" placeholder=\"Your username - doesn't need to be your URL\" />" +
					"<input type=\"password\" id=\"xcloud-login-password\" placeholder=\"Your password - minimum 6 characters\" />" +
					"<div id=\"xcloud-signup-do\" class=\"xcloud-inline-button xkit-button default\">Sign up!</div>" +
					"<div id=\"xcloud-signup-cancel\" class=\"xcloud-inline-button xkit-button\">Cancel</div>" +
					"</div>";

		return m_html;

	},

	return_panel_login: function() {

		var m_html = "";

		m_html =	"<div class=\"xcloud-title\" style=\"margin-top: 15px;\">Sign In</div>" +
					"Sign in to XCloud to restore/upload your XKit configuration." +
					"<input type=\"text\" id=\"xcloud-login-username\" placeholder=\"Username\" />" +
					"<input type=\"password\" id=\"xcloud-login-password\" placeholder=\"Password\" />" +
					"<div id=\"xcloud-login-do\" class=\"xcloud-inline-button xkit-button default\">Sign in</div>" +
					"<div id=\"xcloud-login-cancel\" class=\"xcloud-inline-button xkit-button\">Cancel</div>" +
					"</div>";

		return m_html;

	},

	panel: function() {

		var m_html = "<div id=\"xcloud-panel\"><div id=\"xcloud-beta-tag\">&nbsp;</div>" +
					"<div id=\"xcloud-panel-right\">" + XKit.extensions.xcloud.return_panel_welcome() +
					"</div>" +
					'<div id="xcloud-panel-left"><div id="xcloud-local-datastore"><span style="color: whitesmoke; font-weight: bold;">Local Backup</span><br>' +
						'<div id="xcloud-local-export" class="xcloud-local-button">Export</div><br>' +
						'<div id="xcloud-local-import" class="xcloud-local-button">Import</div>' +
					'</div></div>' +
					"</div>";
		return m_html;

	},

	working_on: function() {

		$("#xcloud-panel-working").remove();
		$("#xcloud-panel-right").append("<div id=\"xcloud-panel-working\">Please wait...</div>");

	},

	working_off: function() {

		$("#xcloud-panel-working").remove();

	},

	panel_appended: function() {
		var xcloud_url = this.get_xcloud_url();
		var self = this;

		var exportPanel = $("#xcloud-local-export");
		exportPanel.unbind("click");
		exportPanel.bind("click", function() {
			self.local_export();
		});

		var importPanel = $("#xcloud-local-import");
		importPanel.unbind("click");
		importPanel.bind("click", function() {
			self.local_import();
		});

		$("#xcloud-use-old").unbind('change');
		$("#xcloud-use-old").bind('change', function() {
			XKit.extensions.xcloud.useoldserver = $(this).is(':checked');
		});

		$("#xcloud-login").unbind("click");
		$("#xcloud-login").bind("click", function() {

			XKit.extensions.xcloud.change_panel(XKit.extensions.xcloud.return_panel_login());

		});


		$("#xcloud-signup-do").unbind("click");
		$("#xcloud-signup-do").bind("click", function() {

			var m_username = $("#xcloud-login-username").val();
			var m_password = XKit.extensions.xcloud.md5($("#xcloud-login-password").val());

			if ($.trim(m_username) === "" || $.trim($("#xcloud-login-password").val()) === "") {
				XKit.window.show("Hey there!", "Please enter a username and password.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;
			}

			if ($("#xcloud-login-password").val().length <= 5) {
				XKit.window.show("Hey there!", "Please enter a password that is at least 6 characters long.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;
			}

			XKit.extensions.xcloud.working_on();

			var registerRequest = {
				url: xcloud_url + "/xcloud/register",

				onerror: function() {

					XKit.extensions.xcloud.hide_overlay();
					XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1003<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					return;

				},
				onload: function(response) {
					XKit.extensions.xcloud.working_off();

					var mdata = null;
					try {
						mdata = jQuery.parseJSON(response.responseText);
					} catch (e) {
						XKit.extensions.xcloud.hide_overlay();
						XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1001<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
						return;
					}

					if (mdata.server_down) {
						XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
						return;
					}

					if (mdata.errors === "false") {

						XKit.extensions.xcloud.username = m_username;
						XKit.extensions.xcloud.password = m_password;
						XKit.extensions.xcloud.save_user_login();
						XKit.extensions.xcloud.reload_welcome_panel();
						XKit.extensions.xcloud.change_panel("<div class=\"xcloud-title\" style=\"margin-top: 75px;\">Horray!</div>XCloud account created successfully. <div id=\"xcloud-start-using\" class=\"xcloud-inline-button xkit-button default\">Start using XCloud</div>");

					} else {

						var err_desc = "";
						var err_title = "";
						if (mdata.error_code === "102") {
							err_desc = "<br/>Usernames can only have letters and numbers.";
							err_title = "Invalid Username";
						}
						if (mdata.error_code === "202") {
							err_desc = "<br/>Please enter a password.";
							err_title = "No Password";
						}
						if (mdata.error_code === "100") {
							err_desc = "<br/>Please pick another username.";
							err_title = "Username Taken";
						}

						XKit.window.show("Unable to sign up", "<b>" + err_title + "</b> (code: " + mdata.error_code + ")" + err_desc, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
						return;

					}
				}
			};

			if (XKit.extensions.xcloud.useoldserver) {
				registerRequest.method = "GET";
				registerRequest.url += "?username=" + m_username + "&password=" + m_password;
				registerRequest.json = false;
			} else {
				registerRequest.method = "POST";
				registerRequest.json = true;
				registerRequest.data = JSON.stringify({"username":  m_username, "password": m_password});
			}

			GM_xmlhttpRequest(registerRequest);

		});

		$("#xcloud-login-do").unbind("click");
		$("#xcloud-login-do").bind("click", function() {

			var m_username = $("#xcloud-login-username").val();
			var m_password = XKit.extensions.xcloud.md5($("#xcloud-login-password").val());

			if ($.trim(m_username) === "" || $.trim($("#xcloud-login-password").val()) === "") {
				XKit.window.show("Hey there!", "Please enter a username and password.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;
			}

			if ($("#xcloud-login-password").val().length <= 5) {
				XKit.window.show("Hey there!", "Please enter a password that is at least 6 characters long.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;
			}

			XKit.extensions.xcloud.working_on();

			var authorizationRequest = {
				method: "GET",
				json: false,
				url: xcloud_url + "/xcloud/auth",
				onerror: function() {

					XKit.extensions.xcloud.hide_overlay();
					XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1003<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					return;

				},
				onload: function(response) {



					XKit.extensions.xcloud.working_off();

					var mdata = null;
					try {
						mdata = jQuery.parseJSON(response.responseText);
					} catch (e) {
						XKit.extensions.xcloud.hide_overlay();
						XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1001<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
						return;
					}

					if (mdata.server_down) {
						XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
						return;
					}

					if (mdata.errors === "false") {

						XKit.extensions.xcloud.username = m_username;
						XKit.extensions.xcloud.password = m_password;
						XKit.extensions.xcloud.save_user_login();
						XKit.extensions.xcloud.reload_welcome_panel();
						XKit.extensions.xcloud.change_panel("<div class=\"xcloud-title\" style=\"margin-top: 75px;\">Horray!</div>Signed in successfully.<div id=\"xcloud-start-using\" class=\"xcloud-inline-button xkit-button default\">Start using XCloud</div>");

					} else {

						var err_desc = "";
						var err_title = "";
						if (mdata.error_code === "102") {
							err_desc = "<br/>Usernames can only have letters and numbers.";
							err_title = "Invalid Username";
						}
						if (mdata.error_code === "202") {
							err_desc = "<br/>Please enter a password.";
							err_title = "No Password";
						}
						if (mdata.error_code === "100") {
							err_desc = "<br/>Please pick another username.";
							err_title = "Username taken.";
						}
						if (mdata.error_code === "400") {
							err_desc = "<br/>Please check your username and try again.";
							err_title = "Invalid Username";
						}
						if (mdata.error_code === "602") {
							err_desc = "<br/>Please check your password and try again.<br/>If you have changed your password, you might need to log out of XCloud and sign back in.";
							err_title = "Wrong Password";
						}

						XKit.window.show("Unable to sign in", "<b>" + err_title + "</b> (code: " + mdata.error_code + ")" + err_desc, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
						return;

					}
				}
			};

			if (XKit.extensions.xcloud.useoldserver) {
				authorizationRequest.url += "?username=" + m_username + "&password=" + m_password;
			} else {
				authorizationRequest.headers = {"Authorization": "Basic " + btoa(m_username + ":" + m_password), "Content-Type": "application/json" };
				authorizationRequest.json = true;
			}

			GM_xmlhttpRequest(authorizationRequest);

		});

		$("#xcloud-signup").unbind("click");
		$("#xcloud-signup").bind("click", function() {

			XKit.extensions.xcloud.change_panel(XKit.extensions.xcloud.return_panel_signup());

		});

		$("#xcloud-start-using").unbind("click");
		$("#xcloud-start-using").bind("click", function() {

			XKit.extensions.xcloud.change_panel_back();

		});

		$("#xcloud-login-cancel, #xcloud-signup-cancel").unbind("click");
		$("#xcloud-login-cancel, #xcloud-signup-cancel").bind("click", function() {

			XKit.extensions.xcloud.change_panel_back();

		});

		$("#xcloud-logout").unbind("click");
		$("#xcloud-logout").bind("click", function() {

			XKit.extensions.xcloud.change_panel("<div class=\"xcloud-title\" style=\"margin-top: 60px;\">Sign out?</div>You sure you want to log out of XCloud?<div id=\"xcloud-logout-confirm\" class=\"xcloud-inline-button xkit-button default\">Yes, sign me out.</div><div id=\"xcloud-signup-cancel\" class=\"xcloud-inline-button xkit-button\">Cancel</div>");

		});

		$("#xcloud-logout-confirm").unbind("click");
		$("#xcloud-logout-confirm").bind("click", function() {

			XKit.extensions.xcloud.username = "";
			XKit.extensions.xcloud.password = "";
			XKit.extensions.xcloud.save_user_login();
			XKit.extensions.xcloud.reload_welcome_panel();
			XKit.extensions.xcloud.change_panel("<div class=\"xcloud-title\" style=\"margin-top: 82px;\">Signed out</div>Signed out of XCloud.<div id=\"xcloud-start-using\" class=\"xcloud-inline-button xkit-button default\">Go back</div>");

		});

		$("#xcloud-upload").unbind("click");
		$("#xcloud-upload").bind("click", function() {

			XKit.extensions.xcloud.change_panel(XKit.extensions.xcloud.return_panel_upload());

		});

		$("#xcloud-restore").unbind("click");
		$("#xcloud-restore").bind("click", function() {

			XKit.extensions.xcloud.change_panel(XKit.extensions.xcloud.return_panel_restore());

		});

		$("#xcloud-upload-do").unbind("click");
		$("#xcloud-upload-do").bind("click", function() {

			XKit.extensions.xcloud.start_upload();

		});

		$("#xcloud-restore-do").unbind("click");
		$("#xcloud-restore-do").bind("click", function() {

			XKit.extensions.xcloud.start_fetch();

		});

	},

	local_export: function() {
		var upload_data = this.create_export_data(false)[0];
		var data_blob = new Blob([upload_data], {type: "text/plain"});


		var dummyLink = document.createElement("a");
		document.body.appendChild(dummyLink);
		dummyLink.style = "display: none";

		var fileName = "xcloud_payload.txt";
		var url = window.URL.createObjectURL(data_blob);
		dummyLink.href = url;
		dummyLink.download = fileName;
		dummyLink.click();

		setTimeout(function() {
			window.URL.revokeObjectURL(url);
			XKit.extensions.xcloud.hide_overlay();
		}, 100);

	},

	local_import: function() {
		var self = this;
		var element = document.createElement('input');
		element.setAttribute('type', 'file');
		element.addEventListener("change", function() {
			XKit.extensions.xcloud.show_overlay(true);
			if (this.files.length === 1) {
				var reader  = new FileReader();
				reader.addEventListener('loadend', function(result) {
					self.process_restore({"data":result.currentTarget.result});
				});
				reader.readAsText(this.files[0]);
			}

		}, false);
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	},


	show_overlay: function(fetch_mode) {

		$("#xcloud-overlay-background").remove();
		$("#xcloud-overlay").remove();

		if (fetch_mode) {

			$("body").append(	"<div id=\"xcloud-overlay-background\">&nbsp;</div>" +
								"<div id=\"xcloud-overlay\">" +
									"<div id=\"xcloud-img-working-fetch\" class=\"xcloud-working-imagery\">&nbsp;</div>" +
									"<div id=\"xcloud-overlay-text\">" +
										"<div id=\"xcloud-overlay-title\">Receiving transmission</div>" +
										"<div id=\"xcloud-overlay-message\">Do not navigate away from this page</div>" +
									"</div>" +
								"</div>");

		} else {

			$("body").append(	"<div id=\"xcloud-overlay-background\">&nbsp;</div>" +
								"<div id=\"xcloud-overlay\">" +
									"<div id=\"xcloud-img-working\" class=\"xcloud-working-imagery\">&nbsp;</div>" +
									"<div id=\"xcloud-overlay-text\">" +
										"<div id=\"xcloud-overlay-title\">Transmitting to Mothership</div>" +
										"<div id=\"xcloud-overlay-message\">Do not navigate away from this page</div>" +
									"</div>" +
								"</div>");

		}

		$("#xcloud-overlay-background").animate({ opacity: 1 }, 400);
		$("#xcloud-overlay").fadeIn('slow');

	},

	hide_overlay: function() {

		$("#xcloud-overlay-background").fadeOut('fast');
		$("#xcloud-overlay").fadeOut('slow', function() { $(this).remove(); $("#xcloud-overlay-background").remove(); });

	},

	start_fetch: function() {
		var xcloud_url = this.get_xcloud_url();
		XKit.extensions.xcloud.show_overlay(true);

		var m_username = XKit.extensions.xcloud.username;
		var m_password = XKit.extensions.xcloud.password;

		var fetchRequest = {
			method: "GET",
			url: xcloud_url + "/xcloud/fetch",
			json: false,
			onerror: function() {

				XKit.extensions.xcloud.hide_overlay();
				XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1003<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;

			},
			onload: function(response) {

				var data = jQuery.parseJSON(response.responseText);
				if (data.server_down) {
					XKit.extensions.xcloud.hide_overlay();
					XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					return;
				}

				if (data.errors === "false") {
					XKit.extensions.xcloud.process_restore(data);

				} else {

					XKit.extensions.xcloud.hide_overlay();
					var err_desc = "";
					if (data.error_code === "102") {
						err_desc = "<br/>Usernames can only have letters and numbers.";
					}
					if (data.error_code === "202") {
						err_desc = "<br/>Please enter a password.";
					}
					if (data.error_code === "100") {
						err_desc = "<br/>Please pick another username.";
					}
					if (data.error_code === "800") {
						err_desc = "<br/>Click Sync from XCloud menu to synchronize your data with XCloud servers before restoring.";
					}

					XKit.extensions.xcloud.change_panel_back();
					XKit.window.show("Unable to restore", "<b>" + data.error_str + "</b> (code: " + data.error_code + ")" + err_desc, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

				}
			}
		};

		if (XKit.extensions.xcloud.useoldserver) {
			fetchRequest.url += "?username=" + m_username + "&password=" + m_password;
		} else {
			fetchRequest.headers = {"Authorization": "Basic " + btoa(m_username + ":" + m_password), "Content-Type": "application/json" };
			fetchRequest.json = true;
		}


		GM_xmlhttpRequest(fetchRequest);

	},

	extensions_to_download: [],
	extensions_to_download_enabled: [],
	extensions_to_download_count: 0,
	errors_list: [],

	process_restore: function(mdata) {

		var m_obj = null;
		try {
			mdata.data = mdata.data.substring(3, mdata.data.length - 3);
			m_obj = JSON.parse(XKit.extensions.xcloud.base64_decode(mdata.data));
		} catch (e) {
			XKit.extensions.xcloud.process_error("Unable to parse JSON");
			this.hide_overlay();
			return;
		}



		if (m_obj.identifier !== "XCLOUD") {
			XKit.extensions.xcloud.process_error("Invalid Identifier");
			this.hide_overlay();
			return;
		}

		$("#xcloud-overlay-title").html("Restoring settings...");

		XKit.extensions.xcloud.errors_list = [];
		XKit.extensions.xcloud.extensions_to_download = [];
		XKit.extensions.xcloud.extensions_to_download_enabled = [];
		XKit.extensions.xcloud.extensions_to_download_count = 0;

		var m_installed = XKit.installed.list();
		var full_list = [];

		for (var ext in m_obj.settings) {

			var mext = m_obj.settings[ext];

			var extension_name = mext.extension;

			XKit.console.add("Restoring settings of " + extension_name);

			var extension_settings = {};
			try {
				//Check if the payloads is using utf8.
				if (m_obj.use_utf8) {
					extension_settings = JSON.parse(XKit.extensions.xcloud.b64_to_utf8(mext.preferences));
				} else {
					extension_settings = JSON.parse(XKit.extensions.xcloud.base64_decode(mext.preferences));
				}
			} catch (e) {
				XKit.extensions.xcloud.errors_list.push("Unable to restore settings of " + extension_name);
			}
			var extension_enabled = mext.enabled;

			var install_this = false;

			if (m_installed.indexOf(extension_name) == -1) {
				install_this = true;
			}

			if (install_this) {
				XKit.console.add(" |-- Need to install " + extension_name);
				XKit.extensions.xcloud.extensions_to_download.push(extension_name);
				XKit.extensions.xcloud.extensions_to_download_enabled.push(extension_enabled);
			} else {
				XKit.console.add(" |-- Skipping " + extension_name + ", already installed.");
			}

			full_list.push(extension_name);


			if (extension_name !== "xcloud") {
				XKit.tools.set_setting("xkit_extension_storage__" + extension_name, JSON.stringify(extension_settings));
			}

		}

		for (var i = 0; i < m_installed.length; i++) {

			if (m_installed[i].substring(0, 5) === "xkit_") { continue; }
			if (full_list.indexOf(m_installed[i]) == -1) {

				XKit.installed.remove(m_installed[i]);
				XKit.storage.clear(m_installed[i]);
				XKit.console.add("Removed " + m_installed[i]);

			}

		}



		$("#xcloud-overlay-title").html("Restoring extensions...");
		$("#xcloud-overlay-message").html(XKit.progress.add("xcloud-restore-process"));


		//Grab the gallery to check available extensions.
		//We want to exclude unavailable extensions since the install script will make the whole thing partially succeed.
		// Also to make this backwards compatible we need to use the page function which will go to xkitcs.com for XKit 7.5 and gh_pages for New-XKit
		XKit.download.page('gallery.php', function(gallery_json) {
			if (gallery_json.errors) {
				XKit.extensions.xcloud.hide_overlay();
				XKit.window.show("Could not restore", "Couldn't download extension data from the XKit servers.<br/><br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			} else {
				XKit.extensions.xcloud.extensions_upgraded = false;

				var extension_array = [];
				$.each(gallery_json.extensions, function(index, value) {
					extension_array.push(value.name);
				});

				XKit.extensions.xcloud.gallery_available = extension_array;
				XKit.extensions.xcloud.process_download_extension_next();
			}
		});



	},

	process_download_extension_next: function() {

		if (XKit.extensions.xcloud.extensions_to_download_count >= XKit.extensions.xcloud.extensions_to_download.length) {
			XKit.extensions.xcloud.process_complete();
			return;
		}

		var perc = Math.round((XKit.extensions.xcloud.extensions_to_download_count * 100) / XKit.extensions.xcloud.extensions_to_download.length);

		var m_name = XKit.extensions.xcloud.extensions_to_download[XKit.extensions.xcloud.extensions_to_download_count];

		XKit.progress.value("xcloud-restore-process", perc);

		if ($.inArray(m_name, XKit.extensions.xcloud.gallery_available) >= 0) {
			XKit.console.add("XCloud restore -> " + m_name);
			XKit.install(m_name, function(mdata) {
				if (mdata.server_down || mdata.errors) {
					XKit.extensions.xcloud.errors_list.push("Unable to restore extension " + m_name);
				} else if (XKit.extensions.xcloud.extensions_to_download_enabled[XKit.extensions.xcloud.extensions_to_download_count] === false) {
					XKit.installed.disable(XKit.extensions.xcloud.extensions_to_download[XKit.extensions.xcloud.extensions_to_download_count]);
				}

				XKit.extensions.xcloud.extensions_to_download_count++;
				XKit.extensions.xcloud.process_download_extension_next();
			});
		} else {
			XKit.console.add("XCloud skip -> " + m_name);
			XKit.extensions.xcloud.extensions_upgraded = true;
			XKit.extensions.xcloud.extensions_to_download_count++;
			XKit.extensions.xcloud.process_download_extension_next();
		}




	},

	process_complete: function() {

		var message = "";

		if (XKit.extensions.xcloud.extensions_upgraded) {
			message = "<b>XCloud successfully restored your settings and your XKit configuration has been synced with our servers.</b><br/>Please refresh the page to continue.";
		} else {
			message = "<b>XCloud successfully restored your settings.</b><br/>Please refresh the page to continue.";
		}

		XKit.extensions.xkit_preferences.close();
		XKit.extensions.xcloud.hide_overlay();
		XKit.window.show("Restore complete", message, "info");
	},

	process_error: function(txt) {

		XKit.window.show("Could not restore", "Invalid/corrupt XCloud data received.<br/>" + txt + "<br/><br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
	},

	create_export_data: function(limit_data) {

		XKit.extensions.xcloud.show_overlay();

		// Get list of installed extensions:
		var installed = XKit.installed.list();

		var to_send = {};
		to_send.settings = [];

		var skipping = [];
		var skipping_size = [];

		for (var i = 0; i < installed.length; i++) {

			// Skip internal extensions.
			if (installed[i].substring(0, 5) === "xkit_") {
				continue;
			}


			var m_data;

			//XCloud data was being pushed up with user's md5 hash which is kind of a security issue.
			//	Instead we'll just not upload the XCloud extension.  We know the user will have it when they restore.
			if (installed[i] === "xcloud") {
				m_data = this.utf8_to_b64(JSON.stringify({}));
			} else {
				m_data = this.utf8_to_b64(JSON.stringify(XKit.storage.get_all(installed[i])));
			}

			var m_to_add = {};
			m_to_add.extension = installed[i];
			m_to_add.preferences = m_data;
			m_to_add.enabled = XKit.installed.enabled(installed[i]);

			if (limit_data && (m_data.length / 1024 / 1024) >= 1.5) {
				skipping.push(m_to_add.extension);
				skipping_size.push((m_data.length / 1024 / 1024));
			} else {
				to_send.settings.push(m_to_add);
			}

		}


		to_send.identifier = "XCLOUD";

		//Add this flag to the payload so we know we can unescape the payload.
		to_send.use_utf8 = true;


		to_send = JSON.stringify(to_send);
		console.log("Original size = " + (to_send.length / 1024 / 1024) + " megabytes");

		//We need to base64 encode it without utf8 support so it's compatible with the old payload.
		to_send = "XCS" + XKit.extensions.xcloud.base64_encode(to_send) + "XCE";

		return [to_send, skipping];
	},

	start_upload: function() {
		XKit.extensions.xcloud.show_overlay();
		var payload_pair = this.create_export_data(true);
		var to_send = payload_pair[0];
		var skipping = payload_pair[1];

		if ((to_send.length / 1024 / 1024) >= 5) {

			XKit.window.show("Unable to back up data.", "The backup data file is bigger than 5 megabytes, which is the maximum the XCloud servers can handle. Please go to XKit Control Panel > My XKit and select on extensions you don't use and select the setting \"Reset Settings\" to free up data.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			return;

		}

		if (skipping.length > 0) {
			var m_html = "<ol>";
			for (var i = 0; i < skipping.length; i++) {
				m_html += "<li><b>" + XKit.installed.title(skipping[i]) + "</b>";
				// &middot; " + Math.ceil(this.skipping_size[i]) + " MB</li>";
			}
			m_html += "</ol>";
			XKit.window.show("Skipping some extensions", "The following extensions will not be backed up to XCloud because they are storing more than 1.5 megabytes of data, making the backup bigger than XCloud servers can handle." + m_html + "<small style=\"color: rgb(110,110,110);\">If these extensions have data that you can remove, please try removing them and retry the backup process. If you are not using these extensions, click on \"Reset Settings\" button on top-right corner of their control panel to free up space on your computer.</small>", "warning", "<div class=\"xkit-button default\" id=\"xkit-xcloud-backup-skip-continue\">Continue</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");
			$("#xkit-xcloud-backup-skip-continue").click(function() {
				XKit.window.close();
				XKit.extensions.xcloud.send_upload_data(to_send);
			});
		} else {
			XKit.extensions.xcloud.send_upload_data(to_send);
		}


	},

	send_upload_data: function(to_send) {
		var xcloud_url = this.get_xcloud_url();
		var m_username = encodeURIComponent(XKit.extensions.xcloud.username);
		var m_password = encodeURIComponent(XKit.extensions.xcloud.password);

		console.log("Uploading upload object. Size = " + (to_send.length / 1024 / 1024) + " megabytes");

		var uploadRequest = {
			method: "POST",
			url: xcloud_url + "/xcloud/upload/",
			onerror: function() {

				XKit.extensions.xcloud.hide_overlay();
				XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1003<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;

			},
			onload: function(response) {

				var mdata = null;
				try {
					mdata = jQuery.parseJSON(response.responseText);
				} catch (e) {
					XKit.extensions.xcloud.hide_overlay();
					XKit.window.show("Can't connect to server", "XKit was unable to contact XCloud servers.<br/>Error code: 1001<br/>Please try again or <a href=\"http://new-xkit-support.tumblr.com/ask\">send a bug report</a>.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					return;
				}
				if (mdata.errors === "false") {
					XKit.extensions.xcloud.hide_overlay();
					XKit.extensions.xcloud.change_panel("<div class=\"xcloud-title\" style=\"margin-top: 80px;\">All done!</div>Your XKit settings are now in sync with XCloud. <div id=\"xcloud-start-using\" class=\"xcloud-inline-button xkit-button default\">OK</div>");
				} else {
					XKit.extensions.xcloud.hide_overlay();
					var err_desc = "";
					var err_title = "";
					if (mdata.error_code === "102") {
						err_desc = "<br/>Usernames can only have letters and numbers.";
						err_title = "Invalid Username";
					}
					if (mdata.error_code === "202") {
						err_desc = "<br/>Please enter a password.";
						err_title = "No Password";
					}
					if (mdata.error_code === "100") {
						err_desc = "<br/>Please pick another username.";
						err_title = "Username taken.";
					}
					if (mdata.error_code === "400") {
						err_desc = "<br/>Please check your username and try again.";
						err_title = "Invalid Username";
					}
					if (mdata.error_code === "602") {
						err_desc = "<br/>Please check your password and try again.<br/>If you have changed your password, you might need to log out of XCloud and sign back in.";
						err_title = "Wrong Password";
					}

					XKit.window.show("Unable to complete synchronization", "<b>" + err_title + "</b> (code: " + mdata.error_code + ")" + err_desc, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				}
			}
		};


		if (XKit.extensions.xcloud.useoldserver) {
			uploadRequest.data = "username=" + m_username + "&password=" + m_password + "&" + "data=" + to_send;
			uploadRequest.json = false;
		} else {
			uploadRequest.headers = {"Authorization": "Basic " + btoa(m_username + ":" + m_password)};
			uploadRequest.data = JSON.stringify({"data": to_send });
			uploadRequest.json = true;
		}

		GM_xmlhttpRequest(uploadRequest);

	},

	change_panel_back: function() {

		$(".xcloud-panel.current").animate({ left: "100%" }, 450 );


		if ($("#xcloud-welcome-panel").hasClass("forced")) {
			$("#xcloud-welcome-panel").css("left", "-100%");
			$("#xcloud-welcome-panel").removeClass("forced");
		}

		$("#xcloud-welcome-panel").animate({ left: "0" }, 450, function() {
			$(".xcloud-panel.current").remove();
			$("#xcloud-welcome-panel").addClass("current");
			$("#xcloud-welcome-panel").removeClass("previous");
			XKit.extensions.xcloud.panel_appended();
		});

	},

	change_panel: function(html) {

		$("#xcloud-panel-right").append("<div class=\"xcloud-panel next\">" + html + "</div>");

		$(".xcloud-panel.current").animate({ left: "-100%" }, 450);
		$(".xcloud-panel.next").animate({ left: "0" }, 450, function() {
			$(".xcloud-panel.current").addClass("previous");
			$(".xcloud-panel.previous").removeClass("current");
			$(".xcloud-panel.next").addClass("current");
			$(".xcloud-panel.next").removeClass("next");
			XKit.extensions.xcloud.panel_appended();
			$(".xcloud-panel.previous").not("#xcloud-welcome-panel").remove();
		});

	},

	save_user_login: function() {

		XKit.storage.set("xcloud", "username", XKit.extensions.xcloud.username);
		XKit.storage.set("xcloud", "password", "[" + XKit.extensions.xcloud.password + "]");
		XKit.storage.set("xcloud", "useoldserver", XKit.extensions.xcloud.useoldserver + "");

	},

	load_user_login: function() {

		//Unfortunately due to a bug in xkit.js we have to do a get_all instead of just a get.
		var stored_data = XKit.storage.get_all("xcloud");
		XKit.extensions.xcloud.username = stored_data.username && stored_data.username.value ? stored_data.username.value : "";
		XKit.extensions.xcloud.password = stored_data.password && stored_data.password.value ? stored_data.password.value : "";

		//default use old server so users upgrading won't have to relogin.
		XKit.extensions.xcloud.useoldserver = XKit.storage.get("xcloud", "useoldserver", "true") === "true";

		if (XKit.extensions.xcloud.password.substring(0, 1) === "[") {
			if (XKit.extensions.xcloud.password.substring(XKit.extensions.xcloud.password.length - 1) === "]") {
				XKit.extensions.xcloud.password = XKit.extensions.xcloud.password.substring(1, XKit.extensions.xcloud.password.length - 1);
			}
		}

	},

	destroy: function() {
		this.running = false;
	},

	utf8_to_b64: function(str) {
		return this.base64_encode(encodeURI(str));
	},

	b64_to_utf8: function(str) {
		return decodeURI(this.base64_decode(str));
	},


	md5: function(str) {
		/* eslint-disable id-length */

		// http://kevin.vanzonneveld.net
		// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// + namespaced by: Michael White (http://getsprink.com)
		// +    tweaked by: Jack
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// -    depends on: utf8_encode
		// *     example 1: md5('Kevin van Zonneveld');
		// *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
		var xl;

		var rotateLeft = function(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		};

		var addUnsigned = function(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		};

		var _F = function(x, y, z) {
			return (x & y) | ((~x) & z);
		};
		var _G = function(x, y, z) {
			return (x & z) | (y & (~z));
		};
		var _H = function(x, y, z) {
			return (x ^ y ^ z);
		};
		var _I = function(x, y, z) {
			return (y ^ (x | (~z)));
		};

		var _FF = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};

		var _GG = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};

		var _HH = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};

		var _II = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};

		var convertToWordArray = function(word) {
			var lWordCount;
			var lMessageLength = word.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = new Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (word.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		};

		var wordToHex = function(lValue) {
			var wordToHexValue = "",
				wordToHexValue_temp = "",
				lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				wordToHexValue_temp = "0" + lByte.toString(16);
				wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
			}
			return wordToHexValue;
		};

		var x = [],
			k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
			S12 = 12,
			S13 = 17,
			S14 = 22,
			S21 = 5,
			S22 = 9,
			S23 = 14,
			S24 = 20,
			S31 = 4,
			S32 = 11,
			S33 = 16,
			S34 = 23,
			S41 = 6,
			S42 = 10,
			S43 = 15,
			S44 = 21;

		str = XKit.extensions.xcloud.utf8_encode(str);
		x = convertToWordArray(str);
		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;

		xl = x.length;
		for (k = 0; k < xl; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = addUnsigned(a, AA);
			b = addUnsigned(b, BB);
			c = addUnsigned(c, CC);
			d = addUnsigned(d, DD);
		}

		var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

		return temp.toLowerCase();
		/* eslint-enable id-length */
	},

	utf8_encode: function(argString) {
		// http://kevin.vanzonneveld.net
		// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: sowberry
		// +    tweaked by: Jack
		// +   bugfixed by: Onno Marsman
		// +   improved by: Yves Sucaet
		// +   bugfixed by: Onno Marsman
		// +   bugfixed by: Ulrich
		// +   bugfixed by: Rafal Kukawski
		// +   improved by: kirilloid
		// +   bugfixed by: kirilloid
		// *     example 1: utf8_encode('Kevin van Zonneveld');
		// *     returns 1: 'Kevin van Zonneveld'

		if (argString === null || typeof argString === "undefined") {
			return "";
		}

		var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		var utftext = '',
			start, end, stringl = 0;

		start = end = 0;
		stringl = string.length;
		for (var i = 0; i < stringl; i++) {
			var c1 = string.charCodeAt(i);
			var enc = null;

			if (c1 < 128) {
				end++;
			} else if (c1 > 127 && c1 < 2048) {
				enc = String.fromCharCode(
					(c1 >> 6)        | 192,
					( c1        & 63) | 128
				);
			} else if (c1 & 0xF800 != 0xD800) {
				enc = String.fromCharCode(
					(c1 >> 12)       | 224,
					((c1 >> 6)  & 63) | 128,
					( c1        & 63) | 128
				);
			} else { // surrogate pairs
				if (c1 & 0xFC00 != 0xD800) { throw new RangeError("Unmatched trail surrogate at " + i); }
				var c2 = string.charCodeAt(++i);
				if (c2 & 0xFC00 != 0xDC00) { throw new RangeError("Unmatched lead surrogate at " + (i - 1)); }
				c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
				enc = String.fromCharCode(
					(c1 >> 18)       | 240,
					((c1 >> 12) & 63) | 128,
					((c1 >> 6)  & 63) | 128,
					( c1        & 63) | 128
				);
			}
			if (enc !== null) {
				if (end > start) {
					utftext += string.slice(start, end);
				}
				utftext += enc;
				start = end = i + 1;
			}
		}

		if (end > start) {
			utftext += string.slice(start, stringl);
		}

		return utftext;
	},

	base64_encode: function(data) {
		// http://kevin.vanzonneveld.net
		// +   original by: Tyler Akins (http://rumkin.com)
		// +   improved by: Bayron Guevara
		// +   improved by: Thunder.m
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: Pellentesque Malesuada
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: Rafa Kukawski (http://kukawski.pl)
		// *     example 1: base64_encode('Kevin van Zonneveld');
		// *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
		// mozilla has this native
		// - but breaks in 2.0.0.12!
		//if (typeof this.window['btoa'] == 'function') {
		//    return btoa(data);
		//}
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			enc = "",
			tmp_arr = [];

		if (!data) {
			return data;
		}

		do { // pack three octets into four hexets
			o1 = data.charCodeAt(i++);
			o2 = data.charCodeAt(i++);
			o3 = data.charCodeAt(i++);

			bits = o1 << 16 | o2 << 8 | o3;

			h1 = bits >> 18 & 0x3f;
			h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;

			// use hexets to index into b64, and append result to encoded string
			tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
		} while (i < data.length);

		enc = tmp_arr.join('');

		var padding = data.length % 3;

		return (padding ? enc.slice(0, padding - 3) : enc) + '==='.slice(padding || 3);

	},

	base64_decode: function(data) {
		// http://kevin.vanzonneveld.net
		// +   original by: Tyler Akins (http://rumkin.com)
		// +   improved by: Thunder.m
		// +      input by: Aman Gupta
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: Onno Marsman
		// +   bugfixed by: Pellentesque Malesuada
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
		// *     returns 1: 'Kevin van Zonneveld'
		// mozilla has this native
		// - but breaks in 2.0.0.12!
		//if (typeof this.window['atob'] == 'function') {
		//    return atob(data);
		//}
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			dec = "",
			tmp_arr = [];

		if (!data) {
			return data;
		}

		data += '';

		do { // unpack four hexets into three octets using index points in b64
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			if (h3 == 64) {
				tmp_arr[ac++] = String.fromCharCode(o1);
			} else if (h4 == 64) {
				tmp_arr[ac++] = String.fromCharCode(o1, o2);
			} else {
				tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
			}
		} while (i < data.length);

		dec = tmp_arr.join('');

		return dec;
	}

});
