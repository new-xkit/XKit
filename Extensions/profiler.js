//* TITLE Profiler **//
//* VERSION 1.2.5 **//
//* DESCRIPTION The User Inspection Gadget **//
//* DETAILS Select Profiler option from the User Menu to see information such as when they started blogging, how many posts they have, timezone, and more.<br><br>Requires User Menus+ to be installed. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.profiler = new Object({

	running: false,

	apiKey: XKit.api_key,

	preferences: {
		"show_nicknames": {
			text: "Show Nicknames / Descriptions on Dashboard",
			default: true,
			value: true,
			slow: true
		}
	},


	frame_run: function() {

		XKit.tools.init_css("profiler");

		var m_css = "#iframe_controls { width: auto !important; } " +
				"#xkit_profiler_inblog_button:before {" +
					" background-size: auto; " +
					" background-position: 50% 50%; " +
					" background-repeat: no-repeat; " +
					" background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjEzRkZBMkE2Q0QzMTFFMzlDNTZCMzI0NDhERkFFOUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjEzRkZBMkI2Q0QzMTFFMzlDNTZCMzI0NDhERkFFOUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTNGRkEyODZDRDMxMUUzOUM1NkIzMjQ0OERGQUU5RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MTNGRkEyOTZDRDMxMUUzOUM1NkIzMjQ0OERGQUU5RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ptc21PYAAACFSURBVHjaYvz//z8DOYAFjS8LxMFA7A7ExlCxs0C8E4jXAvFjuEqQjVBsCcQb/uMGG6BqwOphmmTRNSEZjK5ZFlljAbrxODT+h6plYILKu6N7Ht0AJOCO7MdXJNj4CtlGkgETUpATC84ia9xJgsadyH4kOzpITgCMaCFOdJJjJDeRAwQYAEACMSh3yj0GAAAAAElFTkSuQmCC); " +
				"}";

		XKit.tools.add_css(m_css, "profiler_in_blog");

		var m_html = "<a id=\"xkit_profiler_inblog_button\" onclick=\"return false\" class=\"btn icon reblog no_label\">Profiler</a>";

		$(".btn.dashboard").before(m_html);

		$("#xkit_profiler_inblog_button").click(function() {

			var blog_url = $("#tumblelog_name").attr('data-tumblelog-name');

			XKit.iframe.full();

			XKit.extensions.profiler.show(blog_url, true);


		});

	},

	add_nicks: function() {

		if ($(".follower").length > 0) {

			$(".follower").each(function() {

				var m_url = $(this).find(".name").text();
				var m_storage = XKit.storage.get("profiler", "nick-for--" + m_url, "");
				if (m_storage === "") { return; }

				$(this).find(".name").append("<div class=\"xkit-profiler-nickname-inline\">(" + m_storage + ")</div>");

			});

		}

		var posts = XKit.interface.get_posts("profiler-nicknamed");

		$(posts).each(function() {

			$(this).addClass("profiler-nicknamed");

			var m_post = XKit.interface.post($(this));

			if (XKit.interface.where().inbox !== true) {
				if (m_post.is_mine === true) { return; }
			}

			// console.log(m_post);

			var post_owner = m_post.owner;

			if (m_post.type === "note" && XKit.interface.where().inbox === true) {
				var m_json_info = $(this).find(".post_avatar_link").attr('data-tumblelog-popover');
				try {
					var m_json_obj = JSON.parse(m_json_info);
					post_owner = m_json_obj.name;
				} catch (e) {
					return;
				}
			}

			var m_storage = XKit.storage.get("profiler", "nick-for--" + post_owner, "");

			if (m_storage === "") { return; }

			var name_div_container;
			var name_div;

			if ($(this).find(".post_info_fence").length > 0) {
				name_div_container = $(this).find(".post_info_fence");
			} else {
				name_div_container = $(this).find(".post_info");
			}

			if (name_div_container.find("a").length > 0) {
				name_div = name_div_container.find("a").first();
				$(name_div).after("<span class=\"xkit-profiler-nickname\">(" + m_storage + ")</div>");
			} else {
				name_div = name_div_container;
				$(name_div).append("<span class=\"xkit-profiler-nickname\">(" + m_storage + ")</div>");
			}

		});

	},

	redo_nicks: function() {

		$(".xkit-profiler-nickname-inline").remove();
		$(".post .xkit-profiler-nickname").remove();
		$(".post.profiler-nicknamed").removeClass("profiler-nicknamed");
		XKit.extensions.profiler.add_nicks();

	},

	run: function() {
		this.running = true;

		XKit.tools.init_css("profiler");
		//XKit.extensions.profiler.show("xenixlet");

		if (XKit.extensions.profiler.preferences.show_nicknames.value === true) {

			XKit.post_listener.add("profiler", XKit.extensions.profiler.add_nicks);
			XKit.extensions.profiler.add_nicks();

		}

		XKit.installed.when_running("show_more", function() {
			if (XKit.extensions.show_more.preferences.use_classic_menu.value === true) {
				XKit.extensions.show_more.add_custom_menu("profiler", function(data) {
					var user_url = data.name;

					$(document).off("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);
					$(document).on("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);

					return "<div data-url=\"" + user_url + "\" class=\"xkit-profiler-button-" + user_url + " xkit-profiler\">Profiler</div>";
				});
			} else {
				XKit.extensions.show_more.add_custom_menu("profiler", function(data) {
					var user_url = data.name;

					$(document).off("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);
					$(document).on("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);

					return "<li>" +
						"<a data-url=\"" + user_url + "\" class=\"xkit-profiler-button-" + user_url + " xkit-profiler xkit-new-menu-fix\">" +
							"<span class=\"hide_overflow\">Profiler</span>" +
						"</a>" +
						"</li>";
				});
			}
		}, function() {
			XKit.extensions.profiler.show_ump_error();
		});

	},

	menu_clicked: function(e) {

		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-profiler")) {

			while (!m_object.hasClass("xkit-profiler")) {
				m_object = m_object.parent();
			}

		}

		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();
		XKit.extensions.show_more.hide_classic_menu();

		var user_url = $(m_object).attr('data-url');

		XKit.extensions.profiler.show(user_url);

	},

	window_id: "",

	is_inframe: false,

	show: function(user_url, inframe) {

		XKit.extensions.profiler.is_inframe = inframe;

		var m_window_id = XKit.tools.random_string();
		XKit.extensions.profiler.window_id = m_window_id;

		var m_html = "<div id=\"xkit-profiler-contents\" class=\"nano\">" +
					"<div id=\"xkit-profiler-main\" class=\"content\">" +
						"<div class=\"xkit-profiler-line separator\">" +
							"Blog Information" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Title" +
							"<div id=\"xkit-profiler-title\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Nickname / Description" +
							"<div id=\"xkit-profiler-nickname\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Is NSFW/Adult blog?" +
							"<div id=\"xkit-profiler-nsfw\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Is Following You?" +
							"<div id=\"xkit-profiler-is-following\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Last Update" +
							"<div id=\"xkit-profiler-last-update\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line separator\">" +
							"Other" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Blogging Since" +
							"<div id=\"xkit-profiler-since\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Timezone" +
							"<div id=\"xkit-profiler-timezone\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Custom Domain?" +
							"<div id=\"xkit-profiler-custom-domain\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Shares liked posts?" +
							"<div id=\"xkit-profiler-is-sharing-likes\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line separator\">" +
							"Posts" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Total Posts" +
							"<div id=\"xkit-profiler-total\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Text Posts" +
							"<div id=\"xkit-profiler-text\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Photo / Photoset Posts" +
							"<div id=\"xkit-profiler-photo\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Chat Posts" +
							"<div id=\"xkit-profiler-chat\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Quote Posts" +
							"<div id=\"xkit-profiler-quote\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Audio Posts" +
							"<div id=\"xkit-profiler-audio\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Video Posts" +
							"<div id=\"xkit-profiler-video\"></div>" +
						"</div>" +
					"</div>" +
				"</div>";

		XKit.window.show("Profiler for " + user_url, m_html, "info", "<div id=\"xkit-profiler-close\" class=\"xkit-button default\">Close Window</div><div id=\"xkit-profiler-rename\" class=\"xkit-button\">Rename Person</div>");

		$(".xkit-profiler-line div").addClass("loading-up");

		$("#xkit-profiler-contents").nanoScroller();
		$("#xkit-profiler-contents").nanoScroller({ scroll: 'top' });

		$("body").css("overflow", "hidden");

		$("#xkit-profiler-close").click(function() {

			$("body").css("overflow", "auto");
			XKit.window.close();

			if (XKit.extensions.profiler.is_inframe === true) {
				setTimeout(function() { XKit.iframe.restore();	}, 300);
			}

		});

		$("#xkit-profiler-rename").click(function() {

			var new_name = prompt("Enter a nickname/title/description for this person");

			if (new_name !== null) {
				XKit.storage.set("profiler", "nick-for--" + user_url, new_name);
				$("#xkit-profiler-nickname").removeClass("loading-up").html(new_name);
			} else {
				console.log("Nothing entered.");
			}

			XKit.extensions.profiler.redo_nicks();

		});

		var m_nickname = XKit.storage.get("profiler", "nick-for--" + user_url, "");
		if (m_nickname === "") {
			$("#xkit-profiler-nickname").removeClass("loading-up").html("Not set");
		} else {
			$("#xkit-profiler-nickname").removeClass("loading-up").html(m_nickname);
		}

		var blog_id;
		var m_blogs = XKit.tools.get_blogs();
		for (var i = 0; i < m_blogs.length; i++) {
			if (m_blogs[i] !== "") {
				blog_id = m_blogs[i];
				break;
			}
		}

		XKit.interface.is_following(user_url, blog_id).then(function(follow) {
			if (follow) {
				$("#xkit-profiler-is-following").removeClass("loading-up").html("Yes");
			} else {
				$("#xkit-profiler-is-following").removeClass("loading-up").html("No");
			}
		});

		var api_url = "https://api.tumblr.com/v2/blog/" + user_url + ".tumblr.com/info" + "?api_key=" + XKit.extensions.profiler.apiKey;

		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function(response) {
				XKit.extensions.profiler.display_error(m_window_id);
				return;
			},
			onload: function(response) {

				if (XKit.extensions.profiler.window_id !== m_window_id) {return; }

				var data = JSON.parse(response.responseText).response;
				var dtx = new Date(data.blog.updated * 1000);
				// defined in moment.js
				/* globals moment */
				var dt = moment(dtx);

				$("#xkit-profiler-last-update").removeClass("loading-up").html(dt.from(new Date()));
				$("#xkit-profiler-total").removeClass("loading-up").html(data.blog.posts);
				$("#xkit-profiler-title").removeClass("loading-up").html(data.blog.title);

				var m_custom_val = "None";
				if (data.blog.url.indexOf(".tumblr.com") === -1) {
					m_custom_val = "Yes (" + data.blog.url + ")";
				}
				$("#xkit-profiler-custom-domain").removeClass("loading-up").html(m_custom_val);

				if (data.blog.is_nsfw === true) {
					$("#xkit-profiler-nsfw").removeClass("loading-up").html("Yes");
				} else {
					$("#xkit-profiler-nsfw").removeClass("loading-up").html("No");
				}

				if (data.blog.share_likes === true) {
					$("#xkit-profiler-is-sharing-likes").removeClass("loading-up").html("Yes (" + data.blog.likes + " posts)");
				} else {
					$("#xkit-profiler-is-sharing-likes").removeClass("loading-up").html("No");
				}

				var last_post = data.blog.posts - 1;
				var new_url = "https://api.tumblr.com/v2/blog/" + user_url + ".tumblr.com/posts" + "?api_key=" + XKit.extensions.profiler.apiKey + "&offset=" + last_post + "&limit=1";

				GM_xmlhttpRequest({
					method: "GET",
					url: new_url,
					json: true,
					onerror: function(next_response) {
						XKit.extensions.profiler.display_error(m_window_id);
						return;
					},
					onload: function(next_response) {
						var next_data = JSON.parse(next_response.responseText).response;
						var date = new Date(next_data.posts[0].timestamp * 1000);
						$("#xkit-profiler-since").removeClass("loading-up").html(date.getFullYear());
					}
				});

				XKit.extensions.profiler.get_json_p1(user_url, m_window_id);
				XKit.extensions.profiler.get_json_p2(user_url, m_window_id, 1);

			}
		});
	},

	get_json_p1: function(user_url, m_window_id) {

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://" + user_url + ".tumblr.com/api/read/json?read_id=" + XKit.tools.random_string(),
			json: false,
			onerror: function(response) {
				console.log("Error getting page.");
				// XKit.extensions.profiler.display_error(m_window_id);
				return;
			},
			onload: function(response) {

				if (XKit.extensions.profiler.window_id !== m_window_id) {return; }

				// Manually look for the string "timezone":"Whatever" because
				// the responseText is a substring of a JSON object
				var timezone = '';
				if (response.responseText) {
					timezone = response.responseText.match(/"timezone":\s*("[^"]*")/)[1];
				}

				if (timezone) {
					// Unescape the JS string
					timezone = JSON.parse(timezone);
					$("#xkit-profiler-timezone").removeClass("loading-up").html(timezone);
				}

			}
		});

	},

	get_json_p2: function(user_url, m_window_id, part) {

		var to_get = "";
		if (part === 1) { to_get = "text"; }
		if (part === 2) { to_get = "photo"; }
		if (part === 3) { to_get = "quote"; }
		if (part === 4) { to_get = "link"; }
		if (part === 5) { to_get = "chat"; }
		if (part === 6) { to_get = "audio"; }
		if (part === 7) { to_get = "video"; }
		if (part === 8) { return; }

		var api_url = "https://api.tumblr.com/v2/blog/" + user_url + ".tumblr.com/posts" + "?api_key=" + XKit.extensions.profiler.apiKey + "&type=" + to_get + "&limit=1";
		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.profiler.display_error(m_window_id);
				return;
			},
			onload: function(response) {

				if (XKit.extensions.profiler.window_id !== m_window_id) {return; }

				var data = null;
				try {
					data = JSON.parse(response.responseText).response;
				} catch (e) {
					console.log("Error parsing data.");
					XKit.extensions.profiler.display_error(m_window_id);
					return;
				}

				$("#xkit-profiler-" + to_get).removeClass("loading-up").html(data.total_posts);

				XKit.extensions.profiler.get_json_p2(user_url, m_window_id, (part + 1));

			}
		});

	},

	display_error: function(m_window_id) {

		if (XKit.extensions.profiler.window_id !== m_window_id) {return; }

		$("#xkit-profiler-contents").addClass("error-box");
		$("#xkit-profiler-contents").html("<div class=\"padding-top: 50px;\">Can't fetch blog information.<br/>Please try again later.</div>");
		$("#xkit-profiler-contents").nanoScroller();
		$("#xkit-profiler-contents").nanoScroller({ scroll: 'top' });

	},

	show_ump_error: function() {

		if (XKit.storage.get("profiler", "shown_warning_about_show_more", "") !== "yass") {
			XKit.window.show("Oops: User Menus+ is missing.", "<b>Profiler requires User Menus+ extension to be installed and enabled in order to work.</b> Please download User Menus+ from the extension gallery and refresh the page to start using Profiler.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			XKit.storage.set("profiler", "shown_warning_about_show_more", "yass");
		}

	},

	destroy: function() {
		this.running = false;
		try {
			XKit.extensions.show_more.remove_custom_menu("profiler");
		} catch (e) {
			XKit.console.add("Can't remove custom menu, " + e.message);
		}
	}

});
