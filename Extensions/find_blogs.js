//* TITLE Find Blogs **//
//* VERSION 1.2.2 **//
//* DESCRIPTION Lets you find similar blogs **//
//* DETAILS Requires User Menus+ to be installed. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.find_blogs = new Object({

	running: false,

	key: "vgXl8u0K1syFSAue6b9C7honIojHjC98i5WsBgSZ66HfqB0DKl",
	form_key: "",

	preferences: {
		"strip_following": {
			text: "Don't show the blogs I already follow",
			slow: true,
			default: false,
			value: false
		},
		"run_on_iframe": {
			text: "Show the button when I visit a blog",
			default: true,
			value: true
		},
	},

	is_in_iframe: false,

	frame_run: function() {

		XKit.extensions.find_blogs.is_in_iframe = true;

		if (XKit.extensions.find_blogs.preferences.run_on_iframe.value !== true) { return; }

		XKit.tools.init_css("find_blogs");

		var m_css = "#iframe_controls { width: auto !important; } " +
				"#xkit_find_blogs_inblog_button:before {" +
					" background-size: auto; " +
					" background-position: 50% 50%; " +
					" background-repeat: no-repeat; " +
					" background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjEzRkZBMkU2Q0QzMTFFMzlDNTZCMzI0NDhERkFFOUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjEzRkZBMkY2Q0QzMTFFMzlDNTZCMzI0NDhERkFFOUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTNGRkEyQzZDRDMxMUUzOUM1NkIzMjQ0OERGQUU5RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MTNGRkEyRDZDRDMxMUUzOUM1NkIzMjQ0OERGQUU5RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plk4OxcAAACiSURBVHjanJKBDYAgDATRBXQDR3AERnAERmEUR3AURnAERqgleeKHFKM2aWjyuVKeDiLifgWDWnvNQ/PUzKj9I6hnkH7sJoibBLeEZoIMbbPAA2IwGtemyQLLm+TBh9TqI875l6s0qjf0FdppgRuZ40lb6pgasfcdO9mfCBBquvYWIDRAMS3Sl9zwm5XDOxle3NtdJbhMNLkvSw6zplJfAgwAwJVCqHZNx0YAAAAASUVORK5CYII=); " +
				"}";

		XKit.tools.add_css(m_css, "profiler_in_blog");

		var m_html = "<a id=\"xkit_find_blogs_inblog_button\" onclick=\"return false\" class=\"btn icon reblog no_label\">Find Blogs</a>";

		$(".btn.dashboard").before(m_html);

		$("#xkit_find_blogs_inblog_button").click(function() {

			var blog_url = $("#tumblelog_name").attr('data-tumblelog-name');

			XKit.iframe.full();

			XKit.extensions.find_blogs.show(blog_url);


		});

	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().queue === true) { return; }

		XKit.tools.init_css("find_blogs");
		XKit.extensions.find_blogs.form_key = XKit.interface.form_key();

		if (XKit.interface.where().queue === true) { return; }


		if (typeof XKit.extensions.show_more === "undefined") {
			XKit.extensions.find_blogs.show_ump_error();
		}

		XKit.installed.when_running("show_more", function() {
			if (XKit.extensions.show_more.preferences.use_classic_menu.value === true) {
				XKit.extensions.show_more.add_custom_menu("find_blogs", function(data) {
					var user_url = data.name;

					$(document).off("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);
					$(document).on("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);

					return "<div data-url=\"" + user_url + "\" class=\"xkit-find_blogs-button-" + user_url + " xkit-find_blogs\">Find Blogs</div>";
				});
			} else {
				XKit.extensions.show_more.add_custom_menu("find_blogs", function(data) {
					var user_url = data.name;

					$(document).off("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);
					$(document).on("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);

					return "<li>" +
						"<a data-url=\"" + user_url + "\" class=\"xkit-find_blogs-button-" + user_url + " xkit-find_blogs xkit-new-menu-fix\">" +
							"<span class=\"hide_overflow\">Find Blogs</span>" +
						"</a>" +
					"</li>";
				});
			}
		}, function() {
			XKit.extensions.find_blogs.show_ump_error();
		});

		if (XKit.interface.where().user_url === "") { return; }

		var xf_html = '<ul class="controls_section" id="find_blogs_ul">' +
			'<li class="section_header selected">FIND BLOGS</li>' +
			'<li class="no_push" style="height: 36px;"><a href="#" onclick="return false;" id="find_blogs_button">' +
				'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Similar to ' + XKit.interface.where().user_url + '<span class="sub_control link_arrow arrow_right"></span></div>' +
			'</a></li></ul>';
		$("ul.controls_section:first").before(xf_html);

		$("#find_blogs_button").click(function() {

			XKit.extensions.find_blogs.show(XKit.interface.where().user_url);

		});

	},

	menu_clicked: function(e) {

		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-find_blogs")) {

			while (!m_object.hasClass("xkit-find_blogs")) {
				m_object = m_object.parent();
			}

		}

		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();
		XKit.extensions.show_more.hide_classic_menu();

		var user_url = $(m_object).attr('data-url');

		XKit.extensions.find_blogs.show(user_url);

	},

	window_id: -1,

	show: function(url) {

		var m_window_id = XKit.tools.random_string();
		XKit.extensions.find_blogs.window_id = m_window_id;

		$("body").append("<div id=\"xkit-find-blogs-background\">&nbsp;</div><div id=\"xkit-find-blogs-window\" class=\"xkit-find-blogs-loading\"><div id=\"xkit-find-blogs-inner\"><div id=\"xkit-find-blogs-text\">I'm thinking, please wait...</div>" + XKit.progress.add("find-blogs-progress") + "<div id=\"xkit-find-blogs-subtext\">I'm gathering information about this blog..</div></div></div>");

		var people = [];

		$("#xkit-find-blogs-background").click(function() {

			$("#xkit-find-blogs-background").fadeOut('slow', function() { $(this).remove(); });
			$("#xkit-find-blogs-window").fadeOut('fast', function() { $(this).remove(); });
			XKit.extensions.find_blogs.window_id = -1;

			if (XKit.extensions.find_blogs.is_in_iframe === true) {
				XKit.iframe.restore();
			}

		});

		XKit.extensions.find_blogs.fetch(url, 0, m_window_id, people);

	},

	is_in_array: function(arr, username) {

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].url === username) {
				return i;
			}
		}

		return -1;

	},

	check_if_following: function(m_url, callback) {

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/svc/tumblelog_popover/" + m_url + "?is_user_mention=false&form_key=" + XKit.extensions.find_blogs.form_key,
			json: false,
			onerror: function(response) {
				callback(false, m_url);
			},
			onload: function(response) {
				try {
					var data = JSON.parse(response.responseText);
					if (data.following === true) {
						return callback(true, m_url);
					} else {
						return callback(false, m_url);
					}
				} catch (e) {
					return callback(false, m_url);
				}
			}
		});

	},


	calculate: function(m_url, m_window_id, people) {

		if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }

		var container = [];

		while (people.length > 0) {

			var current = people.pop();

			if (current === m_url) { continue; }

			var m_index = XKit.extensions.find_blogs.is_in_array(container, current);

			if (m_index !== -1) {
				container[m_index].count++;
			} else {
				var m_object = {};
				m_object.url = current;
				m_object.count = 1;
				container.push(m_object);
			}

		}

		console.log("old container length = " + container.length);

		for (var i = 0; i < container.length; i++) {
			if (container[i].count <= 2) {
				if (container.length >= 100) {
					container.splice(i, 1);
				}
			}
		}

		console.log("new container length = " + container.length);

		container.sort(function(first, second) { return second.count - first.count; } );

		try {

			var compiled_array = [];

			for (var obj in container) {
				console.log(container[obj].url + ": " + container[obj].count);
				compiled_array.push(container[obj].url);
			}

			$("#xkit-find-blogs-text").html("Thinking even more...");
			XKit.extensions.find_blogs.already_following = 0;

			if (XKit.extensions.find_blogs.preferences.strip_following.value === true) {
				XKit.extensions.find_blogs.strip_following(m_url, compiled_array, 0, [], m_window_id);
			} else {
				XKit.extensions.find_blogs.show_results(m_url, compiled_array, m_window_id);
			}

		} catch (e) {
			console.log(e);
		}

	},

	already_following: 0,

	strip_following: function(m_url, m_array, index, adjusted_array, m_window_id) {

		if (XKit.extensions.find_blogs.window_id !== m_window_id) { return; }

		if (index > m_array.length || adjusted_array.length >= 8) {
			XKit.extensions.find_blogs.show_results(m_url, adjusted_array, m_window_id);
			return;
		}

		var m_perc = (index * 100) / m_array.length;
		XKit.progress.value("find-blogs-progress", m_perc);

		if (typeof m_array[index] === "undefined" || m_array[index].indexOf(".") !== -1) {
			XKit.extensions.find_blogs.strip_following(m_url, m_array, (index + 1), adjusted_array, m_window_id);
			return;
		}

		console.log("Checking for " + m_array[index] + " ||index = " + index + " of " + m_array.length);

		XKit.extensions.find_blogs.check_if_following(m_array[index], function(ret, url) {
			console.log("|--- Done for " + m_array[index] + ", result is " + ret);
			if (ret === false) {
				console.log("|--- not following, adding to adjusted_array");
				adjusted_array.push(url);
			} else {
				XKit.extensions.find_blogs.already_following++;
				console.log("|--- following, skipping.");
			}
			if (XKit.extensions.find_blogs.already_following > 0) {
				$("#xkit-find-blogs-subtext").html("hmm..  you already follow " + XKit.extensions.find_blogs.already_following + " people I found..");
			} else {
				$("#xkit-find-blogs-subtext").html("thinking hard to present you a good list..");
			}
			setTimeout(function() { XKit.extensions.find_blogs.strip_following(m_url, m_array, (index + 1), adjusted_array, m_window_id); }, 300);
		});

	},

	show_results: function(m_url, m_array, m_window_id) {

		if (XKit.extensions.find_blogs.window_id !== m_window_id) { return; }

		var m_html = "<div class=\"xkit-find-blogs-separator\"><div>Similar blogs to " + m_url + "</div></div><div class=\"xkit-find-blogs-blog-list\">";

		var m_count = 0;

		for (var i = 0; i < m_array.length; i++) {
			if (m_count >= 8) {break; }
			var mx_html = "<a target=\"_BLANK\" href=\"http://" + m_array[i] + ".tumblr.com/\"><div class=\"xkit-find-blogs-blog\">" +
						"<img src=\"https://api.tumblr.com/v2/blog/" + m_array[i] + ".tumblr.com/avatar/32\" class=\"m_avatar\">" +
						"<div class=\"m_title\">" + m_array[i] + "</div>" +
					"</div></a>";
			m_html = m_html + mx_html;
			m_count++;
		}

		if (m_count <= 7) {
			for (var empty_slot_i = m_count; empty_slot_i < 8; empty_slot_i++) {
				var empty_slot_html =	"<div class=\"xkit-find-blogs-blog xkit-empty-slot\">" +
							"<div class=\"m_title\">&nbsp;</div>" +
						"</div>";
				m_html = m_html + empty_slot_html;
			}
		}

		m_html = m_html + "</div>";

		$("#xkit-find-blogs-window.xkit-find-blogs-loading").removeClass("xkit-find-blogs-loading").html(m_html);



	},

	fetch: function(m_url, page, m_window_id, people) {

		if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }

		var max_page = 15;
		var offset = page * 20;

		var m_perc = (page * 100) / (max_page * 2);
		XKit.progress.value("find-blogs-progress", m_perc);

		if (page == max_page * 3) {XKit.extensions.find_blogs.calculate(m_url, m_window_id, people); return; }

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://api.tumblr.com/v2/blog/" + m_url + ".tumblr.com/posts/?api_key=" + XKit.extensions.find_blogs.key + "&reblog_info=true&offset=" + offset,
			json: false,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.find_blogs.display_error(m_window_id, "101");
				return;
			},
			onload: function(response) {

				if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }

				try {
					var data = JSON.parse(response.responseText);

					for (var i = 0; i < data.response.posts.length; i++) {

						var m_post = data.response.posts[i];

						try {
							if (typeof m_post.reblogged_from_name !== "undefined") {
								people.push(m_post.reblogged_from_name);
							}
							if (typeof m_post.source_title !== "undefined") {
								people.push(m_post.source_title);
							}
						} catch (e) {
							console.log("Can't read post, " + e.message);
						}

					}

					setTimeout(function() { XKit.extensions.find_blogs.fetch(m_url, (page + 3), m_window_id, people); }, 400);

				} catch (e) {
					console.log("Error parsing data: " + e.message);
					XKit.extensions.find_blogs.display_error(m_window_id, "102");
					return;
				}

			}
		});

	},

	display_error: function(m_window_id, err_code) {

		if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }

		$("#xkit-find-blogs-background").remove();
		$("#xkit-find-blogs-window").remove();

		XKit.window.show("Oops.", "An error prevented Find Blogs from finding similar blogs.<br/>Please try again later.<br/>Code: \"FINB" + err_code + "\"", "error", "<div id=\"xkit-close-message-find-blogs\" class=\"xkit-button default\">OK</div>");

		$("#xkit-close-message-find-blogs").click(function() {

			XKit.window.close();

			if (XKit.extensions.find_blogs.is_in_iframe === true) {
				XKit.iframe.restore();
			}

		});

	},

	average: function(posts) {



	},

	show_ump_error: function() {

		if (XKit.storage.get("find_blogs", "shown_warning_about_show_more", "") !== "yass") {
			XKit.window.show("Oops: User Menus+ is missing.", "<b>Find Blogs requires User Menus+ extension to be installed and enabled in order to work.</b> Please download User Menus+ from the extension gallery and refresh the page to start using this extension.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			XKit.storage.set("find_blogs", "shown_warning_about_show_more", "yass");
		}

	},

	destroy: function() {
		this.running = false;
	}

});
