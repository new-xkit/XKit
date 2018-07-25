//* TITLE Timestamps **//
//* VERSION 2.8.0 **//
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
		sep0: {
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

		if (XKit.storage.size("timestamps") >= 800) {
			XKit.storage.clear("timestamps");
			if (this.preferences.only_relative.value) {
				XKit.storage.set("timestamps", "extension__setting__only_relative", "true");
			}
			if (this.preferences.only_inbox.value) {
				XKit.storage.set("timestamps", "extension__setting__only_inbox", "true");
			}
			if (this.preferences.only_on_hover.value) {
				XKit.storage.set("timestamps", "extension__setting__only_on_hover", "true");
			}
			if (this.preferences.format.value !== "") {
				XKit.storage.set("timestamps", "extension__setting__format", this.preferences.format.value);
			}
		}

	},

	in_search: false,

	run: function() {
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

	fetch_timestamp: function(post_id, blog_name, date_element) {
		if (this.fetch_from_cache(post_id, date_element)) {
			return;
		}

		var url = "https://www.tumblr.com/svc/indash_blog?limit=1&offset=0&should_bypass_safemode=true&should_bypass_tagfiltering=true" +
			"&tumblelog_name_or_id=" + blog_name +
			"&post_id=" + post_id;
		var self = this;

		try {
			XKit.tools.Nx_XHR({
				method: "GET",
				url: url,
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"X-Tumblr-Form-Key": XKit.interface.form_key()
				},
				onerror: function() {
					console.warn('Unable to load timestamp for post ' + post_id);
					self.show_failed(date_element);
				},
				onload: function(response) {
					try {
						var data = JSON.parse(response.responseText);
						var post = data.response.posts[0];
						var date = moment(new Date(post.timestamp * 1000));
						date_element.html(self.format_date(date));
						date_element.removeClass("xtimestamp_loading");
						XKit.storage.set("timestamps", "xkit_timestamp_cache_" + post_id, post.timestamp);
					} catch (e) {
						console.error('Unable to load timestamp for post ' + post_id + ": " + e.message);
						self.show_failed(date_element);
					}
				}
			});
		} catch (e) {
			console.error('Unable to load timestamp for post ' + post_id);
			XKit.extensions.timestamps.show_failed(date_element);
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
