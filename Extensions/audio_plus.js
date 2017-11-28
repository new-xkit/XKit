//* TITLE Audio+ **//
//* VERSION 0.5.1 **//
//* DESCRIPTION Enhancements for the Audio Player **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.audio_plus = {

	running: false,
	current_player: null,

	preferences: {
		sep0: {
			text: "Options",
			type: "separator"
		},
		add_volume_control: {
			text: "Add a volume slider to audio posts",
			value: true,
			default: true
		},
		pop_out_player: {
			text: "Pop out controls when you scroll away from playing audio",
			value: true,
			default: true
		}
	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().inbox === true) {
			return;
		}

		if ($("#posts").length === 0) {
			return;
		}

		XKit.tools.init_css("audio_plus");

		if (XKit.extensions.audio_plus.preferences.add_volume_control.value) {
			$(document).on("mousemove mousedown mouseup mouseout click", ".xkit-audio-plus-slider", XKit.extensions.audio_plus.slider_handle_event);
			XKit.post_listener.add("audio_plus", XKit.extensions.audio_plus.do);
			setTimeout(function() { XKit.extensions.audio_plus.do(); }, 500);
		}

		if (XKit.extensions.audio_plus.preferences.pop_out_player.value) {
			window.addEventListener("scroll", XKit.extensions.audio_plus.handle_scroll, false);
			XKit.extensions.audio_plus.create_pop_out_controls();
		}
	},

	create_pop_out_controls: function() {
		// Create play and pause buttons modeled after the built-in ones
		var playPause = document.createElement("div");
		playPause.classList.add("play-pause");

		var icon = document.createElement("i");
		icon.classList.add("icon");
		icon.classList.add("icon_pause");
		playPause.appendChild(icon);

		var controls_undock = document.createElement("div");
		controls_undock.id = "xkit-audio-plus-controls-undock";

		var controls_undock_container = document.createElement("div");
		controls_undock_container.id = "xkit-audio-plus-controls-undock-container";
		controls_undock_container.appendChild(controls_undock);

		var controls = document.createElement("div");
		controls.classList.add("xkit-audio-plus-controls");
		// Spoof audio_player class to get the Play/Pause button styles
		controls.classList.add("audio-player");

		controls.appendChild(playPause);
		controls.appendChild(controls_undock_container);

		controls.addEventListener("click", function(event) {
			if (event.target === controls || event.target === playPause) {
				XKit.extensions.audio_plus.controls_click_callback();
			} else {
				XKit.extensions.audio_plus.controls_undock_click_callback();
			}
		}, false);

		XKit.extensions.audio_plus.pop_out_controls = controls;

		document.body.appendChild(controls);
	},

	controls_undock_click_callback: function() {
		var audio_plus = XKit.extensions.audio_plus;
		var controls = audio_plus.pop_out_controls;
		if (controls.classList.contains("playing")) {
			audio_plus.current_player.querySelector('audio').pause();
		}
		controls.classList.remove("showing");
		audio_plus.current_player = null;
	},

	controls_click_callback: function() {
		var audio_plus = XKit.extensions.audio_plus;
		var controls = audio_plus.pop_out_controls;
		var ppIcon = controls.querySelector('.play-pause').querySelector('.icon');
		var audio = audio_plus.current_player.querySelector('audio');

		if (!controls.classList.contains("showing")) {
			return;
		}
		if (controls.classList.contains("playing")) {
			audio.pause();
			ppIcon.classList.remove("icon_pause");
			ppIcon.classList.add("icon_play");
			controls.classList.remove("playing");
		} else {
			audio.play();
			ppIcon.classList.remove("icon_play");
			ppIcon.classList.add("icon_pause");
			controls.classList.add("playing");
		}
	},

	audio_player_of_element: function(elt) {
		while (elt && !elt.classList.contains('audio-player')) {
			elt = elt.parentNode;
		}
		return elt;
	},

	slider_handle_event: function(e) {
		var slider = e.target;
		var player = $(e.target).closest(".native-audio-container")[0];

		var volume = slider.value;
		if (e.type === "click" || e.type === "mousemove") {
			slider.title = volume;
			var audio = player.querySelector("audio");
			if (audio && audio.volume !== volume / 100) {
				audio.volume = volume / 100;
			}
		}
	},

	do: function() {

		var posts = XKit.interface.get_posts("audio_plus_done");

		$(posts).each(function() {
			$(this).addClass("audio_plus_done");

			var m_post = XKit.interface.post($(this));

			if (!m_post || m_post.type !== "audio") { return; }

			// Check if hosted by Tumblr:
			if ($(this).find(".audio-player").length === 0) { return; }

			var slider_html = "<div data-post-id=\"" + m_post.id + "\" class=\"xkit-audio-plus-slider-container\">" +
								"<input type=\"range\" value=\"100\" min=\"0\" max=\"100\" data-post-id=\"" + m_post.id + "\" title=\"somepeoplelikefish\" class=\"xkit-audio-plus-slider\"></input>" +
						"</div>";

			$(this).find(".audio-player").after(slider_html);
		});

	},

	handle_scroll: function() {
		var audio_plus = XKit.extensions.audio_plus;
		if (audio_plus.scroll_waiting) {
			return;
		}
		if (audio_plus.pop_out_controls.classList.contains("showing")) {
			return;
		}
		audio_plus.scroll_waiting = true;
		setTimeout(audio_plus.check_pop_out, 100);
	},

	check_pop_out: function() {
		var audio_plus = XKit.extensions.audio_plus;
		audio_plus.scroll_waiting = false;

		var pause_icons = document.querySelectorAll(".post_media .audio-player .icon_pause");
		if (pause_icons.length === 0) {
			return;
		}

		// Arbitrarily select the first if there are multiple
		var player = audio_plus.audio_player_of_element(pause_icons[0]);
		var player_bounds = player.getBoundingClientRect();

		// If not completely off the screen
		if (player_bounds.top > -player_bounds.height) {
			return;
		}

		audio_plus.current_player = player;
		audio_plus.pop_out_controls.classList.add("showing");
		audio_plus.pop_out_controls.classList.add("playing");
	},

	destroy: function() {
		this.running = false;

		XKit.tools.add_function(function() {
			clearInterval(window.xkit_audio_plus_check_current_interval);
		}, true, "");
		$("#xkit-audio-plus-current-player").remove();

		document.body.removeChild(this.pop_out_controls);
		XKit.post_listener.remove("audio_plus");
		window.removeEventListener("scroll", this.handle_scroll, false);
	}

};
