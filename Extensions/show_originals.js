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

	status: "false",

	preferences: {
		"sep-0": {
			text: "Functionality",
			type: "separator"
		},
		"show_original_reblogs": { //this needs a better description (actually all the options do)
			text: "Show reblogs if the original post was by the same blog",
			default: true,
			value: true
		},
		"hide_posts_in_peepr": {
			text: "Hide reblogs in the sidebar",
			default: false,
			value: false,
			experimental: true
		},
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
		},
	},

	run: function() {
		this.running = true;

		//I don't do anything with this right now since XKit.interface.sidebar isn't a thing
		XKit.extensions.show_originals.status = XKit.storage.get("show_originals", "status", "false");

		if (XKit.page.react) {

			const automatic_color = 'var(--blog-contrasting-title-color,var(--rgb-white-on-dark))';

			XKit.tools.add_css(`
				.showoriginals-hidden {
					opacity: 0.5;
					margin-bottom:8px;
					transform: translateY(-6px);
				}
				.showoriginals-hidden-note-body {
					height: 30px !important;
					line-height: 30px !important;
					color: rgba(${automatic_color}, 0.8);
					padding: 0;
					margin: 0;
					padding-left: 15px;
					display: flex;
				}
				.showoriginals-hidden-button {
				    position: absolute !important;
					height: 30px;
					line-height: 30px;
					right: 5px;
					display: none;
				}
				.showoriginals-hidden:hover .showoriginals-hidden-button {
					display: inline-block;
					height: unset;
					line-height: initial;
					top: 50% !important;
					transform: translateY(-50%);
					margin: 0;
				}
				.showoriginals-hidden-button {
					color: rgba(${automatic_color}, 0.8);
					background: rgba(${automatic_color}, 0.05);
					border-color: rgba(${automatic_color}, 0.3);
				}
				.showoriginals-hidden-button:hover {
					color: rgba(${automatic_color});
					background: rgba(${automatic_color}, 0.1);
					border-color: rgba(${automatic_color}, 0.5);
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
		
		//runs on each post
		$('[data-id]:not(.showoriginals-done)').each(async function() {
			const $this = $(this).addClass('showoriginals-done');
			const {show_original_reblogs,hide_posts_in_peepr,hide_posts_makelink,hide_posts_generic, hide_posts_completely} = XKit.extensions.show_originals.preferences;
			const {rebloggedFromUrl, rebloggedFromName, rebloggedRootName, blogName, postUrl} = await XKit.interface.react.post_props($this.attr('data-id'));

			// Unless enabled, don't hide posts in the sidebar
			if (!hide_posts_in_peepr && $this.closest("#glass-container").length > 0) { return; }

			// Don't hide posts that aren't reblogs
			if (!rebloggedFromUrl) { return; }

			// If enabled, don't hide reblogs with the same blog as root
			if (show_original_reblogs.value && rebloggedRootName == blogName) { return; }

			// We haven't returned, so hide the post now:

			if (hide_posts_completely.value) {
				$this.addClass('showoriginals-hidden-completely');

			} else if (hide_posts_generic.value) {
				$this.addClass('showoriginals-hidden');
				$this.prepend('<div class="showoriginals-note"><div class="showoriginals-hidden-note-body">Hidden by Show Originals</div></div>');

			} else {
				const reblogicon = '<svg viewBox="0 -7.5 12.3 28" width="25" height="30" fill="var(--blog-contrasting-title-color,var(--white-on-dark))" fill-opacity="0.5"><path d="M9.2.2C8.7-.2 8 .2 8 .8v1.1H3.1c-2 0-3.1 1-3.1 2.6v1.9c0 .5.4.9.9.9.1 0 .2 0 .3-.1.3-.1.6-.5.6-.8V5.2c0-1.4.3-1.5 1.3-1.5H8v1.1c0 .6.7 1 1.2.6l3.1-2.6L9.2.2zM12 7.4c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.2c0 1.4-.3 1.5-1.3 1.5H4.3V9c0-.6-.7-.9-1.2-.5L0 11l3.1 2.6c.5.4 1.2.1 1.2-.5v-1.2h4.6c2 0 3.1-1 3.1-2.6V7.4z"></path></svg>'

				if (hide_posts_makelink.value) {
					note_text = `<a href='${postUrl}' style="text-decoration:none" target="_blank">${blogName}</a> ${reblogicon} <a href='${postUrl}' style="text-decoration:none" target="_blank">${rebloggedFromName}</a>`;
				} else {
					note_text = `${blogName} ${reblogicon} ${rebloggedFromName}`;
				}

				const button = '<div class="xkit-button showoriginals-hidden-button">show reblog</div>';

				$this.addClass('showoriginals-hidden');
				$this.prepend(`<div class="showoriginals-note"><div class="showoriginals-hidden-note-body">${note_text}${button}</div></div>`);

				// add listener to unhide the post on button click
				$this.on('click', '.showoriginals-hidden-button', XKit.extensions.show_originals.unhide_post);
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
