//* TITLE Classic Notifications **//
//* VERSION 0.7.1 **//
//* DESCRIPTION Notifications where they were **//
//* DETAILS This is a very experimental extension that brings back the notifications to your blog pages (ie: www.tumblr.com/blog/xkit-extension), just the way it was before Tumblr's Activity update. Only the last 10 notifications are displayed. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_notifications = new Object({

	running: false,
	blacklisted: [],

	preferences: {
		"count": {
			text: "Number of Notifications to display",
			default: "c10",
			value: "c10",
			type: "combo",
			values: [
				"5 Notifications", "c5",
				"10 Notifications (default)", "c10",
				"20 Notifications", "c20"
			],
		}
	},

	run: function() {
		this.running = true;

		if (document.location.href.indexOf('/new/') !== -1) { return; }

		if (XKit.interface.where().channel) {
			XKit.extensions.old_notifications.fetch();
			$(document).on('click', '.notification.xkit-old-notifications', XKit.extensions.old_notifications.open_notification);
		}

		this.max_notifications = parseInt(this.preferences.count.value.substring(1));

	},

	fetch_failed: function(err) {

		console.log("Can't fetch Activity page!");

	},

	open_notification: function(e) {

		var m_target = $(e.target);

		if ($(m_target).hasClass("xkit-reply-button") === true) {
			return;
		}

		var m_parent = $(m_target).parentsUntil(".xkit-old-notifications").parent();
		window.open($(m_parent).attr('data-load-url'));

	},

	alt_notification: false,
	max_notifications: 9,
	notification_count: 0,

	render_notification: function(obj) {

		var $obj = $(obj);

		if (!$obj.hasClass("activity-notification")) {
			return "";
		}


		var notification_url = $obj.find(".activity-notification__glass").attr('href');

		var notification_username = $obj.attr('data-tumblelog-name');
		var notification_user_url = $obj.find(".activity").find("a").attr('href');
		var notification_avatar = $obj.find(".ui_avatar_link").attr('data-avatar-url');

		notification_avatar = notification_avatar.replace("_64.png", "_40.png");
		notification_avatar = notification_avatar.replace("_64.gif", "_40.gif");
		notification_avatar = notification_avatar.replace("_64.jpg", "_40.jpg");
		notification_avatar = notification_avatar.replace("_128.png", "_40.png");
		notification_avatar = notification_avatar.replace("_128.gif", "_40.gif");
		notification_avatar = notification_avatar.replace("_128.jpg", "_40.jpg");

		var summary = "";
		if ($obj.find(".activity-notification__activity_main").find(".summary").length > 0) {
			summary = $obj.find(".activity-notification__activity_main").find(".summary").html();
		}

		var response = "";
		if ($obj.find(".activity-notification__activity_response").length > 0) {
			response = $obj.find(".activity-notification__activity_response").html();
		}

		var fake_original_url = notification_url;
		var original_id = null;
		try {
			var peepr = JSON.parse($obj.find(".ui_post_badge").attr('data-peepr'));
			original_id = peepr.postId;
			fake_original_url = `http://${peepr.tumblelog}.tumblr.com/post/${original_id}`;
		} catch (e) {
		}

		if (original_id) {
			if (typeof XKit.extensions.old_notifications !== "undefined") {

				for (var i = 0; i < XKit.extensions.old_notifications.blacklisted.length; i++) {
					if (XKit.extensions.old_notifications.blacklisted[i] === "" ||
					    typeof(XKit.extensions.old_notifications.blacklisted[i]) === "undefined") {
						continue;
					}
					if (original_id === XKit.extensions.old_notifications.blacklisted[i]) {
						// console.log("[Old Notifications]Blocking notification because of post " + XKit.extensions.old_notifications.blacklisted[i]);
						return "";
					}
				}

			}

		}

		var notification_preview = $obj.find(".ui_post_badge").css("background-image");

		if (notification_preview !== "" && typeof notification_preview !== "undefined") {
			notification_preview = notification_preview.substring(4, notification_preview.length - 1);
			if (notification_preview.indexOf("\"") !== -1) {
				notification_preview = XKit.tools.replace_all(notification_preview, "\"", "");
			}
		}

		var is_friend = $obj.hasClass("is_friend");
		var is_reblog = $obj.hasClass("is_reblog");
		var is_reply = $obj.hasClass("is_reply");
		var is_answer = $obj.hasClass("is_answer");
		var is_like = $obj.hasClass("is_like");
		var is_follow = $obj.hasClass("is_follower");
		var is_mention = $obj.hasClass("user_mention") || $obj.hasClass("note_mention");

		var preview_frame_class = "icon regular";
		var preview_image = notification_preview;

		var is_post_photo = $obj.find(".ui_post_badge").hasClass("photo");
		var is_post_chat = $obj.find(".ui_post_badge").hasClass("conversation");
		var is_post_quote = $obj.find(".ui_post_badge").hasClass("quote");
		var is_post_link = $obj.find(".ui_post_badge").hasClass("link");
		var is_post_audio = $obj.find(".ui_post_badge").hasClass("audio");
		var is_post_video = $obj.find(".ui_post_badge").hasClass("video");

		var m_post_type_text = "post";
		if (is_post_photo) { m_post_type_text = "photo"; preview_frame_class = ""; }
		if (is_post_chat) { m_post_type_text = "chat"; preview_frame_class = "icon chat"; }
		if (is_post_quote) { m_post_type_text = "quote"; preview_frame_class = "icon quote"; }
		if (is_post_link) { m_post_type_text = "link"; preview_frame_class = "icon link"; }
		if (is_post_audio) { m_post_type_text = "audio post"; preview_frame_class = "icon audio"; }
		if (is_post_video) { m_post_type_text = "video post"; preview_frame_class = "icon video"; }
		if (is_mention) { m_post_type_text = "in a post"; preview_frame_class = "icon mention"; }

		var load_url = "";

		var additional_classes = "";

		if (XKit.extensions.old_notifications.notification_count === 0)
			additional_classes = additional_classes + " first_notification ";

		if (XKit.extensions.old_notifications.notification_count % 2 === 0)
			additional_classes = additional_classes + " alt ";

		if (response !== "")
			additional_classes = additional_classes + " with_commentary ";

		if (is_answer)
			additional_classes = additional_classes + " notification_answer ";

		if (is_reply)
			additional_classes = additional_classes + " notification_reply ";

		if (is_reblog)
			additional_classes = additional_classes + " notification_reblog ";

		if (is_like)
			additional_classes = additional_classes + " notification_like";

		if (is_follow)
			additional_classes = additional_classes + " notification_follower";

		if (is_mention)
			additional_classes = additional_classes + " notification_user_mention";

		if (is_friend)
			additional_classes = additional_classes + " xkit_notification_follower_is_friend";

		var m_inner_html = "";
		var no_preview_frame = false;

		if ($obj.hasClass('fanmail')) {
			load_url = notification_url;
			m_inner_html = $obj.find(".activity").html();
		}

		if (is_follow) {

			load_url = notification_user_url;

			m_inner_html = "<a class=\"username\" href=\"" + notification_user_url + "\">" + notification_username + "</a> started following you ";
			no_preview_frame = true;

		}

		if (is_like) {

			load_url = notification_url;

			m_inner_html = "<a class=\"username\" href=\"" + notification_user_url + "\">" + notification_username + "</a> liked your ";

			if (summary !== "") {
				m_inner_html = m_inner_html + m_post_type_text + "<span class=\"colon\">:</span> <em style=\"white-space:nowrap;\"><a class=\"notification_target\" href=\"" + notification_url + "\">" + summary + "</em></a>";
			} else {
				m_inner_html = m_inner_html + "<a class=\"notification_target\" href=\"" + notification_url + "\">" + m_post_type_text + "</a>";
			}
		}

		if (is_reblog) {

			load_url = notification_url;

			m_inner_html = "<a class=\"username\" href=\"" + notification_user_url + "\">" + notification_username + "</a> reblogged your ";

			if (summary !== "") {
				m_inner_html = m_inner_html + m_post_type_text + "<span class=\"colon\">:</span> <em style=\"white-space:nowrap;\"><a class=\"notification_target\" href=\"" + notification_url + "\">" + summary + "</em></a>";
			} else {
				m_inner_html = m_inner_html + "<a class=\"notification_target\" href=\"" + notification_url + "\">" + m_post_type_text + "</a>";
			}

			if (response !== "") {
				m_inner_html = m_inner_html + "<span class=\"colon\">:</span>" + response;
			}

		}

		if (is_mention) {

			load_url = notification_url;

			m_inner_html = "<a class=\"username\" href=\"" + notification_user_url + "\">" + notification_username + "</a> mentioned you ";

			if (summary !== "") {
				m_inner_html = m_inner_html + m_post_type_text + "<span class=\"colon\">:</span> <em style=\"white-space:nowrap;\"><a class=\"notification_target\" href=\"" + notification_url + "\">" + summary + "</em></a>";
			} else {
				m_inner_html = m_inner_html + "<a class=\"notification_target\" href=\"" + notification_url + "\">" + m_post_type_text + "</a>";
			}

			if (response !== "") {
				m_inner_html = m_inner_html + "<span class=\"colon\">:</span>" + response;
			}

		}


		if (is_reply) {

			load_url = notification_url;

			m_inner_html = "<a class=\"username\" href=\"" + notification_user_url + "\">" + notification_username + "</a> replied to your ";

			if (summary !== "") {
				m_inner_html = m_inner_html + m_post_type_text + "<span class=\"colon\">:</span> <em style=\"white-space:nowrap;\"><a class=\"notification_target\" href=\"" + notification_url + "\">" + summary + "</em></a>";
			} else {
				m_inner_html = m_inner_html + "<a class=\"notification_target\" href=\"" + notification_url + "\">" + m_post_type_text + "</a>";
			}

			if (response !== "") {
				m_inner_html = m_inner_html + "<span class=\"colon\">:</span>" + response;
			}

		}

		if (is_answer) {

			load_url = notification_url;

			m_inner_html = "<a class=\"username\" href=\"" + notification_user_url + "\">" + notification_username + "</a> answered your ";

			if (summary !== "") {
				m_inner_html = m_inner_html + m_post_type_text + "<span class=\"colon\">:</span> <em style=\"white-space:nowrap;\"><a class=\"notification_target\" href=\"" + notification_url + "\">" + summary + "</em></a>";
			} else {
				m_inner_html = m_inner_html + "<a class=\"notification_target\" href=\"" + notification_url + "\">" + m_post_type_text + "</a>";
			}

			if (response !== "") {
				m_inner_html = m_inner_html + "<span class=\"colon\">:</span>" + response;
			}

		}

		var preview_img_html = "";

		if (is_post_photo) {
			preview_img_html = "<img src=\"" + preview_image + "\">";
		}

		var m_html = "<li data-url-original=\"" + fake_original_url + "\" data-load-url=\"" + load_url + "\" id=\"xkit-old-notifications-" + (XKit.extensions.old_notifications.notification_count + 1) + "\" class=\"xkit-old-notifications notification " + additional_classes + "\">" +
				"<div class=\"notification_inner  clearfix\">" +
					"<div class=\"notification_sentence\">" +
						"<div class=\"hide_overflow\">" +
							m_inner_html +
						"</div>" +
					"</div>" +
				"</div>" +
				"<a target=\"_blank\" href=\"" + notification_user_url + "\" class=\"avatar_frame\">" +
					"<img alt=\"\" class=\"avatar\" src=\"" + notification_avatar + "\" data-src=\"" + notification_avatar + "\">" +
				"</a>";

		if (!no_preview_frame) {
			m_html = m_html + "<div class=\"notification_right\">" +
					"<a target=\"_blank\" class=\"preview_frame " + preview_frame_class + "\" href=\"" + notification_url + "\">" + preview_img_html + "</a>" +
				"</div>";
		}
		m_html = m_html + "</li>";

		XKit.extensions.old_notifications.notification_count++;

		return m_html;

	},

	render_notification_old: function(obj) {

		var new_obj = $(obj);

		if ($(new_obj).find(".ui_note").length <= 0) { return ""; }

		$(new_obj).find(".date_header").remove();
		$(new_obj).find(".part_glass").remove();
		$(new_obj).find(".part_ignore").remove();
		$(new_obj).find(".note_follow").remove();

		$(new_obj).find(".ui_avatar").unwrap();

		$(new_obj).find(".ui_avatar").addClass("avatar_frame_temporary");
		$(new_obj).find(".ui_avatar").removeClass("ui_avatar");

		$(new_obj).find(".ui_note").addClass("notification");
		$(new_obj).find(".ui_note").removeClass("ui_note");

		$(new_obj).find(".stage").addClass("notification_inner clearfix");
		$(new_obj).find(".stage").removeClass("stage");

		$(new_obj).find(".part_icon").addClass("notification_right");
		$(new_obj).find(".part_icon").removeClass("part_icon");

		$(new_obj).find(".part_activity").addClass("notification_sentence");
		$(new_obj).find(".part_activity").removeClass("part_activity");

		$(new_obj).find(".ui_post_badge").addClass("preview_frame");
		$(new_obj).find(".ui_post_badge").removeClass("ui_post_badge");

		$(new_obj).find(".part_main").addClass("hide_overflow");
		$(new_obj).find(".part_main").removeClass("part_main");

		if ($(new_obj).find(".preview_frame").hasClass("photo")) {
			var m_src = $(new_obj).find(".preview_frame").css("background-image");
			// ugly but works:
			m_src = m_src.substring(4, m_src.length - 1);
			$(new_obj).find(".preview_frame").append("<img src=\"" + m_src + "\">");
		} else {
			$(new_obj).find(".preview_frame").addClass("icon");
		}

		$(new_obj).find(".activity").find("a:first-child").addClass("username");

		if ($(new_obj).find(".summary").length > 0) {
			$(new_obj).find(".activity").after("<span class=\"colon\">:</span>");
		}

		// Get avatar:
		$(new_obj).find(".avatar").addClass("old-avatar-div");
		var avatar_url = $(new_obj).find(".avatar").css("background-image");
		avatar_url = avatar_url.substring(4, avatar_url.length - 1);
		$(new_obj).find(".notification").append("<a class=\"avatar_frame\"> <img class=\"avatar\" src=\"" + avatar_url + "\" data-src=\"" + avatar_url + "\"></a>");

		$(new_obj).find(".avatar_frame_temporary").remove();

		if ($(new_obj).find(".part_response").length > 0) {
			var m_response = $(new_obj).find(".part_response").html();
			$(new_obj).find(".notification_sentence").find(".hide_overflow").after(m_response);
			$(new_obj).find(".part_response").remove();
		}
		// first_notification -- last_notification
		var additional_classes = "";

		var m_link = $(obj).find(".part_glass").attr('href');

		if ($(new_obj).find(".notification").hasClass("is_answer"))
			additional_classes = additional_classes + " notification_answer ";

		if ($(new_obj).find(".notification").hasClass("is_reply"))
			additional_classes = additional_classes + " notification_reply ";

		if ($(new_obj).find(".notification").hasClass("is_reblog"))
			additional_classes = additional_classes + " notification_reblog ";

		if ($(new_obj).find(".notification").hasClass("is_like"))
			additional_classes = additional_classes + " notification_like";

		if (XKit.extensions.old_notifications.alt_notification)
			additional_classes = additional_classes + " alt ";

		if (XKit.extensions.old_notifications.notification_count === 0)
			additional_classes = additional_classes + " first_notification ";

		if (XKit.extensions.old_notifications.notification_count === XKit.extensions.old_notifications.max_notifications - 1)
			additional_classes = additional_classes + " last_notification ";

		var m_html = "<li data-url=\"" + m_link + "\" class=\"notification by-xkit-old-notifications " + additional_classes + "\">" + $(new_obj).html() + "</li>";

		XKit.extensions.old_notifications.alt_notification = !XKit.extensions.old_notifications.alt_notification;

		XKit.extensions.old_notifications.notification_count++;
		return m_html;

	},

	fetch_successful: function(data) {

		if (XKit.installed.check("notificationblock") === true) {
			XKit.console.add("notificationblock installed.");
			if (typeof XKit.extensions.notificationblock !== "undefined") {
				if (XKit.extensions.notificationblock.running === true) {
					if (XKit.extensions.notificationblock.blacklisted !== "undefined") {
						XKit.extensions.old_notifications.blacklisted = XKit.extensions.notificationblock.blacklisted;
					} else {
						XKit.console.add("notificationblock blacklist is undefined.");
					}
				} else {
					XKit.console.add("notificationblock is not running.");
				}
			} else {
				XKit.console.add("notificationblock is undefined.");
			}
		}

		var m_html = "";
		$(".activity-notification", data).each(function() {
			if (XKit.extensions.old_notifications.notification_count >= XKit.extensions.old_notifications.max_notifications) { return false; }
			m_html = m_html + XKit.extensions.old_notifications.render_notification($(this)[0].outerHTML);
		});
		$(".new_post_buttons_container").after(m_html);
		$("#xkit-old-notifications-" + XKit.extensions.old_notifications.notification_count).addClass("last_notification");

		if (XKit.installed.check("notificationblock") === true) {
			if (typeof XKit.extensions.notificationblock !== "undefined") {
				if (XKit.extensions.notificationblock.running === true) {
					XKit.console.add("Found NotificationBlock, calling.");
					XKit.extensions.notificationblock.do();
				}
			}
		}

		// Lets see if there is sth we should be doing to these notifications.
		setTimeout(function() { XKit.post_listener.check(true); }, 400);

	},

	fetch_id: "",

	fetch: function() {

		var my_id = XKit.tools.random_string();
		XKit.extensions.old_notifications.fetch_id = my_id;

		setTimeout(function() {
			var to_fetch = document.location.href.replace("/blog/", "/activity/");
			console.log("Trying to fetch " + to_fetch);
			GM_xmlhttpRequest({
				method: "GET",
				url: to_fetch,
				onerror: function(response) {
					if (my_id !== XKit.extensions.old_notifications.fetch_id) { return; }
					XKit.extensions.old_notifications.fetch_failed();
				},
				onload: function(response) {
					if (my_id !== XKit.extensions.old_notifications.fetch_id) { return; }
					XKit.extensions.old_notifications.fetch_successful(response.responseText);
				}
			});
		}, 300);

	},

	destroy: function() {
		this.running = false;
		this.notification_count = 0;
		this.alt_notification = false;
		this.blacklisted = [];
		XKit.extensions.old_notifications.fetch_id = "-1";
		$(".xkit-old-notifications").remove();
	}

});
