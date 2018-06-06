//* TITLE Mutual Checker **//
//* VERSION 2.0.0 **//
//* DESCRIPTION A simple way to see who follows you back **//
//* DETAILS Adds a small icon and '[user] follows you' hovertext to URLs you see in post headers (when appropriate).<br><br>Only checks the URL when the person directly made/reblogged/submitted/published the post, and doesn't work on sideblogs. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mutualchecker = new Object({
	
	running: false,
	mutuals: {},
	
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

	cpanel: function() {
		$("select[data-setting-id=\"main_blog\"] option").first().remove();
	},

	run: function() {
		this.running = true;
		var blogs = XKit.tools.get_blogs();
		if ($.inArray(this.preferences.main_blog.value, blogs) === -1) {
			this.preferences.main_blog.value = blogs[0];
		}
		XKit.tools.init_css("mutualchecker");
		this.add_follower_icons();
		this.add_post_icons();
		XKit.post_listener.add("mutualchecker", this.add_post_icons);
	},

	add_follower_icons: function() {
		var following = XKit.interface.where().following;
		$(".follower").each(function() {
			if (following || !$(this).find(".follow_button").length) {
				var $name_div = $(this).find(".name-link");
				var url = $name_div.text();
				XKit.interface.is_following(url, XKit.extensions.mutualchecker.preferences.main_blog.value).then(function(follow) {
					if (follow) {
						XKit.extensions.mutualchecker.add_label($name_div, url);
					}
				});
			}
		});
	},

	add_post_icons: function() {
		$(XKit.interface.get_posts("mutualchecker-done")).each(function() {
			var $post = $(this).addClass("mutualchecker-done"), json_obj;
			if ($post.hasClass("is_private_answer")) {
				try {
					json_obj = JSON.parse($post.find(".post_avatar_link").attr("data-tumblelog-popover"));
				} catch (e) {
					return;
				}
				XKit.extensions.mutualchecker.check(json_obj, $post.find(".post_info_submissions").first());
			} else {
				$post.find(".post_info_link[data-tumblelog-popover]:not(.reblog_icon + .post_info_link), .post-info-tumblelog > a[data-tumblelog-popover]").each(function() {
					var $link = $(this);
					try {
						json_obj = JSON.parse($link.attr("data-tumblelog-popover"));
					} catch (e) {
						return;
					}
					XKit.extensions.mutualchecker.check(json_obj, $link);
				});
			}
		});
	},

	check: function(json_obj, $link) {
		if (json_obj.following && !json_obj.customizable) {
			if (typeof this.mutuals[json_obj.name] === "undefined") {
				XKit.interface.is_following(json_obj.name, this.preferences.main_blog.value).then(function(follow) {
					if (follow) {
						XKit.extensions.mutualchecker.add_label($link, json_obj.name);
						XKit.extensions.mutualchecker.mutuals[json_obj.name] = true;
					} else {
						XKit.extensions.mutualchecker.mutuals[json_obj.name] = false;
					}
				});
			} else if (this.mutuals[json_obj.name]) {
				this.add_label($link, json_obj.name);
			}
		}
	},

	add_label: function($name_div, user) {
		if ($name_div.hasClass("post_info_submissions")) {
			$name_div.html('<span class="mutuals' + ( XKit.extensions.mutualchecker.preferences.put_in_front.value ? " mutuals-front" : "") + '">' + user + '</span>' + $name_div.text().trim().substring(user.length));
		} else {
			$name_div.addClass("mutuals").attr("title", user + " follows you");
			if (XKit.extensions.mutualchecker.preferences.put_in_front.value) {
				$name_div.addClass("mutuals-front");
			}
		}
	},

	destroy: function() {
		this.running = false;
		this.mutuals = {};
		XKit.post_listener.remove("mutualchecker");
		$(".mutuals").removeAttr("title").removeClass("mutuals").removeClass("mutuals-front");
		$(".mutualchecker-done").removeClass("mutualchecker-done");
		XKit.tools.remove_css("mutualchecker");
	}
});
