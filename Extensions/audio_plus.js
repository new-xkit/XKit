//* TITLE Audio+ **//
//* VERSION 0.4.4 **//
//* DESCRIPTION Enhancements for the Audio Player **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.audio_plus = {

	running: false,

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

		$("body").append("<div id=\"xkit-audio-plus-current-player\"></div>");
		XKit.extensions.audio_plus.start_check_current();

		if (XKit.extensions.audio_plus.preferences.pop_out_player.value) {
			window.addEventListener("scroll", XKit.extensions.audio_plus.handle_scroll, false);
			XKit.extensions.audio_plus.create_pop_out_controls();
		}
	},

	create_pop_out_controls: function() {
		// Create play and pause buttons modeled after the built-in ones
		var play = document.createElement("i");
		play.textContent = "Play";
		play.classList.add("play_button");
		play.classList.add("audio_player_button");

		var pause = document.createElement("i");
		pause.textContent = "Pause";
		pause.classList.add("pause_button");
		pause.classList.add("audio_player_button");

		var controls_undock = document.createElement("div");
		controls_undock.id = "xkit-audio-plus-controls-undock";

		var controls_undock_container = document.createElement("div");
		controls_undock_container.id = "xkit-audio-plus-controls-undock-container";
		controls_undock_container.appendChild(controls_undock);

		var controls = document.createElement("div");
		controls.classList.add("xkit-audio-plus-controls");
		// Spoof audio_player class to get the Play/Pause button styles
		controls.classList.add("audio_player");

		controls.appendChild(play);
		controls.appendChild(pause);
		controls.appendChild(controls_undock_container);

		controls.addEventListener("click", function(event) {
			if (event.target === controls || event.target === play ||
				event.target === pause) {
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
			audio_plus.stop_current_instance();
		}
		controls.classList.remove("showing");
	},

	controls_click_callback: function() {
		var audio_plus = XKit.extensions.audio_plus;
		var controls = audio_plus.pop_out_controls;
		if (!controls.classList.contains("showing")) {
			return;
		}
		if (controls.classList.contains("playing")) {
			audio_plus.stop_current_instance();
			controls.classList.remove("playing");
		} else {
			audio_plus.play_current_instance();
			controls.classList.add("playing");
		}
	},

	start_check_current: function() {

		XKit.tools.add_function(function() {
			/* globals Tumblr, audiojs */
			window.xkit_audio_plus_check_current_interval = setInterval(function() {
				try {
					var current_player = Tumblr.AudioPlayer.current_player_id;

					var m_object = {
						defined: false
					};

					if (typeof current_player === "undefined") {
						jQuery("#xkit-audio-plus-current-player").html("");
						return;
					}

					m_object.defined = true;
					m_object.title = audiojs.instances["audiojs" + current_player].audioplayer.$track_name.text();
					m_object.artist = audiojs.instances["audiojs" + current_player].audioplayer.$artist_name.text();
					m_object.playing = audiojs.instances["audiojs" + current_player].playing;
					m_object.id = parseInt(current_player);
					jQuery("#xkit-audio-plus-current-player").html("CU:" + JSON.stringify(m_object));
				} catch (e) {
					jQuery("#xkit-audio-plus-current-player").html("");
				}
			}, 1000);

		}, true, "");
	},

	return_current_instance: function() {

		if ($("#xkit-audio-plus-current-player").html().substring(0, 3) !== "CU:") {
			return -1;
		} else {
			try {
				return JSON.parse($("#xkit-audio-plus-current-player").html().substring(3));
			} catch (e) {
				return -1;
			}
		}

	},

	stop_current_instance: function() {
		var instance = XKit.extensions.audio_plus.return_current_instance();

		if (instance === -1) { return; }

		XKit.tools.add_function(function() {
			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances["audiojs" + add_tags.id];
			m_object.pause();
		}, true, JSON.stringify({
			id: instance.id
		}));

	},

	play_current_instance: function() {
		var instance = XKit.extensions.audio_plus.return_current_instance();

		if (instance === -1) { return; }

		XKit.tools.add_function(function() {
			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances["audiojs" + add_tags.id];
			m_object.play();
		}, true, JSON.stringify({
			id: instance.id
		}));

	},

	slider_handle_event: function(e) {
		function firstParentWithClass(elt, cls) {
			if (elt.classList.contains(cls)) {
				return elt;
			} else {
				return firstParentWithClass(elt.parentNode, cls);
			}
		}
		var slider = e.target;

		var parent_post = firstParentWithClass(slider, "post");
		var volume = slider.value;
		if (e.type === "click" || e.type === "mousemove") {
			slider.title = volume;
			var audio = parent_post.querySelector("audio");
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
			if ($(this).find(".audio_player").length === 0 || $(this).find(".audio_visualizer").length === 0) { return; }

			var slider_html = "<div data-post-id=\"" + m_post.id + "\" class=\"xkit-audio-plus-slider-container\">" +
								"<input type=\"range\" value=\"100\" min=\"0\" max=\"100\" data-post-id=\"" + m_post.id + "\" title=\"somepeoplelikefish\" class=\"xkit-audio-plus-slider\"></input>" +
						"</div>";

			$(this).find(".post_media").append(slider_html);

			// console.log("Volume is => " + $(this).find("audio").get(0).volume);

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

		var playing_players = document.querySelectorAll(".audio_player.playing");
		if (playing_players.length === 0) {
			return;
		}
		// Arbitrarily select the first if there are multiple
		var player = playing_players[0].querySelector(".audio_controls");
		var player_bounds = player.getBoundingClientRect();

		// If not completely off the screen
		if (player_bounds.top > -player_bounds.height) {
			return;
		}

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
