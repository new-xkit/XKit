//* TITLE Tag Tracking+ **//
//* VERSION 1.5.1 **//
//* DESCRIPTION Shows your tracked tags on your sidebar **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_tags = new Object({

	running: false,
	slow: true,
	observer: new MutationObserver(function(mutations) {
		$(".result_link").each(function() { $(this).attr("target", "_BLANK"); });
	}),

	preferences: {
		"sep-1": {
			text: "Tag Search",
			type: "separator"
		},
		"show_new_notification": {
			text: "Show a [new] indicator in the tag search bar",
			default: true,
			value: true
		},
		"sep-2": {
			text: "Tags in Sidebar",
			type: "separator"
		},
		"show_tags_on_sidebar": {
			text: "Show Tags on sidebar",
			default: true,
			value: true
		},
		"only_new_tags": {
			text: "Only show tags with new posts",
			default: false,
			value: false
		},
		"prepend_sidebar": {
		    text: "Put tags at top of sidebar",
		    default: false,
		    value: false
		},
		"sep-3": {
			text: "Settings",
			type: "separator"
		},
		"open_in_new_tab": {
			text: "Open the tag results in a new window",
			default: false,
			value: false
		},
		"turn_off_warning": {
			text: "Turn off 'Too Many Tracked Tags' warning",
			default: false,
			value: false
		}
	},

	run: function() {

		try {

			XKit.tools.init_css("classic_tags");
			if ($("#dashboard_index").length === 0) {
				if (document.location.href.indexOf('/tagged') === -1) {
					return;
				}
			}

			if ($(".tracked_tags").length > 0) {
				XKit.extensions.classic_tags.show();
			}

		} catch(e) {

			console.log("Can't run Classic Tags:" + e.message);

		}
	},

	show: function() {
		if ($("#dashboard_index").length === 0) {
			if (document.location.href.indexOf('/tagged') === -1) {
				return;
			}
		}

		var show_this_tag = false;
		var extra_classes = "";
		var m_html = "";

		var total_tag_count = 0;

		$(".tracked_tag").each(function() {

			total_tag_count++;

		});
		if (XKit.extensions.classic_tags.preferences.show_tags_on_sidebar.value) {
			if (total_tag_count >= 21 && XKit.extensions.classic_tags.preferences.turn_off_warning.value !== true) {

				m_html = "<div class=\"classic-tags-too-much-tags-error\"><b>Too Many Tracked Tags:</b><br> After around 20 tags, Tumblr stops updating the status of all your tracked tags until you untrack some. Please track less than 20 tags for this extension to work.</div>";
				m_html = '<ul class="controls_section" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';

				if (document.location.href.indexOf('/tagged/') !== -1) {

					$("#right_column").append(m_html);

				} else {

					if (XKit.extensions.classic_tags.preferences.prepend_sidebar.value === true) {
						$("#right_column").prepend(m_html);
					} else if ($("ul.controls_section:eq(1)").length > 0) {
						if ($("#xim_small_links").length > 0) {
							$("#xim_small_links").after(m_html);
						} else {
							$("ul.controls_section:eq(1)").after(m_html);
						}
					} else {
						//$("#right_column").append(m_html);
						$(".controls_section_radar").before(m_html);
					}
				}

				return;

			}
		}

		if (XKit.extensions.classic_tags.preferences.show_new_notification.value === true && $(".result_sub_title").length !== 0) {
			$("#search_query").attr("placeholder", "Search [new]");
		}

		$(".tracked_tag").each(function() {

			if (parseInt($(this).find(".count").html()) > 0) {
				show_this_tag = true;
			} else {
				if (XKit.extensions.classic_tags.preferences.only_new_tags.value === true) {
					if (total_tag_count >= 21 && XKit.extensions.classic_tags.preferences.turn_off_warning.value === true) {
						// Show everything!
					} else {
						return;
					}
				}
			}
			var result = $(this).find(".result_link");
			var tag = result.attr('data-tag-result');
			var href = result.attr('href');

			if ($("body").attr('data-page-root') === href) {
				extra_classes = "selected";
			} else {
				extra_classes = "";
			}

			var m_title = $(this);
			var result_title = $(m_title).find(".result_title");
			result_title.html(result_title.html().replace("#",""));

			m_html = m_html + '<li class="xtag ' + extra_classes + '"><div class="hide_overflow">' + $(m_title).html() + '</div></li>';

		});
		if (m_html !== "" && XKit.extensions.classic_tags.preferences.show_tags_on_sidebar.value) {

			m_html = '<ul class="controls_section" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';

			if (document.location.href.indexOf('/tagged/') !== -1) {

				$("#right_column").children(".tag_controls").after(m_html);
			} else if (XKit.extensions.classic_tags.preferences.prepend_sidebar.value === true) {
			    $("#right_column").prepend(m_html);
			} else if ($("#xim_small_links").length > 0) {
				$("#xim_small_links").after(m_html);
			} else {
			    //$("#right_column").append(m_html);
				$(".controls_section_radar").before(m_html);
			}

			$(".xtag").each(function() {
				$(this).find(".count").html(parseInt($(this).find(".count").html()));
			});

		}
		if (XKit.extensions.classic_tags.preferences.open_in_new_tab.value === true) {
			var target = document.querySelector('#popover_search');
			XKit.extensions.classic_tags.observer.observe(target, {
				attributes: true
			});
			$(".result_link").each(function() { $(this).attr("target", "_BLANK"); });
		} else {
			$(".result_link").each(function() { $(this).attr("target", ""); });
		}

	},

	destroy: function() {
		XKit.tools.remove_css("classic_tags");
		$("#xtags").remove();
		$("#search_query").attr("placeholder", "Search Tumblr");
		XKit.extensions.classic_tags.observer.disconnect();
	}

});
