//* TITLE Header Options **//
//* VERSION 2.3.2 **//
//* DESCRIPTION Customize the header. **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension adds your blogs on the top of the page, so you can easily switch between blogs. The blog limit on the header is five, but you can limit this to three blogs and turn off the blog title bubble from the settings. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_header = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep0": {
			text: "Header Appearance",
			type: "separator",
		},
		"fixed_width": {
			text: "Reduce the max width of the header to match the dashboard",
			default: false,
			value: false
		},
		"fixed_position": {
			text: "Fixed position header (un-stickify)",
			default: false,
			value: false
		},
		"fix_color": {
			text: "Make the tab notification bubbles red again",
			default: false,
			value: false
		},
		"sep1": {
			text: "Blogs on the header",
			type: "separator",
		},
		"show_avatars": {
			text: "Show my blogs on the header",
			default: true,
			value: true
		},
		appearance: {
			text: "Avatar Appearance",
			default: "circle",
			value: "circle",
			type: "combo",
			values: [
				"Circle (default)", "circle",
				"Rounded Box", "box"
			],
		},
		maximum: {
			text: "Maximum blogs to show",
			default: "b3",
			value: "b3",
			type: "combo",
			values: [
				"1 Blog", "b1",
				"2 Blogs", "b2",
				"3 Blogs", "b3",
				"4 Blogs", "b4",
				"5 Blogs", "b5"
			],
		},
		"show_bubble": {
			text: "Show blog title bubble on hover",
			default: true,
			value: true
		}
	},

	run: function() {

		XKit.tools.init_css("classic_header");
		$("#xoldeheader").remove();

		if (XKit.extensions.classic_header.preferences.show_avatars.value === true) {
			XKit.extensions.classic_header.show_blogs();
		}

		if (XKit.extensions.classic_header.preferences.fixed_width.value === true) {
			XKit.tools.add_css(" @media screen and (min-width: 900px){.l-header {max-width: 900px!important;}}", "classic_header_fixed_width");
		}

		if (XKit.extensions.classic_header.preferences.fixed_position.value === true) {
			XKit.tools.add_css(" .l-header-container { position: absolute !important; }", "classic_header_fixed_position");
		}

		if (XKit.extensions.classic_header.preferences.fix_color.value === true) {
			XKit.tools.add_css(" .tab_notice_value { color: #ffffff !important; } .selected .tab_notice, .tab_notice { background: #bc3333 !important; } .tab_bar .tab.selected .tab_anchor, .tab_bar .tab.active .tab_anchor {opacity: 0.5;}", "classic_header_fixed_color");
		}

	},

	show_blogs: function() {

		if (document.location.href.indexOf("/following") !== -1) {
			return;
		}
		var m_html = "";
		var m_counter = 0;
		var max_count = 6;

		if (XKit.extensions.classic_header.preferences.maximum.value !== "") {
			max_count = parseInt(XKit.extensions.classic_header.preferences.maximum.value.substring(1)) + 1;
		}

		if (XKit.extensions.classic_header.preferences.appearance.value === "box") {
			XKit.tools.add_css(".xoldeheader-item { border-radius: 7px !important; }", "classic_header_box");
		}

		try {
		var tab_blogs = $(".tab_blog");
		if (tab_blogs.length > 0) {
			tab_blogs.each(function(index) {
				var tab_blog = $(this);
				if (tab_blog.hasClass('tab_dashboard')) {
					return;
				}

				m_counter ++;

				if (m_counter >= max_count) {
					return;
				}

				var raw_id = tab_blog.attr('id');
				// Id has the form tab_blog_{blog-name}
				var blog_id = raw_id.substring('tab_blog_'.length, raw_id.length);
				var blog_icon = tab_blog.find('.blog_icon').css('background-image');
				if (!blog_icon || blog_icon === "none") {
					blog_icon = "no-repeat url(\"http://assets.tumblr.com/images/lock_avatar.png\") 50% / 8px";
				}

				var blog_name = tab_blog.find('.blog_name').text();
				var is_private = tab_blog.find('.blog_icon').hasClass('private');

				if (is_private) {
					blog_name += ' [private]';
				}

				m_html = m_html + '<div class="xoldeheader-item-container">' +
						'<a href="http://www.tumblr.com/blog/' + blog_id + '/" class="xoldeheader-item"' +
						' id="xoldeheader-item-' + blog_id + '"' +
						' style=\'background: ' + blog_icon + '\' title="' + blog_name + '">&nbsp;</a>' +
						' <div class="selection_nipple"></div></div>';
			});
			XKit.storage.set("classic_header","header_html",m_html);
		} else {
			if (XKit.storage.get("classic_header", "header_html","") === "") {
				return;
			} else {
				m_html = XKit.storage.get("classic_header", "header_html","");
			}
		}

		$("#user_tools").prepend('<div id="xoldeheader">' + m_html + '</div>');

		if (XKit.extensions.classic_header.preferences.show_bubble.value === true) {
			$(".xoldeheader-item").tipTip({maxWidth: "auto", delay: 10, edgeOffset: 5 });
		}

		if (document.location.href.indexOf('/blog/') !== -1) {

			var user_url = document.location.href.substring(document.location.href.indexOf('/blog/') + 6);
			user_url = user_url.replace("#","");
			if (user_url.indexOf("/") !== -1) {
				user_url = user_url.substring(0,user_url.indexOf("/"));
			}

			$("#xoldeheader-item-" + user_url).addClass("selected");
			$("#xoldeheader-item-" + user_url).parent().addClass("selected");
			$("#home_button").removeClass("selected");

		}

		} catch(e) {
			XKit.console.add(e.message);
		}

	},

	destroy: function() {
		XKit.tools.remove_css("classic_header");
		XKit.tools.remove_css("classic_header_fixed_color");
		XKit.tools.remove_css("classic_header_fixed_position");
		XKit.tools.remove_css("classic_header_fixed_width");
		$("#xoldeheader").remove();
		XKit.tools.remove_css("classic_header_box");
	}

});
