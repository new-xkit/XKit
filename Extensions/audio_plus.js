//* TITLE Audio+ **//
//* VERSION 0.3.2 **//
//* DESCRIPTION Enhancements for the Audio Player **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.audio_plus = {

	running: false,

	check_current_interval: 0,

	run: function() {
		this.running = true;

		if (XKit.interface.where().inbox) {
			return;
		}

		if ($("#posts").length > 0) {
			XKit.tools.init_css("audio_plus");
			$(document).on("mousemove mousedown mouseup mouseout click", ".xkit-audio-plus-slider", XKit.extensions.audio_plus.slider_handle_event);
			XKit.post_listener.add("audio_plus", XKit.extensions.audio_plus.do);
			setTimeout(function() { XKit.extensions.audio_plus.do(); }, 500);
			$("body").append("<div id=\"xkit-audio-plus-current-player\"></div>");
			XKit.extensions.audio_plus.check_current_interval = setInterval(function() { XKit.extensions.audio_plus.check_current(); }, 1000);
		}

	},

	check_current: function() {

		XKit.tools.add_function(function() {

			try {
				var current_player = Tumblr.AudioPlayer.current_player_id;

				var m_object = {
					defined: false
				};

				if (typeof current_player !== "undefined") {
					m_object.defined = true;
					m_object.title = audiojs.instances["audiojs" + current_player].audioplayer.$track_name.text();
					m_object.artist = audiojs.instances["audiojs" + current_player].audioplayer.$artist_name.text();
					m_object.playing = audiojs.instances["audiojs" + current_player].playing;
					m_object.id = parseInt(current_player);
					jQuery("#xkit-audio-plus-current-player").html("CU:" + JSON.stringify(m_object));
				} else {
					jQuery("#xkit-audio-plus-current-player").html("");
				}
			} catch(e){
				jQuery("#xkit-audio-plus-current-player").html("");
			}

		}, true, "");
	},

	return_current_instance: function() {

		if ($("#xkit-audio-plus-current-player").html().substring(0,3) !== "CU:") {
			return -1;
		} else {
			try {
				return JSON.parse($("#xkit-audio-plus-current-player").html().substring(3));
			} catch(e) {
				return -1;
			}
		}

	},

	stop_current_instance: function() {
		var instance = XKit.extensions.audio_plus.return_current_instance();

		if (instance === -1) { return; }

		var m_object = {
			id: instance.id
		};

		XKit.tools.add_function(function() {
			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances["audiojs" + add_tags.id];
			m_object.pause();
		}, true, JSON.stringify(m_object));

	},

	play_current_instance: function() {
		var instance = XKit.extensions.audio_plus.return_current_instance();

		if (instance === -1) { return; }

		var m_object = {id: instance.id};

		XKit.tools.add_function(function() {

			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances["audiojs" + add_tags.id];
			m_object.play();

		}, true, JSON.stringify(m_object));

	},

	slider_handle_event: function(e) {
		function firstParentWithClass(elt, cls) {
			if (elt.classList.contains(cls)) {
				return elt;
			} else {
				return firstParentWithClass(elt.parentNode, cls);
			}
		}
		var slider =	e.target;

		var parent_post = firstParentWithClass(slider, 'post');
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

			var slider_html =	 "<div data-post-id=\"" + m_post.id + "\" class=\"xkit-audio-plus-slider-container\">" +
								"<input type=\"range\" value=\"100\" min=\"0\" max=\"100\" data-post-id=\"" + m_post.id + "\" title=\"somepeoplelikefish\" class=\"xkit-audio-plus-slider\"></input>" +
						"</div>";

			$(this).find(".post_media").append(slider_html);

			// console.log("Volume is => " + $(this).find("audio").get(0).volume);

		});

	},

	destroy: function() {
		this.running = false;
		clearInterval(XKit.extensions.audio_plus.check_current_interval);
		$("#xkit-audio-plus-current-player").remove();
		XKit.post_listener.remove("audio_plus");
	}

};
