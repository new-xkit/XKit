//* TITLE ReplyViewer **//
//* VERSION 0.3.0 **//
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

	frame_run: function() {

		if (XKit.page.peepr) {
			XKit.extensions.replyviewer.run();
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
	notes_url_from: "",
	found_count: 0,
	last_page: false,
	loading_more: false,
	post_id: "",
	init_id: "",

	view_tags: function(post_id, tumblelog_key, tumblelog_name, from) {

		// Set tag viewer up and show our window.

		XKit.extensions.replyviewer.init_id = XKit.tools.random_string();
		XKit.extensions.replyviewer.found_count = 0;
		XKit.extensions.replyviewer.post_id = post_id;
		XKit.extensions.replyviewer.last_page = false;
		XKit.extensions.replyviewer.loading_more = false;
		XKit.extensions.replyviewer.notes_url_from = "";
		XKit.extensions.replyviewer.notes_url = "http://www.tumblr.com/dashboard/notes/" + post_id + "/" + tumblelog_key + "/" + tumblelog_name;

		XKit.console.add("replyviewer -> init_id is " + XKit.extensions.replyviewer.init_id);

		// Create our window.
		var m_html = "<div class=\"nano\" id=\"replyviewer-window-outer\">" +
				"<div class=\"content\" id=\"replyviewer-window\">" +
					"<div id=\"replyviewer-loading\">Loading, please wait...</div>" +
				"</div></div><div id=\"replyviewer-loader-icon\">&nbsp;</div>";

		$("#replyviewer-window").unbind('scroll');
		XKit.window.show("", m_html, "", "<div id=\"xreplyviewer-close\" class=\"xkit-button\">Close</div>");

		$("#xreplyviewer-close").click(function() {

			XKit.extensions.replyviewer.init_id = -1;
			XKit.window.close();

		});

		XKit.extensions.replyviewer.load_tags();

	},

	load_tags_no_api: function() {

		// Load the next set of notes and tags.

		var m_url = XKit.extensions.replyviewer.notes_url;
		var m_init_id = XKit.extensions.replyviewer.init_id;

		if (XKit.extensions.replyviewer.notes_url_from !== "") {
			m_url += "?from_c=" + XKit.extensions.replyviewer.notes_url_from;
		}

		var m_post_id = XKit.extensions.replyviewer.post_id;

		// Quick Hack:
		if (document.location.href.toLowerCase().indexOf("https://") !== -1) {
			m_url = m_url.replace("http://", "https://");
		}

		$.ajax({
			url: m_url,
			dataType: 'html'
		}).error(function() {

			XKit.window.close();
			XKit.window.show("Unable to fetch required data", "ReplyViewer could not get the required data from Tumblr servers. Please try again later or <a href=\"http://new-xkit-extension.tumblr.com/ask/\">file a bug report</a> by going to the XKit Blog.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

		}).done(function(data, textStatus, jqXHR) {

			if (m_post_id !== XKit.extensions.replyviewer.post_id || m_init_id !== XKit.extensions.replyviewer.init_id) {
				XKit.console.add("replyviewer -> quitting, wrong post_id or init_id");
				return;
			}

			var next_note = jqXHR.getResponseHeader('X-Next-Note');

			var notes = $($.parseHTML(data));
			var commentaries = notes.find("li.reblog.with_commentary, li.reply, li.answer");

			$(commentaries).each(function() {

				console.log($(this));
				var blog_username = $(this).attr('data-tumblelog');
				var post_url = $(this).find(".action").attr('data-post-url');
				var blog_avatar = $(this).find("img.avatar").attr('src');

				var reply_container = $(this).find("blockquote");
				var content = "";
				var only_text = false;

				if ($(this).find(".answer_content").length > 0) {
					content = $(this).find(".answer_content").html();
					only_text = true;
					post_url = "http://" + blog_username + ".tumblr.com";
				} else {
					content = $(reply_container).find("a").html();
				}

				XKit.extensions.replyviewer.add_tags(blog_username, content, post_url, blog_avatar, only_text);
				XKit.extensions.replyviewer.found_count++;

			});

			if (next_note > 0) {
				XKit.extensions.replyviewer.notes_url_from = next_note;
				XKit.console.add("Another page found.");
				if (XKit.extensions.replyviewer.found_count <= 7) {
					XKit.console.add(" -- Not enough posts loaded, auto-loading..");
					setTimeout(function() {
						XKit.extensions.replyviewer.load_tags();
					}, 1400);
					XKit.extensions.replyviewer.show_loader();
				} else {
					XKit.extensions.replyviewer.hide_loader();
					XKit.extensions.replyviewer.loading_more = false;
					XKit.console.add(" -- Enough loaded, waiting for user to scroll down.");
					XKit.extensions.replyviewer.activate_endless_scroll();
				}
			} else {
				if (XKit.extensions.replyviewer.found_count === 0) {
					$("#replyviewer-loading").html("No posts with replies found.");
				}
				XKit.extensions.replyviewer.last_page = true;
				XKit.console.add("Last page, quitting.");
				XKit.extensions.replyviewer.hide_loader();
			}

		});

	},


	load_tags: function() {

		// Load the next set of notes and tags.
		// This uses APIv2, which I do not have a key and can't gather
		// thanks to Tumblr's license agreement, which sounds like it was
		// written especially to prevent XKit from using it.

		XKit.extensions.replyviewer.load_tags_no_api();
		return;


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

		if ($("#tagviever-mini-loader").length > 0) {
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
