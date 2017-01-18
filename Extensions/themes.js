//* TITLE Themes **//
//* VERSION 0.1.3 **//
//* DESCRIPTION Themes for your dashboard **//
//* DETAILS This extension allows you to install themes from the XKit Theme Gallery onto your dashboard. New themes are added regularly, and if you are good with CSS, send an ask to xkit-dev.tumblr.com to get your theme added here! **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.themes = new Object({

	running: false,
	current_theme: "",
	gallery_themes_file: [],
	gallery_themes_contents: [],
	gallery_themes_version: [],
	m_theme_count: 0,

	run: function() {
		this.running = true;

		if (!XKit.interface.is_tumblr_page()) {
			return;
		}


		this.current_theme = XKit.storage.get("themes", "my_theme", "");
		if (typeof this.current_theme === "undefined") {
			this.current_theme = "";
		}

		XKit.tools.init_css("themes");

		if (this.current_theme !== "") {
			if (typeof XKit.extensions.yahoo !== "undefined") {
				if (XKit.extensions.yahoo.running) {
					return;
				}
			}
			this.load_theme();
		}


	},

	cpanel_add: function(obj) {

		var m_class = "";
		if (obj.file === XKit.extensions.themes.current_theme) {
			m_class = "selected";
		}

		XKit.extensions.themes.gallery_themes_file.push(obj.file);
		XKit.extensions.themes.gallery_themes_contents.push(obj.contents);
		XKit.extensions.themes.gallery_themes_version.push(obj.version);

		var m_html = "<div class=\"xkit-theme-obj " + m_class + "\" data-theme-id=\"" + obj.file + "\">" +
					"<div class=\"xkit-theme-title\">" + obj.name + "</div>" +
					"<div class=\"xkit-theme-description\">" + obj.description + "</div>" +
					"<div class=\"xkit-theme-developer\">by " + obj.developer + "</div>" +
				"</div>";
		$("#xkit-themes-theme-list").append(m_html);
		XKit.extensions.themes.m_theme_count++;

	},

	replace_all: function(string, find, replace) {

		find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return string.replace(new RegExp(find, 'g'), replace);

	},

	load_theme: function() {

		$("#xkit-themes-user-theme").remove();
		var m_file_contents = XKit.storage.get("themes", "my_theme_contents", "");

		m_file_contents = XKit.extensions.themes.replace_all(m_file_contents, "#content", ".l-content");
		m_file_contents = XKit.extensions.themes.replace_all(m_file_contents, "#header", ".l-header");

		$("body").append("<style id=\"xkit-themes-user-theme\">" + m_file_contents + "</style>");

	},

	load_gallery_theme: function(theme_name) {

		// Unload the previous theme if loaded.
		$("#xkit-themes-user-theme").remove();

		XKit.storage.set("themes", "my_theme", theme_name);

		// Stop if default theme.
		if (theme_name === "") { return; }

		var m_index = XKit.extensions.themes.gallery_themes_file.indexOf(theme_name);
		if (m_index === -1) {
			XKit.storage.set("themes", "my_theme", "");
			XKit.window.show("Error", "Unable to load theme.", "error", '<div class="xkit-button" id="xkit-close-message">Okay</div>');
			return;
		}

		XKit.storage.set("themes", "my_theme_version", XKit.extensions.themes.gallery_themes_version[m_index]);

		// Voila!
		XKit.storage.set("themes", "my_theme_contents", XKit.extensions.themes.gallery_themes_contents[m_index]);
		XKit.extensions.themes.load_theme();

	},

	cpanel: function(obj) {

		if (typeof XKit.extensions.yahoo !== "undefined") {
			if (XKit.extensions.yahoo.running === true) {
				var yahoo_html = "<div id=\"xkit-themes-loading\"><b>Yoohoo is on</b><br/><small>Please disable the \"Yoohoo!\" before running this extension.</small></div>";
				$(obj).html(yahoo_html);
				return;
			}
		}

		var m_html = "<div id=\"xkit-themes-loading\"><b>Loading theme gallery</b><br/><small>Please wait, I'm fetching the latest themes for you.</small></div>";
		$(obj).html(m_html);

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		XKit.download.page("themes/index.php", function(mdata) {

			if (mdata.server_down === true) {

				$("#xkit-themes-loading").html("<b>Server unreachable</b><br/><small>Please try again later.</small>");
				return;
			}

			$("#xkit-themes-loading").remove();
			XKit.extensions.themes.m_theme_count = 0;
			$(obj).html("<div id=\"xkit-themes-theme-list\"></div>");

			// Create default theme object:
			var def_theme = {
				"name": "Tumblr Default",
				"version": "1",
				"developer": "Tumblr, Inc.",
				"file": "",
				"description": "The standard Tumblr theme"
			};
			XKit.extensions.themes.cpanel_add(def_theme);

			for (var theme in mdata.themes) {
				XKit.extensions.themes.cpanel_add(mdata.themes[theme]);
			}

			$(".xkit-theme-obj").click(function() {

				if ($(this).hasClass("selected") === true) { return; }
				$(".xkit-theme-obj.selected").removeClass("selected");
				XKit.extensions.themes.load_gallery_theme($(this).attr('data-theme-id'));
				$(this).addClass("selected");

			});

			if (XKit.extensions.themes.m_theme_count >= 3) {
				$(".xkit-theme-obj:last-child").css("border-bottom", "0");
			}

			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		});

	},

	destroy: function() {
		XKit.tools.remove_css("themes");
		$("#xkit-themes-user-theme").remove();
		this.running = false;
	}

});
