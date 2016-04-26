//* TITLE XStats **//
//* VERSION 0.3.3 **//
//* DESCRIPTION The XKit Statistics Tool **//
//* DETAILS This extension allows you to view statistics regarding your dashboard, such as the percentage of post types, top 4 posters, and more. In the future, it will allow you to view statistics regarding your and others blogs. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.stats = new Object({

	running: false,

	apiKey: "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",

	preferences: {
		"promote": {
			text: "Help promote XKit: Add 'Posted using XKit' on the bottom of published results",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().dashboard === false && XKit.interface.where().channel === false) { return; }

		XKit.tools.init_css("stats");

		if ($('#xstats_ul').length === 0) {
			var xf_html = '<ul class="controls_section" id="xstats_ul">' +
				'<li class="section_header selected">XSTATS</li>' +
				'<li class="no_push" style="height: 36px;"><a href="#" id="xstats_dashboard_stats">' +
				'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Dashboard Stats</div>' +
				'</a></li>' +
				'<li class="no_push" id="xstats_blog_stats_parent" style="height: 36px;"><a href="#" style="display: none;" id="xstats_blog_stats">' +
				'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Blog Stats</div>' +
				'</a></li>' +
				'</ul>';
			$("ul.controls_section:first").before(xf_html);
		}

		$("#xstats_dashboard_stats").click(function() {

			XKit.extensions.stats.dashboard();

			return false;
		});

		if (XKit.interface.where().user_url === "") {

			$("#xstats_blog_stats_parent").remove();
			return;

		}

		$("#xstats_blog_stats").css("display","block");

		$("#xstats_blog_stats").click(function() {

			XKit.extensions.stats.blog(XKit.interface.where().user_url);

			return false;
		});

	},

	window_id: -1,

	blog: function(url) {

		var m_window_id = XKit.tools.random_string();
		XKit.extensions.stats.window_id = m_window_id;

		$("#xkit-stats-background, #xkit-stats-window").remove();

		$("body").append("<div id=\"xkit-stats-background\">&nbsp;</div><div id=\"xkit-stats-window\" class=\"xkit-stats-loading\"><div id=\"xkit-stats-inner\"><div id=\"xkit-stats-text\">I'm thinking, please wait...</div>" + XKit.progress.add("stats-progress") + "<div id=\"xkit-stats-subtext\">I'm gathering the information I need</div></div></div>");

		$("#xkit-stats-background").click(function() {
			XKit.extensions.stats.close_window();
		});

		XKit.extensions.stats.blog_next_page(1, m_window_id, [], url);

	},

	calculate_results_blog: function(m_window_id, posts, blog_url) {

		if (XKit.extensions.stats.window_id !== m_window_id) { return; }

		var users = [];
		var types = {};
		types.reblogged = 0;
		types.original = 0;
		types.liked = 0;
		types.animated = 0;

		var total_note_count = 0;
		var posts_to_compute = posts.slice(0);

		while (posts_to_compute.length > 0) {

			var current = posts_to_compute.pop();

			console.log(current);

			if (typeof current.reblogged_from_name === "undefined") {
				current.owner = "..original..";
			} else {
				current.owner = current.reblogged_from_name;
			}


			var in_list = XKit.extensions.stats.is_in_list(users, current.owner);

			if (current.type === "answer" || current.type === "text") { current.type = "regular"; }
			if (current.type === "panoroma") { current.type = "photo"; }
			if (current.type === "photoset") { current.type = "photo"; }

			if (current.type === "note") { current.type = "regular"; }

			if (isNaN(types[current.type]) === true) { types[current.type] = 0; }
			types[current.type]++;

			if (typeof current.reblogged_from_name !== "undefined") {
				types.reblogged++;
			} else {
				types.original++;
			}

			if (current.liked === true) {
				types.liked++;
			}

			if (current.animated === true) {
				types.animated++;
			}

			total_note_count = total_note_count + parseInt(current.note_count);

			if (typeof current.reblogged_from_name !== "undefined" && current.owner !== blog_url) {

				if (in_list !== -1) {
					users[in_list].count++;
				} else {
					var m_object = {};
					m_object.url = current.owner;
					m_object.count = 1;
					users.push(m_object);
				}

			}

		}

		users.sort(function(a,b) { return b.count-a.count; } );

		console.log(types);
		console.log("total note count = " + total_note_count);

		XKit.extensions.stats.show_results(m_window_id, posts, types, users, true, blog_url);

	},

	blog_next_page: function(page, m_window_id, posts, blog_url) {

		if (XKit.extensions.stats.window_id !== m_window_id) { return; }


		var offset = page * 20;

		var api_url = "https://api.tumblr.com/v2/blog/" + blog_url + ".tumblr.com/posts/?api_key=" + XKit.extensions.stats.apiKey + "&reblog_info=true&offset=" + offset;

		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.stats.display_error(m_window_id, "501");
				return;
			},
			onload: function(response) {

				if (XKit.extensions.stats.window_id !== m_window_id) {return; }

				try {

					data = JSON.parse(response.responseText).response;

					for (var i=0;i<data.posts.length;i++) {

						posts.push(data.posts[i]);

					}

					XKit.progress.value("stats-progress", posts.length / 3);

					if (posts.length >= 300 || data.posts.length === 0) {
						XKit.extensions.stats.calculate_results_blog(m_window_id, posts, blog_url);
					} else {
						setTimeout(function() { XKit.extensions.stats.blog_next_page((page + 1), m_window_id, posts, blog_url); }, 400);
					}

				} catch(e) {
					console.log("Error parsing data: " + e.message);
					XKit.extensions.stats.display_error(m_window_id, "102");
					return;
				}

			}
		});

	},

	dashboard: function() {

		var m_window_id = XKit.tools.random_string();
		XKit.extensions.stats.window_id = m_window_id;

		$("#xkit-stats-background, #xkit-stats-window").remove();

		$("body").append("<div id=\"xkit-stats-background\">&nbsp;</div><div id=\"xkit-stats-window\" class=\"xkit-stats-loading\"><div id=\"xkit-stats-inner\"><div id=\"xkit-stats-text\">I'm thinking, please wait...</div>" + XKit.progress.add("stats-progress") + "<div id=\"xkit-stats-subtext\">I'm gathering the information I need</div></div></div>");

		$("#xkit-stats-background").click(function() {
			XKit.extensions.stats.close_window();
		});

		XKit.extensions.stats.dashboard_next_page(1, m_window_id, []);

	},

	dashboard_next_page: function(page, m_window_id, posts) {

		if (XKit.extensions.stats.window_id !== m_window_id) { return; }

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/dashboard/" + page,
			json: false,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.stats.display_error(m_window_id, "101");
				return;
			},
			onload: function(response) {

				if (XKit.extensions.stats.window_id !== m_window_id) {return; }

				try {

					$(".post.post_full:not('.is_mine')",response.responseText).each(function() {
						posts.push(XKit.interface.post($(this)));
					});

					XKit.progress.value("stats-progress", posts.length);

					if (posts.length >= 100) {
						XKit.extensions.stats.calculate_results_dashboard(m_window_id, posts);
					} else {
						setTimeout(function() { XKit.extensions.stats.dashboard_next_page((page + 1), m_window_id, posts); }, 400);
					}

				} catch(e) {
					console.log("Error parsing data: " + e.message);
					XKit.extensions.stats.display_error(m_window_id, "102");
					return;
				}

			}
		});

	},

	is_in_list: function(haystack, needle) {

		for (var i=0;i<haystack.length;i++) {
			if (haystack[i].url === needle) {
				return i;
			}
		}

		return -1;

	},

	calculate_results_dashboard: function(m_window_id, posts) {

		if (XKit.extensions.stats.window_id !== m_window_id) { return; }

		var users = [];
		var types = {};
		types.reblogged = 0;
		types.original = 0;
		types.liked = 0;
		types.animated = 0;

		var total_note_count = 0;
		var posts_to_compute = posts.slice(0);

		while (posts_to_compute.length > 0) {

			var current = posts_to_compute.pop();

			var in_list = XKit.extensions.stats.is_in_list(users, current.owner);

			if (current.type === "panoroma") { current.type = "photo"; }
			if (current.type === "photoset") { current.type = "photo"; }

			if (current.type === "note") { current.type = "regular"; }

			if (isNaN(types[current.type]) === true) { types[current.type] = 0; }
			types[current.type]++;

			if (current.is_reblogged === true) {
				types.reblogged++;
			} else {
				types.original++;
			}

			if (current.liked === true) {
				types.liked++;
			}

			if (current.animated === true) {
				types.animated++;
			}

			total_note_count = total_note_count + parseInt(current.note_count);

			if (in_list !== -1) {
				users[in_list].count++;
			} else {
				var m_object = {};
				m_object.url = current.owner;
				m_object.count = 1;
				users.push(m_object);
			}

		}

		users.sort(function(a,b) { return b.count-a.count; } );

		console.log(types);
		console.log("total note count = " + total_note_count);

		XKit.extensions.stats.show_results(m_window_id, posts, types, users);

	},

	show_results: function(m_window_id, posts, types, users, blog_mode, blog_url) {

		if (XKit.extensions.stats.window_id !== m_window_id) { return; }

		var m_html = "";
		if (blog_mode !== true) {
			m_html = "<div class=\"m_window_title\">Results for your dashboard</div>" +
					"<div class=\"xkit-stats-separator\"><div>Top 4 blogs</div></div>" +
					"<div class=\"xkit-stats-blog-list\">";
		} else {
			m_html = "<div class=\"m_window_title\">Results for \"" + blog_url + "\"</div>" +
					"<div class=\"xkit-stats-separator\"><div>Top 4 blogs</div></div>" +
					"<div class=\"xkit-stats-blog-list\">";
		}

		var m_count = 0;

		users.forEach(function(user) {
			if (m_count == 4) {
				return;
			}
			var perc = Math.round((user.count * 100) / posts.length);
			var mx_html = "<a target=\"_BLANK\" href=\"http://" + user.url + ".tumblr.com/\"><div class=\"xkit-stats-blog\">" +
						"<img src=\"https://api.tumblr.com/v2/blog/" + user.url + ".tumblr.com/avatar/32\" class=\"m_avatar\">" +
						"<div class=\"m_title\">" + user.url + "</div>" +
						"<div class=\"m_percentage\">" + perc + "%</div>" +
					"</div></a>";
			m_html = m_html + mx_html;
			m_count++;
		});

		if (m_count <= 3) {
			for (var i=m_count;i<4;i++){
				var mx_html = "<div class=\"xkit-stats-blog xkit-empty-slot\">" +
							"<div class=\"m_title\">&nbsp;</div>" +
						"</div>";
				m_html = m_html + mx_html;
			}
		}

		m_html = m_html + "</div>" +
			"<div class=\"xkit-stats-separator\"><div>By Post Type</div></div>" +
			"<div class=\"xkit-stats-post-types\">";


		m_html = m_html + XKit.extensions.stats.return_post_type_box("regular",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("photo",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("quote",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("link",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("chat",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("video",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("audio",types, posts.length);

		m_html = m_html + "</div>";

		if (blog_mode !== true) {
			m_html = m_html + "</div>" +
				"<div class=\"xkit-stats-separator\"><div>Post Stats</div></div>" +
				"<div class=\"xkit-stats-post-types\">";
		} else {
			m_html = m_html + "</div>" +
				"<div class=\"xkit-stats-separator\"><div>Post Stats</div></div>" +
				"<div class=\"xkit-stats-post-types xkit-stats-two-boxes\">";
		}

		m_html = m_html + XKit.extensions.stats.return_post_type_box("original",types, posts.length);
		m_html = m_html + XKit.extensions.stats.return_post_type_box("reblogged",types, posts.length);

		if (blog_mode !== true) {
			m_html = m_html + XKit.extensions.stats.return_post_type_box("liked",types, posts.length);
			m_html = m_html + XKit.extensions.stats.return_post_type_box("animated",types, posts.length);
		}

		m_html = m_html + "</div>";

		m_html = m_html + "<div class=\"xkit-stats-buttons\"><div id=\"xstats-post-results\" class=\"xkit-button\">Post on current blog</div><div id=\"xstats-close-results\" class=\"xkit-button\">Close</div></div>";

		$("#xkit-stats-window").removeClass("xkit-stats-loading").html(m_html);

		$("#xstats-close-results").click(function() {
			XKit.extensions.stats.close_window();
		});

		$("#xstats-post-results").click(function() {
			XKit.extensions.stats.post_results(posts, types, users, blog_mode, blog_url);
		});

	},

	post_results: function(posts, types, users, blog_mode, blog_url) {

		XKit.window.show("Please wait","Publishing the results...","info");

		var arranged_types = [];

		for (var obj in types) {
			if (obj === "reblogged" ||obj === "liked" ||obj === "original" ||obj === "animated") { continue; }
			arranged_types.push({
				type: obj,
				count: types[obj]
			});
		}

		arranged_types.sort(function(a,b) { return b.count-a.count; } );

		var m_object = {};

		m_object.channel_id = $("#search_form").find("[name='t']").val();

		m_object.form_key = XKit.interface.form_key();

		m_object.context_page = "dashboard";

		m_object.context_id = "dashboard";

		// Not sure about this part:
		m_object["is_rich_text[one]"] = "0";
		m_object["is_rich_text[two]"] = "1";
		m_object["is_rich_text[three]"] = "0";

		m_object["post[slug]"] = "";
		m_object["post[draft_status]"] = "";
		m_object["post[date]"] ="";

		m_object["post[state]"] = "0";
		m_object["post[type]"] = "regular";

		if (blog_mode !== true) {
			m_object["post[one]"] = "XStats Dashboard Results";
		} else {
			m_object["post[one]"] = "XStats Results for " + blog_url;
		}

		m_text = "<p><b>Top 4 blogs</b></p><ul>";

		for (var user_i = 0; user_i < 4; user_i++){
			var perc = Math.round((users[user_i].count * 100) / posts.length);
			m_text = m_text + "<li><a href=\"" + users[user_i].url + ".tumblr.com\">" + users[user_i].url + "</a> <small>(" + perc + "%)</small></li>";
		}

		m_text = m_text + "</ul>";

		m_text = m_text + "<p><b>Post Types</b></p><ul>";

		for (var i=0;i<4;i++){
			if (typeof arranged_types[i] === "undefined") { continue; }
			var post_type_perc = Math.round((arranged_types[i].count * 100) / posts.length);
			m_text = m_text + "<li>" + arranged_types[i].type + " <small>(" + post_type_perc + "%)</small></li>";
		}

		m_text = m_text + "</ul>";

		m_text = m_text + "<p><b>Other</b></p><ul>";

		var m_perc = Math.round((types.original * 100) / posts.length);
		m_text = m_text + "<li>Original Posts: <small>" + m_perc + "%</small></li>";

		m_perc = Math.round((types.reblogged * 100) / posts.length);
		m_text = m_text + "<li>Reblogged Posts: <small>" + m_perc + "%</small></li>";

		if (blog_mode !== true) {

			m_perc = Math.round((types.animated * 100) / posts.length);
			m_text = m_text + "<li>GIF Posts: <small>" + m_perc + "%</small></li>";

			m_perc = Math.round((types.liked * 100) / posts.length);
			m_text = m_text + "<li>Liked Posts: <small>" + m_perc + "%</small></li>";

		}

		m_text = m_text + "</ul>";

		if (XKit.extensions.stats.preferences.promote.value === true) {
			m_text = m_text + "<p><small>Generated using XStats on <a href=\"http://www.xkit.info/\">XKit</a>.</small></p>";
		}

		m_object["post[two]"] = m_text;

		m_object["post[publish_on]"] ="";
		m_object.custom_tweet = "";
		m_object["post[tags]"] = "xstats";


		XKit.interface.kitty.get(function(kitty_data) {

			if (kitty_data.errors === true) {

				XKit.extensions.stats.post_error("Can't post stats", "Can't authenticate post. Please check your internet connection and try again later.");
				return;

			}

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/svc/post/update",
				data: JSON.stringify(m_object),
				headers: {
					"X-tumblr-puppies": kitty_data.kitten,
					"X-tumblr-form-key": XKit.interface.form_key(),
					"Content-Type": "application/json"
				},
				onerror: function(response) {
					XKit.interface.kitty.set("");
					XKit.extensions.stats.post_error("Can't post stats", "Server returned invalid/blank page or could not be reached. Maybe you hit your post limit for today, or your account has been suspended. Please check your internet connection and try again later.");
				},
				onload: function(response) {
					var m_obj = jQuery.parseJSON(response.responseText);
					XKit.interface.kitty.set(response.getResponseHeader("X-tumblr-kittens"));
					XKit.window.close();
					if (m_obj.errors === false) {
						$("#xkit_post_crushes").html("Posted!");
						XKit.notifications.add("Your stats have been posted to the current blog.", "ok");
					} else {
						XKit.extensions.stats.post_error("Can't post stats", "Server returned a non-JSON object. Maybe you hit your post limit for today, or your account has been suspended. Please try again later.");
					}
				}
			});

		});

	},

	post_error: function(title, message) {

		XKit.window.show(title, message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	return_post_type_box: function(type, types, length) {

		var m_count = types[type];

		if (typeof m_count === "undefined") { m_count = 0; }

		var perc = Math.round((m_count * 100) / length);

		var m_html = "<div class=\"xkit-stats-post-type " + type + "\">" + perc + "%";

		if (type === "original" || type === "reblogged" || type === "liked" || type === "animated") {
			if (type === "reblogged") { type = "reblog"; }
			m_html = m_html + "<div class=\"m_text\">" + type + "</div>";
		}

		m_html = m_html + "</div>";

		return m_html;

	},

	close_window: function() {

		XKit.extensions.stats.window_id = -1;

		$("#xkit-stats-background").fadeOut('slow', function() { $(this).remove(); });
		$("#xkit-stats-window").fadeOut('fast', function() { $(this).remove(); });

	},

	display_error: function(m_window_id, err_code) {

		if (XKit.extensions.stats.window_id !== m_window_id) { return; }

		$("#xkit-stats-background").remove();
		$("#xkit-stats-window").remove();

		XKit.window.show("Oops.","An error prevented XStats from finding similar blogs.<br/>Please try again later.<br/>Code: \"XSTX" + err_code + "\"","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

	},

	destroy: function() {
		$("#xstats_ul").remove();
		this.running = false;
	}

});
