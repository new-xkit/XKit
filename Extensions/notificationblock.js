//* TITLE NotificationBlock **//
//* VERSION 1.4.0 **//
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

	},

	run: async function() {

		this.running = true;

		if (XKit.interface.where().inbox === true) {
			return;
		}

		await XKit.css_map.getCssMap();
		XKit.tools.init_css("notificationblock");

		var storage = XKit.storage.get_all("notificationblock");
		if (storage && storage.posts) {
			this.blacklisted = storage.posts.value.split(",").filter(i => i);
		}

		XKit.interface.react.create_control_button("xnotificationblockbutton",
			this.button_icon, "NotificationBlock",
			this.on_click.bind(this), this.button_ok
		);

		XKit.post_listener.add("notificationblock", this.do.bind(this));
		this.do();

		if (XKit.interface.where().activity === true) {
			console.log("In activity, repeat block mode");
			setInterval(this.do.bind(this), 1000);
		}

	},

	recheck_all: function() {
		const notificationClasses = [
			"notification",
			...XKit.css_map.keyToClasses('notification'),
		];

		$(notificationClasses.map(cls => `.${cls}.xnotificationblockchecked`).join(", ")).
			removeClass("xnotificationblockchecked").removeAttr('data-xkit-notificationblock-blocked');

		this.do();
	},

	unblock: function(post_id) {
		var m_index = this.blacklisted.indexOf(post_id);
		if (m_index !== -1) {
			this.blacklisted.splice(m_index, 1);
			XKit.storage.set("notificationblock", "posts", this.blacklisted.join(","));
		}

		this.recheck_all();
	},

	block: function(post_id) {
		if (this.blacklisted.indexOf(post_id) === -1) {
			this.blacklisted.push(post_id);
			XKit.storage.set("notificationblock", "posts", this.blacklisted.join(","));
		}

		this.recheck_all();

	},

	on_click: function(e) {
		const self = this;
		const $block_button = $(e.target || e.srcElement);
		const post_id = $block_button.attr('data-post-id');

		if (this.preferences.ask.value === false) {
			if ($block_button.hasClass("xkit-interface-completed")) {
				this.unblock(post_id);
				XKit.interface.completed_control_button($block_button, false);
			} else {
				this.block(post_id);
				XKit.interface.completed_control_button($block_button, true);
			}

			return;
		}

		if ($block_button.hasClass("xkit-interface-completed")) {
			XKit.window.show("Unblock notifications from this post?",
				"Notifications from this post will be shown. You may have to refresh the page for changes to take effect",
				"question",
				'<div class="xkit-button default" id="xkit-notification-block-ok">Unblock Notifications</div><div class="xkit-button" id="xkit-close-message">Cancel</div>');

			$("#xkit-notification-block-ok").click(function() {
				self.unblock(post_id);
				XKit.window.close();
				XKit.interface.completed_control_button($block_button, false);
			});

		} else {
			XKit.window.show("Block notifications from this post?",
				"Notifications originating from this post will be blocked on the dashboard and activity page, without any indication that they were blocked.",
				"question",
				'<div class="xkit-button default" id="xkit-notification-block-ok">Block Notifications</div><div class="xkit-button" id="xkit-close-message">Cancel</div>');

			$("#xkit-notification-block-ok").click(function() {
				self.block(post_id);
				XKit.window.close();
				XKit.interface.completed_control_button($block_button, true);
			});
		}
	},

	populate_notification_props: function() {
		return XKit.tools.async_add_function(async () => {
			/* globals tumblr */

			const keyStartsWith = (obj, prefix) =>
				Object.keys(obj).find(key => key.startsWith(prefix));

			const cssMap = await tumblr.getCssMap();
			const elements = document.querySelectorAll(
				cssMap.notification.map(cls => `.${cls}:not([data-target-id])`).join(',')
			);

			elements.forEach(element => {
				let fiber = element[keyStartsWith(element, '__reactInternalInstance')];
				const notificationProp = () => fiber.memoizedProps && fiber.memoizedProps.notification;

				while (fiber && !notificationProp()) {
					fiber = fiber.return;
				}

				if (fiber) {
					const {targetPostId} = notificationProp();
					element.dataset.targetId = targetPostId;
				}
			});
		});
	},

	do: async function() {
		const self = this;

		if (self.blacklisted.some(i => i)) {
			const blacklisted_post_regexp = new RegExp(`\\b(${self.blacklisted.join('|')})\\b`);

			await self.populate_notification_props();

			$(`.notification, ${XKit.css_map.keyToCss('notification')}`).
				not(".xnotificationblockchecked").
				each(function() {
					const $note = $(this);

					$note.addClass("xnotificationblockchecked");

					let target_url = $note.children('a').attr('href') || $note.find(".notification_target").attr('href');

					if ($note.attr('data-target-id')) {
						target_url = target_url + " " + $note.attr('data-target-id');
					}

					if ($note.attr('data-url-original')) {
						target_url = target_url + " " +	$note.attr('data-url-original');
					}

					if (blacklisted_post_regexp.test(target_url)) {
						console.log(`Blocking ${target_url} with regex ${blacklisted_post_regexp}`);
						this.dataset.xkitNotificationblockBlocked = true;
					}
				});
		}

		$(".xkit-old-notifications, .notification").first().addClass("first_notification");
		$(".xkit-old-notifications, .notification").first().each(function() {
			if ($(this).is(":last")) {
				$(this).removeClass("first_notification").addClass("single_notification");
			}
		});

		if ($("[data-id]").length > 0) {
			const posts = await XKit.interface.react.get_posts("xnotificationblockchecked", !!'can_edit');
			$(posts).each(async function() {
				$(this).addClass("xnotificationblockchecked");
				var post_id = this.dataset.id;

				await XKit.interface.react.add_control_button($(this), "xnotificationblockbutton");

				if (XKit.extensions.notificationblock.blacklisted.indexOf(post_id) !== -1) {
					XKit.interface.completed_control_button(
						$(this).find(".xnotificationblockbutton div"), true
					);
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
