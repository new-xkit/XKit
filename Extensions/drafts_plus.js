//* TITLE Drafts+ **//
//* VERSION 0.2.5 **//
//* DESCRIPTION Enhancements for Drafts page **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.drafts_plus = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (XKit.interface.where().drafts !== true) {return; }

		XKit.tools.init_css("drafts_plus");

		var xf_html = '<ul class="controls_section" id="drafts_plus_sidebar">' +
			'<li class="section_header selected">DRAFTS TOOLS</li>' +
			'<li class="" id="drafts_plus_mass_edit_li"">' +
				'<a href="#" class="customize" id="drafts_plus_mass_edit_button">' +
					'<div class="hide_overflow">Mass Edit Mode</div>' +
				'</a>' +
			'</li>' +
			'<li class="no_push">' +
				'<a href="#" id="xshrinkposts_button">' +
					'<div class="hide_overflow">Shrink Posts <div class="count" style="padding-top: 8px;">off</div></div>' +
				'</a>' +
			'</li>' +
			'</ul>';

		$("ul.controls_section:eq(1)").before(xf_html);

		$("#drafts_plus_mass_edit_button").click(function() {

			if (!$(this).parent().hasClass("xkit-selected")) {

				$(this).parent().addClass("xkit-selected");
				$(this).parent().addClass("selected");
				XKit.extensions.drafts_plus.start_mass_editor();

			} else {

				$(this).parent().removeClass("xkit-selected");
				$(this).parent().removeClass("selected");
				XKit.extensions.drafts_plus.stop_mass_editor();

			}

			return false;
		});

		$("#xshrinkposts_button").click(function() {

			$(this).toggleClass("xkit-queue-option-button-on");

			if ($(this).hasClass("xkit-queue-option-button-on")) {

				$(this).find(".count").html("on");

				XKit.storage.set("shuffle_queue", "shrink_posts", "true");

				XKit.tools.add_css(" .post_header { display: none; }  .post .post_content_inner, .post .post_media { height: 70px !important; overflow: hidden !important; } .post .post_content { pointer-events: none !important; height: 70px !important; overflow: hidden !important; border: 1px dashed rgb(200,200,200); } ", "shuffle_queue_mini_posts");

			} else {

				$(this).find(".count").html("off");

				XKit.storage.set("shuffle_queue", "shrink_posts", "false");

				XKit.tools.remove_css("shuffle_queue_mini_posts");

			}

			return false;
		});

	},

	start_mass_editor: function() {

		XKit.tools.add_css(" #posts { padding: 0 !important; margin: 0 !important; } .xtimestamp { display: none; } .post_controls { display: none; }" +
				" .post:not(.radar):last-child { display: block; } #left_column { min-height: 120%; } " +
				" .post_full.is_note .avatar, #new_post_hidden { display: none; } " +
				" #posts.posts>.post_container { margin-bottom: 0; } " +
				" .post .post_source, .post.is_video, .post.is_audio { display: none; } " +
				" .post .post_footer, .post .post_permalink { display: none !important; } " +
				" .post .tumblr_video_container, .post .tumblr_video_container * { max-width: 164px !important; max-height: 164px !important; } " +
				" .post .photoset_row { max-width: 164px;  height: auto; } " +
				" .post .post_content img { max-height: 164px; max-width: 164px; height: auto; } " +
				" .post { -moz-user-select: none; user-select: none; -webkit-user-select: none; float: left !important; width: 200px !important; height: 200px !important; " +
				"    opacity: 0.53; " +
				"    display: inline-block !important; clear: none !important; overflow: hidden !important; " +
				"    margin: 0px 4px 8px 4px !important; } " +
				" .fan_mail { display: none !important; } " +
				" #xkit_delete_selected:hover { background: rgba(255,255,255,0.12); cursor: pointer; } " +
				" #xkit_delete_selected.disabled { opacity: 0.5; cursor: default; " +
				" background: rgba(255,255,255,0.08) !important; top: 0 !important; } " +
				" #xkit_delete_selected:active { background: rgba(0,0,0,0.12); " +
				" box-shadow: inset 0px 1px 2px rgba(0,0,0,0.43); position: relative; top: 1px; } " +
				" #xkit_delete_selected { border: 1px solid rgba(0,0,0,0.32); border-radius: 6px; " +
				" box-shadow: inset 0px 1px 0px rgba(255,255,255,0.12), 0px 1px 0px rgba(255,255,255,0.12); " +
				" padding: 5px 15px; background: rgba(255,255,255,0.08); display: inline-block; margin-top: 5px;} " +
				" .post:not(.radar) * { pointer-events: none; cursor: default; } " +
				" .post.xpost-selected { opacity: 1; } " +
				" .post.xpost-working { animation: xpost-working-ani 1s infinite; " +
				" -webkit-animation: xpost-working-ani 1s infinite; " +
				" -webkit-animation: xpost-working-ani 1s infinite; } " +
				" @-moz-keyframes xpost-working-ani { from { opacity: 1; } 50% { opacity: 0.32; } to { opacity: 1; } } " +
				" @-webkit-keyframes xpost-working-ani { from { opacity: 1; } 50% { opacity: 0.32; } to { opacity: 1; } } ", "drafts_plus_mass_editor");

		$("#new_post_buttons").attr("id", "new_post_hidden");

		XKit.tools.add_function(function() {

			try {

				if (typeof Tumblr === "undefined") {
					window.top.Tumblr.AutoPaginator.stop();
					window.top.Tumblr.Events.trigger("DOMEventor:updateRect");
				} else {
					Tumblr.AutoPaginator.stop();
					Tumblr.Events.trigger("DOMEventor:updateRect");
				}

			} catch (e) {

				console.log("Drafts Plus ==2==> !!! " + e.message);

			}

		}, true, "");

		$(window).scroll(XKit.extensions.drafts_plus.scrolled);

		XKit.extensions.drafts_plus.add_overlays();
		XKit.extensions.drafts_plus.load_posts();

	},

	scroller_working: false,
	current_page: 1,

	add_overlays: function() {

		console.log("drafts_plus -> Adding overlays...");

		$(".posts .post").not(".drafts-plus-overlay-done").not(".radar").each(function() {

			$(this).addClass("drafts-plus-overlay-done");

			var m_html = "<div class=\"xkit-drafts-plus-overlay\">" +
						"<div class=\"xkit-drafts-plus-overlay-inner\">" +
							"<div class=\"xkit-drafts-plus-delete\">&nbsp;</div>" +
							"<div class=\"xkit-drafts-plus-edit\">&nbsp;</div>" +
							"<div class=\"xkit-drafts-plus-publish\">&nbsp;</div>" +
							"<div class=\"xkit-drafts-plus-queue\">&nbsp;</div>" +
						"</div>" +
					"</div>";

			$(this).append(m_html);

		});

		$(".xkit-drafts-plus-delete, .xkit-drafts-plus-edit, .xkit-drafts-plus-publish, .xkit-drafts-plus-queue").unbind("click");

		$(".xkit-drafts-plus-queue").bind("click", function() {

			var m_parent = $(this).parentsUntil('.post').parent();

			$(m_parent).addClass("xpost-working");

			var post_id = $(m_parent).attr('data-post-id');

			var m_object = {};

			m_object.post_id = post_id;
			m_object.form_key = XKit.interface.form_key();
			m_object.queue = "queue";

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/publish",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				data: $.param({"id": m_object.post_id, "form_key" : m_object.form_key, "queue":"queue"}),
				json: false,
				onerror: function(response) {
					XKit.window.show("Can't delete post.", "Drafts+ could not perform the requested action. There might be a problem with Tumblr servers, please try again later.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				},
				onload: function(response) {
					$(m_parent).fadeOut('slow', function() { $(m_parent).parent().remove(); });
				}
			});

		});

		$(".xkit-drafts-plus-edit").bind("click", function() {

			var m_parent = $(this).parentsUntil('.post').parent();

			var post_id = $(m_parent).attr('data-post-id');

			window.open("http://www.tumblr.com/edit/" + post_id);

		});

		$(".xkit-drafts-plus-publish").bind("click", function() {

			var m_parent = $(this).parentsUntil('.post').parent();

			$(m_parent).addClass("xpost-working");

			var post_id = $(m_parent).attr('data-post-id');

			var m_object = {};

			m_object.post_id = post_id;
			m_object.form_key = XKit.interface.form_key();
			m_object.queue = "queue";

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/publish",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				data: $.param({"id": m_object.post_id, "form_key" : m_object.form_key}),
				json: false,
				onerror: function(response) {
					XKit.window.show("Can't delete post.", "Drafts+ could not perform the requested. There might be a problem with Tumblr servers, please try again later.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				},
				onload: function(response) {
					$(m_parent).fadeOut('slow', function() { $(m_parent).parent().remove(); });
				}
			});

		});

		$(".xkit-drafts-plus-delete").bind("click", function() {

			var m_parent = $(this).parentsUntil('.post').parent();

			$(m_parent).addClass("xpost-working");

			var post_id = $(m_parent).attr('data-post-id');

			var m_object = {};

			var m_array = document.location.href.split("/");
			var m_channel_id = m_array[4];

			m_object.post_id = post_id;
			m_object.form_key = XKit.interface.form_key();
			m_object.channel_id = m_channel_id;

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/svc/post/delete",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"X-tumblr-form-key": XKit.interface.form_key(),
				},
				data: $.param({"post_id": m_object.post_id, "channel_id" : m_object.channel_id }),
				json: false,
				onerror: function(response) {
					XKit.window.show("Can't delete post.", "Drafts+ could not perform the requested. There might be a problem with Tumblr servers, please try again later.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				},
				onload: function(response) {
					$(m_parent).fadeOut('slow', function() { $(m_parent).parent().remove(); });
				}
			});

		});

	},

	scrolled: function() {

		if ($(window).scrollTop() + $(window).height() == $(document).height()) {

			XKit.extensions.drafts_plus.load_posts();

		}

	},

	load_posts: function() {

		function __trigger_load() {

			try {

				if (typeof Tumblr === "undefined") {
					window.top.Tumblr.Events.trigger("posts:load");
					window.top.Tumblr.AudioPlayer.update_all();
					window.top.Tumblr.Events.trigger("DOMEventor:updateRect");
				} else {
					Tumblr.Events.trigger("posts:load");
					Tumblr.AudioPlayer.update_all();
					Tumblr.Events.trigger("DOMEventor:updateRect");
				}

			} catch (e) {

				console.log("Drafts Plus ==2==> !!! " + e.message);

			}


		}

		if (XKit.extensions.drafts_plus.scroller_working === true) { return; }

		XKit.extensions.drafts_plus.scroller_working = true;
		XKit.extensions.drafts_plus.current_page++;

		var last_id = $("#posts").find("li.post_container").last().find(".post").attr('data-post-id');

		var m_url = document.location.href.replace("#", "");

		// http://www.tumblr.com/blog/xenix/drafts/after/

		m_url = m_url + "/after/" + last_id;

		GM_xmlhttpRequest({
			method: "GET",
			url: m_url,
			onerror: function(response) {
				XKit.extensions.drafts_plus.scroller_working = false;
				$("#auto_pagination_loader_failure").css("display", "block");
				$("#auto_pagination_loader_loading").css("display", "none");

			},
			onload: function(response) {
				XKit.extensions.drafts_plus.scroller_working = false;
				var new_posts = $("#posts", response.responseText).html();
				// console.log(new_posts);
				try {
					$("ol#posts").append(new_posts);
				} catch (e) {
					console.log("Drafts Plus ==3==> !!! " + e.message);
				}
				$("#auto_pagination_loader_failure").css("display", "none");
				$("#auto_pagination_loader_loading").css("display", "block");

				XKit.extensions.drafts_plus.add_overlays();
				try {
					XKit.tools.add_function(__trigger_load, true, "");
				} catch (e) {
					console.log("Drafts+: " + e.message);
				}

			}
		});

	},

	stop_mass_editor: function() {

		XKit.tools.remove_css("drafts_plus_mass_editor");
		$(".posts .post").removeClass("drafts-plus-overlay-done");
		$(".xkit-drafts-plus-overlay").remove();

	},

	destroy: function() {
		this.running = false;
		XKit.extensions.drafts_plus.stop_mass_editor();
	}

});
