//* TITLE Go-To-Dash **//
//* VERSION 1.2.1 **//
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
		if (XKit.iframe.unfollow_button().hasClass("hidden")) {
			return;
		}

		// Already inserted
		if ($("#xkit_gotodash").length > 0) {
			return;
		}

		var post_id = XKit.iframe.single_post_id();
		var next_post_id = parseInt(post_id) + 1;

		// The CSS class 'embed-button' uses Tumblr's CSS to add padding
		// to the button itself.
		var go_back_html = '<a href="/dashboard/2/' + next_post_id + '" class="tx-button btn embed-button" target="_top" ' +
			'id="xkit_gotodash" title="View on dashboard"><span class="button-label">View</span></a>';

		// Remove the text from the dashboard button because otherwise the iframe
		// overflows
		XKit.iframe.hide_button(XKit.iframe.dashboard_button());

		var place = XKit.iframe.unfollow_button().length ?
			XKit.iframe.unfollow_button() : XKit.iframe.delete_button();
		place.before(go_back_html);

		this.running = true;
	},

	destroy: function() {
		$("#xkit_gotodash").remove();
		this.running = false;
	}

});
