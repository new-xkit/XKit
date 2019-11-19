//* TITLE Soft Refresh **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Refresh without refreshing **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension allows you to see new posts on your dashboard without refreshing the page. When you get the New Posts bubble, click the home button, and new posts will appear on your dashboard.<br><br>Hold down the ALT key to perform a hard refresh using the home button. **//
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

		const where = XKit.interface.where();
		const paginated = location.pathname !== "/dashboard";
		if (where.dashboard === false || paginated === true) {
			return;
		}

		if (this.preferences.use_logo.value) {
			$(".logo-anchor")
				.attr("data-old-href", $(".logo-anchor").attr("href"))
				.css("cursor", "pointer")
				.removeAttr("href")
				.click(this.clicked);
		}

		if (this.preferences.use_home_button.value) {
			$("#home_button > a")
				.attr("data-old-href", $("#home_button > a").attr("href"))
				.removeAttr("href")
				.click(this.clicked);
		}
	},

	clicked: function(event) {
		if (event.altKey) {
			location.reload(true);
		} else {
			XKit.extensions.soft_refresh.start_load();
		}
	},

	start_load: function() {
		if (this.loading) { return; }
		this.loading = true;

		$("html, body").animate({scrollTop: 0}, "slow");

		$("#new_post").after('<div id="xkit_soft_refresh">Checking for new posts</div>');
		$("#xkit_soft_refresh").slideDown("fast");

		$("#new_post_notice_container").css({
			transform: "scale(0)",
			opacity: 0
		});

		this.top_post = $("#posts > li.post_container:not(#new_post_buttons)").first();
		this.request();
	},

	request: function(after_post_id) {
		fetch("https://www.tumblr.com/dashboard" + (after_post_id ? `/2/${after_post_id}` : "")).then(response => {
			if (!response.ok) {
				this.show_error();
				return;
			}

			response.text().then(responseText => {
				if (!after_post_id) {
					$("#new_post_notice_container .tab_notice_value").html("0");
					document.title = this.default_page_title;
					$("#new_post_notice_container")
						.removeClass("tab-notice--active")
						.removeAttr("style");
					$("#posts > li.notification:not(.post_container:not(#new_post_buttons) ~ .notification)").remove();
				}

				let end = false;

				$("#posts > li", responseText)
					.not("#new_post_buttons")
					.not(".standalone-ad-container")
					.not(":has([data-sponsored], [data-is_recommended])")
					.each(function() {
						const $this = $(this);

						if ($this.attr("data-pageable") !== undefined) {
							if ($(`[data-pageable="${$this.attr("data-pageable")}"]`).length) {
								end = true;
								return false;
							}
							XKit.extensions.soft_refresh.post_ids.unshift($this.attr("data-pageable").replace("post_", ""));
						}

						XKit.extensions.soft_refresh.top_post.before($this);
					});

				if (!end) {
					this.request(this.post_ids[0]);
				} else {
					if (this.post_ids.length === 0) {
						if (this.preferences.show_notifications.value) {
							XKit.notifications.add("No new posts found.", "info");
						}
					} else {
						XKit.tools.add_function(this.trigger_tumblr_events, true);
						if (this.preferences.show_notifications.value) {
							XKit.notifications.add(`Added ${this.post_ids.length} new ${(this.post_ids.length === 1 ? "post" : "posts")}.`, "ok");
						}
					}

					$("#xkit_soft_refresh").slideUp("fast", function() { $(this).remove(); });
					this.post_ids = [];
					this.loading = false;
				}
			});
		}).catch(() => this.show_error());
	},

	trigger_tumblr_events: function() {
		Tumblr.Events.trigger("posts:load");
		Tumblr.Events.trigger("DOMEventor:updateRect");
	},

	show_error: function() {
		$("#new_post_notice_container").removeAttr("style");
		$("#xkit_soft_refresh").slideUp("fast", function() { $(this).remove(); });
		this.post_ids = [];
		this.loading = false;

		XKit.window.show(
			"Can't get new posts",

			"I could not fetch the page requested.<br>" +
			"There might be a problem with Tumblr servers, please try again later or try refreshing manually.",

			"error",

			'<div id="xkit-close-message" class="xkit-button default">OK</div>' +
			'<div id="xkit-refresh-page" class="xkit-button">Refresh the page</div>'
		);
		$("#xkit-refresh-page").click(() => location.reload(true));
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
