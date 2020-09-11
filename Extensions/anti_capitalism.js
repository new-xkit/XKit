//* TITLE Anti-Capitalism **//
//* VERSION 1.6.4 **//
//* DESCRIPTION Removes sponsored posts, vendor buttons, and other nonsense that wants your money. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.anti_capitalism = new Object({

	running: false,
	selector: "",
	listTimelineObjectInnerCss: "",

	preferences: {
		"sep0": {
			text: "Options",
			type: "separator",
		},
		"sponsored_posts": {
			text: "Remove sponsored posts",
			default: true,
			value: true
		},
		"sidebar_ad": {
			text: "Hide the Sidebar Ads",
			default: true,
			value: true
		},
		"sep1": {
			text: "Legacy Options",
			type: "separator",
		},
		"video_ad": {
			text: "Terminate with extreme prejudice the auto-playing audio sidebar ads",
			default: true,
			value: true
		},
		"sponsored_ads": {
			text: "Remove those terrible framed ads",
			default: true,
			value: true
		},
		"vendor_buttons": {
			text: "Disable 'Buy' buttons on posts",
			default: false,
			value: false
		},
		"yahoo_view": {
			text: "Hide the Yahoo View links on posts",
			default: false,
			value: false
		},
		"asktime": {
			text: "Hide the asktime banner at the top of the dashboard",
			default: false,
			value: false
		}
	},

	run: async function() {
		this.running = true;

		if (XKit.page.react) {
			await XKit.css_map.getCssMap();

			if (this.preferences.sponsored_posts.value) {
				var selectorArray = XKit.css_map.keyToClasses("sponsoredContainer");
				selectorArray.push(XKit.css_map.keyToClasses("headerSponsored"));
				selectorArray.push(XKit.css_map.keyToClasses("sponsoredIndicator"));

				this.selector = selectorArray
					.map(cls => `.${cls}:not(.anti-capitalism-done)`)
					.join(', ');
				this.listTimelineObjectInnerCss = XKit.css_map.keyToCss('listTimelineObjectInner');
				XKit.interface.hide(".anti-capitalism-hidden", "anti_capitalism");
				XKit.tools.add_css(`
					.anti-capitalism-hidden {
						outline: 1px solid red;
					}
				`, 'anti_capitalism');
				XKit.post_listener.add("mutualchecker", this.process_posts);
				this.process_posts();
			}

			if (this.preferences.sidebar_ad.value) {
				const selector = XKit.css_map.keyToCss("mrecContainer");
				XKit.interface.hide(selector, "anti_capitalism");
			}

			return;
		}

		if (XKit.extensions.anti_capitalism.preferences.vendor_buttons.value) {
			XKit.tools.add_css(" .post .vendor_button {display: none;}", "anti_capitalism");
		}

		if (XKit.extensions.anti_capitalism.preferences.sponsored_posts.value) {
			XKit.tools.add_css(" .post.sponsored_post {display:none}", "anti_capitalism");
		}

		if (XKit.extensions.anti_capitalism.preferences.sponsored_ads.value) {
			XKit.tools.add_css(" .remnant-unit-container, .yamplus-unit-container, .yam-plus-ad-container, .yam-plus-header, .video-ad-container, .video-ad, .standalone-ad-container, .dfp-ad-container {display: none;}", "anti_capitalism");
		}

		if (XKit.extensions.anti_capitalism.preferences.asktime.value) {
			XKit.tools.add_css(" .notification.single_notification.alt.takeover-container { display: none; } ", "anti_capitalism");
		}

		if (XKit.extensions.anti_capitalism.preferences.yahoo_view.value) {
			XKit.tools.add_css(' .recommendation-reason-link[href*="//view.yahoo.com"], .recommendation-reason-link[href*="%2F%2Fview.yahoo.com"] { display: none; } ', "anti_capitalism");
		}

		if (XKit.extensions.anti_capitalism.preferences.sidebar_ad.value) {
			XKit.tools.add_css(' .sidebar-ad { display: none; } ', "anti_capitalism");
		}

		if (this.preferences.video_ad.value) {
			this.interval_id = setInterval(function() {
				var players = $(".sidebar-ad-content iframe, .sponsored_post iframe, .sponsored_post video, .standalone-ad-container video");
				// Pause + remove src of video tags to prevent audio from persisting after DOM removal
				var videos = players.filter("video");
				if (videos.length) {
					videos.trigger("pause");
					videos.attr("src", "");
				}
				if (players.length) {
					players.remove();
				}
			}, 400);
		}
	},

	process_posts: async function() {
		const {selector, listTimelineObjectInnerCss} = XKit.extensions.anti_capitalism;
		const $containers = $(selector).addClass("anti-capitalism-done");
		for (let container of $containers.get()) {
			$(container).closest(listTimelineObjectInnerCss).parent()
				.addClass('anti-capitalism-hidden');
		}
	},

	destroy: function() {
		this.running = false;
		$('anti-capitalism-done').removeClass('anti-capitalism-done');
		$('anti-capitalism-hidden').removeClass('anti-capitalism-hidden');
		XKit.tools.remove_css("anti_capitalism");
		XKit.post_listener.remove("mutualchecker", this.process_posts);
		clearInterval(this.interval_id);
	}

});
