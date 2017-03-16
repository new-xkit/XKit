//* TITLE Separator **//
//* VERSION 1.1.3 **//
//* DESCRIPTION Where were we again? **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS A simple extension that puts a divider showing where you left off on your dashboard. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.separator = new Object({

	running: false,

	check_for: "",

	preferences: {

		"bold_line": {
			text: "Use the thick line for separating",
			default: false,
			value: false
		},

		"jump_to": {
			text: "Show the \"Jump to Separator\" button (only works when endless scrolling is off)",
			default: false,
			value: false
		},

	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().dashboard !== true) {return; }

		XKit.tools.init_css("separator");

		if (XKit.extensions.separator.preferences.bold_line.value === true) {

			XKit.tools.add_css(" #xkit-post-separator { border-top: 3px solid rgba(255,255,255,0.33) !important; border-bottom: 0 !important; } ", "separator-thick");

		}

		if (XKit.extensions.separator.preferences.jump_to.value === true) {

			var xf_html = '<ul class="controls_section" id="separator_ul">' +
				'<li class="section_header selected">SEPARATOR</li>' +
				'<li class="no_push" style="height: 36px;"><a href="#" id="separator_button">' +
					'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Go to last viewed post<span class="sub_control link_arrow arrow_right"></span></div>' +
				'</a></li></ul>';
			$("ul.controls_section:first").before(xf_html);


			$("#separator_button").click(function() {

				if ($("#xkit-post-separator").length > 0) {

					$('html,body').animate({
						scrollTop: $("#xkit-post-separator").offset().top
					}, 1000);

				} else {

					document.location = "http://www.tumblr.com/dashboard/100/" + (XKit.extensions.separator.check_for + 1);

				}

				return false;
			});

		}

		var last_loaded_post = XKit.storage.get("separator", "last_post", "");

		var current_last_post = $("body").find(".posts .post").not("#tumblr_radar").not(".new_post_buttons").first();

		//$(last_loaded_post).css("background","red");

		if (last_loaded_post !== "") {

			XKit.extensions.separator.check_for = last_loaded_post;

			if ($("#post_" + last_loaded_post).length > 0) {

				XKit.extensions.separator.insert($("#post_" + last_loaded_post));

			} else {

				// Is it deleted?
				if (XKit.extensions.separator.check_if_passed() === true) {

					var find_closest = true;

					if (typeof XKit.interface.where().endless !== "undefined") {
						if (XKit.interface.where().endless === false) {
							find_closest = false;
						}
					}

					if (find_closest) {
						XKit.extensions.separator.find_closest(100);
					} else {
						var current_last = $(".posts .post").first();
						var current_last_id = $(current_last).attr('data-post-id');
						if (current_last_id < XKit.extensions.separator.check_for) {
							XKit.extensions.separator.find_closest(100);
						} else {
							return;
						}
					}

				} else {

					// Probably after scrolling.
					XKit.post_listener.add("separator", XKit.extensions.separator.post_listener);

				}

			}

		}

		XKit.storage.set("separator", "last_post", $(current_last_post).attr('data-post-id'));

	},

	find_closest: function(distance) {

		var found_post = false;

		if (distance >= 5000000000) { return; }

		$(".posts .post").not("#new_post").each(function() {

			var m_id = $(this).attr('data-post-id');

			if (m_id >= XKit.extensions.separator.check_for - distance && m_id <= XKit.extensions.separator.check_for + distance) {

				XKit.extensions.separator.insert($(this));
				found_post = true;

				try {
					// Just in case.
					XKit.post_listener.remove("separator");
				} catch (e) {
					console.log("Unable to remove separator post listener.");
				}

				return false;

			}

		});

		if (found_post) { return; }

		XKit.extensions.separator.find_closest(distance * 5);


	},

	check_if_passed: function() {

		var current_last = $(".posts .post").last();
		var current_last_id = $(current_last).attr('data-post-id');

		// alert("checking for: " + XKit.extensions.separator.check_for + "\n\n" + "current last: " + current_last_id);

		if (current_last_id < XKit.extensions.separator.check_for) {

			// We scrolled way too much but still there is no post.
			return true;

		} else {

			return false;

		}

	},

	post_listener: function() {

		if ($("#post_" + XKit.extensions.separator.check_for).length > 0) {

			XKit.extensions.separator.insert($("#post_" + XKit.extensions.separator.check_for));
			XKit.post_listener.remove("separator");

		} else {

			// It was probably deleted? Let's check for that.
			XKit.extensions.separator.find_closest(100);

		}

	},

	insert: function(div) {

		$(div).parent().before("<div id=\"xkit-post-separator\">Here!</div>");

	},

	destroy: function() {
		this.running = false;
		$("#xkit-post-separator").remove();
		$("#separator_ul").remove();
		XKit.post_listener.remove("separator");
		XKit.tools.remove_css("separator");
		XKit.tools.remove_css("separator-thick");
	}
});
