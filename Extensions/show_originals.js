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
			text: "Options",
			type: "separator"
		},
		"show_original_reblogs": {
			text: "Show reblogs if the original post was by the same blog",
			default: true,
			value: true
		},
		/* "in_sidebar": {
			text: "Hide reblogs in the sidebar",
			default: false,
			value: false,
			experimental: true
		}, */
		"sep-1": {
			text: "Appearance",
			type: "separator"
		},
		"generic_message": {
			text: "Show a generic message in place of hidden reblogs",
			default: false,
			value: false
		},
		"hide_completely": {
			text: "Hide reblogs completely",
			default: false,
			value: false,
			experimental: true
		},
	},

	run: function() {
		this.running = true;

		if (XKit.page.react) {


			// border: 1px dashed var(--white-on-dark) !important;
			XKit.tools.add_css(`

				.noreblogs-hidden {

					opacity: 0.5;
					margin-bottom:8px;
					transform: translateY(-6px);
				}

				.noreblogs-hidden .noreblogs_note_text {
					height: 30px !important;
					line-height: 30px !important;
					color: var(--white-on-dark);
					padding: 0;
					margin: 0;
					padding-left: 15px;
				}

				.noreblogs-hidden .noreblogs-button {
				    position: absolute !important;
					height: 30px;
					line-height: 30px;
					right: 5px;
					display: none;
				}
				.noreblogs-hidden:hover .noreblogs-button {
					display: inline-block;
					height: unset;
					line-height: initial;
					top: 50% !important;
					transform: translateY(-50%);
					margin: 0;
				}
				.xkit--react .noreblogs-button {
					color: rgba(var(--rgb-white-on-dark), 0.8);
					background: rgba(var(--rgb-white-on-dark), 0.05);
					border-color: rgba(var(--rgb-white-on-dark), 0.3);
				}
				.xkit--react .noreblogs-button:hover {
					color: var(--white-on-dark);
					background: rgba(var(--rgb-white-on-dark), 0.1);
					border-color: rgba(var(--rgb-white-on-dark), 0.5);
				}

				.noreblogs-note ~ * {
					display: none;
				}

				.noreblogs-completely-hidden {
					height: 0;
					margin: 0;
					overflow: hidden;
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
			const {show_original_reblogs,in_sidebar,generic_message, hide_completely} = XKit.extensions.show_originals.preferences;
			const {rebloggedFromUrl, rebloggedRootName, blogName, postUrl} = await XKit.interface.react.post_props($this.attr('data-id'));

			// Unless enabled, don't hide anything in the sidebar
			if (!in_sidebar && $this.closest("#glass-container").length > 0) { return; }

			// Don't hide original posts
			if (!rebloggedFromUrl) { return; }

			// If enabled, don't hide reblogs with the same blog as root
			if (show_original_reblogs.value && rebloggedRootName == blogName) { return; }

			// Hide everything else
			if (hide_completely.value) {
				$this.addClass('noreblogs-completely-hidden');

			} else if (generic_message.value) {
				$this.prepend('<div class="noreblogs-note">Hidden by Show Originals</div>');

			} else {
				$this.addClass('noreblogs-hidden');

				const icon = '<svg viewBox="0 0 12.3 13.7" width="16" height="14" fill="var(--white-on-dark)"><path d="M9.2.2C8.7-.2 8 .2 8 .8v1.1H3.1c-2 0-3.1 1-3.1 2.6v1.9c0 .5.4.9.9.9.1 0 .2 0 .3-.1.3-.1.6-.5.6-.8V5.2c0-1.4.3-1.5 1.3-1.5H8v1.1c0 .6.7 1 1.2.6l3.1-2.6L9.2.2zM12 7.4c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.2c0 1.4-.3 1.5-1.3 1.5H4.3V9c0-.6-.7-.9-1.2-.5L0 11l3.1 2.6c.5.4 1.2.1 1.2-.5v-1.2h4.6c2 0 3.1-1 3.1-2.6V7.4z"></path></svg>'

				const note_text = blogName + ' ' + icon + ' ' + rebloggedRootName;


				const noreblogs_note = `
				<div class="noreblogs-note">
					<div class="noreblogs_note_text">
						${note_text}
						<div class="xkit-button noreblogs-button">
							show reblog
						</div>
					</div>
				</div>
				`;

				const button_text = '<div class="xkit-button noreblogs-button"> show reblog </div>'

				$this.prepend(noreblogs_note);

				$this.on('click', '.noreblogs-button', XKit.extensions.show_originals.unhide_post);
			}

		});
	},

	unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.noreblogs-hidden');
		const $note = $button.parents('.noreblogs-note');

		$post.removeClass('noreblogs-hidden');
		$note.remove();
	},

	destroy: function() {
		this.running = false;
		$('.noreblogs-done').removeClass('noreblogs-done');
		$('.noreblogs-hidden').removeClass('noreblogs-hidden');
		$('.noreblogs-completely-hidden').removeClass('noreblogs-completely-hidden');
		$('.noreblogs-note').remove();
		XKit.post_listener.remove('noreblogs');
		XKit.tools.remove_css("noreblogs");
	}

});
