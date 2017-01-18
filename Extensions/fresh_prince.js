//* TITLE Fresh Prince **//
//* VERSION 0.1.0 **//
//* DESCRIPTION Everything's flipped, turned upside down **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension flips everything on the dashboard. Don't expect Tumblr to function correctly whatsoever while this extension is installed. **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.fresh_prince = new Object({

	running: false,

	preferences: {
		fresh_song_of_bel_air: {
			text: "NOW THIS IS A STORY ALL ABOUT HOW MY LIFE",
			default: true,
			value: true
		},
		flavor: {
			text: "GOT FLIPPED TURNED UPSIDE DOWN",
			default: "/AVbQo3IOC_A",
			value: "/AVbQo3IOC_A",
			type: "combo",
			values: [
				"Original prince of Bel-Air", "/AVbQo3IOC_A",
				"Fresh prince of Neon Genesis", "/Zmd1FWen-nY",
				"Ace Attorney of Bel-Air", "/3xYGMizY0k0",
				"Fresh prince of Gerudo Valley", "/WnfNOZ83Fow",
				"Fresh prince of Lavender Town", "/f94ST14pWXE",
				"Fresh prince of Street Fighting", "/o0weWqVca1U",
				"Fresh prince of falling blocks", "/7TBPXyMHf7U"
			],
		},
		loop: {
			text: "NEVER STOP SPINNING",
			default: true,
			value: true
		},
		disable_rotate: {
			text: "Disable full experience",
			default: false,
			value: false
		}
	},
	
	remove_fastdash: function() {
		XKit.tools.add_function(function() {
			var onResize = Tumblr.fastDashboard.options.boundOnResize;
			var onScroll = Tumblr.fastDashboard.options.boundOnScroll;
			if (!onResize || !onScroll) {
				return;
			}
			Tumblr.fastDashboard.destroy();
			window.xkit_restore_fastdash = function() {
				Tumblr.fastDashboard.options.boundOnResize = onResize;
				Tumblr.fastDashboard.options.boundOnScroll = onScroll;
				Tumblr.Events.on("DOMEventor:flatscroll", onScroll);
				Tumblr.Events.on("DOMEventor:flatresize", onResize);
			};
		}, true);
	},

	restore_fastdash: function() {
		XKit.tools.add_function(function() {
			window.xkit_restore_fastdash();
		}, true);
	},

	run: function() {
		this.running = true;
		if (!XKit.extensions.fresh_prince.preferences.disable_rotate.value) {
			XKit.tools.add_css(".l-header-container, .l-container, .l-footer-container {" +
					"transform: rotate(180deg);" +
					"-webkit-transform: rotate(180deg);" +
				"}", "fresh_prince");
			this.remove_fastdash();
		}
		if (this.preferences.fresh_song_of_bel_air.value && $(".l-container").length > 0) {
			$("head").append('<div class="fresh_prince_video" style="width:1px;height:1px;overflow:hidden"><iframe width="300" height="300" src="https://www.youtube.com/embed' + XKit.extensions.fresh_prince.preferences.flavor.value + '?autoplay=1&amp;playlist=' + XKit.extensions.fresh_prince.preferences.flavor.value.substring(1) + '&amp;loop=' + ( XKit.extensions.fresh_prince.preferences.loop.value ? "1" : "0" ) + '" frameborder="0" allowfullscreen></iframe></div>');
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("fresh_prince");
		this.restore_fastdash();
		$(".fresh_prince_video").remove();
	}
});
