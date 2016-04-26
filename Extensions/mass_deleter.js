//* TITLE Mass Deleter **//
//* VERSION 0.1.3 **//
//* DESCRIPTION Mass unlike likes / delete drafts **//
//* DETAILS Used to mass unlike posts or delete drafts. Please use with caution, especially Mass Unlike part is extremely experimental. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mass_deleter = new Object({

	running: false,

	preferences: {
		"enable_mass_unlike": {
			text: "Enable Mass Unlike Functionality (Extremely Experimental! Use with caution.)",
			default: false,
			value: false,
			experimental: true
		}
	},

	run: function() {
		this.running = true;

		XKit.tools.init_css("mass_deleter");

		if (XKit.interface.where().likes === true) {
			if (XKit.extensions.mass_deleter.preferences.enable_mass_unlike.value === true) {
				XKit.extensions.mass_deleter.init_likes();
			}
		}

		if (XKit.interface.where().drafts === true) {
			XKit.extensions.mass_deleter.init_drafts();
		}

	},

	init_drafts: function() {

		if ($("#drafts_plus_sidebar").length > 0) {

			xf_html = '<li class="no_push">' +
					'<a href="#" class="customize xkit-mass-deleter" id="xkit-mass-deleter-100">' +
						'<div class="hide_overflow">Delete 100 Drafts</div>' +
					'</a>' +
				'</li>' +
				'<li class="no_push">' +
					'<a href="#" class="customize xkit-mass-deleter" id="xkit-mass-deleter-1000">' +
						'<div class="hide_overflow">Delete 1,000 Drafts</div>' +
					'</a>' +
				'</li>';

			$("#drafts_plus_sidebar").append(xf_html);

		} else {

			xf_html = '<ul class="controls_section" id="xkit-mass-deleter-ul">' +
				'<li class="section_header selected">MASS DELETER</li>' +
				'<li class="no_push">' +
					'<a href="#" class="customize xkit-mass-deleter" onclick="return false;" id="xkit-mass-deleter-100">' +
						'<div class="hide_overflow">Delete 100 Drafts</div>' +
					'</a>' +
				'</li>' +
				'<li class="no_push">' +
					'<a href="#" class="customize xkit-mass-deleter" onclick="return false;" id="xkit-mass-deleter-1000">' +
						'<div class="hide_overflow">Delete 1,000 Drafts</div>' +
					'</a>' +
				'</li>' +
				'</ul>';
			$("ul.controls_section:eq(1)").before(xf_html);

		}

		$("#xkit-mass-deleter-100").click(function() {
			XKit.extensions.mass_deleter.delete_drafts(100);

			return false;
		});

		$("#xkit-mass-deleter-1000").click(function() {
			XKit.extensions.mass_deleter.delete_drafts(1000);

			return false;
		});

	},

	delete_drafts_limit: 0,
	delete_drafts_page: 1,
	delete_drafts_array: [],

	delete_from_array_current: 0,
	delete_from_array_max: 0,

	delete_next_max: 3,
	delete_next_current: 0,

	delete_fail_count: 0,

	delete_last_post_id: 0,

	delete_drafts: function(limit) {

		XKit.extensions.mass_deleter.delete_drafts_limit = limit;
		XKit.extensions.mass_deleter.delete_drafts_array = [];
		XKit.extensions.mass_deleter.delete_drafts_page = 1;

		XKit.window.show("Mass Deleting Drafts","<b>This might take a long, long time...</b><div id=\"xkit-mass-deleter-status\">Initializing: Gathering post ids..</div>" + XKit.progress.add("mass-deleter-progress"),"info");

		var posts = XKit.interface.get_posts();

		$(posts).each(function() {

			var m_post = XKit.interface.post($(this));
			XKit.extensions.mass_deleter.delete_drafts_array.push(m_post.id + ";" + m_post.reblog_key);

		});

		XKit.extensions.mass_deleter.delete_fail_count = 0;
		XKit.extensions.mass_deleter.delete_next_current = 0;

		XKit.extensions.mass_deleter.delete_last_post_id = $(".post_container").last().find(".post").attr('data-post-id');

		if (typeof XKit.extensions.mass_deleter.delete_last_post_id === "undefined") {
			XKit.extensions.mass_deleter.delete_last_post_id = $(".posts .post").last().attr('data-post-id');
		}

		XKit.extensions.mass_deleter.delete_drafts_page++;
		XKit.extensions.mass_deleter.delete_next_page();


	},

	delete_current_array: function() {

		$("#xkit-mass-deleter-status").html("Deleting posts..");
		XKit.extensions.mass_deleter.delete_from_array_max = XKit.extensions.mass_deleter.delete_drafts_array.length;
		setTimeout(function() { XKit.extensions.mass_deleter.delete_current_array_next(); }, 250);

	},

	delete_current_array_next: function() {

		if (XKit.extensions.mass_deleter.delete_drafts_array.length === 0) {
			XKit.window.show("Complete!","<b>Deleted " + (XKit.extensions.mass_deleter.delete_from_array_max - XKit.extensions.mass_deleter.delete_fail_count) + " posts.<br/>Failed to delete " + XKit.extensions.mass_deleter.delete_fail_count + " posts.</b><br/><br/>Please refresh the page before deleting more drafts.","info","<div id=\"xkit-close-message-2\" class=\"xkit-button default\">OK</div>");

			$("#xkit-close-message-2").click(function() {
				location.reload();
				XKit.window.close();
			});

			return;
		}

		var current_id = XKit.extensions.mass_deleter.delete_drafts_array.pop();

		var post_id = current_id.split(";")[0];
		var reblog_key = current_id.split(";")[1];

		console.log("Deleting post, id = " + post_id + " | reblog_key = " + reblog_key);

		var m_object = {};

		var m_array = document.location.href.split("/");
		var m_channel_id = m_array[4];

		m_object.post_id = post_id;
		m_object.form_key = XKit.interface.form_key();
		m_object.channel_id = m_channel_id;

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/delete",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				console.log("Unable to unlike post with id " + post_id);
				XKit.extensions.mass_deleter.delete_fail_count++;
				setTimeout(function() { XKit.extensions.mass_deleter.delete_current_array_next(); }, 250);
			},
			onload: function(response) {
				console.log("| --- Successfully unliked post!");
				var percentage = 100 - parseInt((100 * XKit.extensions.mass_deleter.delete_drafts_array.length) / XKit.extensions.mass_deleter.delete_from_array_max);
				XKit.progress.value("mass-deleter-progress", percentage);
				$("#xkit-mass-deleter-status").html("Deleting posts.. (" + XKit.extensions.mass_deleter.delete_drafts_array.length + " posts left)");
				setTimeout(function() { XKit.extensions.mass_deleter.delete_current_array_next(); }, 250);
			}
		});

	},

	delete_next_page: function() {

		$("#xkit-mass-deleter-status").html("Initializing: Gathering post ids.. (page " + XKit.extensions.mass_deleter.delete_drafts_page + ", total: "  + XKit.extensions.mass_deleter.delete_drafts_array.length + ")");

		var m_url = document.location.href.replace("#","");

		m_url = m_url + "/after/" + XKit.extensions.mass_deleter.delete_last_post_id;

		console.log("Fetching " + m_url);

		GM_xmlhttpRequest({
			method: "GET",
			url: m_url,
			onerror: function(response) {
				XKit.window.close();
				XKit.extensions.mass_deleter.display_error();
			},
			onload: function(response) {

				var m_div = $("<div>" + response.responseText + "</div>");

				var stop_action = false;

				if ($(".no_posts_found", m_div).length > 0) {
					// Posts ended!
					// But it might be Tumblr messing up.
					console.log("current = " + XKit.extensions.mass_deleter.delete_next_current);
					console.log("    max = " + XKit.extensions.mass_deleter.delete_next_max);
					if (XKit.extensions.mass_deleter.delete_next_current >= XKit.extensions.mass_deleter.delete_next_max) {
						return XKit.extensions.mass_deleter.delete_current_array();
					} else {
						console.log("Page empty, but retrying anyways...");
						XKit.extensions.mass_deleter.delete_next_current++;
						XKit.extensions.mass_deleter.delete_drafts_page++;
						setTimeout(function() { XKit.extensions.mass_deleter.delete_next_page(); }, 200);
						return;
					}
				}

				XKit.extensions.mass_deleter.delete_next_current = 0;

				$(".posts .post",m_div).each(function() {
					var m_post = XKit.interface.post($(this));
					if (XKit.extensions.mass_deleter.delete_drafts_array.length >= XKit.extensions.mass_deleter.delete_drafts_limit) {
						XKit.extensions.mass_deleter.delete_current_array();
						stop_action = true;
						return false;
					}
					if (!stop_action) {
						XKit.extensions.mass_deleter.delete_last_post_id = m_post.id;
						if (XKit.extensions.mass_deleter.delete_drafts_array.indexOf(m_post.id + ";" + m_post.reblog_key) === -1) {
							XKit.extensions.mass_deleter.delete_drafts_array.push(m_post.id + ";" + m_post.reblog_key);
						} else {
							console.log("Post already in array, skipping.");
						}
					}
				});

				if (stop_action) { return; }

				XKit.extensions.mass_deleter.delete_drafts_page++;
				setTimeout(function() { XKit.extensions.mass_deleter.delete_next_page(); }, 200);

			}
		});

	},

	init_likes: function() {

		xf_html = '<ul class="controls_section" id="xkit-mass-deleter-ul">' +
			'<li class="no_push">' +
				'<a href="#" class="customize xkit-mass-deleter" onclick="return false;" id="xkit-mass-deleter-100">' +
					'<div class="hide_overflow">Unlike 100 Likes</div>' +
				'</a>' +
			'</li>' +
			'<li class="no_push">' +
				'<a href="#" class="customize xkit-mass-deleter" onclick="return false;" id="xkit-mass-deleter-1000">' +
					'<div class="hide_overflow">Unlike 1,000 Likes</div>' +
				'</a>' +
			'</li>' +
			'</ul>';
		$("ul.controls_section:eq(1)").before(xf_html);

		$("#xkit-mass-deleter-100").click(function() {
			XKit.extensions.mass_deleter.unlike_likes(100);
		});

		$("#xkit-mass-deleter-1000").click(function() {
			XKit.extensions.mass_deleter.unlike_likes(1000);
		});

	},

	unlike_likes_limit: 0,
	unlike_likes_page: 1,
	unlike_likes_array: [],

	unlike_from_array_current: 0,
	unlike_from_array_max: 0,

	unlike_next_max: 30,
	unlike_next_current: 0,

	unlike_fail_count: 0,

	unlike_likes: function(limit) {

		XKit.window.show("Warning!","Due to the way Tumblr works, mass unliking posts might or might not cause older likes to not show up. This is a very experimental feature and no support is provided. Please only continue if you are sure that you want to do this.","warning","<div class=\"xkit-button default\" id=\"xkit-mass-deleter-unlike-continue\">Continue</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-mass-deleter-unlike-continue").click(function() {

			XKit.extensions.mass_deleter.unlike_likes_limit = limit;
			XKit.extensions.mass_deleter.unlike_likes_array = [];
			XKit.extensions.mass_deleter.unlike_likes_page = 1;

			XKit.window.show("Mass Unliking Posts","<b>This might take a long, long time...</b><div id=\"xkit-mass-deleter-status\">Initializing: Gathering post ids..</div>" + XKit.progress.add("mass-deleter-progress"),"info");

			var posts = XKit.interface.get_posts();

			$(posts).each(function() {

				var m_post = XKit.interface.post($(this));
				XKit.extensions.mass_deleter.unlike_likes_array.push(m_post.id + ";" + m_post.reblog_key);

			});

			XKit.extensions.mass_deleter.unlike_fail_count = 0;
			XKit.extensions.mass_deleter.unlike_next_current = 0;
			XKit.extensions.mass_deleter.unlike_likes_page++;
			XKit.extensions.mass_deleter.unlike_next_page();

		});

	},

	unlike_current_array: function() {

		$("#xkit-mass-deleter-status").html("Unliking posts..");
		XKit.extensions.mass_deleter.unlike_from_array_max = XKit.extensions.mass_deleter.unlike_likes_array.length;
		setTimeout(function() { XKit.extensions.mass_deleter.unlike_current_array_next(); }, 450);

	},

	unlike_current_array_next: function() {

		if (XKit.extensions.mass_deleter.unlike_likes_array.length === 0) {
			console.log(	XKit.extensions.mass_deleter.unlike_likes_array);
			XKit.window.show("Complete!","<b>Unliked " + (XKit.extensions.mass_deleter.unlike_from_array_max - XKit.extensions.mass_deleter.unlike_fail_count) + " posts.<br/>Failed to unlike " + XKit.extensions.mass_deleter.unlike_fail_count + " posts.</b><br/><br/>You might get a \"No Posts Found\" page when visiting the Likes page after Mass Unliking. Like a few posts and try again in a few hours, and it should return to normal. If XKit is unable to unlike posts, it's Tumblr's servers trying to adjust to unlikes. Try again in a couple of hours before Mass Unliking again.","info","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			return;
		}

		var current_id = XKit.extensions.mass_deleter.unlike_likes_array.pop();

		var post_id = current_id.split(";")[0];
		var reblog_key = current_id.split(";")[1];

		console.log("Unliking post, id = " + post_id + " | reblog_key = " + reblog_key);

		var m_data = "form_key=" + XKit.interface.form_key() + "&data%5Bid%5D=" + post_id + "&data%5Bkey%5D=" + reblog_key + "&data%5Bsource%5D=UNLIKE_SOURCE_IFRAME";
		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/unlike",
			data: m_data,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			json: false,
			onerror: function(response) {
				console.log("Unable to unlike post with id " + post_id);
				XKit.extensions.mass_deleter.unlike_fail_count++;
				setTimeout(function() { XKit.extensions.mass_deleter.unlike_current_array_next(); }, 450);
			},
			onload: function(response) {
				console.log("| --- Successfully unliked post!");
				var percentage = 100 - parseInt((100 * XKit.extensions.mass_deleter.unlike_likes_array.length) / XKit.extensions.mass_deleter.unlike_from_array_max);
				XKit.progress.value("mass-deleter-progress", percentage);
				$("#xkit-mass-deleter-status").html("Unliking posts.. (" + XKit.extensions.mass_deleter.unlike_likes_array.length + " posts left)");
				setTimeout(function() { XKit.extensions.mass_deleter.unlike_current_array_next(); }, 450);
			}
		});

	},

	unlike_next_page: function() {

		$("#xkit-mass-deleter-status").html("Initializing: Gathering post ids.. (page " + XKit.extensions.mass_deleter.unlike_likes_page + ", total: "  + XKit.extensions.mass_deleter.unlike_likes_array.length + ")");

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/likes/page/" + XKit.extensions.mass_deleter.unlike_likes_page + "?t=" + XKit.tools.random_string(),
			json: false,
			onerror: function(response) {
				XKit.window.close();
				XKit.extensions.mass_deleter.display_error();
				return;
			},
			onload: function(response) {

				var m_div = $("<div>" + response.responseText + "</div>");

				var stop_action = false;

				if ($(".no_posts_found", m_div).length > 0) {
					// Posts ended!
					// But it might be Tumblr messing up.
					console.log("current = " + XKit.extensions.mass_deleter.unlike_next_current);
					console.log("    max = " + XKit.extensions.mass_deleter.unlike_next_max);
					if (XKit.extensions.mass_deleter.unlike_next_current >= XKit.extensions.mass_deleter.unlike_next_max) {
						return XKit.extensions.mass_deleter.unlike_current_array();
					} else {
						console.log("Page empty, but retrying anyways...");
						XKit.extensions.mass_deleter.unlike_next_current++;
						XKit.extensions.mass_deleter.unlike_likes_page++;
						setTimeout(function() { XKit.extensions.mass_deleter.unlike_next_page(); }, 400);
						return;
					}
				}

				XKit.extensions.mass_deleter.unlike_next_current = 0;

				$(".posts .post",m_div).each(function() {
					var m_post = XKit.interface.post($(this));
					if (XKit.extensions.mass_deleter.unlike_likes_array.length >= XKit.extensions.mass_deleter.unlike_likes_limit) {
						XKit.extensions.mass_deleter.unlike_current_array();
						stop_action = true;
						return false;
					}
					if (!stop_action) {
						XKit.extensions.mass_deleter.unlike_likes_array.push(m_post.id + ";" + m_post.reblog_key);
					}
				});

				if (stop_action) { return; }

				XKit.extensions.mass_deleter.unlike_likes_page++;
				setTimeout(function() { XKit.extensions.mass_deleter.unlike_next_page(); }, 400);

			}
		});

	},

	display_error: function() {

		XKit.window.show("Unable to perform task","Please try again later or file a bug report at the XKit blog.","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

	},

	destroy: function() {
		this.running = false;
		$("#xkit-mass-deleter-ul").remove();
	}

});