//* TITLE Vanilla Videos **//
//* VERSION 0.2.0 **//
//* DESCRIPTION Make the video player unexciting **//
//* DETAILS Use the browser's native video player. Only affects Tumblr's player. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA true **//
//* SLOW true **//

'use strict';

XKit.extensions.vanilla_video = {

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
				"25%", 0.25,
				"0% (muted)", 0.0
			],
		},
		"pause_on_click": {
			text: "Play/pause the video by clicking on it",
			default: true,
			value: true
		},
		"loop": {
			text: "Loop by default",
			default: false,
			value: false
		},
		"use_hd": {
			text: "Use HD videos where available",
			default: false,
			value: false
		},
		"background_color": {
			text: "Background color (<span style=\"text-decoration: underline; cursor: pointer;\" id=\"xkit-vanilla-video-color-help\">what is this?</span>)",
			type: "text",
			default: "#000000",
			value: "#000000"
		},
		"disable_preload": {
			text: "Disable video preloading (may save data)",
			default: false,
			value: false
		},
	},

	running: false,
	run: function() {
		this.running = true;
		if (this.preferences.background_color.value === "") {
			this.preferences.background_color.value = "#000000";
		}
		XKit.post_listener.add('vanilla_video', XKit.extensions.vanilla_video.check);
		XKit.extensions.vanilla_video.check();
	},
	
	cpanel: function() {
		$("#xkit-vanilla-video-color-help").click(function() {
			XKit.window.show("Background color", "The Vanilla Videos extension allows you to set the background color used when videos do not fill the whole player, generally due to being very narrow. Any CSS color value works, for example: <br/><br/><ul><li>#000000</li><li>#FF0000</li><li>rgba(0, 0, 0, 0)</li></ul><br/>These would produce black, red, and transparent respectively.<br/><br/>Please be careful while customizing the color. An improper value can cause issues. In that case, just delete the text you've entered completely and XKit will revert to the default color.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		});
	},

	check: function() {
		var doneClass = 'xvanilla_video-done';
		$('.posts .post').not('.' + doneClass).each(function() {
			var post = $(this);
			post.addClass(doneClass);
			var videoEmbeds = post.find('.dockable_video_embed').add('.crt-video');
			videoEmbeds.each(function() {
				var videoEmbed = $(this);
				if (videoEmbed.attr('data-embed-service') !== 'tumblr_video' && !videoEmbed.hasClass('crt-video')) {
					return;
				}
				var sources = videoEmbed.find('video > source');
				var newVideo = document.createElement('video');
				sources.each(function() {
					var origVideo = this.parentElement;
					var clonedSource = document.createElement('source');
					clonedSource.type = this.type;
					clonedSource.src = this.src;
					if (XKit.extensions.vanilla_video.preferences.use_hd.value) {
						clonedSource.src = clonedSource.src.replace(/\/480$/, "");
					}
					newVideo.poster = origVideo.poster;
					newVideo.appendChild(clonedSource);
				});
				if ($(newVideo).find("source").length === 0) {
					// remove doneClass?
					return; // FIXME sometimes a page ends up with all broken videos (missing source) - not sure why. haven't seen it since I added this but might just be a coincidence
				}
				newVideo.controls = true;
				newVideo.style = "width: 100%;" +
								 "display: block;" +
								 "margin: auto;" +
								 "max-height: 600px;" +
								 "background: " + XKit.extensions.vanilla_video.preferences.background_color.value + ";";
				newVideo.volume = XKit.extensions.vanilla_video.preferences.default_volume.value;
				newVideo.loop = XKit.extensions.vanilla_video.preferences.loop.value;
				if (XKit.extensions.vanilla_video.preferences.disable_preload.value) {
					newVideo.preload = "none";
				}
				if (XKit.extensions.vanilla_video.preferences.pause_on_click.value) {
					newVideo.addEventListener("click", function() { this.paused ? this.play() : this.pause(); });
				}
				videoEmbed.replaceWith(newVideo);
			});
		});
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove('vanilla_video');
	}
};
