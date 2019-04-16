//* TITLE Timestamps **//
//* VERSION 2.9.0 **//
//* DESCRIPTION See when a post has been made. **//
//* DETAILS This extension lets you see when a post was made, in full date or relative time (eg: 5 minutes ago). It also works on asks, and you can format your timestamps. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

// depends on moment.js
/* globals moment */

XKit.extensions.timestamps = new Object({

	running: false,
	slow: true,

	preferences: {
		only_on_hover: {
			text: "Only show timestamps when I hover over a post",
			default: false,
			value: false
		},
		only_relative: {
			text: "Only show relative time (eg: 5 minutes ago)",
			default: false,
			value: false
		},
		only_inbox: {
			text: "Only show timestamps on asks in my inbox",
			default: false,
			value: false
		},

		title_reblogs: {
			text: "Reblog timestamps",
			type: "separator"
		},
		do_reblogs: {
			text: "Show timestamps on reblog comments",
			default: true,
			value: true
		},
		only_original: {
			text: "Only put timestamps on original comments",
			default: true,
			value: true
		},

		title_format: {
			text: "Timestamp display format",
			type: "separator"
		},
		format: {
			text: "Timestamp format (<span id=\"xkit-timestamps-format-help\" style=\"text-decoration: underline; cursor: pointer;\">what is this?</span>)",
			type: "text",
			default: "MMMM Do YYYY, h:mm:ss a",
			value: "MMMM Do YYYY, h:mm:ss a"
		}
	},

	check_quota: function() {

		if (XKit.storage.quota("timestamps") <= 1024 || XKit.storage.size("timestamps") >= 153600) {
			XKit.storage.clear("timestamps");
			for (let x of Object.keys(this.preferences)) {
				if (this.preferences[x].value !== this.preferences[x].default) {
					XKit.storage.set("timestamps", `extension__setting__${x}`, this.preferences[x].value.toString());
				}
			}
		}

	},

	in_search: false,

	run: function() {
		if (!XKit.interface.is_tumblr_page()) { return; }

		XKit.tools.init_css("timestamps");

		if (XKit.interface.where().search) {
			this.in_search = true;
			XKit.tools.add_css(`
				.xtimestamp-in-search {
					position: absolute;
					top: 32px;
					color: rgb(168,177,184);
					font-size: 10px;
				}`, "timestamps_search");
		}

		if (this.preferences.only_inbox.value) {
			if (!XKit.interface.where().inbox) {
				return;
			}
		}

		if (this.preferences.format.value === "") {
			this.preferences.format.value = "MMMM Do YYYY, h:mm:ss a";
		}

		this.check_quota();
		try {
			if (this.is_compatible()) {
				XKit.tools.add_css('#posts .post .post_content { padding-top: 0px; }', "timestamps");
				XKit.post_listener.add("timestamps", this.add_timestamps);
				this.add_timestamps();

				if (this.preferences.do_reblogs.value) {
					XKit.post_listener.add("timestamps", this.add_reblog_timestamps);
					this.add_reblog_timestamps();
				}

				$(document).on("click", ".xkit-timestamp-failed-why", function() {
					XKit.window.show("Timestamp loading failed.", "This might be caused by several reasons, such as the post being removed, becoming private, or the Tumblr server having a problem that it can't return the page required by XKit to load you the timestamp.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div></div>");
				});
			}
		} catch (e) {
			// defined in xkit.js
			/* globals show_error_script */
			show_error_script("Timestamps: " + e.message);
		}

		if (this.preferences.only_on_hover.value) {
			XKit.tools.add_css(" .xtimestamp {display: none; } .post:hover .xtimestamp {display: block; }", "timestamps_on_hover");
		}
	},

	is_compatible: function() {
		return !(XKit.interface.where().queue || XKit.interface.where().drafts);
	},

	add_timestamps: function() {
		var posts = $(".posts .post").not(".xkit_timestamps");

		if (!posts || posts.length === 0) {
			return;
		}

		XKit.extensions.timestamps.check_quota();

		posts.each(function() {
			var post = $(this);
			post.addClass("xkit_timestamps");

			if (post.hasClass("fan_mail")) {
				return;
			}

			if (post.attr('id') === "new_post" ||
					post.find('.private_label').length > 0) {
				return;
			}

			var post_id = post.attr('data-post-id');
			var blog_name = post.attr('data-tumblelog-name');

			if (XKit.extensions.timestamps.in_search && !$("#search_posts").hasClass("posts_view_list")) {
				var in_search_html = '<div class="xkit_timestamp_' + post_id + ' xtimestamp-in-search xtimestamp_loading">&nbsp;</div>';
				post.find(".post-info-tumblelogs").prepend(in_search_html);
			} else {
				var normal_html = '<div class="xkit_timestamp_' + post_id + ' xtimestamp xtimestamp_loading">&nbsp;</div>';
				post.find(".post_content").prepend(normal_html);
			}

			var note = $(".xkit_timestamp_" + post_id);
			XKit.extensions.timestamps.fetch_timestamp(post_id, blog_name, note);
		});
	},

	add_reblog_timestamps: function() {
		var selector = ".reblog-list-item";
		if (XKit.extensions.timestamps.preferences.only_original.value) {
			selector += ".original-reblog-content";
		}

		$(selector).not(".xkit_timestamps")
		.addClass("xkit_timestamps")
		.each(function() {
			let $this = $(this);

			let $link = $this.find(".reblog-header [data-peepr]");
			if (!$link.length || !$link.attr("data-peepr")) {
				return;
			}
			let {tumblelog, postId} = JSON.parse($link.attr("data-peepr"));

			$this.find(".reblog-header").append(`<div class="xkit_timestamp_${postId} xtimestamp xtimestamp_loading">&nbsp;</div>`);
			let $timestamp = $(`.xkit_timestamp_${postId}`);
			XKit.extensions.timestamps.fetch_timestamp(postId, tumblelog, $timestamp);
		});
	},

	fetch_timestamp: function(post_id, blog_name, date_element) {
		if (this.fetch_from_cache(post_id, date_element)) {
			return;
		}

		XKit.svc.indash_blog({
			tumblelog_name_or_id: blog_name,
			post_id: post_id,
			limit: 1,
			offset: 0,
			should_bypass_safemode: true,
			should_bypass_tagfiltering: true
		})
		.then(response => {
			var responseData = response.json().response;
			if (responseData.post_not_found_message !== undefined) {
				throw 404;
			}

			var timestamp = responseData.posts[0].timestamp;
			date_element.html(this.format_date(moment(new Date(timestamp * 1000))));
			date_element.removeClass("xtimestamp_loading");
			XKit.storage.set("timestamps", "xkit_timestamp_cache_" + post_id, timestamp);
		})
		.catch(() => this.show_failed(date_element));
	},

	fetch_from_cache: function(post_id, date_element) {
		var cached = XKit.storage.get("timestamps", "xkit_timestamp_cache_" + post_id, "");
		if (cached === "") {
			return false;
		}

		var cached_utc_seconds = parseFloat(cached);
		if (isNaN(cached_utc_seconds)) {
			return false;
		}

		var cached_date = moment(new Date(cached_utc_seconds * 1000));
		if (!cached_date.isValid()) {
			return false;
		}
		date_element.html(this.format_date(cached_date));
		date_element.removeClass("xtimestamp_loading");
		return true;
	},

	show_failed: function(obj) {
		$(obj).html("failed to load timestamp <div class=\"xkit-timestamp-failed-why\">why?</div>");
		$(obj).removeClass('xtimestamp_loading');
	},

	cpanel: function() {
		$("#xkit-timestamps-format-help").click(XKit.tools.show_timestamps_help);
	},

	format_date: function(date) {
		var relative = date.from(moment());
		if (this.preferences.only_relative.value) {
			return relative;
		} else {
			return date.format(this.preferences.format.value) + " &middot; " + relative;
		}
	},

	destroy: function() {
		$(".xtimestamp").remove();
		$(".xkit-fan-timestamp").remove();
		$(".with-xkit-timestamp").removeClass("with-xkit-timestamp");
		$(".xkit_timestamps").removeClass("xkit_timestamps");
		XKit.tools.remove_css("timestamps");
		XKit.post_listener.remove("timestamps");
		XKit.tools.remove_css("timestamps_on_hover");
	}
});
