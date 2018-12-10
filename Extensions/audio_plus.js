//* TITLE Audio+ **//
//* VERSION 0.5.3 **//
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

		XKit.extensions.audio_plus.can_see_docked_posts = true;
		try {
			document.getElementById("right_column").hasAttribute;
		} catch(error) {
			XKit.extensions.audio_plus.can_see_docked_posts = false;
		}

		if (XKit.extensions.audio_plus.preferences.add_volume_control.value) {
			$(document).on("mousemove mousedown mouseup mouseout click", ".xkit-audio-plus-slider", XKit.extensions.audio_plus.slider_handle_event);
			XKit.post_listener.add("audio_plus", function() { setTimeout(XKit.extensions.audio_plus.do, 10); });
			setTimeout(function() { XKit.extensions.audio_plus.do(); }, 500);
		}

		if (XKit.extensions.audio_plus.preferences.pop_out_player.value) {
			window.addEventListener("scroll", XKit.extensions.audio_plus.handle_scroll, false);
			XKit.extensions.audio_plus.create_pop_out_controls();
		}

		//keep tabs on whether there's a docked video post
		var audio_plus = XKit.extensions.audio_plus;
		if (audio_plus.can_see_docked_posts) {
			var targetNode = document.getElementById("right_column");
			var config = {attributes: true};
			var callback = function(mutations, observer) {
				for (var mutation of mutations) {
					if (mutation.target.classList.contains("has_docked_post")) {
						var docked_video = document.getElementById("posts").querySelector(".dockable_video_embed.docked");
						audio_plus.timeout_counter = 0;
						audio_plus.waiting_until_dock_ready = setInterval(function() {audio_plus.waitUntilDockReady(docked_video)}, 50);
					} else {
						audio_plus.pop_out_controls.style.transform = "";
					}
				}
			}
			var observer_dock = new MutationObserver(callback);
			observer_dock.observe(targetNode, config);
		}
	},

	setProgress: function(elem, progress, event) {
		var audio = XKit.extensions.audio_plus.current_player.querySelector('audio');
		var x = event.offsetX;
		var total_w = elem.offsetWidth;
		var width_per = (x/total_w);
		progress.style.width = width_per*100 + "%";
		audio.currentTime = width_per*audio.duration;
	},

	scrubIfDown: function(elem, progress, event) {
		if (XKit.extensions.audio_plus.mouseDown) {
			var audio = XKit.extensions.audio_plus.current_player.querySelector('audio');
			audio.pause();
			XKit.extensions.audio_plus.scrubbing = true;
			XKit.extensions.audio_plus.setProgress(elem, progress, event);
		}
	},

	playAfterScrubbing: function() {
		if (XKit.extensions.audio_plus.scrubbing && XKit.extensions.audio_plus.pop_out_controls.classList.contains("playing")) {
			var audio = XKit.extensions.audio_plus.current_player.querySelector('audio');
			audio.play();
		}
		XKit.extensions.audio_plus.scrubbing = false;
	},

	create_pop_out_controls: function() {
		var audio_plus = XKit.extensions.audio_plus;

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

		var psuedo_post = document.createElement("div");
		psuedo_post.classList.add("xkit-audio-plus-pseudo-post");

		var controls = document.createElement("div");
		controls.classList.add("xkit-audio-plus-controls");
		// Spoof audio_player class to get the Play/Pause button styles
		controls.classList.add("audio-player");

		var progress = document.createElement("div");
		progress.classList.add("progress");
		
		var audio_info = document.createElement("div");
		audio_info.classList.add("audio-info");
		
		var track_name = document.createElement("div");
		track_name.classList.add("track-name");
		track_name.innerHTML = "Listen";
		
		var track_artist = document.createElement("div");
		track_artist.classList.add("track-artist");

		var audio_image = document.createElement("div");
		audio_image.classList.add("audio-image");
		
		document.body.appendChild(psuedo_post);
		psuedo_post.appendChild(controls);
		controls.appendChild(progress);
		controls.appendChild(playPause);
		controls.appendChild(audio_info);
		audio_info.appendChild(track_name);
		audio_info.appendChild(track_artist);
		psuedo_post.appendChild(controls_undock_container);
		
		//change progress
		controls.addEventListener("mousedown", function(event) {
			if (event.target === playPause) {
				return;
			} else {
				audio_plus.setProgress(controls, progress, event);
			}
		}, false);

		//scrubbing
		audio_plus.mouseDown = false;
		controls.onmousedown = function() { 
			audio_plus.mouseDown = true;
		}
		document.body.onmouseup = function() {
			audio_plus.mouseDown = false;
		}
		controls.addEventListener("mousemove", function(event) {
			if (event.target === playPause) {
				return;
			} else {
				audio_plus.scrubIfDown(controls, progress, event);
			}
		}, false);

		audio_plus.scrubbing = false;
		controls.addEventListener("mouseup", function() {
			if (event.target === playPause) {
				return;
			} else {
				audio_plus.playAfterScrubbing();
			}
		}, false);

		playPause.addEventListener("click", function(event) {
			audio_plus.controls_click_callback();
		}, false);

		controls_undock_container.addEventListener("click", function(event) {
			audio_plus.controls_undock_click_callback();
		}, false);

		audio_plus.pop_out_controls = psuedo_post;
		audio_plus.pop_out_controls_progress = progress;
		audio_plus.pop_out_controls_track_name = track_name;
		audio_plus.pop_out_controls_track_artist = track_artist;
	},

	controls_undock_click_callback: function() {
		var audio_plus = XKit.extensions.audio_plus;
		var controls = audio_plus.pop_out_controls;
		if (controls.classList.contains("playing")) {
			audio_plus.current_player.querySelector('audio').pause();
		}
		controls.classList.remove("showing");
		document.body.classList.remove("xkit_audio_plus_popout_showing");
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

	waitUntilDockReady: function(docked_video) {
		var audio_plus = XKit.extensions.audio_plus;

		if (audio_plus.timeout_counter <= 40) { //40 * 50ms = 2s
			++audio_plus.timeout_counter;
			console.log(audio_plus.timeout_counter);
		} else {
			audio_plus.timeout_counter = 0;
			clearInterval(audio_plus.waiting_until_dock_ready);
		}

		if (docked_video.classList.contains("velocity-animating")) {
			//still animating
		} else {
			clearInterval(audio_plus.waiting_until_dock_ready);
			audio_plus.getDockHeight(docked_video);
			audio_plus.timeout_counter = 0;
		}
	},

	getDockHeight: function(docked_video) {
		var audio_plus = XKit.extensions.audio_plus;

		var docked_video_height = docked_video.style.height;
		var controls_style = window.getComputedStyle(audio_plus.pop_out_controls);
		audio_plus.pop_out_controls.style.transform = "translateY(calc(-" + docked_video_height + " - " + controls_style.bottom + "))";
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

		//show progress in popout container
		var progress = XKit.extensions.audio_plus.pop_out_controls_progress;
		var targetNode = player.querySelector(".progress");
		var config = {attributes: true};
		var callback = function(mutations, observer) {
			for (var mutation of mutations) {
				progress.setAttribute("style", mutation.target.attributes.getNamedItem("style").value);
			}
		}
		var observer_progress = new MutationObserver(callback);
		observer_progress.observe(targetNode, config);

		if (player.querySelector(".track-name").innerHTML != "") {
			audio_plus.pop_out_controls_track_name.innerHTML = player.querySelector(".track-name").innerHTML;
		} else {
			audio_plus.pop_out_controls_track_name.innerHTML = "Listen"
		}
		audio_plus.pop_out_controls_track_artist.innerHTML = player.querySelector(".track-artist").innerHTML;

		audio_plus.current_player = player;
		audio_plus.pop_out_controls.classList.add("showing");
		document.body.classList.add("xkit_audio_plus_popout_showing");
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
