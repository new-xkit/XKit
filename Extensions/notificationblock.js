//* TITLE NotificationBlock **//
//* VERSION 1.3.5 **//
//* DESCRIPTION Blocks notifications from a post **//
//* DEVELOPER new-xkit **//
//* DETAILS One post got way too popular and now just annoying you? Click on the notification block icon on that post to hide the notifications from that post. If you have Go-To-Dash installed, you can click on a notification, then click View button on top-right corner to quickly go back to the post on your dashboard.  **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.notificationblock = new Object({

	running: false,
	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjUxNjI3RkQxNjVDMTFFM0E2RkFCMjhCQTdGQjEwOTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjUxNjI3RkUxNjVDMTFFM0E2RkFCMjhCQTdGQjEwOTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NTE2MjdGQjE2NUMxMUUzQTZGQUIyOEJBN0ZCMTA5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NTE2MjdGQzE2NUMxMUUzQTZGQUIyOEJBN0ZCMTA5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgYk6NEAAAEhSURBVHjaYmDAD44C8Q5ckv///0fBjFjUWILUAfEJKA0CjLgMIwS+AvEnmHokA1cD8QJSXYbsGnQ2CDPhchkTA2mAEZ8kqYbBQAMQFxCjEDmccLH/AfEXSsMMhQ00AEO/OxC3ADEfmgt0kNi6WFzJCWUrAfFdWGR8hEouQDMMF+5Bcog/ED8C4g8ww85CFYHCwYKAQfVIBn1BEm+EGVaKJHgGj0GiUEMEoBbDxM8DMS/MMBEg/kbIe1DFpVjk5qMn4GkEDDsCVfwJi9wPIH6CbJgKEP8mwmUgcAqL/Fr0rDWBgOuYsMT2e1hOQDeMF5RecBi0FKp4LZIYyIUm+IojUOJ8jsUwKahiGP8qELMRU7ZJQMuur8heRDIsBVdBCRBgAOnA+a8Ss3qFAAAAAElFTkSuQmCC",
	button_ok: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0FDNkNDNzYxNkVEMTFFM0E2RkFCMjhCQTdGQjEwOTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0FDNkNDNzcxNkVEMTFFM0E2RkFCMjhCQTdGQjEwOTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QUM2Q0M3NDE2RUQxMUUzQTZGQUIyOEJBN0ZCMTA5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QUM2Q0M3NTE2RUQxMUUzQTZGQUIyOEJBN0ZCMTA5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhNHAxwAAAFhSURBVHjaYsxeqs2ABxwF4s9A7IFLwZSoK3A2CxZ5SyD+D8QngNiKgQSAzbA9QPwXiPnQxFcD8VcgTiDFMC4cakOgLsZpGBMDaYARnySphsFAAxAXEONNYkAdEH8D4gnUcBnIu9zYvOkOxC1YYk8Hia2LK6JylukoAfFdmDdXQQ2SQYupy0jsS0jsHqSI8AfiyTCHgFx2ByoRB8QWRAR8CZT9BYg3ALEsEE+EuWwFEBtBbZuCxyAxIH4NxAJA/A7JdRegrgW7bD4Qf4dKGOMxDGRQKRC/R0tvF4D58zPMsDdAvICA945C6VoscpHACHiCnDT6gPgPHsOsoTQooE+jybED8Ulkw0CRMJWA62BqTZHEPgBxIdCbweiJFuSFezgMWgbE/4B4LZIYyIWuQIMmYMsBoEAMAOIXWAwrhdJBUPoaENsA8Rl82QmUUA2BeA0078EAsgWpQAwqnn+h2wgQYAAh60jncAp2xAAAAABJRU5ErkJggg==",
	blacklisted: [],

	preferences: {

		ask: {
			text: "Show the confirmation window",
			default: true,
			value: true
		},

		on_notifications: {
			text: "Show the NotificationBlock button ('block') on notifications",
			default: true,
			value: true
		}

	},

	run: function() {

		this.running = true;

		if (XKit.interface.where().inbox === true) {
			return;
		}

		XKit.tools.init_css("notificationblock");

		try {
			var m_blacklist = XKit.storage.get("notificationblock", "posts", "").split(",");
			if (m_blacklist !== "") {
				this.blacklisted = m_blacklist;
			}
		} catch (e) {
			XKit.storage.set("notificationblock", "posts", "");
			this.blacklisted = [];
		}

		if ($("#posts").length > 0 || $(".notification").length > 0 || $(".ui_note").length > 0) {
			$(document).on('click', '.xnotificationblockbutton', XKit.extensions.notificationblock.on_click);
			XKit.interface.create_control_button("xnotificationblockbutton", this.button_icon, "NotificationBlock", "", this.button_ok);
			XKit.post_listener.add("notificationblock", XKit.extensions.notificationblock.do);
			XKit.extensions.notificationblock.do();
		}

		if (XKit.interface.where().activity === true) {
			console.log("In activity, repeat block mode");
			setInterval(function() { XKit.extensions.notificationblock.do(); }, 1500);
		}

		if (this.preferences.on_notifications.value === true) {
			$(document).on("mouseenter", ".notification", XKit.extensions.notificationblock.enter_notification);
			$(document).on("click", ".xkit-notification-notification-block-button", function(e) {
				var m_parent = $(this).parentsUntil(".notification").parent();
				e.preventDefault();
				XKit.extensions.notificationblock.on_click_notification(m_parent, e);
			});
		}

	},

	on_click_notification: function(obj, event) {

		var post_id = "";
		var post_url = "";

		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();

		if (typeof $(obj).attr('data-url-original') !== "undefined") {
			post_url = $(obj).attr('data-url-original');
		} else {
			post_url = $(obj).find(".preview_frame").attr('href');
		}

		if (post_url === "") { return; }

		post_url = post_url.split("/");
		for (var i = 0; i < post_url.length; i++) {

			if (post_url[i] === "post") {
				post_id = post_url[i + 1];
				break;
			}

		}

		if (XKit.extensions.notificationblock.preferences.ask.value === false) {

			XKit.extensions.notificationblock.block(post_id);
			return;

		}

		XKit.window.show("Block notifications from this post?", "Notifications originating from this post will be blocked on the dashboard, Old Notifications and Activity page, without any indication that it was blocked.", "question", "<div class=\"xkit-button default\" id=\"xkit-notification-block-ok\">Block Notifications</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-notification-block-ok").click(function() {

			XKit.window.close();
			XKit.extensions.notificationblock.block(post_id);

		});

	},

	enter_notification: function(event) {

		var n_box = event.target;
		if ($(n_box).hasClass("notification") === false || $(n_box).hasClass("notification_inner") === true) {
			// Must be in a sub-div.
			if ($(n_box).hasClass("notification_inner") === true) {
				n_box = $(n_box).parent();
			} else {
				n_box = $(n_box).parentsUntil(".notification").parent();
			}
		}

		if (n_box.find(".xkit-notification-notification-block-button").length < 1) {

			// We are setting a timeout for the one-click reply button.

			setTimeout(function() {

				n_box.find(".xkit-notification-notification-block-button").remove();

				var m_html = "<a onclick=\"return false\" class=\"xkit-notification-notification-block-button\">block</a>";

				if ($(n_box).find(".block").length > 0) {
					$(n_box).find(".block").after(m_html);

					if ($(n_box).find(".xkit-reply-button").length > 0) {
						console.log("Has One-Click Reply button, pushing! 0");
						$(n_box).find(".xkit-notification-notification-block-button").css("right", (38 + $(n_box).find(".xkit-reply-button").width() + 5) + "px");
					}

				} else {

					$(n_box).find(".notification_sentence").append(m_html);

					if ($(n_box).find(".xkit-reply-button").length > 0) {
						console.log("Has One-Click Reply button, pushing! 0");
						$(n_box).find(".xkit-notification-notification-block-button").css("right", (35 + $(n_box).find(".xkit-reply-button").width() + 5) + "px");
					}

					if ($(n_box).hasClass("xkit-old-notifications")) {
						$(n_box).find(".xkit-notification-notification-block-button").css("top", "16px");
					} else {
						$(n_box).find(".xkit-notification-notification-block-button").css("top", "12px");
					}
					if ($(n_box).hasClass("stretchy_kid_container") === true) {
						if ($(n_box).find(".xkit-reply-button").length > 0) {
							console.log("Has One-Click Reply button, pushing! 1");
							$(n_box).find(".xkit-notification-notification-block-button").css("right", (8 + $(n_box).find(".xkit-reply-button").width() + 5) + "px");
						} else {
							$(n_box).find(".xkit-notification-notification-block-button").css("right", "8px");
						}
					} else {
						if ($(n_box).hasClass("xkit-old-notifications")) {

							if ($(n_box).find(".xkit-reply-button").length > 0) {
								console.log("Has One-Click Reply button, pushing! 2");
								$(n_box).find(".xkit-notification-notification-block-button").css("right", (43 + $(n_box).find(".xkit-reply-button").width() + 5) + "px");
							} else {
								$(n_box).find(".xkit-notification-notification-block-button").css("right", "43px");
							}
						} else {
							if ($(n_box).find(".xkit-reply-button").length > 0) {
								console.log("Has One-Click Reply button, pushing! 3");
								$(n_box).find(".xkit-notification-notification-block-button").css("right", (38 + $(n_box).find(".xkit-reply-button").width() + 5) + "px");
							} else {
								$(n_box).find(".xkit-notification-notification-block-button").css("right", "38px");
							}
						}
					}
				}
				var m_right = 45 + $(n_box).find(".xkit-notification-notification-block-button").width();
				if ($(n_box).find(".xkit-reply-button").length > 0) {
					console.log("Has One-Click Reply button, pushing! 15");
					m_right += $(n_box).find(".xkit-reply-button").width() + 8;
				}
				if (XKit.extensions.notificationblock.added_css !== true) {
					XKit.tools.add_css(".notification .block, .notification .ignore { right: " + m_right + "px !important; }", "notificationblock_notfix");
					XKit.extensions.notificationblock.added_css = true;
				}

			}, 400);

		}

	},

	unblock: function(post_id) {

		var m_index = XKit.extensions.notificationblock.blacklisted.indexOf(post_id);
		if (m_index !== -1) {
			XKit.extensions.notificationblock.blacklisted.splice(m_index, 1);
			XKit.storage.set("notificationblock", "posts", XKit.extensions.notificationblock.blacklisted.join(","));
		}
		$(".notification.xnotificationblockchecked").removeClass("xnotificationblockchecked");
		XKit.extensions.notificationblock.do();

	},

	block: function(post_id) {

		if (XKit.extensions.notificationblock.blacklisted.indexOf(post_id) === -1) {
			XKit.extensions.notificationblock.blacklisted.push(post_id);
			XKit.storage.set("notificationblock", "posts", XKit.extensions.notificationblock.blacklisted.join(","));
		}
		$(".notification.xnotificationblockchecked").removeClass("xnotificationblockchecked");
		XKit.extensions.notificationblock.do();

	},

	on_click: function(e) {

		var obj = e.target || e.srcElement;

		if (XKit.extensions.notificationblock.preferences.ask.value === false) {

			if ($(obj).hasClass("xkit-interface-completed")) {
				XKit.extensions.notificationblock.unblock($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), false);
			} else {
				XKit.extensions.notificationblock.block($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), true);
			}

			return;

		}

		if ($(obj).hasClass("xkit-interface-completed")) {
			// Already blocked, user trying to unblock it.

			XKit.window.show("Unblock notifications from this post?", "Notifications from this post will be shown.<br/>You'll need to refresh the page for changes to take effect.", "question", "<div class=\"xkit-button default\" id=\"xkit-notification-block-ok\">Unblock Notifications</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-notification-block-ok").click(function() {

				XKit.window.close();
				XKit.extensions.notificationblock.unblock($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), false);

			});

		} else {

			XKit.window.show("Block notifications from this post?", "Notifications originating from this post will be blocked on the dashboard, Old Notifications and Activity page, without any indication that it was blocked.", "question", "<div class=\"xkit-button default\" id=\"xkit-notification-block-ok\">Block Notifications</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-notification-block-ok").click(function() {

				XKit.window.close();
				XKit.extensions.notificationblock.block($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), true);

			});

		}

	},

	do: function() {

		$(".notification").not(".xnotificationblockchecked").each(function() {

			$(this).addClass("xnotificationblockchecked");

			var target_url = $(this).find(".notification_target").attr('href');

			if ($(this).attr('data-url-original') !== "undefined" && $(this).attr('data-url-original') !== "") {
				target_url = target_url + " " +	$(this).attr('data-url-original');
			}

			if ($(this).find(".preview_frame").attr('href') !== "undefined") {
				target_url = target_url + " " +	$(this).find(".preview_frame").attr('href');
			}

			for (var i = 0; i < XKit.extensions.notificationblock.blacklisted.length; i++) {
				if (XKit.extensions.notificationblock.blacklisted[i] === "" ||
					typeof(XKit.extensions.notificationblock.blacklisted[i]) === "undefined") {
					continue;
				}
				if (target_url.indexOf("/post/" + XKit.extensions.notificationblock.blacklisted[i]) !== -1) {
					console.log("Blocking notification because of post " + XKit.extensions.notificationblock.blacklisted[i]);
					$(this).remove();
					return;
				}
			}

		});

		$(".ui_note,.activity-notification").not(".xnotificationblockchecked").each(function() {

			$(this).addClass("xnotificationblockchecked");

			var target_url = $(this).find(".part_glass,.activity-notification__glass").attr('href');
			target_url += " " +  $(this).find(".ui_post_badge").attr("data-peepr");

			for (var i = 0; i < XKit.extensions.notificationblock.blacklisted.length; i++) {
				if (XKit.extensions.notificationblock.blacklisted[i] === "" ||
						typeof(XKit.extensions.notificationblock.blacklisted[i]) === "undefined") {
					continue;
				}
				if (target_url.indexOf(XKit.extensions.notificationblock.blacklisted[i]) !== -1) {
					console.log("Blocking notification because of post " + XKit.extensions.notificationblock.blacklisted[i]);
					if ($(this).next().hasClass("xkit-activity-plus-condensed-opener")) {
						$(this).next().remove();
					}
					$(this).remove();
					return;
				}
			}

		});

		$(".xkit-old-notifications, .notification").first().addClass("first_notification");
		$(".xkit-old-notifications, .notification").first().each(function() {
			if ($(this).is(":last")) {
				$(this).removeClass("first_notification").addClass("single_notification");
			}
		});


		if ($(".posts .post").length > 0) {

			var posts = XKit.interface.get_posts("xnotificationblockchecked");

			$(posts).each(function() {

				$(this).addClass("xnotificationblockchecked");

				var m_post = XKit.interface.post($(this));
				if (m_post.is_mine !== true) { return; }

				var this_id = m_post.id;

				XKit.interface.add_control_button(this, "xnotificationblockbutton", "data-root_id=\"" + this_id + "\"");

				if (XKit.extensions.notificationblock.blacklisted.indexOf(this_id) !== -1) {

					XKit.interface.completed_control_button($(this).find(".xnotificationblockbutton"), true);

				}

			});

		}

	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("notificationblock");
		$(".xnotificationblockbutton").remove();
		$(".xnotificationblockchecked").removeClass("xnotificationblockchecked");
		$(".xkit-notification-notification-block-button").remove();
		XKit.tools.remove_css("notificationblock_notfix");
	}
});
