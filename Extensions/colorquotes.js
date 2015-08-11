//* TITLE Color Quotes **//
//* VERSION 1.0.4 **//
//* DESCRIPTION Colored quotes for the dash **//
//* DETAILS Know those lines that appear when you reblog someone, when Tumblr quotes them? Sometimes, when a lot of people talk on the same post, it might be hard to keep track of those. This extension changes the color of each line (or their background, depending on your preferences) so you can read and differentiate them faster. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.colorquotes = new Object({

	running: false,

	preferences: {
		"sep-0": {
			text: "When to run Color Quotes",
			type: "separator"
		},
		"dont_fade_if_less_than_two": {
			text: "Don't color the block quotes if there is only one",
			default: true,
			value: true
		},
		"sep-1": {
			text: "Appearance",
			type: "separator"
		},
		theme: {
			text: "Color Theme",
			default: "default",
			value: "default",
			type: "combo",
			values: [
				"Default Rainbow", "default",
				"Pastel Rainbow", "pastel",
				"Tumblr Blue", "blue",
				"Grayscale", "grayscale",
				"Pink and Red", "pink",
				"Red and Gray", "rag",
			],
		},
		"do_backgrounds": {
			text: "Use a faded color on block quote backgrounds too",
			default: false,
			value: false
		},
		"increase_padding": {
			text: "Increase padding for easier reading",
			default: false,
			value: false
		}
	},

	colors: ["ff1900","ff9000","ffd000","6adc13","00cd8b","00a5e7","001999","cc00b9","ff78e1"],

	run: function() {
		this.running = true;

		if (XKit.extensions.colorquotes.preferences.theme.value === "pastel") {
			this.colors = ["e45c5c","ffcc66","d7e972","76e2c2","5dc6cd","be7ce4","e45c5c","ffcc66","d7e972"];
		}

		if (XKit.extensions.colorquotes.preferences.theme.value === "blue") {
			this.colors = ["36536e","536c83","6a8094","798c9f","36536e","536c83","6a8094","798c9f","36536e"];
		}

		if (XKit.extensions.colorquotes.preferences.theme.value === "grayscale") {
			this.colors = ["b2b2b2","969696","6b6b6b","3d3d3d","d3d0d0","b2b2b2","969696","6b6b6b","3d3d3d"];
		}

		if (XKit.extensions.colorquotes.preferences.theme.value === "pink") {
			this.colors = ["c53b3c","f09dd8","c53b3c","f09dd8","c53b3c","f09dd8","c53b3c","f09dd8"];
		}

		if (XKit.extensions.colorquotes.preferences.theme.value === "rag") {
			this.colors = ["e24545","acacac","e24545","acacac","e24545","acacac","e24545","acacac"];
		}

		if (XKit.extensions.colorquotes.preferences.increase_padding.value) {
			XKit.tools.add_css("#posts .post_content blockquote { padding-top: 8px; padding-bottom: 8px; }", "colorquotes_padding");
		}



		if ($("#posts").length > 0) {
			XKit.tools.init_css("colorquotes");
			XKit.post_listener.add("colorquotes", XKit.extensions.colorquotes.do);
			XKit.extensions.colorquotes.do();
		}

	},

	do: function() {

		var posts = XKit.interface.get_posts("xkit-color-quoted");

		$(posts).each(function() {

			$(this).addClass("xkit-color-quoted");

			var m_post = XKit.interface.post($(this));

			var count = 0;

			if (XKit.extensions.colorquotes.preferences.dont_fade_if_less_than_two.value) {
				if ($(this).find("blockquote").length === 1) { return; }
			}

			$(this).find("blockquote").each(function() {

				if (count >= XKit.extensions.colorquotes.colors.length) { count = 0; }

				var m_color = XKit.extensions.colorquotes.hex_to_rgb(XKit.extensions.colorquotes.colors[count]);

				$(this).css("border-left-color", "#" + XKit.extensions.colorquotes.colors[count]);
				$(this).attr('xkit-border-color', JSON.stringify(m_color));
				$(this).addClass("xkit-colorquotes-border-item");

				if (XKit.extensions.colorquotes.preferences.do_backgrounds.value) {
					$(this).css("background", "rgba(" + m_color.r + "," + m_color.g + "," + m_color.b + ",0.1)");
				}

				count++;

			});


		});

	},

	hex_to_rgb: function(hex) {

		// From: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;

	},

	destroy: function() {
		$(".xkit-color-quoted").removeClass("xkit-color-quoted");
		XKit.tools.remove_css("colorquotes_padding");
		$(".xkit-colorquotes-border-item").css("background","").css("border-left-color","");
		this.running = false;
	}

});
