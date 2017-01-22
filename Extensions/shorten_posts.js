//* TITLE Shorten Posts **//
//* VERSION 0.2.3 **//
//* DESCRIPTION Makes scrolling easier **//
//* DETAILS This extension shortens long posts, so if you are interested, you can just click on Show Full Post button to see it all, or scroll down if you are not interested. Useful for screens where long posts take a lot of space, and making it hard to scroll down.<br><br>By default, this extension shortens text posts. You can toggle settings to choose which types of posts to shorten. (This will 'cut off' long, vertical posts.) **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.shorten_posts = new Object({

	running: false,
	slow: true,

	height_min: 200,
	height_max: 1500,
	height_default: 350,

	preferences: {
		sep0: {
			text: "When to shorten posts",
			type: "separator"
		},
		text_too: {
			text: "Check and shorten text posts",
			default: true,
			value: true
		},
		photos_too: {
			text: "Check and shorten photo posts and photosets",
			default: false,
			value: false
		},
		audio_too: {
			text: "Check and shorten audio posts",
			default: false,
			value: false
		},
		asks_too: {
			text: "Check and shorten replies to asks",
			default: false,
			value: false
		},
		videos_too: {
			text: "Check and shorten video posts",
			default: false,
			value: false
		},
		chat_too: {
			text: "Check and shorten chat posts",
			default: false,
			value: false
		},
		links_too: {
			text: "Check and shorten link posts",
			default: false,
			value: false
		},
		quotes_too: {
			text: "Check and shorten quote posts",
			default: false,
			value: false
		},
		height: {
			text: "Maximum post height (<a id=\"xkit-shorten-posts-height-help\" href=\"#\" onclick=\"return false\">what is this?</a>)",
			type: "text",
			default: "350",
			value: "350"
		},
		sep1: {
			text: "Appearance and behaviour options",
			type: "separator"
		},
		display_tags: {
			text: "Display the tags on shortened posts",
			default: true,
			value: true
		},
		embiggen_on_click: {
			text: "Embiggen photo posts when I click on the thumbnail",
			default: true,
			value: true
		}
	},

	run: function() {

		this.running = true;
		XKit.extensions.shorten_posts.cpanel_check_height();

		if ($(".posts .post").length > 0) {
			XKit.tools.init_css("shorten_posts");
			$(document).on("click", ".xkit-shorten-posts-embiggen", XKit.extensions.shorten_posts.embiggen);
			XKit.post_listener.add("shorten_posts", XKit.extensions.shorten_posts.check);
			XKit.extensions.shorten_posts.check();
		}

	},

	check: function() {

		var shortened_count = 0;

		$(".posts .post").not(".xkit-shorten-posts-done").not(".xkit-shorten-posts-embiggened").each(function() {

			var m_height = $(this).height();
			$(this).addClass("xkit-shorten-posts-done");

			if ($(this).hasClass("xblacklist_blacklisted_post")) { return; }

			var dont_return = false;
			if (XKit.extensions.shorten_posts.preferences.text_too.value
				&& $(this).hasClass("is_regular")) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.photos_too.value
				&& ($(this).hasClass("is_photo") || $(this).hasClass("is_photoset"))) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.audio_too.value
				&& $(this).hasClass("is_audio")) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.links_too.value
				&& $(this).hasClass("is_link")) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.chat_too.value
				&& $(this).hasClass("is_conversation")) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.quotes_too.value
				&& $(this).hasClass("is_quote")) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.asks_too.value
				&& $(this).hasClass("is_note")) {
				dont_return = true;
			}
			if (XKit.extensions.shorten_posts.preferences.videos_too.value
				&& $(this).hasClass("is_video")) {
				dont_return = true;
			}

			if (!dont_return) {
				return;
			}

			if (m_height >= XKit.extensions.shorten_posts.preferences.height.value) {
				XKit.extensions.shorten_posts.short($(this), m_height);
				shortened_count++;
			}

		});

		if (shortened_count > 0) {

			// Call Tumblr scroll helper update thingy.
			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("DOMEventor:updateRect");
			}, true, "");

		}

	},

	embiggen: function(e) {

		var obj = e.target;

		if ($(obj).hasClass("image_thumbnail") === true) {
			obj = $(obj).parentsUntil(".post").parent().find(".xkit-shorten-posts-embiggen");
		}

		var m_height = $(obj).attr('data-old-height');
		var post_div = $(obj).parent();

		var m_speed = 200 + (m_height / 2);

		if (m_height < 320) {
			m_speed = 120;
		}

		$(post_div).animate({
			height: m_height
		}, m_speed, function() {
			$(this).find(".xkit-shorten-posts-embiggen").slideUp('fast');
			$(this).removeClass("xkit-shorten-posts-shortened");
			$(this).removeClass("xkit-shorten-posts-shortened-show-tags");
			$(this).addClass("xkit-shorten-posts-embiggened");
			$(this).css('height', 'auto');
		});

	},

	short: function(obj, m_height) {

		if ($(obj).hasClass("xblacklist_blacklisted_post")) { $(obj).removeClass("xkit-shorten-posts-shortened-show-tags"); return; }

		var post_id = $(obj).attr('data-post-id');
		$(obj).attr('data-old-height', m_height);
		$(obj).css('height', XKit.extensions.shorten_posts.preferences.height.value + "px");
		$(obj).addClass("xkit-shorten-posts-shortened");

		$(obj).append("<div class=\"xkit-shorten-posts-embiggen xkit-shorten-posts-embiggen-for-post-" + post_id + "\" data-post-id=\"" + post_id + "\" data-old-height=\"" + m_height + "\">This post has been shortened. Click here to show the full post</div>");

		if (XKit.extensions.shorten_posts.preferences.display_tags.value === true) {
			$(obj).addClass("xkit-shorten-posts-shortened-show-tags");
		}

		if (XKit.extensions.shorten_posts.preferences.embiggen_on_click.value === true) {
			$(obj).find(".image_thumbnail").on("click", XKit.extensions.shorten_posts.embiggen);
		}

	},

	destroy: function() {

		this.running = false;

		// Remove all the stuff we've added.
		$(".xkit-shorten-posts-embiggen").remove();

		$(".post.xkit-shorten-posts-shortened").each(function() {
			$(this).css('height', 'auto');
		});

		$(".xkit-shorten-posts-embiggen").off("click", XKit.extensions.shorten_posts.embiggen);

		$(".post").removeClass("xkit-shorten-posts-shortened");
		$(".post").removeClass("xkit-shorten-posts-embiggened");
		$(".post").removeClass("xkit-shorten-posts-shortened-show-tags");
		$(".post").removeClass("xkit-shorten-posts-done");

		XKit.tools.remove_css("shorten_posts");

		// Call Tumblr scroll helper update thingy.
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	cpanel_check_height: function() {

		if (isNaN(XKit.extensions.shorten_posts.preferences.height.value) === true) {
			XKit.console.add("Invalid post height check interval, reverting to default: not a number.");
			XKit.extensions.shorten_posts.preferences.height.value = XKit.extensions.shorten_posts.height_default;
		} else {
			var m_height = XKit.extensions.shorten_posts.preferences.height.value;
			if (m_height > XKit.extensions.shorten_posts.height_max || m_height < XKit.extensions.shorten_posts.height_min) {
				XKit.extensions.shorten_posts.preferences.height.value = XKit.extensions.shorten_posts.height_default;
				XKit.console.add("Invalid post height check interval, reverting to default: too small or big.");
			}
		}

	},

	cpanel: function(div) {

		$("#xkit-shorten-posts-height-help").click(function() {

			XKit.window.show("Maximum post height", "XKit will shorten posts longer than the height entered here.<br/><br/>The minimum value you can enter is <b>200</b>, and the maximum is <b>" + XKit.extensions.shorten_posts.height_max + "</b>. If you enter a value bigger or smaller than these, XKit will return to it's default value, which is 350 pixels.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

		});

	}

});
