//* TITLE No Recommended **//
//* VERSION 2.3.5 **//
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
			text: "Hide posts completely (may break post loading if it hides your entire dash)",
			default: false,
			value: false,
			experimental: true
		}
	},

	run: function() {
		this.running = true;

		if (XKit.page.react) {
			//symmetrically reduce the "top and bottom" margins of a hidden post by this amount
			const shrink_post_amount = '12px';

			XKit.tools.add_css(`
				.norecommended-hidden {
					opacity: 0.65;
					margin-bottom: calc(20px - ${shrink_post_amount});
					transform: translateY(calc(-${shrink_post_amount}/2));
				}
				.norecommended-note {
					height: 30px !important;
					line-height: 30px !important;
					color: var(--transparent-white-65);
					padding: 0;
					margin:0;
					padding-left: 15px;
				}
				.norecommended-note ~ * {
					display: none;
				}
				.norecommended-hidden-completely,
 				.norecommended-hidden-completely + :not([data-id]) {
					height: 0;
					margin: 0;
					overflow: hidden;
				}
			`, 'norecommended');
			XKit.post_listener.add('norecommended', this.react_do);
			this.react_do();
			return;
		}

		if (this.preferences.hide_recommended_on_blogs.value) {
			this.hide_recommended_on_blogs();
		}
	},

	react_do: function() {
		$('[data-id]:not(.norecommended-done)').each(async function() {
			const $this = $(this).addClass('norecommended-done');
			const {no_search, no_pinned, hide_posts_completely} = XKit.extensions.norecommended.preferences;
			const {recommendationReason} = await XKit.interface.react.post_props($this.attr('data-id'));

			if (recommendationReason && recommendationReason.hasOwnProperty('loggingReason')) {
				const {loggingReason} = recommendationReason;
				const is_search = loggingReason.startsWith('search:');
				const is_pinned = loggingReason.startsWith('pin:');

				if ((no_search.value && is_search) || (no_pinned.value && is_pinned) || (!is_search && !is_pinned)) {
					if (hide_posts_completely.value) {
						$this.addClass('norecommended-hidden-completely');
					} else {
						$this.addClass('norecommended-hidden');
						$this.prepend('<div class="norecommended-note">Hidden by No Recommended</div>');
					}
				}
			}
		});
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
		$('.norecommended-hidden-completely').removeClass('norecommended-hidden-completely');
		$('.norecommended-note').remove();
		XKit.post_listener.remove('norecommended');
		XKit.tools.remove_css("norecommended");
	}

});
