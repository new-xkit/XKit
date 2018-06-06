//* TITLE Go-To-Dash **//
//* VERSION 1.3.0 **//
//* DESCRIPTION View a post from a blog on your dashboard or sidebar. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension adds a 'view' button on people's blogs that allows you to go back to that post on your dashboard or sidebar. Viewing on dashboard only works on the blogs you follow, and may fail if the post dates to before you followed them. **//
//* FRAME true **//
//* BETA false **//

XKit.extensions.go_to_dash = new Object({

	running: false,

	preferences: {
		"use_sidebar": {
			text: "View using sidebar instead of dashboard",
			default: false,
			value: false
		}
	},

	run: function() {
		"use strict";

		// Not in a blog post
		if (!XKit.page.blog_frame) {
			return;
		}

		var use_sidebar = XKit.extensions.go_to_dash.preferences.use_sidebar.value;
		// Not following the user and not using sidebar - won't work here
		if (!use_sidebar && XKit.iframe.unfollow_button().hasClass("hidden")) {
			return;
		}

		// Already inserted
		if ($("#xkit_gotodash").length > 0) {
			return;
		}

		XKit.tools.init_css("go_to_dash");

		var go_back_html;
		var post_id = XKit.iframe.single_post_id();

		var html_pieces = ['<a href="https://www.tumblr.com/', '" class="tx-icon-button" target="_top" ' +
			'id="xkit_gotodash" title="View on dashboard"><span class="button-label">View</span></a>'];
		if (use_sidebar) {
			var blog = XKit.iframe.get_tumblelog();
			go_back_html = html_pieces.join('dashboard/blog/' + blog + '/' + post_id);
		} else {
			var next_post_id = parseInt(post_id) + 1;
			go_back_html = html_pieces.join('dashboard/2/' + next_post_id);
		}
		// Remove the text from the dashboard button because otherwise the iframe
		// overflows
		XKit.iframe.hide_button(XKit.iframe.dashboard_button());

		var is_following = XKit.iframe.unfollow_button().length;
		var place = is_following ? XKit.iframe.dashboard_button() : XKit.iframe.delete_button();
		place.before(go_back_html);
		XKit.iframe.size_frame_to_fit();

		this.running = true;
	},

	destroy: function() {
		$("#xkit_gotodash").remove();
		XKit.tools.remove_css("go_to_dash");
		this.running = false;
	}

});
