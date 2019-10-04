//* TITLE Enhanced Queue **//
//* VERSION 2.1.0 **//
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

		this.running = true;

		XKit.interface.sidebar.add({
			id: "queue_plus_sidebar",
			title: "Queue+",
			items: [
				{ id: "xshufflequeue_button", text: "Shuffle Queue" },
				{ id: "xdeletequeue_button", text: "Clear Queue" },
				{ id: "xshrinkposts_button", text: "Shrink Posts", count: "off" },
				{ id: "xqueueoptions_button", text: "Queue Options", count: "on" }
			]
		});

		$("#xshufflequeue_button").click(() => this.shuffle());
		$("#xdeletequeue_button").click(() => this.clear());
		$("#xshrinkposts_button").click(function() {
			if (XKit.installed.is_running("shorten_posts")) {
				XKit.window.show(
					"Unable to turn on Shrink Posts",
					"Using the Shrink Posts option and Shorten Posts together creates a small mess that no one really wants to see. " +
					"If you still want to use the Shrink Posts functionality of Enhanced Queue, disable the Shorten Posts extension first.",

					"error",

					'<div class="xkit-button default" id="xkit-close-message">OK</div>'
				);
			} else {
				let $button = $(this).toggleClass("xkit-queue-option-button-on");
				if ($button.hasClass("xkit-queue-option-button-on")) {
					$button.find(".count").html("on");
					XKit.storage.set("shuffle_queue", "shrink_posts", "true");
					XKit.tools.add_css(
						".post_header { display: none; }" +
						".post .post_content_inner, .post .post_media { height: 70px !important; overflow: hidden !important; }" +
						".post .post_content { pointer-events: none !important; height: 70px !important; overflow: hidden !important; border: 1px dashed rgb(200,200,200); }",

						"shuffle_queue_mini_posts"
					);
				} else {
					$button.find(".count").html("off");
					XKit.storage.set("shuffle_queue", "shrink_posts", "false");
					XKit.tools.remove_css("shuffle_queue_mini_posts");
				}
			}
		});
		$("#xqueueoptions_button").click(function() {
			let $button = $(this).toggleClass("xkit-queue-option-button-on");

			if ($button.hasClass("xkit-queue-option-button-on")) {
				$button.find(".count").html("off");
				XKit.storage.set("shuffle_queue", "hide_options", "true");
				XKit.tools.add_css(" .dashboard_options_form { display: none; }", "shuffle_queue_hide_options");
			} else {
				$button.find(".count").html("on");
				XKit.storage.set("shuffle_queue", "hide_options", "false");
				XKit.tools.remove_css("shuffle_queue_hide_options");
			}
		});

		var shrink_posts = XKit.storage.get("shuffle_queue", "shrink_posts", "false");
		if (shrink_posts === "true" || shrink_posts === true) {
			$("#xshrinkposts_button").click();
		}

		var hide_options = XKit.storage.get("shuffle_queue", "hide_options", "false");
		if (hide_options === "true" || hide_options === true) {
			$("#xqueueoptions_button").click();
		}

	},

	shuffle: function() {

		XKit.window.show(
			"Shuffle Queue",
			"Would you like to shuffle your queue?<br>" +
			"Please note that only loaded posts can be shuffled. " +
			"To shuffle your entire queue, scroll down until your whole queue is loaded.",

			"question",

			'<div id="xshufflequeue_confirm" class="xkit-button default">Shuffle!</div>' +
			'<div id="xkit-close-message" class="xkit-button">Cancel</div>'
		);

		$("#xshufflequeue_confirm").click(() => {
			if ($("#xshufflequeue_confirm").hasClass("disabled")) {
				return;
			}

			$("#xshufflequeue_confirm")
				.addClass("disabled")
				.text("Shuffling...");

			let postIDs = [];
			$("#posts [data-pageable]").each(function() {
				let [ /* "post" */, postID] = $(this).attr("data-pageable").split("_");
				postIDs.push(postID);
			});

			// https://stackoverflow.com/a/12646864
			for (let i = postIDs.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[postIDs[i], postIDs[j]] = [postIDs[j], postIDs[i]];
			}

			let blogname = XKit.interface.where().user_url;

			XKit.tools.Nx_XHR({
				method: "POST",
				url: `https://www.tumblr.com/blog/${blogname}/order_post_queue`,
				headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
				data: $.param({
					"form_key": XKit.interface.form_key(),
					"post_ids": postIDs.join(",")
				}),
				onload: response => {
					XKit.window.show(
						"Queue shuffled!",
						`All done! Shuffled ${postIDs.length} posts. Please refresh the page to see the result.`,

						"info",

						'<div id="xshufflequeue_done" class="xkit-button default">Okay!</div>'
					);
					$("#xshufflequeue_done").click(() => location.reload(true));
				},
				onerror: response => {
					XKit.window.show(
						"Unable to save queue.",
						"Something went wrong. Please try again later.",

						"error",

						'<div id="xkit-close-message" class="xkit-button default">OK</div>'
					);
				}
			});
		});
	},

	posts_to_delete: [],
	delete_page: 0,
	posts_to_delete_count: 0,

	clear: function() {

		XKit.window.show("Clear Queue?", "Delete all the posts in your queue?", "question", "<div class=\"xkit-button default\" id=\"xkit-clear-queue-confirm\">Yes</div>	<div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-clear-queue-confirm").click(function() {

			XKit.extensions.shuffle_queue.posts_to_delete = [];
			XKit.extensions.shuffle_queue.delete_page = 0;

			XKit.window.show("Please wait...", "<span id=\"xkit-shuffle-queue-progress\">Please wait, gathering posts to delete...</span>" + XKit.progress.add("shuffle-queue-delete"), "info");

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
				XKit.window.show("Unable to clear queue", "I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-200)", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			},
			onload: function(response) {

				if ($(".no_posts_found", response.responseText).length > 0) {

					XKit.extensions.shuffle_queue.posts_to_delete_count = XKit.extensions.shuffle_queue.posts_to_delete.length;
					XKit.extensions.shuffle_queue.clear_delete_next(); return;

				}

				var start_deleting = false;

				$(".post", response.responseText).each(function() {

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

			XKit.window.show("Cleared Queue.", "Queue+ deleted " + XKit.extensions.shuffle_queue.posts_to_delete_count + " posts from your queue." + sarcasm, "info", "<div class=\"xkit-button default\" id=\"xkit-queue-refresh\">Refresh the page</div>");

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
				XKit.window.show("Unable to clear queue", "I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-150)", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			},
			onload: function(response) {

				try {

					var m_obj = JSON.parse(response.responseText);

					if (m_obj.response.success === true) {
						XKit.extensions.shuffle_queue.clear_delete_next();
					} else {
						XKit.window.show("Unable to clear queue", "I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-130)", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					}

				} catch (e) {
					XKit.window.show("Unable to clear queue", "I was unable to clear your queue.<br/>Please try again later. (Error Code: SQD-100)", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				}

			}
		});

	},

	destroy: function() {
		XKit.tools.remove_css("shuffle_queue_mini_posts");
		XKit.tools.remove_css("shuffle_queue_hide_options");
		XKit.interface.sidebar.remove("queue_plus_sidebar");
		this.running = false;
	}

});
