//* TITLE No Recommended **//
//* VERSION 2.3.4 **//
//* DESCRIPTION Removes recommended posts **//
//* DETAILS This extension removes recommended posts from your dashboard. To remove Recommended Blogs on the sidebar, please use Tweaks extension. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.norecommended = new Object({

	running: false,

	preferences: {
		"sep-0": {
			text: "Options",
			type: "separator"
		},
		"no_search": {
			text: "Hide recommended posts from followed searches",
			default: true,
			value: true
		},
		"no_pinned": {
			text: "Hide pinned posts",
			default: false,
			value: false
		},
		"hide_recommended_on_blogs": {
			text: "Hide recommended posts under permalinked posts on user blogs",
			default: false,
			value: false
		},
		"hide_posts_completely": {
			text: "Hide posts completely (<a id=\"norecommended-completely-hide-help\" href=\"#\" onclick=\"return false\">may break endless scrolling</a>)",
			default: false,
			value: false,
			slow: true
		}
	},

	cpanel: function(div) {
		$("#norecommended-completely-hide-help").click(function() {
			XKit.window.show("Completely hiding posts", 'If you have endless scrolling enabled and XKit completely hides every single post on the first "page" of your dashboard, you may become unable to scroll down to load more posts. Disable this option if you experience an empty dashboard with the loading icon appearing forever.', "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		});
	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().explore) { return; }

		if (XKit.page.react) {
			if (this.preferences.hide_posts_completely.value) {
				XKit.interface.hide(".norecommended-hidden, .norecommended-hidden + :not([data-id])", "norecommended");
			} else {
				this.add_css();
			}
			XKit.post_listener.add('norecommended', this.react_do);
			this.react_do();
			return;
		}

		if (this.preferences.hide_recommended_on_blogs.value) {
			this.hide_recommended_on_blogs();
		}
	},

	add_css: function() {
		//adjust colors to look good on the sidebar if we're there
		const automatic_color = 'var(--blog-contrasting-title-color,var(--transparent-white-65))';
		const automatic_button_color = 'var(--blog-contrasting-title-color,var(--rgb-white-on-dark))';

		//symmetrically reduce the "top and bottom" margins of a hidden post by this amount
		const shrink_post_amount = '12px';

		XKit.tools.add_css(`
			.norecommended-hidden {
				opacity: 0.75;
				margin-bottom: calc(20px - ${shrink_post_amount});
				transform: translateY(calc(-${shrink_post_amount}/2));
			}
			.norecommended-note {
				height: 30px;
				color: ${automatic_color};
				padding-left: 15px;
				display: flex;
				align-items: center;
			}
			.norecommended-hidden-button {
				line-height: initial;
				margin: 0;
				position: absolute !important;
				right: 5px;
				display: none !important;
			}
			.norecommended-hidden:hover .norecommended-hidden-button {
				display: inline-block !important;
			}
			.norecommended-hidden-button {
				color: rgba(${automatic_button_color}, 0.8);
				background: rgba(${automatic_button_color}, 0.05);
				border-color: rgba(${automatic_button_color}, 0.3);
			}
			.norecommended-hidden-button:hover {
				color: rgba(${automatic_button_color});
				background: rgba(${automatic_button_color}, 0.1);
				border-color: rgba(${automatic_button_color}, 0.5);
			}
			.norecommended-note ~ * {
				display: none;
			}
		`, 'norecommended');
	},

	react_do: function() {
		if (XKit.interface.where().explore) { return; }

		$('[data-id]:not(.norecommended-done)').each(async function() {
			const $this = $(this).addClass('norecommended-done');
			const {no_search, no_pinned, hide_posts_completely} = XKit.extensions.norecommended.preferences;
			const {recommendationReason, blogName} = await XKit.interface.react.post_props($this.attr('data-id'));

			if (recommendationReason && recommendationReason.hasOwnProperty('loggingReason')) {
				const {loggingReason} = recommendationReason;
				const is_search = loggingReason.startsWith('search:');
				const is_pinned = loggingReason.startsWith('pin:');

				if ((no_search.value && is_search) || (no_pinned.value && is_pinned) || (!is_search && !is_pinned)) {
					$this.addClass('norecommended-hidden');

					if (!hide_posts_completely.value) {
						let note_text = loggingReason.startsWith('pin:') ? `pinned post by ${blogName}` : `recommended post by ${blogName}`;
						const button = '<div class="xkit-button norecommended-hidden-button">show post</div>';
						$this.prepend(`<div class="norecommended-note">${note_text}${button}</div>`);
						$this.on('click', '.norecommended-hidden-button', XKit.extensions.norecommended.unhide_post);
					}
				}
			}
		});
	},

	unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.norecommended-hidden');
		const $note = $button.parents('.norecommended-note');

		$post.removeClass('norecommended-hidden');
		$note.remove();
	},

	hide_recommended_on_blogs: function() {
		if (!XKit.interface.is_tumblr_page()) {
			//We're not going to expect other themes have this class as well.
			XKit.tools.add_css(".related-posts-wrapper, .recommended-posts-wrapper {display:none;}", "norecommended");
		}
	},

	destroy: function() {
		this.running = false;
		$('.norecommended-done').removeClass('norecommended-done');
		$('.norecommended-hidden').removeClass('norecommended-hidden');
		$('.norecommended-note').remove();
		XKit.post_listener.remove('norecommended');
		XKit.tools.remove_css("norecommended");
	}

});
