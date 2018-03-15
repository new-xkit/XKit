//* TITLE Old Stats **//
//* VERSION 0.3.0 **//
//* DESCRIPTION Blog stats where they were **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_stats = new Object({

	running: false,
	done: false,

	run: function() {
		this.running = true;
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
		if (this.done) {
			$("#dashboard_controls_open_blog").remove();
		}
	}
});
