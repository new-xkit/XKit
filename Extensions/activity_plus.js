//* TITLE Activity+ **//
//* VERSION 0.4.0 **//
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
		unfold_rollups: {
			text: "Expand Tumblr-condensed reblog notes",
			default: true,
			value: true
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

			console.log("activity_plus = " + e.message, e);

		}

	},

	last_post_info: -1,
	condensed_count: 0,
	condensed_id: 0,
	last_checked_item: "",

	do_unfold: function() {
		function getNotesCount(foldedNote) {
			var activity = foldedNote.find(".activity-notification__activity_main > .activity")[0].textContent;
			// Intentionally wide regex since localization exists
			var count = activity.match(/\d+/)[0];
			if (!count) {
				return 1;
			}
			return parseInt(count) || 1;
		}

		function reblogToElement(reblog, summary, uiPostBadge) {
			var notification = document.createElement('div');
			notification.classList.add('activity-notification');
			notification.dataset.timestamp = Math.round(reblog.timestamp);
			notification.dataset.tumblelogName = reblog.blog_name;

			notification.classList.add('is_reblog');
			if (!reblog.added_text) {
				notification.classList.add('is_reblog_naked');
			}

			var reblogUrl = reblog.blog_url + 'post/' + reblog.post_id;
			var avatarUrl48 = reblog.avatar_url['48'];
			var avatarUrl128 = avatarUrl48.replace(/_48\./, '_128');

			var partReblogAdded = '';
			var andAdded = '';
			var conversational = '';
			if (reblog.added_text) {
				partReblogAdded = `<div class="activity-notification__activity_response is_part_reblog">
					<blockquote>${reblog.added_text}</blockquote>
				</div>`;
				andAdded = ' and added:';
				conversational = 'conversational';
				summary = '';
			}
			notification.innerHTML = `
			<div class="activity-notification__avatar">
				<div class="ui_avatar">
					<a href="${reblog.blog_url}" data-avatar-url="${avatarUrl128}" target="_blank" class="ui_avatar_link frame reblog" title="${reblog.blog_name}" data-peepr="{&quot;tumblelog&quot;:&quot;${reblog.blog_name}&quot;}">
						<div class="avatar" style="background-image: url('${avatarUrl48}');">
							<div class="inner_frame"></div>
							<div class="avatar_glass"></div>
							<span class="ui_avatar_tumblelog_name">thezed</span>
						</div>
					</a>
				</div>
			</div>
			<div class="activity-notification__activity">
				<div class="activity-notification__activity_message ${conversational}">
					<div class="activity-notification__activity_main">
						<span class="activity">
							<a class="js-hover-trigger-TumblelogPopover" href="${reblog.blog_url}" target="_blank" data-peepr="{&quot;tumblelog&quot;:&quot;${reblog.blog_name}&quot;}">${reblog.blog_name}</a>
							reblogged your post${andAdded}
						</span>
						${summary}
					</div>
					${partReblogAdded}
				</div>
			</div>
			<a class="activity-notification__glass" target="_blank" href="${reblogUrl}" data-peepr="{&quot;tumblelog&quot;:&quot;${reblog.blog_name}&quot;,&quot;postId&quot;:&quot;${reblog.post_id}&quot;}">
			</a>
			<div class="activity-notification__icon">
				<div class="activity-notification__icon_block badge">
				</div>
				${uiPostBadge}
			</div>`;

			return notification;
		}

		function requestNotes(followingElt, firstKnownNote, summary, uiPostBadge, url, notesRemaining) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://www.tumblr.com' + url,
				onload: function(data) {
					try {
						var resp = JSON.parse(data.responseText).response;
						var reblogs = resp.notes.filter(function(note) {
							return note.type === "reblog";
						});

						for (var i = 0; i < reblogs.length; i++) {
							var reblog = reblogs[i];
							if (firstKnownNote) {
								if (firstKnownNote.blog_name !== reblog.blog_name) {
									continue;
								}
								firstKnownNote = null;
							}

							var elt = reblogToElement(reblog, summary, uiPostBadge);
							followingElt.parentNode.insertBefore(elt, followingElt);
							notesRemaining -= 1;
						}

						if (notesRemaining > 0) {
							if (!resp._links) {
								console.warn('Activity+ was unable to unfold all a post\'s notes', url);
								return;
							}
							var nextUrl = resp._links.next.href;
							requestNotes(followingElt, firstKnownNote, summary, uiPostBadge, nextUrl, notesRemaining);
						}
					} catch (e) {
						console.error('Activity+ error', e);
					}
				},
				onerror: function(error) {
					console.error('Activity+ unfold error:', error);
				}
			});
		}

		$(".activity-notification").not(".xkit-activity-plus-unfold-done").each(function() {
			var note = $(this);
			note.addClass("xkit-activity-plus-unfold-done");
			if (!note.hasClass("rollup") || !note.hasClass("is_reblog")) {
				return;
			}
			var peepr = JSON.parse(note.find(".activity-notification__glass")[0].dataset.peepr);
			var notesUrl = `/svc/tumblelog/${peepr.tumblelog}/${peepr.postId}/notes?mode=all`;
			var timestamp = parseInt(note.attr('data-timestamp')) + 1;
			notesUrl += '&before_timestamp=' + timestamp;
			var notesRemaining = getNotesCount(note);

			var firstNotePeepr = JSON.parse(note.find(".activity > a")[0].dataset.peepr);
			var firstKnownNote = {
				blog_name: firstNotePeepr.tumblelog
			};
			var uiPostBadge = note.find(".ui_post_badge")[0].outerHTML;

			var summary = note.find(".summary")[0].outerHTML;
			requestNotes(note[0].nextSibling, firstKnownNote, summary, uiPostBadge, notesUrl, notesRemaining);
			note.remove();
		});
	},

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

						if (this.nextSibling &&
							this.nextSibling.classList.contains("xkit-activity-plus-condensed-done")) {
							XKit.extensions.activity_plus.do_condensed_condense();
							XKit.extensions.activity_plus.last_post_info = null;
							XKit.extensions.activity_plus.condensed_count = 0;
							XKit.extensions.activity_plus.condensed_id = XKit.tools.random_string();
							XKit.extensions.activity_plus.last_checked_item = null;
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

		if (this.preferences.unfold_rollups.value) {
			this.do_unfold();
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
