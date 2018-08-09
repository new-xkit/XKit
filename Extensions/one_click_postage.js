//* TITLE One-Click Postage **//
//* VERSION 5.0.0 **//
//* DESCRIPTION Lets you easily reblog, draft and queue posts **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.one_click_postage = new Object({
	running: false,

	qq_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzgxMzAzQzIwRDZGMTFFM0IyOTBDRDZCRDY3Qzk1QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzgxMzAzQzMwRDZGMTFFM0IyOTBDRDZCRDY3Qzk1QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDODEzMDNDMDBENkYxMUUzQjI5MENENkJENjdDOTVBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDODEzMDNDMTBENkYxMUUzQjI5MENENkJENjdDOTVBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpK36AkAAAFxSURBVHjalJSxS8NAFMZzJruuhSBCdHMISIcWhw4OAZfO/hHSySmFblnF2cH/wA6CDg5Oujg4dHJRUGinklWo1O/kO3h5Hkl88OOSd+++vHv3cma9XgfajDE9DEegD/ZBB8zBDDyCe6x7+rPQijlgCSjAwk7VsGBcUlkvhLrgukFEY+O7FTFmpIVeQQZiEHLM6NeCiRQrVEAe1Fuu4gtX+56qkRY6B8/gUNU3VzW0OsFYbU3bDeeOlVigtjze4PE7Ow3+ZzK+H7GPnM08CwzHXfTfAZ/fwFLF/+qsRKqhR+zO0xInnAuFbxWxs2NO2k7/VGJnYBt8gW/6liLe2VxnsQO25N/RYJnI7NY5U/AuJh6saAuxymk6pxUqwRCMOHnVIObts5SOiQi0mZU1Yt4/IBI1KkXd7PMm32MWt8PjvwB7QngKLuWX7OIXMOCX7PuUmbW/NWgjT+CkRsx7nxmRXcrMSm59gIAhuv6j7U37I8AABDEAB/datwYAAAAASUVORK5CYII=",
	qq_ok_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzNGRkUyQzUwRDcwMTFFM0IyOTBDRDZCRDY3Qzk1QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzNGRkUyQzYwRDcwMTFFM0IyOTBDRDZCRDY3Qzk1QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDODEzMDNDNDBENkYxMUUzQjI5MENENkJENjdDOTVBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3M0ZGRTJDNDBENzAxMUUzQjI5MENENkJENjdDOTVBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDLUa4AAAG4SURBVHjalJQxSEJRFIafL/fcRNAKrIYSCsJBCWpwqK3WpgQ3IwgiQhKCJBocRBoFp5ptcwiqRYccJNxECgqkpWxsCPov/DdOh6fRgY93733n/Jx77rnXl72YdzwsAVIgCWIgBPqgAxrgGjSN4/lW5yfIr0SiIAPSIKj+hckayIIqqICedXCFcxwUwaGHkLYg/Yo7l7G4FjMZ5cCGCOiCdRDhDiKcd4WP8c9BMCrFMkooD2ZBHbyAL37rXM8rwYwVS7BGUqgg5iXQAstiraAE08gu4fLUgmJrBVWfabAExtV6QWzZxKdcHr+1Xed/Jv2TfvaRtY5HgE9laOwRvCn/mMuGtNb3EBtTtWux17R/yM+FsF3gqUk7ABPgk6fqMCtHJ2L7x9oUCICBWHsAc0Nq9qtEts8WwRNr8Q5uKfqXlcW4YcVqDN4Ee2CFNRplR2CG41dz+V1mNcngGr936kZ4CZ2IeRWvR9MvtjMQdRuIJg3zkEKsUVlkZHdVsU+Qqc8H2AZtcMP5FZ2fR2RohE6RVU9e9GOwQCGHWbVHiJganYF9CN3rx7HEDFe5xQDHDvtu6Esr7VuAAQC+Omj592980QAAAABJRU5ErkJggg==",

	preferences: {
		"sep_-1": {
			text: "Default Blog",
			type: "separator",
		},
		"default_blog": {
			text: "Default blog for One-Click Postage",
			default: "",
			value: "",
			type: "blog",
		},
		"sep_0": {
			text: "Shortcuts&emsp;<a id=\"xkit-ocp-keyboard-legend\" style=\"cursor: pointer;\">Guide</a>",
			type: "separator",
		},
		"enable_keyboard_shortcuts": {
			text: "Use keyboard shortcuts",
			default: false,
			value: false
		},
		"enable_quick_queue": {
			text: "Enable QuickQueue buttons on posts",
			default: false,
			value: false
		},
		"enable_quick_blog_reblog": {
			text: "Enable QuickReblog and QuickQueue on top right corner when I visit blogs",
			default: false,
			value: false,
			experimental: true
		},
		"sep_5": {
			text: "AlreadyReblogged&emsp;<a id=\"xkit-alreadyreblogged-help\" style=\"cursor: pointer;\">What is this?</a>",
			type: "separator",
		},
		"enable_alreadyreblogged": {
			text: "Enable AlreadyReblogged for posts I reblog, queue or draft",
			default: false,
			value: false
		},
		"already_reblogged_limit": {
			text: "Remember the last <i>X</i> posts reblogged",
			default: "a3000",
			value: "a3000",
			type: "combo",
			values: [
				"10,000 Posts", "a10000",
				"5,000 Posts", "a5000",
				"Default (3,000)", "a3000",
				"1,500 Posts", "a1500",
				"1,000 Posts", "a1000",
				"500 Posts", "a500",
				"250 Posts", "a250",
				"4 Posts", "a4",
			],
		},
		"enable_hide_alreadyreblogged": {
			text: "Hide posts if they are AlreadyReblogged on my dashboard",
			default: false,
			value: false
		},
		"sep_1": {
			text: "Popup Options",
			type: "separator",
		},
		"dont_scroll_quicktags": {
			text: "Turn off scrolling on Quick Tags bundles",
			default: false,
			value: false
		},
		"show_blog_selector": {
			text: "Show blog selector",
			default: true,
			value: true
		},
		"enable_popup_html": {
			text: "Enable HTML in One-Click Postage popup",
			default: false,
			value: false
		},
		"show_caption_remover": {
			text: "Show the Remove Caption button",
			default: true,
			value: true
		},
		"show_caption": {
			text: "Show the Caption box",
			default: true,
			value: true
		},
		"show_tag_remover": {
			text: "Show the Clear Tags button",
			default: false,
			value: false
		},
		"show_reverse_ui": {
			text: "Use the Reverse UI on the popup-window (popup on top of reblog button)",
			default: true,
			value: true
		},
		"show_small_ui": {
			text: "Use the Slim User Interface on the pop-up window",
			default: false,
			value: false
		},
		"show_social": {
			text: "Show Post To Facebook and Twitter buttons",
			default: false,
			value: false
		},
		"allow_resize": {
			text: "Allow resizing of the caption box vertically",
			experimental: true,
			default: false,
			value: false
		},
		"sep_2": {
			text: "Notifications",
			type: "separator",
		},
		"dim_posts_after_reblog": {
			text: "Turn the reblog button green after a successful reblog/queue/draft",
			default: true,
			value: true
		},
		"dont_show_notifications": {
			text: "Turn off the notifications displayed when successfully reblogged/queued/drafted",
			default: false,
			value: false
		},
		"use_toasts": {
			text: "Use tumblr-style notifications instead of XKit ones",
			default: false,
			value: false
		},
		"sep_3": {
			text: "Tagging options",
			type: "separator",
		}
	},

	already_reblogged: [],
	last_object: {},
	last_icon_object: {},
	last_post_id: 0,
	ignore_box_input_blurring: false,
	user_on_box: false,
	menu_closer_int: 0,
	default_blog_id: "",
	caption_height: 90,

	auto_tagger: false,
	auto_tagger_preferences: "",
	auto_tagger_done: false,

	quick_tags: false,

	frame_run: function() {
		if (XKit.page.blog_frame && XKit.extensions.one_click_postage.preferences.enable_quick_blog_reblog.value) {
			XKit.extensions.one_click_postage.in_blog();
		}
	},

	in_blog: function() {
		if (XKit.iframe.reblog_button().length === 0) { return; }

		XKit.iframe.hide_button(XKit.iframe.reblog_button());

		XKit.tools.init_css("one_click_postage");

		function button(type, label) {
			return `<a
					  id="x1cpostage_in_blog_${type}"
					  class="tx-button--with-icon tx-icon-button xkit-in-frame-button"
					  role="button"
					  aria-label="${label}"
					  title="${label}"
					  tabindex="0"
					>
					  <span class="button-label">${label}</span>
					</a>`;
		}

		var buttons = button("reblog", "One-Click Reblog") +
					 button("queue",  "One-Click Queue") +
					 button("draft",  "One-Click Draft");

		XKit.iframe.reblog_button().after(buttons);
		XKit.iframe.size_frame_to_fit();

		$("#x1cpostage_in_blog_reblog").click(function() {
			XKit.extensions.one_click_postage.in_blog_post($(this), 0, false);
		});

		$("#x1cpostage_in_blog_queue").click(function() {
			XKit.extensions.one_click_postage.in_blog_post($(this), 2, false);
		});

		$("#x1cpostage_in_blog_draft").click(function() {
			XKit.extensions.one_click_postage.in_blog_post($(this), 1, false);
		});
	},

	in_blog_post: function($button, state, retry_mode) {
		if ($button.hasClass("xkit-button-working")) { return; }

		$button
			.removeClass("xkit-button-error")
			.removeClass("xkit-button-done")
			.addClass("xkit-button-working");

		var request = {
			reblog_id: parseInt(XKit.iframe.single_post_id()),
			reblog_key: XKit.iframe.reblog_button()[0].pathname.split('/')[3]
		};

		XKit.interface.post.fetch(request).then(

			function(data) {
				if (data.errors === false) {
					XKit.extensions.one_click_postage.in_blog_process(data, state, $button, request, false);
				} else {
					XKit.extensions.one_click_postage.show_error("OCP05-B", state);
				}
			},

			function(response) {
				switch (response.status) {
				case 401:
					XKit.extensions.one_click_postage.show_error("OCP01-B", state);
					break;
				case 404:
					XKit.extensions.one_click_postage.show_error("OCP02-B [Post Not Found]", state);
					break;
				default:
					if (!retry_mode) {
						setTimeout(function() { XKit.extensions.one_click_postage.in_blog_post($button, state, true); }, 500);
						return;
					} else {
						XKit.extensions.one_click_postage.show_error("OCP03-" + response.status + "-B", state);
					}
				}

				$button.removeClass("xkit-button-working").addClass("xkit-button-error");
			}

		);
	},

	in_blog_process: function(data, state, $button, post, retry_mode) {

		var blogs = XKit.tools.get_blogs();

		if (!blogs.length) {
			XKit.window.show("Error",
				"Can't get list of current blogs - please visit dashboard first.",
				"error",
				'<div class="xkit-button default" id="xkit-close-message">OK</div>'
			);
			return;
		} else if (this.preferences.default_blog.value !== "" && blogs.indexOf(this.preferences.default_blog.value) === -1) {
			$button.removeClass("xkit-button-working").addClass("xkit-button-error");
			return;
		}

		var full_post = {
			channel_id: this.preferences.default_blog.value || blogs[0],
			reblog: true,
			reblog_post_id: post.reblog_id,
			reblog_key: post.reblog_key,
			"post[tags]": this.get_auto_tagger_tags(data.post, state, false),
			"post[type]": data.post.type,
			"post[state]": state
		};

		XKit.interface.post.update(full_post).then(

			function(result) {
				$button.removeClass("xkit-button-working");

				if (result.errors === false) {
					$button.addClass("xkit-button-done");
				} else {
					$button.addClass("xkit-button-error");
					XKit.extensions.one_click_postage.show_error("INOCP901", state);
				}
			},

			function(response) {
				XKit.interface.kitty.set("");

				switch (response.status) {
				case 401:
					XKit.extensions.one_click_postage.show_error("INOCP101", state);
					break;
				case 404:
					XKit.extensions.one_click_postage.show_error("INOCP104 Not Found", state);
					break;
				default:
					if (!retry_mode) {
						XKit.extensions.one_click_postage.in_blog_process(data, state, $button, post, true);
						return;
					} else {
						XKit.extensions.one_click_postage.show_error("INOCP109-" + response.status, state);
					}
				}

				$button
					.removeClass("xkit-button-working")
					.addClass("xkit-button-error");
			}

		);
	},

	/**
	 * If auto_tagger is enabled use it to get tags. Otherwise return ""
	 * @param {Object} post - Post object, like those returned by
	 * XKit.interface.parse_post and XKit.interface.find_post
	 * @param {number} state - Post state: 0 is reblog, 1 is draft, 2 is queue
	 * @param {Boolean} isOriginal
	 * @return {String} tags
	 */
	get_auto_tagger_tags: function(post, state, isOriginal) {
		if (!this.auto_tagger) {
			return "";
		}
		var auto_tagger = XKit.extensions.auto_tagger;
		if (typeof(auto_tagger) == "undefined") {
			return "";
		}
		// Call Auto Tagger for tags.
		var additional_tags = auto_tagger.return_tags(post, isOriginal);
		if (state === 2) {
			var queue_tags = auto_tagger.return_tags_for_queue();
			additional_tags = auto_tagger.mreturn_add(additional_tags, queue_tags);
		}
		return additional_tags;
	},

	/**
	 * Return the addition of tags based on state from the auto_tagger. Only
	 * queue is handled by this function because state is a horrible variable
	 * @param {String} tags - current tags
	 * @param {number} state - Post state: 0 is reblog, 1 is draft, 2 is queue
	 * @return {String} new tags
	 */
	add_auto_tagger_state_tags: function(tags, state) {
		if (!this.auto_tagger) {
			return tags;
		}

		var auto_tagger = XKit.extensions.auto_tagger;
		if (typeof(auto_tagger) == "undefined") {
			return tags;
		}

		if (state !== 2) {
			return tags;
		}

		var queue_tags = auto_tagger.return_tags_for_queue();
		return auto_tagger.mreturn_add(tags, queue_tags);
	},

	cpanel: function(obj) {
		$(obj).append('<div id="one_click_postage_warning_movage">Tagging options are moved to a separate extension called "Auto Tagger."</div>');

		$("#xkit-alreadyreblogged-help").click(function() {
			XKit.window.show("AlreadyReblogged", "AlreadyReblogged keeps the track of the posts you reblog using One-Click Postage.<br/><br/>When you queue, draft or reblog a post using One-Click postage, the next time you refresh your page, the reblog button will turn green automatically.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		});

		$("#xkit-ocp-keyboard-legend").click(function() {
			XKit.window.show(
				"Keyboard Shortcuts", `
				<span>Ｒ</span> Reblog<br>
				<span>Ｑ</span> Queue<br>
				<span>Ｄ</span> Draft<br>
				<br>
				<span>Ｔ</span> Tag<br>
				<br>
				<span>ESC</span> Close popup<br>
				<br>
				<span>１</span> - <span>９</span> Use a Quick Tags bundle`,
				"info",
				"<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>"
			);

			$(".xkit-window-msg span").attr("style", `
				display: inline-block;
				border: 1px solid black;
				border-radius: 3px;
				line-height: 1em;
				padding: 5px;
				text-align: center;
				background: linear-gradient(#eee, #ddd);`
			);
		});
	},

	get_autotagger: function() {
		if (XKit.installed.check("auto_tagger") === false) {
			XKit.extensions.one_click_postage.auto_tagger = false;
		} else {
			if (XKit.installed.enabled("auto_tagger") === true) {
				if (typeof XKit.extensions.auto_tagger === "undefined") {
					// Not booted up yet?
					setTimeout(function() { XKit.extensions.one_click_postage.get_autotagger(); }, 100);
				} else {
					console.log("Auto tagger installed and found");
					XKit.extensions.one_click_postage.auto_tagger = true;
					XKit.extensions.one_click_postage.auto_tagger_preferences = XKit.extensions.auto_tagger.preferences;
				}
			} else {
				XKit.extensions.one_click_postage.auto_tagger = false;
			}
		}
	},

	get_quicktags: function() {
		if (XKit.installed.check("quick_tags") === false) {
			XKit.extensions.one_click_postage.quick_tags = false;
		} else {
			if (XKit.installed.enabled("quick_tags") === true) {
				if (typeof XKit.extensions.quick_tags === "undefined") {
					// Not booted up yet?
					setTimeout(function() { XKit.extensions.one_click_postage.get_quicktags(); }, 100);
				} else {
					console.log("Quick Tags installed and found");
					XKit.extensions.one_click_postage.quick_tags = true;
				}
			} else {
				XKit.extensions.one_click_postage.quick_tags = false;
			}
		}
	},

	run: function() {
		//Bail on user blogs
		if (!XKit.interface.is_tumblr_page()) { return; }

		XKit.tools.init_css("one_click_postage");

		// Let's first check if we have auto_tagger installed and active.
		this.get_autotagger();

		// Then, check Quick Tags.
		this.get_quicktags();

		if (this.preferences.allow_resize.value) {
			XKit.tools.add_css("#x1cpostage_caption { resize: vertical; }", "one_click_postage_resize");
		}

		if (this.preferences.show_small_ui.value) {
			this.caption_height = 50;
			XKit.tools.add_css(
				"#x1cpostage_caption { height: 50px; }" +
				"#x1cpostage_reblog, #x1cpostage_queue, #x1cpostage_draft { height: 32px; }" +
				"#x1cpostage_reblog i::before, #x1cpostage_queue i::before, #x1cpostage_draft i::before { position: static; }",
			"one_click_postage_slim");
		}

		if (this.preferences.show_reverse_ui.value) {
			XKit.tools.add_css(
				"#x1cpostage_draft { border-radius: 0px 0px 3px 0px; }" +
				"#x1cpostage_reblog { border-radius: 0px 0px 0px 3px; }" +
				"#x1cpostage_tags { border-radius: 3px 3px 0px 0px; border-bottom: 0; }" +
				"#x1cpostage_replace { border-bottom: 0; }" +
				"#x1cpostage_remove_caption { border-top: 1px solid #abafbc; border-bottom: 0; }",
			"x1cpostage_reverse_ui");
		}

		XKit.blog_listener.add("one_click_postage", this.init);
	},

	init: function(blogs) {

		this.default_blog_id = this.preferences.default_blog.value || blogs[0];
		this.blogs_list = blogs;

		var blog_html = "";
		for (var x in blogs) {
			blog_html += '<option value="' + blogs[x] + '"' + (blogs[x] == this.default_blog_id ? ' selected' : '') + '>' + blogs[x] + '</option>';
		}

		var ui_html = [
			'<div id="x1cpostage_reblog"><i>&nbsp;</i></div>' + '<div id="x1cpostage_queue"><i>&nbsp;</i></div>' + '<div id="x1cpostage_draft"><i>&nbsp;</i></div>',

			(this.preferences.show_social.value ?
				'<div id="xkit-1cp-social">' +
					'<div data-site="facebook" id="xkit-1cp-social-facebook">&nbsp;</div>' +
					'<div data-site="twitter" id="xkit-1cp-social-twitter">&nbsp;</div>' +
				'</div>'
			: ''),

			(this.preferences.show_blog_selector.value ?
				'<select id="x1cpostage_blog">' + blog_html + '</select>'
			: ''),

			(this.preferences.show_caption.value ?
				'<textarea id="x1cpostage_caption" placeholder="caption"></textarea>' +
				'<div id="x1cpostage_replace"><div>&nbsp;</div>replace caption, not append</div>'
			: ''),

			(this.preferences.show_caption_remover.value ?
				'<div id="x1cpostage_remove_caption">remove caption</div>'
			: ''),

			'<div id="x1cpostage_quick_tags"' + (this.preferences.show_reverse_ui.value ? '' : ' class="xkit-no-reverse-ui"') + '></div>',

			'<input id="x1cpostage_tags" placeholder="tags (comma separated)"/>' +
			(this.preferences.show_tag_remover.value ?
				'<div id="x1cpostage_clear_tags">clear tags</div>'
			: '')
		];

		$("body").append('<div id="x1cpostage_box"' + (this.preferences.show_reverse_ui.value ?
			'>' + ui_html.reverse().join("") :
			' class="xkit-no-nipple xkit-1xcpostage-non-reversed">' + ui_html.join("")) +
		'</div>');

		if (this.preferences.show_reverse_ui.value) {
			$(document).on("mouseover", "#x1cpostage_queue", function() {
				$("#x1cpostage_box")
					.removeClass("xkit_x1cpostage_queue_press")
					.addClass("xkit_x1cpostage_queue_hover");
			});

			$(document).on("mouseout", "#x1cpostage_queue", function() {
				$("#x1cpostage_box")
					.removeClass("xkit_x1cpostage_queue_press")
					.removeClass("xkit_x1cpostage_queue_hover");
			});

			$(document).on("mousedown", "#x1cpostage_queue", function() {
				$("#x1cpostage_box")
					.removeClass("xkit_x1cpostage_queue_hover")
					.addClass("xkit_x1cpostage_queue_press");
			});

			$(document).on("mouseup", "#x1cpostage_queue", function() {
				$("#x1cpostage_box").removeClass("xkit_x1cpostage_queue_press");
			});
		}

		var share_fb = XKit.storage.get("one_click_postage", "share_on_facebook", "false");
		var share_twitter = XKit.storage.get("one_click_postage", "share_on_twitter", "false");

		if (share_fb === "true") { $("#xkit-1cp-social-facebook").addClass("selected"); }
		if (share_twitter === "true") { $("#xkit-1cp-social-twitter").addClass("selected"); }

		$("#xkit-1cp-social-facebook, #xkit-1cp-social-twitter").click(function() {
			$(this).toggleClass("selected");
			var m_value = "false";
			if ($(this).hasClass("selected") === true) { m_value = "true"; }
			XKit.storage.set("one_click_postage", "share_on_" + $(this).attr('data-site'), m_value);
		});

		$(document).on("mouseover", ".reblog_button,.post_control.reblog", function(event) {
			if ($(this).hasClass("radar_button") === true) {return; }
			clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
			XKit.extensions.one_click_postage.user_on_box = true;
			XKit.extensions.one_click_postage.open_menu($(this));
		});

		$(document).on("mouseout mouseleave", ".reblog_button,.post_control.reblog", function() {
			if ($(this).hasClass("radar_button") === true) {return; }
			XKit.extensions.one_click_postage.user_on_box = false;
			XKit.extensions.one_click_postage.close_menu();
		});

		$(document).on("click", ".reblog_button,.post_control.reblog", function() {
			XKit.extensions.one_click_postage.user_on_box = false;
			XKit.extensions.one_click_postage.close_menu(true);
		});

		var cancel_menu_close = function() {
			clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
			XKit.extensions.one_click_postage.user_on_box = true;
		};

		var menu_close = function() {
			// Only close the menu if none of its inputs have focus.
			if ($("#x1cpostage_box").find('input:focus, textarea:focus, select:focus').length === 0) {
				XKit.extensions.one_click_postage.user_on_box = false;
				XKit.extensions.one_click_postage.close_menu();
			}
		};

		$(document).on("mouseover", "#x1cpostage_box", cancel_menu_close);
		$(document).on("mouseleave", "#x1cpostage_box", menu_close);
		$(document).on("focus", "#x1cpostage_box input, #x1cpostage_box textarea, #x1cpostage_box select", cancel_menu_close);
		$(document).on("blur", "#x1cpostage_box input, #x1cpostage_box textarea, #x1cpostage_box select", function() {
			if (!XKit.extensions.one_click_postage.ignore_box_input_blurring) {
				menu_close();
			}
		});

		$("#x1cpostage_tags, #x1cpostage_caption").bind("keydown", function(event) {
			if (XKit.extensions.one_click_postage.preferences.enable_keyboard_shortcuts.value
					&& event.which === 27) { // 27 = Escape
				$(this).blur();
				XKit.extensions.one_click_postage.user_on_box = false;
				XKit.extensions.one_click_postage.close_menu(true);
				event.preventDefault();
			}
			event.stopPropagation();
			event.stopImmediatePropagation();
		});

		$("#x1cpostage_remove_caption").click(function() {
			if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value) {
				$("#x1cpostage_remove_caption").css('display', 'none');
				$("#x1cpostage_caption").css('display', 'none');
				$("#x1cpostage_replace").css('display', 'none');

				// Determine where we are going to show the box.
				var offset = $(XKit.extensions.one_click_postage.last_icon_object).offset();

				// Box position
				var box_left = offset.left - ($("#x1cpostage_box").width() / 2) + 13;
				var box_top = (offset.top - $("#x1cpostage_box").height()) - 12;

				$("#x1cpostage_box").css("top", box_top + "px");
				$("#x1cpostage_box").css("left", box_left + "px");
			} else {
				$("#x1cpostage_remove_caption").slideUp('fast');
				$("#x1cpostage_caption").slideUp('fast');
				$("#x1cpostage_replace").slideUp('fast');
			}

			$("#x1cpostage_caption").addClass("x1cpostage_remove_caption_on");
			$("#x1cpostage_tags").css("border-top", "1px solid #abafbc");
		});

		$("#x1cpostage_clear_tags").click(function() {
			$("#x1cpostage_tags").val("");
		});

		$("#x1cpostage_replace").click(function() {
			$(this).toggleClass("selected");
		});

		$("#x1cpostage_reblog").click(function() {
			XKit.extensions.one_click_postage.post(0, false);
		});

		$("#x1cpostage_queue").click(function() {
			XKit.extensions.one_click_postage.post(2, false);
		});

		$("#x1cpostage_draft").click(function() {
			XKit.extensions.one_click_postage.post(1, false);
		});

		if (this.preferences.enable_keyboard_shortcuts.value) {
			$(document).on('keydown', this.process_keydown);
			// Must use capture=true here to intercept Tumblr's default handlers, so we can't use jQuery's .on()
			window.addEventListener('keydown', this.suspend_tumblr_key_commands, true);
		}

		this.init_keep_tags_dashboard();

		if (this.preferences.enable_alreadyreblogged.value) {
			try {
				this.already_reblogged = JSON.parse(XKit.storage.get("one_click_postage", "already_reblogged", "[]"));
			} catch (e) {
				this.already_reblogged = [];
			}

			XKit.post_listener.add("one_click_postage", this.check_if_alreadyreblogged);
			this.check_if_alreadyreblogged();
		}

		if (this.preferences.enable_quick_queue.value) {
			var where = XKit.interface.where();
			if (where.drafts || where.queue || $("body").hasClass("is_private_channel")) { return; }

			XKit.interface.create_control_button("xkit-one-click-postage-quickqueue", this.qq_icon, "QuickQueue", "", this.qq_ok_icon);
			XKit.post_listener.add("one_click_postage", this.quick_queue_do_posts);
			this.quick_queue_do_posts();

			$(document).on('click', '.xkit-one-click-postage-quickqueue', this.quick_queue_button_clicked);
		}

		if (this.preferences.dont_scroll_quicktags.value) {
			XKit.tools.add_css("#x1cpostage_quick_tags { max-height: 10000px !important; }", "one_click_postage_qtdontscroll");
		}
	},

	quick_queue_button_clicked: function(e) {
		var $obj = $(e.target);

		if ($obj.hasClass("xkit-interface-working") === true) { return; }

		var $parent_box = $obj.parentsUntil('.post').parent();

		this.last_object = $parent_box;
		this.last_icon_object = $obj;
		this.last_post_id = $parent_box.attr('data-post-id');

		XKit.interface.switch_control_button($obj, true);
		this.post(2, false, true);
	},

	quick_queue_do_posts: function() {
		var $posts = $(XKit.interface.get_posts("xkit-1cp-quick-queue-done"));

		if (XKit.interface.where().queue === true) { return; }

		$posts.each(function() {
			$(this).addClass("xkit-1cp-quick-queue-done");

			if (XKit.interface.where().inbox === true) { return; }

			XKit.interface.add_control_button(this, "xkit-one-click-postage-quickqueue", "");
		});
	},

	check_if_alreadyreblogged: function() {
		$(".post:not(.xkit_already_reblogged_check)").each(function() {
			var post_id = $(this).addClass("xkit_already_reblogged_check").attr('data-root_id');

			if (XKit.extensions.one_click_postage.is_alreadyreblogged(post_id)) {
				if (XKit.extensions.one_click_postage.preferences.enable_hide_alreadyreblogged.value) {
					if (XKit.interface.where().dashboard) { $(this).remove(); }
				}

				XKit.extensions.one_click_postage.make_button_reblogged($(this).find(".post_control.reblog"));
			}
		});
	},

	make_button_reblogged: function($button) {
		$button.addClass("reblogged");
	},

	destroy: function() {
		$(document)
			.off('click', '.reblog_button,.post_control.reblog', this.process_click)
			.off('keydown', this.process_keydown);
		window.removeEventListener('keydown', this.suspend_tumblr_key_commands);
		XKit.post_listener.remove("one_click_postage");
		$("#x1cpostage_box").remove();
		XKit.tools.remove_css("one_click_postage");
		XKit.tools.remove_css("x1cpostage_reverse_ui");
		XKit.tools.remove_css("one_click_postage_slim");
		XKit.tools.remove_css("one_click_postage_resize");
		XKit.tools.remove_css("one_click_postage_qtdontscroll");
	},

	init_keep_tags_dashboard: function() {
		$(document).on('click', '.reblog_button, .post_control.reblog', this.process_click);
	},

	/**
	 * @param {Event} e
	 * @return {boolean} Whether e corresponds to an OCP key command
	 */
	is_key_command: function(e) {
		if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
			return false;
		}

		// 68 = D, 81 = Q, 82 = R, 84 = T, 49-57 = 1-9
		if (e.which !== 68 && e.which !== 81 && e.which !== 82 && e.which !== 84 && (e.which < 49 || e.which > 57)) {
			return false;
		}

		if ($(e.target).is('input,textarea') || $(e.target).attr('contenteditable')) {
			return false;
		}

		return true;
	},

	suspend_tumblr_key_commands: function(e) {
		if (this.is_key_command(e)) {
			XKit.tools.add_function(function() { Tumblr.KeyCommands.suspend(); }, true);
		}
	},

	process_keydown: function(e) {
		if (!XKit.extensions.one_click_postage.is_key_command(e)) {
			return;
		}

		var header_height = $(".l-header-container").height();
		// Tumblr puts 20 px of padding between posts in addition to the height of the header
		var screen_pos = $(window).scrollTop() + 20 + header_height;

		// Find the post at the top of the screen, if there is one
		$(".reblog_button, .post_control.reblog").filter(':visible').each(function() {
			if ($(this).hasClass("radar_button")) { return; }
			var $parent_box = $(this).parentsUntil(".post").parent();
			var box_pos = $parent_box.offset().top;
			if (box_pos <= screen_pos && box_pos + $parent_box.innerHeight() > screen_pos) {
				if (XKit.extensions.one_click_postage.user_on_box && e.which >= 49 && e.which <= 57) { // 49-57 = 1-9
					var index = e.which - 49;
					var quickTags = $("#x1cpostage_quick_tags").find(".xkit-tag");
					
					if (quickTags.length > index) {
						quickTags[index].click();
					}
				} else {
					switch (e.which) {
					case 68: // 68 = D
						XKit.extensions.one_click_postage.open_menu($(this), true);
						XKit.extensions.one_click_postage.post(1, false);
						break;
					case 81: // 81 = Q
						XKit.extensions.one_click_postage.open_menu($(this), true);
						XKit.extensions.one_click_postage.post(2, false);
						break;
					case 82: // 82 = R
						XKit.extensions.one_click_postage.open_menu($(this), true);
						XKit.extensions.one_click_postage.post(0, false);
						break;
					case 84: // 84 = T
						XKit.extensions.one_click_postage.user_on_box = true;
						XKit.extensions.one_click_postage.open_menu($(this), false, true);
						$('#x1cpostage_tags').focus();
					}
				}

				e.preventDefault();
				return false;
			} else if (box_pos > screen_pos) {
				// Post is too far down the screen, stop looking
				return false;
			}
		});
		// re-enable tumblr's key commands since we suspended them in suspend_tumblr_key_commands
		XKit.tools.add_function(function() { Tumblr.KeyCommands.resume(); }, true);
	},

	/**
	 * Allows keep_tags to continue to work even in the post editor.
	 * @param {Event} e
	 */
	process_click: function(e) {
		var $parent_box = $(e.target).parentsUntil('.post').parent();

		if (this.auto_tagger && typeof XKit.extensions.auto_tagger != "undefined") {
			// Call Auto Tagger for tags. Specifies that this is a reblog
			var post_obj = XKit.interface.parse_post($parent_box);
			var additional_tags = XKit.extensions.auto_tagger.return_tags(post_obj, false);
			if (additional_tags !== "") {
				setTimeout(function() {
					XKit.extensions.auto_tagger.inject_to_window(additional_tags);
				}, 200);
			}
		}
	},

	open_menu: function($obj, hide_ui, force_on_screen) {
		if ($obj.attr('x1cpostage_disabled') === "true" || $obj.hasClass("xkit-one-click-reblog-working") === true) {
			// we are!
			return;
		}

		// Get the box ID.
		var $parent_box = $obj.parentsUntil(".post").parent();
		var box_id = $parent_box.attr('data-post-id');
		var previous_id = $(this.last_object).attr('data-post-id');

		// Let's first hide our previous box.
		// only if the current id != previous ID.
		if (box_id !== previous_id) {
			// It is not! Hide it.
			// Also, change all the settings.
			$("#x1cpostage_box").css('display', 'none');
			XKit.extensions.one_click_postage.reset_box();
		} else {
			// Lets see if the box is already open.
			if ($("#x1cpostage_box").css("display") === "block") {
				// It is. Let's end.
				return;
			}
		}

		// Re-show the caption stuff.
		if (XKit.extensions.one_click_postage.preferences.show_caption.value) {
			$("#x1cpostage_caption").css("display", "block");
			$("#x1cpostage_replace").css("display", "block");
		} else {
			$("#x1cpostage_caption").css("display", "none");
			$("#x1cpostage_replace").css("display", "none");
		}

		$("#x1cpostage_remove_caption").css("display", "block");
		$("#x1cpostage_caption").removeClass("x1cpostage_remove_caption_on");
		$("#x1cpostage_tags").css("border-top", "0");
		$("#x1cpostage_caption").css("height", XKit.extensions.one_click_postage.caption_height + "px");

		if (this.preferences.show_blog_selector.value && this.preferences.default_blog.value !== "") {
			$("#x1cpostage_blog option:selected").prop("selected", false);
			$("#x1cpostage_blog option[value='" + this.preferences.default_blog.value + "']").prop("selected", true);
		}

		$obj.attr("title", "");

		// Call Auto Tagger for tags. Will be "" if auto_tagger is disabled
		if (!this.auto_tagger_done) {
			var
				post_obj = XKit.interface.parse_post($parent_box),
				state = 0, // reblog
				tags = $("#x1cpostage_tags").val();

			this.auto_tagger_done = true;
			tags += (tags ? ", " : "") + this.get_auto_tagger_tags(post_obj, state, false);
			$("#x1cpostage_tags").val(tags);
		}

		// Quick Tags?
		if (this.quick_tags === true && typeof XKit.extensions.quick_tags != "undefined") {
			// Call Quick Tags to render our box.
			if (XKit.extensions.quick_tags.preferences.show_in_one_click_postage.value) {
				$("#x1cpostage_quick_tags").html(XKit.extensions.quick_tags.return_for_one_click_postage());
			}
		}

		if (hide_ui !== true) {
			// Determine where we are going to show the box.
			var offset = $obj.offset();

			// Box position
			var box_left = offset.left - ($("#x1cpostage_box").width() / 2) + 13;
			var box_top = offset.top + 35;

			if (this.preferences.show_reverse_ui.value) {
				box_top = (offset.top - $("#x1cpostage_box").height()) - 12;
			}

			if (force_on_screen === true) {
				var window_top = $(window).scrollTop();
				var window_bottom = window_top + $(window).height();
				if (box_top < window_top) {
					box_top = window_top + 5;
				} else if (box_top + $("#x1cpostage_box").height() > window_bottom) {
					box_top = window_bottom - $("#x1cpostage_box").height() - 5;
				}
			}

			$("#x1cpostage_box").css("top", box_top + "px");
			$("#x1cpostage_box").css("left", box_left + "px");

			$("#x1cpostage_box").removeClass("xkit_x1cpostage_queue_press");
			$("#x1cpostage_box").removeClass("xkit_x1cpostage_queue_hover");

			if (this.preferences.show_reverse_ui.value) {
				$("#x1cpostage_box").fadeIn('fast');
			} else {
				$("#x1cpostage_box").slideDown('fast');
			}
		}

		this.last_object = $parent_box;
		this.last_icon_object = $obj;
		this.last_post_id = $parent_box.attr('data-post-id');
	},

	reset_box: function() {
		this.ignore_box_input_blurring = true;
		$("#x1cpostage_tags").val("").blur();
		$("#x1cpostage_caption").val("").blur();
		this.ignore_box_input_blurring = false;
		this.auto_tagger_done = false;
	},

	close_menu: function(force) {
		clearTimeout(this.menu_closer_int);

		if (force === true) {
			this.user_on_box = false;
			if (this.preferences.show_reverse_ui.value) {
				$("#x1cpostage_box").fadeOut('fast');
			} else {
				$("#x1cpostage_box").slideUp('fast');
			}
		} else {
			this.menu_closer_int = setTimeout(function() {
				if (XKit.extensions.one_click_postage.user_on_box === false) {
					if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value) {
						$("#x1cpostage_box").fadeOut('fast');
					} else {
						$("#x1cpostage_box").slideUp('fast');
					}
				}
			}, 700);
		}
	},

	/**
	 * Make a post
	 * @param {number} state - State of post, 0 is reblog, 1 is draft, 2 is queue
	 * @param {boolean} retry_mode - Whether the function is currently retrying
	 * @param {boolean} quick_queue_mode - If this is from a Quick Queue button
	 *                                     instead of the OCP UI
	 */
	post: function(state, retry_mode, quick_queue_mode) {
		this.close_menu(true);

		if ($("#x1cpostage_blog").length > 0) {
			this.default_blog_id = $("#x1cpostage_blog").val();
		} else if (this.blogs_list.indexOf(this.default_blog_id) === -1) {
			XKit.window.show("Default blog not available",
				"<b>Your default blog is no longer available.</b><br/>" +
				"This might be caused by changing the URL of the blog or logging into a different account.<br/><br/>" +
				"Please change or unset the default blog in the One-Click Postage Control Panel to continue.",
				"error",
				'<div class="xkit-button default" id="xkit-close-message">OK</div>'
			);
			return;
		}

		var
			post = XKit.interface.parse_post(this.last_object),
			blog_id = this.default_blog_id,
			caption = $("#x1cpostage_caption").val() || "",
			tags = $("#x1cpostage_tags").val() || "",
			$button,
			request = {
				reblog_id: parseInt(post.id),
				reblog_key: post.reblog_key
			};

		if (quick_queue_mode) {
			caption = "";
			tags = this.get_auto_tagger_tags(post, state, false);
			$button = $(this.last_object).find(".xkit-one-click-postage-quickqueue");
		} else {
			tags = this.add_auto_tagger_state_tags(tags, state);
			$button = $(this.last_object).find(".reblog_button, .post_control.reblog").addClass("xkit-one-click-reblog-working");
		}

		XKit.interface.post.fetch(request).then(

			function(data) {
				if (data.errors === false) {
					XKit.extensions.one_click_postage.process(data, state, blog_id, caption, tags, $button, request, false, post.root_id, quick_queue_mode);
				} else {
					XKit.extensions.one_click_postage.show_error("OCP05", state);
				}
			},

			function(response) {
				switch (response.status) {
				case 401:
					XKit.extensions.one_click_postage.show_error("OCP01", state);
					break;
				case 404:
					XKit.extensions.one_click_postage.show_error("OCP02 [Post Not Found]", state);
					break;
				default:
					if (!retry_mode) {
						setTimeout(function() { XKit.extensions.one_click_postage.post(state, true, quick_queue_mode); }, 500);
						return;
					} else {
						XKit.extensions.one_click_postage.show_error("OCP03-" + response.status, state);
					}
				}

				$button.removeClass("xkit-one-click-reblog-working");
			}

		);
	},

	process: function(data, state, blog_id, caption, tags, $button, post, retry_mode, root_id, quick_queue_mode) {

		var full_post = {
			channel_id: blog_id,
			reblog: true,
			reblog_post_id: post.reblog_id,
			reblog_key: post.reblog_key,
			remove_reblog_tree:
				$("#x1cpostage_caption").hasClass("x1cpostage_remove_caption_on") ||
				$("#x1cpostage_replace").hasClass("selected"),
			"post[tags]": tags,
			"post[type]": data.post.type,
			"post[state]": state,
			send_to_twitter: $("#xkit-1cp-social-twitter").hasClass("selected"),
			send_to_fbog: $("#xkit-1cp-social-facebook").hasClass("selected")
		};

		if (caption) {
			caption = XKit.tools.replace_all(caption, "\n", "<br/>");
		}

		var caption_field = "post[two]";

		if (data.post.type === "link" || data.post.type === "note") {
			caption_field = "post[three]";
		}

		if (!$("#x1cpostage_caption").hasClass("x1cpostage_remove_caption_on")) {
			if (caption !== "" && typeof caption !== "undefined") {
				if (this.preferences.enable_popup_html.value) {
					full_post[caption_field] = "<p>" + caption + "</p>";
				} else {
					full_post[caption_field] = "<p>" + $("<div/>").text(caption).html() + "</p>";
				}
			}
		}

		if (full_post[caption_field]) {
			full_post[caption_field] = XKit.tools.replace_all(full_post[caption_field], "&lt;br&gt;", "<br/>");
			full_post[caption_field] = XKit.tools.replace_all(full_post[caption_field], "&lt;br/&gt;", "<br/>");
		}

		XKit.interface.post.update(full_post).then(

			function(result) {
				$button.removeClass("xkit-one-click-reblog-working");

				if (result.errors === false) {
					if (XKit.extensions.one_click_postage.preferences.enable_alreadyreblogged.value) {
						XKit.extensions.one_click_postage.add_to_alreadyreblogged(root_id);
					}

					if (XKit.extensions.one_click_postage.preferences.enable_alreadyreblogged.value || XKit.extensions.one_click_postage.preferences.dim_posts_after_reblog.value) {
						if (!quick_queue_mode) {
							XKit.extensions.one_click_postage.make_button_reblogged($button);
						} else {
							XKit.interface.switch_control_button($button, false);
							XKit.interface.completed_control_button($button, true);
						}
					}

					if (!XKit.extensions.one_click_postage.preferences.dont_show_notifications.value) {
						if (XKit.extensions.one_click_postage.preferences.use_toasts.value) {
							XKit.toast.add(result.created_post, result.verbiage, result.post_tumblelog.name_or_id, result.post.id, result.post_context_page);
						} else {
							XKit.notifications.add(result.message, "ok");
						}
					}
				} else {
					XKit.extensions.one_click_postage.show_error("OCP10", state);
				}
			},

			function(response) {
				XKit.interface.kitty.set("");

				switch (response.status) {
				case 401:
					XKit.extensions.one_click_postage.show_error("OCP06", state);
					break;
				case 404:
					XKit.extensions.one_click_postage.show_error("OCP07", state);
					break;
				default:
					if (!retry_mode) {
						XKit.extensions.one_click_postage.process.apply(XKit.extensions.one_click_postage, arguments);
						return;
					} else {
						XKit.extensions.one_click_postage.show_error("OCP08-" + response.status, state);
					}
				}

				$button.removeClass("xkit-one-click-reblog-working");
			}
		);
	},

	add_to_alreadyreblogged: function(post_id) {
		if (post_id && this.already_reblogged.indexOf(post_id) === -1) {
			this.already_reblogged.push(post_id);
			this.save_alreadyreblogged();
		}
	},

	is_alreadyreblogged: function(post_id) {
		return this.already_reblogged.indexOf(post_id) !== -1;
	},

	save_alreadyreblogged: function() {
		var limit = parseInt(this.preferences.already_reblogged_limit.value.substring(1)) || 3000;

		while (this.already_reblogged.length >= limit) {
			this.already_reblogged.shift();
		}

		XKit.storage.set("one_click_postage", "already_reblogged", JSON.stringify(this.already_reblogged));
	},

	show_error: function(code, state) {
		var m_word = "reblog";
		if (state === 1) { m_word = "draft"; }
		if (state === 2) { m_word = "queue"; }

		var m_causes = "<ul class=\"xkit-one-click-postage-error-list\">" +
					"<li><b>You have used your daily post limit. (<a href=\"#\">more information</a>)</b><br/>The limit is 250 per day, set by Tumblr. Try again in 24 hours.<br/>This affects the queue too, and can't be circumvented.</li>" +
					"<li><b>You've filled up your queue.</b><br/>You can not queue more than 300 posts.</li>" +
					"<li><b>The post is deleted.</b><br/>The post you are trying to " + m_word + " is deleted by the user.</li>" +
					"<li><b>Your browser settings are denying XKit cookies.</b><br/>If you have disabled \"Third Party Cookies\", One-Click Postage can not work properly. Please enable them and try again.</li>" +
					"<li><b>There was a server error / change.</b><br/>Wait for a while and retry the " + m_word + " request.<br/>Check the XKit blog for updates.</li>" +
				"</ul>";

		if (state === 2 && XKit.interface.user().queue >= 299) {
			m_causes = "<ul class=\"xkit-one-click-postage-error-list\">" +
					"<li><b>You've filled your queue.</b><br/>You can not queue more than 300 posts.</li>" +
				"</ul>";
		}

		XKit.window.show("I could not " + m_word + " your post.", "<b>One of the following might be the reason for that:</b>" + m_causes + "<small>Error Code: <b>" + code + "</b>.</small>", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://new-xkit-extension.tumblr.com/\" class=\"xkit-button\">Visit the New XKit Blog</a><a href=\"http://new-xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
	}
});
