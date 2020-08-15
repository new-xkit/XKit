//* TITLE Enhanced Queue **//
//* VERSION 2.2.1 **//
//* DESCRIPTION Additions to the Queue page. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS Go to your queue and click on the Shuffle button on the sidebar to shuffle the posts. Note that only the posts you see will be shuffled. If you have more than 15 posts on your queue, scroll down and load more posts in order to shuffle them too. Or click on Shrink Posts button to quickly rearrange them. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.shuffle_queue = new Object({

	running: false,

	queueoptions_selector: ".dashboard_options_form",

	run: async function() {

		if (!XKit.interface.where().queue) {
			return;
		}

		this.running = true;

		if (XKit.page.react) {
			await XKit.interface.react.sidebar.add({
				id: "queue_plus_sidebar",
				title: "Queue+",
				items: [
					{ id: "xshufflequeue_button", text: "Shuffle Queue" },
					{ id: "xdeletequeue_button", text: "Clear Queue" },
					{ id: "xshrinkposts_button", text: "Shrink Posts", count: "off" },
					{ id: "xqueueoptions_button", text: "Show Queue Options", count: "on" }
				]
			});
			await XKit.css_map.getCssMap();
			this.queueoptions_selector = XKit.css_map.keyToCss('queueSettings');
		} else {
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
		}

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
				XKit.tools.add_css(`${XKit.extensions.shuffle_queue.queueoptions_selector} { display: none; }`, "shuffle_queue_hide_options");
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

			if (XKit.page.react) {
				$("[data-id]").each(function() {
					let postID = $(this).attr("data-id");
					postIDs.push(postID);
				});
			} else {
				$("#posts [data-pageable]").each(function() {
					let [ /* "post" */, postID] = $(this).attr("data-pageable").split("_");
					postIDs.push(postID);
				});
			}

			if (postIDs.length === 0) {
				XKit.window.close();
				XKit.notifications.add("Didn't find any posts to shuffle!", "error");
				return;
			}

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
					this.update_shuffled_order(postIDs);
					XKit.window.close();
					XKit.notifications.add(`Shuffled ${postIDs.length} posts!`, "ok");
				},
				onerror: response => {
					XKit.window.show(
						"Unable to save queue.",
						`Something went wrong: HTTP ${response.status}. Please try again later.`,

						"error",

						'<div id="xkit-close-message" class="xkit-button default">OK</div>'
					);
				}
			});
		});
	},

	update_shuffled_order: function(postIDs) {
		if (XKit.page.react) {
			postIDs.reverse().forEach(postID => {
				$(".sortableContainer").prepend($(`[data-id="${postID}"]`));
			});
		} else {
			postIDs.reverse().forEach(postID => {
				$("#new_post_buttons").after($(`[data-pageable="post_${postID}"]`));
			});
		}
	},

	posts_to_delete: [],
	posts_to_delete_count: 0,

	clear: function() {

		XKit.window.show(
			"Clear Queue?",
			"Delete all the posts in your queue?",

			"question",

			'<div class="xkit-button default" id="xkit-clear-queue-confirm">Yes</div>' +
			'<div class="xkit-button" id="xkit-close-message">Cancel</div>'
		);

		$("#xkit-clear-queue-confirm").click(() => {

			XKit.window.show(
				"Please wait...",

				'<span id="xkit-shuffle-queue-progress">Please wait, gathering posts to delete...</span>' +
				XKit.progress.add("shuffle-queue-delete"),

				"info"
			);

			this.posts_to_delete = [];
			this.posts_to_delete_count = 0;
			this.clear_collect_next();
		});

	},

	clear_collect_next: function(page = 1) {
		const username = XKit.interface.where().user_url;

		XKit.tools.Nx_XHR({
			method: "GET",
			url: `https://www.tumblr.com/blog/${username}/queue?page=${page}`
		}).then(response => {
			if ($(".no_posts_found", response.responseText).length) {
				$("#xkit-shuffle-queue-progress")
					.text(`Mass-deleting ${this.posts_to_delete.length} posts...`);
				this.posts_to_delete_count = this.posts_to_delete.length;
				this.clear_delete_next();
				return;
			}

			$("#posts .post", response.responseText).each((i, post) => {
				const $post = $(post);
				const post_id = $post.attr("data-post-id");
				this.posts_to_delete.push(post_id);
			});

			$("#xkit-shuffle-queue-progress")
				.text(`Please wait, gathering posts to delete... (${this.posts_to_delete.length} so far...)`);

			this.clear_collect_next(page + 1);
		}).catch(response =>
			this.clear_error("Couldn't gather posts to delete.", response.status)
		);
	},

	clear_delete_next: function() {
		if (this.posts_to_delete.length === 0) {
			this.clear_done();
			return;
		}

		XKit.interface.mass_edit(this.posts_to_delete.splice(0, 100), {"mode": "delete"})
		.then(() => {
			const done = this.posts_to_delete_count - this.posts_to_delete.length;
			const percent = Math.round((done * 100) / this.posts_to_delete_count);
			XKit.progress.value("shuffle-queue-delete", percent);

			this.clear_delete_next();
		}).catch(response =>
			this.clear_error("Couldn't mass-delete posts.", response.status)
		);
	},

	clear_done: function() {
		XKit.window.show(
			"Done!",

			`Queue+ deleted ${this.posts_to_delete_count} posts from your queue.`,

			"info",

			'<div id="xkit-queue-refresh" class="xkit-button default">Refresh</div>'
		);

		$("#xkit-queue-refresh").click(() => location.reload(true));
	},

	clear_error: (message, status) => XKit.window.show(
			"Unable to clear queue.",

			`${message}<br>
			The server responded with HTTP ${status}.<br>
			Please try again later, or file a bug report if this keeps occurring.`,

			"error",

			'<div class="xkit-button default" id="xkit-close-message">OK</div>' +
			'<a href="https://new-xkit-support.tumblr.com/" target="_blank" class="xkit-button">New XKit support</a>'
	),

	destroy: function() {
		XKit.tools.remove_css("shuffle_queue_mini_posts");
		XKit.tools.remove_css("shuffle_queue_hide_options");
		XKit.interface.sidebar.remove("queue_plus_sidebar");
		this.running = false;
	}

});
