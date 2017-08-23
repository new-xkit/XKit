//* TITLE Tweaks **//
//* VERSION 5.5.3 **//
//* DESCRIPTION Various little tweaks for your dashboard. **//
//* DEVELOPER new-xkit **//
//* DETAILS These are small little tweaks that allows you customize your dashboard. If you have used XKit 6, you will notice that some of the extensions have been moved here as options you can toggle. Keep in mind that some of the tweaks (the ones marked with a '*') can slow down your computer. **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.tweaks = new Object({

	running: false,
	slow: true,
	run_interval: 0,
	run_interval_2: 0,
	hide_bubble_interval: 0,

	preferences: {

		"sep0": {
			text: "Popular tweaks",
			type: "separator",
		},
		"no_mobile_banner": {
			text: "Remove the mobile app banner",
			default: true,
			value: true,
			mobile_only: true
		},
		"wrap_tags": {
			text: "Wrap tags for easier reading",
			default: true,
			value: true
		},
		"grey_urls": {
			text: "Make URLs grey again",
			default: false,
			value: false,
			desktop_only: true
		},
		"fix_blockquotes": {
			text: "Slim block quotes for easier reading",
			default: false,
			value: false
		},
		"small_quotes": {
			text: "Slim Quote post text on Dashboard",
			default: false,
			value: false
		},
		"hide_share_menu": {
			text: "Hide the share button on posts",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_follows": {
			text: "Hide the mini-follow buttons on posts and notifications",
			default: false,
			value: false,
			desktop_only: true
		},
		"photo_replies": {
			text: "Auto-enable photo replies on all posts I create",
			default: false,
			value: false,
			experimental: true
		},
		"sep001": {
			text: "Post / Post Editor tweaks",
			type: "separator",
		},
		"classic_post_titles": {
			text: "Use 'Classic' (bold and smaller) post titles / headings",
			default: false,
			value: false
		},
		"bold_links_new": {
			text: "Use 'Classic' (bold) links on text posts",
			default: false,
			value: false
		},
		"swap_buttons": {
			text: "Swap Post/Save and Cancel buttons",
			default: false,
			value: false
		},
		"tag_slot_separator": {
			text: "Add a separator line for Tag section on editor",
			default: false,
			value: false
		},
		"full_width_gifs": {
			text: "Add a button in post editor options to toggle full-width GIFs",
			default: true,
			value: true
		},
		"sep1": {
			text: "User Interface tweaks",
			type: "separator",
		},
		"slim_activity_feed": {
			text: "Re-slim the Activity feed",
			default: false,
			value: false
		},
		"old_sidebar_width": {
			text: "Return the sidebar to its original width",
			default: false,
			value: false
		},
		"old_photo_margins": {
			text: "Use the old 500/245/160px photo dimensions on posts",
			default: false,
			value: false
		},
		"show_new_on_secondary": {
			text: "Show new post icons on secondary dashboard pages",
			default: true,
			value: true
		},
		"real_red": {
			text: "Use a real red on notifications and post like buttons",
			default: false,
			value: false
		},
		"old_chat_posts": {
			text: "Show Chat posts in classic interface",
			default: false,
			value: false
		},
		"scroll_new_posts": {
			text: "Scroll the new posts icons along with me",
			default: false,
			value: false
		},
		"slim_popups": {
			text: "Slim down the popup menus such as the user menu",
			default: false,
			value: false,
			desktop_only: true
		},
		"always_show_move_to_top": {
			text: "Always show 'Move to top' button on the queued posts page",
			default: true,
			value: true
		},
		"split_gear": {
			text: "Move the edit/remove buttons out of the gear menu",
			default: false,
			value: false,
			experimental: true,
			desktop_only: true
		},
		"border_asks": {
			text: "Show border around ask posts and answers",
			default: false,
			value: false
		},
		"wide_sources": {
			text: "Increase max width of post sources to avoid shortening",
			default: true,
			value: true
		},
		"sep2": {
			text: "Dashboard tweaks",
			type: "separator",
		},
		"hide_like_animation": {
			text: "Hide the like/unlike heart animation",
			default: false,
			value: false
		},
		"pin_avatars": {
			text: "Stop avatars from scrolling along with the post",
			default: false,
			value: false,
			desktop_only: true
		},
		"no_footer_background": {
			text: "Classic Post Footer look",
			default: false,
			value: false
		},
		"dont_show_mine_on_dashboard": {
			text: "Don't show my own posts on my dashboard",
			default: false,
			value: false
		},
		"dont_show_liked_on_dashboard": {
			text: "Don't show liked posts on my dashboard",
			default: false,
			value: false
		},
		"hide_explore": {
			text: "Hide explore button on trending posts",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_explore_buttons": {
			text: "Hide the explore link at the top of the page and in the sidebar",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_notes": {
			text: "Hide the notes on posts",
			default: false,
			value: false
		},
		"hide_tags": {
			text: "Hide the tags on posts",
			default: false,
			value: false
		},
		"show_top_arrow": {
			text: "Always show the scroll to top arrow",
			default: false,
			value: false
		},
		"larger_top_arrow": {
			text: "Make the scroll to top arrow larger",
			default: false,
			value: false
		},
		"hide_bubble": {
			text: "Hide the new post bubble when you are not in dashboard",
			default: false,
			value: false,
			slow: true
		},
		"no_animate_scroll": {
			text: "Don't animate scrolling when using J/K to move between posts",
			default: false,
			value: false
		},
		"fix_small_text_on_reblogs": {
			text: "Make small text in reblogs the same size as small text in own posts",
			default: true,
			value: true
		},
		"responsive_dash": {
			text: "Make the dashboard resize with the window.",
			default: false,
			value: false
		},
		"sep3": {
			text: "Navigation and Search tweaks",
			type: "separator",
		},
		"redirect_to_everything": {
			text: "On popular tags, always show all posts, not just the popular ones",
			default: false,
			value: false,
			experimental: true
		},
		"hide_blog_search": {
			text: "Hide blogs on the search bar suggestions",
			default: false,
			value: false
		},
		"sep4": {
			text: "Sidebar tweaks",
			type: "separator",
			desktop_only: true,
		},
		"slim_sidebar": {
			text: "Slim sidebar buttons",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_section_headers": {
			text: "Hide section headers on sidebar",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_radar": {
			text: "Hide the Tumblr radar",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_find_blogs": {
			text: "Hide \"Find Blogs\" button",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_recommended": {
			text: "Hide Recommended blogs",
			default: false,
			value: false,
			desktop_only: true
		},
		"show_customize": {
			text: "Show Mass Post Editor and Blog Settings buttons",
			default: true,
			value: true,
			desktop_only: true
		},
		"hide_follower_count": {
			text: "Hide your follower count in the account menu and on the sidebar",
			default: false,
			value: false,
			desktop_only: true
		}
	},

	default_page_title: "",

	run: function() {
		this.running = true;
		this.css_to_add = "";

		if (XKit.extensions.tweaks.preferences.slim_activity_feed.value) {
			XKit.tools.add_css(".ui_notes .activity-notification{ padding: 10px; }" +
			".ui_notes .activity-notification .activity-notification__activity .activity-notification__activity_message{ display: block; }" +
			".ui_notes .activity-notification .activity-notification__activity{ transform: translate(-10px); }" +
			".ui_notes .activity-notification .activity-notification__activity .activity-notification__activity_message.conversational{ background-color: rgba(0,0,0,0) !important; padding: 5px 0; }" +
			".ui_notes .activity-notification .activity-notification__icon{	padding: 0; min-width: 25px; }" +
			".ui_notes .activity-notification .activity-notification__activity .activity-notification__activity_message .activity-notification__activity_response blockquote{ margin: 10px 0 5px 5px; padding-left: 15px; border-left: 3px solid #d9d9d9; }" +
			".ui_notes .activity-notification .activity-notification__avatar .ui_avatar{ margin: 0; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge{ width: 25px; height: 25px; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge.regular{ background-position: -784px -2px; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge.quote{ background-position: -784px -30px; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge.ask_answer{ background-position: -785px -171px; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge.link{ background-position: -785px -58px; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge.conversation{ background-position: -786px -85px; }" +
			".ui_notes .activity-notification .activity-notification__icon .ui_post_badge.audio{ background-position: -785px -114px; }" +
			".ui_notes .date_header, .ui_notes .date_header.date_activity{ padding: 0 10px; }" +
			".activity-popover-notifications .ui_notes .activity-notification .activity-notification__avatar{ height: 25px; }" +
			".activity-notification div.retags{ margin: 0 !important; padding-left: 41px !important; }" +
			".is_retags .activity-notification__activity_message.conversational{ margin-bottom: 0 !important; }" +
			".xkit-activity-plus-timestamp{ transform: translate(-13px) }" +
			".xkit-reply-button-pn.xkit-notes-activity{ transform: translate(31px,-9px) }",
			"tweaks_slim_activity_feed");
		}

		if (XKit.extensions.tweaks.preferences.old_sidebar_width.value) {
			XKit.tools.add_css(".right_column, .toastr .toast-kit, .small_links {width: 250px !important;} " +
			".left_column{margin-left:75px;} #sidebar_footer_nav{margin-left: -420px !important;} .pagination{padding-left:160px;}",
			"tweaks_old_sidebar_width");
		}

		if (XKit.extensions.tweaks.preferences.old_photo_margins.value) {
			XKit.post_listener.add("tweaks_old_photo_margins", XKit.extensions.tweaks.old_photo_margins);
		}

		if (XKit.extensions.tweaks.preferences.no_mobile_banner.value) { //mobile stuff
			XKit.tools.add_css(".mobile_app_banner, .mobile-banner {display: none}", "tweaks_no_mobile_banner");
			$(".mobile_banner_active").removeClass("mobile_banner_active");
			$(".mobile-app-banner-visible").removeClass("mobile-app-banner-visible");
		}

		if (XKit.extensions.tweaks.preferences.grey_urls.value) {
			XKit.tools.add_css(".xkit-outbox-link {color: #A1A1A1 !important; } .post_full .post_header .post_info .post_info_link:first-child {color: #A1A1A1 !important; } .post-form--header .tumblelog-select .caption {color: #A1A1A1 !important; } .post_brick .post_header .post_info_tumblelog {color: #A1A1A1 !important; }", "tweaks_grey_urls");
		}

		if (XKit.extensions.tweaks.preferences.hide_bubble.value && !XKit.interface.where().dashboard) {

			XKit.extensions.tweaks.default_page_title = document.title;
			$("#new_post_notice_container").remove();
			this.hide_bubble_interval = setInterval(function() {
				document.title = XKit.extensions.tweaks.default_page_title;
			}, 1000);

		}

		if (XKit.extensions.tweaks.preferences.redirect_to_everything.value) {
			if (document.location.href.indexOf("://www.tumblr.com/tagged/") !== -1 && $(".tag_editors").length > 0) {
				var m_tag = document.location.href.replace("www.tumblr.com/tagged/", "");
				m_tag = m_tag.replace("tumblr.com/tagged/", "");
				m_tag = m_tag.replace("https://", "");
				m_tag = m_tag.replace("http://", "");
				m_tag = m_tag.replace("#", "");
				var redirect_me = true;
				if (m_tag.substring(m_tag.length - 1) === "/") {
					m_tag = m_tag.substring(0, m_tag.length - 1);
				}
				if (m_tag.indexOf("/") !== -1) {
					var m_array = m_tag.split("/");
					if (m_array[m_array.length - 1] === "everything") {
						// Already on everything page.
						redirect_me = false;
					}
				}
				if (redirect_me === true) {
					document.location.href = "http://tumblr.com/tagged/" + m_tag + "/everything";
				}
			}
		}


		if (XKit.extensions.tweaks.preferences.show_new_on_secondary.value) {

			try {

				if (document.location.href.indexOf('/dashboard') !== -1) {

					if (!XKit.browser().mobile) { // mobile stuff
						if ($("#new_post_buttons").length > 0) {

						// Save this.
							var m_to_save = $("#new_post_buttons")[0].outerHTML;
							m_to_save = "!" + btoa(m_to_save);
							XKit.storage.set("tweaks", "new_post_buttons_html", m_to_save);

						} else {

							var m_btn_html = XKit.storage.get("tweaks", "new_post_buttons_html", "");
							if (m_btn_html !== "" || typeof m_btn_html !== "undefined") {
								if (m_btn_html.substring(0, 1) === "!") {
									m_btn_html = atob(m_btn_html.substring(1));
									$("#posts").prepend(m_btn_html);
								}
							}
						}
					}

				}

			} catch (e) {

				console.log("Tweaks -> Can't run show_on_secondary, " + e.message);

			}

		}

		if (XKit.extensions.tweaks.preferences.split_gear.value) {
			XKit.post_listener.add("tweaks_split_gear", XKit.extensions.tweaks.split_gear);
			XKit.extensions.tweaks.split_gear();
		}

		if (XKit.extensions.tweaks.preferences.border_asks.value) {
			XKit.extensions.tweaks.add_css(".post-composer_note-post .note_item, .post_full.is_note .post-body .note_item, .post_full.is_note .post_body .note_item, .post_brick.is_note .note_item { border-color: #ccc } .post_full.is_note .nipple, .post-composer_note-post .nipple, .post_brick.is_note .nipple { border-left: 8px solid #ccc } .post_full.is_note .nipple::after, .post-composer_note-post .nipple::after, .post_brick.is_note .nipple::after { display: inline; position: absolute; content: ''; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 8px solid #f2f2f2; right: 1px; top: -8px }", "xkit_tweaks_border_asks");
		}

		if (XKit.extensions.tweaks.preferences.wide_sources.value) {
			XKit.tools.add_css(".post-source-link { max-width: 400px !important }", "xkit_tweaks_wide_sources");
		}

		if (XKit.extensions.tweaks.preferences.hide_radar.value) {
			$("#tumblr_radar").css("display", "none");
			$(".radar_header").parent().css("display", "none");
		}

		if (XKit.extensions.tweaks.preferences.photo_replies.value) {
			this.run_interval = setInterval(function() {
				$("#allow_photo_replies").attr('checked', true);
			}, 3000);
		}

		if (XKit.extensions.tweaks.preferences.real_red.value) {
			XKit.extensions.tweaks.add_css(" .like.liked.post_control:after { background-position: 4px 3px !important; background-size: auto auto !important; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDQzQ0MxODI5Qzc4MTFFMzg1NkE5NjNCNTgyRjU3NjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDQzQ0MxODM5Qzc4MTFFMzg1NkE5NjNCNTgyRjU3NjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENDNDQzE4MDlDNzgxMUUzODU2QTk2M0I1ODJGNTc2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENDNDQzE4MTlDNzgxMUUzODU2QTk2M0I1ODJGNTc2MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Poem3hoAAAEdSURBVHjaYtypzQADjEBsDcQGQPweiLcD8TsGTCAExF5ALADEF4D4KBD/B0mwQBVoAPEKINZH0vQFiMuAeDqSWCYQdwExD5LYRSCOAOIbTEBCEIh3oxnEANUwDaoZBHqhfB40dfpQ/YIglxUCsQwDblAKxJZAbINHDUh/PshlPgyEgQ0RanxBhikyUAcoMjFQDzCCDHtEJcMeMUFjghpgF8iwuUD8h0KDQPrnggy7DsRTKDRsCizRgkA5EB8n06DjUP0MMMN+AbEfEJ8j0aBzUH2/kA0DgTdA7ADEa4g0aDVU/RuYAHo6+wzEoUCcBWVjA5+h8mHoanAlWlBJoQXE69DE10LFp2PThC8HPAHiYGgmXwSlQ6DiWAFAgAEALHgzuY5LA00AAAAASUVORK5CYII=);  } #tab_switching .tab_notice, #header .tab .tab_notice, .popover_blogs .tab_notice, .blog_menu .selected_blog .tab_notice { background-color: #bb2502; }", "xkit_tweaks_real_red");
		}

		if (XKit.extensions.tweaks.preferences.no_footer_background.value) {
			XKit.extensions.tweaks.add_css(".post_full .post_footer { margin-top: 13px; background: transparent !important; border-top: 1px solid #e3e3e3; }", "xkit_tweaks_no_footer_background");
		}

		if (XKit.extensions.tweaks.preferences.hide_blog_search.value) {
			XKit.extensions.tweaks.add_css(".blog.search_results_section { display: none !important }", "xkit_tweaks_hide_blog_search");
		}

		if (XKit.extensions.tweaks.preferences.classic_post_titles.value) {
			XKit.extensions.tweaks.add_css(".post-typography-update .post.is_conversation .post_content .post_title, .post-typography-update .post.is_regular .post_content .post_title, .post-typography-update .post .post-content .title-field *, .reblog-title { font-family: \"Helvetica Neue\", Helvetica, sans-serif !important; font-size: 22px !important; font-weight: bold !important; line-height: normal !important; min-height: 25px !important; } .post_title { font-size: 22px !important; line-height: normal !important; font-weight: bold !important; font-family: \"Helvetica Neue\", Helvetica, sans-serif !important; }", "xkit_tweaks_classic_post_titles");
			XKit.extensions.tweaks.add_css(".post .post_content h2 { font-size: 15px !important; line-height: normal !important; font-weight: bold !important; font-family: \"Helvetica Neue\", Helvetica, sans-serif !important; }", "xkit_tweaks_classic_post_titles");
		}

		if (XKit.extensions.tweaks.preferences.bold_links_new.value) {
			XKit.extensions.tweaks.add_css(".post .post-content a, .post .post_content a { font-weight: bold !important; }", "xkit_tweaks_bold_links");
		}

		if (XKit.extensions.tweaks.preferences.swap_buttons.value) {
			XKit.extensions.tweaks.add_css(".post_ask_answer_buttons_flipped .chrome.blue { margin-left: 0; } .post_ask_answer_buttons_flipped .chrome { margin-left: 0; margin-right: 5px; float: left; } .post_ask_answer_buttons_flipped .ask_cancel_button { float: right; margin-right: 0; } .post-form--controls .control.left { text-align: right; display: inline-block; width: auto; float: right; } .post-form--controls .control.right { text-align: left; display: inline-block; width: auto; float: left; } .post-forms--social-buttons .social-buttons { position: absolute; left: 50% }", "xkit_tweaks_bold_links");
		}

		if (XKit.extensions.tweaks.preferences.tag_slot_separator.value) {
			XKit.extensions.tweaks.add_css(".post-form--tag-editor { border-top: 1px solid rgb(240,240,240); padding-top: 15px; }", "ffff");
		}

		if (XKit.extensions.tweaks.preferences.full_width_gifs.value) {
			XKit.interface.post_window_listener.add("tweaks-full-width-gifs", XKit.extensions.tweaks.full_width_gifs_do_first);
		}

		if (XKit.extensions.tweaks.preferences.show_top_arrow.value) {
			XKit.extensions.tweaks.add_css(".elevator-wrapper { display: block !important; } .elevator { opacity: 1 !important; visibility: visible !important; transform: translateY(0px) translateZ(0px) !important; }", "xkit_tweaks_show_top_arrow");
			XKit.tools.add_function(function() {
				Tumblr.KeyCommands.elevate = function() {jQuery("html, body").stop(true).animate({scrollTop:0}, "slow");};
			}, true, "");
		}

		if (XKit.extensions.tweaks.preferences.larger_top_arrow.value) {
			XKit.extensions.tweaks.add_css(".elevator-wrapper { transform: scale(2.5) translateZ(0px); }", "xkit_tweaks_larger_top_arrow");
			XKit.tools.add_function(function() {
				Tumblr.KeyCommands.elevate = function() {jQuery("html, body").stop(true).animate({scrollTop:0}, "slow");};
			}, true, "");
		}

		if (XKit.extensions.tweaks.preferences.no_animate_scroll.value) {
			XKit.tools.add_function(function() {
				Tumblr.KeyCommands.animate_scroll = false;
			}, true, "");
		}

		if (XKit.extensions.tweaks.preferences.fix_small_text_on_reblogs.value) {
			XKit.extensions.tweaks.add_css(".is_reblog small { font-size: 12px !important; }", "xkit_tweaks_larger_small_text_on_reblogs");
		}

		if (XKit.extensions.tweaks.preferences.responsive_dash.value && XKit.interface.where().dashboard) {
			XKit.extensions.tweaks.add_css(
				".l-container--two-column-dashboard {padding-left: 0px!important;padding-right: 0px!important;}" +
				"@media screen and (max-width: 899px) {" +
					".right_column {visibility: hidden;display: none;width: 0px!important;}" +
					"#sidebar_footer_nav {visibility: hidden;}" +
					".l-content {width: 625px;}" +
					".l-container--two-column-dashboard {width: 645px!important;}" +
				"}");
		}

		if (XKit.extensions.tweaks.preferences.slim_popups.value) {
			XKit.extensions.tweaks.add_css(".tumblelog_menu_link { padding: 6px 10px 6px 34px !important; font-size: 13px !important; }" +
						".tumblelog_menu .tumblelog_menu_link:before { left: 7px !important; top: 5px !important; } ", "xkit_tweaks_slim_popups");
		}

		if (XKit.extensions.tweaks.preferences.hide_like_animation.value) {
			XKit.extensions.tweaks.add_css(" .post .post_animated_heart { display: none !important; width: 0 !important; }", "xkit_tweaks_hide_like_animation");
		}

		if (XKit.extensions.tweaks.preferences.pin_avatars.value) {
			if (!XKit.browser().mobile) { // mobile stuff
				XKit.extensions.tweaks.add_css(".post_avatar.post-avatar--fixed { position: absolute !important; top: 0 !important; left: -85px !important; }  .post_avatar.post-avatar--absolute { position: absolute; top: 0 !important; left: -85px !important; bottom: inherit !important; }  .post_avatar.post-avatar--sticky .avatar-wrapper { position: absolute !important; top: 0px !important; height: auto; width: auto; } .post_avatar.post-avatar--sticky { height: 64px !important; }", "xkit_pin_avatars");
			}
		}

		if (XKit.extensions.tweaks.preferences.small_quotes.value) {
			XKit.extensions.tweaks.add_css(".post.is_quote .post_title.large, .post.is_quote .post_title.extra_large { font-size: 20px; line-height: 22px; }", "xkit_tweaks_small_quotes");
		}

		if (XKit.extensions.tweaks.preferences.hide_recommended.value) {
			XKit.extensions.tweaks.add_css("#recommended_tumblelogs, .recommended_tumblelogs, .trending_tumblelogs, .is_recommended, .recommended-unit-container { display: none !important; }", "xkit_tweaks_hide_recommended");
		}

		if (XKit.extensions.tweaks.preferences.hide_share_menu.value) {
			XKit.tools.add_css(".post_control.share { display: none; } ", "xkit_tweaks_hide_share");
		}

		if (XKit.extensions.tweaks.preferences.hide_explore.value) {
			XKit.extensions.tweaks.add_css(".post .explore-trending-badge-footer, .post .recommendation-reason-footer { display: none; } ", "xkit_tweaks_hide_explore");
		}

		if (XKit.extensions.tweaks.preferences.hide_explore_buttons.value) {
			XKit.extensions.tweaks.add_css("#discover_button, a[href=\"/explore\"] { display: none; } ", "xkit_tweaks_hide_explore_buttons");
		}

		if (XKit.extensions.tweaks.preferences.hide_notes.value) {
			XKit.extensions.tweaks.add_css(".post .post_notes { visibility: hidden; } ", "xkit_tweaks_hide_notes");
		}

		if (XKit.extensions.tweaks.preferences.hide_tags.value) {
			XKit.extensions.tweaks.add_css(".post .post_tags { display: none; } ", "xkit_tweaks_hide_tags");
		}

		if (XKit.extensions.tweaks.preferences.hide_section_headers.value) {
			XKit.extensions.tweaks.add_css(".controls_section li.section_header { display: none; } ", "xkit_tweaks_hide_section_headers");
		}

		if (XKit.extensions.tweaks.preferences.hide_find_blogs.value) {
			$("a.spotlight").parent().css("display", "none");
		}

		if (XKit.extensions.tweaks.preferences.always_show_move_to_top.value) {
			XKit.extensions.tweaks.add_css("#posts .post .post_control.move_to_top { display: inline-block !important; } ", "always_show_move_to_top");
		}

		if (XKit.extensions.tweaks.preferences.slim_sidebar.value) {
			var moz_fix = "";
			if (XKit.browser().firefox) {
				moz_fix = " top: -5px !important; ";
			}
			var m_css = "li.section_header { height: 22px !important; line-height: 20px !important; font-size: 11px !important; } .activity canvas { zoom: 0.6; -moz-transform: scale(0.6); } .controls_section li { height: 25px; line-height: 19px; } .controls_section li a, .controls_section li .hide_overflow { line-height: 23px; font-size: 12px; } .controls_section li a { padding: 3px 13px 10px 40px; font-size: 13px; } .controls_section li>a:after { zoom: 0.80; -moz-transform: scale(0.77); left: 14px; top: -2px; " + moz_fix + " } .controls_section a .count { top: 3px !important; } .controls_section .sub_control.link_arrow { margin-top: -6px; } #popover_button_blogs { height: auto; } #fan_mail_controls, #fan_mail_controls li, #recommended_tumblelogs li, #tag_editors li, #tag_contributors li { height: auto; } .controls_section a .count { line-height: 19px; } .controls_section li .icon_left { top: 2px !important; position: absolute; left: 12px !important; font-size: 18px !important; line-height: 21px !important; }" +
				".controls_section.follow_list.recommended_tumblelogs>li, .controls_section.follow_list>li { height: auto !important; } .controls_section li a, .controls_section li .hide_overflow {line-height: 20px !important;}" +
				".controls_section li a {padding: 0 0 0 0; } .xtag .result_title {padding: 1px 0px 8px 40px !important; } .result_sub_title {padding: 1px 0px !important; } .controls_section a .count {top: 0px !important; } .identity .controls_section a .count {right: 15px; } .icon_plus.follow_icon { font-size: 24px; }";
			if (!$("body").hasClass("settings_actions_tumblelog")) {
				XKit.extensions.tweaks.add_css(m_css, "xkit_tweaks_slim_sidebar");
			}
		}

		if (XKit.extensions.tweaks.preferences.hide_follows.value) {
			XKit.extensions.tweaks.add_css(".note a.follow {display: none !important; } .notification_follow, .reblog_follow_button { display: none !important; } #posts .notes_outer_container.popover .note a.follow { display: none !important; } #posts .notes_outer_container.popover .note.like a.block { right: 16px; }", "xkit_tweaks_hide_follows");
		}

		if (XKit.extensions.tweaks.preferences.fix_blockquotes.value) {
			XKit.extensions.tweaks.add_css("#posts .post_content blockquote { border-left: solid 2px #e7e7e7; padding-left: 8px; margin-left: 0px; }", "xkit_tweaks_fix_blockquotes");
		}

		if (XKit.extensions.tweaks.preferences.dont_show_liked_on_dashboard.value) {
			XKit.extensions.tweaks.add_css("#posts .post.is_liked { display: none !important; }", "xkit_tweaks_dont_show_liked");
			XKit.post_listener.add("tweaks_dont_show_liked", XKit.extensions.tweaks.check_for_liked_posts);
			XKit.extensions.tweaks.check_for_liked_posts();
		}

		if (XKit.extensions.tweaks.preferences.old_chat_posts.value) {
			XKit.extensions.tweaks.add_css(".post_full.is_conversation .conversation_lines { border: 1px solid rgb(200,200,200); padding: 0px; font: normal 14px/1.4 \"Helvetica Neue\",\"HelveticaNeue\",Helvetica,Arial,sans-serif; } li.chat_line { padding: 10px 17px !important; border-bottom: 1px solid rgb(200,200,200); } li.chat_line:last-child { border-bottom: 0; }", "xkit_tweaks_fix_blockquotes");
		}


		if (XKit.extensions.tweaks.preferences.hide_follower_count.value) {
			XKit.extensions.tweaks.add_css(
				".popover_menu_item_blog a[href*='/followers'] .blog-sub-nav-item-data { display: none; } " +
				"[data-blog-controls-count='follower_count'] .count { display: none; }",
			"xkit_tweaks_hide_follower_count");
		}

		if (XKit.extensions.tweaks.preferences.wrap_tags.value &&
				XKit.interface.is_tumblr_page()) {

			XKit.extensions.tweaks.add_css(
				".post .tags { " +
					"width: 100% !important; " +
					"display: block !important; " +
					"overflow:visible; " +
					"height:auto; " +
					"white-space: normal; " +
				"} " +
				".post_brick .post_tags { " +
					"margin-left: 16px;" +
					"white-space: normal !important; " +
				"} " +
				".post_tag:first-of-type { " +
					"margin-left: 0px !important; " +
				"} " +
				".post .footer_links.with_tags { " +
					"overflow:visible !important; " +
					"display: block !important; " +
				"} " +
				".post .footer_links.with_tags span, .footer_links.with_tags .source_url { " +
					"display:block !important; " +
					"overflow:visible !important; " +
				"} " +
				".source_url_gradient { display: none !important; } " +
				"span.tags { white-space:normal !important; } " +
				"span.with_blingy_tag a.blingy { height:auto !important; display:inline-block !important; }  " +
				".source_url, .post_tags_wrapper { display: block !important; } ",
			"xkit_tweaks_wrap_tags");

			XKit.extensions.tweaks.add_css(".post.post_full .post_tags { white-space: normal !important; } .post .post_tags a { font-size: 12px; } .post_full .post_tags:after { background: none !important; }", "xkit_tweaks_wrap_tags_v2");
			$(document).on('mouseup mousemove mouseover mousedown mouseout', '.post_tags_inner', function(e) {
				$(this).parent().removeClass("draggable");
				$(this).removeClass("post_tags_inner");
				$(this).addClass("xkit_post_tags_inner_add_back");
			});
		}

		if (document.location.href.indexOf('/dashboard') !== -1) {

			if (XKit.extensions.tweaks.preferences.dont_show_mine_on_dashboard.value) {
				if (!XKit.browser().mobile) { //mobile stuff
					XKit.extensions.tweaks.add_css("#posts .post.is_mine { display: none !important; } #posts .post.new_post_buttons { display: block !important; }", "xkit_tweaks_dont_show_mine_on_dashboard");
					//XKit.post_listener.add("tweaks_fix_hidden_post_height", XKit.extensions.tweaks.fix_hidden_post_height);
					XKit.extensions.tweaks.fix_hidden_post_height();
				}
			}

		}

		if (XKit.extensions.tweaks.preferences.scroll_new_posts.value) {
			if (!XKit.browser().mobile) { // mobile stuff
				$(window).scroll(function() {
					if ($("#new_post").length > 0) {
						if ($(window).scrollTop() >= 200) {
							$("body").addClass("xkit-new-post-scrolls-page");
							$("#new_post").addClass("xkit-new-post-scrolls");
						} else {
							$("#new_post").removeClass("xkit-new-post-scrolls");
							$("body").removeClass("xkit-new-post-scrolls-page");
						}
					}
				});
				$("#new_post").click(function() {
					$('html, body').animate({
						scrollTop: 30
					}, 500);

					$("#new_post").removeClass("xkit-new-post-scrolls");
					$("body").removeClass("xkit-new-post-scrolls-page");

				});
				XKit.extensions.tweaks.add_css(	".xkit-new-post-scrolls-page #posts { padding-top: 85px; }" +
						"#new_post.xkit-new-post-scrolls { min-width: 540px; position: fixed; top: -5px; z-index: 100; opacity: 0.75; min-height: 88px !important; }" +
						"#new_post.xkit-new-post-scrolls:hover { opacity: 1; }" +
						"#new_post.xkit-new-post-scrolls #post_buttons { top: -5px !important; }" +
						"#new_post.xkit-new-post-scrolls .post_avatar { display: none; }", "xkit_tweaks_scroll_new_posts");
			}
		}

		if (XKit.extensions.tweaks.preferences.show_customize.value) {
			var user_url = XKit.tools.get_current_blog();

			if (typeof user_url === "undefined") {
				XKit.tools.add_css(XKit.extensions.tweaks.css_to_add, "xkit_tweaks");
				return;
			}

			// Patch for custom domains.
			if ($("#popover_blogs > .popover_inner").length > 0) {
				user_url = $("#popover_blogs > .popover_inner").children(".item:first-child").attr('id').substring(9);
			}

			var add_mega_link = true;
			if ($(".small_links").length > 0) {
				try {
					$(".small_links a").each(function() {
						var m_link = $(this).attr('href');
						if (m_link.indexOf('/mega-editor') !== -1) {
							add_mega_link = false;
							return false;
						}
					});
				} catch (e) {
					// Meh.
				}
			}

			var x_html = '<a class=\"xkit-small-blog-setting-link\" href="/blog/' + user_url.replace("/", "") + '/settings/" target="_blog_settings">Blog Settings</a>';
			if (add_mega_link) {
				x_html = '<div class="small_links by-xkit">' +
											'<a href="/mega-editor/' + user_url + '" target="_mass_post_editor">Mass Post Editor</a>' +
											'<a href="/blog/' + user_url.replace("/", "") + '/settings/" target="_mass_post_editor">Blog Settings</a>' +
						'</div>';
			}
			if ($(".small_links").length > 0 && !add_mega_link) {
				$(".small_links:first").append(x_html);
			} else {
				if ($("#dashboard_controls_open_blog").length > 0) {
					// If using Old Stats, append there
					$("#dashboard_controls_open_blog").after(x_html);
				} else {
					// Otherwise just tack it onto the end of the right column's controls
					$(".controls_section:last").after(x_html);
				}
			}
		}

		XKit.tools.add_css(XKit.extensions.tweaks.css_to_add, "xkit_tweaks");

	},

	old_photo_margins: function() {

		XKit.tools.add_css(".post_full.is_photoset .photoset .photoset_row .photoset_photo {margin-left: 0;}", "tweaks_old_photo_margins");

		$(".post_media_photo.image").each(function() {
			if ($(this).attr("width") > 500 ) {
				$(this).attr("style", "margin-left: 20px; width: 500px;");
				$(this).attr("height", "auto");
			}
		});

		$(".photoset_row").each(function() {

			var photoset_row = $(this);
			var ratio = 1;
			var is_viscaps = $(this).hasClass('xkit-accesskit-viscaps');

			if (photoset_row.attr("class") == "photoset_row photoset_row_1") {
				ratio = 500.0 / 540.0;
			} else if (photoset_row.attr("class") == "photoset_row photoset_row_2") {
				ratio = 245.0 / 268.0;
			} else if (photoset_row.attr("class") == "photoset_row photoset_row_3") {
				ratio = 160.0 / 177.0;
			}

			var photoHeight = parseInt(photoset_row.css("height").slice(0, -2)) * ratio;

			photoset_row.addClass("xkit-protected-photoset-row");

			if (!is_viscaps) {
				photoset_row.attr("style", "margin-left: 20px; margin-bottom: 10px; height: " + photoHeight + "px;");
			} else {
				photoset_row.attr("style", "margin-left: 20px; margin-bottom: 10px; min-height: " + photoHeight + "px;");
				photoset_row.find("div").attr("style", "height: " + photoHeight + "px;");
			}

			photoset_row.find("img").each(function() {
				var img = $(this);
				var imgstyle = img.css("width");
				if (imgstyle == "540px") {
					img.attr("style", "width: 500px;");
				} else if (imgstyle == "268px") {
					img.attr("style", "width: 245px; margin-right: 10px;");
				} else if (imgstyle == "177px" || imgstyle == "178px") {
					img.attr("style", "width: 160px; margin-right: 10px;");
				}
			});

		});

	},

	check_for_liked_posts: function() {

		if (document.location.href.indexOf('/dashboard') === -1) {
			return;
		}

		var call_update_rect = false;
		$(".posts .post").not(".xkit-tweaks-checked-for-likes").each(function() {
			$(this).addClass("xkit-tweaks-checked-for-likes");
			if ($(this).find(".post_control.like").hasClass("liked")) {
				$(this).addClass("is_liked");
				call_update_rect = true;
			}
		});

		if (call_update_rect) {
			XKit.extensions.tweaks.fix_hidden_post_height();
		}

	},

	fix_hidden_post_height: function() {

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	css_to_add: "",

	add_css: function(css, name) {

		XKit.extensions.tweaks.css_to_add += " \n " + css;

	},

	split_gear: function() {

		if (!XKit.browser().mobile) { // mobile stuff
			$(".post.is_mine").not(".xkit-tweaks-split-gear-done").each(function() {
				$(this).addClass("xkit-tweaks-split-gear-done");

				// Remove captions
				$(this).find(".post_control.edit").html("<span class=\"offscreen\">Edit</span>");
				$(this).find(".post_control.delete").html("<span class=\"offscreen\">Delete</span>");
				$(this).find(".post_control.queue").html("<span class=\"offscreen\">Queue</span>");

				// Remove their menu-specific classes
				$(this).find(".post_control.edit, .post_control.queue, .post_control.delete").removeClass("show_label");

				$(this).find(".post_control.edit").appendTo($(this).find(".post_controls_inner"));
				$(this).find(".post_control.delete").appendTo($(this).find(".post_controls_inner"));
				$(this).find(".post_control.queue").appendTo($(this).find(".post_controls_inner"));
				$(this).find(".post_control.post_control_menu.creator").css("display", "none");
			});
		}

	},

	upload_photos: function() {


		if (document.location.href.indexOf('/new/photo') !== -1) {

			XKit.console.add("Tweaks, upload_photos: user in photo page.");
			if ($("#post_content").length === 0) {
				XKit.console.add("Tweaks, upload_photos: waiting for panel.");
				setTimeout(function() {
					XKit.extensions.tweaks.upload_photos();
				}, 1);
				return;
			}

			$("#post_two_image").css("background", "red");
			$("#post_two_image").removeClass("mce_image");
			$("#post_two_image").addClass("mce_image_upload");
			$("#post_two_image").find(".mceIcon").addClass("mce_image_upload");
			$("#post_two_image").find(".mceIcon").removeClass("mce_image");
			$("#post_two_image_upload").attr('id', 'post_two_image_upload');
			$("#post_two_image_voice").attr('id', 'post_two_image_upload_voice');

			XKit.console.add("Tweaks, upload_photos: done.");

			XKit.tools.add_function(function() {
				/* globals tinyMCE */
				Tumblr.Events.trigger("posts:load");
				tinyMCE.execCommand("mceRepaint");
				alert(JSON.stringify(tinyMCE.activeEditor.settings));
			}, true, "");

		}

	},

	full_width_gifs_do_first: function() {
		$(document.body).on("click", ".post-settings", function() {
			if (!$("#xkit-full-width-gifs").length) {
				$(".form-horizontal").append("<div class=\"form-group\"><div class=\"group-label\"><label for=\"xkit-full-width-gifs\">Allow full-width GIFs?</label></div><div class=\"group-content\"><input id=\"xkit-full-width-gifs\" type=\"checkbox\" checked=\"checked\"></div></div>");
				$("#xkit-full-width-gifs").on("click", function() {
					XKit.extensions.tweaks.full_width_gifs_do($("#xkit-full-width-gifs").prop("checked"));
				});
			}
		});
	},

	full_width_gifs_do: function(is_checked) {
		if (!is_checked) {
			$(".editor-wrapper").find(".tmblr-full").addClass("tweaks-full-width-gifs");
			$(".editor-wrapper").find(".tmblr-full").removeClass("tmblr-full");
			$(".editor").focus();
			return;
		} else {
			$(".editor-wrapper").find(".tweaks-full-width-gifs").addClass("tmblr-full");
			$(".editor").focus();
			return;
		}
	},

	destroy: function() {
		this.running = false;

		XKit.tools.remove_css("xkit_tweaks");
		XKit.tools.remove_css("tweaks_slim_activity_feed");
		XKit.tools.remove_css("tweaks_old_sidebar_width");
		XKit.tools.remove_css("tweaks_old_photo_margins");
		XKit.tools.remove_css("tweaks_no_mobile_banner");
		XKit.tools.remove_css("xkit_tweaks_larger_small_text_on_reblogs");
		XKit.tools.remove_css("xkit_tweaks_hide_share");
		XKit.tools.remove_css("xkit_tweaks_wide_sources");

		XKit.post_listener.remove("tweaks_fix_hidden_post_height");
		XKit.post_listener.remove("tweaks_dont_show_liked");
		XKit.post_listener.remove("tweaks_split_gear");

		clearInterval(this.run_interval);
		clearInterval(this.run_interval_2);
		clearInterval(this.hide_bubble_interval);

		$(".xkit-small-blog-setting-link").remove();
		$(".small_links.by-xkit").remove();
		$("#new_post_in_tracked_tags_bubble").remove();
		$("#tumblr_radar").css("display", "block");
		$("#xkit_customize_button").remove();
		$("a.spotlight").parent().css("display", "block");
		$("a.activity").parent().css("display", "block");
		$(".radar_header").parent().css("display", "block");
		$(".customize").parent().css("display", "block");
		$("xkit_post_tags_inner_add_back").addClass("post_tags_inner");
		$("xkit_post_tags_inner_add_back").removeClass("xkit_post_tags_inner_add_back");

		XKit.tools.remove_css("tweaks_grey_urls");
	}
});
