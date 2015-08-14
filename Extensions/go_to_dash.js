//* TITLE Go-To-Dash **//
//* VERSION 1.1.2 **//
//* DESCRIPTION View a post on a blog on your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension adds a 'view' button on peoples blogs that allows you to go back to that post on your dashboard. This feature only works on the blogs you follow. If the post was made before you followed them, you might not see them on your dashboard when you click the view button. **//
//* FRAME true **//
//* BETA false **//

XKit.extensions.go_to_dash = new Object({

	running: false,

	run: function() {
		// Not in a blog post
		if (!XKit.page.blog_frame) {
			return;
		}

		// Not following the user
		if ($(".btn.unfollow").hasClass("hidden")) {
			return;
		}

		// Already inserted
		if ($("#xkit_gotodash").length > 0) {
			return;
		}

		var post_id_match = document.location.href.match(/&pid=(\d+)/);
		if (!post_id_match) {
			return;
		}
		var post_id = post_id_match[1];

		post_id = parseInt(post_id) + 1;

		var go_back_html = '<a href="/dashboard/2/' + post_id + '" class="btn" target="_top" id="xkit_gotodash" title="View on dashboard">View</a>';

		// Remove the text from the dashboard button because otherwise the iframe
		// overflows
		$(".dashboard").text("");

		if ($(".controls").find(".unfollow").length > 0) {
			$(".controls").find(".unfollow").before(go_back_html);
		} else {
			$(".controls").find(".delete").before(go_back_html);
		}

		this.running = true;
	},

	destroy: function() {
		var link = $("#xkit_gotodash");
		if (link.length > 0) {
			link.remove();
		}
		this.running = false;
	}

});
