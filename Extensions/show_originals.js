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
			text: "Show reblogs if the original post was by the same blog",
			default: true,
			value: true
		},
		"sep-1": {
			text: "Appearance",
			type: "separator"
		},
		"generic_message": {
			text: "Show a generic message in place of hidden posts",
			default: false,
			value: false
		},
		"hide_completely": {
			text: "Hide posts completely",
			default: false,
			value: false,
			experimental: true
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
					padding: 0 var(--post-padding);
				}
				.noreblogs-note ~ * {
					display: none;
				}
				.noreblogs-hidden {
					height: 0;
					margin: 0;
					overflow: hidden;
			`, 'noreblogs');

			XKit.post_listener.add('noreblogs', this.react_do);
			this.react_do();
			return;
		}
	},

	react_do: function() {
		$('[data-id]:not(.noreblogs-done)').each(async function() {
			const $this = $(this).addClass('noreblogs-done');
			const {show_original_reblogs, generic_message, hide_completely} = XKit.extensions.show_originals.preferences;
			const {rebloggedFromUrl, rebloggedRootName, blogName, postUrl} = await XKit.interface.react.post_props($this.attr('data-id'));
			
			// Don't hide anything in the sidebar
			if ($this.closest("#glass-container").length > 0) { return; }
			
			// Don't hide original posts
			if (!rebloggedFromUrl) { return; }
			
			// If enabled, don't hide reblogs with the same blog as root
			if (show_original_reblogs.value && rebloggedRootName == blogName) { return; }
			
			// Hide everything else
			if (hide_completely.value) {
				$this.addClass('noreblogs-hidden');
			} else if (generic_message.value) {
				$this.prepend('<div class="noreblogs-note">Hidden by Show Originals</div>');
			} else {
				$this.prepend('<div class="noreblogs-note">' + blogName + ' <a href="' + postUrl + '" target="_blank">reblogged</a> ' + rebloggedRootName + '</div>');
			}

		});
	},

	destroy: function() {
		this.running = false;
		$('.noreblogs-done').removeClass('noreblogs-done');
		$('.noreblogs-hidden').removeClass('noreblogs-hidden');
		$('.noreblogs-note').remove();
		XKit.post_listener.remove('noreblogs');
		XKit.tools.remove_css("noreblogs");
	}

});
