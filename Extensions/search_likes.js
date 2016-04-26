//* TITLE Search Likes **//
//* VERSION 0.3.2 **//
//* DESCRIPTION Lets you search likes **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This is a very experimental extension that lets you search the posts you've liked by URL or text. Just go to your likes page, then click on Search button to get started. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.search_likes = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("://www.tumblr.com/likes") !== -1) {


		XKit.tools.init_css("search_likes");

		var m_html = '<li id="xkit-search-likes-li">' +
				'<a href="#" class="customize" id="xkit-search-likes-button">' +
					'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Search liked posts</div>' +
				'</a>' +
				'</li>';

		var x_html = "<div id=\"xkit-search-likes-box\">" +
					"<input type=\"text\" placeholder=\"Enter URL/text...\" id=\"xkit-search-likes-input\">" +
				"</div>";

		m_html = '<ul class="controls_section" id="xkit-search-likes-ul"><li class=\"section_header selected\">SEARCH LIKES</li>' + m_html + '</ul>';

		$("ul.controls_section:first").after(m_html);
		$("#xkit-search-likes-ul").before(x_html);

		$("#xkit-search-likes-button").click(function() {

			XKit.extensions.search_likes.search_start();

			return false;
		});

		$("#xkit-search-likes-input").keyup(function() {

			var m_value = $(this).val().toLowerCase();
			m_value = $.trim(m_value);

			$(".xkit-search-likes-done").removeClass("xkit-search-likes-done");
			XKit.extensions.search_likes.term = m_value;
			XKit.extensions.search_likes.search_do_posts();

			$(".xkit-search-likes-done").removeClass("xkit-search-likes-done").removeClass("xkit-search-likes-found");

		});

		}

	},

	term: "",
	page: 0,
	scooping: false,

	update_rect: function() {

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	search_do_posts: function() {

		var m_term = XKit.extensions.search_likes.term;

		if (m_term.length <= 2) {

			// Show all.

			$(".post").parent().not("#right_column").addClass("xkit-search-likes-force-found");
			$(".post").parent().slideDown('fast');

			$("#xkit-search-likes-status-bar").remove();

			XKit.extensions.search_likes.update_rect();
			$(".post:gt(20)").parent().remove();

			XKit.extensions.search_likes.page = 0;
			XKit.extensions.search_likes.scooping = false;

			return;
		} else {

			$(".xkit-search-likes-force-found").not("#right_column").removeClass("xkit-search-likes-force-found");

		}

		var i_html = "Searching for <b>\"" + m_term + "\"</b><br/><span id=\"xkit-search-likes-found-count\">0</span> results found so far<span style=\"display: none;\">, inspected <span id=\"xkit-search-likes-total-count\">0</span> posts.</span><br/><small>Scroll down to load more posts and results.</small>";

		if ($("#xkit-search-likes-status-bar").length > 0) {
			$("#xkit-search-likes-status-bar").html(i_html);
		} else {
			$("#posts").before("<div id=\"xkit-search-likes-status-bar\">" + i_html + "</div>");
		}

		// Remove the unnecessary posts.
		$(".post_container.xkit-search-likes-done-container:gt(20)").not(".xkit-search-likes-found").remove();

		var multi_array = [];

		$(".post").not("#tumblr_radar").each(function() {

			var post_id = $(this).attr('data-post-id');

			if (multi_array.indexOf(post_id) !== -1) {
				console.log(" >>> !! Multiple same posts found, removing this one.");
				$(this).remove(); return;
			} else {
				multi_array.push(post_id);
			}

		});

		$(".post").not("#tumblr_radar").not("xkit-search-likes-done").each(function() {

			var username = $(this).attr('data-tumblelog-name');
			var hide_this = false;

			$(this).addClass("xkit-search-likes-done");

			var to_search_in = $(this).find(".post_content").text().toLowerCase();

			if ($(this).find(".post_tag").length > 0) {

				$(this).find(".post_tag").each(function() {

					to_search_in = to_search_in + " " + $(this).html().toLowerCase();
					to_search_in = to_search_in + " " + $(this).html().toLowerCase().substring(1);

				});

			}

			if (typeof username !== "undefined") {
				to_search_in = to_search_in + username;
			}

			document.title = m_term;

			if (to_search_in.indexOf(m_term) === -1) {
				hide_this = true;
			}

			$(this).parent().addClass("xkit-search-likes-done-container");

			if (!hide_this) {

				$(this).parent().slideDown('fast');
				$(this).parent().addClass("xkit-search-likes-found");

				$(this).find(".post_body").find("mark").contents().unwrap();
				var m_html = XKit.extensions.search_likes.return_highlighted_html($(this).find(".post_body").html(), m_term);
				$(this).find(".post_body").html(m_html);

			} else {

				$(this).parent().slideUp('fast');
				$(this).parent().removeClass("xkit-search-likes-found");
				$(this).find(".post_body").find("mark").contents().unwrap();

			}

		});

		if ($(".xkit-search-likes-found").length <= 20) {

			XKit.extensions.search_likes.scooping = true;
			XKit.extensions.search_likes.scoop();

		}

		$("#xkit-search-likes-found-count").html($(".xkit-search-likes-found").length);
		$("#xkit-search-likes-total-count").html($(".post").length);

	},

	scoop: function() {

		XKit.extensions.search_likes.page++;

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/likes/page/" + XKit.extensions.search_likes.page,
			json: false,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
			onerror: function(response) {
				if (!XKit.extensions.search_likes.scooping) { return; }
				setTimeout(function() { XKit.extensions.search_likes.scoop(); }, 200);
			},
			onload: function(response) {

				if (!XKit.extensions.search_likes.scooping) { return; }

				var m_posts = $(".post", response.responseText);

				var add_these = true;

				$(m_posts).each(function() {

					var m_search = $(this).attr('id');

					if ($("#" + m_search).length > 0) {
						// This set is already present.
						add_these = false;
						return false;
					}

				});

				if (add_these) {

					console.log("Search Likes Scooping: Found and adding!");
					$("#posts").append(response.responseText);

				} else {

					console.log("Search Likes Scooping: This set already present, skipping.");

				}

				if ($(".xkit-search-likes-found").length >= 5) {

					console.log("Search Likes Scooping: No need to scoop anymore, stopping!");
					return;

				}

				setTimeout(function() { XKit.extensions.search_likes.scoop(); }, 200);

			}
		});

	},

	return_highlighted_html: function(src_str, term) {

		/* from http://jsfiddle.net/UPs3V/ */

		try {

			term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
			var pattern = new RegExp("("+term+")", "i");

			src_str = src_str.replace(pattern, "<mark>$1</mark>");
			src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");

			return src_str;

		} catch(e) {

			return src_str;

		}

	},

	search_start: function() {

		$("#xkit-search-likes-button").toggleClass("xkit-in-search");

		if ($("#xkit-search-likes-button").hasClass("xkit-in-search")) {

			$("#xkit-search-likes-li").addClass("selected");

			XKit.extensions.search_likes.term = "";
			$("#xkit-search-likes-input").val("");

			$("#right_column").children().not("#xkit-search-likes-ul").not("#xkit-search-likes-box").slideUp('fast');
			$("#xkit-search-likes-box").slideDown('slow');

			XKit.post_listener.add("search_likes", XKit.extensions.search_likes.search_do_posts);
			XKit.extensions.search_likes.search_do_posts();

			XKit.tools.add_css(" #posts.posts>.post_container { display: none; } ", "search-likes-in-search");

		} else {

			$("#xkit-search-likes-li").removeClass("selected");

			XKit.post_listener.remove("search_likes", XKit.extensions.search_likes.search_do_posts);
			XKit.tools.remove_css("search-likes-in-search");

			$(".post").not("#tumblr_radar").parent().addClass("xkit-search-likes-found");
			$(".post").not("#tumblr_radar").parent().slideDown('fast');

			$(".xkit-search-likes-done").removeClass("xkit-search-likes-done");

			$("#xkit-search-likes-status-bar").slideUp('slow', function() { $(this).remove(); });

			XKit.extensions.search_likes.update_rect();

			$(".post:gt(30)").parent().remove();

			$("#right_column").children().not("#xkit-search-likes-ul").not("#xkit-search-likes-box").slideDown('slow');
			$("#xkit-search-likes-box").slideUp('slow');

		}

	},

	destroy: function() {
		this.running = false;
	}

});
