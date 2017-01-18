//* TITLE Reblog Yourself **//
//* VERSION 1.3.1 **//
//* DESCRIPTION Allows you to reblog posts back to your blog **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.reblog_yourself = {

	running: false,
	slow: true,
	preferences: {
		"dashboard": {
			text: "Enable reblogging yourself from the dashboard",
			default: true,
			value: true
		},
		"postpages": {
			text: "Enable reblogging yourself from post pages",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("://www.tumblr.com/reblog/") !== -1) {
			XKit.extensions.reblog_yourself.fix_page();
		}

		if ($("body").hasClass("is_private_channel")) {return; }

		if ($(".posts .post").length > 0) {
			$(document).on("click", ".post_control.reblog", function() {
				if ($(this).parentsUntil(".post").parent().hasClass("is_mine") === true) {
					XKit.extensions.reblog_yourself.fix_page();
				}
			});
		}
		if (XKit.extensions.reblog_yourself.preferences.dashboard.value === true) {
			XKit.post_listener.add("reblog_yourself", XKit.extensions.reblog_yourself.fix_dashboard);
			XKit.extensions.reblog_yourself.fix_dashboard();
		}

	},

	frame_run: function() {

		if (XKit.extensions.reblog_yourself.preferences.postpages.value === false)
			return;
		// This gets run on frame.
		// Port of ugly code from XKit 6 but at least it works.

		$(".btn.icon.dashboard, .btn.icon.edit, .btn.icon.follow").html("");
		$(".btn.icon.dashboard, .btn.icon.edit, .btn.icon.follow").addClass("no_label");

		var check_if_there = $("body").html().search("/reblog/");
		if (check_if_there !== -1) { return; }

		var postid_start = document.location.href.search("&pid=");
		var postid_end =  document.location.href.indexOf("&", postid_start + 2);
		var post_id = document.location.href.substring(postid_start + 5, postid_end);

		if (postid_start === -1) { return; }

		var xd_start = document.location.href.search("&rk=");
		var xd_end =  document.location.href.indexOf("&", xd_start + 2);
		var xd = document.location.href.substring(xd_start + 4, xd_end);

		var rd_start = document.location.href.search("src=") + 4;
		var rd_end =  document.location.href.indexOf("&", rd_start + 2);
		var rd = document.location.href.substring(rd_start, rd_end);

		var xu_html = '<a class="btn icon reblog no_label" id="xreblogyourselfiframebutton" style="display: none;" title="Reblog" href="/reblog/' + post_id + '/' + xd + '?redirect_to=' + rd + '" target="_top"></a>';


		$.ajax({
			url: '/reblog/' + post_id + '/' + xd + '/',
			success: function(data, xhr) {
				$(".controls").prepend(xu_html);
				$("#xreblogyourselfiframebutton").fadeIn('slow');
			}
		});

	},

	fix_page_interval: "",

	fix_page: function() {

		if ($("#tumblelog_choices").length === 0) {
			XKit.console.add("Can't run Reblog Yourself, delaying..");
			setTimeout(function() { XKit.extensions.reblog_yourself.fix_page(); }, 300);
			return;
		}

		if ($("#popover_blogs").length === 0) {
			XKit.console.add("Can't run Reblog Yourself, popover_blogs not found.");
			return;
		}

		// defaults
		var m_blog_url = $("#popover_blogs").find(".popover_menu_item").first().attr('id').replace("menuitem-", "");
		var m_blog_title = $("#popover_blogs").find(".popover_menu_item").first().find(".blog_title").find("span").html();

		// check which blog is missing from the list
		var m_blogs = XKit.tools.get_blogs();
		var check = [];
		var do_add = false;
		var m_blog_avatar = "";
		for (var i = 0; i < m_blogs.length; i++) {
			if (m_blogs[i] !== "") {
				check = $('#tumblelog_choices').find('.popover_inner ul li div[data-option-value=' + m_blogs[i] + ']');
				if (check.length <= 0) {
					do_add = true;
					m_blog_url = m_blogs[i];
					m_blog_title = $("#menuitem-" + m_blog_url + " .blog_title span").html();

					try {
						m_blog_avatar = $("#menuitem-" + m_blog_url).find(".blog_icon_image").attr('src');
						// I'm pretty sure they just use PNG but just in case:
						m_blog_avatar = m_blog_avatar.replace("_40.png", "_64.png");
						m_blog_avatar = m_blog_avatar.replace("_40.gif", "_64.gif");
						m_blog_avatar = m_blog_avatar.replace("_40.jpg", "_64.jpg");
					} catch (e) {
						XKit.console.add("reblog_yourself: " + e.message);
					}
				} else {
					// console.log("Found for " + m_blogs[i]);
				}
			}
		}

		if (!do_add) { return; }

		var post_avatar = "";
		try {
			post_avatar = m_blog_avatar;
		} catch (e) {
			XKit.console.add("reblog_yourself: " + e.message);
		}

		var m_html = '<div class="option" data-facebook-on="false" data-twitter-on="false" data-facebook="false" data-twitter="false" data-is-password-protected="false" data-use-sub-avatar="" data-use-channel-avatar="0" data-blog-url="http://' + m_blog_url + '.tumblr.com/" data-avatar-url="' + post_avatar + '" data-user-avatar-url="' + post_avatar + '" data-option-value="' + m_blog_url + '" title="' + m_blog_title + '">' + m_blog_url + '</div>';

		$("#tumblelog_choices").find(".popover_inner").find("ul").prepend("<li>" + m_html + "</li>");

	},

	fix_dashboard: function() {

		if (XKit.interface.where().queue === true || XKit.interface.where().drafts === true) {
			return false;
		}

		if ($(".posts .post").length === 0) { return; }

		$('.post.is_mine').not(".xreblogyourself_done").each(function(index) {

			if ($(this).hasClass("xreblogyourself_done") === true) { return; }

			if ($(this).attr('id') === "new_post") { return; }
			if ($(this).hasClass("note") === true) { return; }
			if ($(this).hasClass("is_note") === true) { return; }
			if ($(this).hasClass("is_mine") === false) { return; }
			if ($(this).css('visibility') === "hidden") { return; } // tumblr savior hack.
			if ($(this).css('display') === "none") { return; } // tumblr savior hack.

			$(this).addClass("xreblogyourself_done");

			if ($(this).find('.post_controls').html().search('href="/reblog/') !== -1) {
				// this user can reblog themselves?!
				XKit.console.add("This user can reblog themselves, quitting.");
				return false;
			}

			var post_id = $(this).attr('data-post-id');
			var reblog_key = $(this).attr('data-reblog-key');

			if (post_id === "" || reblog_key === "") {
				// Can't do this for some reason.
				console.log("NO REBLOG / POST ID");
				return;
			}

			var m_html = "<a class=\"post_control reblog added_by_xkit_reblog_yourself\" title=\"\" href=\"/reblog/" + post_id + "/" + reblog_key + "?redirect_to=%2Fdashboard\"><span class=\"offscreen\">Reblog</span></a>";
			$(this).find('.post_control.post_control_menu.creator').before(m_html);
		});

	},

	destroy: function() {
		XKit.post_listener.remove("reblog_yourself");
		$(".added_by_xkit_reblog_yourself").remove();
		$(".xreblogyourself_done").removeClass("xreblogyourself_done");
		this.running = false;
	}

};
