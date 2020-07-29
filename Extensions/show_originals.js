//* TITLE Show Originals **//
//* VERSION 1.2.5 **//
//* DESCRIPTION Only shows non-reblogged posts **//
//* DETAILS This really experimental extension allows you to only see original (non-reblogged) posts made by users on your dashboard. Posts must be replaced by an indicator to avoid breaking j/k scrolling.**//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_originals = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep-0": {
			text: "Options",
			type: "separator"
		},
		"show_original_reblogs": {
			text: "Show when someone reblogs their own original content",
			default: true,
			value: true
		},
	},

	run: function() {
		this.running = true;
		
		if (XKit.page.react) {
			XKit.tools.add_css(`
				.noreblogs-note {
					height: 1em;
					color: var(--white-on-dark);
					opacity: 0.4;
					//padding: var(--post-header-vertical-padding) var(--post-padding);
					padding: 0 var(--post-padding);
				}
				.noreblogs-note ~ * {
					display: none;
				}
			`, 'noreblogs');

			XKit.post_listener.add('noreblogs', this.react_do);
			this.react_do();
			return;
		}
	},

	react_do: function() {
		$('[data-id]:not(.noreblogs-done)').each(async function() {
			const $this = $(this).addClass('noreblogs-done');
			const {show_original_reblogs} = XKit.extensions.no_reblogs_test.preferences;
			const {rebloggedFromUrl, rebloggedRootName, blogName, postUrl} = await XKit.interface.react.post_props($this.attr('data-id'));
			
			// Prevent hiding posts in peepr
			if ($this.closest("#glass-container").length > 0) { return; }
			
			if (show_original_reblogs.value) {
				if (rebloggedFromUrl && rebloggedRootName != blogName) {
					//$this.prepend('<div class="noreblogs-note">Hidden by Show Originals</div>');
					//$this.prepend('<div class="noreblogs-note">' + blogName + ' reblogged ' + rebloggedRootName + '</div>');
					$this.prepend('<div class="noreblogs-note">' + blogName + ' <a href="' + postUrl + '" target="_blank">reblogged</a> ' + rebloggedRootName + '</div>');
					}
			} else if (rebloggedFromUrl) {
				//$this.prepend('<div class="noreblogs-note">Hidden by Show Originals</div>');
				//$this.prepend('<div class="noreblogs-note">' + blogName + ' reblogged ' + rebloggedRootName + '</div>');
				$this.prepend('<div class="noreblogs-note">' + blogName + ' <a href="' + postUrl + '" target="_blank">reblogged</a> ' + rebloggedRootName + '</div>');
			}

		});
	},

	destroy: function() {
		this.running = false;
		$('.noreblogs-done').removeClass('noreblogs-done');
		$('.noreblogs-note').remove();
		XKit.post_listener.remove('noreblogs');
		XKit.tools.remove_css("noreblogs");
	}

});
