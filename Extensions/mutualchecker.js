//* TITLE Mutual Checker **//
//* VERSION 2.0.5 **//
//* DESCRIPTION A simple way to see who follows you back **//
//* DETAILS Adds a small icon and &quot;[user] follows you&quot; hovertext to URLs you see in post headers (when appropriate).<br><br>Only checks the URL when the person directly made/reblogged/submitted/published the post, and can only check main blogs. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mutualchecker = new Object({

	running: false,
	mutuals: {},

	icon: '<svg class="xkit-mutual-icon" fill="var(--black)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M593 500q0-45-22.5-64.5T500 416t-66.5 19-18.5 65 18.5 64.5T500 583t70.5-19 22.5-64zm-90 167q-44 0-83.5 18.5t-63 51T333 808v25h334v-25q0-39-22-71.5t-59.5-51T503 667zM166 168l14-90h558l12-78H180q-8 0-51 63l-42 63v209q-19 3-52 3t-33-3q-1 1 0 27 3 53 0 53l32-2q35-1 53 2v258H2l-3 40q-2 41 3 41 42 0 64-1 7-1 21 1v246h756q25 0 42-13 14-10 22-27 5-13 8-28l1-13V275q0-47-3-63-5-24-22.5-34T832 168H166zm667 752H167V754q17 0 38.5-6.5T241 730q16-12 16-26 0-21-33-28-19-4-57-4-3 0-1-51 2-37 1-36V421q88 0 90-48 1-20-33-30-24-6-57-6-4 0-2-44l2-43h635q14 0 22.5 11t8.5 26v543q0 5 4 26 5 30 5 42 1 22-9 22z"/></svg>',
	april_fools_icon: '<svg class="xkit-mutual-icon" fill="#00b8ff"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M858 352q-6-14-8-35-2-12-4-38-3-38-6-54-7-28-22-43t-43-22q-16-3-54-6-26-2-38-4-21-2-34.5-8T619 124q-9-7-28-24-29-25-44-34-24-16-47-16t-47 16q-15 9-44 34-19 17-28 24-16 12-29.5 18t-34.5 8q-12 2-38 4-38 3-54 6-28 7-43 22t-22 43q-3 16-6 54-2 26-4 38-2 21-8 34.5T124 381q-7 9-24 28-25 29-34 44-16 24-16 47t16 47q9 15 34 44 17 19 24 28 12 16 18 29.5t8 34.5q2 12 4 38 3 38 6 54 7 28 22 43t43 22q16 3 54 6 26 2 38 4 21 2 34.5 8t29.5 18q9 7 28 24 29 25 44 34 24 16 47 16t47-16q15-9 44-34 19-17 28-24 16-12 29.5-18t34.5-8q12-2 38-4 38-3 54-6 28-7 43-22t22-43q3-16 6-54 2-26 4-38 2-21 8-34.5t18-29.5q7-9 24-28 25-29 34-44 16-24 16-47t-16-47q-9-15-34-44-17-19-24-28-12-16-18-29zm-119 62L550 706q-10 17-26.5 27T488 745l-11 1q-34 0-59-24L271 584q-26-25-27-60.5t23.5-61.5 60.5-27.5 62 23.5l71 67 132-204q20-30 55-38t65 11.5 37.5 54.5-11.5 65z"/></svg>',
	selector: "",

	preferences: {
		"main_blog": {
			text: "Blog to check for follow-backs on:",
			default: "",
			value: "",
			type: "blog"
		},
		"put_in_front": {
			text: "Place mutual icon before, not after usernames",
			default: true,
			value: true
		}
	},

	cpanel: function() {
		$('select[data-setting-id="main_blog"] option').first().remove();
	},

	run: function() {
		this.running = true;
		XKit.blog_listener.add("mutualchecker", this.init);
		let today = new Date();
		if (today.getMonth() === 3 && today.getDate() === 1) {
			$(document.body).addClass("xkit-april-fools");
			this.icon = this.april_fools_icon;
		}
	},

	init: async function(blogs) {
		if ($.inArray(this.preferences.main_blog.value, blogs) === -1) {
			this.preferences.main_blog.value = blogs[0];
		}
		XKit.tools.init_css("mutualchecker");
		this.add_follower_icons();
		if (XKit.page.react) {
			await XKit.css_map.getCssMap();
			this.selector = XKit.css_map.keyToCss("postAttribution");
		}
		XKit.page.react ? this.add_post_icons_react() : this.add_post_icons();
		XKit.post_listener.add("mutualchecker", XKit.page.react ? this.add_post_icons_react : this.add_post_icons);
	},

	add_follower_icons: function() {
		var following = XKit.interface.where().following;
		$(".follower").each(function() {
			if (following || !$(this).find(".follow_button").length) {
				var $name_div = $(this).find(".name-link");
				var url = $name_div.text();
				XKit.interface.is_following(url, XKit.extensions.mutualchecker.preferences.main_blog.value)
				.then(follow => follow && XKit.extensions.mutualchecker.add_label($name_div, url));
			}
		});
	},

	add_post_icons_react: async function() {
		const $posts = $('[data-id]:not(.mutualchecker-done)');
		//console.log($posts);
		$posts.addClass("mutualchecker-done");
		for (var post of $posts.get()) {
			console.log(post);
			const $link = $(post).find(XKit.extensions.mutualchecker.selector);
			const blog_name = $link.text();
			if (!blog_name.length) {
				console.log("couldn't find blog name for ");
				console.log(post);
				return;
			}
			console.log("blog name is " + blog_name);

			XKit.extensions.mutualchecker.check_react($link, blog_name);


		}
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
				$post.find(".post_info_link[data-tumblelog-popover]:not(.reblog_icon + .post_info_link, .tf2_icon + .post_info_link), .post-info-tumblelog > a[data-tumblelog-popover]").each(function() {
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

	check_react: function($link, blog_name) {
		if (typeof this.mutuals[blog_name] === "undefined") {
			console.log("checking mutuals: " + blog_name);
			this.mutuals[blog_name] = XKit.interface.is_following(blog_name, this.preferences.main_blog.value)
				.catch(() => Promise.resolve(false)); //don't keep checking if we get an error
		} else {
			console.log("in cache: " + blog_name);
		}
		this.mutuals[blog_name].then(is_mutual => {
			if (is_mutual) {
				this.add_label_react($link, blog_name);
				console.log("followed by: " + blog_name);
			} else {
				console.log("not followed by: " + blog_name);
			}
		});
	},

	check: function(json_obj, $link) {
		if (json_obj.following && !json_obj.customizable) {
			if (typeof this.mutuals[json_obj.name] === "undefined") {
				XKit.interface.is_following(json_obj.name, this.preferences.main_blog.value)
				.then(follow => {
					if (follow) {
						this.add_label($link, json_obj.name);
						this.mutuals[json_obj.name] = true;
					} else {
						this.mutuals[json_obj.name] = false;
					}
				});
			} else if (this.mutuals[json_obj.name]) {
				this.add_label($link, json_obj.name);
			}
		}
	},

	add_label_react: function($link, user) {
		$link.addClass("mutuals").attr("title", user + " follows you");
		$link.closest("[data-id]").addClass("from_mutual");
		if (this.preferences.put_in_front.value) {
			$link.before(this.icon); //note: icon must be outside $link or it gets clobbered by react
			$link.addClass("mutuals-front");
		} else {
			$link.after(this.icon); //same here
		}
		$link.parentsUntil("[data-id]").addClass("why-do-you-do-this-to-me");
	},

	add_label: function($name_div, user) {
		if ($name_div.hasClass("post_info_submissions")) {
			$name_div.html('<span class="mutuals' + ( this.preferences.put_in_front.value ? " mutuals-front" : "") + '">' + user + '</span>' + $name_div.text().trim().substring(user.length));
		} else {
			$name_div.addClass("mutuals mutuals-legacy").attr("title", user + " follows you");
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
		$(".xkit-mutual-icon").remove();
		$(".from_mutual").removeClass("from_mutual");
		$(".mutualchecker-done").removeClass("mutualchecker-done");
		XKit.tools.remove_css("mutualchecker");
	}
});
