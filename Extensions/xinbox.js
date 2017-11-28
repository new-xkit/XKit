//* TITLE XInbox **//
//* VERSION 1.9.7 **//
//* DESCRIPTION Enhances your Inbox experience **//
//* DEVELOPER new-xkit **//
//* DETAILS XInbox allows you to tag posts before posting them, and see all your messages at once, and lets you delete multiple messages at once using the Mass Editor mode. To use this mode, go to your Inbox and click on the Mass Editor Mode button on your sidebar, click on the messages you want to delete then click the Delete Messages button.  **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.xinbox = new Object({

	running: false,

	reply_button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUM5MzFGNzM2MzgzMTFFMzlFQTI4RjEwOUZBNDg2OEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUM5MzFGNzQ2MzgzMTFFMzlFQTI4RjEwOUZBNDg2OEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QzkzMUY3MTYzODMxMUUzOUVBMjhGMTA5RkE0ODY4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QzkzMUY3MjYzODMxMUUzOUVBMjhGMTA5RkE0ODY4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmGYpQYAAAIwSURBVHjaYoyKimJABkGRyUwb1q6QOnXiaOa7N6+9Pnx4r/rnzx8OmLyAoNA9MXGJ9V6+AX1A7ktkvYzIhgEN4inKTZnw6MH9BAZU8A2IvwCxGLKgjKx874Rp82qBzF8gPhNM4vrN2yblRZnrkAyaAcSeQCwExHxALAXEbEBsBcRTQQqePH5YXJCVOB/IhLgc5LKK2hYRIPMPFM8GYmMGwiARpkdaRnbams17mRhAhJy8wiKoxGQgZmcgHkTADLR1cDZh/vXrp+TJ40fnQSUT0AOVALgCxCxAbAvE/Aya2roZUNPXMpAH5EH6Obm4XjH9/vVLHSp4l0zDHoGI79++CTH9+ftHACr4kUzDWGEMUNJ4C2Xzk2mYNlgzv8BDJgVF5WVQwSIyDUwBEZJS0itASYNFWVVtAzQSykk0qAGWNPomzxFkZmH88+/L1+8Sz589dYNmmVVEGCIKxM1AXAbiANNp4Yljhw6C0gjD3z9/2KCKfiJp0ABlVyB+DMTM0KwEMsQIiP1himTlFCr7pswFZy+wYR8/fTCHyp2CKgalvSR8TgOG9UpVdQ2Q627MnNoHFmMxtXbmWbZsGcwmGaiBYKCuqb3286ePQkxMTP+BBcwvFlaW11xc3Kc0tHQ2RMUmg3LKP5QiSEVNI+nOrRuzkAWVlFWnJ6Xl1AGZ70mJDRaG///hxZCCkvIib7+gKiDzxfPnT0hOI4zApMGVn5kQYmputScmIe0FutNJAQABBgBSobK3EYqShQAAAABJRU5ErkJggg==",

	preferences: {
		"sep-1": {
			text: "Notifications",
			type: "separator"
		},
		"show_new_notification": {
			text: "Show an XKit Notification when I receive new asks/fan mail",
			default: false,
			value: false
		},
		"sep0": {
			text: "Tagging while publishing",
			type: "separator"
		},
		"show_tag_box": {
			text: "Show the tag input box on asks",
			default: true,
			value: true
		},
		"tag_usernames": {
			text: "Tag published asks with their usernames",
			default: true,
			value: true
		},
		"tag_usernames_replace_hyphens": {
			text: "Replace hyphens in usernames with spaces when tagging",
			default: false,
			value: false
		},
		"anon_tag": {
			text: "Tag to use when the asker is anonymous",
			default: "Anonymous",
			value: "Anonymous",
			type: "text"
		},
		"tag_custom": {
			text: "Tag published asks with the custom tag below:",
			default: false,
			value: false
		},
		"custom_tag": {
			text: "Custom tag for asks",
			default: "",
			value: "",
			type: "text"
		},
		"sep1a": {
			text: "Appearance options",
			type: "separator"
		},
		"show_reply_button": {
			text: "Show Reply button on Private Answers I receive (requires User Menus+ installed)",
			default: true,
			value: true
		},
		"bigger_answer_boxes": {
			text: "Make the answer box taller when I'm typing a reply to an ask",
			default: false,
			value: false
		},
		"sep1": {
			text: "Inbox Tools",
			type: "separator"
		},
		"inbox_search": {
			text: "Enable Inbox Search",
			default: true,
			value: true,
			experimental: true
		},
		"mass_editor": {
			text: "Enable Mass Inbox Editor",
			default: true,
			value: true
		},
		"check_for_blanks": {
			text: "Confirm my action when I'm about to publish a blank ask",
			default: true,
			value: true
		},
		"sep2": {
			text: "Fan Mail options",
			type: "separator"
		},
		"auto_expand_fan_mail": {
			text: "Automatically expand Fan Mail without having to click on Read More",
			default: false,
			value: false
		},
		"slim_fan_mail": {
			text: "Slim Incoming Fan Mail",
			default: false,
			value: false
		},
		"slim_outgoing_fan_mail": {
			text: "Slim Fan Mail when I'm writing one",
			default: false,
			value: false
		},
		"hide_fan_mail_button": {
			text: "Hide 'Send Fan Mail' button",
			default: false,
			value: false
		}
	},

	frame_run: function() {

		XKit.extensions.xinbox.slimify_outgoing();

	},

	slimify_outgoing: function() {

		if (XKit.extensions.xinbox.preferences.slim_outgoing_fan_mail.value === true) {

			XKit.tools.add_css("#fan_mail { background-image: url('http://xkit.info/seven/extension_assets/paper.png'); }#fan_mail #message{ overflow-y: scroll; font-size: 15px !important; line-height: 22px !important; }", "xinbox_slim_outgoing_fan_mail");

			$(document).on('click', '#paper_white-lined-1', function() {

				$("#fan_mail").css("background-image", "url('http://xkit.info/seven/extension_assets/paper.png')");

			});

		}

	},

	notification_check_interval: 0,
	last_check: 0,

	check_for_new: function(first) {

		if ($("#inbox_button").length <= 0) { return; }

		var m_value = parseInt($("#inbox_button").find(".tab_notice_value").html());

		if (first === true) {
			XKit.extensions.xinbox.last_check = m_value;
			return;
		}

		if (m_value > 0 && XKit.extensions.xinbox.last_check !== m_value) {

			XKit.notifications.add("You have <b>" + m_value + "</b> new ask/fan mail in your Inbox.", "mail", false, function() { window.open("http://www.tumblr.com/inbox"); });
			XKit.extensions.xinbox.last_check = m_value;

		}

	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("xinbox");

		XKit.extensions.xinbox.slimify_outgoing();

		if (XKit.extensions.xinbox.preferences.show_new_notification.value === true) {
			XKit.extensions.xinbox.notification_check_interval = setInterval(function() { XKit.extensions.xinbox.check_for_new(); }, 2000);
			XKit.extensions.xinbox.check_for_new(true);
		}

		if (XKit.interface.where().inbox !== true) {
			return;
		}


		if (XKit.extensions.xinbox.preferences.show_reply_button.value === true) {
			$(document).on('click', '.xkit-xinbox-pa-reply', XKit.extensions.xinbox.on_click_to_pa_reply);
			XKit.interface.create_control_button("xkit-xinbox-pa-reply", this.reply_button_icon, "Reply to Answer", "");
			XKit.post_listener.add("xinbox_show_reply_buttons", XKit.extensions.xinbox.show_reply_button);
			XKit.extensions.xinbox.show_reply_button();
		}

		if (XKit.extensions.xinbox.preferences.show_tag_box.value === true || XKit.extensions.xinbox.preferences.tag_usernames.value === true || XKit.extensions.xinbox.preferences.tag_custom.value === true) {
			XKit.post_listener.add("xinbox_init_tags", XKit.extensions.xinbox.init_tags);
			XKit.extensions.xinbox.init_tags();
		}

		if (XKit.extensions.xinbox.preferences.hide_fan_mail_button.value === true && $("#right_column > .send_fan_mail").length > 0) {
			XKit.tools.add_css("#right_column > .send_fan_mail { display: none; } #right_column .controls_section { margin-top: 0 !important; margin-bottom: 18px; } ", "xkit_inbox_hide_fan_mail_button");
		}

		if (XKit.extensions.xinbox.preferences.slim_fan_mail.value === true) {
			var m_css = " .fan_mail .message { " +
						" background: white !important; " +
						" padding-left: 20px !important; padding-right: 20px !important; " +
						" padding-bottom: 37px !important; padding-top: 20px !important; " +
						" border-radius: 6px !important; " +
						" font: normal 14px/1.4 \"Helvetica Neue\",\"HelveticaNeue\",Helvetica,Arial,sans-serif !important; " +
					" }" +
					" .post.fan_mail.lined-white .before { display: none; } " +
					" #posts .post.fan_mail .controls { " +
						" left: 0px !important; right: 20px !important; " +
						" color: #818b98 !important; " +
					"}" +
					" .xkit-paper-cut-thingy {" +
						" display: none;" +
					" }" +
					" #posts .post.fan_mail .controls .controls_link { " +
						" color: #818b98 !important; " +
					" }";
			XKit.tools.add_css(m_css, "xkit_inbox_slim_fan_mail");
		}

		if (XKit.extensions.xinbox.preferences.mass_editor.value === true) {
			XKit.extensions.xinbox.init_mass_editor();
		}

		if (XKit.extensions.xinbox.preferences.auto_expand_fan_mail.value === true) {
			var au_ex_css = ".post.fan_mail .read_more, .post.fan_mail .message_body_truncated { display: none; } .post.fan_mail .message_body { display: block !important; }";
			XKit.tools.add_css(au_ex_css, "xkit_inbox_auto_expand");
		}

		if (XKit.extensions.xinbox.preferences.inbox_search.value === true) {
			XKit.extensions.xinbox.init_inbox_search();
		}

		$("#xinbox_sidebar").prepend("<li class=\"section_header selected\">INBOX TOOLS</li>");

	},

	inbox_search_term: "",

	on_click_to_pa_reply: function(e) {

		var m_post_id = $(e.target).attr('data-post-id');

		XKit.tools.add_function(function() {

			var e_target = jQuery("#xinbox-reply-button-" + add_tag);

			try {
				Tumblr.Events.trigger("ask:form:open", {
					recipient: e_target.attr("data-tumblelog-name")
				});
			} catch (err) {
				console.error("Error: " + err.message);
			}

		}, true, m_post_id);

	},

	show_reply_button: function() {

		if (XKit.installed.check("show_more") !== true || XKit.installed.enabled("show_more") !== true) { return; }

		$(".post.is_private_answer").not(".xinbox-done-reply-button-on-pas").each(function() {

			$(this).addClass("xinbox-done-reply-button-on-pas");

			try {

				var tumblelog_name = "";
				try {
					tumblelog_name = JSON.parse($(this).find(".post_avatar_link").attr('data-tumblelog-popover')).name;
				} catch (e) {
					// Probably own ask.
					tumblelog_name = JSON.parse($(this).attr('data-json'))['tumblelog-name'];
				}

				if (tumblelog_name !== "" && typeof tumblelog_name !== "undefined") {
					XKit.interface.add_control_button($(this), "xkit-xinbox-pa-reply", " data-tumblelog-name=\"" + tumblelog_name + "\" data-tumblelog-name=\"" + tumblelog_name + "\" id=\"xinbox-reply-button-" + $(this).attr('data-post-id') + "\" data-json=\"" + $(this).find(".post_avatar_link").attr('data-tumblelog-popover') + "\"");
				}

			} catch (e) {


			}

		});

	},

	init_inbox_search: function() {

		var m_html = '<li class="" id="xinbox_search_li" style="height: 36px;">' +
				'<a href="#" class="customize" id="xinbox_search_button">' +
					'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Search Inbox..</div>' +
				'</a>' +
				'</li>';

		if ($("#xinbox_sidebar").length > 0) {

			$("#xinbox_sidebar").append(m_html);

		}

		var x_html = "<div id=\"xinbox-search-box\"><input type=\"text\" placeholder=\"Enter URL/text...\" id=\"xinbox-search-box-input\"></div>";
		$("#xinbox_sidebar").before(x_html);

		$("#xinbox_search_button").click(function() {

			XKit.extensions.xinbox.inbox_search_start();

			return false;
		});

		$("#xinbox-search-box-input").keyup(function() {

			var m_value = $(this).val().toLowerCase();
			m_value = $.trim(m_value);

			XKit.extensions.xinbox.inbox_search_term = m_value;
			XKit.extensions.xinbox.search_do_posts();

		});

	},

	search_do_posts: function() {
		var m_value = XKit.extensions.xinbox.inbox_search_term;

		function get_post_body(post) {
			return post.find(".post_body").not(".post_ask_answer_form_container");
		}

		var posts = $(".post");

		if (m_value === "" || m_value.length <= 1) {
			// Show all

			get_post_body(posts).find("mark").contents().unwrap();

			if ($("#xinbox-search-bar").length > 0) {
				$("#xinbox-search-bar").slideUp('slow', function() { $(this).remove(); });
			}

			posts.parent().removeClass("xkit-inbox-found");
			posts.parent().slideDown('fast');

			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("DOMEventor:updateRect");
			}, true, "");
			return;
		}

		var i_html = "Searching for <b>\"" + m_value + "\"</b><br/><span id=\"xinbox-search-found-count\">0</span> results found so far, inspected <span id=\"xinbox-search-search-count\">0</span> posts.<br/><small>Scroll down to load more asks and results.</small>";

		if ($("#xinbox-search-bar").length > 0) {
			$("#xinbox-search-bar").html(i_html);
		} else {
			$("#posts").before("<div id=\"xinbox-search-bar\">" + i_html + "</div>");
		}

		posts.each(function() {
			var post = $(this);

			var username = post.attr('data-tumblelog-name');
			var hide_this = false;

			var to_search_in = post.find(".post_body").text().toLowerCase();

			if (typeof username !== "undefined") {
				to_search_in = to_search_in + username;
			}

			if (to_search_in.indexOf(m_value) === -1) {
				hide_this = true;
			}

			var post_body = get_post_body(post);

			if (!hide_this) {
				post.parent().slideDown('fast');
				post.parent().addClass("xkit-inbox-found");

				post_body.find("mark").contents().unwrap();
				var m_html = XKit.extensions.xinbox.return_highlighted_html(post_body.html(), m_value);
				post_body.html(m_html);

			} else {
				post.parent().slideUp('fast');
				post.parent().removeClass("xkit-inbox-found");
				post_body.find("mark").contents().unwrap();
			}

		});

		$("#xinbox-search-found-count").html($(".xkit-inbox-found").length);
		$("#xinbox-search-search-count").html($(".post").length);

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");
	},

	remove_wraps: function(src_str) {

		src_str = XKit.tools.replace_all(src_str, "<wrap>", "");
		src_str = XKit.tools.replace_all(src_str, "<\/wrap>", "");

		return src_str;

	},

	return_highlighted_html: function(src_str, term) {

		/* from http://jsfiddle.net/UPs3V/ */

		term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
		var pattern = new RegExp("(" + term + ")", "i");

		src_str = src_str.replace(pattern, "<mark>$1</mark>");
		src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");

		return src_str;

	},

	inbox_search_start: function() {

		$("#xinbox_search_button").toggleClass("xkit-xinbox-in-search");
		var right_column_children = $("#right_column").children().not("#xinbox_sidebar").not("#xinbox-search-box").not("script");

		if ($("#xinbox_search_button").hasClass("xkit-xinbox-in-search")) {

			$("#xinbox_search_li").addClass("selected");
			XKit.extensions.xinbox.inbox_search_term = "";

			$(".post").parent().addClass("xkit-inbox-found");
			XKit.tools.add_css(".post_container { display: none; } .post_container.xkit-inbox-found { display: block; } ", "xkit-inbox-search");
			XKit.post_listener.add("xinbox_search", XKit.extensions.xinbox.search_do_posts);

			$("#xinbox_sidebar").addClass("xkit_others_hidden");
			right_column_children.slideUp('slow', function() {
				$(this).addClass("xinbox-search-hidden-box");
			});
			$("#xinbox-search-box").slideDown('slow');

		} else {

			$("#xinbox_search_li").removeClass("selected");
			XKit.extensions.xinbox.inbox_search_term = "";

			XKit.extensions.xinbox.reset_search();

			$("#xinbox_sidebar").removeClass("xkit_others_hidden");
			right_column_children.slideDown('slow', function() {
				$(this).removeClass("xinbox-search-hidden-box");
			});
			$("#xinbox-search-box").slideUp('slow');

		}
	},

	reset_search: function() {

		$(".post").parent().removeClass("xkit-inbox-found");
		XKit.tools.remove_css("xkit-inbox-search");
		XKit.post_listener.remove("xinbox_search");

		if ($("#xinbox-search-bar").length > 0) {
			$("#xinbox-search-bar").slideUp('slow', function() { $(this).remove(); });
		}

		$(".post").find(".post_body").find("mark").contents().unwrap();

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

		if ($(".post").length > 30) {
			$(".post:gt(30)").remove();
		}

	},

	auto_expand_fan_mail: function() {

		try {
			$(".fan_mail_read_more").trigger('click');
		} catch (e) {
			XKit.console.add("auto_expand_fan_mail: " + e.message);
		}

	},

	init_mass_editor: function() {

		if (XKit.interface.where().inbox !== true) {
			return;
		}

		var xf_html = '<ul class="controls_section" id="xinbox_sidebar">' +
			'<li class="" id="xinbox_mass_edit_li" style="height: 36px;">' +
				'<a href="#" class="customize" id="xinbox_mass_edit_button">' +
					'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Mass Edit Mode</div>' +
				'</a>' +
			'</li>' +
			'</ul>';

		$("ul.controls_section:eq(0)").before(xf_html);

		$("#xinbox_mass_edit_button").click(function() {

			if (!$(this).parent().hasClass("xkit-selected")) {

				$(this).parent().addClass("xkit-selected");
				$(this).parent().addClass("selected");
				XKit.extensions.xinbox.start_mass_editor();

			} else {

				$(this).parent().removeClass("xkit-selected");
				$(this).parent().removeClass("selected");
				XKit.extensions.xinbox.stop_mass_editor();

			}

			return false;
		});

	},

	stop_mass_editor: function() {

		XKit.tools.remove_css("xinbox_mass_editor");
		$("#xinbox_mass_text").remove();
		$(document).off("click", ".post");

	},

	start_mass_editor: function() {


		var button_default = "No messages selected";
		var button_selected = "Delete %s Messages";
		var button_selected_first = "Delete 1 Message";

		XKit.tools.add_css(" #posts { padding: 0; margin: 0 !important; } .xtimestamp { display: none; } .post_controls { display: none; }" +
				" .post:last-child { display: block; } #left_column { min-height: 120%; } " +
				" .post:active { position: relative; top: 1px; } " +
				" .post { -moz-user-select: none; user-select: none; -webkit-user-select: none; float: left !important; width: 200px !important; height: 150px !important; " +
				"    opacity: 0.53; " +
				"    display: inline-block !important; clear: none !important; overflow: hidden !important; " +
				"    margin: 0px 4px 8px 4px !important; } " +
				" .fan_mail { display: none !important; } " +
				" #xkit_delete_selected:hover { background: rgba(255,255,255,0.12); cursor: pointer; } " +
				" #xkit_delete_selected.disabled { opacity: 0.5; cursor: default; " +
				" background: rgba(255,255,255,0.08) !important; top: 0 !important; } " +
				" #xkit_delete_selected:active { background: rgba(0,0,0,0.12); " +
				" box-shadow: inset 0px 1px 2px rgba(0,0,0,0.43); position: relative; top: 1px; } " +
				" #xkit_delete_selected { border: 1px solid rgba(0,0,0,0.32); border-radius: 6px; " +
				" box-shadow: inset 0px 1px 0px rgba(255,255,255,0.12), 0px 1px 0px rgba(255,255,255,0.12); " +
				" padding: 5px 15px; background: rgba(255,255,255,0.08); display: inline-block; margin-top: 5px;} " +
				" .post a { pointer-events: none; cursor: default; } " +
				" .post.xpost-selected { opacity: 1; } " +
				" .post.xpost-working { animation: xpost-working-ani 1s infinite; " +
				" -webkit-animation: xpost-working-ani 1s infinite; " +
				" -webkit-animation: xpost-working-ani 1s infinite; } " +
				" @-moz-keyframes xpost-working-ani { from { opacity: 1; } 50% { opacity: 0.32; } to { opacity: 1; } } " +
				" @-webkit-keyframes xpost-working-ani { from { opacity: 1; } 50% { opacity: 0.32; } to { opacity: 1; } } ", "xinbox_mass_editor");

		$("#left_column").prepend("<div class=\"dashboard_options_form\" id=\"xinbox_mass_text\">" +
				"<b>Welcome to Mass Edit Mode.</b><br/>" +
				"Select the messages you want deleted and click the button below." +
				"<div style=\"margin-top: 8px;\">" +
				"<div id=\"xkit_delete_selected\" class=\"disabled\">No messages selected</div>" +
				"</div></div>");

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

		$("#xkit_delete_selected").click(function() {

			if ($(this).hasClass("disabled") === true) {
				return;
			}

			$(this).addClass("disabled");

			var msg_count = 0;
			$(".xpost-selected").each(function() {
				msg_count++;
			});

			XKit.extensions.xinbox.delete_msg_count = msg_count;
			XKit.extensions.xinbox.delete_msg_index = 0;
			XKit.extensions.xinbox.mass_editor_working = true;

			XKit.extensions.xinbox.delete_key = $("input[name='form_key']").attr('value');
			XKit.extensions.xinbox.mass_editor_delete();

		});

		$(document).on("click", ".post", function(event) {
			if (XKit.extensions.xinbox.mass_editor_working === true) { return; }
			event.preventDefault();
			if ($(this).hasClass("xpost-selected") === true) {
				XKit.extensions.xinbox.selected_post_count = XKit.extensions.xinbox.selected_post_count - 1;
			} else {
				XKit.extensions.xinbox.selected_post_count++;
			}
			$(this).toggleClass("xpost-selected");
			if (XKit.extensions.xinbox.selected_post_count === 0) {
				$("#xkit_delete_selected").html(button_default);
				$("#xkit_delete_selected").addClass("disabled");
			} else {
				// English is a weird language, innit?
				$("#xkit_delete_selected").removeClass("disabled");
				if (XKit.extensions.xinbox.selected_post_count === 1) {
					$("#xkit_delete_selected").html(button_selected_first);
				} else {
					$("#xkit_delete_selected").html(button_selected.replace("%s", XKit.extensions.xinbox.selected_post_count));
				}
			}
		});


	},

	selected_post_count: 0,
	mass_editor_working: false,
	delete_msg_index: 0,
	delete_msg_count: 0,
	delete_key: "",

	mass_editor_delete: function() {

		var button_working = "Deleting message %s of %m";
		var current_msg = XKit.extensions.xinbox.delete_msg_index + 1;
		var msg_count = XKit.extensions.xinbox.delete_msg_count;

		var button_default = "No messages selected";

		if (current_msg > msg_count) {
			this.selected_post_count = 0;
			XKit.window.show("Done!", "All messages deleted successfully.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			$("#xkit_delete_selected").html(button_default);
			$("#xkit_delete_selected").addClass("disabled");
			XKit.extensions.xinbox.mass_editor_working = false;
			return;
		}

		var m_key = XKit.extensions.xinbox.delete_key;
		$("#xkit_delete_selected").html(button_working.replace("%m", msg_count).replace("%s", current_msg));

		$(".xpost-selected:eq(0)").addClass("xpost-working");

		var channel_id = $(".xpost-selected:eq(0) .post_info_link").text() || XKit.tools.get_blogs()[0];
		var m_id = $(".xpost-selected:eq(0)").attr('id').replace("post_", "");

		setTimeout(function() {

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/svc/post/delete",
				data: "channel_id=" + channel_id + "&post_id=" + m_id,
				headers: {
					"x-tumblr-form-key": m_key
				},
				onerror: function(response) {
					alert("XInbox can not fetch the required page:\n\n" +
				"There might be a connection problem, or the extension might need updating.\n\n" +
				"Please try again later, and if the problem continues, disable XInbox from \n" +
				"the XKit Control Panel (X icon > XInbox > Disable this Extension) to answer\n" +
				"your asks while this problem is being fixed.");
				},
				onload: function(response) {
					XKit.extensions.xinbox.delete_msg_index = current_msg;
					var post_div = $(".xpost-selected:eq(0)");
					$(post_div).fadeOut('fast', function() { $(this).parent().remove(); });
					setTimeout(function() { XKit.extensions.xinbox.mass_editor_delete(); }, 500);
				}
			});

		}, 700);

	},

	resize_text_area: function(post_id) {

		if ($("#ask_answer_field_" + (+post_id) + "_tbl").length > 0) {

			$("#ask_answer_field_" + (+post_id) + "_tbl, #ask_answer_field_" + post_id + "_ifr").css("height", "220px");

		} else {

			setTimeout(function() { XKit.extensions.xinbox.resize_text_area(post_id); }, 100);

		}

	},

	init_tags: function() {

		try {

			$("[id^='ask_answer_link_']").unbind("click");

			$("[id^='ask_answer_link_']").bind("click", function() {

				var m_parent = $(this).parentsUntil(".post").parent();
				var post_id = $(m_parent).attr('id').replace("post_", "");

				// Make it longer?
				if (XKit.extensions.xinbox.preferences.bigger_answer_boxes.value === true) {
					XKit.extensions.xinbox.resize_text_area(post_id);
				}

				if ($(m_parent).find(".xkit-xinbox-button-publish").length > 0)
					return;

				// Disable default buttons.
				var submit_button = $(m_parent).find('[id^="ask_publish_button_"]');
				$(submit_button).attr('onclick', 'return false;');
				$(submit_button).attr('data-state', '0');

				var queue_button = $(m_parent).find('[id^="ask_queue_button_"]');
				$(queue_button).attr('onclick', 'return false;');
				$(queue_button).attr('data-state', '2');

				var draft_button = $(m_parent).find('[id^="ask_draft_button_"]');
				$(draft_button).attr('onclick', 'return false;');
				$(draft_button).attr('data-state', '1');

				var this_obj = m_parent;
				var m_box_id = "xinbox_tags_" + post_id;


				var asker = XKit.extensions.xinbox.preferences.anon_tag.value;
				var respondant = $(m_parent).attr('data-tumblelog-name');
				if (m_parent.find(".post_info").find("a").length > 0) {
					asker = m_parent.find(".post_info").find("a").html();

					// If the ask is anonymous there is no link to their blog to parse.
					// If the blog is secondary there will be a link to respondant's own blog
					// and this will be found instead. Reset asker to anoymous if this is the case.
					if (asker === respondant) {
						asker = XKit.extensions.xinbox.preferences.anon_tag.value;
					}
				}


				/*

				OBSOLETE -- Tumblr changes.

				*/

				/*var asker = XKit.extensions.xinbox.preferences.anon_tag.value;
				var respondant = $(m_parent).attr('data-tumblelog-name');

				if (respondant !== "" && typeof respondant !== "undefined" && !m_parent.hasClass("post_tumblelog_")) {
					asker = respondant;
				} else {
					if (typeof asker === "undefined") {
						asker = "";
					}
				}*/

				/* var asker = "";

				if ($(m_parent).find(".post_avatar_link").length > 0) {

					var avatar_json_data = $(m_parent).find(".post_avatar_link").attr('data-tumblelog-popover');
					if (avatar_json_data !== "" && typeof avatar_json_data !== "undefined") {
						try {
							var avatar_json = JSON.parse(avatar_json_data);
							if (avatar_json.name !== "" && typeof avatar_json.name !== "undefined") {
								asker = avatar_json.name;
							}
						}catch(e) {
							XKit.console.add("Can't tag ask ---->" + e.message);
						}
					} else {
						XKit.console.add("xinbox tagger -> data-tumblelog-popover data missing");
					}

				} else {
					XKit.console.add("xinbox tagger -> post_avatar_link missing");
				}*/

				// return alert("asker = " + asker);

				var all_buttons = $(m_parent).find('[id^="ask_publish_button_"], [id^="ask_draft_button_"], [id^="ask_queue_button_"]');
				var private_button = $(m_parent).find('[id^="private_answer_button_"]');

				$(all_buttons).remove();

				var publish_button_div = "<button class=\"chrome blue xkit-xinbox-button xkit-xinbox-button-publish\" data-state=\"0\" data-post-id=\"" + $(m_parent).attr('data-post-id') + "\">Publish</button>";

				if (private_button.length > 0) {
					$(private_button).css("margin-left", "2px");
					$(private_button).before(publish_button_div);
				} else {
					$(m_parent).find(".ask_cancel_button").parent().append(publish_button_div);
				}

				var other_buttons_div = "<button class=\"chrome xkit-xinbox-button xkit-xinbox-button-draft xkit-xinbox-button-hidden\" data-state=\"1\" data-post-id=\"" + $(m_parent).attr('data-post-id') + "\">Save as Draft</div>" +
							"<button class=\"chrome xkit-xinbox-button xkit-xinbox-button-queue xkit-xinbox-button-hidden\" data-state=\"2\" data-post-id=\"" + $(m_parent).attr('data-post-id') + "\">Queue</div>";

				if (private_button.length > 0) {
					$(private_button).after(other_buttons_div);
				} else {
					$(m_parent).find(".ask_cancel_button").parent().append(other_buttons_div);
				}


				all_buttons = $(m_parent).find('.xkit-xinbox-button');

				$(all_buttons).attr('onclick', '');
				$(all_buttons).bind("click", function(event) {

					event.preventDefault();

					$(all_buttons).attr('disabled', 'disabled');

					var m_tags = "";

					if ($("#" + m_box_id).length > 0) {
						m_tags = $("#" + m_box_id).val();
					}

					if (XKit.extensions.xinbox.preferences.tag_usernames_replace_hyphens.value === true) {
						asker = asker.replace(/-/g, ' ');
					}

					if (XKit.extensions.xinbox.preferences.tag_usernames.value === true) {
						if (m_tags === "") {
							m_tags = asker;
						} else {
							m_tags = m_tags + "," + asker;
						}
					}

					if (XKit.extensions.xinbox.preferences.tag_custom.value === true) {
						if (XKit.extensions.xinbox.preferences.custom_tag.value !== "") {
							if (m_tags === "") {
								m_tags = XKit.extensions.xinbox.preferences.custom_tag.value;
							} else {
								m_tags = m_tags + "," + XKit.extensions.xinbox.preferences.custom_tag.value;
							}
						}
					}

					var m_state = $(this).attr('data-state');
					if (typeof m_state === "undefined") {
						m_state = "0";
					}

					XKit.extensions.xinbox.poke_tinymce(post_id);
					setTimeout(function() {
						XKit.extensions.xinbox.publish_ask(this_obj, post_id, m_tags, m_state);
					}, 200);

				});

				$(m_parent).find(".xinbox_tag_box").remove();

				// Does the user want the tag box?

				if (XKit.extensions.xinbox.preferences.show_tag_box.value === true) {

					// Calculate tag box width.
					$(m_parent).find(".ask_cancel_button").parent().css("padding-top", "0");

					// Add our tag box here.

					var m_html = '<div class="xinbox_tag_box">' +
							'<input class="xinbox_tag_box_input" id="' + m_box_id + '" ' +
								' placeholder="Tags, comma separated" />' +
							'</div>';


					$(m_parent).find(".ask_cancel_button").parent().prepend(m_html);

				}

			});

		} catch (e) {
			XKit.notifications.add("<b>Can't run " + this.title + ":</b><br/>" + e.message, "error");
		}

	},

	publish_ask: function(post_div, post_id, tags, state) {

		XKit.extensions.xinbox.poke_tinymce(post_id);

		var answer = $('#ask_answer_field_' + post_id).val();

		if (answer === "" && XKit.extensions.xinbox.preferences.check_for_blanks.value === true) {
			// Check if the user really wants to post this.
			if (!confirm("XInbox is curious:\nYou didn't enter an answer. Send it anyway?")) {
				return;
			}
		}

		var load_box = $('#post_control_loader_' + post_id);

		$(post_div).find('.xinbox_tag_box_input').attr('disabled', 'disabled');
		$(post_div).find('[id^="ask_publish_button_"]').attr('disabled', 'disabled');
		$(post_div).find('[id^="ask_cancel_button_"]').attr('disabled', 'disabled');
		$(post_div).find('[id^="ask_queue_button_"]').attr('disabled', 'disabled');
		$(post_div).find('[id^="ask_draft_button_"]').attr('disabled', 'disabled');
		$(post_div).find('[id^="private_answer_button_"]').attr('disabled', 'disabled');
		$(load_box).css("display", "block");

		var form_key = $('meta[name=tumblr-form-key]').attr("content");

		var m_object = {};

		m_object.post_id = parseInt(post_id);
		m_object.form_key = form_key;
		m_object.post_type = false;

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/fetch",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				XKit.extensions.xinbox.show_error("I was unable to reach Tumblr servers, or the server returned an error.");
				return;
			},
			onload: function(response) {
				// We are done!
				var mdata = null;
				try {
					mdata = $.parseJSON(response.responseText);
				} catch (e) {
					XKit.extensions.xinbox.show_error("Server returned a non-JSON object. Maybe server overloaded, try again later. Error: " + e.message);
					return;
				}
				if (mdata.errors === false) {
					XKit.extensions.xinbox.send_publish_request(mdata, answer, tags, post_div, form_key, post_id, state);
				} else {
					XKit.extensions.xinbox.show_error("Server returned an error message. Maybe you hit your post limit or your account was suspended.");
				}
			}
		});

	},

	send_publish_request: function(mdata, answer, tags, post_div, form_key, post_id, state, retry_mode) {

		var m_object = {};

		m_object.form_key = form_key;
		m_object.channel_id = mdata.post_tumblelog.name_or_id;

		m_object.post_id = post_id;
		m_object.edit = false;
		m_object.detached = true;
		m_object.errors = false;
		m_object.created_post = false;
		m_object.context_page = "dashboard";
		m_object.post_context_page = "dashboard";
		m_object.silent = false;
		m_object.context_id = "";
		if ($(".editor_note a").length > 0) {
			m_object.editor_type = "markdown";
		} else {
			m_object.editor_type = "rich";
		}

		m_object["is_rich_text[one]"] = "0";
		m_object["is_rich_text[two]"] = "1";
		m_object["is_rich_text[three]"] = "0";

		m_object["post[type]"] = "note";
		m_object["post[slug]"] = "";
		m_object["post[date]"] = "";

		m_object["post[two]"] = answer;
		m_object["post[tags]"] = "," + tags;
		m_object["post[publish_on]"] = "";
		m_object["post[state]"] = state;

		XKit.interface.kitty.get(function(kitty_data) {

			if (kitty_data.errors === true) {

				// We fucked up. Let's try again.
				if (retry_mode === false) {
					XKit.extensions.xinbox.send_publish_request(mdata, answer, tags, post_div, form_key, post_id, state, true);
				} else {
					XKit.extensions.xinbox.show_error("Could not authorize post request.");
				}

				return;

			}


			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/svc/post/update",
				data: JSON.stringify(m_object),
				json: true,
				headers: {
					"X-tumblr-puppies": kitty_data.kitten,
					"X-tumblr-form-key": XKit.interface.form_key(),
				},
				onerror: function(response) {
					XKit.extensions.xinbox.show_error("I was unable to reach Tumblr servers, or the server returned an error.");
				},
				onload: function(response) {
					// We are done!
					XKit.interface.kitty.set(response.getResponseHeader("X-Tumblr-Kittens"));
					try {
						var responseData = $.parseJSON(response.responseText);
					} catch (e) {
						XKit.extensions.xinbox.show_error("Server returned a non-JSON object. Maybe server overloaded, try again later. Error: " + e.message);
						return;
					}
					if (responseData.errors === false) {
						$(post_div).fadeOut('slow', function() {
							$(post_div).parent().remove();
							XKit.tools.add_function(function() {
								Tumblr.Events.trigger("DOMEventor:updateRect");
							}, true, "");
						});
						if (state === "" || state === "0") { XKit.notifications.add("Published ask.", "ok"); }
						if (state === "1") { XKit.notifications.add("Drafted ask.", "ok"); }
						if (state === "2") { XKit.notifications.add("Queued ask.", "ok"); }
					} else {
						XKit.extensions.xinbox.show_error("Server returned an error message. Maybe you hit your post limit or your account was suspended.");
					}
				}
			});

		});

	},

	show_error: function(msg) {

		XKit.window.show("Can't publish ask", "Something went wrong and prevented XKit from publishing this ask. You might want to disable XInbox (or at least the tagging options of XInbox) if this is related to a recent Tumblr change.<br/><p>" + msg + "</p>Try refreshing the page and trying again, or disable XInbox extension and file a bug report.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

	},

	poke_tinymce: function(post_id) {
		var source = " if (tinyMCE && tinyMCE.get('ask_answer_field_" + post_id + "')) {  " +
						" document.getElementById('ask_answer_field_" + post_id + "').value = (tinyMCE.get('ask_answer_field_" + post_id + "').getContent()); " +
						" } ";

		if ('function' == typeof source) {
			source = '(' + source + ')();';
		}

		var script = document.createElement('script');
		script.setAttribute("type", "application/javascript");
		script.textContent = source;
		document.body.appendChild(script);
	},

	destroy: function() {
		$("#xinbox_sidebar").remove();
		XKit.post_listener.remove("xinbox_auto_expand_fan_mail");
		XKit.post_listener.remove("xinbox_search");
		XKit.post_listener.remove("xinbox_show_reply_buttons");
		$(document).off("click", "[id^='ask_answer_link_']");
		clearInterval(XKit.extensions.xinbox.notification_check_interval);
		XKit.tools.remove_css("xkit_inbox_slim_fan_mail");
		XKit.tools.remove_css("xkit_inbox_auto_expand");
		XKit.tools.remove_css("xkit_inbox_show_queue");
		XKit.tools.remove_css("xinbox_slim_outgoing_fan_mail");
		XKit.tools.remove_css("xkit_inbox_hide_fan_mail_button");
		XKit.tools.remove_css("xinbox");
		this.running = false;
	}

});
