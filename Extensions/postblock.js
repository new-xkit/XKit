//* TITLE PostBlock **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Block the posts you don't like **//
//* DETAILS This extension lets you blocks posts you don't like on your dashboard. When you block a post, it will be hidden completely, including reblogs of it.<br><br>Tip: hold down ALT to skip the blocking confirmation! **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.postblock = new Object({

	running: false,
	slow: true,
	blacklisted: [],
	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0U0NTdGNzMwMjA1MTFFM0IwRTREQUE2OUI0ODg5QzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0U0NTdGNzQwMjA1MTFFM0IwRTREQUE2OUI0ODg5QzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRTQ1N0Y3MTAyMDUxMUUzQjBFNERBQTY5QjQ4ODlDMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRTQ1N0Y3MjAyMDUxMUUzQjBFNERBQTY5QjQ4ODlDMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PumfPHEAAACvSURBVHjaYmDAD44C8Q4GCoAlEFtA2f+hmGzwFYg/YTFsNRAvINUwZAPQ2f/waWQi0SJGahoGAw1AXECJNwkCFhLDEq+3Qd50B+IWIOZDU6hDpCXzkTkfobYuQPPafxxexiYON/AsUrRbkGkY3MBSJIEzZBiGAkSA+BsOxYQMQ8GgCHhDTjbBB1SA+DelLkM2cAI1DeMF4rvUMgwEdIH4ObUMAwEJaNn1lVTDAAIMAPLOnUicW2nyAAAAAElFTkSuQmCC",

	run: function() {
		this.running = true;
		XKit.tools.init_css("postblock");

		this.blacklisted = XKit.storage.get("postblock", "posts", "").split(",");

		$(document).on('click', '.xpostblockbutton', function(e) {
			XKit.extensions.postblock.block($(this), e.altKey);
		});
		XKit.interface.create_control_button("xpostblockbutton", this.button_icon, "PostBlock", "");
		XKit.post_listener.add("postblock", XKit.extensions.postblock.process_posts);
		XKit.extensions.postblock.process_posts();
	},

	save: function() {
		XKit.storage.set("postblock", "posts", this.blacklisted.join(","));
	},

	remove: function($post, postID) {
		$post.parents(".post_container").remove();
		$post.remove();

		if (postID !== undefined) {
			$(`[data-root_id="${postID}"]`).each(function() {
				$(this).parents(".post_container").remove();
				$(this).remove();
			});
		}
	},

	block: function($button, altKey) {
		const $post = $button.parents(".post");
		const postID = $post.attr("data-root_id");

		if (altKey) {
			$post.fadeOut("slow", () => this.remove($post, postID));
			this.blacklisted.push(postID);
			this.save();
		} else {
			XKit.window.show(
				"Block this post?",
				"This post (including reblogs) will be blocked from your dashboard forever, " +
				"without any indication that it was blocked.",

				"question",

				'<div class="xkit-button default" id="xkit-post-block-ok">Block Post</div>' +
				'<div class="xkit-button" id="xkit-close-message">Cancel</div>'
			);

			$("#xkit-post-block-ok").click(() => {
				XKit.window.close();
				$post.fadeOut("slow", () => this.remove($post, postID));
				this.blacklisted.push(postID);
				this.save();
			});
		}
	},

	process_posts: function() {
		let blacklist = XKit.extensions.postblock.blacklisted;

		$(XKit.interface.get_posts("xpostblock-done"))
		.each(function() {
			const $post = $(this).addClass("xpostblock-done");
			if ($post.attr("data-root_id") == undefined) {
				return;
			}

			if (blacklist.includes($post.attr("data-root_id"))) {
				XKit.extensions.postblock.remove($post);
			} else {
				XKit.interface.add_control_button(this, "xpostblockbutton");
			}
		});
	},

	cpanel: function(m_div) {

		$(m_div).html("<div class=\"postblock-cp\">You have <b id=\"xkit-postblock-cp-count\">" + (XKit.extensions.postblock.blacklisted.length - 1) + "</b> blocked posts.<div style=\"padding-top: 5px; padding-bottom: 5px;\">" +
					"<div class=\"xkit-button\" id=\"postblock-undo-last\">Unblock last blocked post</div></div><small>You need to refresh the page in order for previously blocked posts to appear again.</small></div>");

		if ((XKit.extensions.postblock.blacklisted.length - 1) === 0) {
			$("#postblock-undo-last").addClass("disabled");
		}

		$("#postblock-undo-last").click(function() {

			if ($(this).hasClass("disabled")) { return; }

			XKit.extensions.postblock.blacklisted.pop();
			XKit.storage.set("postblock", "posts", XKit.extensions.postblock.blacklisted.join(","));

			$("#xkit-postblock-cp-count").html((XKit.extensions.postblock.blacklisted.length - 1));

			if ((XKit.extensions.postblock.blacklisted.length - 1) === 0) {
				$("#postblock-undo-last").addClass("disabled");
			}

		});

	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("postblock");
		XKit.tools.remove_css("postblock");
		$(document).off("click", ".xpostblockbutton");
		$(".xpostblockbutton").remove();
	}

});
