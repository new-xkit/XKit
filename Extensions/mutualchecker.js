//* TITLE Mutual Checker **//
//* VERSION 1.1.0 **//
//* DESCRIPTION Adds an icon next to usernames to indicate if they follow you **//
//* DETAILS Does what it says on the tin! Made from fresh, distilled Profiler juice. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mutualchecker = new Object({
	
	running: false,
	users: {},
	
	preferences: {
		"main_blog": {
			text: "Blog to check for follow-backs on:",
			default: "",
			value: "",
			type: "blog"
		},
		"put_in_front": {
			text: "Place mutual icon before, not after usernames",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		if (this.preferences.main_blog.value === "") {
			this.preferences.main_blog.value = XKit.tools.get_blogs()[0];
		}
		XKit.tools.init_css("mutualchecker");
		XKit.extensions.mutualchecker.add_post_icons();
		XKit.extensions.mutualchecker.add_follower_icons();
		XKit.post_listener.add("mutualchecker", XKit.extensions.mutualchecker.add_post_icons);
	},

	add_follower_icons: function() {
		$(".follower").each(function() {
			var url = $(this).find(".name").text();
			var name_div = $(this).find(".name");
			XKit.interface.is_following(url, XKit.extensions.mutualchecker.preferences.main_blog.value).then(function(follow) {
				if (follow) {
					XKit.extensions.mutualchecker.add_label(name_div, url);
				}
			});
		});
	},

	add_post_icons: function() {
		$(XKit.interface.get_posts("mutualchecker-done")).each(function() {
			$(this).addClass("mutualchecker-done");
			var post = XKit.interface.post($(this));
			if (!XKit.interface.where().inbox && post.is_mine) { return; }

			if (!XKit.interface.where().dashboard) {
				var json_info = $(this).find(".post_avatar_link, .post-info-tumblelog a").attr('data-tumblelog-popover');
				try {
					var json_obj = JSON.parse(json_info);
					if (!json_obj.following) { return; }
					post.owner = json_obj.name;
				} catch (e) {
					return;
				}
			}

			var name_div = {};
			$(this).find(".post_header .post_info_link:not(.reblog_info)").each(function() {
				try {
					var link_json = JSON.parse($(this).attr("data-peepr"));
					if (link_json.tumblelog === post.owner) {
						name_div = $(this).first();
						return false;
					}
				} catch (e) {
					return false;
				}
			});

			if (name_div.length == undefined) {
				name_div = $(this).find(".post_info_submissions, .post-info-tumblelog a").first();
			}
			if (!name_div.length) { return; }

			if (typeof XKit.extensions.mutualchecker.users[post.owner] === "undefined") {
				XKit.interface.is_following(post.owner, XKit.extensions.mutualchecker.preferences.main_blog.value).then(function(follow) {
					if (follow) {
						XKit.extensions.mutualchecker.add_label(name_div, post.owner);
						XKit.extensions.mutualchecker.users[post.owner] = true;
					} else {
						XKit.extensions.mutualchecker.users[post.owner] = false;
					}
				});
			} else if (XKit.extensions.mutualchecker.users[post.owner]) {
				XKit.extensions.mutualchecker.add_label(name_div, post.owner);
			}
		});
	},

	add_label: function(name_div, user) {
		if ($(name_div).hasClass("post_info_submissions")) {
			name_div.html('<span class="mutuals' + ( XKit.extensions.mutualchecker.preferences.put_in_front.value ? " mutuals-front" : "") + '">' + user + '</span>' + name_div.text().trim().substring(user.length));
		} else {
			name_div.addClass("mutuals").attr("title", user + " follows you");
			if (XKit.extensions.mutualchecker.preferences.put_in_front.value) { name_div.addClass("mutuals-front"); }
		}
	},

	destroy: function() {
		this.running = false;
		this.users = {};
		XKit.post_listener.remove("mutualchecker");
		$(".mutuals").removeAttr("title").removeClass("mutuals").removeClass("mutuals-front");
		$(".mutualchecker-done").removeClass("mutualchecker-done");
		XKit.tools.remove_css("mutualchecker");
	}
});
