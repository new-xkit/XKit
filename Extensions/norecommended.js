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
				XKit.interface.react.init_collapsed('norecommended');
			}
			XKit.post_listener.add('norecommended', this.react_do);
			this.react_do();
			return;
		}

		if (this.preferences.hide_recommended_on_blogs.value) {
			this.hide_recommended_on_blogs();
		}
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
						let note_text = loggingReason.startsWith('pin:') ?
							`pinned post by ${blogName}` : `recommended post by ${blogName}`;
						XKit.interface.react.collapse($this, note_text, 'norecommended');
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
		XKit.interface.react.destroy_collapsed('norecommended');
		XKit.post_listener.remove('norecommended');
		XKit.tools.remove_css("norecommended");
	}

});
