//* TITLE AccessKit **//
//* VERSION 1.2.4 **//
//* DESCRIPTION Accessibility tools for Tumblr **//
//* DETAILS Provides accessibility tools for XKit and your dashboard, such as increased font sizes, more contrast on icons and more. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.accesskit = new Object({

	running: false,

	preferences: {
		"sep-1a": {
			text: "Text Adjustments",
			type: "separator"
		},
		font: {
			text: "Post Font",
			default: "default",
			value: "default",
			type: "combo",
			values: [
				"Default Font", "default",
				"OpenDyslexic (might take a while to load)", "opendyslexic",
				"Serif", "sans-serif"
			],
		},
		"sep-2": {
			text: "Dashboard Adjustments",
			type: "separator"
		},
		visible_captions: {
			text: "Make image captions viewable below image",
			default: false,
			value: false
		},
		make_links_blue: {
			text: "Make links on the posts on my dashboard blue",
			default: true,
			value: true
		},
		contrast_icons: {
			text: "Increase the contrast of dashboard icons and text",
			default: true,
			value: true
		},
		contrast_sidebar: {
			text: "Increase the contrast of sidebar icons and text",
			default: true,
			value: true
		},
		contrast_notifications: {
			text: "Increase the contrast of notifications",
			default: true,
			value: true
		},
		increase_font_size: {
			text: "Increase the size of the text",
			default: true,
			value: true
		},
		increase_post_margins: {
			text: "Increase the space between posts",
			default: false,
			value: false
		},
		"sep-3": {
			text: "XKit User Interface Adjustments",
			type: "separator"
		},
		xkit_disable_counter: {
			text: "Disable XKit extensions/settings that might have a negative effect on accessibility",
			default: true,
			value: true
		},
		xkit_contrast_icons: {
			text: "Increase the contrast of XKit user interface",
			default: true,
			value: true
		},
		"sep-1": {
			text: "Color Adjustments",
			type: "separator"
		},
		invert: {
			text: "Invert colors (May cause slowness/problems)",
			default: false,
			value: false,
			experimental: true
		},
		grayscale: {
			text: "Use grayscale colors (May cause slowness/problems)",
			default: false,
			value: false,
			experimental: true
		},
		contrast: {
			text: "Increase overall contrast (May cause slowness/problems)",
			default: false,
			value: false,
			experimental: true
		}
	},

	run: function() {
		this.running = true;

		var m_css = "";

		var m_filters = "";

		if (this.preferences.font.value === "sans-serif") {

			m_css = m_css + ".post_wrapper * { font-family: \"Palatino Linotype\", \"Book Antiqua\", Palatino, serif; } ";

		}

		if (this.preferences.font.value === "opendyslexic") {

			m_css = m_css + " @font-face { font-family: open-dyslexic; src: url('https://cdn.jsdelivr.net/open-dyslexic/2.1.0/ttf/OpenDyslexic-Regular.ttf'); }" +
					" .post_wrapper *{ font-family: open-dyslexic; } ";

		}


		if (this.preferences.invert.value === true) {

			m_filters = " invert(100%) ";
			//m_css = m_css + " html { -webkit-filter: invert(100%); } ";
		}

		if (this.preferences.grayscale.value === true) {

			m_filters = m_filters + " grayscale(100%) ";

			/*if (this.preferences.invert.value === true) {
				m_css = m_css + " html { -webkit-filter: invert(100%)  grayscale(100%); } ";
			} else {
				m_css = m_css + " html { -webkit-filter: grayscale(100%); } ";
			}*/
		}

		if (this.preferences.contrast.value === true) {

			if (this.preferences.invert.value !== true) {
				m_filters = m_filters + " brightness(0.8) contrast(180%) ";
			} else {
				m_filters = m_filters + " contrast(160%) ";
			}

		}

		if (m_filters !== "") {

			m_css = m_css + "html {height: 100%; } body { height: 100%; filter: " + m_filters + "; } ";

		}

		if (this.preferences.visible_captions.value === true) {
			XKit.post_listener.add("accesskit_vis_caps", XKit.extensions.accesskit.vis_caps);
		}

		if (this.preferences.make_links_blue.value === true) {
			m_css = m_css + " .post .post_body a, .reblog-content a { color: #2449c1 !important; font-weight: bold !important; } ";
		}

		if (this.preferences.contrast_sidebar.value === true) {

			m_css = m_css + " .controls_section li a, .right_column .small_links a { color: white; } " +
					" .controls_section li { border-top: 1px solid rgba(255,255,255,0.38); }" +
					" .controls_section li.account_header, .controls_section li.editors_header, .controls_section li.contributors_header, .controls_section li.section_header { color: white; border-bottom: 2px solid rgba(255,255,255,0.43) } " +
					" .controls_section li a .count { color: white !important; font-weight: bold; } " +
					" .controls_section .open_blog .sub_control.link_arrow, .controls_section li.popover_button_blogs .open_blog_link, .blog_menu .selected_blog #open_blog_link { color: white; } ";

		}

		if (this.preferences.contrast_notifications.value === true) {

			m_css = m_css + " .notification .notification_sentence, .notification .notification_sentence a, .notification blockquote { color: white !important; }";

		}



		if (this.preferences.contrast_icons.value === true) {
			m_css = m_css + " #posts .post .post_control.photo_reply .photo_reply_icon_base, .post_full .post_control:after { opacity: 0.5; } " +
					" .post_full .post_header, .post .post_header a, .post .post_tags a, .post .post_tags .post_tag, .xtimestamp, .post_full .post_control.no_icon, .post_full .post_control.no_icon.show_label, .post_full .post_footer { color: rgb(100,100,100) !important; }" +
					" .post .post_header a:hover, .post .post_tags a:hover, .post .post_tags .post_tag:hover, .post_full .post_control.no_icon:hover, .post_full .post_control.no_icon.show_label:hover { color: rgb(80,80,80) !important; text-decoration: underline; }" +
					" .post_full .post_control:hover:after { opacity: 1; } " +
					" .post .post_info .reblog_icon { opacity: 0.55; } " +
					" .post .post_body, .post .post_body * { color: black ; } " +
					" .post .post_footer { border-top: 1px solid rgb(150,150,150) !important; } " +
					" .post_full.is_note .post_body .note_item { border: 1px solid rgb(120,120,120); } " +
					" .post_full.is_note .nipple, .post_full.is_note .nipple::after { border-left: 8px solid rgb(100,100,100); } " +
					" .post_full.is_note .nipple::after { border-left-color: #f5f5f5; }" +
					" .post_full.is_note .answerer .name, .post_full.is_note .asker .name, .post_full.is_note .asker, .post_full.is_note .answerer { color: black; }" +
					" .post.new_post .new_post_label { color: black; } " +
					" .post_full .post_title { color: black; } " +
					" .notes .note > *, .notes .note blockquote { color: black; }" +
					" .notes_outer_container.popover .note blockquote { color: black !important; } " +
					" .notes_outer_container.popover .note a { text-decoration: underline !important; font-weight: bold !important; color: black !important; } " +
					" #post_form .popover_post_options .option { font-weight: bold; } " +
					" #post_form .popover_post_options .option:first-child { border-top: 0; }" +
					" #xkit-interface-buttons .xkit-interface-control-button { opacity: 0.56; } " +
					" #xkit-interface-buttons .xkit-interface-control-button:hover { opacity: 1; } " +
					" #tumblelog_select > * { color: black !important; } " +
					" #tumblelog_select .txt:not(.edit):after { border-top-color: black; } " +
					" #new_post .cog { opacity: 0.68; } " +
					" #new_post .cog:hover { opacity: 1; } " +
					" button.chrome { background-color: #667079; border-color: #667079 !important; color: white; } " +
					" button.chrome:hover { text-decoration: underline; } " +
					" button.chrome:active { background-color: #343d45 !important; border-color: #343d45 !important; } " +
					" .chrome .button_label { color: white !important; } " +
					" .chrome.blue { background-color: #3b7ea7 !important; border-color: #3b7ea7 !important; color: white !important; } " +
					" .chrome.blue:active { background-color: #0c3b57 !important; } " +
					" .split .chrome.blue[disabled], .split .chrome.blue[disabled]:active, .split .chrome.blue.ui_disabled, .split .chrome.blue.ui_disabled:active { color: rgba(255,255,255,0.40) !important; } " +
					" button.chrome.flat.close { color: white !important; background-color: rgb(130,130,130) !important; border: 0px !important; } " +
					" .post .link_button { background-color: #268154; border-color: #268154; } " +
					" .bluthSkin .mceButton { opacity: 1 !important; } " +
					" .bluthSkin .mceButton:hover { background-color: #c3eaf8; border-radius: 5px; } " +
					" .bluthSkin .mceButtonDisabled:hover .mceIcon, .bluthSkin .mceButtonDisabled:hover {background-color: transparent !important; } " +
					" #post_content .main_content > * { border-color: black; } " +
					" .bluthSkin table.mceLayout tr.mceFirst td { border-color: black !important; }" +
					" .bluthSkin .mceIframeContainer { border-top: 1px dashed black; } " +
					" .main_content { border-color: black; }" +
					" .advanced_post_options label { color: rgb(100,100,100); } ";

		}

		if (this.preferences.increase_font_size.value === true) {

			m_css = m_css + " .post_full .post_notes_label, .post_container { font-size: 15px !important; } " +
					" .post_body *, .reblog-list-item .reblog-header, .reblog-list-item .reblog-content { font-size: 15px !important; } " +
					" .xtimestamp { font-size: 13px; } " +
					" .post_full .post_header { font-size: 14px; } " +
					" .notification .notification_sentence > * { font-size: 14px; } " +
					" .notes .note > *, .notes .note blockquote { font-size: 14px; line-height: 22px; } " +
					" .notes_outer_container.popover .note blockquote { font-size: 14px !important; } " +
					" .post .post_tags a, .post .post_tags .post_tag { font-size: 14px !important; } " +
					" .xkit-notification {font-size: 14px; } ";

		}

		if (this.preferences.increase_post_margins.value === true) {

			m_css = m_css + " #posts.posts>.post_container { margin-bottom: 40px; } ";


		}

		if (this.preferences.xkit_disable_counter.value === true) {

			XKit.extensions.accesskit.disable_xkit_counter();

			setTimeout(function() { XKit.extensions.accesskit.disable_xkit_counter(); }, 1500);

		}

		if (this.preferences.xkit_contrast_icons.value === true) {

			m_css = m_css + " .xkit-extension-setting, .xkit-extension-setting-separator { color: black !important; border-bottom: 1px solid rgb(100,100,100); } " +
					" .xkit-extension-setting-separator { background: rgb(230,230,230); }" +
					" #xkit-extensions-panel-top { border-bottom: 1px solid black; } " +
					" #xkit-extensions-panel-right, #xkit-extensions-panel-left, #xkit-extensions-panel-left-search { border-color: black; } " +
					" #xkit-extensions-panel-left .xkit-extension {color: black; border-color: black; } " +
					" .xkit-button { border-color: black; color: black; } " +
					" .xkit-button:hover { border-color: black; color: black; text-decoration: underline; } " +
					" #xkit-extensions-panel-top .description, #xkit-extensions-panel-top .description .details { color: black; } " +
					" .xkit-checkbox, .xkit-change-ext-setting-checkbox { color: black } .xkit-change-ext-setting-checkbox:hover, .xkit-checkbox:hover { text-decoration: underline; } " +
					" .xkit-extension-setting.checkbox .xkit-checkbox, .xkit-extension-setting .title { color: black; } " +
					" .xkit-checkbox.selected b { background-color: #184e98; } " +
					" .xkit-checkbox b { border: 1px solid black; } " +
					" #xkit-extensions-panel-right .xkit-others-panel .description { color: black; } " +
					" .xkit-progress-bar { border: 1px solid black; box-shadow: none; } " +
					" .xkit-progress-bar-inner { background: #154389; } " +
					" #xkit-about-window-text .subtitle, #xkit-about-window-links a {color: black; } " +
					" #xkit-extensions-panel-left .xkit-extension .title { color: black; }" +
					" #xkit-extensions-panel-left .xkit-extension.text-only.selected, #xkit-extensions-panel-left .xkit-extension.selected .title { color: black; font-weight: bold; text-decoration: underline; } " +
					" #xkit-extensions-display-type-iconic, #xkit-extensions-display-type-normal { border-color: black; } " +
					" #xkit-extensions-panel-left .xkit-extension.text-only { color: black; }" +
					" #xkit-extensions-panel-left .xkit-extension.text-only.selected { text-decoration: underline; } " +
					" #xkit-extensions-panel-right .xkit-message-display { color: black; } " +
					" #xkit-extensions-panel-right .xkit-message-info { color: black; border-bottom: 1px solid black; } " +
					" #xkit-extensions-panel-right.xkit-wide-panel { border-left: 1px solid black; background: white; } " +
					" .xkit-gallery-extension, #xkit-gallery-toolbar, #xkit-gallery-search { color: black; border-color: black; } " +
					" .xkit-gallery-extension .xkit-button { border-top: 1px solid black !important; }" +
					" #xkit-control-panel-tabs div { color: black; border-color: black; } " +
					" #xkit-control-panel-tabs { background: rgb(200,200,200); } " +
					" #xkit-about-window-links {border-top: 1px solid black; } " +
					" .notes .note > *, .notes .note blockquote { font-size: 14px; line-height: 22px; } " +
					" .notes_outer_container.popover .note blockquote { font-size: 14px !important; } " +
					" .xkit-notification {background-color: white !important; color: black; } " +
					" .xkit-notification:hover { text-decoration: underline; } " +
					" #xkit-window-shadow { background-color: rgba(0,0,0,0.77); } " +
					" .xkit-window-buttons { border-top: 1px solid black; } ";
		}

		if (XKit.interface.where().inbox) {
			m_css += ".post_full.is_note.no_body .post_footer { margin: 0; }";
		}

		XKit.tools.add_css(m_css, "accesskit");

	},

	vis_caps: function() {

		if (!XKit.interface.where().dashboard && !XKit.interface.where().channel && !XKit.interface.where().inbox) {
			// probs on a blog. abort mission.
			return;
		}

		var imgCap = '';
		var imgWidth = '';
		var rowHeight = '';

		$('.photoset_row').each(function() {

			if (!$(this).hasClass('xkit-accesskit-viscaps')) { //prevents double-dipping

				$(this).attr('style', $(this).attr('style').replace('height', 'min-height'));
				rowHeight = $(this).css('min-height');

				$(this).find('a').each(function() {

					if (!$(this).hasClass('xkit-accesskit-viscaps')) { //protection!

						imgCap = $(this).find('img').attr('alt');
						imgWidth = $(this).find('img').css('width');
						$(this).html('<div style="height: ' + rowHeight + '; overflow: hidden;">' + $(this).html() + '</div><p style="width: ' + imgWidth + '; white-space: pre-wrap">' + imgCap + '</p>');

						$(this).addClass('xkit-accesskit-viscaps');

					}

				});

				$(this).addClass('xkit-accesskit-viscaps');

			}

		});

	},

	disable_xkit_counter: function() {

		XKit.tools.remove_css("xkit_tweaks_slim_sidebar");
		XKit.tools.remove_css("xkit_tweaks_hide_section_headers");

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("accesskit");
	}

});
