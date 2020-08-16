//* TITLE Show Originals **//
//* VERSION 1.2.6 **//
//* DESCRIPTION Only shows non-reblogged posts **//
//* DETAILS This extension allows you to only see original (non-reblogged) posts made by users on your dashboard.**//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_originals = new Object({

	running: false,
	slow: true,

	status: "false",
	lbl_on: "on",
	lbl_off: "off",
	my_blogs: [],

	preferences: {
		"sep-0": {
			text: "Functionality",
			type: "separator"
		},
		"use_sidebar_toggle": {
			text: 'Show the "originals only" toggle',
			default: true,
			value: true
		},
		"show_my_posts": {
			text: "Always show my posts",
			default: true,
			value: true
		},
		"show_original_reblogs": { //this needs a better description (actually all the options do)
			text: "Show when someone reblogs their own post",
			default: true,
			value: true
		},
		"active_in_peepr": {
			text: "Activate this extension on blogs in the sidebar",
			default: false,
			value: false,
		},

		"sep-1": {
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

	run: async function() {
		this.running = true;

		const where = XKit.interface.where();

		const dont_run = where.inbox || where.following  || where.followers  || where.activity;
		const uses_masonry = where.explore || where.search || where.tagged;

		if (dont_run || uses_masonry) { return; }

		console.log("running show originals");

		this.my_blogs = XKit.tools.get_blogs();

		if (where.dashboard && XKit.storage.get("show_originals", "shown_warning_about_scrolling", "") !== "yass") {

			//detects endless scrolling via the "next" button
			const nextAriaLabel = await XKit.interface.translate('Next');
			if ($(`button[aria-label="${nextAriaLabel}"]`).length) {

				XKit.notifications.add("Show Originals works best when Endless Scrolling is turned on. Click here to learn more and dismiss this popup.", "warning", false, function() {
					XKit.window.show("Endless Scrolling recommended.", "Show Originals works best when Endless Scrolling is enabled on your dashboard. If you want to enable it, click on the Account Settings button (person icon) on top-right of the page and then Settings > Dashboard > Enable endless scrolling.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					XKit.storage.set("show_originals", "shown_warning_about_scrolling", "yass");
				});
			}
		}


		XKit.extensions.show_originals.status = XKit.storage.get("show_originals", "status", "false");


		const show_sidebar_definitely = where.dashboard || where.likes;
		const show_sidebar_ifmine = where.queue || where.channel || where.drafts;

		if (this.preferences.use_sidebar_toggle.value && (show_sidebar_definitely || show_sidebar_ifmine && !this.preferences.show_my_posts.value)) {
			await XKit.interface.react.sidebar.add({
				id: "xshow_originals_sidebar",
				title: "Show Originals",
				items: [{
					id: "xshoworiginals_button",
					text: "Originals Only",
					count: XKit.extensions.show_originals.lbl_off
				}]
			});
		}

		XKit.extensions.show_originals.update_button();

		$("#xshoworiginals_button").click(function() {
			XKit.extensions.show_originals.toggle();

			return false;
		});

		if (XKit.page.react) {

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
			`, 'showoriginals');

			XKit.interface.hide(".showoriginals-hidden-completely, .showoriginals-hidden-completely + :not([data-id])", "showoriginals");

			XKit.post_listener.add('showoriginals', this.react_do);
			this.react_do();
			return;
		}
	},

	update_button: function() {

		if (XKit.extensions.show_originals.status == "true") {
			$("#xshoworiginals_button .count").html(XKit.extensions.show_originals.lbl_on);
		} else {
			$("#xshoworiginals_button .count").html(XKit.extensions.show_originals.lbl_off);
		}

	},

	toggle: function() {

		if (XKit.extensions.show_originals.status == "true") {
			XKit.extensions.show_originals.status = "false";
		} else {
			XKit.extensions.show_originals.status = "true";
		}

		this.react_do();

		XKit.extensions.show_originals.update_button();
		XKit.storage.set("show_originals", "status", XKit.extensions.show_originals.status);

	},

	react_do: function() {

		if (XKit.extensions.show_originals.preferences.use_sidebar_toggle.value && XKit.extensions.show_originals.status == "false") {
			$('.showoriginals-done').removeClass('showoriginals-done');
			$('.showoriginals-hidden').removeClass('showoriginals-hidden');
			$('.showoriginals-hidden-completely').removeClass('showoriginals-hidden-completely');
			$('.showoriginals-hidden-note').remove();
			return;
		}

		//runs on each post
		$('[data-id]:not(.showoriginals-done)').each(async function() {
			const $this = $(this).addClass('showoriginals-done');
			const {show_my_posts, show_original_reblogs, active_in_peepr, hide_posts_generic, hide_posts_completely} = XKit.extensions.show_originals.preferences;
			const {rebloggedFromUrl, rebloggedFromName, rebloggedRootName, blogName} = await XKit.interface.react.post_props($this.attr('data-id'));

			// Don't hide posts that aren't reblogs
			if (!rebloggedFromUrl) { return; }

			// If enabled, don't hide reblogs with the same blog as root
			if (show_original_reblogs.value && rebloggedRootName == blogName) { return; }

			//Don't hide my posts
			if (show_my_posts.value && XKit.extensions.show_originals.my_blogs.includes(blogName)) { return; }

			// Unless enabled, don't hide posts in the sidebar
			const inSidebar = $this.closest("#glass-container").length > 0;
			if (!active_in_peepr && inSidebar) { return; }

			// We haven't returned, so hide the post now:

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
				const button = '<div class="xkit-button showoriginals-hidden-button">show reblog</div>';

				$this.prepend(`<div class="showoriginals-hidden-note" aria-label="${aria_label}">${note_text}${button}</div>`);

				// add listener to unhide the post on button click
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

	destroy: function() {
		this.running = false;
		$('.showoriginals-done').removeClass('showoriginals-done');
		$('.showoriginals-hidden').removeClass('showoriginals-hidden');
		$('.showoriginals-hidden-completely').removeClass('showoriginals-hidden-completely');
		$('.showoriginals-hidden-note').remove();
		XKit.post_listener.remove('showoriginals');
		XKit.tools.remove_css("showoriginals");
		XKit.interface.react.sidebar.remove("xshow_originals_sidebar");
	}

});
