//* TITLE April Fool's **//
//* VERSION 1.0.1 **//
//* DESCRIPTION Brings back a couple of jokes Tumblr did for April 1st **//
//* DETAILS Brings back Framed Avatars and The Missing E from 2018's Tumblr April Fools. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.april_fools = new Object({

	running: false,
	messages: parseInt($(".messaging_notice_container .tab_notice_value").html()),
	blogs: XKit.tools.get_blogs(),

	preferences: {
		"mutualchecker": {
			text: "Mutual Checker&emsp;<a style=\"cursor: pointer;\" id=\"frame_reqs\">Requirements</a>",
			type: "separator"
		},
		"frames": {
			text: "Frame avatars",
			default: true,
			value: true
		},

		"aim": {
			text: "AOL Instant Messenger",
			experimental: true,
			default: false,
			value: false
		},

		"classic_header": {
			text: "Header Options&emsp;<a style=\"cursor: pointer;\" id=\"e_reqs\">Requirements</a>",
			type: "separator"
		},
		"missing_e": {
			text: "The Missing E",
			default: true,
			value: true
		}
	},

	cpanel: function() {
		$('[data-setting-id="aim"]').css("display", "none");
		$("#frame_reqs").click(function() {
			XKit.window.show(
				"Framed Avatars Requirements",
				`To activate this option, you must:
				<ul style="list-style-type: disc; margin-left: 1.5em;" id="frame_checklist">
					<li>Have Mutual Checker enabled</li>
				</ul>`,
				"info",
				`<div class="xkit-button default" id="xkit-close-message">OK</div>`
			);
			XKit.installed.when_running("mutualchecker",
				function() {
					$("#frame_checklist li").eq(0).append("&ensp;✔️");
				},
				function() {
					$("#frame_checklist li").eq(0).append("&ensp;❌");
				}
			);
		});
		$("#e_reqs").click(function() {
			XKit.window.show(
				"The Missing E Requirements",
				`To activate this option, you must:
				<ul style="list-style-type: disc; margin-left: 1.5em;" id="e_checklist">
					<li>Have Header Options enabled</li>
					<li>Use its full tumblr logo option</li>
				</ul>`,
				"info",
				`<div class="xkit-button default" id="xkit-close-message">OK</div>`
			);
			XKit.installed.when_running("classic_header",
				function() {
					$("#e_checklist li").eq(0).append("&ensp;✔️");
					if (XKit.extensions.classic_header.preferences.fix_logo.value) {
						$("#e_checklist li").eq(1).append("&ensp;✔️");
					} else {
						$("#e_checklist li").eq(1).append("&ensp;❌");
					}
				},
				function() {
					$("#e_checklist li").eq(0).append("&ensp;❌");
				}
			);
		});
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("april_fools");

		if (this.preferences.frames.value) {
			XKit.installed.when_running("mutualchecker",
				function() {
					XKit.post_listener.add("april_fools_frames", XKit.extensions.april_fools.do_frames);
					XKit.extensions.april_fools.do_frames();
				},
				function() {
					XKit.extensions.april_fools.preferences.frames.value = false;
				}
			);
		}

		if (this.preferences.aim.value) {
			XKit.notifications.add("AIM has moved to Tumblr Labs!", "warning", true, this.show_aim_removal);
		}

		if (this.preferences.missing_e.value) {
			XKit.installed.when_running("classic_header",
				function() {
					if (XKit.extensions.classic_header.preferences.fix_logo.value) {
						$(".logo .png-logo").after(`<div class="missing-e-logo"></div>`).css("display", "none");
					} else {
						XKit.extensions.april_fools.preferences.missing_e.value = false;
					}
				},
				function() {
					XKit.extensions.april_fools.preferences.missing_e.value = false;
				}
			);
		}
	},

	do_frames: function() {
		$(".post_avatar_link:not(.xkit-fools-done)").each(function() {
			var $avatar = $(this).addClass("xkit-fools-done"), json_obj, username;
			try {
				json_obj = JSON.parse($avatar.attr("data-tumblelog-popover"));
				username = json_obj.name;
			} catch (e) {
				username = $avatar.attr("data-tumblelog-name") || JSON.parse($avatar.attr("data-peepr")).tumblelog;
			}
			if (XKit.extensions.april_fools.blogs.indexOf(username) !== -1) {
				if (!$avatar.parent().hasClass("avatar")) {
					$avatar.parent().addClass("tbc-frame-avatar");
				}
			} else if (json_obj.following) {
				if (typeof XKit.extensions.mutualchecker.mutuals[username] === "undefined") {
					XKit.interface.is_following(username, XKit.extensions.mutualchecker.preferences.main_blog.value).then(function(follow) {
						if (follow) {
							$avatar.parent().addClass("tbc-frame-avatar");
							XKit.extensions.mutualchecker.mutuals[username] = true;
						} else {
							XKit.extensions.mutualchecker.mutuals[username] = false;
						}
					});
				} else if (XKit.extensions.mutualchecker.mutuals[username]) {
					$avatar.parent().addClass("tbc-frame-avatar");
				}
			}
		});
	},

	show_aim_removal: function() {
		XKit.extensions.april_fools.preferences.aim.value = false;
		XKit.storage.set("april_fools", "extension__setting__aim", "false");
		XKit.window.show("New XKit April Fool's",
			"AOL Instant Messenger is now available as an option in Tumblr Labs. " +
			"We've removed our option for it, so you can enjoy the seamless native experience instead!" +
			"<br><br>" +
			"If you turned them off, be sure to turn Tumblr IM sounds back on for the full experience.",
			"info",
			'<a class="xkit-button default" href="https://www.tumblr.com/settings/labs">Tumblr Labs</a>' +
			'<div class="xkit-button" id="xkit-close-message">Close</div>');
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("april_fools");
		XKit.post_listener.remove("april_fools_frames");
		$(".tbc-frame-avatar").removeClass("tbc-frame-avatar");
		$(".xkit-fools-done").removeClass("xkit-fools-done");
		$("body").first().removeClass("flag--aim-messenger");
		$(".compose-text-input-container .submit-button .submit").off("click");
		$(document).off("keydown");
		$(".missing-e-logo").remove();
		$(".logo .png-logo").css("display", "");
	}
});
