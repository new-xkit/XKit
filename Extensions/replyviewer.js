//* TITLE ReplyViewer **//
//* VERSION 0.3.5 **//
//* DESCRIPTION View post replies easily **//
//* DETAILS The close relative of TagViewer, this extension allows you to see what replies, answers and additional content added to it while reblogging on any post. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//


XKit.extensions.replyviewer = new Object({

	running: false,
	slow: false,
	apiKey: XKit.api_key,

	button_icon:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAnhJREFUOBGlVP9rUlEUv++hmWsrp0iJ+0GyIBFEiUmQNAghif0wnPir+ZOQqEh/iJP93A8F0kiELAqhsRIMIRWFkIFgY4mYIKHNRvh1n/PgyTakzA6cd+6955zPveecD4+xOWU8HnPTUvlph7OcRaPRxtbW1pPzwFNvmQUwEomMKY7juA9SqdTj9/trwp4+uOktbnpI63kEoG2e5x8Eg8HPQsn/A0YPQP4C9BKtJfQRJRwOz9wCsWTkNqCboVAoSzhnAOngXwSlZuVy+abP5yNQQeYGRM8eaTSaF263uyeCkZ0bECU+E4G2t7fv0zoQCOzNDSiCkR0Oh0kMhWh0WST2ETakNDEH9CW0Dv0NPYA+hVrJP03gW8T5EvmEF0okko2VlZVlOFKj0ehmLper7+/vc91ulykUCs5sNl83Go2v4d9FzmMM4yclTxOBJgi8Bef7Wq1WTSaTd5Ag1Wq1vFKpZM1mc9xoNMYymezI6XR+UavV1xBrR8yhCChSiGjHA+wGHLuZTOYwkUis6XS6C16vlzcYDIxeaDKZOI/Hw6tUqqVYLGYrFot1xH9Enk4EPG2ph68KhcLXfD5/12azsfX1da7X67FUKsUqlYpgkcxcLhe/urrK0un0WqlU+oa8NzhfOA1Ga6GH/X7/ynnHn/btdvteq9ViOzs7v1DumVAC3LBarZ86nc4AZUvQL2a325nD4WDVapXp9Xr6o7B4PM7q9Tq1gFksFob2sMFgMAFDzDvaTIaC6e6Vy+WLKGmZHJg6m3UoFC+KAEgb9OMqzPPj4+Pb2Wx2ERP/gaEoQZvvoM0BaGPAK/5KGxF4YgFMxI5DZyb2JBmLE4DNNuBNd2zuAAAAAElFTkSuQmCC",

	run: function() {

		this.running = true;

		XKit.tools.init_css("replyviewer");
		XKit.interface.create_control_button("xkit-replyviewer", this.button_icon, "ReplyViewer", "");
		XKit.extensions.replyviewer.init();
		XKit.post_listener.add("replyviewer", XKit.extensions.replyviewer.do);
		if ($(".posts .post").length > 0) {
			XKit.extensions.replyviewer.do();
		}
	},

	init: function() {

		$(document).on("click", ".xkit-replyviewer", function(event) {
			var post_id = $(this).attr('data-post-id');
			var tumblelog_key = $(this).attr('data-xkit-replyviewer-tumblelog-key');
			var tumblelog_name = $(this).attr('data-xkit-replyviewer-tumblelog-name');
			XKit.extensions.replyviewer.view_tags(post_id, tumblelog_key, tumblelog_name);
		});

	},

	notes_url: "",
	found_count: 0,
	last_page: false,
	loading_more: false,
	post_id: "",
	init_id: "",

	view_tags: function(post_id, tumblelog_key, tumblelog_name) {

		// Set reply viewer up and show our window.

		XKit.extensions.replyviewer.init_id = XKit.tools.random_string();
		XKit.extensions.replyviewer.found_count = 0;
		XKit.extensions.replyviewer.post_id = post_id;
		XKit.extensions.replyviewer.last_page = false;
		XKit.extensions.replyviewer.loading_more = false;
		XKit.extensions.replyviewer.notes_url = "https://www.tumblr.com/svc/tumblelog/" + tumblelog_name + "/" + post_id + "/notes";

		console.log("replyviewer -> init_id is " + XKit.extensions.replyviewer.init_id);

		// Create our window.
		var m_html = "<div class=\"nano\" id=\"replyviewer-window-outer\">" +
				"<div class=\"content\" id=\"replyviewer-window\">" +
					"<div id=\"replyviewer-loading\">Loading, please wait...</div>" +
				"</div></div><div id=\"replyviewer-loader-icon\">&nbsp;</div>";

		$("#replyviewer-window").unbind('scroll');
		XKit.window.show("", m_html, "", "<div id=\"xkit-close-message\" class=\"xkit-button\">Close</div>");
		XKit.extensions.replyviewer.load_tags();

	},

	load_tags: function() {

		// Load the next set of notes and tags.

		var m_url = XKit.extensions.replyviewer.notes_url;
		var m_init_id = XKit.extensions.replyviewer.init_id;

		var m_post_id = XKit.extensions.replyviewer.post_id;

		$.ajax({
			url: m_url,
			dataType: 'json',
			headers: {
				"X-XKit-Version": XKit.version,
			},
		}).fail(function() {

			XKit.window.close();
			XKit.window.show("Unable to fetch required data", "ReplyViewer could not get the required data from Tumblr servers. Please try again later or <a href=\"http://new-xkit-extension.tumblr.com/ask/\">file a bug report</a> by going to the XKit Blog.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

		}).done(function(data, textStatus, jqXHR) {

			if (m_post_id !== XKit.extensions.replyviewer.post_id || m_init_id !== XKit.extensions.replyviewer.init_id) {
				console.log("replyviewer -> quitting, wrong post_id or init_id");
				return;
			}

			var commentaries = data.response.notes.filter(function(item) {
				return (item.type === "reblog" || item.type === "reply");
			});

			$(commentaries).each(function() {

				var post_type = this.type;
				var blog_name = this.blog_name;
				var post_id = this.post_id;
				var blog_avatar = this.avatar_url[64];
				var post_url = "";
				var content = "";
				var only_text = false;
				var api_url = "https://api.tumblr.com/v2/blog/" + blog_name + "/posts" + "?api_key=" + XKit.extensions.replyviewer.apiKey + "&id=" + post_id;

				if (post_type === "reply") {
					if (this.reply_text.length > 0) {
						content = this.reply_text;
						only_text = true;
						post_url = this.blog_url;
						XKit.extensions.replyviewer.add_tags(blog_name, content, post_url, blog_avatar, only_text);
						XKit.extensions.replyviewer.found_count++;
					}
				} else if (post_type === "reblog") {
					if (typeof this.added_text !== "undefined") {
						if (this.added_text.length > 0) {
							content = this.added_text;
							post_url = this.blog_url + "post/" + post_id;
							XKit.extensions.replyviewer.add_tags(blog_name, content, post_url, blog_avatar, only_text);
							XKit.extensions.replyviewer.found_count++;
						}
					} else {

						GM_xmlhttpRequest({
							method: "GET",
							url: api_url,
							json: true,
							onerror: function(response) {
								console.error("replyviewer -> Can't fetch page " + api_url);
							},
							onload: function(response) {

								if (m_post_id !== XKit.extensions.replyviewer.post_id || m_init_id !== XKit.extensions.replyviewer.init_id) {
									console.log("replyviewer -> quitting, wrong post_id or init_id");
									return;
								}

								try {

									var responseData = JSON.parse(response.responseText);
									var post = responseData.response.posts[0];

									if (typeof post.reblog.comment !== "undefined") {
										if (post.reblog.comment.length > 0) {
											content = post.reblog.comment;
											content = content.replace(/<p>/gi, "");
											content = content.replace(/<\/p>/gi, "");
											content = content.replace(/<img[^>]*>/gi, " [img] ");
											content = content.replace(/<figure[^>]*>/gi, "");
											content = content.replace(/<\/figure>/gi, "");
											content = content.replace(/<a.*href=".*?".*>(.*?)<\/a>/gi, "$1");
											if (content.length > 0) {
												XKit.extensions.replyviewer.add_tags(blog_name, content, post.post_url, blog_avatar, only_text);
												XKit.extensions.replyviewer.found_count++;
											}
										}
									}

								} catch (e) {
									console.error("replyviewer -> Can't parse JSON at " + api_url + " -> " + e.message);
								}
							}
						});
					}
				}
			});

			if (data.response._links) {
				XKit.extensions.replyviewer.notes_url = "https://www.tumblr.com" + data.response._links.next.href;
				console.log("Another page found.");
				if (XKit.extensions.replyviewer.found_count <= 7) {
					console.log(" -- Not enough posts loaded, auto-loading..");
					setTimeout(function() {
						XKit.extensions.replyviewer.load_tags();
					}, 1400);
					XKit.extensions.replyviewer.show_loader();
				} else {
					XKit.extensions.replyviewer.hide_loader();
					XKit.extensions.replyviewer.loading_more = false;
					console.log(" -- Enough loaded, waiting for user to scroll down.");
					XKit.extensions.replyviewer.activate_endless_scroll();
				}
			} else {
				if (XKit.extensions.replyviewer.found_count === 0) {
					$("#replyviewer-loading").html("No posts with replies found.");
				}
				XKit.extensions.replyviewer.last_page = true;
				console.log("Last page, quitting.");
				XKit.extensions.replyviewer.hide_loader();
			}

		});

	},

	activate_endless_scroll: function() {

		$("#replyviewer-window").unbind('scroll');
		$("#replyviewer-window").bind('scroll', function() {

			var c_height = 0;
			$("#replyviewer-window").children().each(function() {
				c_height = c_height + $(this).outerHeight(true);
			});

			if ($("#replyviewer-window").scrollTop() >= c_height - 400) {

				if (XKit.extensions.replyviewer.loading_more) {return; }

				XKit.extensions.replyviewer.loading_more = true;
				XKit.extensions.replyviewer.found_count = 0;

				XKit.extensions.replyviewer.show_loader();

				$("#replyviewer-window-outer").nanoScroller();
				setTimeout(function() { XKit.extensions.replyviewer.load_tags();	}, 2000);

			}

		});

	},

	show_loader: function() {

		$("#replyviewer-loader-icon").css("display", "block");

	},

	hide_loader: function() {

		$("#replyviewer-loader-icon").css("display", "none");

	},

	add_tags: function(by, tags, link, avatar, only_text) {

		$("#replyviewer-loading").slideUp('slow', function() { $(this).remove(); });

		var m_html = "<div class=\"replyviewer-tag\">" +
				"<div class=\"replyviewer-by\">" +
					"<a target=\"_blank\" href=\"" + link + "\" class=\"replyviewer-by-link\">" + by + "</a>" +
					"<img class=\"replyviewer-by-avatar\" src=\"" + avatar + "\">" +
				"</div>" +
				"<div class=\"replyviewer-tag-tags\">";


		if (only_text === true) {
			m_html = m_html + "<span class=\"replyviewer-tag-tag replyviewer-reply\">" + tags + "</span>";
		} else {
			m_html = m_html + "<a href=\"" + link + "\" class=\"replyviewer-tag-tag replyviewer-reblog\">" + tags + "</a>";
		}


		m_html = m_html + "</div></div>";

		if ($("#replyviever-mini-loader").length > 0) {
			$("#replyviewer-window").before(m_html);
		} else {
			$("#replyviewer-window").append(m_html);
		}

		$("#replyviewer-window-outer").nanoScroller();

	},

	do: function() {

		// get posts:
		var posts = XKit.interface.get_posts("xkit-replyviewer-done");

		$(posts).each(function() {

			$(this).addClass("xkit-replyviewer-done");

			var m_post = XKit.interface.post($(this));

			// Post has no notes, skip.
			if (m_post.note_count === 0) { return; }

			// Don't add button if we are in inbox.
			if ($(this).hasClass("is_note") && XKit.interface.where().inbox === true) { return; }

			XKit.interface.add_control_button(this, "xkit-replyviewer", "data-xkit-replyviewer-tumblelog-key=\"" + m_post.tumblelog_key + "\" data-xkit-replyviewer-tumblelog-name=\"" + m_post.owner + "\"");

		});

	},

	destroy: function() {
		$(".xreplyviewer_post_icon").remove();
		XKit.tools.remove_css("replyviewer");
		XKit.post_listener.remove("replyviewer");
		this.running = false;
	}

});
