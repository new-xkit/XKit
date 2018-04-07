//* TITLE Old Stats **//
//* VERSION 0.4.2 **//
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
				$(".recommended_tumblelogs").before($("#dashboard_controls_open_blog", response.responseText).css("margin", "0 0 18px"));
				$("#dashboard_controls_open_blog [data-sparkline]").prepend('<canvas id="old_stats_canvas" width="72" height="30" style="display: inline-block; width: 36px; height: 15px; vertical-align: top;">');
				var sparkline = JSON.parse($("#dashboard_controls_open_blog [data-sparkline]").attr("data-sparkline"));
				var sparkmin = Math.min.apply(Math, sparkline);
				var sparkpx = (Math.max.apply(Math, sparkline) - sparkmin) / 30;
				var canvas = document.getElementById("old_stats_canvas").getContext("2d");
				canvas.strokeStyle = "#FFFFFF";
				canvas.lineWidth = 3.5;
				canvas.moveTo(0, 30 - ((sparkline[0] - sparkmin) / sparkpx));
				for (var i = 1; i < sparkline.length; i++) {
					canvas.lineTo(i * (72 / sparkline.length), 30 - ((sparkline[i] - sparkmin) / sparkpx));
					canvas.stroke();
				}
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
