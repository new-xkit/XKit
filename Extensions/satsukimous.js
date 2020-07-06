//* TITLE Satsukimous **//
//* VERSION 1.2.4 **//
//* DESCRIPTION Customize how anons appear **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension is a prime example of what happens when you let JavaScript developers stay up past midnight.**//
//* FRAME false **//
//* BETA false **//

XKit.extensions.satsukimous = new Object({

	running: false,

	preferences: {
		"sep-0": {
			text: "Icon Replacement",
			type: "separator"
		},
		"replacement": {
			text: "Replacement Avatar",
			default: "https://31.media.tumblr.com/avatar_0bc380bccba7_128.png",
			value: "https://31.media.tumblr.com/avatar_0bc380bccba7_128.png",
			type: "combo",
			values: [
				"Satsuki Kiryūin", "https://31.media.tumblr.com/avatar_0bc380bccba7_128.png",
				"Ryūko Matoi", "http://38.media.tumblr.com/avatar_2e71003ae267_128.png",
				"Mako Mankanshoku", "https://33.media.tumblr.com/avatar_759f9349bfc2_128.png",
				"Anonymous", "https://secure.assets.tumblr.com/images/anonymous_avatar_128.gif",
				"Custom Image", "custom",
			],
		},
		"custom_replacement": {
			text: "Custom Image URL",
			type: "text",
			default: "",
			value: ""
		},
		"sep-1": {
			text: "Name Replacement",
			type: "separator"
		},
		"replace_name": {
			text: "Replace Name",
			default: true,
			value: true
		},
		"name_replacement": {
			text: "Replacement Name",
			type: "text",
			default: "Anonymous",
			value: "Anonymous"
		},
		"sep-2": {
			text: "Other Options",
			type: "separator"
		},
		"play_scream": {
			text: "matoi RYUKOOOOOO",
			default: true,
			value: true
		}
	},

	satsuki: function() {
		var replacement = XKit.extensions.satsukimous.preferences.replacement.value;

		if (replacement === "custom") {
			replacement = XKit.extensions.satsukimous.preferences.custom_replacement.value;
		}

		var custom_name = XKit.extensions.satsukimous.preferences.replace_name.value &&
			XKit.extensions.satsukimous.preferences.name_replacement.value;

		$("img")
			.filter(function(index) {
				return $(this).attr("src").match("anonymous_avatar");
			})
			.attr("src", replacement)
			.addClass("satsukimous_src matoiRYUKOOOOoO");

		$(".satsukimous_src")
			.parent()
			.parent()
			.find(".asker > .name:not(.xkit_satsukimous_name_handled)")
			.addClass('xkit_satsukimous_name_handled')
			.text(custom_name || "anonymous");

		$("div.post_avatar_link")
			.filter(function(index) {
				return $(this).attr("style").match("anonymous_avatar");
			})
			.attr("style", `background-image: url('${replacement}');`)
			.addClass("satsukimous_style matoiRYUKOOOOoO");

		$(".satsukimous_style")
			.parent()
			.parent()
			.find(".post_wrapper > .post_header > .post_info:not(.xkit_satsukimous_info_handled)")
			.each(function(index) {
				var $post_info = $(this);
				$post_info.addClass("xkit_satsukimous_info_handled");
				$post_info.text(
					$post_info.text().replace(/anonymous/ig, custom_name || "Anonymous")
				);
			});

		if (XKit.extensions.satsukimous.preferences.play_scream.value) {
			$(".matoiRYUKOOOOoO").click(function() {
				document.getElementById("matoi-sound").play();
			});
		}
	},

	run: function() {
		this.running = true;
		XKit.post_listener.add("SATSUKI", XKit.extensions.satsukimous.satsuki);
		XKit.extensions.satsukimous.satsuki();
		if (XKit.extensions.satsukimous.preferences.play_scream.value) {
			$("head").append('<audio id="matoi-sound" src="https://a.tumblr.com/tumblr_nt2vx0HIy21tgqvb3o1.mp3" type="audio/mp3"></audio>');
		}
	},

	destroy: function() {
		this.running = false;
		$("#matoi-sound").remove();

		$(".satsukimous_src")
			.attr("src", "https://secure.assets.tumblr.com/images/anonymous_avatar_128.gif")
			.removeClass("satsukimous_src matoiRYUKOOOOoO");

		$(".xkit_satsukimous_name_handled")
			.text("anonymous")
			.removeClass('xkit_satsukimous_name_handled');

		$(".xkit_satsukimous_info_handled").each(function(index) {
			var $post_info = $(this);
			$post_info.removeClass('xkit_satsukimous_info_handled');
			$post_info.text(
				$post_info.text().replace(XKit.extensions.satsukimous.preferences.name_replacement.value, "Anonymous")
			);
		});

		$(".satsukimous_style")
			.attr("style", "background-image: url('https://secure.assets.tumblr.com/images/anonymous_avatar_128.gif');")
			.removeClass("satsukimous_style matoiRYUKOOOOoO");

		XKit.post_listener.remove("SATSUKI");
	}

});
