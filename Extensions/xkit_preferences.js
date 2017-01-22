//* TITLE XKit Preferences **//
//* VERSION 7.4.4 **//
//* DESCRIPTION Lets you customize XKit **//
//* DEVELOPER new-xkit **//

XKit.extensions.xkit_preferences = new Object({

	running: false,
	current_panel: "",

	default_extension_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJCMUU3MkZGNEJGMTFFMzg3RDJDMTc0MUZBMDc1NDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJCMUU3MzBGNEJGMTFFMzg3RDJDMTc0MUZBMDc1NDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQkIxRTcyREY0QkYxMUUzODdEMkMxNzQxRkEwNzU0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkIxRTcyRUY0QkYxMUUzODdEMkMxNzQxRkEwNzU0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph1S7d4AAA2gSURBVHja7FpZb2O3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",
	kernel_extension_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJCMUU3MjdGNEJGMTFFMzg3RDJDMTc0MUZBMDc1NDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJCMUU3MjhGNEJGMTFFMzg3RDJDMTc0MUZBMDc1NDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OTQ0Nzk5Q0Y0QjYxMUUzODdEMkMxNzQxRkEwNzU0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkIxRTcyNkY0QkYxMUUzODdEMkMxNzQxRkEwNzU0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrBB3m4AABEISURBVHja1DprcBvH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",

	hide_xcloud_if_not_installed: false,

	showing_help_button: false,

	run: function() {

		console.log(XKit.storage.size("xkit_preferences"));

		this.running = true;

		XKit.tools.init_css("xkit_preferences");

		var holiday_class = ""; var tmp_date = new Date();
		if (tmp_date.getDate() === 31 && tmp_date.getMonth() === 9) {
			holiday_class = " halloween";
		} else if ((tmp_date.getDate() >= 24 && tmp_date.getDate() <= 26) && tmp_date.getMonth() === 11) {
			holiday_class = " christmas";
		}

		var m_html = '<div class="tab iconic' + holiday_class + '" id="new-xkit-control">' +
			'<a style="margin-left: 6px; margin-right: 6px;" class="tab_anchor" href="#">XKit Control Panel</a>' +
			'</div>';

		// mobile stuff
		var mobile_html = '<div class="tab iconic" id="new-xkit-control" style="position: relative; top: 50%; height: 26px; transform: translateY(-50%);">' +
			'<a style="color:transparent;" class="tab_anchor" href="#">XKit</a>' +
			'</div>';

		if (XKit.browser().mobile) {
			XKit.tools.add_css('#xkit-window, #xkit-window-old { max-width: 650px !important; width: 100% !important; max-height: 100%; overflow: scroll; margin: auto 0 !important;} .xkit-window-buttons { padding-top: 0 !important; } .xkit-window-buttons .xkit-button { height: 40px !important; padding: 0 !important; }', 'mobile_window_fix');


			var mobile_control_panel = '#xkit-control-panel { width: 100%; height: 100%; top: 0; left: 0; margin: 0 !important; } ' +
				'#xkit-control-panel-inner { height: calc(100% - 40px); padding: 0; overflow: scroll; } ' +
				'#xkit-control-panel-tabs { display: flex; overflow: scroll; white-space: nowrap; } ' +
				'#xkit-control-panel-tabs div { float: none; white-space: nowrap; } ' +
				'#xkit-extensions-panel-left { height: 100% !important; top: 0; left: 0; } ' +
				'.xkit-extensions-display-type-switcher { bottom: 0; } #xkit-extensions-panel-left-search { left: 0; bottom: 0; } ' +
				'#xkit-extensions-panel-right { height: calc(100% - 40px); width: 100%; } ' +
				'#xkit-extensions-panel-right.xkit-wide-panel { left: 0; width: 100%; } ' +
				'#xkit-extensions-panel-top { min-height: 100px; height: unset; } ' +
				'#xkit-extensions-panel-top .buttons, #xkit-extension-enabled, #xkit-extension-internal-label, #xkit-extensions-panel-top .more-info, #xkit-extensions-panel-top .version, #xkit-extensions-panel-top .title { display: block; position: relative; right: unset; bottom: unset; top: unset; } ' +
				'#xkit-extension-enabled { top: 5px; }' +
				'.xkit-change-ext-setting-checkbox { font-size: 15px !important; bottom: 7px; top: 5px; }  .xkit-change-ext-setting-checkbox b { position: relative; bottom: -3px; } ' +
				'.xkit-extension-setting .checkbox { height: unset !important; min-height: 30px; } ' +
				'.xkit-extension-setting .title { font-size: 15px !important; position: relative !important; } .xkit-extension-setting { padding: 10px 15px 10px 15px !important; } ' +
				'#xkit-gallery-search, #xkit-panel-hide-installed-extensions-from-gallery { position: relative !important; top: unset !important; right: unset !important; } ' +
				'.xkit-gallery-extension { vertical-align: middle; float: unset !important; margin: 0 calc(100% / 175) !important; } '; //This is lazy as sin but it looks better
			XKit.tools.add_css(mobile_control_panel, 'mobile_xkit_menu');
		}

		$(".l-header").find("#logout_button").parent().before(m_html);
		$(".l-header").find("#account_button").before(m_html);
		$(".no-js").removeClass("no-js"); // possibly unnecessary // mobile stuff
		$(".mobile-logo").html(mobile_html); // mobile stuff

		if (XKit.storage.get("xkit_preferences", "shown_welcome_bubble") !== "true" && XKit.interface.where().dashboard) {
			XKit.extensions.xkit_preferences.show_welcome_bubble();
		}

		$("#new-xkit-control").click(function(event) {
			XKit.extensions.xkit_preferences.open();
			return false;
		});

		// Check and deliver initial messages.
		if (XKit.storage.get("xkit_preferences", "initial_mail_sent", "0") === "0") {
			var randomnumber = 1000 + Math.floor(Math.random() * 100000);
			XKit.extensions.xkit_preferences.news.create(91111, "Welcome to XKit!",
				"<h1>Welcome, and thanks for installing XKit 7!</h1> In this panel, you will receive news and updates on XKit 7. " +
				"These include, but not limited to, new features, bug fixes and things you should do if you experience problems with your XKit." +
				"<h2>Learn XKit</h2> Clicking on the My XKit tab will give you a list of all the extensions you have installed. " +
				"You can read their descriptions, and click on <strong>more information</strong> link below their description (if available) " +
				"to learn even more about them and how to use them." +
				"<h2>Customize XKit</h2> Nearly all extensions of XKit has settings that you can customize: from appearance to custom tags, " +
				"you can toggle and change their settings from the My XKit tab." +
				"<h2>Expand XKit</h2> XKit automatically installs some default extensions, but if you want more, you can check the extension " +
				"gallery for more. To do that, just click on the <strong>Get Extensions</strong> tab on the bottom of this window." +
				"<h2>Help XKit</h2> XKit is free of charge, and I'm not making any money off it in any way. " +
				"If you are using XKit for the first time, give it a try for a few days, and if you like it, " +
				"please donate by going to the About tab on this window to support free software. " +
				"You can also help by sharing XKit with your followers and friends, and spreading the word" +
				"<h2>Thanks for reading!</h2> Again, thanks for installing XKit, and I hope you enjoy using it!<br><br>" +
				"<em>Yours faithfully,<br>Xenixlet #" + randomnumber + "<br>Your Personal Xenixlet, XKit Assistant.</em>");
			XKit.storage.set("xkit_preferences", "initial_mail_sent", "1");
		}

		var unread_mail_count = XKit.extensions.xkit_preferences.news.unread_count();
		if (unread_mail_count > 0) {
			// English is a weird language, innit?
			var m_word = "messages";
			var m_word_2 = "them";
			if (unread_mail_count === 1) {
				m_word = "message";
				m_word_2 = "it";
			}

			XKit.notifications.add("<b>Unread messages</b><br/>You have <b>" + unread_mail_count + "</b> new XKit News " + m_word + " in your XKit News inbox. Click here to view " + m_word_2 + ".", "mail", true, function() {
				XKit.extensions.xkit_preferences.open(true);
			});
		}
		XKit.extensions.xkit_preferences.news.update();

		var launch_count = XKit.storage.get("xkit_preferences", "launch_count", "0");
		launch_count++;
		XKit.storage.set("xkit_preferences", "launch_count", launch_count);

		var shown_blogs = XKit.storage.get("xkit_preferences", "shown_blogs_notification", "0");

		if (shown_blogs === "0" && launch_count >= 5) {

			setTimeout(function() {

				var form_key = XKit.interface.form_key();
				if (form_key === "" || typeof form_key === "undefined" || document.location.href.indexOf('/dashboard') === -1) {
					return;
				}

				XKit.window.show("Follow the XKit blog?", "<b>The XKit blog brings you the latest, most up to date news about XKit, " +
					"including new extensions and features, announcements, bug fixes and more.</b><br/><br/>If you would like to follow the " +
					"official XKit blog, just click on the button below, and XKit will do the rest.<br/><br/>" +
					"<small>This message will be displayed only once.</small>", "question",
					'<div id="xkit-follow-blog" class="xkit-button default">Follow the XKit blog</div>' +
					'<div id="xkit-close-message" class="xkit-button">No, thanks.</div>');
				XKit.storage.set("xkit_preferences", "shown_blogs_notification", "1");

				$("#xkit-follow-blog").click(function() {

					$("#xkit-follow-blog").addClass("disabled");
					$("#xkit-close-message").css("display", "none");

					$("#xkit-follow-blog").html("Please wait...");

					var m_data = {"form_key": form_key,
						"data[tumblelog]": "new-xkit-extension",
						"data[source]": "FOLLOW_SOURCE_IFRAME"};

					GM_xmlhttpRequest({
						method: "POST",
						url: "http://www.tumblr.com/svc/follow",
						data: $.param(m_data),
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						json: false,
						onerror: function(response) {
							alert("Well this is embarrassing.\n\nTumblr servers would not allow me to let you follow the XKit blog. " +
								"You can try again later or go to new-xkit-extension.tumblr.com and follow it manually.");
						},
						onload: function(response) {
							// Do nothing?
							XKit.window.close();
						}
					});

				});

			}, 2000);

		}

		XKit.extensions.xkit_preferences.spring_cleaning();

	},

	spring_cleaning_m_list_html: "",

	spring_cleaning: function() {

		var clean_list = ["unreverse", "filter_by_type", "XIM", "yahoo"];

		var removed_list = [];

		var m_list_html = '<ul id="xkit-spring-cleaning-list">';

		for (var i = 0; i < clean_list.length; i++) {

			if (XKit.installed.check(clean_list[i]) === true) {

				removed_list.push(XKit.installed.title(clean_list[i]));
				XKit.installed.remove(clean_list[i]);
				m_list_html = m_list_html + "<li>" + XKit.installed.title(clean_list[i]) + "</li>";

			}

		}

		m_list_html = m_list_html + "</ul>";

		XKit.extensions.xkit_preferences.spring_cleaning_m_list_html = m_list_html;

		if (removed_list.length > 0) {

			XKit.notifications.add("XKit removed <b>" + removed_list.length + "</b> obsolete extension(s). Click here for more information.",
				"warning", true, function() {
					XKit.window.show("Spring Cleaning",
						"Due to them not working correctly anymore, the following obsolete extensions have been removed to speed up your computer:" +
						XKit.extensions.xkit_preferences.spring_cleaning_m_list_html +
						"For more information, including the reason(s) why they were removed, please click the button below.",
						"warning", '<div id="xkit-close-message" class="xkit-button default">OK</div>' +
						'<a href="http://www.xkit.info/notes/spring_cleaning.php" target="_BLANK" class="xkit-button">More information</a>');
				});

		}

	},

	news: {

		update: function() {

			var lst_check = XKit.storage.get("xkit_preferences", "last_news_check", "0");
			if (lst_check === "") { lst_check = 0; }

			var check_for_update = false;
			lst_check = parseInt(lst_check);

			var n_time = new Date();
			var n_ms = parseInt(n_time.getTime());

			if (!lst_check) {
				check_for_update = true;
			} else {
				if (n_ms - lst_check > 22000000 || n_ms - lst_check < -2000000 || lst_check < 0) { // 648000
					check_for_update = true;
				} else {
					check_for_update = false;
				}
			}

			if (parseInt(lst_check) < 0) {
				check_for_update = true;
			}

			// SO!? What shall we do, flips?
			if (check_for_update === true) {
				// yep, we need to check for updates.
				XKit.console.add("Checking for XKit News");
				// set it so we don't have to ram the server.
				var to_save = n_ms.toString();
				XKit.storage.set("xkit_preferences", "last_news_check", to_save);
			} else {
				XKit.console.add("Skipping News update check");
				return;
			}

			XKit.download.page("paperboy/index.php", function(mdata) {

				if (mdata.server_down === true) {
					XKit.window.show("Can't connect to server",
						'XKit was unable to contact the servers in order to download XKit News. ' +
						'You might be using an outdated or buggy version of XKit. ' +
						'Please visit <a href="http://new-xkit-extension.tumblr.com">the unofficial XKit Blog</a> for updates and details.',
						"error", '<div id="xkit-close-message" class="xkit-button default">OK</div>');
					return;
				}

				for (var news_item in mdata.news) {
					// (id, title, message, date)
					mdata.news[news_item].message = XKit.tools.replace_all(mdata.news[news_item].message, "\\\\'", "'");
					mdata.news[news_item].message = XKit.tools.replace_all(mdata.news[news_item].message, "\\\\\"", "\"");
					mdata.news[news_item].title = XKit.tools.replace_all(mdata.news[news_item].title, "\\\\'", "'");
					mdata.news[news_item].title = XKit.tools.replace_all(mdata.news[news_item].title, "\\\\\"", "\"");
					XKit.extensions.xkit_preferences.news.create(mdata.news[news_item].id,
						mdata.news[news_item].title, mdata.news[news_item].message, undefined, mdata.news[news_item].important);
				}

			});

			XKit.download.page("framework_version.php", function(mdata) {

				if (mdata.server_down === true) {
					XKit.window.show("Can't connect to server",
						"XKit was unable to contact the servers in order to download framework version update file. " +
						'You might be using an outdated or buggy version of XKit. ' +
						'Please visit <a href="http://new-xkit-extension.tumblr.com">the unofficial XKit Blog</a> for updates and details.',
						"error", '<div id="xkit-close-message" class="xkit-button default">OK</div>');
					return;
				}

				// This is awful but at least it works.
				var my_version = parseFloat(XKit.tools.replace_all(XKit.version, "\\.", ""));
				var mb_object;
				var new_version;

				if (XKit.browser().firefox === true &&
					typeof XKit.extensions.xkit_preferences.news.return_browser_from_framework_data("firefox", mdata) !== "undefined") {

					mb_object = XKit.extensions.xkit_preferences.news.return_browser_from_framework_data("firefox", mdata);
				}

				if (XKit.browser().safari === true &&
					typeof XKit.extensions.xkit_preferences.news.return_browser_from_framework_data("safari", mdata) !== "undefined") {

					mb_object = XKit.extensions.xkit_preferences.news.return_browser_from_framework_data("safari", mdata);
				}

				new_version = parseFloat(XKit.tools.replace_all(mb_object.version, "\\.", ""));

				if (new_version > my_version) {
					XKit.notifications.add("<b>Please update XKit!</b><br/>A new version of XKit is available for your browser. " +
						"Please click here for more information and how you can easily and quickly update now.", "warning", true, function() {
							XKit.window.show("Please update XKit",
							"<b>A new version of XKit, version " + mb_object.version + " is available.</b><br/>" +
							"You are currently using XKit version " + XKit.version + ".<br/><br/>" +
							"Please update to the latest version as soon as possible. If you don't, XKit might not work properly, " +
							"or might not work at all in the future.<br/><br/>All you have to do is to go to the XKit download page, " +
							"and re-download XKit. XKit will update itself, and all your settings will be preserved.",
							"warning",
							'<a class="xkit-button default" href="https://new-xkit-extension.tumblr.com/downloads">Go to Download page</a>' +
							'<div class="xkit-button" id="xkit-close-message">Not now, remind me later.</div>');
						});
				}
			});
		},

		return_browser_from_framework_data: function(browsername, data) {

			for (var framework in data.frameworks) {
				if (data.frameworks[framework].name === browsername) {
					return data.frameworks[framework];
				}
			}
		},

		unread_count: function() {

			var prev_objects_str = XKit.storage.get("xkit_preferences", "news", "");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch (e) {
				XKit.console.add("Unread_Count failed, unknown/corrupt JSON");
				prev_objects = [];
				XKit.storage.set("xkit_preferences", "news", JSON.stringify(prev_objects));
				return 0;
			}

			var show_all = XKit.tools.get_setting("xkit_show_feature_updates", "true") === "true";

			var m_return = 0;
			for (var i = 0; i < prev_objects.length; i++) {
				console.log(prev_objects[i]);
				if (prev_objects[i].read === false) {
					if (typeof prev_objects[i].important !== "undefined") {
						if (show_all === false && prev_objects[i].important !== "1") {
							continue;
						}
					}
					m_return++;
				}
			}

			return m_return;

		},

		check: function(id) {

			var prev_objects_str = XKit.storage.get("xkit_preferences", "news", "");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch (e) {
				prev_objects = [];
			}

			for (var i = 0; i < prev_objects.length; i++) {

				if (prev_objects[i].id === id) {
					return true;
				}

			}

			return false;

		},

		create: function(id, title, message, date, important) {

			if (XKit.extensions.xkit_preferences.news.check(id) === true) {
				XKit.console.add("News " + id + " could not be pushed: already exists.");
				return;
			}

			if (!date) {
				var foo = new Date(); // Generic JS date object
				var unixtime_ms = foo.getTime(); // Returns milliseconds since the epoch
				date = parseInt(unixtime_ms / 1000);
			}

			var news_object = {};
			news_object.id = id;
			news_object.title = title;
			news_object.message = message;
			news_object.date = date;
			news_object.important = important;
			news_object.read = false;

			var prev_objects_str = XKit.storage.get("xkit_preferences", "news", "");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch (e) {
				prev_objects = [];
			}

			prev_objects.push(news_object);

			var m_result = XKit.storage.set("xkit_preferences", "news", JSON.stringify(prev_objects));
			if (m_result === true) {
				XKit.console.add("News " + id + " pushed successfully.");
			} else {
				console.error("Can not push news_object. Storage might be full.");
			}

		},

		list: function() {

			var prev_objects_str = XKit.storage.get("xkit_preferences", "news", "");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch (e) {
				prev_objects = [];
			}

			if (prev_objects.length === 0) {
				return "";
			}

			var i = prev_objects.length;
			var m_return = "";

			while (i--) {

				var read_class = "unread";
				if (prev_objects[i].read === true) { read_class = "read"; }
				m_return = m_return + '<div data-news-id="' + prev_objects[i].id +
					'" class="xkit-news-item xkit-extension ' + read_class + ' text-only">' +
					'<div class="xkit-mail-icon-' + read_class + '">&nbsp;</div>' + prev_objects[i].title + '</div>';
			}

			return m_return;

		},

		mark_all_as_read: function() {

			var prev_objects_str = XKit.storage.get("xkit_preferences", "news", "");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch (e) {
				prev_objects = [];
			}

			for (var i = 0; i < prev_objects.length; i++) {
				prev_objects[i].read = true;
			}

			XKit.storage.set("xkit_preferences", "news", JSON.stringify(prev_objects));
			console.log("Marked all news as read.");

		},

		open: function(id) {

			var prev_objects_str = XKit.storage.get("xkit_preferences", "news", "");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch (e) {
				prev_objects = [];
			}

			var m_object;

			for (var i = 0; i < prev_objects.length; i++) {
				if (parseInt(prev_objects[i].id) === parseInt(id)) {
					m_object = prev_objects[i];
					prev_objects[i].read = true;
					break;
				}
			}

			if (typeof m_object === "undefined") {
				$("#xkit-extensions-panel-right-inner").html("Could not load message. Please try again later.");
				return;
			}

			var m_html = '<div class="xkit-message-info">' +
				"Received on " + XKit.extensions.xkit_preferences.convert_time(m_object.date) +
				"</div>" +
				'<div class="xkit-message-display">' + m_object.message + "</div>";

			$("#xkit-extensions-panel-right-inner").html(m_html);
			$("#xkit-extensions-panel-right").removeClass("xkit-no-message");
			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

			var m_result = XKit.storage.set("xkit_preferences", "news", JSON.stringify(prev_objects));
			if (m_result === true) {
				XKit.console.add("News " + id + " pushed successfully.");
			} else {
				console.error("Can not save news_object with read flag. Storage might be full.");
			}

		},

		delete: function(id) {


		},

	},

	convert_time: function(UNIX_timestamp) {

		var time = new Date(UNIX_timestamp * 1000);
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var year = time.getFullYear();
		var month = months[time.getMonth()];
		var date = time.getDate();
		var hour = time.getHours();
		var min = time.getMinutes();
		var sec = time.getSeconds();
		if (hour <= 9) { hour = "0" + hour; }
		if (min <= 9) { min = "0" + min; }
		if (sec <= 9) { sec = "0" + sec; }
		var formatted = date + ', ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
		return formatted;

	},

	bubble_tour_mode: false,

	show_welcome_bubble: function() {

		XKit.extensions.xkit_preferences.bubble_tour_mode = true;

		$("body").css("overflow", "hidden");
		$("body").append('<div id="xkit-welcoming-bubble-shadow" class="arrow-top">&nbsp;</div>' +
			'<div id="xkit-welcoming-bubble"><strong>Welcome to XKit! Let\'s get started.</strong><br>' +
			'Click me to customize your XKit and get more extensions.</div>');
		var position = $("#new-xkit-control").offset();

		$("#xkit-welcoming-bubble").css("top", position.top + 50 + "px");
		$("#xkit-welcoming-bubble").css("left", (position.left - ($("#xkit-welcoming-bubble").width() / 2)) + 10 + "px");

		$("#new-xkit-control").css('z-index', '3000');

	},

	scroll_pos: $(window).scrollTop(),

	open: function(open_news) {

		if ($("#xkit-control-panel-shadow").length > 0) {
			$("#xkit-control-panel-shadow").remove();
		}

		if ($("#xkit-control-panel").length > 0) {
			$("#xkit-control-panel").remove();
		}

		var m_html = '<div id="xkit-control-panel">' +
					'<div id="xkit-control-panel-inner"></div>' +
					'<div id="xkit-control-panel-tabs">' +
						'<div id="xkit-cp-tab-my-extensions" class="selected">My XKit</div>' +
						'<div id="xkit-cp-tab-get-extensions">Get Extensions</div>' +
						'<div id="xkit-cp-tab-news">News</div>' +
						'<div id="xkit-cp-tab-xcloud">XCloud</div>' +
						'<div id="xkit-cp-tab-other">Other</div>' +
						'<div id="xkit-cp-tab-about">About + Support</div>' +
						'<div id="xkit-cp-tab-close">&#10006;</div>' +
					'</div>' +
				'</div>' +
				'<div id="xkit-control-panel-shadow">&nbsp;</div>';

		$("body").append(m_html);
		//$('#container').foggy({ blurRadius: 2 });
		$(".l-container").css("opacity", "0.66");
		if (!XKit.browser().mobile) {
			$('#xkit-cp-tab-close').css('display', 'none');
		}

		if (XKit.extensions.xkit_preferences.hide_xcloud_if_not_installed === true) {
			if (XKit.installed.check("xcloud") === false) {
				$("#xkit-cp-tab-xcloud").css("display", "none");
			}
		}

		XKit.extensions.xkit_preferences.current_panel = "";

		$("body").css("overflow", "hidden");
		$("#xkit-control-panel").animate({ marginTop: '-200px', opacity: 1}, 500);
		$("#xkit-control-panel-shadow").fadeIn('slow');
		$("#xkit-control-panel-shadow").click(function() {
			XKit.extensions.xkit_preferences.close();
		});

		if (XKit.extensions.xkit_preferences.bubble_tour_mode === true) {

			XKit.extensions.xkit_preferences.bubble_tour_mode = false;
			$("#xkit-welcoming-bubble").remove();
			$("#xkit-welcoming-bubble-shadow").remove();

			XKit.storage.set("xkit_preferences", "shown_welcome_bubble", "true");

			XKit.window.show("Welcome to the control panel!",
				"<b>This is the My XKit panel.</b><br/>This is where you customize your XKit.<br/>" +
				"You can turn on/off extensions or change their settings here.<br/><br/>" +
				"New extensions are regularly added to the XKit Extension Gallery, " +
				"which you can visit by clicking on the <b>Get Extensions</b> tab on the bottom.", "info",
				'<div class="xkit-button default" id="xkit-tour-continue-1">Continue &rarr;</div>' +
				'<div class="xkit-button xkit-tour-cancel">Cancel Tour</div>');

			$(document).on('click', '.xkit-tour-cancel', function() {

				XKit.window.close();
				XKit.extensions.xkit_preferences.close();

			});

			$("#xkit-tour-continue-1").click(function() {

				XKit.window.show( "Welcome to the control panel!",
					"<strong>This is the News panel.</strong><br>" +
					"Here, important information about XKit is provided to you. " +
					"New extensions, features, bug fixes, status updates and a lot more will be posted here.", "info",
					'<div class="xkit-button default" id="xkit-tour-continue-2">Continue &rarr;</div>' +
					'<div class="xkit-button xkit-tour-cancel">Cancel Tour</div>');

				$("#xkit-cp-tab-news").trigger('click');

				$("#xkit-tour-continue-2").click(function() {

					XKit.window.show("Welcome to the control panel!",
						"<strong>This is the Other panel.</strong><br>" +
						"Here, you can Reset your XKit (deleting all its settings so it can re-install again), " +
						"update all your extensions at once, or if you are feeling nerd-ish, play with some advanced settings.", "info",
						'<div class="xkit-button default" id="xkit-tour-continue-3">Continue &rarr;</div>' +
						'<div class="xkit-button xkit-tour-cancel">Cancel Tour</div>');

					$("#xkit-cp-tab-other").trigger('click');

					$("#xkit-tour-continue-3").click(function() {

						XKit.window.show("Well, that's all.",
							"<strong>This concludes our brief tour together.</strong><br><br>" +
							"You can check out the About + Support tab on the control panel for some helpful links.<br><br>" +
							"I hope you enjoy XKit!", "info", '<div class="xkit-button default xkit-tour-cancel">End Tour</div>');
						XKit.extensions.xkit_preferences.close();

					});

				});

			});

		}

		$("#xkit-control-panel-tabs div").click(function() {

			var div_id = $(this).attr('id');

			$("#xkit-control-panel-tabs div").not(this).removeClass("selected");
			$(this).addClass("selected");



			if (div_id === "xkit-cp-tab-my-extensions") {
				XKit.extensions.xkit_preferences.show_my_extensions();
			}

			if (div_id === "xkit-cp-tab-get-extensions") {
				XKit.extensions.xkit_preferences.show_get();
			}

			if (div_id === "xkit-cp-tab-news") {
				XKit.extensions.xkit_preferences.show_news();
			}

			if (div_id === "xkit-cp-tab-xcloud") {
				XKit.extensions.xkit_preferences.show_xcloud();
			}

			if (div_id === "xkit-cp-tab-other") {
				XKit.extensions.xkit_preferences.show_other();
			}

			if (div_id === "xkit-cp-tab-about") {
				XKit.extensions.xkit_preferences.show_about();
			}

			if (div_id === "xkit-cp-tab-close") {
				XKit.extensions.xkit_preferences.close();
			}

		});

		if (open_news !== true) {
			XKit.extensions.xkit_preferences.show_my_extensions();
		} else {
			XKit.extensions.xkit_preferences.show_news();
			$("#xkit-cp-tab-news").trigger('click');
		}

	},

	close: function() {

		$("body").css("overflow", "auto");
		$(".l-container").css("opacity", "1");
		$("#xkit-control-panel-shadow").fadeOut(400);
		$("#xkit-control-panel").animate({ marginTop: '-50px', opacity: 0}, 600, function() {
			$("#xkit-control-panel-shadow").remove();
			$("#xkit-control-panel").remove();
		});

		if (XKit.browser().mobile) {
			$(window).scrollTop(XKit.extensions.xkit_preferences.scroll_pos);
		}

	},


	show_news: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "news") { return; }
		XKit.extensions.xkit_preferences.current_panel = "news";

		var m_html =
				'<div class="nano long" id="xkit-extensions-panel-left">' +
					'<div class="content" id="xkit-extensions-panel-left-inner"></div>' +
				'</div>' +
				'<div class="nano xkit-no-message" id="xkit-extensions-panel-right">' +
					'<div class="content" id="xkit-extensions-panel-right-inner"><div id="xkit-news-turn-off-help">' +
					"<strong>Don't like news?</strong><br>You can turn these off from the Others > News Notifications panel.</div>" +
				'</div>';

		$("#xkit-control-panel-inner").html(m_html);

		var list_html = XKit.extensions.xkit_preferences.news.list();
		if (list_html === "") {
			$("#xkit-extensions-panel-left-inner").html(
				'<div class="xkit-not-found-error"><b>You have no mail.</b><br>' +
				"Once something exciting happens, you'll get news about it on this panel.</div>");
			return;
		} else {
			$("#xkit-extensions-panel-left-inner").html(list_html);
		}

		$("#xkit-extensions-panel-left").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-extensions-panel-left .xkit-news-item").click(function() {
			var $this = $(this);

			$("#xkit-extensions-panel-left .xkit-news-item").not(this).removeClass("selected");
			$this.addClass("selected");
			$this.find(".xkit-mail-icon-unread").addClass("xkit-mail-icon-read");
			$this.find(".xkit-mail-icon-unread").removeClass("xkit-mail-icon-unread");
			XKit.extensions.xkit_preferences.news.open($this.attr('data-news-id'));

		});

	},


	show_get: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "get") { return; }
		XKit.extensions.xkit_preferences.current_panel = "get";

		var m_html =
				'<div class="nano xkit-wide-panel white" id="xkit-extensions-panel-right">' +
					'<div class="content" id="xkit-extensions-panel-right-inner">' +
					'<div id="xkit-gallery-loading">Loading extension gallery...</div></div>' +
				'</div>';

		$("#xkit-control-panel-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		XKit.download.page("gallery.php", function(mdata) {

			if (XKit.extensions.xkit_preferences.current_panel !== "get") { return; }

			if (mdata.server_down === true) {

				$("#xkit-extensions-panel-right-inner").html(
					'<div class="xkit-unable-to-load-extension-gallery">' +
						'<strong>Unable to load extension gallery.<br>Sorry about that.</strong><br><br>' +
						'XKit servers might be experiencing some problems. Please try again, and if you cant\'t reach ' +
						'the servers for more than a few days, please <a href="https://github.com/new-xkit/XKit/issues">report a problem</a>.' +
					'</div>');
				$("#xkit-extensions-panel-right").nanoScroller();
				$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
				return;
			}

			var gallery_html = "";

			for (var extension in mdata.extensions) {

				gallery_html = gallery_html + XKit.extensions.xkit_preferences.gallery_parse_item(mdata.extensions[extension]);

			}

			gallery_html =
					'<div id="xkit-gallery-toolbar">' +
						'<input type="text" id="xkit-gallery-search" placeholder="Search the gallery">' +
						'<div id="xkit-panel-hide-installed-extensions-from-gallery" class="xkit-checkbox ' + (XKit.tools.get_setting("xkit_hide_installed_extensions", "false") === "true" ? "selected" : "") + '">' +
						'<b>&nbsp;</b>Hide installed extensions</div>' +
					'</div>' + gallery_html + '<div class="xkit-unable-to-load-extension-gallery"><b>No new extensions</b><br/><br/>' +
										"It looks like you've installed all the currently available extensions.<br/>Come back later!</div>";

			$("#xkit-extensions-panel-right-inner").html(gallery_html + '<div class="xkit-gallery-clearer">&nbsp;</div>');

			if (XKit.tools.get_setting("xkit_hide_installed_extensions", "false") === "true") {
				XKit.tools.add_css(".xkit-installed-extension { display: none; }", "xkit_hide_installed_extensions");
				if ($("#xkit-extensions-panel-right-inner .xkit-gallery-extension").length === $("#xkit-extensions-panel-right-inner .xkit-installed-extension").length) {
					XKit.tools.add_css(".xkit-unable-to-load-extension-gallery { display: block; }", "xkit_hide_installed_extensions");
				}
			}

			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

			$("#xkit-panel-hide-installed-extensions-from-gallery").click(function() {
				if ($(this).hasClass("selected")) {
					$(this).removeClass("selected");
					XKit.tools.set_setting("xkit_hide_installed_extensions", "false");
					XKit.tools.remove_css("xkit_hide_installed_extensions");
					$(".xkit-unable-to-load-extension-gallery").css("display", "none");
				} else {
					$(this).addClass("selected");
					XKit.tools.set_setting("xkit_hide_installed_extensions", "true");
					XKit.tools.add_css(".xkit-installed-extension { display: none }", "xkit_hide_installed_extensions");
					if ($("#xkit-extensions-panel-right-inner .xkit-gallery-extension").length === $("#xkit-extensions-panel-right-inner .xkit-installed-extension").length) {
						$(".xkit-unable-to-load-extension-gallery").css("display", "block");
					}
				}
			});

			$("#xkit-gallery-search").keyup(function() {

				var m_value = $(this).val().toLowerCase();
				m_value = $.trim(m_value);
				if (m_value === "") {
					$("#xkit-extensions-panel-right-inner .xkit-gallery-extension").css("display", "");
					$("#xkit-extensions-panel-right-inner .xkit-gallery-not-found-error").remove();
					return;
				}

				var found_count = 0;
				$("#xkit-extensions-panel-right-inner .xkit-gallery-extension").each(function() {

					var $this = $(this);
					var m_data = $this.find(".title").html().toLowerCase() + " " + $this.find(".description").html().toLowerCase();

					if (m_data.indexOf(m_value) !== -1) {
						found_count++;
						$this.css("display", "block");
					} else {
						$this.css("display", "none");
					}

				});

				if (found_count === 0) {
					if ($("#xkit-extensions-panel-right-inner .xkit-gallery-not-found-error").length === 0) {
						$("#xkit-extensions-panel-right-inner").append('<div class="xkit-gallery-not-found-error">No extensions found.</div>');
					}
				} else {
					$("#xkit-extensions-panel-right-inner .xkit-gallery-not-found-error").remove();
				}

				$("#xkit-extensions-panel-right").nanoScroller();
				$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

			});

			$("#xkit-extensions-panel-right").removeClass("white");


			$(".xkit-gallery-extension .more-info").click(function() {
				XKit.window.show("More information", $(this).attr('data-more-info'), "info",
												 '<div class="xkit-button default" id="xkit-close-message">OK</div>');
			});

			$(".xkit-gallery-extension .xkit-install-extension").click(function() {

				if ($(this).parent().hasClass("xkit-installed-extension")) { return; }

				$(this).parent().addClass("overlayed");

				XKit.install($(this).attr('data-extension-id'), function(extension_data) {
					// defined in xkit.js
					/* globals show_error_installation */

					var m_extension_id = extension_data.id;

					if (extension_data.errors) {
						if (extension_data.storage_error === true) {
							show_error_installation("[Code: 631] Can't store data on browser");
							return;
						}
						if (extension_data.server_down === true) {
							show_error_installation("[Code: 101] Can't reach XKit servers");
						} else {
							if (extension_data.file === "not_found") {
								show_error_installation("Can't download " + $(this).attr('data-extension-id') + ": Not found");
							} else {
								show_error_installation("Can't download " + $(this).attr('data-extension-id'));
							}
						}
						return;
					}

					$("#xkit-gallery-extension-" + extension_data.id).find(".overlay").addClass("green");
					$("#xkit-gallery-extension-" + extension_data.id).find(".overlay").html("Installed!");

					try {
						eval(extension_data.script + "\n//# sourceURL=xkit/" + m_extension_id + ".js");
						XKit.extensions[m_extension_id].run();
					} catch (e) {

					}

				});

			});

		});

	},

	gallery_parse_item: function(obj) {

		if (typeof obj.icon === "undefined" || obj.icon === "") {
			obj.icon = XKit.extensions.xkit_preferences.default_extension_icon;
		}

		if (obj.name.startsWith("xkit_") && XKit.tools.get_setting("xkit_show_internals", "false") === "false") { return ""; }

		var blacklisted_extensions = ["xkit_installer"];

		if (blacklisted_extensions.indexOf(obj.name.toLowerCase()) !== -1) {
			return "";
		}

		var installed_extension_class = "";
		if (XKit.installed.check(obj.name)) { installed_extension_class = "xkit-installed-extension"; }

		var m_html = '<div class="xkit-gallery-extension ' + installed_extension_class + '" id="xkit-gallery-extension-' + obj.name + '" data-extension-id="' + obj.name + '">' +
			'<div class="overlay">Downloading</div>' +
			'<div class="title">' + obj.title + '</div>' +
			'<div class="description">' + obj.description + '</div>';

		if (obj.details !== "" && typeof obj.details !== "undefined") {
			m_html = m_html + '<div class="more-info" data-more-info="' + obj.details + '">more info</div>';
		}


		var install_button_text = "Install";
		if (XKit.installed.check(obj.name)) { install_button_text = "Installed"; }

		m_html = m_html +
				'<div class="icon"><img src="' + obj.icon + '"></div>' +
					'<div class="xkit-button xkit-install-extension" data-extension-id="' + obj.name + '">' + install_button_text + '</div>' +
				'</div>';

		return m_html;

	},

	show_my_extensions: function(iconic) {

		if (XKit.extensions.xkit_preferences.current_panel === "my") { return; }
		XKit.extensions.xkit_preferences.current_panel = "my";

		var m_list_class = "selected";
		var m_iconic_class = "";

		if (typeof iconic === "undefined") {
			iconic = XKit.storage.get("xkit_preferences", "list_type", "false");
			if (iconic === "false" || iconic === false) { iconic = false; }
			if (iconic === "true" || iconic === true) { iconic = true; }
		} else {
			if (iconic === "false" || iconic === false) { XKit.storage.set("xkit_preferences", "list_type", "false"); }
			if (iconic === "true" || iconic === true) { XKit.storage.set("xkit_preferences", "list_type", "true"); }
		}

		if (iconic === true) {
			m_iconic_class = "selected";
			m_list_class = "";
		}

		var m_html =
				'<div class="nano" id="xkit-extensions-panel-left">' +
					'<div class="content" id="xkit-extensions-panel-left-inner"></div>' +
				'</div>' +
				'<div class="nano" id="xkit-extensions-panel-right">' +
					'<div class="content" id="xkit-extensions-panel-right-inner"></div>' +
				'</div>' +
				'<input type="text" id="xkit-extensions-panel-left-search" placeholder="Search"/>' +
				'<div data-type="normal" class="xkit-extensions-display-type-switcher ' + m_list_class + '" id="xkit-extensions-display-type-normal">&nbsp;</div>' +
				'<div data-type="iconic" class="xkit-extensions-display-type-switcher ' + m_iconic_class + '" id="xkit-extensions-display-type-iconic">&nbsp;</div>';

		$("#xkit-control-panel-inner").html(m_html);

		$("#xkit-extensions-panel-left-search").keyup(function() {

			var m_value = $(this).val().toLowerCase();
			m_value = $.trim(m_value);
			if (m_value === "") {
				$("#xkit-extensions-panel-left-inner .xkit-extension").css("display", "block");
				$("#xkit-extensions-panel-left-inner .xkit-not-found-error").remove();
			}

			var found_count = 0;
			$("#xkit-extensions-panel-left-inner .xkit-extension").each(function() {

				if ($(this).find(".title").html().toLowerCase().indexOf(m_value) !== -1) {
					found_count++;
					$(this).css("display", "block");
				} else {
					$(this).css("display", "none");
				}

			});

			if (found_count === 0) {
				if ($("#xkit-extensions-panel-left-inner .xkit-not-found-error").length === 0) {
					$("#xkit-extensions-panel-left-inner").prepend('<div class="xkit-not-found-error">No extensions found.</div>');
				}
			} else {
				$("#xkit-extensions-panel-left-inner .xkit-not-found-error").remove();
			}

		});

		if (XKit.tools.get_setting("xkit_show_internals", "false") === "false") {
			XKit.extensions.xkit_preferences.fill_extensions(false, iconic);
		} else {
			XKit.extensions.xkit_preferences.fill_extensions("", iconic);
		}

		$(".xkit-extensions-display-type-switcher").click(function() {

			if ($(this).hasClass("selected")) { return; }

			$(".xkit-extensions-display-type-switcher").not(this).removeClass("selected");
			$(this).addClass("selected");

			XKit.extensions.xkit_preferences.current_panel = "";

			if ($(this).attr('data-type') === "iconic") {
				XKit.extensions.xkit_preferences.show_my_extensions(true);
			} else {
				XKit.extensions.xkit_preferences.show_my_extensions(false);
			}

		});

	},

	fill_extensions: function(internal, iconic) {

		var installed = XKit.installed.list();

		var listed_count = 0;
		var m_first;

		for (var i = 0; i < installed.length; i++) {

			if (internal === false && installed[i].substring(0, 5) === "xkit_") {
				continue;
			}

			if (internal === true && installed[i].substring(0, 5) !== "xkit_") {
				continue;
			}

			var m_extension = XKit.installed.get(installed[i]);
			var is_internal = installed[i].substring(0, 5) === "xkit_";

			var extension_icon;
			if (!m_extension.icon) {
				if (is_internal === true) {
					extension_icon = XKit.extensions.xkit_preferences.kernel_extension_icon;
				} else {
					extension_icon = XKit.extensions.xkit_preferences.default_extension_icon;
				}
			} else {
				extension_icon = m_extension.icon;
			}

			var extension_title = m_extension.title;
			if (extension_title === "") {
				extension_title = m_extension.id;
			}

			if (listed_count === 0) {
				m_first = m_extension.id;
			}


			var m_html = '<div class="xkit-extension" data-extension-id="' + installed[i] + '">' +
					'<img class="icon" src="' + extension_icon + '">' +
					'<div class="icon-mask">&nbsp;</div>' +
					'<div class="title">' + m_extension.title + '</div>' +
					'</div>';

			if (iconic === true) {

				m_html = '<div class="xkit-extension iconic" data-extension-id="' + installed[i] + '">' +
					'<img class="icon" src="' + extension_icon + '">' +
					'<div class="icon-mask">&nbsp;</div>' +
					'<div class="title">' + m_extension.title + '</div>' +
					'</div>';

			}

			if (XKit.extensions.xkit_preferences.current_panel !== "my") { return; }
			$("#xkit-extensions-panel-left-inner").append(m_html);
			listed_count++;

		}

		if (listed_count >= 6) {
			$("#xkit-extensions-panel-left-inner .xkit-extension:last-child").css("border-bottom", "0");
		}

		$("#xkit-extensions-panel-left").nanoScroller();
		$("#xkit-extensions-panel-left").nanoScroller({ scroll: 'top' });

		if (listed_count >= 1) {
			XKit.extensions.xkit_preferences.open_extension_control_panel(m_first);
			$("#xkit-extensions-panel-left-inner .xkit-extension").click(function() {
				var m_id = $(this).attr('data-extension-id');
				XKit.extensions.xkit_preferences.open_extension_control_panel(m_id);
			});
		} else {
			$("#xkit-extensions-panel-left").html(
				'<div class="xkit-not-found-error"><b>You have no extensions.</b><br/>' +
				"Why don't you go to the Extension Gallery by clicking on the Get Extensions tab below?</div>");
		}


	},

	current_open_extension_panel: "",

	open_extension_control_panel: function(extension_id) {

		$("#xkit-extensions-panel-left-inner .xkit-extension").each(function() {

			if ($(this).attr('data-extension-id') === extension_id) {
				$(this).addClass("selected");
			} else {
				$(this).removeClass("selected");
			}

		});

		var this_is_internal = extension_id.substring(0, 5) === "xkit_";
		var m_extension = XKit.installed.get(extension_id);

		XKit.extensions.xkit_preferences.current_open_extension_panel = extension_id;

		if (typeof XKit.extensions[extension_id] === "undefined") {
			// Something bad has happened. Let's check for this later.
			$("#xkit-extensions-panel-right-inner").html('<div class="xkit-unable-to-load-extension-panel"><b>Unable to load extension panel.</b><br/>' +
				"Please refresh the page and try again.<br><br>If this extension is causing trouble:<br>" +
				'<div id="xkit-extension-delete-trouble" class="xkit-button">Delete this extension</div></div>');

			XKit.console.add("Can't load extension panel: Extension undefined.");
			$("#xkit-extension-delete-trouble").click(function() {

				if (this_is_internal === true) { return; }

				try {
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				} catch (e) {
					XKit.console.add("Unable to shutdown extension " + XKit.extensions.xkit_preferences.current_open_extension_panel);
				}
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					XKit.installed.remove(XKit.extensions.xkit_preferences.current_open_extension_panel);
					XKit.extensions.xkit_preferences.current_panel = "";
					XKit.extensions.xkit_preferences.show_my_extensions();
				}, 500);

			});

			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
			return;
		}

		var m_html = '<div id="xkit-extensions-panel-top">' +
					'<div class="title">' + m_extension.title + '</div>' +
					'<div class="version">' + m_extension.version + '</div>' +
					'<div class="more-info" style="display: none;" id="xkit-extension-more-info">attributes</div>' +
					'<div class="description">' + m_extension.description;

		var xkit_developers = ["studioxenix", "new-xkit", "dlmarquis", "hobinjk", "thepsionic", "nightpool", "blackjackkent", "wolvan", "bvtsang", "0xazure"];
		if (xkit_developers.indexOf(m_extension.developer.toLowerCase()) === -1) {
			m_html = m_html + '<div class="xkit-third-party-warning">third party extension</div>';
		}

		if (m_extension.details !== "" && typeof m_extension.details !== "undefined") {
			m_html = m_html + '<div class="details" id="xkit-extension-details">more information</div>';
		}

		m_html = m_html + '</div><div class="buttons">';

		m_html = m_html + '<div class="xkit-button" id="xkit-extension-update">Update</div>';

		if (!this_is_internal) {
			m_html = m_html + '<div class="xkit-button" id="xkit-extension-uninstall">Uninstall</div>';
			m_html = m_html + '<div class="xkit-button" id="xkit-extension-reset">Reset Settings</div>';
		}

		m_html = m_html + "</div>";


		if (!this_is_internal) {

			if (XKit.installed.enabled(extension_id) === true) {
				m_html = m_html + '<div class="xkit-checkbox selected" id="xkit-extension-enabled"><b>&nbsp;</b>Enable ' + m_extension.title + '</div>';
			} else {
				m_html = m_html + '<div class="xkit-checkbox" id="xkit-extension-enabled"><b>&nbsp;</b>Enable ' + m_extension.title + '</div>';
			}

		}

		m_html = m_html + "</div>";

		if (XKit.extensions[extension_id].slow === true) {

			m_html = m_html + '<div id="xkit-extension-panel-slow-extension">This extension might slow down your computer.<div class="xkit-more-info">more information</div></div>';

		}

		if (typeof XKit.extensions[extension_id].preferences === "undefined" && typeof XKit.extensions[extension_id].cpanel === "undefined") {

			m_html = m_html + '<div id="xkit-extension-panel-no-settings">No settings available for this extension.</div>';

		} else {

			// To-Do: Load Extension settings Here!
			// Check if custom control panel:
			if (typeof XKit.extensions[extension_id].cpanel === "undefined") {
				// Yes it is.
				m_html = m_html + '<div id="xkit-extension-panel-settings">' + XKit.extensions.xkit_preferences.return_extension_settings(extension_id) + "</div>";
			} else {
				// Check if it also has standard options:
				if (XKit.installed.enabled(extension_id) === false) {

					m_html = m_html + '<div id="xkit-extension-panel-no-settings">Please enable this extension to customize it.</div>';

				} else {
					if (typeof XKit.extensions[extension_id].preferences !== "undefined") {
						m_html = m_html + '<div id="xkit-extension-panel-settings">' + XKit.extensions.xkit_preferences.return_extension_settings(extension_id) + "</div>";
					} else {
						m_html = m_html + '<div id="xkit-extension-panel-settings"><div style="padding: 10px">There is a problem loading the extension panel.<br/>Update the extension and again later.</div></div>';
					}
				}
			}
		}

		$("#xkit-extensions-panel-right-inner").html(m_html);

		// Pass control to the extension to draw custom control panel:
		if (typeof XKit.extensions[extension_id].cpanel !== "undefined") {
			// Call it:
			XKit.extensions[extension_id].cpanel($("#xkit-extension-panel-settings"));
		}

		$(".xkit-third-party-warning").click(function() {

			XKit.window.show("Third Party Extension",
				"This extension was not created by the New XKit Team. Since it is not developed by me, I can not make any guarantees about it, " +
				"nor provide support for this extension, accept bug reports or feature requests." +
				'<div style="border: 1px solid rgb(200,200,200); background: rgb(235,235,235); margin: 15px 0px; padding: 10px; ' +
				'color: rgb(100,100,100); text-align: center; border-radius: 4px; box-shadow: inset 0px 1px 0px white, 0px 1px 2px rgba(0,0,0,0.22); ">' +
				'This extension was developed by <a style="text-decoration: underline;" href="http://github.com/' + m_extension.developer + '">' +
				m_extension.developer + "</a></div>Please contact the developer using the link provided below for questions, bug reports and feature requests.",
				"warning", '<div id="xkit-close-message" class="xkit-button default">OK</div>');

		});

		$(".xkit-extension-experimental-bong").click(function() {

			XKit.window.show("This is an experimental feature",
				"<b>This feature is labelled \"experimental\" since it was added recently, and haven't throughly tested yet. " +
				"It might cause problems and might not work properly.</b> " +
				"If you hit a bug, please contact the creator of this extension: " +
				'look at the top-right of the extension panel, if it says "Third Party Extension", ' +
				"click on it to learn who to contact. " +
				"If there is no warning icon, please contact the XKit Blog.", "warning",
				'<div id="xkit-close-message" class="xkit-button default">OK</div>');

		});

		$(".xkit-extension-experimental-turtle").click(function() {

			XKit.window.show("This feature might slow down your computer",
				"Turning this feature on might slow down your computer, especially if you have a slow internet connection or an older computer.",
				"warning", '<div id="xkit-close-message" class="xkit-button default">OK</div>');

		});

		$("#xkit-extension-update").click(function() {

			var $this = $(this);

			if ($this.hasClass("disabled") === true) { return; }

			$("#xkit-extensions-panel-right-inner").html('<div id="xkit-extension-panel-no-settings">Updating...</div>');

			if (typeof XKit.extensions.xkit_updates === "undefined" || typeof XKit.extensions.xkit_updates.update === "undefined") {
				XKit.window.show("Can't update",
					'It looks like "XKit Updates" extension is missing or not working properly. It is highly recommended that you reset XKit.', "error",
					'<div id="xkit-close-message" class="xkit-button default">OK</div>' +
					'<a href="http://www.tumblr.com/xkit_reset" class="xkit-button">Reset XKit</a>');
				XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);
				return;
			}

			$(this).addClass("disabled");

			XKit.extensions.xkit_updates.update(XKit.extensions.xkit_preferences.current_open_extension_panel, function(mdata) {

				if (mdata.errors === false) {
					XKit.window.show("Done!", "<b>Done updating extension.</b><br/>" +
						"Please refresh the page for changes to take effect.", "info",
						'<div id="xkit-close-message" class="xkit-button default">OK</div>');
					XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);
					return;
				}

				XKit.window.show("Can't update",
					"Update manager returned the following message:<p>" + mdata.error + "</p>" +
					"Please try again later or if the problem continues, contact New XKit Support.", "error",
					'<div id="xkit-close-message" class="xkit-button default">OK</div>' +
					'<a href="http://new-xkit-support.tumblr.com/support" class="xkit-button">Support Chat Room</a>');
				XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);

			});

		});

		$("#xkit-extension-reset").click(function() {

			if (typeof XKit.extensions[extension_id] === "undefined") {
				return;
			}

			var m_ext = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);

			XKit.window.show("Reset " + m_ext.title + "?",
				"This will delete all the settings and data this extension is saving on your computer.", "question",
				'<div id="xkit-extension-yes-reset" class="xkit-button default">Yes, reset settings</div>' +
				'<div id="xkit-close-message" class="xkit-button">Cancel</div>');

			$("#xkit-extension-yes-reset").click(function() {

				if ($(this).hasClass("disabled") === true) { return; }

				$(this).addClass("disabled");
				$(this).html("Please wait, resetting...");

				XKit.storage.clear(XKit.extensions.xkit_preferences.current_open_extension_panel);
				XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					XKit.extensions.xkit_main.load_extension_preferences(XKit.extensions.xkit_preferences.current_open_extension_panel);
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].run();
					XKit.window.close();
					XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);
				}, 500);

			});

		});

		$("#xkit-extension-uninstall").click(function() {

			if (typeof XKit.extensions[extension_id] === "undefined") {
				return;
			}

			var m_ext = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);

			XKit.window.show("Uninstall " + m_ext.title + "?",
				"This extension will be completely deleted from your computer." +
				"If you change your mind, you can re-download it from the extension gallery later.",
				"question", '<div id="xkit-extension-yes-uninstall" class="xkit-button default">Yes, uninstall</div>' +
				'<div id="xkit-close-message" class="xkit-button">Cancel</div>');

			$("#xkit-extension-yes-uninstall").click(function() {

				if ($(this).hasClass("disabled") === true) { return; }

				$(this).addClass("disabled");
				$(this).html("Please wait, uninstalling...");

				XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					XKit.installed.remove(XKit.extensions.xkit_preferences.current_open_extension_panel);
					XKit.window.close();
					XKit.extensions.xkit_preferences.current_panel = "";
					XKit.extensions.xkit_preferences.show_my_extensions();
				}, 500);

			});


		});

		$("#xkit-extension-enabled").click(function() {

			if (typeof XKit.extensions[extension_id] === "undefined") {
				return;
			}

			var m_ext = XKit.extensions.xkit_preferences.current_open_extension_panel;
			if (XKit.installed.enabled(m_ext) === true) {
				XKit.installed.disable(m_ext);
				XKit.extensions[extension_id].destroy();
				$(this).removeClass("selected");
			} else {
				XKit.installed.enable(m_ext);
				XKit.extensions[extension_id].run();
				$(this).addClass("selected");
			}

			// Re-open the extension panel:
			XKit.extensions.xkit_preferences.current_open_extension_panel = "";
			XKit.extensions.xkit_preferences.open_extension_control_panel(m_ext);

		});

		$("#xkit-extension-panel-slow-extension .xkit-more-info").click(function() {

			XKit.window.show("Turtle Warning",
				"This extension manipulates the page a lot and/or makes calls to Tumblr servers and" +
				" - depending on your computer, internet connection and browser - might or might not slow down your computer." +
				"<br/><br/>If XKit is making your browser slower, it is recommended that you disable the extensions with this warning message," +
				" or at least disable the features of it you don't use much.", "warning",
				'<div id="xkit-close-message" class="xkit-button default">OK</div>');

		});

		$("#xkit-extension-details").click(function() {

			var extension = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);
			XKit.window.show("More Information", extension.details, "info", '<div class="xkit-button default" id="xkit-close-message">OK</div>');

		});

		$("#xkit-extension-more-info").click(function() {

			var extension = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);

			var has_css = extension.css !== "";
			var has_icon = extension.icon !== "";
			var is_beta = extension.beta === true;
			var is_frame = extension.frame === true;
			var extension_size = JSON.stringify(extension).length;
			var extension_size_kb = Math.round(extension_size / 1024);
			var storage_size = XKit.storage.size(XKit.extensions.xkit_preferences.current_open_extension_panel);
			var storage_quota = XKit.storage.quota(XKit.extensions.xkit_preferences.current_open_extension_panel);
			var is_internal = extension.id.substring(0, 5) === "xkit_";
			var has_settings = false;
			if (typeof XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].preferences !== "undefined") {
				has_settings = true;
			}
			var is_enabled = XKit.installed.enabled(XKit.extensions.xkit_preferences.current_open_extension_panel);

			var details_html =
					"<b>Internal ID</b>: " + extension.id + "<br>" +
					"<b>Developer</b>: " + extension.developer + "<br>" +
					"<b>Enabled</b>: " + is_enabled + "<br>" +
					"<b>Internal</b>: " + is_internal + "<br>" +
					"<b>Size</b>: " + extension_size_kb + "kb (" + extension_size + " bytes)<br>" +
					"<b>Storage Size</b>: " + storage_size + "<br>" +
					"<b>Storage Quota Left</b>: " + storage_quota + "<br>" +
					"<b>Has Stylesheet</b>: " + has_css + "<br>" +
					"<b>Has Icon</b>: " + has_icon + "<br>" +
					"<b>Has Settings</b>: " + has_settings + "<br>" +
					"<b>Beta Extension</b>: " + is_beta + "<br>" +
					"<b>Frame Extension</b>: " + is_frame + "<br>";

			XKit.window.show("Extension Information", details_html, "info", '<div class="xkit-button default" id="xkit-close-message">OK</div>');

		});

		$("#xkit-extensions-panel-right-inner .xkit-extension-setting:last-child").css("background", "0").css("border-bottom", "0");

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		$(".xkit-extension-setting > .xkit-preference-combobox-select").change(function() {

			var this_id = $(this).attr('data-extension-id');
			var preference_name = $(this).attr('data-setting-id');

			XKit.extensions[this_id].preferences[preference_name].value = $(this).val();

			if ($(this).hasClass("xkit-preference-combobox-select-blog")) {
				XKit.storage.set(this_id, "extension__setting__" + preference_name, "[" + $(this).val() + "]");
			} else {
				XKit.storage.set(this_id, "extension__setting__" + preference_name, $(this).val());
			}

			XKit.extensions.xkit_preferences.restart_extension(this_id);

		});

		$(".xkit-extension-setting > .xkit-checkbox").click(function() {

			var this_id = $(this).attr('data-extension-id');
			var preference_name = $(this).attr('data-setting-id');

			if ($(this).hasClass("selected") === true) {
				XKit.extensions[this_id].preferences[preference_name].value = false;
				XKit.storage.set(this_id, "extension__setting__" + preference_name, "false");
				$(this).removeClass("selected");
			} else {
				XKit.extensions[this_id].preferences[preference_name].value = true;
				XKit.storage.set(this_id, "extension__setting__" + preference_name, "true");
				$(this).addClass("selected");
			}

			XKit.extensions.xkit_preferences.restart_extension(this_id);

		});

		$(".xkit-extension-setting > .xkit-textbox").change(function() {

			var this_id = $(this).attr('data-extension-id');
			var preference_name = $(this).attr('data-setting-id');

			XKit.extensions[this_id].preferences[preference_name].value = $(this).val();
			XKit.storage.set(this_id, "extension__setting__" + preference_name, $(this).val());
			XKit.extensions.xkit_preferences.restart_extension(this_id);

		});

	},

	restart_extension: function(extension_id) {

		try {
			XKit.extensions[extension_id].destroy();
			setTimeout(function() {
				try {
					XKit.extensions[extension_id].run();
				} catch (e) {
					XKit.console.add("Can not run " + extension_id + ": " + e.message);
				}
			}, 10);
		} catch (e) {
			// Unknown what to do here.
			XKit.console.add("Can not run " + extension_id + ": " + e.message);
		}

	},

	render_blog_preference: function(pref, extension_id, pref_id) {
		var m_blogs = XKit.tools.get_blogs();
		var m_return = "";

		var m_extra_classes = "";
		if (pref.experimental === true || pref.slow === true) {
			m_extra_classes = "xkit-experimental-option";
		}

		var m_extra_style = "";
		if (pref.mobile_only === true && XKit.browser().mobile === false) {
			m_extra_style = "display: none;";
		} else if (pref.desktop_only === true && XKit.browser().mobile === true) {
			m_extra_style = "display: none;";
		}

		m_return = m_return + '<div class="xkit-extension-setting xkit-combo-preference ' + m_extra_classes +
		'" style="' + m_extra_style +
		'" data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '">';

		if (pref.experimental === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-bong">&nbsp;</div>';
		} else if (pref.slow === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-turtle">&nbsp;</div>';
		}

		if (typeof pref.value === "undefined") {
			pref.value = "";
		}

		if (pref.value === "") {
			if (typeof pref.default !== "undefined") {
				pref.value = pref.default;
			}
		}

		var pref_title = pref.text;

		m_return = m_return + '<div class="title">' + pref_title + "</div>";

		m_return = m_return + '<select data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '" class="xkit-preference-combobox-select-blog xkit-preference-combobox-select">';

		if (pref.value === "") {
			m_return = m_return + '<option selected value="">Default Action</option>';
		} else {
			m_return = m_return + '<option value="">Default Action</option>';
		}

		for (var i = 0; i < m_blogs.length; i++) {

			if (m_blogs[i] === "") { continue; }

			var option = document.createElement("option");
			option.setAttribute("value", m_blogs[i]);
			option.textContent = m_blogs[i];
			if (m_blogs[i] === pref.value) {
				option.setAttribute("selected", "true");
			}

			m_return = m_return + option.outerHTML;

		}

		return m_return + "</select></div>";
	},

	render_combo_preference: function(pref, extension_id, pref_id) {
		var m_return = "";

		var m_extra_classes = "";
		if (pref.experimental === true || pref.slow === true) {
			m_extra_classes = "xkit-experimental-option";
		}

		var m_extra_style = "";
		if (pref.mobile_only === true && XKit.browser().mobile === false) {
			m_extra_style = "display: none;";
		} else if (pref.desktop_only === true && XKit.browser().mobile === true) {
			m_extra_style = "display: none;";
		}

		m_return = m_return + '<div class="xkit-extension-setting xkit-combo-preference ' + m_extra_classes +
			'" style="' + m_extra_style +
			'" data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '">';

		if (pref.experimental === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-bong">&nbsp;</div>';
		} else if (pref.slow === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-turtle">&nbsp;</div>';
		}

		if (typeof pref.value === "undefined") {
			pref.value = "";
		}

		if (pref.value === "") {
			if (typeof pref.default !== "undefined") {
				pref.value = pref.default;
			}
		}

		var pref_title = pref.text;

		m_return = m_return + '<div class="title">' + pref_title + "</div>";

		m_return = m_return + '<select data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '" class="xkit-preference-combobox-select">';

		for (var j = 0; j < pref.values.length; j++) {

			var option = document.createElement("option");
			option.setAttribute("value", pref.values[j + 1]);
			option.textContent = pref.values[j];
			if (pref.values[j + 1] === pref.value) {
				option.setAttribute("selected", "true");
			}

			m_return = m_return + option.outerHTML;

			j++;

		}

		return m_return + "</select></div>";
	},

	render_text_preference: function(pref, extension_id, pref_id) {
		var m_return = "";

		var m_extra_classes = "";
		if (pref.experimental === true || pref.slow === true) {
			m_extra_classes = "xkit-experimental-option";
		}

		var m_extra_style = "";
		if (pref.mobile_only === true && XKit.browser().mobile === false) {
			m_extra_style = "display: none;";
		} else if (pref.desktop_only === true && XKit.browser().mobile === true) {
			m_extra_style = "display: none;";
		}

		m_return = m_return + '<div class="xkit-extension-setting ' + m_extra_classes +
			'" style="' + m_extra_style +
			'" data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '">';

		if (pref.experimental === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-bong">&nbsp;</div>';
		} else if (pref.slow === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-turtle">&nbsp;</div>';
		}

		if (typeof pref.value === "undefined") {
			pref.value = "";
		}

		if (pref.value === "") {
			if (typeof pref.default !== "undefined") {
				pref.value = pref.default;
			}
		}

		var pref_title = pref.text;

		m_return = m_return + '<div class="title">' + pref_title + "</div>";

		var m_placeholder = "Enter value and hit Enter";
		if (typeof pref.placeholder !== "undefined") {
			m_placeholder = pref.placeholder;
		}

		var textInput = document.createElement("input");
		textInput.setAttribute("class", "xkit-textbox");
		textInput.setAttribute("data-extension-id", extension_id);
		textInput.setAttribute("data-setting-id", pref_id);
		textInput.setAttribute("placeholder", m_placeholder);
		textInput.setAttribute("value", pref.value);

		return m_return + textInput.outerHTML + "</div>";
	},

	render_checkbox_preference: function(pref, extension_id, pref_id) {
		var m_extra_classes = "";
		var m_return = "";
		if (pref.experimental === true || pref.slow === true) {
			m_extra_classes = "xkit-experimental-option";
		}

		var m_extra_style = "";
		if (pref.mobile_only === true && XKit.browser().mobile === false) {
			m_extra_style = "display: none;";
		} else if (pref.desktop_only === true && XKit.browser().mobile === true) {
			m_extra_style = "display: none;";
		}

		m_return = m_return + '<div class="xkit-extension-setting ' + m_extra_classes +
			' checkbox" style="' + m_extra_style +
			'" data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '">';

		if (pref.experimental === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-bong">&nbsp;</div>';
		} else if (pref.slow === true) {
			m_return = m_return + '<div class="xkit-extension-experimental-turtle">&nbsp;</div>';
		}

		if (typeof pref.value === "undefined") {
			if (typeof pref.default !== "undefined") {
				pref.value = pref.default;
			}
		}

		var pref_title = pref.text;

		if (pref.value === false) {
			m_return = m_return + '<div data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '" class="xkit-checkbox xkit-change-ext-setting-checkbox"><b>&nbsp;</b>' + pref_title + "</div>";
		} else {
			m_return = m_return + '<div data-extension-id="' + extension_id + '" data-setting-id="' + pref_id + '" class="xkit-checkbox selected xkit-change-ext-setting-checkbox"><b>&nbsp;</b>' + pref_title + "</div>";
		}

		return m_return + "</div>";

	},

	return_extension_settings: function(extension_id) {

		var m_return = "";

		try {

			for (var pref in XKit.extensions[extension_id].preferences) {

				if (XKit.extensions[extension_id].preferences[pref].type === "blog") {
					m_return += this.render_blog_preference(XKit.extensions[extension_id].preferences[pref], extension_id, pref);
				}

				if (XKit.extensions[extension_id].preferences[pref].type === "combo") {
					m_return += this.render_combo_preference(XKit.extensions[extension_id].preferences[pref], extension_id, pref);
				}

				if (XKit.extensions[extension_id].preferences[pref].type === "text") {
					m_return += this.render_text_preference(XKit.extensions[extension_id].preferences[pref], extension_id, pref);
				}

				if (XKit.extensions[extension_id].preferences[pref].type === "separator") {

					var pref_title = XKit.extensions[extension_id].preferences[pref].text;

					var m_extra_style = "";
					if (XKit.extensions[extension_id].preferences[pref].mobile_only === true && XKit.browser().mobile === false) {
						m_extra_style = "display: none;";
					} else if (XKit.extensions[extension_id].preferences[pref].desktop_only === true && XKit.browser().mobile === true) {
						m_extra_style = "display: none;";
					}

					m_return += '<div class="xkit-extension-setting-separator" style="' + m_extra_style + '">' + pref_title + "</div>";

				}

				if (typeof XKit.extensions[extension_id].preferences[pref].type === "undefined" ||  XKit.extensions[extension_id].preferences[pref].type === "" || XKit.extensions[extension_id].preferences[pref].type === "checkbox") {

					m_return += this.render_checkbox_preference(XKit.extensions[extension_id].preferences[pref], extension_id, pref);
				}
			}

			return m_return;

		} catch (e) {

			return '<div style="padding: 10px;"><b>Unable to read extension preferences:</b><br/>' + e.message + "</div>";

		}

	},

	show_other: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "other") { return; }
		XKit.extensions.xkit_preferences.current_panel = "other";

		var m_html =
				'<div class="nano long" id="xkit-extensions-panel-left">' +
					'<div class="content" id="xkit-extensions-panel-left-inner">' +
						'<div class="xkit-extension text-only separator">Configuration</div>' +
						'<div data-pname="update-all" class="xkit-extension text-only">Update All</div>' +
						'<div data-pname="reset" class="xkit-extension text-only">Reset XKit</div>' +
						'<div data-pname="config" class="xkit-extension text-only">Export Configuration</div>' +
						'<div data-pname="storage" class="xkit-extension text-only">Storage</div>' +
						'<div class="xkit-extension text-only separator">Notifications</div>' +
						'<div data-pname="news" class="xkit-extension text-only">News Notifications</div>' +
						'<div data-pname="updates" class="xkit-extension text-only">Update Notifications</div>' +
						'<div class="xkit-extension text-only separator">Advanced Settings</div>' +
						'<div data-pname="console" class="xkit-extension text-only">Console</div>' +
						'<div data-pname="editor" class="xkit-extension text-only">XKit Editor</div>' +
						'<div data-pname="internal" class="xkit-extension text-only">Internals</div>' +
						'<div data-pname="flags" class="xkit-extension text-only" style="display: none;">Flags</div>' +
					"</div>" +
				"</div>" +
				'<div class="nano" id="xkit-extensions-panel-right">' +
					'<div class="content" id="xkit-extensions-panel-right-inner">Hello world.</div>' +
				"</div>";

		$("#xkit-control-panel-inner").html(m_html);

		$("#xkit-extensions-panel-left").nanoScroller();
		$("#xkit-extensions-panel-left").nanoScroller({ scroll: 'top' });

		$("#xkit-extensions-panel-left-inner > .xkit-extension").not(".separator").click(function() {

			var $this = $(this);

			$("#xkit-extensions-panel-left-inner > .xkit-extension").removeClass("selected");
			$this.addClass("selected");

			if ($this.attr('data-pname') === "reset") {
				XKit.extensions.xkit_preferences.show_others_panel_reset();
			}
			if ($this.attr('data-pname') === "config") {
				XKit.extensions.xkit_preferences.show_others_panel_config();
			}
			if ($this.attr('data-pname') === "updates") {
				XKit.extensions.xkit_preferences.show_others_panel_updates();
			}
			if ($this.attr('data-pname') === "update-all") {
				XKit.extensions.xkit_preferences.show_others_panel_update_all();
			}
			if ($this.attr('data-pname') === "news") {
				XKit.extensions.xkit_preferences.show_others_panel_news();
			}
			if ($this.attr('data-pname') === "console") {
				XKit.extensions.xkit_preferences.show_others_panel_console();
			}
			if ($this.attr('data-pname') === "flags") {
				XKit.extensions.xkit_preferences.show_others_panel_flags();
			}
			if ($this.attr('data-pname') === "editor") {
				XKit.extensions.xkit_preferences.show_others_panel_open_editor();
			}
			if ($this.attr('data-pname') === "internal") {
				XKit.extensions.xkit_preferences.show_others_panel_show_internals();
			}
			if ($this.attr('data-pname') === "storage") {
				XKit.extensions.xkit_preferences.show_others_panel_show_storage();
			}

		});

		$("#xkit-extensions-panel-left-inner > .xkit-extension").not(".separator").first().trigger("click");
		$("#xkit-extensions-panel-left-inner > .xkit-extension:last-child").css("border-bottom", "0");

	},

	show_others_panel_updates: function() {

		var m_html = '<div class="xkit-others-panel">' +
				'<div class="title">Update Notifications</div>' +
				'<div class="description">' +
					"XKit alerts you when it updates one of it's extensions. You can turn these off if you are not interested in update notifications." +
				'</div>' +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-enable-show-updates" class="xkit-checkbox"><b>&nbsp;</b>Show me update notifications</div>' +
				'</div>' +
				'</div>';

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_show_update_notifications", "true") === "true") {
			$("#xkit-panel-enable-show-updates").addClass("selected");
		}

		$("#xkit-panel-enable-show-updates").click(function() {

			if (XKit.tools.get_setting("xkit_show_update_notifications", "true") === "true") {
				$("#xkit-panel-enable-show-updates").removeClass("selected");
				XKit.tools.set_setting("xkit_show_update_notifications", "false");
			} else {
				$("#xkit-panel-enable-show-updates").addClass("selected");
				XKit.tools.set_setting("xkit_show_update_notifications", "true");
			}

		});
	},

	show_others_panel_news: function() {

		var m_html = '<div class="xkit-others-panel">' +
				'<div class="title">News Notifications</div>' +
				'<div class="description">' +
					'News section keeps you up to date with the latest on "What\'s going on?". ' +
					'I periodically write news items for that section to let you know when there is a new extension, ' +
					'a new feature, or when something goes wrong, such as when Tumblr changes things and breaks XKit.<br><br>' +
					'News items are divided into two: <b>Feature Updates</b>, which alert you on bug fixes and new features/extensions ' +
					'and <b>Important Updates</b>, sent only when there is something bad going on with XKit, ' +
					'such as a Tumblr change or a bug that might cause annoyance or big problems.<br/><br/>' +
					'You can turn off Feature Updates if you are not interested in them. You will continue receiving Important Updates ' +
					'if you do, since they usually have tips on how to make XKit work again if it goes berserk.' +
				'</div>' +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-enable-feature-updates" class="xkit-checkbox"><b>&nbsp;</b>Bring me Feature Updates</div>' +
				'</div>' +
				'</div>';

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_show_feature_updates", "true") === "true") {
			$("#xkit-panel-enable-feature-updates").addClass("selected");
		}

		$("#xkit-panel-enable-feature-updates").click(function() {

			if (XKit.tools.get_setting("xkit_show_feature_updates", "true") === "true") {
				$("#xkit-panel-enable-feature-updates").removeClass("selected");
				XKit.extensions.xkit_preferences.news.mark_all_as_read();
				XKit.tools.set_setting("xkit_show_feature_updates", "false");
			} else {
				$("#xkit-panel-enable-feature-updates").addClass("selected");
				XKit.tools.set_setting("xkit_show_feature_updates", "true");
			}

		});

	},

	show_others_panel_show_storage: function() {

		var m_html = '<div class="xkit-others-panel">' +
			'<div class="title">Storage</div>' +
			'<div class="description">' +
				"XKit has its own space on your browser, and gives most of this space away " +
				"to the extensions you install on it. Since this space is not unlimited, " +
				"you can check here how much space you have left." +
			'</div>' +
			'<div class="bottom-part">';

		var percentage = Math.round((storage_used * 100) / storage_max);
		m_html = m_html + XKit.progress.add("storage_usage") + "You have used <b>" + percentage + "%</b> of your storage.";
		m_html = m_html + '</div><div class="bottom-part" style="margin-top: 20px; line-height: 24px;">';
		m_html = m_html + "<b>What should I do if I am running out of space?</b><br/>" +
			"If you have used more than 80% of your storage, it is highly recommended that you uninstall " +
			"the extensions you don't use often. Resetting settings of extensions from the My XKit panel " +
			"also frees up space.";
		m_html = m_html + '</div><div class="bottom-part" style="margin-top: 20px; line-height: 24px;">';
		m_html = m_html + "<b>What happens if I use all my storage?</b><br/>If you fill up all the XKit storage area, " +
			"your browser might prevent XKit from saving additional data, and prevent it from booting up. " +
			"If that happens, you might need to reset XKit to get it to work properly again.";
		m_html = m_html + "</div>";

		if (XKit.storage.unlimited_storage === true) {
			var m_storage_string = "<b>Your XKit is using " + Math.floor(storage_used / 1024 / 1024) + " megabytes of storage.</b><br/>";
			if (Math.floor(storage_used / 1024 / 1024) <= 0) {
				m_storage_string = "<b>Your XKit is using " + Math.floor(storage_used / 1024) + " kilobytes of storage.</b><br/>";
			}
			m_html =
					'<div class="xkit-others-panel">' +
					'<div class="title">Storage</div>' +
					'<div class="description">' +
						"You are running a version of XKit which has unlimited storage.<br/>" +
						m_storage_string +
					"</div>" +
					'<div class="bottom-part" style="line-height: 24px;">' +
						"If you have recently made any changes, please refresh the page to update the storage usage counter." +
					"</div>" +
					'<div class="bottom-part" style="margin-top: 20px; line-height: 24px;">' +
						"Please note that the more storage you use, the longer it will take for XKit to boot up. " +
						"You should try to keep the storage usage under 5 megabytes for the best performance. " +
						"Disable and remove the extensions you don't use if you feel your XKit is acting sluggish." +
					"</div>" +
					'<div class="bottom-part" style="margin-top: 20px; line-height: 24px;">' +
						"If disabling extensions does not help, uninstall them and reset XKit after synching your data " +
						"using XCloud to free up the unused space." +
					"</div>" +
				"</div>";
		}

		$("#xkit-extensions-panel-right-inner").html(m_html);
		XKit.progress.value("storage_usage", percentage);

		$("#xkit-extensions-panel-right").nanoScroller();

	},

	show_others_panel_show_internals: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">Show Internal Extensions</div>' +
				'<div class="description">' +
					'"Internal"s are the extensions that are at the core of XKit: ' +
					"they are used to boot up and keep XKit up to date, and let you change it's settings. " +
					'This control panel, for instance, is actually an XKit extension. ' +
					'These are normally hidden from you, but you can force XKit to show these on ' +
					'the "My XKit" tab by checking the box below.' +
				"</div>" +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-enable-internal-extensions" class="xkit-checkbox"><b>&nbsp;</b>Show Internal Extensions</div>' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_show_internals", "false") === "true") {
			$("#xkit-panel-enable-internal-extensions").addClass("selected");
		}

		$("#xkit-panel-enable-internal-extensions").click(function() {

			if (XKit.tools.get_setting("xkit_show_internals", "false") === "false") {
				$("#xkit-panel-enable-internal-extensions").addClass("selected");
				XKit.tools.set_setting("xkit_show_internals", "true");
			} else {
				$("#xkit-panel-enable-internal-extensions").removeClass("selected");
				XKit.tools.set_setting("xkit_show_internals", "false");
			}

		});

	},

	show_others_panel_reset: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">Reset XKit</div>' +
				'<div class="description">' +
					"You can reset XKit to it's factory settings if it's acting weird, or you " +
					"just want to make a fresh start. This will delete all your XKit settings " +
					"and extensions, and you'll need to restart your browser." +
				"</div>" +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-reset-xkit" class="xkit-button block">Reset XKit</div>' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-panel-reset-xkit").click(function() {
			XKit.special.reset();
			XKit.extensions.xkit_preferences.close();
		});

	},

	show_others_panel_config: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">Export Configuration</div>' +
				'<div class="description">' +
					"This panel lets you export parts of your XKit configuration for others to view. " +
					"Including links to one of these when you submit a bug report will help us fix your problem sooner. " +
				"</div>" +
				'<div class="bottom-part">' +
					'Information about what extensions you have installed, almost always required: ' +
					'<div id="xkit-panel-extension-info" class="xkit-button block">Extension Info Export</div><br>' +
					'This link will export your entire xkit configuration data: ' +
					'<div id="xkit-panel-full-config" class="xkit-button block">Full Configuration Export</div>' +
					'This includes information that may be sensitive, including your tumblr urls, lists of blacklisted keywords, and more. ' +
					'Think carefully before sharing this information.' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		function update_button(el, text) {
			if (el.hasClass("disabled")) {
				return;
			}
			XKit.tools.make_gist(text).then(function(url) {
				el.replaceWith('<input class="xkit-url-field" type="text" value="' + url + '">');
				$('input.xkit-url-field[value="' + url + '"]')[0].setSelectionRange(0, url.length);
			});
			el.text("loading...");
			el.addClass("disabled");
		}

		$("#xkit-panel-extension-info").click(function() {

			var text = "XKit version " + XKit.version + "\n" +
					"extensions:\n" + XKit.installed.list().map(function(i) {
						return "   " + i + ": " + XKit.installed.version(i) + (XKit.installed.enabled(i) ? "" : " (disabled)");
					}).join("\n");

			update_button($(this), text);
		});

		$("#xkit-panel-full-config").click(function() {

			var text = JSON.stringify(XKit.tools.dump_config());

			update_button($(this), text);
		});
	},

	show_others_panel_console: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">Console</div>' +
				'<div class="description">' +
					"XKit comes with a console used to debug errors or see what's happening " +
					"in the background, if you are the curious type. When filing a bug report, " +
					"you should copy the error text on the console so I can fix the error sooner." +
				"</div>" +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-enable-console" class="xkit-checkbox"><b>&nbsp;</b>Enable XKit Console</div>' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_log_enabled", "false") === "true") {
			$("#xkit-panel-enable-console").addClass("selected");
		}

		$("#xkit-panel-enable-console").click(function() {

			if (XKit.tools.get_setting("xkit_log_enabled", "false") === "false") {
				$("#xkit-panel-enable-console").addClass("selected");
				XKit.tools.set_setting("xkit_log_enabled", "true");
				XKit.console.show();
			} else {
				$("#xkit-panel-enable-console").removeClass("selected");
				XKit.tools.set_setting("xkit_log_enabled", "false");
				XKit.console.hide();
			}

		});

	},


	show_others_panel_flags: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">Flags</div>' +
				'<div class="description">' +
					"Flags (or 'switches') are used to enable or disable parts of XKit " +
					"that are experimental and/or optional. You can click on the View Flags " +
					"button below to get a list of flags you can play with, but they come with no warranty: " +
					"some flags can slow down XKit or make it behave weirdly. " +
					"Please stop now if you don't know what you are doing." +
				"</div>" +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-show-flags" class="xkit-button block">View Flags</div>' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-panel-show-flags").click(function() {

			XKit.extensions.xkit_preferences.flags();

		});

	},

	show_others_panel_update_all: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">Update All</div>' +
				'<div class="description">' +
					"If you would like to force XKit to update itself now, or for some reason, you can not receive updates, click the button below to trigger Automatic Updates now. XKit will check for the new versions of extensions and update them if necessary." +
				"</div>" +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-force-update-xkit" class="xkit-button block">Update all my extensions</div>' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-panel-force-update-xkit").click(function() {

			XKit.window.show("Forcing Automatic Updates",
				"Please wait while I review the changes and update myself..<br/>Please do not navigate away from this page." +
				'<div id="xkit-forced-auto-updates-message">Initializing...</div>', "info");
			XKit.extensions.xkit_updates.get_list(true);

		});

	},

	show_others_panel_open_editor: function() {

		var m_html =
				'<div class="xkit-others-panel">' +
				'<div class="title">XKit Editor</div>' +
				'<div class="description">' +
					"XKit comes with the Extension Editor embedded. This is used to write new extensions and update the existing. You can use it to write extensions if you are good with JavaScript and the XKit framework." +
				"</div>" +
				'<div class="bottom-part">' +
					'<a href="http://www.tumblr.com/xkit_editor" class="xkit-button block">Open Editor</a>' +
				"</div>" +
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

	},

	flags: function() {

		var m_html =
				'<div class="xkit-scary-warning">' +
				"<b>This is for advanced users only.</b><br/>" +
				"Please proceed with caution or leave if you are unsure of " +
				"what you are doing.<br/>Support is not provided if you break something." +
				'</div><div id="xkit-flags-list">';

		for (var flag in XKit.flags) {

			if (XKit.flags[flag] === true) {
				m_html = m_html + '<div data-flag-id="' + flag + '" class="xkit-data-flag-button xkit-checkbox selected"><b>&nbsp;</b>' + flag + "</div>";
			} else {
				m_html = m_html + '<div data-flag-id="' + flag + '" class="xkit-data-flag-button xkit-checkbox"><b>&nbsp;</b>' + flag + "</div>";
			}

		}

		m_html = m_html + "</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);

		$("#xkit-flags-list .xkit-data-flag-button").click(function() {

			var flag_id = $(this).attr('data-flag-id');
			if (XKit.read_flag(flag_id) === false) {
				XKit.set_flag(flag_id, true);
				$(this).addClass("selected");
			} else {
				XKit.set_flag(flag_id, false);
				$(this).removeClass("selected");
			}

		});

		$("#xkit-extensions-panel-right").nanoScroller();

	},

	show_xcloud: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "xcloud") { return; }
		XKit.extensions.xkit_preferences.current_panel = "xcloud";

		var m_html = "";
		var show_error = false;

		if (XKit.installed.check("xcloud") === false) {
			show_error = true;
		} else {
			if (XKit.extensions.xcloud.running === false) {
				show_error = true;
			}
		}

		if (show_error) {

			m_html =
					'<div id="xcloud-not-found-container">' +
					'<div id="xcloud-not-found">' +
						'<b>XCloud is not installed/enabled.</b><br/>' +
						'XCloud allows you to synchronize your XKit settings across devices.<br/>' +
						'You can get it using the "Get Extensions" tab on the bottom.' +
					'</div></div>';

		} else {

			m_html = XKit.extensions.xcloud.panel();

		}

		$("#xkit-control-panel-inner").html(m_html);

		if (!show_error) {
			XKit.extensions.xcloud.panel_appended();
		}

	},

	show_about: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "about") { return; }
		XKit.extensions.xkit_preferences.current_panel = "about";

		var m_html =
				'<div id="xkit-logo-big">&nbsp;</div>' +
				'<div id="xkit-about-window-text">' +
					'<div class="title">XKit Version ' + XKit.version + '</div>' +
					'<div class="subtitle">The Extension Framework for Tumblr.</div>' +
					'<div class="copyright">&copy; 2011 - 2014 STUDIOXENIX</div>' +
					'<div class="copyright">&copy; 2015 - 2016 the New XKit Team</div>' +
					'<div>XKit Patches v. ' + XKit.installed.version('xkit_patches') + '</div>' +
					'<div class="thanks">The New XKit Team would like to thank all of the myriad users and, ' +
					'contributors who have worked to make this plugin what it is today. ' +
					"Above all we would like to thank Atesh, the original XKit Guy, " +
					'without whom we all would have been lost to the outer darkness some time ago.</div>' +
				'</div>' +
				'<div id="xkit-about-window-links">' +
					'<a href="https://new-xkit-extension.tumblr.com">New XKit Tumblr</a>' +
					'<a href="#" id="xkit-open-credits">Credits</a>' +
					'<a href="http://new-xkit-support.tumblr.com/support">Support</a>' +
					'<a href="https://github.com/new-xkit/XKit/wiki">Documentation</a>' +
				'</div>';
		$("#xkit-control-panel-inner").html(m_html);

		$("#xkit-open-credits").click(function() {

			XKit.window.show("Credits",
					'XKit uses <a href="www.jquery.com">jQuery and jQuery UI</a> by jQuery Foundation, ' +
					'<a href="https://github.com/timrwood/moment/">moment.js</a> by Tim Wood, ' +
					'<a href="http://code.drewwilson.com/entry/tiptip-jquery-plugin">TipTip</a> by Drew Wilson and ' +
					'<a href="http://jamesflorentino.github.io/nanoScrollerJS/">nanoScroll</a> by James Florentino. ' +
					'<br/><br/>' +
					'The original XKit extension was written by <a href="http://www.studioxenix.com/">STUDIOXENIX</a>, a one-man entity.<br/><br/>' +
					'All trademarks are the property of their respective owners.',
				"info", '<div class="xkit-button default" id="xkit-close-message">OK</div>');

			return false;
		});

	},

	destroy: function() {
		$("#new-xkit-control").remove();
		XKit.tools.remove_css('mobile_xkit_menu');
		this.running = false;
	}
});
