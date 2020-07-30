//* TITLE Show Originals **//
//* VERSION 1.2.6 **//
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
			text: "Functionality",
			type: "separator"
		},
		"show_original_reblogs": {
			text: "Show reblogs if the original post was by the same blog",
			default: true,
			value: true
		},
		/* "hide_posts_in_peepr": {
			text: "Hide reblogs in the sidebar",
			default: false,
			value: false,
			experimental: true
		}, */
		"hide_posts_makelink": {
			text: "Make hidden reblog indicators links",
			default: false,
			value: false
		},

		"sep-1": {
			text: "Appearance",
			type: "separator"
		},
		"hide_posts_generic": {
			text: "Show a generic message in place of hidden reblogs",
			default: false,
			value: false
		},
		"hide_posts_completely": {
			text: "Hide reblogs completely",
			default: false,
			value: false,
			experimental: true
		},
	},

	run: function() {
		this.running = true;

		if (XKit.page.react) {
			XKit.tools.add_css(`

				.showoriginals-hidden {
					opacity: 0.5;
					margin-bottom:8px;
					transform: translateY(-6px);
				}
				.showoriginals_note_text {
					height: 30px !important;
					line-height: 30px !important;
					color: var(--white-on-dark);
					padding: 0;
					margin: 0;
					padding-left: 15px;
				}
				.showoriginals-hidden .showoriginals-button {
				    position: absolute !important;
					height: 30px;
					line-height: 30px;
					right: 5px;
					display: none;
				}
				.showoriginals-hidden:hover .showoriginals-button {
					display: inline-block;
					height: unset;
					line-height: initial;
					top: 50% !important;
					transform: translateY(-50%);
					margin: 0;
				}
				.xkit--react .showoriginals-button {
					color: rgba(var(--rgb-white-on-dark), 0.8);
					background: rgba(var(--rgb-white-on-dark), 0.05);
					border-color: rgba(var(--rgb-white-on-dark), 0.3);
				}
				.xkit--react .showoriginals-button:hover {
					color: var(--white-on-dark);
					background: rgba(var(--rgb-white-on-dark), 0.1);
					border-color: rgba(var(--rgb-white-on-dark), 0.5);
				}
				.showoriginals-note ~ * {
					display: none;
				}
				.showoriginals-hidden-completely {
					height: 0;
					margin: 0;
					overflow: hidden;
				}
			`, 'showoriginals');

			XKit.post_listener.add('showoriginals', this.react_do);
			this.react_do();
			return;
		}
	},

	react_do: function() {
		$('[data-id]:not(.showoriginals-done)').each(async function() {
			const $this = $(this).addClass('showoriginals-done');
			const {show_original_reblogs,hide_posts_in_peepr,hide_posts_makelink,hide_posts_generic, hide_posts_completely} = XKit.extensions.show_originals.preferences;
			const {rebloggedFromUrl, rebloggedRootName, blogName, postUrl} = await XKit.interface.react.post_props($this.attr('data-id'));

			// Unless enabled, exit if we're in the sidebar
			if (!hide_posts_in_peepr && $this.closest("#glass-container").length > 0) { return; }

			// Don't hide posts that aren't reblogs
			if (!rebloggedFromUrl) { return; }

			// If enabled, don't hide reblogs with the same blog as root
			if (show_original_reblogs.value && rebloggedRootName == blogName) { return; }

			// We haven't returned, so hide the post now

			if (hide_posts_completely.value) {
				$this.addClass('showoriginals-hidden-completely');

			} else if (hide_posts_generic.value) {
				$this.addClass('showoriginals-hidden');
				$this.prepend('<div class="showoriginals-note"><div class="showoriginals_note_text">Hidden by Show Originals</div></div>');

			} else {
				const reblogicon = '<svg viewBox="0 0 12.3 13.7" width="16" height="14" fill="var(--white-on-dark)"><path d="M9.2.2C8.7-.2 8 .2 8 .8v1.1H3.1c-2 0-3.1 1-3.1 2.6v1.9c0 .5.4.9.9.9.1 0 .2 0 .3-.1.3-.1.6-.5.6-.8V5.2c0-1.4.3-1.5 1.3-1.5H8v1.1c0 .6.7 1 1.2.6l3.1-2.6L9.2.2zM12 7.4c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.2c0 1.4-.3 1.5-1.3 1.5H4.3V9c0-.6-.7-.9-1.2-.5L0 11l3.1 2.6c.5.4 1.2.1 1.2-.5v-1.2h4.6c2 0 3.1-1 3.1-2.6V7.4z"></path></svg>'

				if (hide_posts_makelink.value) {
					note_text = `<a href='${postUrl}' style="text-decoration:none" target="_blank">${blogName} ${reblogicon} ${rebloggedRootName}</a>`;
				} else {
					note_text = `${blogName} ${reblogicon} ${rebloggedRootName}`;
				}

				const button = '<div class="xkit-button showoriginals-button">show reblog</div>';

				$this.addClass('showoriginals-hidden');
				$this.prepend(`<div class="showoriginals-note"><div class="showoriginals_note_text">${note_text}${button}</div></div>`);

				// add listener to unhide the post on button click
				$this.on('click', '.showoriginals-button', XKit.extensions.show_originals.unhide_post);
			}

		});
	},

	unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.showoriginals-hidden');
		const $note = $button.parents('.showoriginals-note');

		$post.removeClass('showoriginals-hidden');
		$note.remove();
	},

	destroy: function() {
		this.running = false;
		$('.showoriginals-done').removeClass('showoriginals-done');
		$('.showoriginals-hidden').removeClass('showoriginals-hidden');
		$('.showoriginals-hidden-completely').removeClass('showoriginals-hidden-completely');
		$('.showoriginals-note').remove();
		XKit.post_listener.remove('showoriginals');
		XKit.tools.remove_css("showoriginals");
	}

});
