//* TITLE Timestamps **//
//* VERSION 2.11.5 **//
//* DESCRIPTION See when a post has been made. **//
//* DETAILS This extension lets you see when a post was made, in full date or relative time (eg: 5 minutes ago). It also works on asks, and you can format your timestamps. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.timestamps = new Object({

	running: false,
	slow: true,

	preferences: {
		inbox: {
			text: "Show timestamps in the inbox",
			default: true,
			value: true
		},
		posts: {
			text: "Show timestamps on posts",
			default: true,
			value: true
		},
		reblogs: {
			text: "Reblog timestamps",
			type: "combo",
			values: [
				"Don't display any", "off",
				"Display only on the original post", "op",
				"Display on all comments", "all"
			],
			default: "op",
			value: "op"
		},

		display_title: {
			text: "Display options",
			type: "separator"
		},
		format_type_absolute: {
			text: "Absolute timestamps",
			type: "combo",
			values: [
				'None', "none",
				'Minimal: 9:30PM / June 12', "xkit_rewritten",
				'Custom (see below)', "custom"
			],
			default: "xkit_rewritten",
			value: "xkit_rewritten"
		},
		format: {
			text: 'Custom format, if selected (<span id="xkit-timestamps-format-help" style="text-decoration: underline; cursor: pointer;">what is this?</span>)',
			type: "text",
			default: "MMMM Do YYYY, h:mm:ss a",
			value: "MMMM Do YYYY, h:mm:ss a"
		},
		format_type_relative: {
			text: "Relative timestamps",
			type: "combo",
			values: [
				'None', "none",
				'Auto: 2 hours ago / 3 days ago', "auto",
			],
			default: "auto",
			value: "auto"
		},
		display_on_top: {
			text: "Display timestamps on the top of posts",
			default: true,
			value: true
		},
		only_on_hover: {
			text: "Hide timestamps until I hover over a post",
			default: false,
			value: false
		},

	},

	check_quota: function() {
		if (XKit.storage.quota("timestamps") <= 1024 || XKit.storage.size("timestamps") >= 153600) {
			XKit.storage.clear("timestamps");
			for (let x of Object.keys(this.preferences)) {
				if (this.preferences[x].value !== this.preferences[x].default) {
					XKit.storage.set("timestamps", `extension__setting__${x}`, this.preferences[x].value.toString());
				}
			}
			XKit.storage.set("timestamps", "preference_conversion", "done");
		}

	},

	convert_preferences: function() {
		[
			["only_inbox", "false", {inbox: true, posts: false}],
			["do_reblogs", "true", {reblogs: "all"}],
			["only_original", "true", {reblogs: "op"}]
		]
		.filter(([preference, defaultValue]) => XKit.storage.get("timestamps", `extension__setting__${preference}`, defaultValue) === "true")
		.forEach(([preference, defaultValue, conversion]) => {
			Object.entries(conversion).forEach(([key, value]) => {
				XKit.storage.set("timestamps", `extension__setting__${key}`, value.toString());
				this.preferences[key].value = value;
			});
		});

		XKit.storage.set("timestamps", "preference_conversion", "done");
	},

	get in_search() {
		return XKit.interface.where().search;
	},

	run: function() {
		if (XKit.storage.get("timestamps", "preference_conversion") !== "done") {
			this.convert_preferences();
		}

		if (!XKit.interface.is_tumblr_page()) { return; }

		if (!this.preferences.inbox.value && XKit.interface.where().inbox) {
			return;
		}

		XKit.tools.init_css("timestamps");


		if (this.preferences.format.value === "") {
			this.preferences.format.value = "MMMM Do YYYY, h:mm:ss a";
		}

		this.check_quota();

		$(document).on("click", ".xkit-timestamp-failed-why", function() {
			XKit.window.show("Timestamp loading failed.", "This might be caused by several reasons, such as the post being removed, becoming private, or the Tumblr server having a problem that it can't return the page required by XKit to load you the timestamp.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div></div>");
		});

		if (XKit.page.react) {
			XKit.css_map.getCssMap()
			.then(() => {
				this.posts_class = XKit.css_map.keyToCss("post");
				this.reblogs_class = XKit.css_map.keyToCss("reblog");
				this.reblog_headers_class = XKit.css_map.keyToCss("reblogHeader");
				this.blog_link_class = XKit.css_map.keyToCss("blogLink");
				this.note_count_class = XKit.css_map.keyToCss('noteCount');

				if (this.preferences.posts.value || (this.preferences.inbox.value && XKit.interface.where().inbox)) {
					this.react_add_timestamps();
					XKit.post_listener.add("timestamps", this.react_add_timestamps);
				}

				if (this.preferences.reblogs.value !== "off") {
					this.react_add_reblog_timestamps();
					XKit.post_listener.add("timestamps", this.react_add_reblog_timestamps);
				}

				if (this.preferences.only_on_hover.value) {
					XKit.tools.add_css(`.xtimestamp { display: none; } ${this.posts_class.split(", ").map(x => x + ":hover .xtimestamp").join(", ")} { display: inline-block; }`, "timestamps_on_hover");
				} else {
					XKit.tools.add_css(".xtimestamp { display: inline-block; }", "timestamps_on_hover");
				}
			});

			return;
		}

		XKit.tools.add_css('#posts .post .post_content { padding-top: 0px; }', "timestamps");

		if (this.preferences.posts.value || (this.preferences.inbox.value && XKit.interface.where().inbox)) {
			this.add_timestamps();
			XKit.post_listener.add("timestamps", this.add_timestamps);
		}

		if (this.preferences.reblogs.value !== "off") {
			this.add_reblog_timestamps();
			XKit.post_listener.add("timestamps", this.add_reblog_timestamps);
		}

		if (this.preferences.only_on_hover.value) {
			XKit.tools.add_css(".xtimestamp { display: none; } .post:hover .xtimestamp { display: block; }", "timestamps_on_hover");
		}
	},

	add_timestamps: function() {
		var posts = $(".posts .post:not(.queued)").not(".xkit_timestamps");

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
				var in_search_html = '<div class="xkit_timestamp_' + post_id + ' xtimestamp-in-search xtimestamp-loading">&nbsp;</div>';
				post.find(".post-info-tumblelogs").prepend(in_search_html);
			} else {
				var normal_html = '<div class="xkit_timestamp_' + post_id + ' xtimestamp xtimestamp-loading">&nbsp;</div>';
				post.find(".post_content").prepend(normal_html);
			}

			var note = $(".xkit_timestamp_" + post_id);
			XKit.extensions.timestamps.fetch_timestamp(post_id, blog_name, note);
		});
	},

	add_reblog_timestamps: function() {
		var selector = ".reblog-list-item";
		if (XKit.extensions.timestamps.preferences.reblogs.value === "op") {
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

			$this.find(".reblog-header").append(`<div class="xkit_timestamp_${postId} xtimestamp xtimestamp-loading">&nbsp;</div>`);
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
			date_element.html(this.format_date(timestamp));
			date_element.removeClass("xtimestamp-loading");
			XKit.storage.set("timestamps", "xkit_timestamp_cache_" + post_id, timestamp);
		})
		.catch(() => this.show_failed(date_element));
	},

	react_add_timestamps: function() {
		const {note_count_class, preferences, in_search} = XKit.extensions.timestamps;
		var $posts = $("[data-id]:not(.xkit_timestamps)");
		$posts.addClass("xkit_timestamps");

		$posts.each(function() {
			var $post = $(this);

			var post_id = $post.attr("data-id");

			var xtimestamp_class = "xtimestamp";
			if (in_search) {
				xtimestamp_class = "xtimestamp-in-search";
			}
			if (!preferences.display_on_top.value) {
				xtimestamp_class += " xtimestamp-bottom";
			}

			var xtimestamp_html = `<div class="xkit_timestamp_${post_id} ${xtimestamp_class} xtimestamp-loading">&nbsp;</div>`;

			if (preferences.display_on_top.value) {
				$(xtimestamp_html).insertAfter($post.find("header"));
			} else {
				xtimestamp_html = `<span class="xtimestamp-bottom-container">${xtimestamp_html}</span>`;
				$(xtimestamp_html).insertAfter($post.find(note_count_class));
			}

			var note = $(".xkit_timestamp_" + post_id);
			XKit.extensions.timestamps.react_fetch_timestamp(post_id, note);
		});
	},

	react_add_reblog_timestamps: function() {
		const {reblogs_class, reblog_headers_class, preferences} = XKit.extensions.timestamps;
		const $posts = $("[data-id]:not(.xkit_reblog_timestamps)");

		$posts
		.addClass("xkit_reblog_timestamps")
		.each(async function() {
			const $post = $(this);
			const post_id = $post.attr("data-id");
			const {trail} = await XKit.interface.react.post_props(post_id);
			var $reblogs = $post.find(reblogs_class);

			if (preferences.reblogs.value === "op") {
				$reblogs = $reblogs.first();
			}

			$reblogs.each(function(i) {
				if (trail[i] === undefined || trail[i].blog === undefined || trail[i].blog.active === false) {
					return;
				}

				const $reblog = $(this);
				const {uuid} = trail[i].blog;
				const {id} = trail[i].post;

				$reblog.find(reblog_headers_class).append(`<div class="xkit_timestamp_${id} xtimestamp xtimestamp-reblog xtimestamp-loading">&nbsp;</div>`);
				const $xtimestamp = $(`.xkit_timestamp_${id}`);

				if (XKit.extensions.timestamps.fetch_from_cache(id, $xtimestamp) === true) {
					return;
				}

				XKit.tools.async_add_function(async ({uuid, id}) => { // eslint-disable-line no-shadow
					/* globals tumblr */
					const {response: {timestamp}} = await tumblr.apiFetch(`/v2/blog/${uuid}/posts/${id}`);
					return timestamp;
				}, {uuid, id}).then(timestamp => {
					$xtimestamp
					.removeClass("xtimestamp-loading")
					.html(XKit.extensions.timestamps.format_date(timestamp));

					XKit.storage.set("timestamps", `xkit_timestamp_cache_${id}`, timestamp);
				}).catch(() => {
					XKit.extensions.timestamps.show_failed($xtimestamp);
				});
			});
		});
	},

	react_fetch_timestamp: async function(post_id, date_element) {
		var {timestamp} = await XKit.interface.react.post_props(post_id);

		if (timestamp) {
			date_element.html(this.format_date(timestamp));
			date_element.removeClass("xtimestamp-loading");
			if (XKit.extensions.timestamps.preferences.reblogs.value !== "off") {
				XKit.storage.set("timestamps", "xkit_timestamp_cache_" + post_id, timestamp);
			}
		} else {
			this.show_failed(date_element);
		}
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

		date_element.html(this.format_date(cached_utc_seconds));
		date_element.removeClass("xtimestamp-loading");
		return true;
	},

	show_failed: function(obj) {
		$(obj).html("failed to load timestamp <div class=\"xkit-timestamp-failed-why\">why?</div>");
		$(obj).removeClass("xtimestamp-loading");
	},

	cpanel: function() {
		$("#xkit-timestamps-format-help").click(XKit.tools.show_timestamps_help);
	},

	constructMinimalTimeString: function(unixTime) {
		const locale = document.documentElement.lang;
		const date = new Date(unixTime * 1000);
		const now = new Date();

		const sameDate = date.toDateString() === now.toDateString();
		const sameYear = date.getFullYear() === now.getFullYear();

		if (sameDate) {
			return date.toLocaleTimeString(locale, {
				hour: 'numeric',
				minute: 'numeric',
			});
		} else {
			return date.toLocaleDateString(locale, {
				day: 'numeric',
				month: 'short',
				year: sameYear ? undefined : 'numeric',
			});
		}
	},

	format_date: function(timestamp) {
		const absolute_type = this.preferences.format_type_absolute.value;
		const relative_type = this.preferences.format_type_relative.value;

		var absoluteText = '';
		var relativeText = '';
		var tooltip = '';

		const date = moment(new Date(timestamp * 1000));

		if (absolute_type == "xkit_rewritten") {
			absoluteText = this.constructMinimalTimeString(timestamp);
		} else if (absolute_type == "custom") {
			absoluteText = date.format(this.preferences.format.value);
		} else {
			tooltip = date.format(this.preferences.format.value);
		}

		if (relative_type == "auto") {
			relativeText = date.from(moment());
		} else {
			tooltip = date.from(moment());
		}

		if (absoluteText && relativeText) {
			return `${absoluteText} &middot; ${relativeText}`;
		} else {
			return `<span title="${tooltip}">${relativeText}${absoluteText}</span>`;
		}
	},

	destroy: function() {
		$(".xtimestamp").remove();
		$(".xtimestamp-bottom-container").remove();
		$(".xkit-fan-timestamp").remove();
		$(".with-xkit-timestamp").removeClass("with-xkit-timestamp");
		$(".xkit_timestamps").removeClass("xkit_timestamps");
		$(".xkit_reblog_timestamps").removeClass("xkit_reblog_timestamps");
		XKit.tools.remove_css("timestamps");
		XKit.post_listener.remove("timestamps");
		XKit.tools.remove_css("timestamps_on_hover");
	}
});
