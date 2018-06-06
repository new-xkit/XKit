//* TITLE Timestamps **//
//* VERSION 2.7.8 **//
//* DESCRIPTION See when a post has been made. **//
//* DETAILS This extension lets you see when a post was made, in full date or relative time (eg: 5 minutes ago). It also works on asks, and you can format your timestamps. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

// depends on moment.js
/* globals moment */

XKit.extensions.timestamps = new Object({

	running: false,
	slow: true,
	apiKey: XKit.api_key,

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

	fetch_note_fan_mail: function(obj) {
		if ($(obj).find(".xkit-fan-timestamp").length > 0) {
			return;
		}
		var post_id = $(obj).attr('data-post-id');
		$(obj).find(".message").addClass("with-xkit-timestamp");
		$(obj).find(".message_body").addClass("with-xkit-timestamp").prepend("<div class=\"xkit-fan-timestamp\">Loading</div>");
		var date_element = $(obj).find(".xkit-fan-timestamp");

		this.fetch_note(post_id, obj, date_element);
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
				XKit.extensions.timestamps.fetch_note_fan_mail(post);
				return;
			}

			if (post.attr('id') === "new_post" ||
					post.find('.private_label').length > 0) {
				return;
			}

			var post_id = post.attr('data-post-id');

			var blog_name = '';
			if (XKit.interface.where().inbox !== true) {
				var $permalink = post.find('.permalink, .post_permalink, .post-info-tumblelog a');

				if ($permalink.length <= 0) {
					return;
				}
				var permalink = $permalink.attr('href');

				if (permalink) {
					// Split permalink into sections, discarding the scheme
					var link_parts = permalink.replace(/https?:\/\//, "").split("/");
					blog_name = link_parts[0];
				} else {
					var href_parts = document.location.href.match(/https?:\/\/([^.]+)\.tumblr\.com/);
					if (href_parts) {
						blog_name = href_parts[1];
					}
				}
			}

			if (XKit.extensions.timestamps.in_search && !$("#search_posts").hasClass("posts_view_list")) {
				var in_search_html = '<div class="xkit_timestamp_' + post_id + ' xtimestamp-in-search xtimestamp_loading">&nbsp;</div>';
				post.find(".post-info-tumblelogs").prepend(in_search_html);
			} else {
				var normal_html = '<div class="xkit_timestamp_' + post_id + ' xtimestamp xtimestamp_loading">&nbsp;</div>';
				post.find(".post_content").prepend(normal_html);
			}

			var in_inbox = XKit.interface.where().inbox;

			if (in_inbox && (post.hasClass("submission") || post.hasClass("is_note"))) {
				setTimeout(function() {
					var note = $(".xkit_timestamp_" + post_id);
					XKit.extensions.timestamps.fetch_note(post_id, note, note);
				}, 10);
			} else {
				setTimeout(function() {
					var note = $(".xkit_timestamp_" + post_id);
					XKit.extensions.timestamps.fetch_timestamp(post_id, blog_name, note);
				}, 10);
			}
		});
	},

	fetch_note: function(post_id, note, date_element) {
		if (this.fetch_from_cache(post_id, date_element)) {
			return;
		}

		var form_key = $("meta[name=tumblr-form-key]").attr("content");

		// {"channel_id":"coronal","reblog_id":"83753839912","reblog_key":"O8gka3J9","post_type":false,"form_key":"LhuYSwFZHTLb8TGlxMEhXAzsm8w"}
		var m_object = {
			post_id: parseInt(post_id),
			form_key: form_key,
			post_type: false,
			reblog_key: $(note).attr("data-reblog-key"),
			channel_id: $(note).attr("data-tumblelog-name")
		};

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/fetch",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				XKit.extensions.timestamps.show_failed(date_element);
			},
			onload: function(response) {
				// We are done!
				var self = XKit.extensions.timestamps;
				var raw_date = "";
				try {
					var mdata = JSON.parse(response.responseText);
					raw_date = mdata.post.date;
				} catch (e) {
					self.show_failed(date_element);
					return;
				}
				var date = self.parse_raw_date(raw_date);

				if (date.isValid()) {
					date_element.html(self.format_date(date));
				} else {
					date_element.html(raw_date);
				}

				date_element.removeClass("xtimestamp_loading");
				XKit.storage.set("timestamps", "xkit_timestamp_cache_" + post_id, date.unix());
			}
		});
	},

	fetch_timestamp: function(post_id, blog_name, date_element) {
		if (this.fetch_from_cache(post_id, date_element)) {
			return;
		}

		var api_url = "https://api.tumblr.com/v2/blog/" + blog_name + "/posts" + "?api_key=" + XKit.extensions.timestamps.apiKey + "&id=" + post_id;
		var self = this;

		try {
			GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				onerror: function() {
					XKit.console.add('Unable to load timestamp for post ' + post_id);
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
						XKit.console.add('Unable to load timestamp for post ' + post_id);
						self.show_failed(date_element);
					}
				}
			});
		} catch (e) {
			XKit.console.add('Unable to load timestamp for post ' + post_id);
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
		$("#xkit-timestamps-format-help").click(function() {
			XKit.window.show("Timestamp formatting", "Timestamps extension allows you to format the date by using a formatting syntax. Make your own and type it in the Timestamp Format box to customize your timestamps.<br/><br/>For information, please visit:<br/><a href=\"http://xkit.info/seven/support/timestamps/index.php\">Timestamp Format Documentation</a><br/><br/>Please be careful while customizing the format. Improper/invalid formatting can render Timestamps unusable. In that case, just delete the text you've entered completely and XKit will revert to its default formatting.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		});
	},

	parse_raw_date: function(raw_date) {
		var date = null;
		// Tumblr format: Jun 16th, 2013 12:42pm in the NY timezone
		if (moment.tz) {
			date = moment.tz(raw_date, "MMM DD, YYYY hh:mma", "America/New_York");
		} else {
			// Fall back to local timezone
			date = moment(raw_date, "MMM DD, YYYY hh:mma");
		}
		return date;
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
