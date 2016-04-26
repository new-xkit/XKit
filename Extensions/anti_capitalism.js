//* TITLE Anti-Capitalism **//
//* VERSION 1.2.4 **//
//* DESCRIPTION	Removes sponsored posts, vendor buttons, and other nonsense that wants your money. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.anti_capitalism = new Object({

	running: false,

	preferences: {
	    "sep0": {
			text: "Options",
			type: "separator",
		},
		"vendor_buttons": {
			text: "Disable 'Buy' buttons on posts",
			default: false,
			value: false
		},
		"sponsored_posts": {
			text: "Remove sponsored posts",
			default: true,
			value: true
		},
		"sponsored_ads": {
			text: "Remove those terrible framed ads",
			default: true,
			value: true
		},
		"asktime": {
			text: "Hide the asktime banner at the top of the dashboard",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		if (XKit.extensions.anti_capitalism.preferences.vendor_buttons.value) {
	       XKit.tools.add_css(" .post .vendor_button {display: none;}", "anti_capitalism_vendor_buttons");
	    }

		if (XKit.extensions.anti_capitalism.preferences.sponsored_posts.value) {
			XKit.tools.add_css(" .post.sponsored_post {display:none}", "anti_capitalism_sponsored_posts");
		}

	    if (XKit.extensions.anti_capitalism.preferences.sponsored_ads.value) {
	        XKit.tools.add_css(" .remnant-unit-container, .yamplus-unit-container, .yam-plus-ad-container, .yam-plus-header, .video-ad-container, .video-ad, .standalone-ad-container {display: none;}", "anti_capitalism_sponsored_ads");
	    }

		if (XKit.extensions.anti_capitalism.preferences.asktime.value) {
			XKit.tools.add_css(" .notification.single_notification.alt.takeover-container { display: none; } ", "anti_capitalism_asktime");
		}
	},


	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("anti_capitalism_vendor_buttons");
        XKit.tools.remove_css("anti_capitalism_sponsored_ads");
		XKit.tools.remove_css("anti_capitalism_sponsored_posts");
		XKit.tools.remove_css("anti_capitalism_asktime");
	}

});
