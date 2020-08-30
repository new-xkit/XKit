//* TITLE Show Originals **//
//* VERSION 1.2.6 **//
//* DESCRIPTION Only shows original content by the blogs you follow **//
//* DETAILS This extension hides reblogs on your dash that don't contain added original content. This may slow down your computer if it hides a large number of reblogs. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_originals = new Object({

	running: false,
	slow: true,

	status: "on",
	lbl_on: "on",
	lbl_off: "off",
	my_blogs: [],
	blogs_to_exclude: [],

	preferences: {
		"sep-0": {
			text: "Shown content",
			type: "separator"
		},
		"show_original_reblogs": { //this needs a better description (actually all the options do)
			text: "Show reblogged posts with added original content",
			default: true,
			value: true
		},
		"blogs_to_exclude": {
			text: "Show every reblog by these blogs:",
			type: "text",
			default: "",
			value: ""
		},
		"show_my_posts": {
			text: "Never hide my posts",
			default: true,
			value: true
		},
		"sep-1": {
			text: "Functionality",
			type: "separator"
		},
		"use_sidebar_toggle": {
			text: 'Show the "originals only" toggle',
			default: true,
			value: true
		},
		"use_sticky_sidebar": {
			text: 'Stick the toggle to the window as you scroll',
			default: false,
			value: false
		},
		"active_in_peepr": {
			text: "Activate Show Originals on blogs in the sidebar",
			default: true,
			value: true,
		},
		"sep-2": {
			text: "Hidden post appearance",
			type: "separator"
		},
		"hide_posts_generic": {
			text: 'Replace reblogs with a simple "hidden reblog" message',
			default: false,
			value: false
		},
		"hide_posts_completely": {
			text: "Hide dashboard reblogs completely (<a id=\"xkit-completely-hide-posts-help\" href=\"#\" onclick=\"return false\">may break endless scrolling</a>)",
			default: false,
			value: false,
			slow: true,
		},
	},

	cpanel: function(div) {
		$("#xkit-completely-hide-posts-help").click(function() {
			XKit.window.show("Completely hiding posts", 'If you have endless scrolling enabled and XKit completely hides every single post on the first "page" of your dashboard, you may become unable to scroll down to load more posts. Disable this option if you experience an empty dashboard with the loading icon appearing forever.', "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		});
	},

	endlessScrollingWarning: async function() {
		if (XKit.storage.get("show_originals", "shown_warning_about_scrolling", "") !== "yass") {

			//detects endless scrolling via the "next" button
			const nextAriaLabel = await XKit.interface.translate('Next');
			if ($(`button[aria-label="${nextAriaLabel}"]`).length) {

				XKit.notifications.add("Show Originals works best when Endless Scrolling is turned on. Click here to learn more and dismiss this popup.", "warning", false, function() {
					XKit.window.show("Endless Scrolling recommended.", "Show Originals works best when Endless Scrolling is enabled on your dashboard. If you want to enable it, click on the Account Settings button (person icon) on top-right of the page and then Settings > Dashboard > Enable endless scrolling.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					XKit.storage.set("show_originals", "shown_warning_about_scrolling", "yass");
				});
			}
		}
	},

	run: async function() {
		this.running = true;

		const where = XKit.interface.where();

		//split up for clarity; masonry may be doable eventually
		//also, no current detection for /liked/by in interface.where
		const dont_run_irrelevant = where.inbox || where.following || where.followers || where.activity;
		const dont_run_mine = where.queue || where.channel || where.drafts || where.likes;
		const uses_masonry = where.explore || where.search || where.tagged;

		if (dont_run_irrelevant || dont_run_mine || uses_masonry) { return; }

		this.my_blogs = XKit.tools.get_blogs();
		this.blogs_to_exclude = this.preferences.blogs_to_exclude.value.split(/[ ,]+/);

		if (XKit.page.react) {

			if (where.dashboard) {
				this.endlessScrollingWarning();
			}

			this.add_css();

			const section = {
				id: "xshow_originals_sidebar",
				title: "Show Originals",
				items: [{
					id: "xshoworiginals_button",
					text: "Originals Only",
					count: XKit.extensions.show_originals.lbl_on
				}]
			};

			if (this.preferences.use_sidebar_toggle.value) {
				if (this.preferences.use_sticky_sidebar.value) {
					await XKit.interface.react.sidebar.addSticky(section);
				} else {
					await XKit.interface.react.sidebar.add(section);
				}
				this.status = XKit.storage.get("show_originals", "status", "on");
				$("#xshoworiginals_button .count").html(this.status == "on" ? this.lbl_on : this.lbl_off);
				$("#xshoworiginals_button").click(this.toggle);
			}

			if (!this.preferences.use_sidebar_toggle.value || this.status == "on") {
				this.on();
			}
			return;
		}

		//basic non-react functionality
		XKit.tools.init_css("show_originals");
		if (this.preferences.hide_posts_completely.value) {
			XKit.tools.add_css(`
				.post.is_reblog {
					display: none;
				}`, "show_originals");
		} else {
			XKit.tools.add_css(`
				.post.is_reblog .post_content {
					display: none;
				}
				.post.is_reblog .post_avatar {
					display: none;
				}
				.post.is_reblog .post_tags {
					display: none;
				}
				.post.is_reblog .post_footer {
					display: none;
				}
				.post.is_reblog .post-source-footer {
					display: none;
				}`, "show_originals");
		}
		XKit.post_listener.add("show_originals", XKit.extensions.show_originals.call_tumblr_resize);
		XKit.extensions.show_originals.call_tumblr_resize();
	},

	add_css: function() {

		//match blog theme colors if we're in peepr
		const automatic_color = 'var(--blog-contrasting-title-color,var(--transparent-white-65))';
		const automatic_button_color = 'var(--blog-contrasting-title-color,var(--rgb-white-on-dark))';

		//symmetrically reduce the "top and bottom" margins of a hidden post by this amount
		const shrink_post_amount = '12px';

		XKit.tools.add_css(`
			.showoriginals-hidden {
				opacity: 0.75;
				margin-bottom: calc(20px - ${shrink_post_amount});
				transform: translateY(calc(-${shrink_post_amount}/2));
			}
			.showoriginals-hidden-note {
				height: 30px;
				color: ${automatic_color};
				padding-left: 15px;
				display: flex;
				align-items: center;
			}
			.showoriginals-hidden-button {
				line-height: initial;
				margin: 0;
				position: absolute !important;
				right: 5px;
				display: none !important;
			}
			.showoriginals-hidden:hover .showoriginals-hidden-button {
				display: inline-block !important;
			}
			.showoriginals-hidden-button {
				color: rgba(${automatic_button_color}, 0.8);
				background: rgba(${automatic_button_color}, 0.05);
				border-color: rgba(${automatic_button_color}, 0.3);
			}
			.showoriginals-hidden-button:hover {
				color: rgba(${automatic_button_color});
				background: rgba(${automatic_button_color}, 0.1);
				border-color: rgba(${automatic_button_color}, 0.5);
			}
			.showoriginals-hidden-note ~ * {
				display: none;
			}
		`, 'show_originals');

		XKit.interface.hide(".showoriginals-hidden-completely, .showoriginals-hidden-completely + :not([data-id])", "show_originals");
	},

	on: function() {
		XKit.post_listener.add('showoriginals', XKit.extensions.show_originals.react_do_delayed);
		XKit.extensions.show_originals.react_do_delayed();
	},

	off: function() {
		$('.showoriginals-done').removeClass('showoriginals-done');
		$('.showoriginals-hidden').removeClass('showoriginals-hidden');
		$('.showoriginals-hidden-completely').removeClass('showoriginals-hidden-completely');
		$('.showoriginals-hidden-note').remove();
		try {
			XKit.post_listener.remove('showoriginals', XKit.extensions.show_originals.react_do_delayed);
		} catch (e) {
			//no post listener to remove
		}
	},


	/**
	 * Preserves the user's scroll location while running a function that modifies post heights in
	 * real time.
	 *
	 * This is done by choosing a point on the screen, picking the nearest post, and restoring
	 * the position of that post relative to that point, even if it becomes collapsed.
	 *
	 * Supplying the element the user clicked to trigger height modification is recommended, as the
	 * closest post to where they clicked is probably what they expect to stay stationary. If not,
	 * the center of the viewport is used.
	 *
	 * @param {Function} func - the post-modifying function to be run
	 * @param {JQuery} [$targetElement] - a JQuery object whose position will be the target
	 */
	preserveScrollPosition: function(func, $targetElement) {
		var $fixedPost = null;
		const oldPagePosition = $(window).scrollTop();
		const targetLocationPage = $targetElement ?
			$targetElement.offset().top + $targetElement.outerHeight() / 2 :
			oldPagePosition + $(window).height() / 2;

		const targetLocationViewport = targetLocationPage - oldPagePosition;

		$('[data-id]').each(function() {
			if ($(this).offset().top + $(this).outerHeight() > targetLocationPage) {
				$fixedPost = $(this);
				return false; //breaks each()
			}
		});
		if (!$fixedPost) { func(); return; }

		//debug
		//$fixedPost.css("outline", "1px solid red");
		//$fixedPost.css("outline-offset", "3px");

		var offset = targetLocationPage - $fixedPost.offset().top;

		func();

		//delay is kinda a hack but seems necessary to avoid getting clobbered by Tumblr's javascript
		setTimeout(() => {
			offset = Math.min(offset, $fixedPost.outerHeight());
			const newPagePosition = $fixedPost.offset().top + offset - targetLocationViewport;
			if (Math.abs(newPagePosition - $(window).scrollTop()) > 50) {
				$(window).scrollTop(Math.max(newPagePosition, 0));
			}
		}, 200);
	},

	toggle: async function() {
		const {show_originals} = XKit.extensions;

		if (show_originals.status == "on") {
			show_originals.status = "off";
			$("#xshoworiginals_button .count").html(show_originals.lbl_off);

			if (!show_originals.preferences.use_sticky_sidebar.value) {
				show_originals.off();
			} else {
				show_originals.preserveScrollPosition(show_originals.off, $("#xshoworiginals_button"));
			}

		} else {
			show_originals.status = "on";
			$("#xshoworiginals_button .count").html(show_originals.lbl_on);

			if (!show_originals.preferences.use_sticky_sidebar.value) {
				show_originals.on();
			} else {
				show_originals.preserveScrollPosition(show_originals.on, $("#xshoworiginals_button"));
			}
		}
		XKit.storage.set("show_originals", "status", show_originals.status);
	},

	react_do_delayed: function() {
		setTimeout(this.react_do, 0);
	},

	react_do: function() {
		$('[data-id]:not(.showoriginals-done)').each(async function() {
			const $this = $(this).addClass('showoriginals-done');
			if ($this.hasClass("norecommended-hidden") ||
				$this.hasClass("xblacklist_blacklisted_post") ||
				$this.hasClass("xmute-muted") ||
				$this.hasClass("xpostblock-hidden")) {
				return;
			}
			const {show_my_posts, show_original_reblogs, active_in_peepr, hide_posts_generic, hide_posts_completely} = XKit.extensions.show_originals.preferences;
			const {blogs_to_exclude, my_blogs} = XKit.extensions.show_originals;
			const {blogName, rebloggedFromName, content} = await XKit.interface.react.post_props($this.attr('data-id'));

			//show original posts
			if (!rebloggedFromName) { return; }

			//show reblogs with added original content
			if (show_original_reblogs.value && content.length) { return; }

			//show reblogs if we're the OP
			if (show_my_posts.value && my_blogs.includes(blogName)) { return; }

			//show reblogs if they're from excluded blogs
			if (blogs_to_exclude.length && (blogs_to_exclude.includes(blogName))) { return; }

			//if disabled in the sidebar, show everything
			const inSidebar = $this.closest("#glass-container").length > 0;
			if (!active_in_peepr && inSidebar) { return; }


			//we haven't returned, so hide the post now:

			if (hide_posts_completely.value && !inSidebar) {
				$this.addClass('showoriginals-hidden-completely');

			} else if (hide_posts_generic.value) {
				$this.addClass('showoriginals-hidden');
				$this.prepend('<div class="showoriginals-hidden-note">hidden reblog</div>');

			} else {
				$this.addClass('showoriginals-hidden');

				const reblogicon = '<svg viewBox="0 0 12.3 13.7" width="24" height="14" fill="var(--blog-contrasting-title-color,var(--transparent-white-65))" fill-opacity="0.75"><path d="M9.2.2C8.7-.2 8 .2 8 .8v1.1H3.1c-2 0-3.1 1-3.1 2.6v1.9c0 .5.4.9.9.9.1 0 .2 0 .3-.1.3-.1.6-.5.6-.8V5.2c0-1.4.3-1.5 1.3-1.5H8v1.1c0 .6.7 1 1.2.6l3.1-2.6L9.2.2zM12 7.4c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.2c0 1.4-.3 1.5-1.3 1.5H4.3V9c0-.6-.7-.9-1.2-.5L0 11l3.1 2.6c.5.4 1.2.1 1.2-.5v-1.2h4.6c2 0 3.1-1 3.1-2.6V7.4z"></path></svg>';
				const note_text = `${blogName} ${reblogicon} ${rebloggedFromName}`;
				const aria_label = `hidden post: ${blogName} reblogged a post from ${rebloggedFromName}`;
				const button = '<div class="xkit-button showoriginals-hidden-button">show post</div>';

				$this.prepend(`<div class="showoriginals-hidden-note" aria-label="${aria_label}">${note_text}${button}</div>`);
				$this.on('click', '.showoriginals-hidden-button', XKit.extensions.show_originals.unhide_post);
			}
		});
	},

	unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.showoriginals-hidden');
		const $note = $button.parents('.showoriginals-hidden-note');

		$post.removeClass('showoriginals-hidden');
		$note.remove();
	},

	call_tumblr_resize: function() {
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("show_originals");
		if (XKit.page.react) {
			this.off();
			XKit.interface.react.sidebar.remove("xshow_originals_sidebar");
		} else {
			try {
				XKit.post_listener.remove("show_originals", XKit.extensions.show_originals.call_tumblr_resize);
			} catch (e) {
				//no post listener to remove
			}
		}
	}
});

