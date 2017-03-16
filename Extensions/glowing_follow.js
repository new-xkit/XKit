//* TITLE Glowing Follow **//
//* VERSION 1.0.7 **//
//* DESCRIPTION Glowing plusses on non-mutual followers' blogs **//
//* DETAILS Makes the Follow button on people's blogs glow if they are following you and you are not following them. Before proceeding, please keep in mind that sometimes, ignorance is bliss. **//
//* DEVELOPER new-xkit **//
//* FRAME true **//
//* BETA false **//

XKit.extensions.glowing_follow = new Object({

	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("glowing_follow");

		var follow_button = XKit.iframe.follow_button();

		if (follow_button.length > 0) {
			// We got the follow button!

			// Are we already following this person?
			if (follow_button.hasClass("hidden") === true) {
				// Yeah. No need for this.
				return;
			}

			var username = XKit.iframe.get_tumblelog();

			var blog_id = "";
			var m_blogs = XKit.tools.get_blogs();
			for (var i = 0; i < m_blogs.length; i++) {
				if (m_blogs[i] !== "") {
					blog_id = m_blogs[i];
					break;
				}
			}

			if (blog_id === "") {
				return;
			}

			XKit.interface.is_following(username, blog_id).then(function(follow) {
				if (follow) {
					follow_button.addClass("xglow");
				}
			});

		}

	},

	destroy: function() {
		this.running = false;
	}

});
