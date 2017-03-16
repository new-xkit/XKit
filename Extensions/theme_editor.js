//* TITLE Theme Editor **//
//* VERSION 0.1.6 **//
//* DESCRIPTION For theme developers **//
//* DETAILS If you are good with CSS, hop in and make your own theme.<br><br>When installed, this extension disables the standard Themes extension, and adds a button on your sidebar on your dashboard that lets you write and load your own theme. When you are done, you can submit it to xkit-dev.tumblr.com so it can be added to the theme gallery.<br><br>This extension is <b>not recommended</b> for people without CSS/HTML experience and only provided for XKit theme developers. Please disable Themes and Yoohoo! extensions before using. For better editing, Textarea Code Formatter for Chrome or Tabinta for Firefox is recommended. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.theme_editor = new Object({

	running: false,
	testing_theme: "/*\nTheme title\nTheme description (one-line)\nSTUDIOXENIX\n1\n*/\n\nbody {\n\tbackground: red;\n}\n\n#content {\n\tbackground: rgba(155,90,120,0.9);\n}\n\n.post {\n\tbackground: blue;\n\tborder-radius: 20px;\n}\n\n.post_content{\n\tbackground: transparent !important;\n}\n\n#right_column:after {\n\tbackground: none !important;\n}\n\n.controls_section li {\n\tbackground: green;\n}",

	run: function() {
		this.running = true;

		if (!XKit.interface.is_tumblr_page()) {
			return;
		}

		XKit.tools.init_css("theme_editor");

		if (typeof XKit.extensions.themes !== "undefined") {
			if (XKit.extensions.themes.running === true) {
				XKit.extensions.themes.destroy();
			}
		}

		if (typeof XKit.extensions.yahoo !== "undefined") {
			if (XKit.extensions.yahoo.running === true) {
				XKit.extensions.yahoo.destroy();
			}
		}

		var xf_html = '<ul class="controls_section" id="xkit-theme-editor-ul">' +
			'<li class="no_push"><a href="#" class="customize" id="xkit-theme-editor-button">' +
			'<div class="hide_overflow">Edit Theme</div>' +
			'</a></li></ul>';
		$("ul.controls_section:eq(1)").before(xf_html);

		$("#xkit-theme-editor-button").click(function() {

			XKit.extensions.theme_editor.open();

			return false;
		});

		this.load_user_theme();

	},

	load_user_theme: function(passed_theme) {

		// Just in case.
		$("#xkit-themes-user-theme").remove();
		$("#xkit-theme-editor-user-theme").remove();

		var m_theme = XKit.storage.get("theme_editor", "my_theme", XKit.extensions.theme_editor.testing_theme);

		if (typeof passed_theme !== "undefined") {
			m_theme = passed_theme;
		}

		$("body").append("<style id=\"xkit-theme-editor-user-theme\">" + m_theme + "</style>");

	},

	open: function() {

		if ($("#xkit-theme-editor-shadow").length > 0) {
			$("#xkit-theme-editor-shadow").remove();
			$("#xkit-theme-editor-window").remove();
		}

		var m_theme = XKit.storage.get("theme_editor", "my_theme", XKit.extensions.theme_editor.testing_theme);

		var m_html = "<div id=\"xkit-theme-editor-shadow\">&nbsp;</div>" +
				"<div id=\"xkit-theme-editor-window\">" +
					"<textarea id=\"xkit-theme-editor-textarea\">" + m_theme + "</textarea>" +
					"<div id=\"xkit-theme-editor-buttons\">" +
						"<div class=\"xkit-button\" id=\"xkit-theme-editor-apply\">Apply Changes</div>" +
						"<div class=\"xkit-button\" id=\"xkit-theme-editor-save\">Save theme</div>" +
						"<div class=\"xkit-button\" id=\"xkit-theme-editor-delete\">Delete theme</div>" +
						"<div class=\"xkit-button\" id=\"xkit-theme-editor-close\">Close window</div>" +
					"</div>" +
				"</div>";

		$("body").append(m_html);

		$("#xkit-theme-editor-textarea").bind("keydown", function(event) {
			if (event.which === 190) {
				event.stopPropagation();
				event.stopImmediatePropagation();
			}
		});

		$("#xkit-theme-editor-close, #xkit-theme-editor-shadow").click(function() {
			XKit.extensions.theme_editor.close();
		});

		$("#xkit-theme-editor-apply").click(function() {
			XKit.extensions.theme_editor.load_user_theme($("#xkit-theme-editor-textarea").val());
		});

		$("#xkit-theme-editor-save").click(function() {
			XKit.storage.set("theme_editor", "my_theme", $("#xkit-theme-editor-textarea").val());
			XKit.extensions.theme_editor.load_user_theme();
			XKit.extensions.theme_editor.close();
		});

		$("#xkit-theme-editor-delete").click(function() {
			XKit.window.show("Delete theme?", "You can not undo this action.", "question", "<div class=\"xkit-button default\" id=\"xkit-theme-editor-delete-confirm\">Yes, delete my theme.</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");
			$("#xkit-theme-editor-delete-confirm").click(function() {
				XKit.storage.set("theme_editor", "my_theme", "");
				XKit.extensions.theme_editor.load_user_theme();
				XKit.extensions.theme_editor.close();
				XKit.window.close();
			});
		});

	},

	close: function() {

		$("#xkit-theme-editor-shadow").fadeOut('slow');
		$("#xkit-theme-editor-window").fadeOut('fast');

	},

	destroy: function() {
		this.running = false;
		$("#xkit-theme-editor-ul").remove();
		$("#xkit-theme-editor-user-theme").remove();
		XKit.tools.remove_css("theme_editor");
	}

});
