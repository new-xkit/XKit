//* TITLE View On Dash **//
//* VERSION 0.7.7 **//
//* DESCRIPTION View blogs on your dash **//
//* DEVELOPER new-xkit **//
//* DETAILS This is a preview version of an extension, missing most features due to legal/technical reasons for now. It lets you view the last 20 posts a person has made on their blogs right on your dashboard. If you have User Menus+ installed, you can also access it from their user menu under their avatar. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.view_on_dash = new Object({

	running: false,
	apiKey: "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",

	preferences: {
		"show_sidebar_button": {
			text: "Show View on Dash button on the sidebar",
			default: true,
			value: true
		},
		"shortcut": {
			text: "Enable the shortcut (alt + V) to open View on Dash",
			default: true,
			value: true
		},
	},

	key_down: function(e) {

		if (e.altKey === true) {
			if (e.which === 86) {
				XKit.extensions.view_on_dash.show_open();
			}
		}

	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("view_on_dash");

		if (XKit.interface.where().queue === true) { return; }

		if (this.preferences.shortcut.value === true) {

			$(document).on('keydown', XKit.extensions.view_on_dash.key_down);

		}

		if (this.preferences.show_sidebar_button.value === true) {

			var xf_html = '<ul class="controls_section" id="view_on_dash_ul">' +
				'<li class="section_header selected">VIEW BLOGS</li>' +
				'<li class="no_push"><a href="#" id="view_on_dash_button">' +
					'<div class="hide_overflow">View on Dash<span class="sub_control link_arrow arrow_right"></span></div>' +
				'</a></li></ul>';
			$("ul.controls_section:eq(1)").before(xf_html);

			$("#view_on_dash_ul").click(function() {

				XKit.extensions.view_on_dash.show_open();

				return false;
			});

		}

		XKit.installed.when_running("show_more", function() {
			var show_more = XKit.extensions.show_more;
			if (show_more.preferences.use_classic_menu.value) {
				show_more.add_custom_menu("view_on_dash", function(data) {
					console.log(data);
					var user_url = data.name;

					$(document).off("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);
					$(document).on("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);

					return "<div data-url=\"" + user_url + "\" class=\"xkit-view_on_dash-button-" + user_url + " xkit-view-on-dashboard\">View on Dash</div>";
				});
			} else {
				show_more.add_custom_menu("view_on_dash", function(data) {
					var user_url = data.name;

					$(document).off("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);
					$(document).on("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);

					return "<li>" +
						"<a data-url=\"" + user_url + "\" class=\"xkit-view_on_dash-button-" + user_url + " xkit-view-on-dashboard xkit-new-menu-fix\">" +
							"<span class=\"hide_overflow\">View On Dash</span>" +
						"</a>" +
					"</li>";
				});
			}
		});
	},

	show_open: function() {

		XKit.window.show("View on Dash","Enter the username of the blog you would like to view <input type=\"text\" maxlength=\"50\" placeholder=\"Enter a URL (example: new-xkit-extension)\" class=\"xkit-textbox\" id=\"xkit-view-on-dash-input-url\" onkeydown=\"if (event.keyCode == 13) document.getElementById('xkit-view-on-dash-ok').click()\">", "question", "<div class=\"xkit-button default\" id=\"xkit-view-on-dash-ok\">Go!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-view-on-dash-ok").click(function() {

			to_add = $("#xkit-view-on-dash-input-url").val().toLowerCase();

			if ($.trim(to_add) === "") {
				XKit.window.close();
				return;
			}

			if (/^[a-zA-Z0-9\-]+$/.test(to_add) === false) {
				alert("Invalid username");
				return;
			}

			XKit.window.close();
			XKit.extensions.view_on_dash.view(to_add);


		});

	},

	menu_clicked: function(e) {

		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-view-on-dashboard")) {

			while (!m_object.hasClass("xkit-view-on-dashboard")) {
				m_object = m_object.parent();
			}

		}

		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();
		XKit.extensions.show_more.hide_classic_menu();

		var user_url = $(m_object).attr('data-url');

		XKit.extensions.view_on_dash.view(user_url);

	},

	show_error: function(message) {

		$("#view-on-dash-content").fadeOut('fast');
		$("#view-on-dash-background").fadeOut('slow', function() {

			$("#view-on-dash-content").remove();
			$("#view-on-dash-background").remove();

		});

		XKit.window.show("View on Dash encountered an error", message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	get_photo: function(data, index, width) {

		for (var i=0;i<data.photos[index].alt_sizes.length;i++) {
			if (parseInt(data.photos[index].alt_sizes[i].width) === parseInt(width)) {
				return data.photos[index].alt_sizes[i].url;
			}
		}

		return data.photos[index].alt_sizes[0].url;

	},

	get_photo_height: function(data, index, width) {

		for (var i=0;i<data.photos[index].alt_sizes.length;i++) {
			if (parseInt(data.photos[index].alt_sizes[i].width) === parseInt(width)) {
				return data.photos[index].alt_sizes[i].height;
			}
		}

		return data.photos[index].alt_sizes[0].height;

	},

	parse_item: function(data, username, tumblelog_key) {

		if(tumblelog_key === null){
			tumblelog_key = "";
		}

		var m_html = "<li class=\"post_container\">";
		var post_class = "";
		var additional_classes_for_post = "";

		var post_tags = "";
		var post_contents = "";

		if (data.type === "text") {

			post_class = "is_regular";

			if (data.title !== "" && data.title !== null) {
				post_contents = post_contents + "<div class=\"post_title\">" + data.title + "</div>";
			}

			if (data.body !== "" && data.body !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.body + "</div>";
			}

		}

		if (data.type === "quote") {

			post_class = "is_quote";

			if (data.text !== "" && data.text !== null) {
				post_contents = post_contents + '<div class="post_title medium"><span class="quote">' + data.text + '</span></div>';
			}

			if (data.source !== "" && data.source !== null) {
				post_contents = post_contents + '<div class="post_body"><table class="quote_source_table"><tbody><tr><td valign="top" class="quote_source_mdash">&nbsp;</td><td valign="top" class="quote_source">' + data.source + '</td></tr></tbody></table></div>';
			}

		}

		if (data.type === "link") {

			post_class = "is_link";

			post_contents = post_contents + '<div class="post_media"><div class="link_button clickable"><div class="link_thumbnail_container"><a href="' + data.url + '" target="_blank" class="link_thumbnail_click"><img class="link_thumbnail" src="' + data.link_image + '" alt=""></a></div><div class="link_text_container"><div class="link_text_outer"><div class="link_text"><a href="' + data.url + '" target="_blank" class="link_title">' + data.title + '</a><a href="' + data.url + '" target="_blank" class="link_source">' + data.url + '</a></div></div></div></div></div>';

			if (data.description !== "" && data.description !== null) {

				post_contents = post_contents + '<div class="post_body">' + data.description + '</div>';

			}

		}

		if (data.type === "answer") {

			post_class = "is_note";

			post_contents = post_contents + '<div class="post_body"><div class="note_item"><div class="text"><p class="asker"><span class="name">' + data.asking_name + '</span><span>&nbsp;asked:</span></p><p>' + data.question + '</p></div><div class="nipple"></div></div><div class="avatar"><img src="http://assets.tumblr.com/images/anonymous_avatar_96.gif" alt="" width="40" height="40"></div><div class="answer post_info">' + data.answer + '</div></div>';

		}

		if (data.type === "video") {

			post_class = "is_video";

			var m_post_inner_html = ""; // data["player"][2].embed_code; // '<div class="view-on-dash-not-supported">' + data.type + ' posts are not currently supported.</div>';

			var last_width = 0;
			for (var obj in data.player) {
				if (data.player[obj].width > last_width && data.player[obj].width <= 500) {
					m_post_inner_html = data.player[obj].embed_code;
					last_width = data.player[obj].width;
				}
			}


			post_contents = post_contents + "<div class=\"post_media\">" + m_post_inner_html + "</div>";

			if (data.caption !== "" && data.caption !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.caption + "</div>";
			}

		}

		if (data.type === "audio") {

			post_class = "is_audio";

			post_contents = post_contents + "<div class=\"post_media\">" + data.embed + "</div>";

			if (data.caption !== "" && data.caption !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.caption + "</div>";
			}

		}

		if (data.type === "chat") {
			post_class = "is_conversation";
			post_contents += "<div class=\"post_body\"><ul class=\"conversation_lines\">";
			if (data.dialogue && data.dialogue.length > 0) {
				for (var index = 0; index < data.dialogue.length; index++) {
					var line = data.dialogue[index];
					post_contents += "<li class=\"chat_line\">";
					if (line.label !== "") {
						post_contents += "<strong>" + line.label + " </strong>";
					}
					post_contents += line.phrase + "</li>";
				}
			}
			post_contents += "</ul></div>";
		}

		if (data.type === "photo") {

			post_class = "is_photo";

			//var m_post_inner_html = '<img class="image" width="500" alt="" src="' + data["photo-url-500"] + '" data-thumbnail="' + data["photo-url-100"] + '">';

			if (data.photos.length === 1) { post_class = "is_photo"; }else {post_class = "is_photoset"; }

			var photo_post_inner_html = "";

			if (data.photos.length === 1) {

				photo_post_inner_html = '<img class="image" width="500" alt="" src="' + XKit.extensions.view_on_dash.get_photo(data, 0, "500") + '" data-thumbnail="' + XKit.extensions.view_on_dash.get_photo(data, 0, "100") + '">';

			} else {

				var rows = [];

				for (var i=0;i<data.photoset_layout.length;i++) {
					rows.push(data.photoset_layout[i]);
				}

				photo_post_inner_html = "<div class=\"photoset\" style=\"margin-bottom: 11px;\">";

				var current_photo = 0;

				rows.forEach(function(row_count) {
					var shortest = 0;
					var m_width = 500 / row_count;

					// Calculate the shortest!
					var m_temp_photo = current_photo;

					if (row_count >= 2) {

						for (var m = 1; m < row_count; m++) {

							var photo_height = (m_width * XKit.extensions.view_on_dash.get_photo_height(data, m_temp_photo, "500")) / 500;

							if (photo_height <= shortest ||shortest === 0) {
								shortest = photo_height;
							}

							m_temp_photo++;

						}

					} else {

						shortest = XKit.extensions.view_on_dash.get_photo_height(data, m_temp_photo, "500");

					}

					var in_row_html = "";

					for (var x=0;x < row_count;x++) {

						var m_height = (m_width * XKit.extensions.view_on_dash.get_photo_height(data, current_photo, "500")) / 500;
						var margin_top = 0;

						console.log("m_height = " + m_height + "\nshortest = " + shortest);

						if (m_height > shortest) {
							margin_top = (m_height - shortest) / 2;
						}

						in_row_html = in_row_html + '<a href="' + XKit.extensions.view_on_dash.get_photo(data, current_photo, "500") + '" class="photoset_photo xkit-view-on-dash-photoset-photo" onclick="return false;" id="photoset_link_' + data.id + '_' + current_photo + '">';
						in_row_html = in_row_html + '<img style="margin-top: -' + margin_top + 'px;" class="photoset_photo" width="' + m_width + '" alt="" src="' + XKit.extensions.view_on_dash.get_photo(data, current_photo, "500") + '" data-thumbnail="' + XKit.extensions.view_on_dash.get_photo(data, current_photo, "100") + '">';
						in_row_html = in_row_html + '</a>';

						current_photo++;

					}

					photo_post_inner_html = photo_post_inner_html + "<div class=\"photoset_row photoset_row_" + row_count + "\" style=\"height: " + shortest + "px;\">" + in_row_html + "</div>";

				});

				photo_post_inner_html = photo_post_inner_html + "</div>";

				// photo_post_inner_html = '<div class="view-on-dash-not-supported">Photosets are not currently supported.</div>';

			}

			post_contents = post_contents + "<div class=\"post_media\">" + photo_post_inner_html + "</div>";

			if (data.caption !== "" && data.caption !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.caption + "</div>";
			}

		}

		if (typeof data.tags !== "undefined") {

			post_tags = "<div class=\"post_tags\"><div class=\"post_tags_inner\">";

			data.tags.forEach(function(tag) {
				var fixed_tag_url = XKit.tools.replace_all(tag, + " ", "-");
				post_tags = post_tags + "<a class=\"post_tag\" href=\"http://tumblr.com/tagged/" + fixed_tag_url + "\">#" + tag + "</a>";

			});

			post_tags = post_tags + "</div></div>";

		}

		var source_div = "";
		var reblog_div = "";

		if (data.source_url !== "" && typeof data.source_url !== "undefined") {

			source_div = '<div class="post_source"><a class="post_info_link post_source_link" target="_blank" href="' + data.source_url + '" title="' + data.source_title + '">' + data.source_title + '</a><span class="post_source_name_prefix">Source: </span></div>';

		}

		if (data.reblogged_from_id !== "" && typeof data.reblogged_from_id !== "undefined") {

			reblog_div = '<span class="reblog_source"><span class="reblog_icon" title="' + username + ' reblogged ' + data.reblogged_from_name + '">reblogged</span><a target="_BLANK" title="' + data.reblogged_from_name + '" href="' + data.reblogged_from_url + '" style="" class="post_info_link">' + data.reblogged_from_name + '</a></span>';

		}

		m_html = m_html + "<div class=\"post post_full " + post_class + " same_user_as_last with_permalink no_source xkit_view_on_dash_post\" id=\"post_" + data.id + "\"  data-post-id='" + data.id + "' data-root_id='" + data.id + "' data-tumblelog-key='" + tumblelog_key + "' data-tumblelog-name='" + username + "' data-reblog-key='" + data.reblog_key + "' data-type='" + data.type + "'>" +
					"<div class=\"post_wrapper\">" +
						"<div class=\"post_header\">" +
							"<div class=\"post_info\">" +
								"<a href=\"http://" + username + ".tumblr.com\" class=\"post_info_link\">" + username + "</a>" +
								reblog_div +
							"</div>" +
							source_div +
						"</div>" +
						"<div class=\"post_content clearfix\">" +
							"<div class=\"post_content_inner clearfix\">" +
								"<div class=\"post_container\">" +
									post_contents +
								"</div>" +
							"</div>" +
						"</div>" +
						post_tags +
						"<div class=\"post_footer clearfix\">" +
							'<div class="post_notes"><div class="post_notes_inner"><div class="post_notes_label note_count"><a target="_blank" href="' + data.post_url + '#notes"><span class="note_link_current">' + data.note_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' notes</span></a><div class="notes_outer_container popover popover_gradient nipple_on_left" style="display: none;"><div class="notes_container popover_inner"><div class="popover_scroll"><ol class="notes"></ol><div class="more_notes_link_container"><span class="notes_loading">Loading...</span><a class="more_notes_link" style="display:none;" data-next="" rel="nofollow" href="#">Show more notes</a></div></div></div></div></div></div></div>' +
							"<div class=\"post_controls\" role=\"toolbar\">" +
								"<div class=\"post_controls_inner\">" +
									"<a class=\"post_control reblog\" href=\"/reblog/" + data.id  + "/" + data["reblog-key"] + "?redirect_to=%2Fdashboard\"><span class=\"offscreen\">Reblog</span></a>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
					"<a class=\"post_permalink\" id=\"permalink_" + data.id + "\" href=\"" + data.post_url + "\" target=\"_blank\" title=\"View post\"></a>";

		//alert("<a style=\"display: none;\" class=\"post_permalink\" id=\"permalink_" + data.id + "\" href=\"" + data.url + "\" target=\"_blank\" title=\"View post - whatever\"></a>");
		m_html = m_html + "</div>";
		m_html = m_html + "</li>";

		//console.log(m_html);
		return m_html;

	},

	last_scroll_point: -1,

	render: function(obj) {

		return "<li class=\"post post_full\">yo.</li>";

	},

	get_rand_id: "",

	get_if_liked: function(get_id) {

		if (XKit.extensions.view_on_dash.get_rand_id !== get_id) { return; }

		$(".xkit-view-on-dash-ol .xkit_view_on_dash_post").each(function() {

			XKit.extensions.view_on_dash.get_if_liked_post($(this), get_id);

		});

	},

	get_if_liked_post: function(obj, get_id) {

		if (XKit.extensions.view_on_dash.get_rand_id !== get_id) { return; }

		var m_username = $(obj).attr('data-tumblelog-name');
		var m_rk = $(obj).attr('data-reblog-key');
		var m_post_id = $(obj).attr('data-post-id');

		var m_src = encodeURIComponent("http://" + m_username + ".tumblr.com/post/" + m_post_id);
		var m_url = "http://www.tumblr.com/dashboard/iframe?src=" + m_src + "&pid=" + m_post_id + "&rk=" + m_rk + "&lang=en_US&name=" + m_username + "&brag=false";

		GM_xmlhttpRequest({
			method: "GET",
			url: m_url,
			json: false,
			onerror: function(response) {
				return;
			},
			onload: function(response) {

				if (XKit.extensions.view_on_dash.get_rand_id !== get_id) { return; }

				if ($(".btn.like", response.responseText).length === 0) { return; }

				var post_like_class = "";
				if ($(".btn.like", response.responseText).hasClass("hidden")) { post_like_class = "liked"; }

				var m_data_key = $(".btn.like", response.responseText).attr('data-key');

				var m_html = "<div data-post-id=\"" + m_post_id + "\" data-key=\"" + m_data_key + "\" class=\"post_control like xkit-faux-like-button " + post_like_class + "\" title=\"Like\"></div>";

				$(obj).find(".post_controls_inner").append(m_html);

				$(".xkit-faux-like-button").unbind("click");
				$(".xkit-faux-like-button").bind("click", function() {

					// I can't be arsed with reverse-engineering whatever
					// the hell bind the tumblr controls.

					var to_fetch = "http://www.tumblr.com/svc/like";
					if ($(this).hasClass("liked")) {
						to_fetch = "http://www.tumblr.com/svc/unlike";
					}

					var m_obj = {};
					m_obj.form_key = XKit.interface.form_key();
					m_obj["data[id]"] = $(this).attr('data-post-id');
					m_obj["data[key]"] = $(this).attr('data-key');

					// You just LOVE tracking us don't you?
					m_obj["data[method]"] = "mouse";
					m_obj["data[source]"] = "LIKE_SOURCE_DASHBOARD";
					m_obj["data[placement_id]"] = "false";

					var m_icon_obj = $(this);

					$(m_icon_obj).toggleClass("liked");

					GM_xmlhttpRequest({
						method: "POST",
						url: to_fetch,
						data: $.param(m_obj),
						json: false,
						headers: {
							"X-tumblr-form-key": XKit.interface.form_key(),
						},
						onerror: function(response) {
							alert("Can't process like/unlike, please try again later or file for a bug report at http://new-xkit-extension.tumblr.com/ask.");
							// Revert changes.
							$(m_icon_obj).toggleClass("liked");
						},
						onload: function(response) {
							// Do nothing except a little dance.
						}
					});

				});

			}
		});

	},
	view: function(username, offset, page, type) {

		var tumblelog_key = null;

		$.ajax({
			method:"GET",
			url: "https://www.tumblr.com/svc/indash_blog/posts?tumblelog_name_or_id=" + username + "&limit=1&offset=0",
			success: function(data) {
				tumblelog_key = data.response.posts[0].tumblelog_key;
			},
			datatype: "json"
		});

		//$("#view-on-dash-background,#view-on-dash-content").remove();

		$("#view-on-dash-no-posts,.xkit-view-on-dash-ol").remove();

		$("#view-on-dash-forward, #view-on-dash-back").addClass("disabled");

		var html_append_mode = false;

		if ($("#view-on-dash-background").length === 0) {

			$("body").append("<div id=\"view-on-dash-background\">&nbsp;</div><div class=\"loading\" id=\"view-on-dash-content\">&nbsp;</div>");
			XKit.extensions.view_on_dash.last_scroll_point = $("body").scrollTop();

			$('html, body').animate({
				scrollTop: 0
			}, 500);

		} else {

			html_append_mode = true;

			$("#view-on-dash-content").append("<div id=\"view-on-dash-loader-box\">&nbsp;</div>");

		}

		if (typeof offset === "undefined") { offset = 0; }
		if (typeof page === "undefined") { page = 0; }
		if (typeof type === "undefined") { type = ""; }

		var api_url = "https://api.tumblr.com/v2/blog/" + username + ".tumblr.com/posts/" + type + "?api_key=" + XKit.extensions.view_on_dash.apiKey + "&reblog_info=true&offset=" + offset;

		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function(response) {
				console.log("view-on-dash -> Error getting page.");
				XKit.extensions.view_on_dash.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: VOD-230");
				return;
			},
			onload: function(response) {
				try {

					data = JSON.parse(response.responseText);

					$("#view-on-dash-content").removeClass("loading");

					if ($("#view-on-dash-loader-box").length > 0) {$("#view-on-dash-loader-box").remove(); }

					var m_header = "";

					if ($("#view-on-dash-header").length === 0) {

						m_header = "<div id=\"view-on-dash-header\" data-username=\"" + username + "\" data-page=\"" + page + "\">" +
									"<img id=\"view-on-dash-avatar\" src=\"https://api.tumblr.com/v2/blog/" + username + ".tumblr.com/avatar/64\">" +
									"<div id=\"view-on-dash-title\">" + data.response.blog.title + "</div>" +
									"<div id=\"view-on-dash-username\">" + data.response.blog.name + "</div>" +
									"<a id=\"view-on-dash-open\" target=\"_BLANK\" href=\"http://" + username + ".tumblr.com\">Open</a>" +
									"<div id=\"view-on-dash-back\" class=\"disabled\">&nbsp;</div>" +
									"<div id=\"view-on-dash-forward\" class=\"disabled\">&nbsp;</div>" +
								"</div>" +
								"<div id=\"view-on-dash-toolbar\">" +
										"<div id=\"view-on-dash-type\">" +
										"<div title=\"All Posts\" data-type=\"\" class=\"view-on-dash-post-type view-on-dash-post-type-all view-on-dash-post-type-selected\">All Posts</div>" +
										"<div title=\"Text Posts\"  data-type=\"text\" class=\"view-on-dash-post-type view-on-dash-post-type-regular\">Text Posts</div>" +
										"<div title=\"Photo Posts\"  data-type=\"photo\" class=\"view-on-dash-post-type view-on-dash-post-type-photo\">Photo Posts</div>" +
										"<div title=\"Quote Posts\"  data-type=\"quote\" class=\"view-on-dash-post-type view-on-dash-post-type-quote\">Quote Posts</div>" +
										"<div title=\"Link Posts\"  data-type=\"link\" class=\"view-on-dash-post-type view-on-dash-post-type-link\">Link Posts</div>" +
										"<div title=\"Chat Posts\"  data-type=\"chat\" class=\"view-on-dash-post-type view-on-dash-post-type-chat\">Chat Posts</div>" +
										"<div title=\"Audio Posts\"  data-type=\"audio\" class=\"view-on-dash-post-type view-on-dash-post-type-audio\">Audio Posts</div>" +
									"</div>" +
								"</div>";

					}

					$("#view-on-dash-back,#view-on-dash-forward").addClass("disabled");

					if (data.response.posts.length === 0) {

						if (html_append_mode) {
							$("#view-on-dash-content").append("<div id=\"view-on-dash-no-posts\">No posts found.</div>");
						} else {
							$("#view-on-dash-content").html(m_header + "<div id=\"view-on-dash-no-posts\">No posts found.</div>");
						}
						if (offset > 0) {
							$("#view-on-dash-back").removeClass("disabled");
						}

					}

					if (html_append_mode) {
						$("#view-on-dash-header").attr('data-page', page);
						$("#view-on-dash-content").append("<ol id=\"posts\" class=\"posts xkit-view-on-dash-ol\"></ol>");
					} else {
						$("#view-on-dash-content").html(m_header + "<ol id=\"posts\" class=\"posts xkit-view-on-dash-ol\"></ol>");
					}

					// I'm a lazy, lazy man.

					if (type !== "") {

						$(".view-on-dash-post-type-selected").removeClass("view-on-dash-post-type-selected");

						$(".view-on-dash-post-type").each(function() {

							if ($(this).attr('data-type') === type) {
								$(this).addClass("view-on-dash-post-type-selected");
							}

						});

					} else {

						$(".view-on-dash-post-type-selected").removeClass("view-on-dash-post-type-selected");
						$(".view-on-dash-post-type-all").addClass("view-on-dash-post-type-selected");

					}

					$(".view-on-dash-post-type").tipTip({maxWidth: "auto", edgeOffset: 7, delay: 10 });

					$("#view-on-dash-header").attr('data-total', data.response.blog.posts);

					for (var i=0;i<data.response.posts.length;i++) {

						$(".xkit-view-on-dash-ol").append(XKit.extensions.view_on_dash.parse_item(data.response.posts[i], username, tumblelog_key));

					}

					if (data.response.blog.posts > data.response.posts.length && data.response.posts.length >= 20) {

						$("#view-on-dash-forward").removeClass("disabled");

					}

					if (offset > 0) {

						$("#view-on-dash-back").removeClass("disabled");

					}

					XKit.post_listener.run_callbacks();

					$(".view-on-dash-post-type").unbind("click");
					$(".view-on-dash-post-type").bind("click", function() {

						if ($("#view-on-dash-loader-box").length > 0) { return; }

						$(".view-on-dash-post-type-selected").removeClass("view-on-dash-post-type-selected");
						$(this).addClass("view-on-dash-post-type-selected");
						XKit.extensions.view_on_dash.view(username, 0, 0, $(this).attr('data-type'));

					});

					$("#view-on-dash-forward").unbind("click");
					$("#view-on-dash-forward").bind("click", function() {

						if ($("#view-on-dash-loader-box").length > 0) { return; }
						if ($(this).hasClass("disabled")) { return; }

						var page = parseInt($("#view-on-dash-header").attr('data-page')) + 1;
						var username = $("#view-on-dash-header").attr('data-username');

						XKit.extensions.view_on_dash.view(username, (page * 20), page, type);

					});

					$("#view-on-dash-back").unbind("click");
					$("#view-on-dash-back").bind("click", function() {

						if ($("#view-on-dash-loader-box").length > 0) { return; }
						if ($(this).hasClass("disabled")) { return; }

						var page = parseInt($("#view-on-dash-header").attr('data-page')) - 1;
						var username = $("#view-on-dash-header").attr('data-username');

						XKit.extensions.view_on_dash.view(username, (page * 20), page, type);

					});

					$("#view-on-dash-background").unbind("click");
					$("#view-on-dash-background").bind("click", function() {

						$("#view-on-dash-content").fadeOut('fast');
						$("#view-on-dash-background").fadeOut('slow', function() {

							try {
							if (XKit.extensions.view_on_dash.last_scroll_point !== -1) {

								$('html, body').animate({
									scrollTop: XKit.extensions.view_on_dash.last_scroll_point
								}, 500);

							}
							} catch(e) {
								// meh.
							}

							$("#view-on-dash-content").remove();
							$("#view-on-dash-background").remove();

						});

					});

					$(".xkit-view-on-dash-photoset-photo").unbind("click");
					$(".xkit-view-on-dash-photoset-photo").bind("click", function() {

						var m_html = "<div id=\"view-on-dash-clean-background\">&nbsp;</div>" +
								"<div style=\"background-image:url('" + $(this).attr('href') + "')\" id=\"view-on-dash-clean-photo\">";

						$("body").append(m_html);

						$("#view-on-dash-clean-photo, #view-on-dash-clean-background").click(function() {

							$("#view-on-dash-clean-photo, #view-on-dash-clean-background").remove();

						});

					});

					XKit.extensions.view_on_dash.get_rand_id = XKit.tools.random_string();
					XKit.extensions.view_on_dash.get_if_liked(XKit.extensions.view_on_dash.get_rand_id);

				} catch(e) {
					console.log("view-on-dash -> Error parsing data. " + e.message);
					XKit.extensions.view_on_dash.show_error("<b>Unable to read JSON received from API calls.</b><br/>Please try again later.<br/><br/>Error Code: VOD-235");
					return;
				}

			}
		});

	},

	destroy: function() {
		this.running = false;
		$(document).off('keydown', XKit.extensions.view_on_dash.key_down);
		$("#view_on_dash_ul").remove();
		try {
			XKit.extensions.show_more.remove_custom_menu("view_on_dash");
		} catch(e){
			XKit.console.add("Can't remove custom menu, " + e.message);
		}
	}

});
