//* TITLE Open In Tabs **//
//* VERSION 1.1.8 **//
//* DESCRIPTION Changes links to open in new tabs **//
//* DETAILS Open In Tabs allows you to open links on new tabs, useful if you don't like being confined to one tab. Since some links, if opened in new tabs, can break functionality, they are not effected by this extension. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.open_in_new_tabs = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep-0": {
			text: "Options",
			type: "separator"
		},
		"button_tabs": {
			text: "Make buttons open in tabs",
			default: true,
			value: true
		},
		"no_sidebar": {
			text: "Open in new tab instead of blog sidebar",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		if (document.location.href.indexOf('/mega-editor/') != -1) {
			return;
		}

		if (XKit.page.react) {
			$(document.body).on('click', 'a[role="link"][target="_blank"]', e => e.stopPropagation());

			XKit.tools.add_css(`
				.xkit--react [data-extension-id="open_in_new_tabs"][data-setting-id="button_tabs"],
				.xkit--react [data-extension-id="open_in_new_tabs"][data-setting-id="no_sidebar"] {
					display: none;
				}
			`, 'open_in_new_tabs');

			return;
		}

		if (XKit.extensions.open_in_new_tabs.preferences.button_tabs.value) {
			$("#content area").attr('target', '_blank');
			$(document).on("click", XKit.extensions.open_in_new_tabs.do_open);
		}

		if (XKit.extensions.open_in_new_tabs.preferences.no_sidebar.value === true) {
			XKit.post_listener.add("open_in_new_tabs", XKit.extensions.open_in_new_tabs.do);
			XKit.extensions.open_in_new_tabs.do();
		}

	},

	do_open: function(e) {

		//XKit.window.show("do_open!", JSON.stringify(e.target), "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		//return;

		var m_box = e.target;

		var m_url = $(m_box).attr('href');

		if ($(m_box).closest('.fan_mail').length && $(m_box).hasClass('reply'))
			return;

		if (typeof m_url === "undefined") {
			m_url = $(m_box).parent().attr('href');
		}

		if (m_url === "#") { return; }
		if (typeof $(m_box).attr('onclick') !== "undefined" || typeof $(m_box).parent().attr('onclick') !== "undefined") { return; }
		if (typeof m_url === "undefined") { return; }
		if ($(m_box).hasClass("photoset_photo") === true) { return; }

		try {
			var open_new_tab = false;
			if (typeof $(m_box).attr('target') === "undefined") {
				open_new_tab = true;
			} else {
				if ($(m_box).attr('target').toLowerCase() !== "_blank") {
					open_new_tab = true;

				}
			}
			if ($(m_box).attr('title').toLowerCase() == "dashboard" && XKit.interface.where().dashboard === true) {
				open_new_tab = false;
			}

			if ($(m_box).attr('title').toLowerCase() == "inbox" && XKit.interface.where().inbox === true) {
				open_new_tab = false;
			}

			if ($(m_box).attr('title').toLowerCase() == "activity" || $(m_box).attr('title').toLowerCase() == "edit" ) {
				open_new_tab = false;
			}

			if (open_new_tab === true) {
				e.preventDefault();
				window.open(m_url, "_blank");
			}

		} catch (err) {

			console.error(err.message);

		}

	},

	do: function() {

		$("a").off("click", XKit.extensions.open_in_new_tabs.click);
		$("a").on("click", XKit.extensions.open_in_new_tabs.click);

		$(".note_link_current").off("click", XKit.extensions.open_in_new_tabs.click_notes);
		$(".note_link_current").on("click", XKit.extensions.open_in_new_tabs.click_notes);

	},

	click_notes: function(e) {

		if ($(".notes_container").length === 0) {
			setTimeout(function() { XKit.extensions.open_in_new_tabs.click_notes(e); }, 100);
		}

		XKit.extensions.open_in_new_tabs.do();

	},

	click: function(e) {

		var link = $(this).attr('href');
		if (link == "#" || typeof link == "undefined" || link === "")
			return;

		var open_in_tab = false;
		var tmp_link = link.replace("http://", "").replace("https://", "");
		var link_components = tmp_link.split(".");

		if (link_components.length == 3)
			open_in_tab = true;

		if ($(this).hasClass("post_info_link") || $(this).hasClass("post_avatar_link"))
			open_in_tab = true;

		if ($(this).hasClass("tumblelog"))
			open_in_tab = true;

		if ($(this).hasClass("xoldeheader-item") || $(this).hasClass("tab_anchor"))
			open_in_tab = false;

		if (link.indexOf("://www.tumblr.com") != -1)
			open_in_tab = false;

		if (open_in_tab) {
			e.preventDefault();
			window.open($(this).attr('href'));
			return false;
		}

	},

	destroy: function() {
		this.running = false;
		$(document.body).off('click', 'a[role="link"][target="_blank"]');
		XKit.tools.remove_css('open_in_new_tabs');
		$(document).off("click", "#right_column a", XKit.extensions.open_in_new_tabs.do_open);
		$(".note_link_current").off("click", XKit.extensions.open_in_new_tabs.click_notes);
		$("a").off("click", XKit.extensions.open_in_new_tabs.click);
	}

});
