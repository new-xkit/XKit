//* TITLE Mute! **//
//* VERSION 2.3.2 **//
//* DESCRIPTION Better than 'shut up!' **//
//* DETAILS This extension allows you to hide text and answer posts by an user while still seeing their other posts. Useful if a blogger has nice posts but a bad personality. Please note that you'll need to re-mute them if a user changes their URL. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.mute = new Object({

	running: false,
	slow: true,

	preferences: {
		"title": {
			text: "Muted users",
			type: "separator"
		}
	},

	muted: [],

	frame_run: function() {

		if ($(".btn.icon.unfollow").length > 0) {

			XKit.extensions.mute.load_muted();

			$("#xkit-mute-button").remove();

			if ($(".btn.icon.unfollow").hasClass("hidden")) {
				return;
			}

			$(".btn.icon.dashboard, .btn.icon.unfollow, .btn.icon.reblog, .btn.icon.follow").html("");
			$(".btn.icon.dashboard, .btn.icon.unfollow, .btn.icon.reblog, .btn.icon.follow").addClass("no_label");

			var m_username = $(".btn.unfollow").attr('data-tumblelog-name');

			var m_caption = "Mute";

			if (XKit.extensions.mute.return_user_object(m_username) !== -1) {
				m_caption = "Unmute";
			}

			var m_html = "<a data-username=\"" + m_username + "\" id=\"xkit-mute-button\" class=\"btn no_icon\" href=\"#\">" + m_caption + "</a>";

			$("#iframe_controls").find(".btn.icon.unfollow").before(m_html);

			$("#xkit-mute-button").click(function() {

				var user_url = $(this).attr('data-username');

				if (XKit.extensions.mute.return_user_object(user_url) !== -1) {

					for (var i = 0; i < XKit.extensions.mute.muted.length; i++) {

						if (XKit.extensions.mute.muted[i].username === user_url) {
							//console.log("User found, removing from list.");
							XKit.extensions.mute.muted.splice(i, 1);
							XKit.extensions.mute.save();
							//XKit.extensions.mute.do_posts(true);
							XKit.extensions.mute.frame_run();
							return;
						}

					}

					//console.log("User could not be found on the list!..");

				} else {

					//console.log("Adding user to mute list.");

					if (XKit.extensions.mute.muted.length >= 101) {
						alert("Can't mute:\n\nYou have over a hundred muted blogs.\n\nPlease remove some before muting people.");
						return;
					}

					var m_obj = {};
					m_obj.username = user_url;
					m_obj.regular = true;
					m_obj.photo = false;
					m_obj.quote = true;
					m_obj.link = true;
					m_obj.chat = true;
					m_obj.video = false;
					m_obj.audio = false;

					XKit.extensions.mute.muted.push(m_obj);
					XKit.extensions.mute.save();
					//XKit.extensions.mute.do_posts(true);

				}

				XKit.extensions.mute.frame_run();

			});



		}

	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("mute");

		XKit.extensions.mute.load_muted();

		XKit.post_listener.add("mute", XKit.extensions.mute.do_posts);
		XKit.extensions.mute.do_posts();

		XKit.installed.when_running('show_more', function(show_more) {
			if (show_more.preferences.use_classic_menu.value) {
				show_more.add_custom_menu("mute", function(data) {
					var user_url = data.name;
					var m_class = "";
					var m_sentence = "Mute";
					if (XKit.extensions.mute.return_user_object(user_url) !== -1) {
						m_sentence = "Unmute";
						m_class = "already_muted";
					}

					$(document).off("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked);
					$(document).on("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked);
					return "<div data-url=\"" + user_url + "\" class=\"xkit-mute-button-" + user_url + " xkit-mute " + m_class + "\">" + m_sentence + "</div>";

				});
			} else {
				show_more.add_custom_menu("mute", function(data) {
					var user_url = data.name;
					var m_class = "";
					var m_sentence = "Mute";
					if (XKit.extensions.mute.return_user_object(user_url) !== -1) {
						m_sentence = "Unmute";
						m_class = "already_muted";
					}

					$(document).off("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked_new);
					$(document).on("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked_new);

					return "<li>" +
						"<a data-url=\"" + user_url + "\" class=\"" + m_class + " xkit-mute-button-" + user_url + " xkit-mute xkit-new-menu-fix\">" +
							"<span class=\"hide_overflow\">" + m_sentence + "</span>" +
						"</a>" +
					"</li>";
				});
			}
		}, function() {
			$(document).on('click mouseover', '.tumblelog_popover .info_popover_button', XKit.extensions.mute.add_links_wo_usermenus);
		});
	},

	add_links_wo_usermenus: function(e) {

		//console.log($(".tumblelog_popover_v1").html());
		var m_parent = "";
		var user_url = "";
		if ($(".tumblelog_popover_v1").length > 0) {
		//	user_url = $(".tumblelog_popover_v1").find(".follow_nav").find(".follow").attr('href').replace("/follow/","");
		//	m_parent = $(".tumblelog_popover_v1").find(".tumblelog_menu_popover").find("ul");
		} else {
		//	user_url = $(".tumblelog_popover").find(".follow_nav").find(".follow").attr('href').replace("/follow/","");
		//	m_parent = $(".tumblelog_popover").find(".tumblelog_menu_popover").find("ul");
		}

		if ($(".info_popover").length > 0) {
			m_parent = $(".info_popover").find("ul");
			user_url = m_parent.parent().parent().parent().find(".name").html();
		}
		if (m_parent.find(".xkit-mute").length > 0) { return; }

		var m_html = "";
		console.log("===>" + user_url);

		var m_class = "";
		var m_sentence = "Mute";
		if (XKit.extensions.mute.return_user_object(user_url) !== -1) {
			m_sentence = "Unmute";
			m_class = "already_muted";
		}

		$(document).off("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked_new);
		$(document).on("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked_new);

		m_html = "<li>" +
				"<a style=\"background-image: none !important;\" data-url=\"" + user_url + "\" class=\"xkit-mute-button-" + user_url + " xkit-mute xkit-new-menu-fix " + m_class + "\">" +
					"<span class=\"hide_overflow\">" + m_sentence + "</span>" +
				"</a>" +
			"</li>";

		$(m_parent).append(m_html);

	},

	menu_clicked_new: function(e) {

		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-mute")) {

			while (!m_object.hasClass("xkit-mute")) {
				m_object = m_object.parent();
			}

		}

		var user_url = $(m_object).attr('data-url');
		//XKit.extensions.mute.toggle_mute(user_url);
		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();

		/*var m_sentence = "muted.";
		if (XKit.extensions.mute.return_user_object(user_url) === -1) {
			m_sentence = "unmuted.";
		}
		XKit.notifications.add("User " + user_url + " is now " + m_sentence,"ok");	*/

		if (XKit.extensions.mute.return_user_object(user_url) === -1) {
			XKit.extensions.mute.show_window(user_url, true);
		} else {
			XKit.extensions.mute.toggle_mute(user_url);
			XKit.notifications.add("User <b>" + user_url + "</b> is removed from mute list.", "ok");
		}

	},

	menu_clicked: function(e) {

		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-mute")) {

			while (!m_object.hasClass("xkit-mute")) {
				m_object = m_object.parent();
			}

		}

		var user_url = $(m_object).attr('data-url');
		//XKit.extensions.mute.toggle_mute(user_url);
		XKit.extensions.show_more.hide_classic_menu();

		/*var m_sentence = "muted.";
		if (XKit.extensions.mute.return_user_object(user_url) === -1) {
			m_sentence = "unmuted.";
		}
		XKit.notifications.add("User " + user_url + " is now " + m_sentence,"ok");*/

		if (XKit.extensions.mute.return_user_object(user_url) === -1) {
			XKit.extensions.mute.show_window(user_url, true);
		} else {
			XKit.extensions.mute.toggle_mute(user_url);
			XKit.notifications.add("User <b>" + user_url + "</b> is removed from mute list.", "ok");
		}

	},

	load_muted: function() {

		var m_list = XKit.storage.get("mute", "muted_list", "");
		if (m_list === "") {
			XKit.extensions.mute.muted = [];
		} else {
			try {
				var m_parsed = JSON.parse(m_list);
				var m_convert = false;

				if (typeof m_parsed.list === "undefined" || typeof m_parsed.version === "undefined") {
					//console.log("list or version undefined, converting mute list.");
					m_convert = true;
				} else {
					if (m_parsed.version !== "2") {
						//console.log("version !== 2, converting mute list.");
						m_convert = true;
					}
				}

				//console.log("::::::::MUTE LIST::::::::\n" + JSON.stringify(m_parsed));

				if (m_convert) {
					var new_array = [];
					for (var i = 0; i < m_parsed.length; i++) {
						var m_obj = {};
						m_obj.username = m_parsed[i];
						m_obj.regular = true;
						m_obj.photo = false;
						m_obj.quote = true;
						m_obj.link = true;
						m_obj.chat = true;
						m_obj.video = false;
						m_obj.audio = false;
						new_array.push(m_obj);
					}
					XKit.extensions.mute.muted = new_array;
					//alert(JSON.stringify(new_array));
					XKit.notifications.add("Mute has migrated your old muted users list to the new version.", "ok");
					XKit.extensions.mute.save();
				} else {
					XKit.extensions.mute.muted = m_parsed.list;
				}

			} catch (e) {
				XKit.extensions.mute.muted = [];
				XKit.extensions.mute.save();
			}
		}

	},

	should_be_removed: function(type, username, reblogged_post, original_post) {

		// console.log(" checking, type = " + type + " || username = " + username);

		if (XKit.interface.where().inbox === true) { return false; }

		for (var i = 0; i < XKit.extensions.mute.muted.length; i++) {

			if (typeof XKit.extensions.mute.muted[i].username === "undefined") {continue; }

			if (XKit.extensions.mute.muted[i].username !== username) {
				continue;
			}

			if (type === "note" && XKit.extensions.mute.muted[i].asks === true) {
				return true;
			}

			if (type === "photoset" && XKit.extensions.mute.muted[i].photo === true) {
				return true;
			}

			if (type === "conversation" && XKit.extensions.mute.muted[i].chat === true) {
				return true;
			}

			if (typeof XKit.extensions.mute.muted[i].reblogs !== "undefined") {
				if (XKit.extensions.mute.muted[i].reblogs === true && reblogged_post === true) {
					return true;
				}
			}

			if (typeof XKit.extensions.mute.muted[i].originals !== "undefined") {
				if (XKit.extensions.mute.muted[i].originals === true && original_post === true) {
					return true;
				}
			}

			if (XKit.extensions.mute.muted[i][type] === true) {
				return true;
			}

		}

		return false;

	},

	do_posts: function(rethink) {

		$('.tumblelog_menu_button').unbind('click', XKit.extensions.mute.add_mute_link);
		$('.tumblelog_menu_button').bind('click', XKit.extensions.mute.add_mute_link);

		var update_rects = false;

		if (rethink === true) {

			$(".xmute-muted").each(function() {
				$(this).attr('class', $(this).attr("data-xkit-mute-old-classes"));
			});

			$(".xmute-done, .xmute-muted").removeClass("xmute-muted").removeClass("xmute-done");

		}

		var posts = XKit.interface.get_posts("xmute-done");

		$(posts).each(function() {

			$(this).addClass("xmute-done");

			var m_post = XKit.interface.post($(this));
			if (m_post.is_mine === true) { return; }

			if ($(this).hasClass("xkit_view_on_dash_post")) { return; }

			if (XKit.extensions.mute.should_be_removed(m_post.type, m_post.owner, m_post.is_reblogged, !m_post.is_reblogged) === true) {
				update_rects = true;
				$(this).attr("data-xkit-mute-old-classes", $(this).attr("class"));
				$(this).attr("class", "xmute-muted xmute-done");
			} else {
				if (rethink === true) {
					$(this).attr('class', $(this).attr("data-xkit-mute-old-classes"));
					$(this).removeClass("xmute-muted");
					update_rects = true;
				}
			}

		});

		if (update_rects === true) {
			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("DOMEventor:updateRect");
			}, true, "");
		}

	},

	add_mute_link: function(e) {

		var menu_box = $(e.target).parent().find(".tumblelog_menu_popover");
		var user_url = $(menu_box).parent().find(".tumblelog_menu_link").attr('data-tumblelog-name');
		var m_class = "";

		var m_sentence = "Mute";
		if (XKit.extensions.mute.return_user_object(user_url) !== -1) {
			m_sentence = "Unmute";
			m_class = "already_muted";
		}

		if ($(menu_box).find(".xkit-mute-button").length > 0) {
			// Remove first.
			$(menu_box).find(".xkit-mute-button").parent().remove();
		}

		/*

		The new menu structure:

		<div class="popover_menu_item">
			<a class="user_menu_toggle_follow tumblelog_menu_link unfollow">
				<span class="hide_overflow">
					<span class="follow">Follow</span>
					<span class="unfollow">Unfollow</span>
				</span>
			</a>
		</div>

		*/


		var m_html = "<div class=\"popover_menu_item\">" +
				"<a onclick=\"return false;\" class=\"tumblelog_menu_link xkit-mute-button " + m_class + " xkit-mute-button-" + user_url + "\" data-user-url=\"" + user_url + "\">" +
					"<span class=\"hide_overflow\">" + m_sentence + "</span>" +
				"</a>" +
			"</div>";

		$(menu_box).find(".open_in_tab").parent().before(m_html);

		var m_target = e.target;

		$(".xkit-mute-button-" + user_url).unbind('click');
		$(".xkit-mute-button-" + user_url).bind('click', function() {

			XKit.extensions.mute.toggle_mute(user_url);
			setTimeout(function() { $("#glass_overlay").trigger('click'); }, 10);
			$("#glass_overlay").removeClass("show");
			$(m_target).trigger('click');

		});

	},

	toggle_mute: function(user_url) {

		if (XKit.extensions.mute.return_user_object(user_url) !== -1) {

			for (var i = 0; i < XKit.extensions.mute.muted.length; i++) {

				if (XKit.extensions.mute.muted[i].username === user_url) {
					console.log("User found, removing from list.");
					XKit.extensions.mute.muted.splice(i, 1);
					XKit.extensions.mute.save();
					XKit.extensions.mute.do_posts(true);
					return;
				}

			}

			console.log("User could not be found on the list!..");

		} else {

			console.log("Adding user to mute list.");

			if (XKit.extensions.mute.muted.length >= 101) {
				XKit.window.show("Can't mute.", "You have over a hundred muted blogs.<br/>Please remove some before muting people.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				return;
			}

			var m_obj = {};
			m_obj.username = user_url;
			m_obj.regular = true;
			m_obj.photo = false;
			m_obj.quote = true;
			m_obj.link = true;
			m_obj.chat = true;
			m_obj.video = false;
			m_obj.audio = false;

			XKit.extensions.mute.muted.push(m_obj);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);

		}

	},

	save: function() {

		var m_object = {};
		m_object.version = "2";
		m_object.list = XKit.extensions.mute.muted;
		XKit.storage.set("mute", "muted_list", JSON.stringify(m_object));

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("mute");
		$('.user_menu_info_button').unbind('click', XKit.extensions.mute.add_mute_link);
		$(".xkit-mute-button").remove();
		$(".xmute-muted").each(function() {
			$(this).attr('class', $(this).attr("data-xkit-mute-old-classes"));
		});

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

		$(document).off('click', '.tumblelog_menu_btn', XKit.extensions.mute.add_links_wo_usermenus);

		try {
			XKit.extensions.show_more.remove_custom_menu("mute");
		} catch (e) {
			XKit.console.add("Can't remove custom menu, " + e.message);
		}

	},

	create_div: function(ud) {

		if (typeof ud.username === "undefined") {return ""; }
		return "<div data-user-name=\"" + ud.username + "\" class=\"xkit-muted-user\">" + ud.username + "<div class=\"xkit-unmute-user-button\" data-user-name=\"" + ud.username + "\">&#10006;</div></div>";

	},

	return_user_object: function(ud) {

		for (var i = 0; i < XKit.extensions.mute.muted.length; i++) {
			if (XKit.extensions.mute.muted[i].username === ud) {
				return XKit.extensions.mute.muted[i];
			}
		}

		return -1;

	},

	show_window: function(ud, from_user_menu) {

		var m_regular_class = "";
		var m_photo_class = "";
		var m_quote_class = "";
		var m_link_class = "";
		var m_chat_class = "";
		var m_audio_class = "";
		var m_video_class = "";
		var m_asks_class = "";
		var m_reblogs_class = "";
		var m_originals_class = "";

		var user_object = XKit.extensions.mute.return_user_object(ud);

		if (user_object !== -1) {
			if (user_object.regular === true) { m_regular_class = "selected"; }
			if (user_object.photo === true) { m_photo_class = "selected"; }
			if (user_object.quote === true) { m_quote_class = "selected"; }
			if (user_object.link === true) { m_link_class = "selected"; }
			if (user_object.chat === true) { m_chat_class = "selected"; }
			if (user_object.audio === true) { m_audio_class = "selected"; }
			if (user_object.video === true) { m_video_class = "selected"; }
			if (user_object.asks === true) { m_asks_class = "selected"; }
			if (typeof user_object.reblogs !== "undefined") {
				if (user_object.reblogs === true) { m_reblogs_class = "selected"; }
			}
			if (typeof user_object.originals !== "undefined") {
				if (user_object.originals === true) { m_originals_class = "selected"; }
			}
		}


		var m_html =	"<div class=\"xkit-mute-options\">" +
					"<div data-type=\"regular\" class=\"xkit-mute-option regular " + m_regular_class + "\">&nbsp;</div>" +
					"<div data-type=\"asks\" class=\"xkit-mute-option asks " + m_asks_class + "\">&nbsp;</div>" +
					"<div data-type=\"photo\" class=\"xkit-mute-option photo " + m_photo_class + "\">&nbsp;</div>" +
					"<div data-type=\"quote\" class=\"xkit-mute-option quote " + m_quote_class + "\">&nbsp;</div>" +
					"<div data-type=\"link\" class=\"xkit-mute-option link " + m_link_class + "\">&nbsp;</div>" +
					"<div data-type=\"chat\" class=\"xkit-mute-option chat " + m_chat_class + "\">&nbsp;</div>" +
					"<div data-type=\"audio\" class=\"xkit-mute-option audio " + m_audio_class + "\">&nbsp;</div>" +
					"<div data-type=\"video\" class=\"xkit-mute-option video " + m_video_class + "\">&nbsp;</div>" +
				"</div>";

		XKit.window.show("Muting options for " + ud, "<b>Hide the following types of posts:</b>" + m_html + "<div style=\"margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dotted rgb(190,190,190);\"><div class=\"xkit-checkbox " + m_originals_class + "\" id=\"xkit-mute-hide-originals-checkbox\"><b>&nbsp;</b>Hide original posts by this user (applies to all post types)</div><br/><div class=\"xkit-checkbox " + m_reblogs_class + "\" id=\"xkit-mute-hide-reblogs-checkbox\"><b>&nbsp;</b>Hide posts this user reblogs (applies to all post types)</div></div>Posts with the selected type will not be shown on your dashboard, without any indication that they are hidden.", "question", "<div class=\"xkit-button default\" id=\"xkit-mute-save-changes\">Save</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-mute-hide-reblogs-checkbox").click(function() {

			$(this).toggleClass("selected");

			if ($("#xkit-mute-hide-originals-checkbox").hasClass("selected") && $(this).hasClass("selected")) {
				$("#xkit-mute-hide-originals-checkbox").removeClass("selected");
			}

		});

		$("#xkit-mute-hide-originals-checkbox").click(function() {

			$(this).toggleClass("selected");

			if ($("#xkit-mute-hide-reblogs-checkbox").hasClass("selected") && $(this).hasClass("selected")) {
				$("#xkit-mute-hide-reblogs-checkbox").removeClass("selected");
			}

		});



		$(".xkit-mute-option").click(function() {

			$(this).toggleClass("selected");

		});

		$("#xkit-mute-save-changes").click(function() {

			if ( $(".xkit-mute-option.selected").length <= 0 && !$("#xkit-mute-hide-originals-checkbox").hasClass("selected") && !$("#xkit-mute-hide-reblogs-checkbox").hasClass("selected")) { alert("Please select the post types to block or check the Hide Reblogs checkbox."); return; }

			var m_object = {};
			m_object.username = ud;
			m_object.regular = $(".xkit-mute-option.regular").hasClass("selected");
			m_object.photo = $(".xkit-mute-option.photo").hasClass("selected");
			m_object.quote = $(".xkit-mute-option.quote").hasClass("selected");
			m_object.link = $(".xkit-mute-option.link").hasClass("selected");
			m_object.chat = $(".xkit-mute-option.chat").hasClass("selected");
			m_object.audio = $(".xkit-mute-option.audio").hasClass("selected");
			m_object.video = $(".xkit-mute-option.video").hasClass("selected");
			m_object.asks = $(".xkit-mute-option.asks").hasClass("selected");

			m_object.reblogs = $("#xkit-mute-hide-reblogs-checkbox").hasClass("selected");
			m_object.originals = $("#xkit-mute-hide-originals-checkbox").hasClass("selected");

			var found_user = false;

			for (var i = 0; i < XKit.extensions.mute.muted.length; i++) {
				if (XKit.extensions.mute.muted[i].username === ud) {
					found_user = true;
					XKit.extensions.mute.muted[i] = m_object;
					break;
				}
			}

			if (!found_user) {
				if (from_user_menu) {
					XKit.notifications.add("User <b>" + ud + "</b> is added to mute list.", "ok");
				}
				XKit.extensions.mute.muted.push(m_object);
			}

			XKit.extensions.mute.save();
			XKit.extensions.mute.cpanel(XKit.extensions.mute.control_panel_div);
			XKit.extensions.mute.do_posts(true);

			XKit.window.close();

		});

	},

	control_panel_div: "",

	cpanel: function(mdiv) {

		if ($("#xkit-control-panel-mute").length > 0) {
			$("#xkit-control-panel-mute").remove();
		}

		XKit.extensions.mute.control_panel_div = mdiv;

		var found_count = 0;
		for (var j = 0; j < XKit.extensions.mute.muted.length; j++) {
			//console.log(XKit.extensions.mute.muted[i].username);
			if (typeof XKit.extensions.mute.muted[j].username !== "undefined") {
				if (XKit.extensions.mute.muted[j].username !== "") {
					found_count++;
				}
			}
		}

		if (found_count <= 0) {
			var no_muted_html = "<div id=\"xkit-control-panel-mute\" class=\"no-muted-users\"><b>You have no muted users.</b><br/>You can add some using the menu on their avatars on your dashboard.<br/>Hover over their avatar, click on the user options icon, then Mute.</div>";
			$(mdiv).append(no_muted_html);
			return;
		}

		var m_html = "";
		XKit.extensions.mute.muted.forEach(function(muted) {
			m_html = m_html + XKit.extensions.mute.create_div(muted);
		});

		$(mdiv).append("<div id=\"xkit-control-panel-mute\">" + m_html + "</div>");

		if (XKit.extensions.mute.muted.length >= 4) {
			$(".xkit-muted-user:last-child").css("border-bottom", "0");
		}

		$(".xkit-unmute-user-button").unbind("click");
		$(".xkit-unmute-user-button").bind("click", function() {

			var m_username = $(this).attr('data-user-name');

			for (var i = 0; i < XKit.extensions.mute.muted.length; i++) {
				if (XKit.extensions.mute.muted[i].username === m_username) {
					XKit.extensions.mute.muted.splice(i, 1);
					XKit.extensions.mute.save();
					XKit.extensions.mute.do_posts(true);
					XKit.extensions.mute.cpanel(mdiv);
					break;
				}
			}

		});

		$(".xkit-muted-user").unbind("click");
		$(".xkit-muted-user").bind("click", function() {

			var m_username = $(this).attr('data-user-name');
			XKit.extensions.mute.show_window(m_username);

		});

	}

});
