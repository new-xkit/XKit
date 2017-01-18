//* TITLE PostBlock **//
//* VERSION 0.2.5 **//
//* DESCRIPTION Block the posts you don't like **//
//* DETAILS This is an experimental extension that blocks posts you don't like on your dashboard. When you block a post, it will be hidden completely, including reblogs of it. **//
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

		if (XKit.interface.where().inbox === true) {
			return;
		}

		XKit.tools.add_css(".postblock-cp { text-align: center; padding-top: 48px; } .postblock-cp small { color: rgb(128,128,128); }", "xkit-postblock-cp");

		var m_blacklist = XKit.storage.get("postblock", "posts", "").split(",");
		if (m_blacklist !== "") {
			this.blacklisted = m_blacklist;
		}

		console.log("total of " + this.blacklisted.length + " posts blocked");

		if ($("#posts").length > 0) {
			$(document).on('click', '.xpostblockbutton', XKit.extensions.postblock.on_click);
			XKit.interface.create_control_button("xpostblockbutton", this.button_icon, "PostBlock", "");
			XKit.post_listener.add("postblock", XKit.extensions.postblock.do);
			XKit.extensions.postblock.do();
		}
	},

	on_click: function(e) {

		var obj = e.target || e.srcElement;
		var parent = $(obj).parentsUntil("#search_posts, #posts");

		if (e.altKey) {
			$(parent).fadeOut('slow', function() {
				$(parent).remove();
				XKit.extensions.postblock.call_tumblr_resize();
			});
			if (XKit.extensions.postblock.blacklisted.indexOf($(obj).attr('data-root_id')) === -1) {
				XKit.extensions.postblock.blacklisted.push($(obj).attr('data-root_id'));
				XKit.storage.set("postblock", "posts", XKit.extensions.postblock.blacklisted.join(","));
			}
			return;
		}

		XKit.window.show("Block this post?", "This post (including reblogs) will be blocked from your dashboard forever, without any indication that it was blocked.", "question", "<div class=\"xkit-button default\" id=\"xkit-post-block-ok\">Block Post</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-post-block-ok").click(function() {

			XKit.window.close();
			$(parent).fadeOut('slow', function() {
				$(parent).remove();
				XKit.extensions.postblock.call_tumblr_resize();
			});
			if (XKit.extensions.postblock.blacklisted.indexOf($(obj).attr('data-root_id')) === -1) {
				XKit.extensions.postblock.blacklisted.push($(obj).attr('data-root_id'));
				XKit.storage.set("postblock", "posts", XKit.extensions.postblock.blacklisted.join(","));
			}

		});


	},

	call_tumblr_resize: function() {

		XKit.extensions.postblock.do();

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	do: function() {

		var size_changed = false;

		var posts = XKit.interface.get_posts("xpostblocked");

		$(posts).each(function() {

			$(this).addClass("xpostblocked");

			var m_post = XKit.interface.post($(this));
			if (m_post.is_mine === true) { return; }

			if (XKit.extensions.postblock.blacklisted.indexOf(m_post.root_id) !== -1) {
				$(this).parent().remove();
				size_changed = true;
				return;
			}

			var this_id = m_post.root_id;
			XKit.interface.add_control_button(this, "xpostblockbutton", "data-root_id=\"" + this_id + "\"");

		});

		if (size_changed) {

			XKit.extensions.postblock.call_tumblr_resize();

		}
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
		$(".xpostblockbutton").remove();
	}

});
