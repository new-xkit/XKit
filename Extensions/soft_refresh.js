//* TITLE Soft Refresh **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Refresh without refreshing **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension allows you to see new posts on your dashboard without refreshing the page. When you get the New Posts bubble, click the home button, and new posts will appear on your dashboard.<br><br>If you still want to refresh the page completely (perform a Hard Refresh), hold the ALT key while clicking on logo and the page will refresh. **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.soft_refresh = new Object({

	running: false,
	slow: true,
	loading: false,
	top_post: {},
	post_ids: [],
	default_page_title: document.title,
	preferences: {
		"use_logo": {
			text: "Soft refresh when the tumblr logo is clicked",
			default: false,
			value: false
		},
		"use_home_button": {
			text: "Soft refresh when the home button is clicked",
			default: true,
			value: true
		},
		"show_notifications": {
			text: "Show refresh result notifications",
			default: true,
			value: true
		}
	},


	run: function() {
		this.running = true;

		XKit.tools.init_css("soft_refresh");
		if (!XKit.interface.where().dashboard) {
			// Not in dashboard, quit.
			return;
		}

		if (this.preferences.use_logo.value) {
			$(".logo-anchor")
				.attr("data-old-href", $(".logo-anchor").attr("href"))
				.css("cursor", "pointer")
				.removeAttr("href")
				.click(XKit.extensions.soft_refresh.logo_clicked);
		}

		if (this.preferences.use_home_button.value) {
			$("#home_button > a")
				.attr("data-old-href", $("#home_button > a").attr("href"))
				.removeAttr("href")
				.click(XKit.extensions.soft_refresh.logo_clicked);
		}
	},

	logo_clicked: function(event) {

		if (event.altKey) {
			location.reload(true);
			return;
		}
		XKit.extensions.soft_refresh.load_posts();

	},

	load_posts: function() {

		if (this.loading) { return; }
		this.loading = true;
		$("html, body").animate({ scrollTop: 0 }, "slow");

		$("#new_post").after("<div id=\"xkit_soft_refresh\">Checking for new posts</div>");
		$("#xkit_soft_refresh").slideDown('fast');

		$("#new_post_notice_container").attr("style", "transform: scale(0); opacity: 0;");

		function soft_refresh_hit_triggers() {
			var postIds = add_tag;
			var Tumblr = window.Tumblr || window.top.Tumblr;

			try {
				Tumblr.Events.trigger("posts:load");
			} catch (e) {
				postIds.forEach(function(id) {
					var postId = "post_" + id;
					var postElement = jQuery(document.getElementById(postId));
					var fakeView = new Tumblr.PostView({
						el: postElement,
						model: Tumblr.PostsView.prototype.createPostModelFromEl(postElement)
					});
					Tumblr.Events.trigger("postsView:createPost", fakeView);
				});
			}
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}
		function request(page) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "https://www.tumblr.com/dashboard" + page,
				onerror: function(response) {
					$("#xkit_soft_refresh").slideUp('fast', function() { $(this).remove(); });
					$("#new_post_notice_container").removeAttr("style");
					XKit.extensions.soft_refresh.show_cant_load_error();
					XKit.extensions.soft_refresh.loading = false;
				},
				onload: function(response) {
					var resText = response.responseText;
					// Fixes the add_to_image_queue bug that causes this addon to stop working.
					// Problem is that the response code wants to call a page embedded function
					resText = resText.replace(/add_to_image_queue\(\'.*\'\)\;/g, "");

					if (page === "") {
						$("#new_post_notice_container .tab_notice_value").html("0");
						document.title = XKit.extensions.soft_refresh.default_page_title;
						$("#new_post_notice_container")
							.removeClass("tab-notice--active")
							.removeAttr("style");
						$("ol#posts > li.notification:not(.post_container:not(#new_post_buttons) ~ .notification)").remove();
					}
					$("ol#posts > li:not(#new_post_buttons):not(.standalone-ad-container)", resText).each(function() {
						var $post = $(this), post_id, exists;
						if ($post.find("[data-sponsored], [data-is_recommended]").length) {
							return;
						}

						if (typeof $post.attr('data-pageable') == "undefined") {
							// It's actually a notification.
							exists = false;
						} else {
							post_id = $post.attr('data-pageable').substring(5);
							exists = $("[data-pageable='post_" + post_id + "']").length;
						}

						if (!exists) {
							typeof post_id == "undefined" || XKit.extensions.soft_refresh.post_ids.push(post_id);
							XKit.extensions.soft_refresh.top_post.before($post);
						} else {
							if (XKit.extensions.soft_refresh.post_ids.length === 0) {
								if (XKit.extensions.soft_refresh.preferences.show_notifications.value === true) {
									XKit.notifications.add("No new posts found.", "info");
								}
							} else {
								XKit.tools.add_function(soft_refresh_hit_triggers, true, XKit.extensions.soft_refresh.post_ids);
								XKit.extensions.soft_refresh.check_embeds();

								if (XKit.extensions.soft_refresh.preferences.show_notifications.value === true) {
									var postsgrammar = "posts";
									if (XKit.extensions.soft_refresh.post_ids.length === 1) {
										postsgrammar = postsgrammar.slice(0, -1);
									}
									XKit.notifications.add("Added " + XKit.extensions.soft_refresh.post_ids.length + " new " + postsgrammar + ".", "ok");
								}

								XKit.extensions.soft_refresh.post_ids = [];
							}

							$("#xkit_soft_refresh").slideUp('fast', function() { $(this).remove(); });
							XKit.extensions.soft_refresh.loading = false;
							return false;
						}
					});

					if (XKit.extensions.soft_refresh.loading) {
						request("/2/" + XKit.extensions.soft_refresh.post_ids[XKit.extensions.soft_refresh.post_ids.length - 1]);
					}
				}
			});
		}

		this.top_post = $("ol#posts > li.post_container:not(#new_post_buttons):first");
		request("");
	},

	check_embeds: function() {

		if ($("body").find(".inline_embed").length > 0) {
			$("body").find(".inline_embed").each(function() {

				try {
					var script = document.createElement("script");
					script.textContent = $(this).html();
					document.body.appendChild(script);
					$(this).remove();
				} catch (e) {
					console.error(e.message);
				}

			});
		}

	},

	show_cant_load_error: function() {

		XKit.window.show("Can't get new posts", "I could not fetch the page requested. There might be a problem with Tumblr servers, please try again later, or click on the Refresh the Page button to refresh it manually.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><div id=\"xkit-refresh-page\" class=\"xkit-button\">Refresh the page</div>");
		$("#xkit-refresh-page").click(function() { location.reload(true); });

	},

	destroy: function() {

		$(".logo-anchor")
			.attr("href", $(".logo-anchor").attr("data-old-href"))
			.removeAttr("style")
			.off("click");

		$("#home_button > a")
			.attr('href', $("#home_button > a").attr('data-old-href'))
			.off("click");

		XKit.tools.remove_css("soft_refresh");
		this.running = false;
	}

});
