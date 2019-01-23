//* TITLE Messaging Tweaks **//
//* VERSION 1.8.1 **//
//* DESCRIPTION Helpful tweaks for Tumblr IM **//
//* DETAILS This adds a few helpful tweaks to the Tumblr IM, for example minimising the chat, hiding the IM icon or changing the looks of the chat window. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.messaging_tweaks = new Object({

	running: false,

	observer: null,
	chat_window_observer: null,
	last_chat_title: "",
	read_message_count: -1,
	first_chat_open: true,
	notification: window.Notification || window.mozNotification || window.webkitNotification,
	can_use_notifications: false,

	preferences: {

		"sep0": {
			text: "Messaging Popout & Button Tweaks",
			type: "separator",
		},
		"reveal_true_face": {
			text: "Tumbley the Tumblr",
			default: false,
			value: false
		},
		"hide_chat_bubble": {
			text: "Hide the chat bubble completely",
			default: false,
			value: false
		},
		"hide_send_post": {
			text: "Hide the send post through IM in the post share menu",
			default: false,
			value: false
		},
		"hide_online_indicators": {
			text: "Hide online indicators from the messaging popout",
			default: false,
			value: false
		},

		"sep1": {
			text: "Chatbox Tweaks",
			type: "separator",
		},
		"move_self_to_right": {
			text: "Move your own messages to the right",
			default: true,
			value: true
		},
		"move_other_to_right": {
			text: "Move your chat partner's messages to the right",
			default: false,
			value: false
		},
		"allow_minimising": {
			text: "Allow minimising a chat by clicking on the title",
			default: true,
			value: true
		},
		"minimise_hotkey": {
			text: "Use Alt+[Down Arrow] to minimise and Alt+[Up Arrow] to bring the chatbox back",
			default: true,
			value: true
		},
		"allow_emojis": {
			text: "Enable Emojis in the chat",
			default: true,
			value: true
		},
		"remove_message_headers": {
			text: "Remove usernames from messages",
			default: false,
			value: false
		},
		"make_icons_round": {
			text: "Round user icons",
			default: false,
			value: false
		},
		"rectangle_icons_on_hover": {
			text: "Make icons rectangular on hover",
			default: false,
			value: false
		},

		"sep2": {
			text: "Notification Tweaks",
			type: "separator",
		},
		"sound_notification": {
			text: "Make a sound if you receive a new message",
			default: false,
			value: false
		},
		"desktop_notification": {
			text: "Show a desktop notification",
			default: false,
			value: false
		},
		"tab_title_notification": {
			text: "Show <[!!]> in Tab when you receive a new message.",
			default: true,
			value: true
		},

		"sep3": {
			text: "CSS Tweaks",
			type: "separator"
		},
		"my_chat_bubble_background": {
			text: "Background for my chat bubbles",
			type: "text",
			default: "",
			value: "rgba(0,0,0,.05)"
		},
		"other_chat_bubble_background": {
			text: "Background for other people's chat bubbles",
			type: "text",
			default: "",
			value: "rgba(0,0,0,.1)"
		},
		"my_chat_bubble_text": {
			text: "Text color for my chat bubbles",
			type: "text",
			default: "",
			value: "rgb(68,68,68)"
		},
		"other_chat_bubble_text": {
			text: "Text color for other people's chat bubbles",
			type: "text",
			default: "",
			value: "rgb(68,68,68)"
		},
		"background_override": {
			text: "Change chat background color",
			type: "text",
			default: "",
			value: ""
		}

	},

	visibilityHandler: function() {
		if (!document.hidden) {
			document.title = document.title.replace("<[!!]>", "");
		}
	},

	get_current_chat_user: function() {
		if ($(".title").text().indexOf("+") !== -1) {
			return $($(".title").find("a").get(0)).data("js-tumblelog-name");
		} else {
			return XKit.tools.get_current_blog();
		}
	},

	get_chat_partner_name: function() {
		if ($(".title").text().indexOf("+") !== -1) {
			return $($(".title").find("a").get(1)).data("js-tumblelog-name");
		} else {
			return $($(".title").find("a").get(0)).data("js-tumblelog-name");
		}
	},

	do_messages: function() {
		XKit.extensions.messaging_tweaks.observer.disconnect();
		var icons = $(".messaging-conversation-popovers .avatar:not(.xkit-my_messaging_icon, .xkit-others_messaging_icon)");

		function img_onload(msg_div, emoji_text, emoji) {
			msg_div.html(msg_div.html().replace(new RegExp(emoji_text, "g"), emoji.outerHTML));
		}
		icons.each(function() {
			if ($(this).parents(".conversation-compose").length !== 0) { return; }
			if ($(this).attr("data-js-tumblelog-name") === XKit.extensions.messaging_tweaks.get_current_chat_user()) {
				$(this).addClass("xkit-my_messaging_icon");
				$(this).parents(".conversation-message").addClass("xkit-my_messaging_message");
			} else if ($(this).is("div") && $(this).children("a").attr("data-js-tumblelog-name") === XKit.extensions.messaging_tweaks.get_current_chat_user()) {
				$(this).addClass("xkit-my_messaging_icon");
				$(this).parents(".conversation-message").addClass("xkit-my_messaging_message");
			} else {
				$(this).addClass("xkit-others_messaging_icon");
				$(this).parents(".conversation-message").addClass("xkit-others_messaging_message");
			}
			if (XKit.extensions.messaging_tweaks.preferences.allow_emojis.value) {
				var msg_div = $(this).parents(".conversation-message").find(".message-bubble .message");

				// Use regex to find emoji patterns in the chat message
				// Find the string between the two ":" to find which image to use
				// but only if there are emoji tags found
				var emojis = msg_div.text().match(/:(.*?):/gi);
				if (emojis) {
					var already_replaced = {};
					for (var i = 0; i < emojis.length; i++) {
						if (already_replaced[emojis[i]]) { continue; }
						already_replaced[emojis[i]] = true;
						var emoji_tag = emojis[i].toLowerCase().substring(1, emojis[i].length - 1);
						var emoji_url = "http://www.emoji-cheat-sheet.com/graphics/emojis/" + emoji_tag + ".png";
						if (emoji_tag === "tobdog") {
							emoji_url = "http://vignette1.wikia.nocookie.net/steamtradingcards/images/2/21/Tobdog.png/revision/latest?cb=20151011230955";
						} else if (emoji_tag === "+1") {
							emoji_url = "http://www.emoji-cheat-sheet.com/graphics/emojis/plus1.png";
						}
						var emoji = new Image();
						emoji.alt = ":" + emoji_tag + ":";
						emoji.title = ":" + emoji_tag + ":";
						emoji.height = "22";
						emoji.onload = img_onload.bind(this, msg_div, emojis[i].replace("+", "\\+"), emoji);
						emoji.src = emoji_url;
					}
				}
			}
		});
		if (XKit.extensions.messaging_tweaks.preferences.move_self_to_right.value) {
			$(".xkit-my_messaging_icon").each(function() {
				$(this).parent().append($(this));
			});
		}
		if (XKit.extensions.messaging_tweaks.preferences.move_other_to_right.value) {
			$(".xkit-others_messaging_icon").each(function() {
				$(this).parent().append($(this));
			});
		}

		if (XKit.extensions.messaging_tweaks.last_chat_title !== $(".messaging-conversation-popovers .title").text()) {
			XKit.extensions.messaging_tweaks.last_chat_title = $(".messaging-conversation-popovers .title").text();
			XKit.extensions.messaging_tweaks.first_chat_open = true;
			XKit.extensions.messaging_tweaks.read_message_count = 0;
			if (XKit.extensions.messaging_tweaks.preferences.allow_minimising.value) {
				$(".conversation-header-main").on("click.minimise_header", function(e) {
					if ($('.minimize').length) {
						$('.minimize').get(0).click();
					}
				});
			}
		}

		if ($(".xkit-others_messaging_icon").length > XKit.extensions.messaging_tweaks.read_message_count && $(".messaging-conversation-popovers .avatar:not(.pinned-target)").length > 1) {
			if (XKit.extensions.messaging_tweaks.first_chat_open) {
				XKit.extensions.messaging_tweaks.first_chat_open = false;
				XKit.extensions.messaging_tweaks.read_message_count = $(".xkit-others_messaging_icon").length;
			} else {
				var new_message_count = ($(".xkit-others_messaging_icon").length - XKit.extensions.messaging_tweaks.read_message_count);
				if (XKit.extensions.messaging_tweaks.preferences.sound_notification.value) {
					new Audio(XKit.extensions.messaging_tweaks.notification_sound).play();
				}
				if (document.hidden || $(".conversation-header-main").hasClass("minimised")) {
					if (XKit.extensions.messaging_tweaks.preferences.tab_title_notification.value) {
						document.title = "<[!!]> Tumblr";
					}
					if (XKit.extensions.messaging_tweaks.preferences.desktop_notification.value) {
						if (XKit.extensions.messaging_tweaks.can_use_notifications) {
							for (var i = 1; i <= new_message_count; i++) {
								new XKit.extensions.messaging_tweaks.notification(XKit.extensions.messaging_tweaks.get_chat_partner_name(), {
									body: $(".xkit-others_messaging_message:eq(-" + i + ") .message-bubble .message").text(),
									icon: $(".xkit-others_messaging_icon img").attr("src"),
								});
							}
						}
					}
				}
				XKit.extensions.messaging_tweaks.read_message_count = $(".xkit-others_messaging_icon").length;
			}
		}

		if ($(".conversation-main").get(0) !== null && typeof($(".conversation-main").get(0)) !== "undefined") {
			XKit.extensions.messaging_tweaks.observer.observe($(".conversation-main").get(0), { subtree: true, childList: true });
		}
	},

	hook_chat_window: function() {
		XKit.extensions.messaging_tweaks.observer.observe($(".conversation-main").get(0), { subtree: true, childList: true });
		XKit.extensions.messaging_tweaks.read_message_count = $(".xkit-others_messaging_icon").length;
	},

	run: function() {
		if (!XKit.interface.is_tumblr_page()) {
			return;
		}

		if (XKit.extensions.messaging_tweaks.preferences.minimise_hotkey.value) {
			$(document).on("keydown.minimise_header", function(e) {
				if (!e.altKey) { return; }
				if (e.which === 40) {
					if ($('.minimize').length) {
						 $('.minimize').get(0).click();
					}
				} else if (e.which === 38) {
					if ($('.conversation-minimized').length) {
						$('.conversation-minimized').get(0).click();
					}
				}
			});
		}

		if (XKit.extensions.messaging_tweaks.preferences.desktop_notification.value) {
			XKit.extensions.messaging_tweaks.notification.requestPermission(function(result) {
				if (result === "granted") {
					XKit.extensions.messaging_tweaks.can_use_notifications = true;
				}
			});
		}
		if (XKit.extensions.messaging_tweaks.preferences.tab_title_notification.value) {
			document.addEventListener("visibilitychange", XKit.extensions.messaging_tweaks.visibilityHandler);
		}
		XKit.extensions.messaging_tweaks.observer = new MutationObserver(XKit.extensions.messaging_tweaks.do_messages);
		XKit.extensions.messaging_tweaks.chat_window_observer = new MutationObserver(function(mutations, observer) {
			mutations.forEach(function(mutation) {
				var i, node;
				// Check if Chat Window has been added
				if (mutation.addedNodes.length) {
					for (i = 0; i < mutation.addedNodes.length; i++) {
						node = $(mutation.addedNodes[i]);
						if (node.hasClass("messaging-conversation-popovers")) {
							XKit.extensions.messaging_tweaks.hook_chat_window();
							return;
						}
					}
					// Check if chat window has been removed
				} else if (mutation.removedNodes.length) {
					for (i = 0; i < mutation.removedNodes.length; i++) {
						node = $(mutation.removedNodes[i]);
						if (node.hasClass("messaging-conversation-popovers")) {
							XKit.extensions.messaging_tweaks.observer.disconnect();
							XKit.extensions.messaging_tweaks.last_chat_title = "";
							XKit.extensions.messaging_tweaks.first_chat_open = true;
							return;
						}
					}
				}
			});
		});
		XKit.extensions.messaging_tweaks.chat_window_observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		});
		XKit.tools.init_css("messaging_tweaks");
		if (XKit.extensions.messaging_tweaks.preferences.reveal_true_face.value) {
			$(".tab.iconic.tab_messaging .tab_anchor").addClass("true-icon");
		}
		if (XKit.extensions.messaging_tweaks.preferences.hide_chat_bubble.value) {
			$(".tab.iconic.tab_messaging").hide();
		}
		if (XKit.extensions.messaging_tweaks.preferences.background_override.value !== "") {
			XKit.tools.add_css(".conversation-main { background-color: " + XKit.extensions.messaging_tweaks.preferences.background_override.value + " !important; }", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.move_self_to_right.value) {
			XKit.tools.add_css(".xkit-my_messaging_icon { position: absolute; right: 0px; margin-right: 0px !important; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .message-bubble { margin-left: 0px !important; margin-right: 40px; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .message-container { justify-content: flex-end !important; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .conversation-message-post .message-bubble { margin-right: unset; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .conversation-message-post .avatar { position: relative; right: unset; margin-left: 10px; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .conversation-message-post .thumbnail { margin-left: unset; margin-right: 40px; }", "messaging_tweaks");

		}
		if (XKit.extensions.messaging_tweaks.preferences.move_other_to_right.value) {
			XKit.tools.add_css(".xkit-others_messaging_icon { position: absolute; right: 0px; margin-right: 0px !important; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-others_messaging_message .message-bubble { margin-left: 0px !important; margin-right: 40px; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-others_messaging_message .message-container { justify-content: flex-end !important; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-others_messaging_message .conversation-message-post .message-bubble { margin-right: unset; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-others_messaging_message .conversation-message-post .avatar { position: relative; right: unset; margin-left: 10px; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-others_messaging_message .conversation-message-post .thumbnail { margin-left: unset; margin-right: 40px; }", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.remove_message_headers.value) {
			XKit.tools.add_css(".conversation-message-text .message-bubble-header a {display:none;}", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.hide_send_post.value) {
			XKit.tools.add_css(".messaging-share-post-search, .messaging-share-post-main {display:none;}", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.hide_online_indicators.value) {
			XKit.tools.add_css(".status-indicator-wrapper, .chat-status-banner {display:none;}", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.make_icons_round.value) {
			XKit.tools.add_css(".avatar > img { border-radius: 30px !important; transition: border-radius 0.5s; }", "messaging_tweaks");
			if (XKit.extensions.messaging_tweaks.preferences.rectangle_icons_on_hover.value) {
				XKit.tools.add_css(".avatar > img:hover { border-radius: 2px !important; }", "messaging_tweaks");
			}
		}

		if (XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_background.value) {
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-text .message-bubble { background-color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_background.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-post .message-bubble { background-color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_background.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-post .icon { background-color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_background.value + " !important; }", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_background.value) {
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-text .message-bubble { background-color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_background.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-post .message-bubble { background-color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_background.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-post .icon { background-color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_background.value + " !important; }", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value) {
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-text .message-bubble { color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-text .message-bubble-header a { color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-post .message-bubble { color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-post .icon:before { color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value + " !important; }", "messaging_tweaks");
		}
		if (XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value) {
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-text .message-bubble { color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-text .message-bubble-header a { color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-post .message-bubble { color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value + " !important; }", "messaging_tweaks");
			XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-post .icon:before { color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value + " !important; }", "messaging_tweaks");
		}

		// There's either 1 or no messaging-conversation-popovers on extension start
		$(".messaging-conversation-popovers").each(function() {
			XKit.extensions.messaging_tweaks.hook_chat_window();
			XKit.extensions.messaging_tweaks.do_messages();
		});

		this.running = true;
	},

	destroy: function() {
		if (XKit.extensions.messaging_tweaks.preferences.tab_title_notification.value) {
			document.removeEventListener("visibilitychange", XKit.extensions.messaging_tweaks.visibilityHandler);
			document.title = document.title.replace("<[!!]>", "");
		}
		XKit.extensions.messaging_tweaks.observer.disconnect();
		XKit.extensions.messaging_tweaks.chat_window_observer.disconnect();
		XKit.extensions.messaging_tweaks.last_chat_title = "";
		if (!XKit.extensions.messaging_tweaks.preferences.move_self_to_right.value) {
			$(".xkit-my_messaging_icon").each(function() {
				$(this).parent().prepend($(this));
			});
		}
		if (!XKit.extensions.messaging_tweaks.preferences.move_other_to_right.value) {
			$(".xkit-others_messaging_icon").each(function() {
				$(this).parent().prepend($(this));
			});
		}
		$(".true-icon").removeClass("true-icon");
		$(".tab.iconic.tab_messaging").show();
		$(".xkit-others_messaging_message, .xkit-my_messaging_message").each(function() {
			var msg_div = $(this).find(".message-bubble .message");
			msg_div.find("img").each(function() {
				var img_html = $('<div>').append($(this).clone()).html();
				var img_alt = $(this).attr("alt");
				msg_div.html(msg_div.html().replace(img_html, img_alt));
			});
		});
		$(".xkit-others_messaging_message").removeClass("xkit-others_messaging_message");
		$(".xkit-others_messaging_icon").removeClass("xkit-others_messaging_icon");
		$(".xkit-my_messaging_message").removeClass("xkit-my_messaging_message");
		$(".xkit-my_messaging_icon").removeClass("xkit-my_messaging_icon");
		XKit.tools.remove_css("messaging_tweaks");
		$(".conversation-header-main").off("click.minimise_header");
		$(document).off("keydown.minimise_header");
		this.running = false;
	},

	cpanel: function(cp) {
		function update() {
			if (round_icons_setting.hasClass("selected")) {
				rectangle_icons_setting.show();
			} else {
				rectangle_icons_setting.hide();
			}
		}
		var round_icons_setting = cp.find("[data-setting-id=make_icons_round]");
		var rectangle_icons_setting = cp.find("[data-setting-id=rectangle_icons_on_hover]");
		update();
		round_icons_setting.click(update);
	}

});
