//* TITLE Old Stats **//
//* VERSION 0.4.0 **//
//* DESCRIPTION Blog stats where they were **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_stats = new Object({

	running: false,
	done: false,

	preferences: {
		"iconify": {
			text: "Put the icons back on posts/followers/etc links",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;
		if (this.preferences.iconify.value) {
			XKit.tools.init_css("old_stats");
		}
		if ($("#dashboard_controls_open_blog").length) {
			return;
		}
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.tumblr.com/likes",
			onerror: function(response) {
				console.log("old_stats: Couldn't fetch blog info.");
			},
			onload: function(response) {
				$(".recommended_tumblelogs").before($("#dashboard_controls_open_blog", response.responseText));
				$("#dashboard_controls_open_blog").css("margin", "0 0 18px");
				XKit.extensions.old_stats.done = true;
			}
		});
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_stats");
		if (this.done) {
			$("#dashboard_controls_open_blog").remove();
		}
	}
});
