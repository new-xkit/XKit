//* TITLE XKit Preferences **//
//* VERSION 7.6.12 **//
//* DESCRIPTION Lets you customize XKit **//
//* DEVELOPER new-xkit **//

XKit.extensions.xkit_preferences = new Object({

	running: false,
	current_panel: "",

	default_extension_icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cdefs%3E%3ClinearGradient id='grad' spreadMethod='repeat' x1='0' y1='0' x2='0' y2='100%'%3E%3Cstop offset='0' stop-color='%23377db6'/%3E%3Cstop offset='1' stop-color='%234cb0db'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1' height='1' fill='url(%23grad)'/%3E%3Cpath d='M0 0v.037l.12.12H0v.05h.155v.267H0v.052h.155v.267H0v.05h.12L0 .964V1h.036L.155.88V1h.05V.844h.268V1h.051V.844h.27V1h.048V.88L.963 1H1V.966L.878.844H1V.793H.842V.526H1V.474H.842V.207H1v-.05H.878L1 .033V0H.964L.842.122V0H.794v.156h-.27V0h-.05v.156H.205V0H.155v.12L.035 0zm.242.207H.33a.342.342 0 00-.052.035zm.426 0h.089L.72.243A.342.342 0 00.668.207zM.473.212v.226l-.16-.16a.287.287 0 01.16-.066zm.051 0a.29.29 0 01.161.066L.524.44zm.27.029v.093A.345.345 0 00.756.28zM.206.242L.24.278a.346.346 0 00-.035.053zm.071.072l.16.16H.212a.289.289 0 01.066-.16zm.444 0c.038.044.062.1.068.16H.56zm-.51.212h.227l-.161.16a.287.287 0 01-.066-.16zm.35 0h.228a.286.286 0 01-.068.16zM.523.56l.161.161a.29.29 0 01-.161.066zm-.05 0v.227a.287.287 0 01-.16-.066zm.32.105v.093L.756.721A.345.345 0 00.794.666zM.206.669c.01.018.021.037.035.053L.206.758zM.72.757l.036.036H.668A.342.342 0 00.72.757zM.278.758a.342.342 0 00.051.035H.243z' fill='%23ffffff80'/%3E%3C/svg%3E",
	kernel_extension_icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cdefs%3E%3ClinearGradient id='grad' spreadMethod='repeat' x1='0' y1='0' x2='0' y2='100%'%3E%3Cstop offset='0' stop-color='%23377db6'/%3E%3Cstop offset='1' stop-color='%234cb0db'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1' height='1' fill='url(%23grad)'/%3E%3Cpath d='M.268.126a.155.155 0 00-.1.043C.117.22.115.306.146.396.156.43.177.465.197.5.177.535.157.57.145.604.115.694.116.78.169.831.22.884.306.886.396.855A.608.608 0 00.5.803c.035.02.07.04.104.052.09.03.175.029.227-.024C.884.78.886.694.855.604.844.571.823.535.803.5A.608.608 0 00.855.396C.885.306.884.22.831.169.78.116.694.114.604.145.571.156.535.177.5.197A.608.608 0 00.396.145a.322.322 0 00-.128-.02zm.006.048A.265.265 0 01.38.19c.022.007.047.023.072.036C.427.243.404.265.38.286A.07.069 45 00.343.273a.07.069 45 00-.07.069.07.069 45 00.012.037C.265.404.243.427.225.452.214.427.198.402.19.38.163.3.17.237.203.203a.111.111 0 01.071-.03zm.452 0c.03.002.054.012.07.03C.83.236.837.298.81.38.802.402.786.427.774.45A.883.883 0 00.548.226C.573.213.598.197.62.19A.265.265 0 01.726.174zM.5.25A.81.81 0 01.75.5C.73.531.703.56.677.591a.07.069 45 00-.02-.003.07.069 45 00-.069.069.07.069 45 00.003.02C.561.703.531.73.501.75A.804.804 0 01.25.5C.27.47.296.44.322.41a.07.069 45 00.021.003.07.069 45 00.069-.069.07.069 45 00-.003-.02C.439.295.469.268.5.25zm0 .153A.098.097 45 00.403.5.098.097 45 00.5.597.098.097 45 00.597.5.098.097 45 00.5.403zM.226.548A.883.883 0 00.45.774C.427.786.402.802.38.81.3.837.237.83.203.797.17.763.163.7.19.62.197.598.213.573.226.548zm.548 0C.786.574.802.599.81.62.837.7.83.763.797.797.763.83.7.837.62.81.598.802.573.786.55.774.573.757.597.736.62.715a.07.069 45 00.037.011.07.069 45 00.07-.069A.07.069 45 00.714.62C.735.597.757.573.774.55z' fill='%23ffffff80'/%3E%3C/svg%3E",

	button_svgs: {
		normal: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' width='22'><path d='M.5 0a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5zM.15.316H.23l.31.368H.459L.423.641.386.684H.305L.382.592.345.55.231.684H.15L.304.5zm.155 0h.081l.31.368H.613zm.154 0h.082l.036.043.037-.043h.081L.618.408.655.45.769.316H.85L.695.5.85.684H.77z'/></svg>",
		halloween: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 0.958' width='25'><path d='M.545 0C.514.002.488.034.475.062.458.104.444.167.476.199c.012.012.037.01.05 0C.547.18.53.137.543.11.558.083.609.073.606.042.603.017.569-.002.545.001zM.337.204C.129.204 0 .373 0 .58s.169.377.377.377C.39.958.305.894.297.857.333.89.437.954.448.95A.29.29 0 0 0 .5.937c.017.006.034.011.052.014a.589.589 0 0 0 .15-.094C.696.894.61.958.623.958A.377.377 0 0 0 1 .581C1 .373.871.204.663.204c-.01 0 .066.02.077.089A.512.512 0 0 0 .604.208a.293.293 0 0 0-.027.005c-.004.001.045.024.054.07a.18.18 0 0 0-.1-.057L.5.238A2.361 2.361 0 0 0 .468.226a.179.179 0 0 0-.1.058c.01-.047.06-.07.055-.07L.396.207A.524.524 0 0 0 .26.293c.011-.07.087-.09.077-.09zM.159.4h.08l.3.36H.46L.425.718.389.761h-.08L.386.67.349.628.24.761h-.08l.15-.18zm.15 0h.08l.301.36H.611zm.151 0h.08l.035.043L.611.4h.08l-.076.09.036.043L.76.4h.08l-.15.18.15.18h-.08z'/></svg>",
		christmas: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1.096' width='26'><path d='M.467 0v.087L.405.026.358.072.436.15H.27L.188.294.159.187.095.205l.022.084L.042.245.009.303l.075.043L0 .37l.017.064.107-.028L.04.548l.083.143L.017.663 0 .727.084.75.009.793l.033.058.075-.044-.022.085.064.017.029-.107.082.144h.166l-.078.077.047.048.062-.062v.087h.066v-.087l.062.062.047-.048L.564.946H.73L.812.802.841.91.905.892.883.807l.075.044L.99.793.916.75 1 .727.983.663.876.69.96.548.876.405l.107.028L1 .37.916.346.99.303.958.245.883.29.905.205.841.187.812.294.73.15H.564L.642.073.595.025.533.087V0zM.165.371h.078l.296.354H.461L.426.683.39.725H.313L.387.636.352.595l-.11.13H.166L.313.548zm.148 0H.39l.296.354H.61zm.148 0h.078l.035.042L.61.371h.078L.613.46l.035.042.11-.13h.077L.687.547l.148.177H.757z'/></svg>"
	},

	hide_xcloud_if_not_installed: false,

	dark_mode: `
		:root {
			--xkit-primary: #222;
			--xkit-on-primary: #EEE;
			--xkit-secondary: #444;
			--xkit-on-secondary: #AAA;
			--xkit-05-overlay: rgba(255,255,255,.05);
			--xkit-11-overlay: rgba(255,255,255,.11);
			--xkit-22-overlay: rgba(255,255,255,.22);
			--xkit-33-overlay: rgba(255,255,255,.33);
			--xkit-44-overlay: rgba(255,255,255,.44);
			--xkit-53-overlay: rgba(255,255,255,.53);
			--xkit-83-overlay: rgba(255,255,255,.83);
			--xkit-white-05-overlay: rgba(0,0,0,.05);
			--xkit-white-11-overlay: rgba(0,0,0,.11);
			--xkit-white-22-overlay: rgba(0,0,0,.22);
			--xkit-white-33-overlay: rgba(0,0,0,.33);
			--xkit-white-44-overlay: rgba(0,0,0,.44);
			--xkit-white-53-overlay: rgba(0,0,0,.53);
			--xkit-white-83-overlay: rgba(0,0,0,.83);
			--xkit-05-shadow: none;
			--xkit-11-shadow: none;
			--xkit-22-shadow: none;
			--xkit-33-shadow: none;
			--xkit-44-shadow: none;
			--xkit-53-shadow: none;
			--xkit-83-shadow: none;
			--xkit-white-05-shadow: rgba(0,0,0,.05);
			--xkit-white-11-shadow: rgba(0,0,0,.11);
			--xkit-white-22-shadow: rgba(0,0,0,.22);
			--xkit-white-33-shadow: rgba(0,0,0,.33);
			--xkit-white-44-shadow: rgba(0,0,0,.44);
			--xkit-white-53-shadow: rgba(0,0,0,.53);
			--xkit-white-83-shadow: rgba(0,0,0,.83);
			--xkit-border: #666;
			--xkit-dark-border: #777;
			--xkit-url-field: rgb(240,240,240);
			--xkit-on-url-field: rgb(100,100,100);
			--xkit-on-light-separator: #EEE;
			--xkit-on-separator: #AAA;
			--xkit-checkbox: #cedff4;
			--xkit-on-checkbox: #BBB;
			--xkit-on-checkbox-hover: #DDD;
			--xkit-checkbox-selected: #dcecff;
			--xkit-checkbox-selected-hover: #cedff4;
			--xkit-button: #333;
			--xkit-on-button: #BBB;
			--xkit-button-border: #444;
			--xkit-button-active: black;
			--xkit-on-button-active: white;
			--xkit-button-hover: black;
			--xkit-on-button-hover: #DDD;
			--xkit-button-hover-border: black;
			--xkit-button-disabled: rgb(240, 240, 240);
			--xkit-on-button-disabled: rgb(170,170,170);
			--xkit-button-disabled-border: rgb(160,160,160);
			--xkit-progress-bar: rgb(240,240,240);
			--xkit-window-error: #c31700;
			--xkit-window-warning: #c54e03;
			--xkit-window-question: #2b639d;
			--xkit-window-info: #66a820;
			--xkit-notification-accent: white;
			--xkit-notification-error: #c21900;
			--xkit-notification-ok: #248a00;
			--xkit-notification-warning: #dc5e0b;
			--xkit-notification-warning-sticky: rgba(255, 204, 150, .7);
			--xkit-notification-mail: #238ec4;
			--xkit-wide-panel: black;
			--xkit-msg-on-display: #AAA;
		}
		#xkit-logo-big {
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 0.264'%3E%3Cpath d='M.222 0l.221.264h.058L.391.132.5 0H.443L.361.097.335.066.391 0H.332L.306.031.28 0zM.11 0l.221.264h.059L.169 0zM0 0l.11.132L0 .264h.058L.14.167l.026.031-.055.066h.058L.195.233l.027.031H.28L.058 0z' fill='%23888'/%3E%3Cpath d='M.942.044V.08H.895v.136H.857V.08H.81V.044zm-.188 0h.038v.171H.754zM.6.044H.64V.12L.69.045h.046L.682.117.74.214H.693L.654.144.64.161v.055H.6zM.554 0l-.11.132.11.132H1V0z' fill='%230371d2'/%3E%3C/svg%3E")
		}
	`,

	run: function() {

		this.running = true;

		XKit.tools.init_css("xkit_preferences");

		let holiday = "normal";
		const date = (new Date()).getDate();
		const month = (new Date()).getMonth() + 1;

		if (date === 31 && month === 10) {
			holiday = "halloween";
		} else if (date >= 24 && date <= 26 && month === 12) {
			holiday = "christmas";
		}

		var m_html =
			`<div id="xkit_button" class="tab iconic tab_xkit">
				<button class="tab_anchor" title="XKit Control Panel" tabindex="7">
					<p class="tab_anchor_text">XKit Control Panel</p>
					${this.button_svgs[holiday]}
				</button>
				<div class="tab_notice tab-notice--outlined xkit_notice_container">
					<span class="tab_notice_value">0</span>
				</div>
			</div>`;

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

		let button_ready = Promise.resolve();
		if (XKit.page.react) {
			button_ready = XKit.interface.translate("Account").then(account_label => {
				$(`header div div:has([aria-label="${account_label}"])`).before(m_html);
				$(".xkit--react #xkit_button").attr('tabindex', '0');
			});
		} else {
			$("#account_button").before(m_html);
			$("#account_button > button").attr("tabindex", "8");
		}

		button_ready.then(() => {
			if (XKit.storage.get("xkit_preferences", "shown_welcome_bubble") !== "true" && XKit.interface.where().dashboard) {
				this.show_welcome_bubble();
			}

			$("#xkit_button").click(XKit.extensions.xkit_preferences.open);

			const unread_mail_count = XKit.extensions.xkit_preferences.news.unread_count();
			if (unread_mail_count > 0) {
				$(".xkit_notice_container > .tab_notice_value").html(unread_mail_count);
				$(".xkit_notice_container").addClass("tab-notice--active");
			}
		});

		$(".no-js").removeClass("no-js"); // possibly unnecessary // mobile stuff
		$(".mobile-logo").html(mobile_html); // mobile stuff

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
							XKit.window.show("Well, this is embarrassing.",
								"Tumblr would not allow me to follow the New XKit blog for you.<br><br>" +
								"You can follow it manually via the link below instead.",
								"error",
								'<a class="xkit-button default" href="https://new-xkit-extension.tumblr.com" target="_blank">New XKit Blog</a>' +
								'<div class="xkit-button" id="xkit-close-message">OK</div>'
							);
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

		var clean_list = ["unreverse", "filter_by_type", "XIM", "yahoo", "reblog_as_text", "reblog_yourself", "alternative_timestamps", "autoloadimages", "soft_refresh", "lethe"];

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

			XKit.notifications.add("New XKit removed <b>" + removed_list.length + "</b> obsolete extension(s). Click here for more information.",
				"warning", true, function() {
					XKit.window.show(
						"Spring Cleaning",

						"Due to them not working correctly anymore, the following obsolete extensions have been removed to speed up your computer:" +
						XKit.extensions.xkit_preferences.spring_cleaning_m_list_html +
						"For more information, including the reason(s) why they were removed, please check the &quot;More information&quot; link below.<br>" +
						"(The link will open in a new tab.)",

						"warning",

						'<div id="xkit-close-message" class="xkit-button default">OK</div>' +
						'<a href="https://github.com/new-xkit/XKit/wiki/Removed-Extensions#why-was-this-extension-removed" target="_blank" class="xkit-button">More information</a>'
					);
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
				console.log("Checking for XKit News");
				// set it so we don't have to ram the server.
				var to_save = n_ms.toString();
				XKit.storage.set("xkit_preferences", "last_news_check", to_save);
			} else {
				console.log("Skipping News update check");
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
				console.error("Unread_Count failed, unknown/corrupt JSON");
				prev_objects = [];
				XKit.storage.set("xkit_preferences", "news", JSON.stringify(prev_objects));
				return 0;
			}

			var show_all = XKit.tools.get_setting("xkit_show_feature_updates", "true") === "true";

			var m_return = 0;
			for (var i = 0; i < prev_objects.length; i++) {
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
				console.log("News " + id + " could not be pushed: already exists.");
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
				console.log("News " + id + " pushed successfully.");
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
				console.log("News " + id + " pushed successfully.");
			} else {
				console.error("Can not save news_object with read flag. Storage might be full.");
			}
			var unread_news_count = XKit.extensions.xkit_preferences.news.unread_count();
			if (unread_news_count === 0) {
				$(".xkit_notice_container").removeClass("tab-notice--active");
				setTimeout(function() { $(".xkit_notice_container > .tab_notice_value").html("0"); }, 300);
			} else {
				$(".xkit_notice_container > .tab_notice_value").html(unread_news_count);
			}

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
		var position = $("#xkit_button").offset();

		$("#xkit-welcoming-bubble").css("top", position.top + 50 + "px");
		$("#xkit-welcoming-bubble").css("left", (position.left - ($("#xkit-welcoming-bubble").width() / 2)) + 10 + "px");

		$("#xkit_button").css('z-index', '3000');

	},

	scroll_pos: $(window).scrollTop(),

	open: function() {
		if (XKit.tools.get_setting("xkit_match_tumblr_theme", "true") === "true") {
			if (getComputedStyle(document.documentElement).getPropertyValue("--rgb-black").replace(/\s+/g, "") != "0,0,0") {
				XKit.tools.add_css(XKit.extensions.xkit_preferences.dark_mode, 'dark-mode');
			} else {
				XKit.tools.remove_css('dark-mode');
			}
		} else if (XKit.tools.get_setting("xkit_show_dark_mode", "false") === "true") {
			XKit.tools.add_css(XKit.extensions.xkit_preferences.dark_mode, 'dark-mode');
		}

		var open_news = $(".xkit_notice_container.tab-notice--active").length > 0;
		$("#xkit_button").addClass("active");
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
		$("#xkit-control-panel").keydown(event => event.stopPropagation());
		$("#xkit-control-panel-shadow").fadeIn('slow');
		$("#xkit-control-panel-shadow").click(XKit.extensions.xkit_preferences.close);

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
				'<div class="xkit-button xkit-tour-cancel">Cancel Tour</div>' +
				'<div class="xkit-button" id="xkit-welcome-back">Hold up, I\'m an existing user!</div>');

			$(document).on('click', '.xkit-tour-cancel', function() {

				XKit.window.close();

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

			$("#xkit-welcome-back").click(function() {

				XKit.window.show("Welcome back!",
					"<strong>No need for a tour if you're just reinstalling!</strong><br>" +
					"Just log into XCloud and restore your settings or import a local backup to pick up where you left off.", "info",
					'<div class="xkit-button default xkit-tour-cancel">OK</div>');
				$("#xkit-cp-tab-xcloud").trigger('click');

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

		$(document).on('keydown', XKit.extensions.xkit_preferences.on_modal_keydown);
	},

	close: function() {
		$("#xkit_button").removeClass("active");
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

		$(document).off('keydown', XKit.extensions.xkit_preferences.on_modal_keydown);
	},

	on_modal_keydown: function(event) {
		// Handle esc key to close preferences modal
		if (event.keyCode == 27) {
			XKit.extensions.xkit_preferences.close();
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
						XKit.extensions.xkit_main.load_extension_preferences(m_extension_id);
						if (XKit.installed.enabled(m_extension_id)) {
							XKit.extensions[m_extension_id].run();
						}
					} catch (e) {
						console.error("[XKit Preferences] Could not run " + m_extension_id + ": " + e.message);
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

			console.error("Can't load extension panel: Extension undefined.");
			$("#xkit-extension-delete-trouble").click(function() {

				if (this_is_internal === true) { return; }

				try {
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				} catch (e) {
					console.error("Unable to shutdown extension " + XKit.extensions.xkit_preferences.current_open_extension_panel);
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

		var xkit_developers = ["studioxenix", "new-xkit", "dlmarquis", "hobinjk", "thepsionic", "nightpool", "blackjackkent", "wolvan", "bvtsang", "0xazure", "aprilsylph"];
		if (xkit_developers.includes(m_extension.developer.toLowerCase()) === false) {
			m_html = m_html + '<div class="xkit-third-party">third party extension</div>';
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

		} else if (XKit.installed.enabled(extension_id) === false) {

			m_html = m_html + '<div id="xkit-extension-panel-no-settings">Please enable this extension to customize it.</div>';

		} else if (typeof XKit.extensions[extension_id].preferences !== "undefined") {

			m_html = m_html + '<div id="xkit-extension-panel-settings">' + XKit.extensions.xkit_preferences.return_extension_settings(extension_id) + "</div>";

		} else {

			m_html = m_html + '<div id="xkit-extension-panel-settings"></div>';
		}
		$("#xkit-extensions-panel-right-inner").html(m_html);
		// Pass control to the extension to draw custom control panel:
		if (typeof XKit.extensions[extension_id].cpanel !== "undefined" && XKit.installed.enabled(extension_id) !== false) {
			// Call it:
			XKit.extensions[extension_id].cpanel($("#xkit-extension-panel-settings"));
		}

		$(".xkit-third-party").click(function() {

			XKit.window.show(
				"Third Party Extension",

				"This extension was created by a developer not part of the New XKit team." +
				`<div class="xkit-third-party-credit">
					This extension was developed by
					<a href="https://github.com/${m_extension.developer}" target="_blank">
						${m_extension.developer}
					</a>
				</div>` +
				"All extensions contributed to the XKit Extension Gallery are reviewed and " +
				"maintained by us. Feel free to send us bug reports or feature requests for them.",

				"info",

				'<div id="xkit-close-message" class="xkit-button default">OK</div>'
			);

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
				try {
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				} catch (e) {
					console.error("Unable to shutdown extension " + XKit.extensions.xkit_preferences.current_open_extension_panel);
				}
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

			XKit.window.show(
				`Uninstall ${m_ext.title}?`,
				"This extension will be deleted from your computer. " +
				"If you change your mind, you can re-download it from the extension gallery later.<br><br>" +
				"You can also choose to purge this extension completely. " +
				"This will delete any data stored by it, including your preferences.<br>" +
				'<div class="xkit-checkbox" id="xkit-purge-extension"><b>&nbsp;</b>Delete ALL data stored by this extension</div>',

				"question",

				'<div id="xkit-extension-yes-uninstall" class="xkit-button default">Yes, uninstall</div>' +
				'<div id="xkit-close-message" class="xkit-button">Cancel</div>'
			);

			$("#xkit-purge-extension").click(function() {
				$(this).toggleClass("selected");
				if ($(this).hasClass("selected")) {
					$("#xkit-extension-yes-uninstall").text("Purge this extension");
				} else {
					$("#xkit-extension-yes-uninstall").text("Yes, uninstall");
				}
			});

			$("#xkit-extension-yes-uninstall").click(function() {

				if ($(this).hasClass("disabled") === true) { return; }

				$(this).addClass("disabled");
				$(this).html("Please wait, uninstalling...");

				try {
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				} catch (e) {
					console.error("Unable to shutdown extension " + XKit.extensions.xkit_preferences.current_open_extension_panel);
				}
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					if ($("#xkit-purge-extension").hasClass("selected")) {
						XKit.storage.clear(XKit.extensions.xkit_preferences.current_open_extension_panel);
					}
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
				try {
					XKit.extensions[extension_id].destroy();
				} catch (e) {
					console.error("Unable to shutdown extension " + extension_id);
				}
				$(this).removeClass("selected");
			} else {
				XKit.installed.enable(m_ext);
				try {
					XKit.extensions[extension_id].run();
				} catch (e) {
					console.error("Unable to run extension " + extension_id);
				}
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
					console.error("Can not run " + extension_id + ": " + e.message);
				}
			}, 10);
		} catch (e) {
			// Unknown what to do here.
			console.error("Can not run " + extension_id + ": " + e.message);
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
						'<div data-pname="appearance" class="xkit-extension text-only">Appearance</div>' +
						'<div data-pname="reset" class="xkit-extension text-only">Reset XKit</div>' +
						'<div data-pname="config" class="xkit-extension text-only">Export Configuration</div>' +
						'<div data-pname="storage" class="xkit-extension text-only">Storage</div>' +
						'<div class="xkit-extension text-only separator">Notifications</div>' +
						'<div data-pname="news" class="xkit-extension text-only">News Notifications</div>' +
						'<div data-pname="updates" class="xkit-extension text-only">Update Notifications</div>' +
						'<div class="xkit-extension text-only separator">Advanced Settings</div>' +
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

			if ($this.attr('data-pname') === "appearance") {
				XKit.extensions.xkit_preferences.show_others_panel_appearance();
			}
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
					'<div class="bottom-part" style="line-height: 24px;">' +
						"Please note that the more storage you use, the longer it will take for XKit to boot up. " +
						"You should try to keep the storage usage under 5 megabytes for the best performance. " +
						"Disable and remove the extensions you don't use if you feel your XKit is acting sluggish." +
					"</div>" +
					'<div class="bottom-part" style="line-height: 24px;">' +
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

	show_others_panel_appearance: function() {

		var m_html = '<div class="xkit-others-panel">' +
				'<div class="title">Appearance</div>' +
				'<div class="description">' +
					"The XKit Control Panel can be styled in dark mode.<br>" + 
					"This does not affect any other XKit extensions." +
				'</div>' +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-enable-match-tumblr-theme" class="xkit-checkbox"><b>&nbsp;</b>Match Tumblr Theme</div>' +
				'</div>' +
				'<div class="bottom-part">' +
					'<div id="xkit-panel-enable-dark-mode" class="xkit-checkbox"><b>&nbsp;</b>Dark Mode</div>' +
				'</div>' +
				'</div>';

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_match_tumblr_theme", "true") === "true") {
			$("#xkit-panel-enable-match-tumblr-theme").addClass("selected");
			$("#xkit-panel-enable-dark-mode").addClass("disabled");
		}

		$("#xkit-panel-enable-match-tumblr-theme").click(function() {

			if (XKit.tools.get_setting("xkit_match_tumblr_theme", "true") === "false") {
				$("#xkit-panel-enable-match-tumblr-theme").addClass("selected");
				$("#xkit-panel-enable-dark-mode").addClass("disabled");
				if (getComputedStyle(document.documentElement).getPropertyValue("--rgb-black").replace(/\s+/g, "") != "0,0,0") {
					XKit.tools.add_css(XKit.extensions.xkit_preferences.dark_mode, 'dark-mode');
				} else {
					XKit.tools.remove_css('dark-mode');
				}
				XKit.tools.set_setting("xkit_match_tumblr_theme", "true");
			} else {
				$("#xkit-panel-enable-match-tumblr-theme").removeClass("selected");
				$("#xkit-panel-enable-dark-mode").removeClass("disabled");
				if (XKit.tools.get_setting("xkit_show_dark_mode", "false") === "true") {
					XKit.tools.add_css(XKit.extensions.xkit_preferences.dark_mode, 'dark-mode');
				} else {
					XKit.tools.remove_css('dark-mode');
				}
				XKit.tools.set_setting("xkit_match_tumblr_theme", "false");
			}

		});

		if (XKit.tools.get_setting("xkit_show_dark_mode", "false") === "true") {
			$("#xkit-panel-enable-dark-mode").addClass("selected");
		}

		$("#xkit-panel-enable-dark-mode").click(function() {

			if (XKit.tools.get_setting("xkit_show_dark_mode", "false") === "false") {
				$("#xkit-panel-enable-dark-mode").addClass("selected");
				XKit.tools.add_css(XKit.extensions.xkit_preferences.dark_mode, 'dark-mode');
				XKit.tools.set_setting("xkit_show_dark_mode", "true");
			} else {
				$("#xkit-panel-enable-dark-mode").removeClass("selected");
				XKit.tools.remove_css('dark-mode');
				XKit.tools.set_setting("xkit_show_dark_mode", "false");
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

		$("#xkit-extensions-panel-right-inner").html(

			'<div class="xkit-others-panel">' +
				'<div class="title">Export Configuration</div>' +
				'<div class="description">' +
					"This panel lets you export parts of your XKit configuration for others to view. " +
					"Attaching or linking to one of these when you submit a bug report will help us fix your problem sooner.<br><br>" +
					'<strong style="font-weight: bold;">These files are for troubleshooting purposes only.</strong><br>' +
					"They cannot be imported - use an XCloud export if you are looking to move your configuration between browsers or machines." +
				"</div>" +
				'<div class="bottom-part">' +
					'<p>Information about what extensions you have installed and enabled:</p>' +
					'<div id="xkit-panel-extension-info" class="xkit-button block">Extension Info Export</div>' +
					"Almost always required." +
				"</div>" +
				'<div class="bottom-part">' +
					"<p>Your full XKit storage export:</p>" +
					'<div id="xkit-panel-full-config" class="xkit-button block">Full Configuration Export</div>' +
					"This includes information that may be sensitive, including your Tumblr URLs, list of blacklisted keywords, and more. " +
					"Think carefully before sharing this information." +
				"</div>" +
			"</div>"

		);

		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-panel-extension-info").click(function() {

			var text = "XKit version " + XKit.version + "\n" +
					"extensions:\n" + XKit.installed.list().map(i => "   " + i + ": " + XKit.installed.version(i) + (XKit.installed.enabled(i) ? "" : " (disabled)")).join("\n");
			var timestamp = new Date();

			XKit.tools.make_file("XKit Basic Export " + timestamp.getTime() + ".txt", text);
		});

		$("#xkit-panel-full-config").click(function() {

			var text = JSON.stringify(XKit.tools.dump_config());
			var timestamp = new Date();

			XKit.tools.make_file("XKit Full Export " + timestamp.getTime() + ".txt", text);
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
					'<span class="title">XKit Version ' + XKit.version + '</span>' +
					'<span>XKit Patches v. ' + XKit.installed.version('xkit_patches') + '</span>' +
					'<div class="subtitle">The Extension Framework for Tumblr.</div>' +
					'<div class="copyright">&copy; 2011 - 2014&ensp;STUDIOXENIX</div>' +
					'<div class="copyright">&copy; 2015 - 2018&ensp;the New XKit Team</div>' +
					'<div class="thanks">The New XKit Team would like to thank all of the myriad users and ' +
					'<a href="https://github.com/new-xkit/XKit/contributors" target="_blank">contributors</a> who have worked to make this plugin what it is today. ' +
					"Above all we would like to thank Atesh, the original XKit Guy, " +
					'without whom we all would have been lost to the outer darkness some time ago.</div>' +
				'</div>' +
				'<div id="xkit-about-window-links">' +
					'<a href="https://new-xkit-extension.tumblr.com" target="_blank">New XKit Tumblr</a>' +
					'<a href="#" id="xkit-open-credits">Credits</a>' +
					'<a href="https://new-xkit-support.tumblr.com/support" target="_blank">Support</a>' +
					'<a href="https://github.com/new-xkit/XKit/wiki" target="_blank">Documentation</a>' +
				'</div>';
		$("#xkit-control-panel-inner").html(m_html);

		$("#xkit-open-credits").click(function() {

			XKit.window.show("Credits",
					'XKit uses <a href="https://jquery.com/" target="_blank">jQuery and jQuery UI</a> by jQuery Foundation, ' +
					'<a href="https://momentjs.com/" target="_blank">moment.js</a> by Tim Wood, ' +
					'<a href="https://github.com/drewwilson/TipTip" target="_blank">TipTip</a> by Drew Wilson and ' +
					'<a href="https://jamesflorentino.github.io/nanoScrollerJS/" target="_blank">nanoScroll</a> by James Florentino. ' +
					'<br/><br/>' +
					'The original XKit extension was written by STUDIOXENIX, a one-man entity.<br/><br/>' +
					'All trademarks are the property of their respective owners.',
				"info", '<div class="xkit-button default" id="xkit-close-message">OK</div>');

			return false;
		});

	},

	destroy: function() {
		$("#xkit_button").remove();
		XKit.tools.remove_css('mobile_xkit_menu');
		XKit.tools.remove_css('dark-mode');
		this.running = false;
	}
});
