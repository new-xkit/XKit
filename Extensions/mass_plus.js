//* TITLE Mass+ **//
//* VERSION 0.4.3 **//
//* DESCRIPTION Enhancements for the Mass Editor **//
//* DETAILS This extension allows you to select multiple posts by once, by type or month. It also comes with visual enhancements for the mass post editor, such as selected post count and more! **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mass_plus = new Object({
	api_page_length: 20,
	running: false,
	preferences: {
		sep0: {
			text: "Experimental features",
			type: "separator"
		},
		enable_search_tags: {
			text: "Enable Search By Tag",
			default: false,
			value: false,
			experimental: true
		}
	},
	run: function() {
		this.running = true;
		if (document.location.href.indexOf('://www.tumblr.com/mega-editor/') !== -1 && $("#nav_archive").length > 0) {
			if (document.location.href.indexOf('://www.tumblr.com/activity') !== -1) {return; }
			XKit.tools.init_css("mass_plus");
			XKit.extensions.mass_plus.do();
			setInterval(function() { XKit.extensions.mass_plus.do_headings(); }, 2000);
			XKit.extensions.mass_plus.do_headings();
		}
	},
	do_headings: function() {
		$(".heading").each(function() {
			if ($(this).find(".xkit-mass-plus-buttons-month-inside").length > 0) { 
				return; 
			}
			$(this).append( "<div class=\"xkit-mass-plus-buttons-month-inside\">" +
				"<div data-type=\"month-select\" class=\"xkit-mass-link xkit-selector\">first 100 in this month</div>" +
				"<div data-type=\"month-deselect\" class=\"xkit-mass-link xkit-selector\">deselect this month</div>" +
				"</div>");
		});
		$(".xkit-mass-plus-buttons-month-inside .xkit-mass-link").unbind("click");
		$(".xkit-mass-plus-buttons-month-inside .xkit-mass-link").bind("click", function() {
			var m_type = $(this).attr('data-type');
			if (m_type === "month-select") {
				var m_month = $(this).parent().parent();
				var n_month = $(m_month).nextUntil(".heading");
				$("a.brick.highlighted").trigger("click");
				$(n_month).each(function() {
					$(this).find(".overlay").trigger('click');
					var sel_count = $("a.brick.highlighted").length;
					if (sel_count >= 100) {
						return false;
					}
				});
				XKit.extensions.mass_plus.update_count();
				return;
			}
			if (m_type === "month-deselect") {
				var month_deselect = $(this).parent().parent();
				var month_deselect_heading = $(month_deselect).nextUntil(".heading");
				$(month_deselect_heading).each(function() {
					if ($(this).hasClass("highlighted")) {
						$(this).find(".overlay").trigger('click');
					}
				});
				XKit.extensions.mass_plus.update_count(true);
				return;
			}
		});
	},
	do: function() {
		var m_extra = "";
		if (this.preferences.enable_search_tags.value === true) {
			m_extra = "<div data-type=\"search-tags\" class=\"xkit-mass-link xkit-selector\">search by tags</div>";
		}
		var m_html = "<div class=\"xkit-mass-plus-buttons-month\">" +
			"<div id=\"xkit-mass-count\"><span>0</span> selected (<div data-type=\"help\" class=\"xkit-mass-link xkit-no-left\">help</div>)</div>" +
			"<div data-type=\"select-all\" class=\"xkit-mass-link xkit-selector\">Select first 100</div>" +
			"<div data-type=\"deselect-all\" class=\"xkit-mass-link xkit-selector\">Deselect all</div>" +
			m_extra +
			"<div class=\"xkit-mass-separator xkit-selector\">Select by type:</div>" +
			"<div data-type=\"video\" class=\"xkit-mass-link xkit-selector xkit-select-option video \">&nbsp;</div>" +
			"<div data-type=\"audio\" class=\"xkit-mass-link xkit-selector xkit-select-option audio \">&nbsp;</div>" +
			"<div data-type=\"conversation\" class=\"xkit-mass-link xkit-selector xkit-select-option chat \">&nbsp;</div>" +
			"<div data-type=\"link\" class=\"xkit-mass-link xkit-selector xkit-select-option link \">&nbsp;</div>" +
			"<div data-type=\"quote\" class=\"xkit-mass-link xkit-selector xkit-select-option quote \">&nbsp;</div>" +
			"<div data-type=\"photo\" class=\"xkit-mass-link xkit-selector xkit-select-option photo \">&nbsp;</div>" +
			"<div data-type=\"note\" class=\"xkit-mass-link xkit-selector xkit-select-option ask \">&nbsp;</div>" +
			"<div data-type=\"regular\" class=\"xkit-mass-link xkit-selector xkit-select-option text \">&nbsp;</div>" +
			"<div data-type=\"private\" class=\"xkit-mass-link xkit-selector\">private</div>" +
			"</div>";
		$("body").prepend(m_html);
		$(".xkit-mass-plus-buttons-month .xkit-mass-link").unbind("click");
		$("a.brick").click(function() {
			XKit.extensions.mass_plus.update_count(true);
		});
		$(".xkit-mass-plus-buttons-month .xkit-mass-link").bind("click", function() {
			var m_type = $(this).attr('data-type');
			if (m_type === "help") {
				XKit.window.show("Mass+ Help", "<b>Welcome to Mass+, enhancements for Mass Editor.</b><br/>Use this menu to select from all the visible posts. Unfortunately, the Tumblr limit on editing posts at once is 100, so Mass+ can't select more than 100 at once.<br/><br/>You can select the first 100 posts, deselect all or select by the type of the post. In order to select all posts, you might need to scroll down and let more posts load.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				return;
			}
			if (m_type === "search-tags") {
				XKit.window.show("Search by Tags", "Please enter the tag to search for: <input id=\"xkit-mass-search-tag-txt\" type=\"text\" class=\"xkit-textbox\" placeholder=\"Enter a tag (ie: xkit)\" /><br/>You can only search for <b>one</b> tag at a time.<br/>The first 100 results will be selected.", "question", "<div id=\"xkit-mass-search-for-tags\" class=\"xkit-button default\">Search</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");
				$("#xkit-mass-search-for-tags").click(function() {
					if ($.trim($("#xkit-mass-search-tag-txt").val()) === "") {
						XKit.window.close();
					}
					XKit.extensions.mass_plus.search($("#xkit-mass-search-tag-txt").val());
					XKit.window.show("Please wait..", "Searching for tags, this might take a while..", "info");
				});
				return;
			}
			if (m_type === "select-all") {
				$("a.brick").removeClass("highlighted");
				$("a.brick:lt(100)").addClass("highlighted");
				$(".editor_navigation button").removeAttr('disabled');
				XKit.extensions.mass_plus.update_count();
				return;
			}
			if (m_type === "deselect-all") {
				$("a.brick").removeClass("highlighted");
				$(".editor_navigation button").attr('disabled', 'disabled');
				XKit.extensions.mass_plus.update_count();
				return;
			}
			if (m_type === "private") {
				$("a.brick").removeClass("highlighted");
				$(".editor_navigation button").attr('disabled', 'disabled');
				$(".private_overlay:lt(100)").parent().addClass("highlighted");
				if ($(".highlighted").length > 0) {
					$(".editor_navigation button").removeAttr('disabled');
				}
				XKit.extensions.mass_plus.update_count();
				return;
			}
			var m_sel_count = $("a.brick.highlighted").length;
			var n_sel_count = $("a.brick." + m_type + ":lt(100)").length;
			if (m_sel_count + n_sel_count > 100) {
				XKit.extensions.mass_plus.show_100_error();
				return;
			}
			var m_selector = "a.brick." + m_type + ":lt(100)";
			$(m_selector).addClass("highlighted");
			$(".editor_navigation button").removeAttr('disabled');
			XKit.extensions.mass_plus.update_count();
		});
	},
	search_page: 0,
	search_url: "",
	search_last_timestamp: 0,
	search_found_count: 0,
	search_found_posts: [],
	search: function(tag) {
		// Get the last timestamp:
		var last_brick = $("a.brick").first();
		var last_brick_classes = $(last_brick).attr('class');
		var last_ts_start = last_brick_classes.indexOf('timestamp_');
		if (last_ts_start === -1) {
			alert("Error fetching tags: 100");
			return;
		}
		var last_timestamp = last_brick_classes.substring(last_ts_start + 10);
		if (last_timestamp.indexOf(" ") !== -1) {
			last_timestamp = last_timestamp.substring(0, last_timestamp.indexOf(" "));
		}
		var blog_shortname = document.location.href.substring(document.location.href.indexOf('mega-editor/') + 12);
		if (blog_shortname .indexOf("/") !== -1) { blog_shortname = blog_shortname.substring(0, blog_shortname.indexOf("/")); }
		if (blog_shortname .indexOf("?") !== -1) { blog_shortname = blog_shortname.substring(0, blog_shortname.indexOf("?")); }
		if (blog_shortname .indexOf("#") !== -1) { blog_shortname = blog_shortname.substring(0, blog_shortname.indexOf("#")); }
		this.search_found_count = 0;
		this.search_last_timestamp = last_timestamp;
		this.search_page = 0;
		this.search_found_posts = [];
		this.search_url = "http://api.tumblr.com/v2/blog/" + blog_shortname + ".tumblr.com/posts?api_key=" + XKit.api_key + "&tag=" + tag.toLowerCase();
		this.search_next_page(tag.toLowerCase());
	},
	search_next_page: function(tag) {
		var search_url = this.search_url + "&offset=" + (this.search_page * this.api_page_length);
		XKit.console.add("Fetching " + search_url);
		GM_xmlhttpRequest({
			method: "GET",
			url: search_url,
			onerror: function(response) {
				XKit.window.show("Can't fetch archive.", "Could not fetch required pages to complete your request. Please try again later.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			},
			onload: function(response) {
				var response_object = JSON.parse(response.response);
				var posts_array = response_object.response.posts;
				if (!posts_array || posts_array.length === 0) {
					XKit.extensions.mass_plus.search_results(tag);
					return;
				}
				posts_array.forEach(function(post) {
					XKit.extensions.mass_plus.search_found_posts.push(post.id);
					XKit.extensions.mass_plus.search_found_count++;
				});
				if (XKit.extensions.mass_plus.search_found_count < 100 && XKit.extensions.mass_plus.search_page <= 5) {
					if (posts_array.length < XKit.extensions.mass_plus.api_page_length) {
						XKit.extensions.mass_plus.search_results(tag);
						return;
					}
					XKit.extensions.mass_plus.search_page++;
					XKit.extensions.mass_plus.search_next_page(tag);
				} else {
					XKit.extensions.mass_plus.search_results(tag);
				}
			}
		});
	},
	search_results: function(tag) {
		if (this.search_found_count === 0) {
			XKit.window.show("No results found", "Zero results found for the tag '" + tag + "'", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			return;
		}
		XKit.window.close();
		$("a.brick").removeClass("highlighted");
		for (var i = 0; i < this.search_found_posts.length; i++) {
			if (i >= 100) { break; }
			$("#post_" + this.search_found_posts[i]).addClass("highlighted");
		}
		this.update_count();
	},
	show_100_error: function() {
		XKit.window.show("Trying to select over 100 posts", "This action would result in more than 100 posts being selected, so Mass+ can not continue. Please deselect some posts, or click on Deselect All on top to continue.<br/><br/>This is a Tumblr limitation.<br/>For more information about this, please click on the <b>\"help\"</b> link on the top left corner of this page.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
	},
	update_count: function(from_click) {
		var sel_count = $("a.brick.highlighted").length;
		$("#xkit-mass-count span").html(sel_count);
		if (sel_count === 0 || from_click === true) {
			return;
		}
		if (sel_count === 100) {
			XKit.notifications.add(sel_count + " posts selected.", "ok");
		} else {
			XKit.notifications.add(sel_count + " posts selected.<br/>You might need to scroll down to load more posts.", "ok");
		}
	},
	destroy: function() {
		this.running = false;
	}
});
