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
		}
	},

	run: function() {
		this.running = true;

		if (XKit.page.react) {
			XKit.tools.add_css(`
				.norecommended-hidden,
 				.norecommended-hidden + :not([data-id]) {
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
			const {no_search, no_pinned} = XKit.extensions.norecommended.preferences;
			const {recommendationReason} = await XKit.interface.react.post_props($this.attr('data-id'));

			if (recommendationReason && recommendationReason.hasOwnProperty('loggingReason')) {
				const {loggingReason} = recommendationReason;
				const is_search = loggingReason.startsWith('search:');
				const is_pinned = loggingReason.startsWith('pin:');

				if ((no_search.value && is_search) || (no_pinned.value && is_pinned) || (!is_search && !is_pinned)) {
					$this.addClass('norecommended-hidden');
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
		XKit.post_listener.remove('norecommended');
		XKit.tools.remove_css("norecommended");
	}

});
