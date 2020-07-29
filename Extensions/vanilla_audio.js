//* TITLE Vanilla Audio **//
//* VERSION 0.3.0 **//
//* DESCRIPTION	Adds an alternative audio player to audio posts. **//
//* DETAILS This extension adds a native HTML5 audio player to every audio post, with an option for the default volume and the ability to loop the audio. **//
//* DEVELOPER akunohomu **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.vanilla_audio = new Object({

	running: false,

	preferences: {
		"default_volume": {
			text: "Default volume",
			default: 1.0,
			value: 1.0,
			type: "combo",
			values: [
				"100%", 1.0,
				"75%", 0.75,
				"50%", 0.50,
				"25%", 0.25
			],
			desktop_only: true
		}
	},

	run: async function() {
		"use strict";
		this.running = true;

		await XKit.css_map.getCssMap();

		if (XKit.page.react) {
			XKit.tools.add_css(".xkit-audio-added { padding: 0 16px; } .xkit-audio-player { display: block !important; margin: auto; } }", "vanilla_audio");
			XKit.post_listener.add("vanilla_audio", this.add_audio_react);
			this.add_audio_react();
			return;
		}

		XKit.post_listener.add("vanilla_audio", this.add_audio);
		this.add_audio();
	},

	add_audio_react: function() {
		let audiocontainer_classname = XKit.css_map.keyToClasses('nativePlayer')[0];
		$(`.${audiocontainer_classname}`).not(".xkit-audio-added").each(function() {
			var $this = $(this);
			$this.addClass("xkit-audio-added");
			$this.children().css("display", "none");
			var hidden_player = $this.find("audio");
			var xkit_player = $("<audio/>", { "controls": "controls", "class": "xkit-audio-player" }).appendTo($this);
			xkit_player.prop("volume", XKit.extensions.vanilla_audio.preferences.default_volume.value);
			hidden_player.find("source").clone().appendTo(xkit_player);
		});
	},

	add_audio: function() {
		"use strict";
		$(".native-audio-container").not(".xkit-audio-added").each(function(index) {
			var $this = $(this);
			$this.addClass("xkit-audio-added");
			var url = $this.attr("data-stream-url");
			var key = $this.attr("data-post-key");
			if (url && key) {
				var player = $("<audio class='xkit-audio-player' src='" + url + "?play_key=" + key +
					"' preload='none' style='width:100%;margin-top:8px;' controls><p>No audio support detected</p></audio>");
				player.prop("volume", XKit.extensions.vanilla_audio.preferences.default_volume.value);
				$this.parent().after(player);
			}
		});
	},

	destroy: function() {
		"use strict";
		XKit.post_listener.remove("vanilla_audio");
		if (XKit.page.react) {
			$(".xkit-audio-added").children().css("display", "flex");
		}
		$(".xkit-audio-added").removeClass("xkit-audio-added");
		$(".xkit-audio-player").remove();
		this.running = false;
	}

});
