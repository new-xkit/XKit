//* TITLE Show Originals **//
//* VERSION 1.2.6 **//
//* DESCRIPTION Only shows original content by the blogs you follow **//
//* DETAILS This extension hides reblogs on your dash that don't contain added original content. This may slow down your computer if it hides a large number of reblogs. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_originals = new Object({

	running: false,
	slow: true,

	status: "false",
	lbl_on: "on",
	lbl_off: "off",
	blogs_to_exclude: [],

	preferences: {
		"sep-0": {
			text: "Shown content",
			type: "separator"
		},
		"show_original_reblogs": {
			text: "Show reblogged posts with added original content",
			default: true,
			value: true
		},
		"blogs_to_exclude": {
			text: "Show every reblog by these blogs:",
			type: "text",
			default: "",
			value: ""
		},
		"show_my_posts": {
			text: "Never hide my posts",
			default: true,
			value: true
		},
		"sep-1": {
			text: "Functionality",
			type: "separator"
		},
		"active_in_peepr": {
			text: "Activate Show Originals on blogs in the sidebar",
			default: true,
			value: true,
		},
		"sep-2": {
			text: "Hidden post appearance",
			type: "separator"
		},
		"hide_posts_generic": {
			text: 'Replace reblogs with a simple "hidden reblog" message',
			default: false,
			value: false
		},
		"hide_posts_completely": {
			text: "Hide dashboard reblogs completely",
			default: false,
			value: false,
			slow: true,
		},
	},

	endlessScrollingWarning: async function() {
		if (XKit.storage.get("show_originals", "shown_warning_about_scrolling", "") !== "yass") {

			//detects endless scrolling via the "next" button
			const nextAriaLabel = await XKit.interface.translate('Next');
			if ($(`button[aria-label="${nextAriaLabel}"]`).length) {

				XKit.notifications.add("Show Originals works best when Endless Scrolling is turned on. Click here to learn more and dismiss this popup.", "warning", false, function() {
					XKit.window.show("Endless Scrolling recommended.", "Show Originals works best when Endless Scrolling is enabled on your dashboard. If you want to enable it, click on the Account Settings button (person icon) on top-right of the page and then Settings > Dashboard > Enable endless scrolling.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					XKit.storage.set("show_originals", "shown_warning_about_scrolling", "yass");
				});
			}
		}
	},

	run: function() {
		this.running = true;

		const where = XKit.interface.where();
		if (!where.dashboard && !where.channel) { return; }

		if (XKit.page.react) {
			this.blogs_to_exclude = this.preferences.blogs_to_exclude.value.split(/[ ,]+/);
			if (where.dashboard) {
				this.endlessScrollingWarning();
			}
			if (this.preferences.hide_posts_completely.value) {
				XKit.interface.hide('.showoriginals-hidden-completely', 'showoriginals');
			}
			this.expand_timeline();
			XKit.interface.react.init_collapsed('showoriginals');
			XKit.post_listener.add('showoriginals', this.react_do);
			this.react_do();
			return;
		}

		try {
			if (XKit.installed.is_running("tweaks")) {
				if (XKit.extensions.tweaks.preferences.dont_show_mine_on_dashboard.value) {
					XKit.extensions.show_originals.dont_show_mine = true;
				}
			}
		} catch (e) {
			console.log("show_originals -> can't read tweaks property: " + e.message);
			XKit.extensions.show_originals.dont_show_mine = false;
		}

		if (!$("body").hasClass("with_auto_paginate")) {
			if (XKit.storage.get("show_originals", "shown_warning_about_scrolling", "") !== "yass") {
				XKit.notifications.add("Show Originals only works when Endless Scrolling is turned on. Click here to learn more and disable this warning.", "warning", false, function() {
					XKit.window.show("Endless Scrolling required.", "Show Originals require Endless Scrolling to be enabled on your dashboard. Click on the Tumblr Settings button (gear icon) on top-right of the page and then Dashboard > Enable endless scrolling.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					XKit.storage.set("show_originals", "shown_warning_about_scrolling", "yass");
				});
			}
			return;
		}

		XKit.extensions.show_originals.status = XKit.storage.get("show_originals", "status", "false");

		XKit.interface.sidebar.add({
			id: "xshow_originals_sidebar",
			title: "Show Originals",
			items: [{
				id: "xshoworiginals_button",
				text: "Originals Only",
				count: XKit.extensions.show_originals.lbl_off
			}]
		});

		XKit.extensions.show_originals.update_button();

		$("#xshoworiginals_button").click(function() {
			XKit.extensions.show_originals.toggle();

			return false;
		});

		XKit.tools.init_css("show_originals");
		XKit.post_listener.add("show_originals", XKit.extensions.show_originals.do);
		XKit.extensions.show_originals.do();
	},

	/**
	 * Ensures the timeline is tall enough to scroll and load more posts if endless scrolling is
	 * enabled, even if all posts are hidden by this extension
	 */
	expand_timeline: async function() {
		const nextAriaLabel = await XKit.interface.translate('Next');
		if ($(`button[aria-label="${nextAriaLabel}"]`).length) { return; }
		await XKit.css_map.getCssMap();
		const timelineSel = XKit.css_map.keyToCss("timeline");

		XKit.tools.add_css(`
			${timelineSel} {
				min-height: calc(100vh - ${$(timelineSel).offset().top - 10}px);
			}
		`, "show_originals");
	},

	react_do: function() {
		$('[data-id]:not(.showoriginals-done)').addClass('showoriginals-done').each(async function() {
			const $this = $(this);
			const {show_my_posts, show_original_reblogs, active_in_peepr, hide_posts_generic, hide_posts_completely} =
				XKit.extensions.show_originals.preferences;
			const {blogs_to_exclude} = XKit.extensions.show_originals;
			const {blogName, canEdit, rebloggedFromName, content} =
				await XKit.interface.react.post_props($this.attr('data-id'));
			const is_original = !rebloggedFromName;
			const in_sidebar = $this.closest("#glass-container").length > 0;

			const should_show =
				(is_original) ||
				(show_original_reblogs.value && content.length) ||
				(show_my_posts.value && canEdit) ||
				(blogs_to_exclude.length && (blogs_to_exclude.includes(blogName))) ||
				(!active_in_peepr.value && in_sidebar);

			if (!should_show) {
				$this.addClass('showoriginals-hidden');

				if (hide_posts_completely.value && !in_sidebar) {
					$this.addClass('showoriginals-hidden-completely');
				} else if (hide_posts_generic.value) {
					XKit.interface.react.collapse($this, 'hidden reblog', 'showoriginals');
				} else {
					const reblogicon = '<svg viewBox="0 0 12.3 13.7" width="24" height="14" fill="var(--blog-contrasting-title-color,var(--transparent-white-65))" fill-opacity="0.75"><path d="M9.2.2C8.7-.2 8 .2 8 .8v1.1H3.1c-2 0-3.1 1-3.1 2.6v1.9c0 .5.4.9.9.9.1 0 .2 0 .3-.1.3-.1.6-.5.6-.8V5.2c0-1.4.3-1.5 1.3-1.5H8v1.1c0 .6.7 1 1.2.6l3.1-2.6L9.2.2zM12 7.4c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.2c0 1.4-.3 1.5-1.3 1.5H4.3V9c0-.6-.7-.9-1.2-.5L0 11l3.1 2.6c.5.4 1.2.1 1.2-.5v-1.2h4.6c2 0 3.1-1 3.1-2.6V7.4z"></path></svg>';
					const note_text = `${blogName} ${reblogicon} ${rebloggedFromName}`;
					XKit.interface.react.collapse($this, note_text, 'showoriginals');
				}
			}
		});
	},

	update_button: function() {

		if (XKit.extensions.show_originals.status == "true") {
			$("#xshoworiginals_button .count").html(XKit.extensions.show_originals.lbl_on);
		} else {
			$("#xshoworiginals_button .count").html(XKit.extensions.show_originals.lbl_off);
		}

	},

	toggle: function() {

		if (XKit.extensions.show_originals.status == "true") {
			XKit.extensions.show_originals.status = "false";
			XKit.extensions.show_originals.do(true);
		} else {
			XKit.extensions.show_originals.status = "true";
			XKit.extensions.show_originals.do(false);
		}

		XKit.extensions.show_originals.update_button();
		XKit.storage.set("show_originals", "status", XKit.extensions.show_originals.status);

	},

	added_css: false,

	do: function(force_shutdown) {

		if (XKit.extensions.show_originals.status == "false" || force_shutdown) {
			XKit.tools.remove_css("show_originals_on");
			XKit.extensions.show_originals.added_css = false;
			return;
		}

		XKit.extensions.show_originals.added_css = true;
		XKit.tools.add_css(" .post.is_reblog { display: none; }", "show_originals_on");

		XKit.extensions.show_originals.call_tumblr_resize();

	},

	call_tumblr_resize: function() {

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("show_originals");
		XKit.tools.remove_css("show_originals_on");
		if (XKit.page.react) {
			try {
				XKit.post_listener.remove('showoriginals', XKit.extensions.show_originals.react_do);
			} catch (e) {
				//no post listener to remove
			}
			$('.showoriginals-done').removeClass('showoriginals-done');
			$('.showoriginals-hidden').removeClass('showoriginals-hidden');
			$('.showoriginals-hidden-completely').removeClass('showoriginals-hidden-completely');
			XKit.tools.remove_css("showoriginals");
			XKit.interface.react.destroy_collapsed('showoriginals');
		} else {
			try {
				XKit.post_listener.remove("show_originals");
			} catch (e) {
				//no post listener to remove
			}
			XKit.interface.sidebar.remove("xshow_originals_sidebar");
		}
	}

});
