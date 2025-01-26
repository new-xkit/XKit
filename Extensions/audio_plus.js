//* TITLE Audio+ **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Enhancements for the Audio Player **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.audio_plus = {

	running: false,

	audioBlockClass: "",

	current_player: null,
	timeout_counter: 0,
	waiting_until_dock_ready: null,
	pop_out_controls: null,
	mouseDown: false,
	scrubbing: false,

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

	can_see_docked_posts: $("#right_column").length !== 0,

	run: function() {
		this.running = true;

		if (XKit.interface.where().inbox === true) {
			return;
		}

		if (!XKit.page.react && $("#posts").length === 0) {
			return;
		}

		XKit.tools.init_css("audio_plus");

		if (XKit.page.react) {
			if (this.preferences.add_volume_control.value) {
				XKit.css_map.getCssMap().then(({audioBlock}) => {
					this.audioBlockClass = `.${audioBlock[0]}`;
					XKit.post_listener.add('audio_plus', this.react_do);
					this.react_do();

					XKit.tools.add_css(
						`${this.audioBlockClass} { position: relative !important; }`,
						'audio_plus'
					);
				});
			}

			return;
		}

		if (this.preferences.add_volume_control.value) {
			$(document).on("mousemove mousedown mouseup mouseout click", ".xkit-audio-plus-slider", this.slider_handle_event);
			XKit.post_listener.add("audio_plus", () => setTimeout(this.do, 10));
			setTimeout(() => this.do(), 500);
		}

		if (this.preferences.pop_out_player.value) {
			window.addEventListener("scroll", this.handle_scroll, false);
			this.create_pop_out_controls();

			if (this.can_see_docked_posts) {
				var targetNode = document.getElementById("right_column");
				var config = {attributes: true};
				this.dock_observer.observe(targetNode, config);
			}
		}
	},

	react_do: function() {
		const {audioBlockClass, react_slider_handle_event} = XKit.extensions.audio_plus;

		$(`${audioBlockClass}:not(.audio_plus_done)`)
		.addClass('audio_plus_done')
		.each(function() {
			const $audioBlock = $(this);
			const audio = this.querySelector('audio');
			const slider = this.querySelector('.xkit-audio-plus-slider');

			if (audio === null) {
				return;
			}

			$audioBlock.on('change', '.xkit-audio-plus-slider', react_slider_handle_event);

			if (slider === null) {
				$audioBlock.append(`
					<div class="xkit-audio-plus-slider-container">
						<input type="range" value="100" min="0" max="100" class="xkit-audio-plus-slider"></input>
					</div>
				`);
			} else {
				const $slider = $(slider);
				const currentVolume = audio.volume;
				$slider.val(currentVolume * 100);
			}

		});
	},

	react_slider_handle_event: function(e) {
		e.stopPropagation();

		const {audioBlockClass} = XKit.extensions.audio_plus;
		const $slider = $(e.target);
		const $audioBlock = $slider.parents(audioBlockClass);
		const volume = $slider.val();

		$slider.attr('title', volume);

		const audio = $audioBlock[0].querySelector('audio');
		if (audio !== null && audio.volume !== volume / 100) {
			audio.volume = volume / 100;
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

	dock_observer: new MutationObserver(mutations => {
		for (var mutation of mutations) {
			if (mutation.target.classList.contains("has_docked_post")) {
				var docked_video = document.getElementById("posts").querySelector(".dockable_video_embed.docked");
				XKit.extensions.audio_plus.waiting_until_dock_ready = setInterval(function() {XKit.extensions.audio_plus.waitUntilDockReady(docked_video);}, 50);
			} else {
				XKit.extensions.audio_plus.pop_out_controls.style.transform = "";
			}
		}
	}),

	waitUntilDockReady: function(docked_video) {
		if (this.timeout_counter <= 40) { //40 * 50ms = 2s
			this.timeout_counter++;
		} else {
			this.timeout_counter = 0;
			clearInterval(this.waiting_until_dock_ready);
		}

		if (docked_video.classList.contains("velocity-animating")) {
			//still animating
		} else {
			clearInterval(this.waiting_until_dock_ready);
			this.getDockHeight(docked_video);
			this.timeout_counter = 0;
		}
	},

	getDockHeight: function(docked_video) {
		var docked_video_height = docked_video.style.height;
		var controls_style = window.getComputedStyle(this.pop_out_controls);
		this.pop_out_controls.style.transform = `translateY(calc(-${docked_video_height} - ${controls_style.bottom}))`;
	},

	setProgress: function(elem, progress, event) {
		var audio = XKit.extensions.audio_plus.current_player.querySelector("audio");
		var x = event.offsetX;
		var total_w = elem.offsetWidth;
		var width_per = (x / total_w);
		progress.style.width = (width_per * 100) + "%";
		audio.currentTime = (width_per * audio.duration);
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

		var psuedo_post = document.createElement("div");
		psuedo_post.classList.add("xkit-audio-plus-pseudo-post");
		psuedo_post.innerHTML = `
			<div class="xkit-audio-plus-controls audio-player">
				<div class="progress"></div>
				<div class="play-pause">
					<i class="icon icon_pause"></i>
				</div>
				<div class="audio-info">
					<div class="track-name"></div>
					<div class="track-artist"></div>
				</div>
			</div>
			<div id="xkit-audio-plus-controls-undock-container">
				<div id="xkit-audio-plus-controls-undock"></div>
			</div>
		`;
		document.body.appendChild(psuedo_post);

		this.pop_out_controls = psuedo_post;
		this.pop_out_controls_progress = psuedo_post.querySelector(".progress");
		this.pop_out_controls_track_name = psuedo_post.querySelector(".track-name");
		this.pop_out_controls_track_artist = psuedo_post.querySelector(".track-artist");

		//event listeners
		var audio_plus = XKit.extensions.audio_plus;
		var controls = psuedo_post.querySelector(".xkit-audio-plus-controls");
		var progress = psuedo_post.querySelector(".progress");
		var playPause = psuedo_post.querySelector(".play-pause");
		var controls_undock_container = psuedo_post.querySelector("#xkit-audio-plus-controls-undock-container");

		//change progress
		controls.addEventListener("mousedown", function(event) {
			if (event.target === playPause) {
				return;
			} else {
				audio_plus.setProgress(controls, progress, event);
			}
		}, false);

		//scrubbing
		controls.onmousedown = function() {
			audio_plus.mouseDown = true;
		};
		document.body.addEventListener("mouseup", function() {
			audio_plus.mouseDown = false;
		}, false);
		controls.addEventListener("mousemove", function(event) {
			if (event.target === playPause) {
				return;
			} else {
				audio_plus.scrubIfDown(controls, progress, event);
			}
		}, false);

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
	},

	controls_undock_click_callback: function() {
		var audio_plus = XKit.extensions.audio_plus;
		var controls = audio_plus.pop_out_controls;
		if (controls.classList.contains("playing")) {
			audio_plus.controls_click_callback();
		}
		controls.classList.remove("showing");
		audio_plus.current_player = null;
		$("#right_column").removeClass("has_docked_audio");
	},

	controls_click_callback: function() {
		var audio_plus = XKit.extensions.audio_plus;
		var controls = audio_plus.pop_out_controls;
		var ppIcon = controls.querySelector('.play-pause .icon');
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

		// Arbitrarily select the first if there are multiple
		var pause_icon = document.querySelectorAll(".post_media .audio-player .icon_pause")[0];
		if (pause_icon) {
			audio_plus.show_pop_out(pause_icon);
		}
	},

	show_pop_out: function(pause_icon) {
		var player = this.audio_player_of_element(pause_icon);
		var player_bounds = player.getBoundingClientRect();

		// If not completely off the screen
		if (player_bounds.top > -player_bounds.height) {
			return;
		}

		//show progress in popout container
		var progress = player.querySelector(".progress");
		var config = {attributes: true};
		this.progress_observer.observe(progress, config);
		this.icon_observer.observe(pause_icon, config);

		if (player.querySelector(".track-name").innerHTML != "") {
			this.pop_out_controls_track_name.replaceChildren(player.querySelector(".track-name").cloneNode(true));
		} else {
			this.pop_out_controls_track_name.innerHTML = "Listen";
		}
		this.pop_out_controls_track_artist.replaceChildren(player.querySelector(".track-artist").cloneNode(true));

		this.current_player = player;
		this.pop_out_controls.classList.add("showing");
		this.pop_out_controls.classList.add("playing");
		var ppIcon = this.pop_out_controls.querySelector('.play-pause .icon');
		ppIcon.classList.remove("icon_play");
		ppIcon.classList.add("icon_pause");
		$("#right_column").addClass("has_docked_audio");
	},

	progress_observer: new MutationObserver(mutations => {
		for (var mutation of mutations) {
			XKit.extensions.audio_plus.pop_out_controls_progress.setAttribute("style", mutation.target.attributes.getNamedItem("style").value);
			//reset when audio is finished
			if (mutation.target.attributes.getNamedItem("style").value == "width: 0px;") {
				XKit.extensions.audio_plus.controls_click_callback();
			}
		}
	}),

	icon_observer: new MutationObserver(mutations => {
		for (var mutation of mutations) {
			var ppIcon = XKit.extensions.audio_plus.pop_out_controls.querySelector('.play-pause .icon');
			if (mutation.target.classList.contains("icon_play")) {
				ppIcon.classList.remove("icon_pause");
				ppIcon.classList.add("icon_play");
				if (XKit.extensions.audio_plus.scrubbing == false) {
					XKit.extensions.audio_plus.pop_out_controls.classList.remove("playing");
				}
			} else if (mutation.target.classList.contains("icon_pause")) {
				ppIcon.classList.remove("icon_play");
				ppIcon.classList.add("icon_pause");
				if (XKit.extensions.audio_plus.scrubbing == false) {
					XKit.extensions.audio_plus.pop_out_controls.classList.add("playing");
				}
			}
		}
	}),

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css('audio_plus');
		XKit.post_listener.remove("audio_plus");

		$(document).off("mousemove mousedown mouseup mouseout click", ".xkit-audio-plus-slider");

		$('.xkit-audio-plus-slider-container').remove();
		$('.audio_plus_done')
			.removeClass('audio_plus_done')
			.off('change', '.xkit-audio-plus-slider');

		if (this.pop_out_controls) {
			XKit.tools.add_function(function() {
				clearInterval(window.xkit_audio_plus_check_current_interval);
			}, true, "");
			$("#xkit-audio-plus-current-player").remove();

			document.body.removeChild(this.pop_out_controls);
			window.removeEventListener("scroll", this.handle_scroll, false);

			this.dock_observer.disconnect();
			this.progress_observer.disconnect();
			this.icon_observer.disconnect();
		}
	}
};
