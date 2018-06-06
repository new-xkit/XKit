//* TITLE Vanilla Audio **//
//* VERSION 0.2.1 **//
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

	run: function() {
		"use strict";
		this.running = true;
		XKit.post_listener.add("vanilla_audio", this.add_audio);
		this.add_audio();
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
		$(".xkit-audio-added").removeClass("xkit-audio-added");
		$(".xkit-audio-player").remove();
		this.running = false;
	}

});
