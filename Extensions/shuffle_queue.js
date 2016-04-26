//* TITLE Enhanced Queue **//
//* VERSION 2.0.6 **//
//* DESCRIPTION Additions to the Queue page. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS Go to your queue and click on the Shuffle button on the sidebar to shuffle the posts. Note that only the posts you see will be shuffled. If you have more than 15 posts on your queue, scroll down and load more posts in order to shuffle them too. Or click on Shrink Posts button to quickly rearrange them. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.shuffle_queue = new Object({

	running: false,

	run: function() {

		if (!XKit.interface.where().queue) {
			return;
		}

		XKit.tools.init_css("shuffle_queue");

		this.running = true;

		/*xf_html = '<ul class="controls_section" id="xshufflequeue_sidebar">' +
			'<li class="">' +
				'<a href="#" class="queue" id="xshufflequeue_button">' +
					'<div class="hide_overflow">Shuffle</div>' +
					'<div class="count">&nbsp;</div>' +
				'</a>' +
			'</li>' +
			'</ul>';

		$("ul.controls_section:eq(1)").before(xf_html);*/


		var xf_html = '<ul class="controls_section" id="queue_plus_ul">' +
					'<li class="section_header selected">Queue+</li>' +
					'<li class="no_push" style="height: 36px;"><a href="#" id="xshufflequeue_button">' +
						'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Shuffle Queue <div class="count" style="padding-top: 8px;">&nbsp;</div> </div>' +
					'</a></li>' +
					'<li class="no_push" style="height: 36px;"><a class="" href="#" id="xdeletequeue_button">' +
						'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Clear Queue</div>' +
					'</a></li>' +
					'<li class="no_push" style="height: 36px;"><a href="#" id="xshrinkposts_button">' +
						'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Shrink Posts <div class="count" style="padding-top: 8px;">off</div> </div>' +
					'</a></li>' +
					'<li class="no_push" style="height: 36px;"><a class="" href="#" id="xqueueoptions_button">' +
						'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Queue Options <div class="count" style="padding-top: 8px;">on</div> </div>' +
					'</a></li>' +
				'</ul>';

		setTimeout(function() {

			$("ul.controls_section:eq(1)").before(xf_html);

			$("#xshufflequeue_button").click(function(event) {
				XKit.extensions.shuffle_queue.shuffle();

				return false;
			});

			$("#xqueueoptions_button").click(function() {

				$(this).toggleClass("xkit-queue-option-button-on");

				if ($(this).hasClass("xkit-queue-option-button-on")) {

					$(this).find(".count").html("off");

					XKit.storage.set("shuffle_queue", "hide_options", "true");

					XKit.tools.add_css(" .dashboard_options_form { display: none; }", "shuffle_queue_hide_options");

				} else {

					$(this).find(".count").html("on");

					XKit.storage.set("shuffle_queue", "hide_options", "false");

					XKit.tools.remove_css("shuffle_queue_hide_options");

				}

				return false;
			});

			$("#xshrinkposts_button").click(function() {
				//Check if Shorten Posts is enabled
				if (!XKit.installed.is_running("shorten_posts")) {
					//Shorten Posts is not enabled, no issues there
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
				} else {
					//Shorten Posts IS enabled, use that to shrink posts rather than Enhanced Queue.
					//If the two of them were to be combined, strange things would happen.
					XKit.window.show("Unable to turn on Shrink Posts", "Using the Shrink Posts option and Shorten Posts together creates a small mess that no one really wants to see. If you still want to use the Shrink Posts functionality of Enhanced Queue, disable the Shorten Posts extension first.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				}

				return false;
			});

			$("#xdeletequeue_button").click(function() {

				XKit.extensions.shuffle_queue.clear();

				return false;
			});

			var shrink_posts = XKit.storage.get("shuffle_queue", "shrink_posts", "false");
			if (shrink_posts === "true" || shrink_posts === true) {
				$("#xshrinkposts_button").trigger('click');
			}

			var hide_options = XKit.storage.get("shuffle_queue", "hide_options", "");
			if (hide_options === "true" || hide_options === true) {
				//$("#xqueueoptions_button").addClass("xkit-queue-option-button-on");
				$("#xqueueoptions_button").trigger('click');
			}

		}, 800);

	},

	posts_to_delete: [],
	delete_page: 0,
	posts_to_delete_count: 0,

	clear: function() {

		XKit.window.show("Clear Queue?","Delete all the posts in your queue?","question","<div class=\"xkit-button default\" id=\"xkit-clear-queue-confirm\">Yes</div>	<div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-clear-queue-confirm").click(function() {

			XKit.extensions.shuffle_queue.posts_to_delete = [];
			XKit.extensions.shuffle_queue.delete_page = 0;

			XKit.window.show("Please wait...","<span id=\"xkit-shuffle-queue-progress\">Please wait, gathering posts to delete...</span>" + XKit.progress.add("shuffle-queue-delete"),"info");

			XKit.extensions.shuffle_queue.clear_collect_next();

		});

	},

	clear_collect_next: function() {

		XKit.extensions.shuffle_queue.delete_page++;


		var m_url = XKit.interface.where().user_url;


		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/blog/" + m_url + "/queue?page=" + XKit.extensions.shuffle_queue.delete_page + "&xfetchid=" + XKit.tools.random_string() + XKit.tools.random_string(),
			json: false,
			headers: {
				"X-Requested-With": "XMLHttpRequest"
			},
			onerror: function(response) {
				XKit.window.show("Unable to clear queue","I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-200)","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			},
			onload: function(response) {

				if ($(".no_posts_found",response.responseText).length > 0) {

					XKit.extensions.shuffle_queue.posts_to_delete_count = XKit.extensions.shuffle_queue.posts_to_delete.length;
					XKit.extensions.shuffle_queue.clear_delete_next(); return;

				}

				var start_deleting = false;

				$(".post",response.responseText).each(function() {

					if (XKit.extensions.shuffle_queue.posts_to_delete.indexOf(parseInt($(this).attr('data-post-id'))) === -1) {

						XKit.extensions.shuffle_queue.posts_to_delete.push(parseInt($(this).attr('data-post-id')));

					} else {

						start_deleting = true;
						return false;

					}

				});

				$("#xkit-shuffle-queue-progress").html("Please wait, gathering posts to delete... (" + XKit.extensions.shuffle_queue.posts_to_delete.length + " so far..)");

				if (!start_deleting) {
					XKit.extensions.shuffle_queue.clear_collect_next();
				} else {
					XKit.extensions.shuffle_queue.posts_to_delete_count = XKit.extensions.shuffle_queue.posts_to_delete.length;
					XKit.extensions.shuffle_queue.clear_delete_next();
				}

			}
		});

	},

	clear_delete_next: function() {

		if (XKit.extensions.shuffle_queue.posts_to_delete.length === 0) {

			var sarcasm = "";

			if (XKit.extensions.shuffle_queue.posts_to_delete_count === 0) {
				sarcasm = "<br>But it's not like you had a lot of queued posts anyway.";
			}

			XKit.window.show("Cleared Queue.","Queue+ deleted " + XKit.extensions.shuffle_queue.posts_to_delete_count + " posts from your queue." + sarcasm,"info","<div class=\"xkit-button default\" id=\"xkit-queue-refresh\">Refresh the page</div>");

			$("#xkit-queue-refresh").click(function() {

				location.reload();

			});

			return;

		}

		var post_id = XKit.extensions.shuffle_queue.posts_to_delete.pop();

		var xin = XKit.extensions.shuffle_queue.posts_to_delete_count - XKit.extensions.shuffle_queue.posts_to_delete.length;

		var perc = ( xin * 100) / XKit.extensions.shuffle_queue.posts_to_delete_count;

		XKit.progress.value("shuffle-queue-delete", perc);

		$("#xkit-shuffle-queue-progress").html("Deleting posts, please wait.. (post " + xin + " of " + XKit.extensions.shuffle_queue.posts_to_delete_count + ")");

		var m_object = {};
		m_object.post_id = post_id;
		m_object.channel_id = XKit.interface.where().user_url;
		var form_key = XKit.interface.form_key();

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/delete",
			data: $.param(m_object),
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"x-tumblr-form-key": form_key,
			},
			onerror: function(response) {
				XKit.window.show("Unable to clear queue","I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-150)","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			},
			onload: function(response) {

				try {

					var m_obj = JSON.parse(response.responseText);

					if (m_obj.response.success === true) {
						XKit.extensions.shuffle_queue.clear_delete_next();
					}else {
						XKit.window.show("Unable to clear queue","I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-130)","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					}

				} catch(e) {
					XKit.window.show("Unable to clear queue","I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-100)","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				}

			}
		});

	},

	shuffle: function() {

		if ($("#xshufflequeue_button").hasClass("disabled") === true) {
			return;
		}

		var new_post_html = "";

		if ($("#new_post").length > 0) {
			new_post_html = $("#new_post").parent()[0].outerHTML;
		}

		$("#posts").html(XKit.extensions.shuffle_queue.shuffle_data($("#posts").children().not("#new_post_buttons").get()));
		$("#posts").prepend(new_post_html);
		$("#xshufflequeue_button").addClass("disabled");
		$("#xshufflequeue_button").find(".count").html("saving");

		var m_url = XKit.interface.where().user_url;

		var IDs = [];
		$("#posts").find(".post").not("#next_post").each(function(){
			if ($(this).attr('data-post-id') !== "" && typeof $(this).attr('data-post-id') !== "undefined") {
				IDs.push($(this).attr('data-post-id'));
			}
		});

		if (IDs.length <= 5) {

			console.log("Less than 5 posts, submitting!");
			XKit.extensions.shuffle_queue.submit_shuffle_data(IDs, false, m_url);

		} else{

			console.log("More than 5 posts, submitting part by part.!");
			XKit.extensions.shuffle_queue.submit_shuffle_data(IDs, true, m_url);

		}

		setTimeout(function() { $("#xshufflequeue_button").parent().removeClass("selected"); },10);

	},

	submit_shuffle_data: function(IDs, multi_mode, m_url) {

		var form_key = XKit.interface.form_key();

		multi_mode = false;

		if (multi_mode !== true) {

			var to_send_single = encodeURIComponent(IDs.join(","));

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/blog/" + m_url + "/order_post_queue/",
				data: "post_ids=" + to_send_single + "&form_key=" + form_key,
				json: false,
				onerror: function(response) {
					XKit.window.show("Unable to save queue","I was unable to save the current order of the queue.<br/>Please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					$("#xshufflequeue_button").find(".count").html("&nbsp;");
					$("#xshufflequeue_button").removeClass("disabled");
				},
				onload: function(response) {
					$("#xshufflequeue_button").find(".count").html("&nbsp;");
					$("#xshufflequeue_button").removeClass("disabled");
					if (response.status !== 200) {
						XKit.window.show("Unable to save queue","I was unable to save the current order of the queue.<br/>Please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					}

				}
			});

		} else {

			if (IDs.length === 0) {
				$("#xshufflequeue_button").find(".count").html("&nbsp;");
				$("#xshufflequeue_button").removeClass("disabled");
				return;
			}

			var temp_ids = [];
			for (var i=0;i<5;i++) {
				temp_ids.push(IDs.shift());
			}

			var to_send_multi = encodeURIComponent(temp_ids.join(","));

			console.log(" -- " + IDs.length + " items left...");

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/blog/" + m_url + "/order_post_queue/",
				data: "post_ids=" + to_send_multi + "&form_key=" + form_key,
				json: false,
				onerror: function(response) {
					XKit.window.show("Unable to save queue","I was unable to save the current order of the queue.<br/>Please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					$("#xshufflequeue_button").find(".count").html("&nbsp;");
					$("#xshufflequeue_button").removeClass("disabled");
				},
				onload: function(response) {

					if (response.status !== 200) {
						XKit.window.show("Unable to save queue","I was unable to save the current order of the queue.<br/>Please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
						$("#xshufflequeue_button").find(".count").html("&nbsp;");
						$("#xshufflequeue_button").removeClass("disabled");
					} else {
						XKit.extensions.shuffle_queue.submit_shuffle_data(IDs, true);
					}

				}
			});

		}

	},

	shuffle_data: function(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},

	destroy: function() {
		XKit.tools.remove_css("shuffle_queue");
		XKit.tools.remove_css("shuffle_queue_mini_posts");
		XKit.tools.remove_css("shuffle_queue_hide_options");
		$("#queue_plus_ul").remove();
		this.running = false;
	}

});
