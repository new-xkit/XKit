//* TITLE No Recommended **//
//* VERSION 2.3.1 **//
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
		"no_liked": {
			text: "Get rid of recommended likes",
			default: false,
			value: false
		},
		"no_mini_recs": {
			text: "Get rid of two-column recommended blogs",
			default: true,
			value: true
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
			XKit.post_listener.add('norecommended', this.react_do);
			this.react_do();
			return;
		}

		XKit.post_listener.add("norecommended", XKit.extensions.norecommended.do);
		XKit.extensions.norecommended.do();
	},

	react_do: function() {
		$('[data-id]:not(.norecommended-done)').each(async function() {
			const $this = $(this).addClass('norecommended-done');
			const {recommendationReason} = await XKit.interface.react.post_props($this.attr('data-id'));

			if (recommendationReason !== null && recommendationReason !== undefined) {
				$this.hide();
			}
		});
	},

	do: function() {

		if (XKit.extensions.norecommended.preferences.no_mini_recs.value) {
			XKit.tools.add_css(" .recommended-unit-container.blog-card-compact {display: none;}", "norecommended_no_mini_recs");
		}

		if (XKit.extensions.norecommended.preferences.no_liked.value) {
			XKit.tools.add_css(" .rapid-recs {display: none;}", "norecommended_no_liked");
		}

		var doResize = false;

		$(".posts .post").not(".norecommended-done").each(function() {

			$(this).addClass("norecommended-done");

			if ($(this).hasClass("is_recommended") || $(this).find(".post_info_recommended").length > 0) {
				$(this).remove();
				doResize = true;
			}

		});

		if (doResize) {
			XKit.extensions.norecommended.call_tumblr_resize();
		}

		if (XKit.extensions.norecommended.preferences.hide_recommended_on_blogs.value) {
			XKit.extensions.norecommended.hide_recommended_on_blogs();
		}

	},

	call_tumblr_resize: function() {

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	hide_recommended_on_blogs: function() {
		if (!XKit.interface.is_tumblr_page()) {
			//We're not going to expect other themes have this class as well.
			XKit.tools.add_css(".related-posts-wrapper, .recommended-posts-wrapper {display:none;}", "norecommended_hide_recommended_on_blogs");
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("norecommended_no_mini_recs");
		XKit.tools.remove_css("norecommended_no_liked");
		XKit.tools.remove_css("norecommended_hide_recommended_on_blogs");
	}

});
