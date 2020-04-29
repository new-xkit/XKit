//* TITLE Video Downloader **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Adds a download button to the video player **//
//* DETAILS Adds a simple download button to all videos using the fancy player. Does not support 3rd-party players or the native player. Disabled on beta dash (now supported natively) **//
//* DEVELOPER tlitookilakin **//
//* FRAME false **//
//* BETA false **//
XKit.extensions.video_downloader = new Object({

	running: false,

	run: function() {
		this.running = true;
		if (!XKit.interface.is_tumblr_page() || XKit.page.react) {
			return;
		}
		XKit.tools.init_css("video_downloader");
		XKit.extensions.video_downloader.addButtons();
		XKit.post_listener.add("video_downloader", XKit.extensions.video_downloader.addButtons);
	},

	destroy: function() {
		XKit.post_listener.remove("video_downloader");
		this.running = false;
	},
	
	makeButton: function(url) {
		var el = document.createElement("a");
		var filename = url.split("/").pop();
		el.classList.add("xvd-button");
		el.setAttribute("href", url);
		el.setAttribute("target", "_blank");
		el.setAttribute("download", filename);
		el.innerText = "Download this video";
		return el;
	},
	
	addButtons: function() {
		setTimeout(function() {
			var vids = document.querySelectorAll(".crt-video:not(.xvd-processed)");
			for (var vid of vids) {
				vid.classList.add("xvd-processed");
				var sauce = vid.getElementsByTagName("source");
				if (sauce.length > 0) {
					var src = sauce[0].getAttribute("src");
					var button = XKit.extensions.video_downloader.makeButton(src);
					vid.appendChild(button);
				}
			}
		}, 1500);
	}
});
