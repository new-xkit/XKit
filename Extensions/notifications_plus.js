//* TITLE Notifications+ **//
//* VERSION 1.5.5 **//
//* DESCRIPTION Enhances the notifications **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* DETAILS This extension replaces both XPreview and Only Replies extensions of XKit 6. Using this, you can hover over notifications to get post notes, and toggle the option that dims non-reply notifications. **//
//* SLOW true **//

XKit.extensions.notifications_plus = new Object({

	running: false,
	slow: true,
	apiKey: XKit.api_key,

	last_post_id: "",
	last_post_notes: 0,
	current_post_id: "",

	preferences: {
		"sep_0": {
			text: "FollowDot",
			type: "separator",
		},
		"follow_glow": {
			text: "Highlight the dashboard notifications from people I follow",
			default: true,
			value: true
		},
		"sep_1": {
			text: "XPreview",
			type: "separator",
		},
		"show_notes": {
			text: "Show notes when I hover on a notification",
			default: true,
			value: true
		},
		"show_bigger_preview": {
			text: "Show bigger preview when I hover on a notification",
			default: false,
			value: false
		},
		"sep_4": {
			text: "Dim Notifications",
			type: "separator",
		},
		"only_replies": {
			text: "Dim non-reply notifications",
			default: false,
			value: false
		},
		"dont_dim_on_reblogs": {
			text: "Don't dim notifications on reblogs with new text",
			default: false,
			value: false,
			slow: true
		},
	},

	run: function() {
		this.running = true;

		if (XKit.extensions.notifications_plus.preferences.only_replies.value === true) {
			XKit.tools.add_css("ol#posts .notification { opacity: 0.29; } ol#posts .notification_answer, ol#posts .notification_reply, ol#posts .notification_photo_reply ol#posts .notification:hover { opacity: 1; } ", "notifications_plus_only_replies");
		}

		if (XKit.extensions.notifications_plus.preferences.dont_dim_on_reblogs.value === true) {
			XKit.post_listener.add("notifications_plus", XKit.extensions.notifications_plus.dedim);
			XKit.extensions.notifications_plus.dedim();
		}

		if (XKit.interface.where().dashboard === true || XKit.interface.where().channel === true) {

			if (XKit.extensions.notifications_plus.preferences.follow_glow.value === true) {
				XKit.post_listener.add("notifications_plus_followglow", XKit.extensions.notifications_plus.follow_glow);
				XKit.extensions.notifications_plus.follow_glow();
			}

		}

		if (XKit.extensions.notifications_plus.preferences.show_notes.value === true) {
			XKit.tools.init_css("notifications_plus");
			XKit.extensions.notifications_plus.xpreview_init();
		}
	},

	follow_glow: function() {

		$(".notification").not("notifications-follow-glow-plus-done").each(function() {

			$(this).addClass("notifications-follow-glow-plus-done");

			var check_div = $(this).find(".control.avatar_frame");

			if (typeof $(check_div).attr('data-tumblelog-popover') !== "undefined") {

				var u_obj = JSON.parse($(check_div).attr('data-tumblelog-popover'));

				if (u_obj.following === true) {

					$(this).addClass("xkit-notifications-plus-follow-glow");
					$(this).append("<div class=\"xkit-notifications-plus-follow-dot\">&nbsp;</div>");

				}

			} else {

				// Probably old notifications.

				if ($(this).hasClass("xkit_notification_follower_is_friend")) {

					$(this).addClass("xkit-notifications-plus-follow-glow");
					$(this).append("<div class=\"xkit-notifications-plus-follow-dot\">&nbsp;</div>");

				}

			}

		});

	},

	dedim: function() {

		$(".notification_reblog").not("notifications-plus-done").each(function() {

			$(this).addClass(".notifications-plus-done");
			if ($(this).find("blockquote").length > 0) {
				$(this).css("opacity", "1");
			}

		});

	},

	xpreview_init: function() {

		if (XKit.extensions.notifications_plus.preferences.show_bigger_preview.value === true) {
			$("body").append("<div class=\"with-preview\" id=\"xpreview-container\"><img src=\"\" id=\"xpreview-image\"><div id=\"xpreview-notes\">&hearts; 302</div></div>");
		} else {
			$("body").append("<div id=\"xpreview-container\"><div id=\"xpreview-notes\">&hearts; 302</div></div>");
		}

		$(document).on("mouseenter", ".notification, .ui_note", function() {
			XKit.extensions.notifications_plus.xpreview_show($(this));
		});

		$(document).on("mouseleave", ".notification, .ui_note", function(e) {
			$("#xpreview-container").css("display", "none");
		});

	},

	xpreview_show: function(obj) {

		/*var obj = $(e.target);

		if ($(obj).hasClass("notification") !== true) {
			obj = $(obj).parentsUntil('#posts')[0];
		}*/

		// get post URL.
		var post_url = $(obj).find(".preview_frame").attr('href');
		if ($(obj).hasClass("ui_note") === true) {
			post_url = $(obj).find(".part_glass").attr('href');
		}

		if ($(obj).hasClass("is_follower") === true) { return; }

		var using_preview = false;

		if (XKit.extensions.notifications_plus.preferences.show_bigger_preview.value === true) {
			if ($(obj).hasClass("ui_note") === true) {
				if ($(obj).find(".ui_post_badge").hasClass("photo")) {
					using_preview = true;
					var m_preview = $(obj).find(".ui_post_badge").css("background-image");
					m_preview = m_preview.substring(4, m_preview.length - 1);
					m_preview = XKit.tools.replace_all(m_preview, "\\\"", "");
					$("#xpreview-image").attr('src', m_preview);
					$("#xpreview-image").css("display", "block");
					$("#xpreview-container").addClass("with-preview");
				} else {
					$("#xpreview-container").removeClass("with-preview");
					$("#xpreview-image").css("display", "none");
				}
			} else {
				if (!$(obj).find(".preview_frame").hasClass("icon")) {
					$("#xpreview-image").attr('src', $(obj).find(".preview_frame").find("img").attr('src'));
					$("#xpreview-image").css("display", "block");
					$("#xpreview-container").addClass("with-preview");
					using_preview = true;
				} else {
					$("#xpreview-container").removeClass("with-preview");
					$("#xpreview-image").css("display", "none");
				}
			}
		}

		if (post_url === "" || typeof post_url === "undefined") {
			// XReply is here! (Compatibility with XKit 6)
			post_url = $(obj).attr('data-old-href');
			if (post_url === "") {
				// Something awful happened.
				return;
			}
		}

		XKit.console.add("Notifications+: Post URL is " + post_url);

		// Break it down.
		post_url = post_url.replace(/https?:\/\//, '');

		var parts = post_url.split('/');
		var blog_id = parts[0];
		var post_id = parts[2];


		// Position the window.
		var offset = $(obj).offset();
		// Box position
		var box_left = offset.left + $(obj).width();

		var box_top = offset.top + 7;
		if (using_preview === true) {
			box_top = offset.top - 34;
		}
		$("#xpreview-container").css("top", box_top + "px");
		$("#xpreview-container").css("left", box_left + "px");
		$("#xpreview-container").css("display", "block");
		$("#xpreview-container").addClass("loading");
		$("#xpreview-notes").html("loading");

		XKit.console.add("Notifications+: Post ID is " + post_id + " | blog_id = " + blog_id);

		XKit.extensions.notifications_plus.xpreview_load(post_id, blog_id);

	},

	xpreview_load: function(post_id, blog_id) {

		XKit.extensions.notifications_plus.current_post_id = post_id;

		if (XKit.extensions.notifications_plus.last_post === post_id) {
			$("#xpreview-notes").html("&hearts; " + XKit.extensions.notifications_plus.last_post_notes);
			$("#xpreview-container").removeClass("loading");
			return;
		}

		if (blog_id === "") {
			XKit.console.add("Can't do XPreview, no blog_id");
			$("#xpreview-container").css("display", "none");
			$("#xpreview-container").removeClass("loading");
			return;
		}

		var api_url = "https://api.tumblr.com/v2/blog/" + blog_id + "/posts" + "?api_key=" + XKit.extensions.notifications_plus.apiKey + "&id=" + post_id;

		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function() {
				XKit.console.add("Can not load page to load notes.");
			},
			onload: function(response) {
				try {
					var data = JSON.parse(response.responseText).response;
					$("#xpreview-container").removeClass("loading");
					$("#xpreview-notes").html("&hearts; " + data.posts[0].note_count);
					XKit.extensions.notifications_plus.last_post = post_id;
					XKit.extensions.notifications_plus.last_post_notes = data.posts[0].note_count;
				} catch (e) {
					XKit.console.add(e.message);
				}

			}
		});

	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("notifications_plus");
		XKit.post_listener.remove("notifications_plus_followglow");
		XKit.tools.remove_css("notifications_plus_only_replies");
	}

});
