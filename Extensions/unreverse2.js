//* TITLE Unreverse **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Places the post buttons on top **//
//* DETAILS This extension places the reblog/like/reply/etc buttons on the top of the post. It is unsupported, and might cause problems with your dashboard. Please use with caution. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.unreverse2 = new Object({

	running: false,

	run: function() {

		if (XKit.interface.where().inbox === true) { return; }

		this.running = true;
		XKit.tools.init_css("unreverse2");
		XKit.post_listener.add("unreverse2", XKit.extensions.unreverse2.do);
		XKit.extensions.unreverse2.do();

		if (XKit.storage.get("unreverse2", "shown_warning", "") !== "yas") {

			XKit.window.show("Unsupported extension", "<b>Unreverse is an unsupported extension, which might cause problems with your dashboard.</b><br><br>You can still use it, but no support will be provided if you use it. If you experience any problems such as popup menus not opening, please disable this extension before contacting XKit support.", "warning", "<div class=\"xkit-button default\" id=\"unreverse-warning-close-button\">OK</div>");

			$("#unreverse-warning-close-button").click(function() {
				XKit.storage.set("unreverse2", "shown_warning", "yas");
				XKit.window.close();
			});

		}

	},

	do: function() {

		$(".post.post_full").not(".unreverse-done").each(function() {
			$(this).addClass("unreverse-done");
			$(this).find(".post_source").clone().removeClass("post_source").addClass("unreverse_post_source").appendTo($(this).find(".post_footer"));
		});

	},

	do_reverse: function() {

		$(".unreverse_post_source").remove();

		$(".post.post_full.unreverse-done").each(function() {
			$(this).removeClass("unreverse-done");
		});

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("unreverse2");
		XKit.extensions.unreverse2.do_reverse();
		XKit.post_listener.remove("unreverse2");
	}

});