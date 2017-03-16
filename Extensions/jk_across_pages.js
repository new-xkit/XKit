//* TITLE J/K Across Pages **//
//* VERSION 1.1.3 **//
//* DESCRIPTION Allow Tumblr's J/K navigation to move between pages **//
//* DEVELOPER beiju **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.jk_across_pages = new Object({
	/*
	 * If the top of the last post is this far below the top of the screen or less, j will move to the next page.
	 */
	scrollBufferJ: 60,
	/*
	 * If the top of first post is this far below the top of the screen or more, k will move to the previous page.
	 */
	scrollBufferK: 59,
	/*
	 * Leave this much overlap when using view_entire_posts
	 */
	scrollBufferInside: 50,
	/*
	 * This is the size of the gap between posts
	 */
	postBuffer: 20,
	/*
	 * How long scroll animations should take (milliseconds)
	 */
	scrollAnimationDuration: 100,

	$posts: false,

	running: false,


	preferences: {
		"sep0": {
			type: 'separator',
			text: "Other"
		},
		"show_notifications": {
			text: "Show notifications when moving between pages",
			'default': true,
			value: true
		},
		"view_entire_posts": {
			text: "Scroll through the entire post, even if it's longer than the screen",
			'default': false,
			value: false
		}
	},

	run: function() {
		this.$posts = jQuery('.post_container').not('#new_post_buttons');

		XKit.tools.init_css("jk_across_pages");

		// If #auto_pagination_loader exists, endless scrolling is enabled and this extension is useless
		if (jQuery('#auto_pagination_loader').length > 0) return;

		if (/jk_across_pages_first/i.test(window.location.hash)) {
			console.log("Scrolling to first post", this.$posts.first());
			jQuery('html, body').animate({
				scrollTop: this.$posts.first().offset().top - this.scrollBufferJ
			}, this.scrollAnimationDuration);
			window.location.hash = '';
		} else if (/jk_across_pages_last/i.test(window.location.hash)) {
			console.log("Scrolling to last post", this.$posts.last());
			jQuery('html, body').animate({
				scrollTop: this.$posts.last().offset().top - this.scrollBufferK
			}, this.scrollAnimationDuration);
			window.location.hash = '';
		}

		var that = this;
		jQuery(document.body).bind('keydown.xkit_jk_across_pages', function(evt) {
			if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
				// If the key wasn't J or K, we have nothing to do here.
				if (evt.which !== 74 /* j */ && evt.which !== 75 /* k */) return;

				// If the new post field has focus, do nothing.
				if (jQuery('.scrollverlay.active').length !== 0) return;
				// If XKit preferences are open, do nothing
				if (jQuery('#xkit-control-panel').length !== 0) return;
				// If the user is typing in an input, do nothing
				if (jQuery('input:focus').length !== 0) return;

				that.$posts = jQuery('.post_container').not('#new_post_buttons');

				if (that.preferences.view_entire_posts.value && evt.which === 74 /* j */ &&
					that.postAtY(that.scrollBufferJ + 1)[0] == that.postAtY(window.innerHeight - that.scrollBufferJ)[0]) {

					evt.stopPropagation(); // Try to stop Tumblr's event listener

					/* Animate this twice to make sure Tumblr's scrolling doesn't override it */
					var scrollTo = window.scrollY + window.innerHeight - that.scrollBufferInside;
					jQuery(document.body).animate({ scrollTop: scrollTo }, that.scrollAnimationDuration, function() {
						$(this).animate({ scrollTop: scrollTo }, that.scrollAnimationDuration);
					});

					return; // Don't try to go to the next page
				}

				if (evt.which === 74 /* j */ && (that.$posts.last().offset().top - window.scrollY <= that.scrollBufferJ || window.scrollY + window.innerHeight >= that.$posts.last().offset().top + that.$posts.last().height())) {
					if (jQuery('#next_page_link').length > 0) {
						if (that.preferences.show_notifications.value === true) XKit.notifications.add("Moving to next page", "ok");
						window.location = jQuery('#next_page_link').attr('href') + '#jk_across_pages_first';
					} else {
						if (that.preferences.show_notifications.value === true) XKit.notifications.add("Already at last page", "warning");
					}
				} else if (evt.which === 75 /* k */ && that.$posts.first().offset().top - window.scrollY >= that.scrollBufferK) {
					if (jQuery('#previous_page_link').length > 0) {
						if (that.preferences.show_notifications.value === true) XKit.notifications.add("Moving to previous page", "ok");
						window.location = jQuery('#previous_page_link').attr('href') + '#jk_across_pages_last';
					} else {
						if (that.preferences.show_notifications.value === true) XKit.notifications.add("Already at first page", "warning");
					}
				}
			}
		});
		this.running = true;
	},

	postAtY: function(y) {
		var x = jQuery('#posts').offset().left + 1;
		return jQuery(document.elementFromPoint(x, y)).closest('.post_container');
	},

	destroy: function() {
		try {
			jQuery(document.body).unbind('.xkit_jk_across_pages');
			XKit.tools.remove_css("jk_across_pages");
			this.running = false;
		} catch (err) {
			if (console && console.error) console.error(err);
		}
	}

});
