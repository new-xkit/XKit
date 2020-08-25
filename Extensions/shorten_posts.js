//* TITLE Shorten Posts **//
//* VERSION 0.2.5 **//
//* DESCRIPTION Makes scrolling easier **//
//* DETAILS This extension shortens long posts, so if you are interested, you can just click on Show Full Post button to see it all, or scroll down if you are not interested. Useful for screens where long posts take a lot of space, and making it hard to scroll down. **//
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
		height: {
			text: "Maximum post height (<a id=\"xkit-shorten-posts-height-help\" href=\"#\" onclick=\"return false\">what is this?</a>)",
			type: "text",
			default: "350",
			value: "350"
		},
		threshold: {
			text: 'Minimum hidden height (<a id="xkit-shorten-posts-threshold-help" href="#" onclick="return false;">what is this?</a>)',
			type: "text",
			default: "50",
			value: "50"
		},
		display_tags: {
			text: "Display the tags on shortened posts",
			default: true,
			value: true
		}
	},

	tagsCss: null,
	wrapperCss: null,
	avatarCss: null,
	processing: false,

	run: function() {

		this.running = true;
		XKit.extensions.shorten_posts.cpanel_check_height();

		if ($("[data-id], .posts .post").length > 0) {
			XKit.tools.init_css("shorten_posts");

			if (XKit.page.react) {
				XKit.css_map.getCssMap().then(map => {
					this.tagsCss = XKit.css_map.keyToCss("tags");
					this.wrapperCss = XKit.css_map.keyToCss("impressionLoggingWrapper");
					this.avatarCss = XKit.css_map.keyToCss("stickyContainer");

					XKit.tools.add_css(`${XKit.css_map.keyToCss("baseContainer")} { z-index: 99; }`, "shorten_posts");
					XKit.post_listener.add("shorten_posts", XKit.extensions.shorten_posts.react_check);
					XKit.extensions.shorten_posts.react_check();
				});
			} else {
				$(document).on("click", ".xkit-shorten-posts-embiggen", XKit.extensions.shorten_posts.embiggen);
				XKit.post_listener.add("shorten_posts", XKit.extensions.shorten_posts.check);
				XKit.extensions.shorten_posts.check();
			}
		}

	},

	react_check: async function() {
		if (XKit.extensions.shorten_posts.processing === true) {
			return;
		}
		XKit.extensions.shorten_posts.processing = true;

		const $posts = await XKit.interface.react.get_posts(["xkit-shorten-posts-done", "xkit-shorten-posts-embiggened"]);
		$posts
		.addClass("xkit-shorten-posts-done")
		.each(function() {
			var $this = $(this);

			if ($(this).hasClass("xblacklist_blacklisted_post")) { return; }

			var height = $this.height();

			if (height >= parseInt(XKit.extensions.shorten_posts.preferences.height.value, 10) + parseInt(XKit.extensions.shorten_posts.preferences.threshold.value, 10)) {
				XKit.extensions.shorten_posts.react_short($(this), height);
			}
		});

		XKit.extensions.shorten_posts.processing = false;
	},

	check: function() {
		var shortened_count = 0;

		$(".posts .post").not(".xkit-shorten-posts-done").not(".xkit-shorten-posts-embiggened").each(function() {
			var m_height = $(this).height();
			$(this).addClass("xkit-shorten-posts-done");

			if ($(this).hasClass("xblacklist_blacklisted_post")) { return; }

			if (m_height >= parseInt(XKit.extensions.shorten_posts.preferences.height.value, 10) + parseInt(XKit.extensions.shorten_posts.preferences.threshold.value, 10)) {
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

		var m_height = $(obj).attr('data-old-height');
		var post_div = $(obj).parents(".xkit-shorten-posts-shortened");

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

			if (XKit.page.react) {
				const $article = $(this).find("article");
				const $avatar = $(this).find(".xkit-shorten-posts-shortened-avatar");

				$avatar.contents().prependTo($article);
				$avatar.remove();
				$article.removeClass("post_wrapper");
				$(this).find(".post_tags").removeClass("post_tags");

				$(this).find(XKit.extensions.shorten_posts.wrapperCss).css("height", "auto");
				$(this).css("height", "auto");
			} else {
				$(this).css('height', 'auto');
			}
		});

	},

	react_short: function(obj, height) {
		var $obj = $(obj);
		if ($obj.hasClass("xblacklist_blacklisted_post")) { $obj.removeClass("xkit-shorten-posts-shortened-show-tags"); return; }

		const $article = $obj.find("article");

		const container_css = $article.attr("class");
		const post_id = $obj.attr("data-id");

		$obj.attr("data-old-height", height);
		$obj.find(XKit.extensions.shorten_posts.wrapperCss).css("height", XKit.extensions.shorten_posts.preferences.height.value + "px");
		$article.addClass("post_wrapper");

		const $avatar_wrapper = $(`<div class="xkit-shorten-posts-shortened-avatar ${container_css}"></div>`);
		$article.find(XKit.extensions.shorten_posts.avatarCss).appendTo($avatar_wrapper);
		$article.before($avatar_wrapper);

		$obj.addClass("xkit-shorten-posts-shortened");

		$article.append("<div class=\"xkit-shorten-posts-embiggen xkit-shorten-posts-embiggen-for-post-" + post_id + "\" data-post-id=\"" + post_id + "\" data-old-height=\"" + height + "\">This post has been shortened. Click here to show the full post</div>");
		$article.on("click", ".xkit-shorten-posts-embiggen", XKit.extensions.shorten_posts.embiggen);

		if (XKit.extensions.shorten_posts.preferences.display_tags.value === true) {
			$obj.find(XKit.extensions.shorten_posts.tagsCss).addClass("post_tags");
			$obj.addClass("xkit-shorten-posts-shortened-show-tags");
		}
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
		const $posts = $(XKit.page.react ? "[data-id]" : ".post");

		(XKit.page.react ? $posts.find(XKit.extensions.shorten_posts.wrapperCss) : $posts).each(function() {
			$(this).css('height', 'auto');
		});

		$posts.removeClass("xkit-shorten-posts-shortened-show-tags xkit-shorten-posts-done xkit-shorten-posts-embiggened xkit-shorten-posts-shortened");

		// Remove all the stuff we've added.
		$(".xkit-shorten-posts-embiggen").remove();

		if (XKit.page.react) {
			$posts.find(".post_wrapper").removeClass("post_wrapper");
			$posts.find(".post_tags").removeClass("post_tags");

			$posts.each(function() {
				const $avatar = $(this).find(".xkit-shorten-posts-shortened-avatar");
				$avatar.contents().prependTo($(this).find("article"));
				$avatar.remove();
			});

			$posts.find("article").off("click", ".xkit-shorten-posts-embiggen", XKit.extensions.shorten_posts.embiggen);

		} else {
			$(document).off("click", ".xkit-shorten-posts-embiggen", XKit.extensions.shorten_posts.embiggen);
			// Call Tumblr scroll helper update thingy.
			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("DOMEventor:updateRect");
			}, true, "");
		}

		XKit.post_listener.remove("shorten_posts");
		XKit.tools.remove_css("shorten_posts");
	},

	cpanel_check_height: function() {

		if (isNaN(XKit.extensions.shorten_posts.preferences.height.value) === true) {
			console.log("Invalid post height check interval, reverting to default: not a number.");
			XKit.extensions.shorten_posts.preferences.height.value = XKit.extensions.shorten_posts.height_default;
		} else {
			var m_height = XKit.extensions.shorten_posts.preferences.height.value;
			if (m_height > XKit.extensions.shorten_posts.height_max || m_height < XKit.extensions.shorten_posts.height_min) {
				XKit.extensions.shorten_posts.preferences.height.value = XKit.extensions.shorten_posts.height_default;
				console.log("Invalid post height check interval, reverting to default: too small or big.");
			}
		}

	},

	cpanel: function(div) {

		$("#xkit-shorten-posts-height-help").click(function() {
			XKit.window.show("Maximum post height", "XKit will shorten posts longer than the height entered here.<br/><br/>The minimum value you can enter is <b>200</b>, and the maximum is <b>" + XKit.extensions.shorten_posts.height_max + "</b>. If you enter a value bigger or smaller than these, XKit will return to it's default value, which is 350 pixels.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		});
		$("#xkit-shorten-posts-threshold-help").click(function() {
			XKit.window.show("Minimum hidden height", "XKit will only shorten posts if there is at least the height entered here to be hidden.<br/><br/>This will avoid shortening posts that have little to expand.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		});

	}

});
