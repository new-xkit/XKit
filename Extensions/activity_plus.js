//* TITLE Activity+ **//
//* VERSION 0.3.10 **//
//* DESCRIPTION Tweaks for the Activity page **//
//* DETAILS This extension brings a couple of tweaks for the Activity page, such as the ability to filter notes by type and showing timestamps. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

// defined in moment.js
/* globals moment */

XKit.extensions.activity_plus = new Object({

	running: false,

	preferences: {
		sep0: {
			text: "Notes view",
			type: "separator"
		},
		condensed_notes: {
			text: "Group notifications by post",
			default: true,
			value: true,
			experimental: true
		},
		notes_filter: {
			text: "Enable Filter Notes By Type",
			default: true,
			value: true,
			experimental: true
		},
		show_timestamps: {
			text: "Show timestamps on Notes",
			default: true,
			value: true
		},
		sep1: {
			text: "Graphs view",
			type: "separator"
		},
		hide_graphs: {
			text: "Hide the graphs (notes, new followers, etc.)",
			default: false,
			value: false
		},
		sep2: {
			text: "Navigation",
			type: "separator"
		},
		quick_switch: {
			text: "When I switch my blog on the sidebar, go to the Activity page of that blog",
			default: false,
			value: false
		}
	},

	in_type_filter: false,
	in_type_filter_button: "",

	run: function() {

		this.running = true;
		if (!XKit.interface.where().activity) { return; }

		XKit.tools.init_css("activity_plus");
		var m_css = "";

		try {

			if (this.preferences.hide_graphs.value === true) {
				m_css = m_css + " #user_graphs, .ui_stats { display: none; }";
			}

			if (this.preferences.show_timestamps.value === true || this.preferences.condensed_notes.value === true) {
				// m_css = m_css + " .part_activity { left: 95px !important; } .activity-notification .part_avatar { left: 57px !important; } .part_response { padding-left: 95px !important; }";
				setInterval(XKit.extensions.activity_plus.do_on_new, 3000);
			}

			if (this.preferences.notes_filter.value === true) {
				var m_html = "<div id=\"xkit-activity-plus-note-filter\">" +
						"<div data-type=\"\" class=\"xkit-note-filter-all selected\" title=\"All Notifications\">all</div>" +
						"<div data-type=\"is_reblog\" class=\"xkit-note-filter-reblog\" title=\"Reblogs\">reblogs</div>" +
						"<div data-type=\"is_like\" class=\"xkit-note-filter-like\" title=\"Likes\">likes</div>" +
						"<div data-type=\"is_reply\" class=\"xkit-note-filter-reply\" title=\"Replies\">replies</div>" +
						"<div data-type=\"is_follower\" class=\"xkit-note-filter-follow\" title=\"Followers\">follows</div>" +
						"<div data-type=\"is_user_mention\" class=\"xkit-note-filter-mention\" title=\"Mentions\">mentions</div>" +
						"<div data-type=\"from_mutual\" class=\"xkit-note-filter-from-mutual\" title=\"From Mutual Follows\">from mutual</div>" +
					"</div>";
				$(".ui_notes_switcher").append(m_html);

				$("#xkit-activity-plus-note-filter div").tipTip({maxWidth: "auto", edgeOffset: 10, delay: 10 });

				$("#xkit-activity-plus-note-filter div").bind("click", function() {

					var m_type = $(this).attr('data-type');

					$("#xkit-activity-plus-note-filter div").removeClass("selected");
					$(this).addClass("selected");
					XKit.tools.remove_css("activity_plus_note_filter_mutual");
					XKit.tools.remove_css("activity_plus_note_filter");


					if (m_type === "from_mutual") {

						XKit.tools.add_css(".ui_notes .activity-notification { display: none; } .ui_notes .activity-notification.is_friend { display: flex }", "activity_plus_note_filter_mutual");
						return;

					}



					if (m_type === "") {
						if ($(".activity-notification").length >= 350) {
							$('html, body').animate({
								scrollTop: 30
							}, 600);
							$( ".activity-notification:gt(200)" ).remove();
						}
						XKit.extensions.activity_plus.in_type_filter = false;
						return;
					}



					XKit.extensions.activity_plus.in_type_filter = true;
					XKit.extensions.activity_plus.in_type_filter_button = $(this);

					if (m_type === "is_reply") {
						m_type = "is_reply, .is_answer";
					}
					if (m_type === "is_user_mention") {
						m_type = "is_user_mention, .ui_notes .activity-notification.user_mention, .ui_notes .activity-notification.note_mention";
					}

					var m_filter_css = ".ui_notes .activity-notification { display: none; }";
					m_filter_css += ".ui_notes .activity-notification." + m_type + " { display: flex }";
					XKit.tools.add_css(m_filter_css, "activity_plus_note_filter");

					XKit.extensions.activity_plus.undo_condense();


				});

				$(window).scroll(function() {
					if ($(".ui_sticky").hasClass("is_sticky")) {
						$("#xkit-activity-plus-note-filter").addClass("center-me-up");
					} else {
						$("#xkit-activity-plus-note-filter").removeClass("center-me-up");
					}
				});

			}

			if (this.preferences.quick_switch.value === true) {

				$("#popover_blogs").find(".blog_title").each(function() {
					$(this).attr('href', $(this).attr('href').replace('/blog/', '/activity/'));
				});

			}

			if (this.preferences.condensed_notes.value === true) {
				XKit.extensions.activity_plus.do_condensed();
			}

			XKit.tools.add_css(m_css, "activity_plus_additional");

			if (XKit.installed.check("notificationblock")) {
				setTimeout(function() { XKit.extensions.activity_plus.do_on_new(); }, 1000);
			} else {
				XKit.extensions.activity_plus.do_on_new();
			}

		} catch (e) {

			console.log("activity_plus = " + e.message);

		}

	},

	last_post_info: -1,
	condensed_count: 0,
	condensed_id: 0,
	last_checked_item: "",

	do_condensed: function() {

		$(".activity-notification").not(".xkit-activity-plus-condensed-done").each(function() {

			$(this).addClass("xkit-activity-plus-condensed-done");

			if ($(this).hasClass("notificationblock-notification-blocked")) { return; }

			if ($(this).hasClass("is_follower")) {

				if (XKit.extensions.activity_plus.last_post_info === "_FOLLOWER") {

					$(this).addClass("xkit-activity-plus-condensed-item");
					$(this).addClass("xkit-activity-plus-condensed-item---" + XKit.extensions.activity_plus.condensed_id);
					$(this).attr('xkit-activity-plus-condense-id', XKit.extensions.activity_plus.condensed_id);
					XKit.extensions.activity_plus.condensed_count++;

					if (XKit.extensions.activity_plus.condensed_count === 2) {
						try {
							$(XKit.extensions.activity_plus.last_checked_item).addClass("xkit-activity-plus-condensed-item-parent").addClass("xkit-activity-plus-condensed-item---" + XKit.extensions.activity_plus.condensed_id);
						} catch (e) {
							// meh.
						}
					}

				} else {

					XKit.extensions.activity_plus.do_condensed_condense();

					XKit.extensions.activity_plus.last_post_info = "_FOLLOWER";
					XKit.extensions.activity_plus.condensed_count = 1;
					XKit.extensions.activity_plus.condensed_id = XKit.tools.random_string();
					XKit.extensions.activity_plus.last_checked_item = $(this);

				}

			} else {

				if ($(this).hasClass("is_like") || $(this).hasClass("is_reblog")) {

					var post_info = $(this).find(".ui_post_badge").attr("data-peepr");

					if (post_info === XKit.extensions.activity_plus.last_post_info) {

						$(this).addClass("xkit-activity-plus-condensed-item");
						$(this).addClass("xkit-activity-plus-condensed-item---" + XKit.extensions.activity_plus.condensed_id);
						$(this).attr('xkit-activity-plus-condense-id', XKit.extensions.activity_plus.condensed_id);
						XKit.extensions.activity_plus.condensed_count++;

						if (XKit.extensions.activity_plus.condensed_count === 2) {
							try {
								$(XKit.extensions.activity_plus.last_checked_item).addClass("xkit-activity-plus-condensed-item-parent").addClass("xkit-activity-plus-condensed-item---" + XKit.extensions.activity_plus.condensed_id);
							} catch (e) {
								// meh.
							}
						}

					} else {

						XKit.extensions.activity_plus.do_condensed_condense();
						XKit.extensions.activity_plus.last_post_info = post_info;
						XKit.extensions.activity_plus.condensed_count = 1;
						XKit.extensions.activity_plus.condensed_id = XKit.tools.random_string();
						XKit.extensions.activity_plus.last_checked_item = $(this);

					}

				}

			}

		});

	},

	do_condensed_condense: function() {

		if ((XKit.extensions.activity_plus.condensed_count - 1) <= 1) { return; }

		var m_html = "<div class=\"xkit-activity-plus-condensed-opener\" data-id=\"" + XKit.extensions.activity_plus.condensed_id + "\">" +
					"<b>" + (XKit.extensions.activity_plus.condensed_count - 1) + "</b> more items" +
				"</div>";
		$(".xkit-activity-plus-condensed-item---" + XKit.extensions.activity_plus.condensed_id).last().after(m_html);

		$(".xkit-activity-plus-condensed-item---" + XKit.extensions.activity_plus.condensed_id).addClass("xkit-activity-plus-yellow-mode-on");

		$(".xkit-activity-plus-condensed-opener").unbind("click");
		$(".xkit-activity-plus-condensed-opener").bind("click", function() {

			$(".xkit-activity-plus-condensed-item---" + $(this).attr('data-id')).addClass("xkit-activity-plus-condensed-item-opened");
			//$(".xkit-activity-plus-condensed-item---" + $(this).attr('data-id')).slideDown('slow');
			$(this).slideUp('slow');

		});

	},

	undo_condense: function() {

		$(".xkit-activity-plus-condensed-opener").remove();
		$(".xkit-activity-plus-condensed-done").removeClass("xkit-activity-plus-condensed-done");
		$(".xkit-activity-plus-condensed-done").removeClass("xkit-activity-plus-condensed-item");
		//$(XKit.extensions.activity_plus.in_type_filter_button).trigger('click');

	},

	do_on_new: function() {

		if (XKit.extensions.activity_plus.preferences.show_timestamps.value === true) {
			XKit.extensions.activity_plus.do_timestamps();
		}

		if (XKit.extensions.activity_plus.in_type_filter === true && XKit.extensions.activity_plus.preferences.condensed_notes.value === true) {
			XKit.extensions.activity_plus.undo_condense();
		} else {
			if (XKit.extensions.activity_plus.preferences.condensed_notes.value === true) {
				XKit.extensions.activity_plus.do_condensed();
			}
		}

	},

	do_timestamps: function() {

		$(".activity-notification").not(".xkit-activity-plus-timestamps-done").each(function() {

			$(this).addClass("xkit-activity-plus-timestamps-done");

			var m_timestamp = $(this).attr('data-timestamp');
			var dtx = new Date(m_timestamp * 1000);
			var dt = moment(dtx);
			var m_date = dt.format("hh:mm:ss a");

			var nowdate = new Date();
			var nowdatem = moment(nowdate);
			var m_relative_time = dt.from(nowdatem);

			var m_html = "<div class=\"xkit-activity-plus-timestamp\">" + m_date + " &middot; " + m_relative_time + "</div>";

			$(this).append(m_html);

		});

	},

	cpanel: function() {

		$("#xkit-timestamps-format-help").click(function() {
			XKit.window.show("Timestamp formatting", "This extension allows you to format the date by using a formatting syntax. Make your own and type it in the Timestamp Format box to customize your timestamps.<br/><br/>For information, please visit:<br/><a href=\"http://xkit.info/seven/support/timestamps/index.php\">Timestamp Format Documentation</a><br/><br/>Please be careful while customizing the format. Improper/invalid formatting can render Timestamps unusable. In that case, just delete the text you've entered completely and XKit will revert to its default formatting.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		});

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("activity_plus_note_filter_mutual");
		XKit.tools.remove_css("activity_plus");
		XKit.tools.remove_css("activity_plus_additional");
		$(".activity-notification").removeClass("xkit-activity-plus-timestamps-done");
		$(".xkit-activity-plus-timestamp").remove();
		$("#popover_blogs").find(".blog_title").each(function() {
			$(this).attr('href', $(this).attr('href').replace('/activity/', '/blog/'));
		});
	}

});
