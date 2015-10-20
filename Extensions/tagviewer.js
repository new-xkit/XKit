//* TITLE TagViewer **//
//* VERSION 0.4.1 **//
//* DESCRIPTION View post tags easily **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension allows you to see what tags people added to a post while they reblogged it. It also provides access to the post, and to Tumblr search pages to find similar posts.<br><br>Based on the work of <a href='http://inklesspen.tumblr.com'>inklesspen</a> **//
//* FRAME false **//
//* BETA false **//
//* SLOW false **//

XKit.extensions.tagviewer = new Object({

	running: false,
	slow: false,
	apiKey: XKit.api_key, //*"fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",**//

	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTk1QTcxMEMwMjA2MTFFM0IwRTREQUE2OUI0ODg5QzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTk1QTcxMEQwMjA2MTFFM0IwRTREQUE2OUI0ODg5QzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRTQ1N0Y3NTAyMDUxMUUzQjBFNERBQTY5QjQ4ODlDMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRTQ1N0Y3NjAyMDUxMUUzQjBFNERBQTY5QjQ4ODlDMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psb53nIAAAFmSURBVHjapJSxSgNBEIbvAqa6EEtBIY34GiZtHsDX0Dc438AI9oKFKS20SnMRRbQQG4uIRbARCxFFEVHx/Af+C8M4e1u48LG7N3P/zszOXVqWZZKmaZnUjxb83iI+SYPzd8TvHAdmMbFEIsN4lyVF98El95oJyMQ/hBXbBHNgSaJxBG+YsivWMIG+gi/wAH6cRFbARTBlE9kj2AZHTlSaay/lSuzD1KYHlkmPz6zgrU25ErvnC/PB4sLmiE60YOW4oF7qgzE4IbLuK/uak3JrJkanNjioqZPY2gFBueVMC11Fil7SpxI8NLZhJVao02WeOkK7nAuVjbbvyYNcn8p1x0m5o6LfodiI+zPQ1E37DIcXFly+hIGyjWG7Ex/un5TtFHRh/7Rp5oyuUBEVfJY7acptN21r6AvInR5bdy5gUQvVtYZcwBaZ2tYIkVJoNvARr2LaYMcnrNMAfsex39kfsf+MXwEGAADNf36DmfC2AAAAAElFTkSuQmCC",

	frame_run: function() {

		if (typeof XKit.page.peepr != "undefined" && XKit.page.peepr) {
			XKit.extensions.tagviewer.run();
		}

	},

	run: function() {

		this.running = true;

		XKit.tools.init_css("tagviewer");
		XKit.interface.create_control_button("xkit-tagviewer", this.button_icon, "TagViewer", "");
		XKit.extensions.tagviewer.init();
		XKit.post_listener.add("tagviewer", XKit.extensions.tagviewer.do);
		if ($(".posts .post").length > 0) {
			XKit.extensions.tagviewer.do();
		}
	},

	init: function() {

		$(document).on("click", ".xkit-tagviewer", function(event) {
			var post_id = $(this).attr('data-post-id');
			var tumblelog_key = $(this).attr('data-xkit-tagviewer-tumblelog-key');
			var tumblelog_name = $(this).attr('data-xkit-tagviewer-tumblelog-name');
			XKit.extensions.tagviewer.view_tags(post_id, tumblelog_key, tumblelog_name);
		});

	},

	notes_url: "",
	notes_url_from: "",
	found_count: 0,
	last_page: false,
	loading_more: false,
	post_id: "",
	init_id: "",

	view_tags: function(post_id, tumblelog_key, tumblelog_name, from) {

		// Set tag viewer up and show our window.

		XKit.extensions.tagviewer.init_id = XKit.tools.random_string();
		XKit.extensions.tagviewer.found_count = 0;
		XKit.extensions.tagviewer.post_id = post_id;
		XKit.extensions.tagviewer.last_page = false;
		XKit.extensions.tagviewer.loading_more = false;
		XKit.extensions.tagviewer.notes_url_from = "";
		XKit.extensions.tagviewer.notes_url = "http://www.tumblr.com/dashboard/notes/" + post_id + "/" + tumblelog_key + "/" + tumblelog_name;

		XKit.console.add("tagviewer -> init_id is " + XKit.extensions.tagviewer.init_id);

		// Create our window.
		var m_html = "<div class=\"nano\" id=\"tagviewer-window-outer\">" +
				"<div class=\"content\" id=\"tagviewer-window\">" +
					"<div id=\"tagviewer-loading\">Loading, please wait...</div>" +
					"</div></div><div id=\"tagviewer-loader-icon\">&nbsp;</div>";

		$("#tagviewer-window").unbind('scroll');
		XKit.window.show("", m_html, "", "<div id=\"xkit-close-message\" class=\"xkit-button\">Close</div>");
		XKit.extensions.tagviewer.load_tags();

	},

	load_tags: function() {

		// Load the next set of notes and tags.

		var m_url = XKit.extensions.tagviewer.notes_url;
		var m_init_id = XKit.extensions.tagviewer.init_id;

		if (XKit.extensions.tagviewer.notes_url_from !== "") {
			m_url += "?from_c=" + XKit.extensions.tagviewer.notes_url_from;
		}

		var m_post_id = XKit.extensions.tagviewer.post_id;

		// Quick Hack:
		if (document.location.href.toLowerCase().indexOf("https://") !== -1) {
			m_url = m_url.replace("http://","https://");
		}

		$.ajax({
			url: m_url,
			dataType: 'html'
		}).error(function() {

			XKit.window.close();
			XKit.window.show("Unable to fetch required data", "TagViewer could not get the required data from Tumblr servers. Please try again later or <a href=\"http://new-xkit-extension.tumblr.com/ask/\">file a bug report</a> by going to the XKit Blog.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

		}).done(function(data, textStatus, jqXHR) {

			if (m_post_id !== XKit.extensions.tagviewer.post_id || m_init_id !== XKit.extensions.tagviewer.init_id) {
				XKit.console.add("tagviewer -> quitting, wrong post_id or init_id");
				return;
			}

			var next_note = jqXHR.getResponseHeader('X-next-note');

			var notes = $($.parseHTML(data));
			var reblogs = notes.find("li.reblog");

			$(reblogs).each(function() {

				var post_url = $(this).find(".action").attr('data-post-url');

				var blog_username = $(this).attr('data-tumblelog');
				var blog_name = post_url.split("/")[2];
				var post_id = post_url.split("/")[4];
				var blog_avatar = $(this).find("img.avatar").attr('src');

				var api_url = "https://api.tumblr.com/v2/blog/" + blog_name + "/posts" + "?api_key=" + XKit.extensions.tagviewer.apiKey + "&id=" + post_id;

				GM_xmlhttpRequest({
					method: "GET",
					url: api_url,
					json: true,
					onerror: function(response) {
						XKit.console.add("tagviewer -> Can't fetch page " + api_url);
					},
					onload: function(response) {

						if (m_post_id !== XKit.extensions.tagviewer.post_id || m_init_id !== XKit.extensions.tagviewer.init_id) {
							XKit.console.add("tagviewer -> quitting, wrong post_id or init_id");
							return;
						}

						try {

							var data = JSON.parse(response.responseText);
							var post = data.response.posts[0];

							if (typeof post.tags !== "undefined") {
								if (post.tags.length > 0) {
									XKit.extensions.tagviewer.add_tags(blog_username, post.tags, post_url, blog_avatar);
									XKit.extensions.tagviewer.found_count++;
								}
							}

						} catch(e) {
							XKit.console.add("tagviewer -> Can't parse JSON at " + api_url + " -> " + e.message);
						}

					}
				});

			});

			if (next_note > 0) {
				XKit.extensions.tagviewer.notes_url_from = next_note;
				XKit.console.add("Another page found.");
				if (XKit.extensions.tagviewer.found_count <= 7) {
					XKit.console.add(" -- Not enough posts loaded, auto-loading..");
					setTimeout(function() {
						XKit.extensions.tagviewer.load_tags();
					}, 1400);
					XKit.extensions.tagviewer.show_loader();
				} else {
					XKit.extensions.tagviewer.hide_loader();
					XKit.extensions.tagviewer.loading_more = false;
					XKit.console.add(" -- Enough loaded, waiting for user to scroll down.");
					XKit.extensions.tagviewer.activate_endless_scroll();
				}
			} else {
				if (XKit.extensions.tagviewer.found_count === 0) {
					$("#tagviewer-loading").html("No posts with tags found.");
				}
				XKit.extensions.tagviewer.last_page = true;
				XKit.console.add("Last page, quitting.");
				XKit.extensions.tagviewer.hide_loader();
			}

		});

	},

	activate_endless_scroll: function() {

		$("#tagviewer-window").unbind('scroll');
		$("#tagviewer-window").bind('scroll', function() {

			var c_height = 0;
			$("#tagviewer-window").children().each(function(){
				c_height = c_height + $(this).outerHeight(true);
			});

			if($("#tagviewer-window").scrollTop() >= c_height - 400) {

				if (XKit.extensions.tagviewer.loading_more) {return; }

				XKit.extensions.tagviewer.loading_more = true;
				XKit.extensions.tagviewer.found_count = 0;

				XKit.extensions.tagviewer.show_loader();

				$("#tagviewer-window-outer").nanoScroller();
				setTimeout(function() { XKit.extensions.tagviewer.load_tags();	}, 2000);

			}

		});

	},

	show_loader: function() {

		$("#tagviewer-loader-icon").css("display","block");

	},

	hide_loader: function() {

		$("#tagviewer-loader-icon").css("display","none");

	},

	add_tags: function(by, tags, link, avatar) {

		$("#tagviewer-loading").slideUp('slow', function() { $(this).remove(); });

		var m_html = "<div class=\"tagviewer-tag\">" +
				"<div class=\"tagviewer-by\">" +
					"<a target=\"_blank\" href=\"" + link + "\" class=\"tagviewer-by-link\">" + by + "</a>" +
					"<img class=\"tagviewer-by-avatar\" src=\"" + avatar + "\">" +
				"</div>" +
				"<div class=\"tagviewer-tag-tags\">";

		for (var i=0;i<tags.length;i++) {
			var formatted_tag = XKit.tools.replace_all(tags[i], " ", "+");
			m_html = m_html + "<a target=\"_blank\" href=\"http://www.tumblr.com/tagged/" + formatted_tag + "/\" class=\"tagviewer-tag-tag\">#" + tags[i] + "</a>";
		}

		m_html = m_html + "</div></div>";

		if ($("#tagviever-mini-loader").length > 0) {
			$("#tagviewer-window").before(m_html);
		} else {
			$("#tagviewer-window").append(m_html);
		}

		$("#tagviewer-window-outer").nanoScroller();

	},

	do: function() {

		// get posts:
		var posts = XKit.interface.get_posts("xkit-tagviewer-done");

		$(posts).each(function() {

			$(this).addClass("xkit-tagviewer-done");

			var m_post = XKit.interface.post($(this));

			// Post has no notes, skip.
			if (m_post.note_count === 0) { return; }

			// Don't add button if we are in inbox.
			if ($(this).hasClass("is_note") && XKit.interface.where().inbox === true) { return; }

			XKit.interface.add_control_button(this, "xkit-tagviewer", "data-xkit-tagviewer-tumblelog-key=\"" + m_post.tumblelog_key + "\" data-xkit-tagviewer-tumblelog-name=\"" + m_post.owner + "\"");

		});
	},

	destroy: function() {
		$(".xtagviewer_post_icon").remove();
		XKit.tools.remove_css("tagviewer");
		XKit.post_listener.remove("tagviewer");
		this.running = false;
	}
});
