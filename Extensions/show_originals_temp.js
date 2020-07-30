//* TITLE hidepostswithblacklist **//
//* VERSION 1.0.0 **//
//* DESCRIPTION	**//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.hidepostswithblacklist = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.tools.init_css("hidepostswithblacklist");

		const noreblogs_css = `
				.noreblogs-hidden {
					opacity: 1 !important;
					padding: 0 !important;
					border: 1px dashed var(--transparent-white-40, rgba(255,255,255,.43)) !important;
					background: transparent !important;
				}


				.noreblogs-hidden .noreblogs_note_text {
					height: 40px !important;
					line-height: 40px !important;
					color: var(--transparent-white-40, rgba(255,255,255,.43));
					padding: 0;
					margin: 0;
					padding-left: 15px;
				}
				.noreblogs-hidden .noreblogs-button {
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

				//hide the port after the note
				.noreblogs-note ~ * {
					display: none;
				}

				.noreblogs-button {
					position: absolute !important;
					height: 30px;
					line-height: 30px;
					right: 5px;
				}

				.noreblogs-note {
					border-radius: 3px;
					position: relative;
				}
			`;

			XKit.tools.add_css(noreblogs_css, "noreblogstest");

			XKit.post_listener.add('noreblogs', this.react_do);
			this.react_do();
			return;

	},

	react_do: function() {
		$('[data-id]:not(.noreblogs-done)').each(async function() {
			const $this = $(this).addClass('noreblogs-done');
			//const {show_original_reblogs,in_sidebar,generic_message, hide_completely} = XKit.extensions.show_originals.preferences;
			const {rebloggedFromUrl, rebloggedRootName, blogName, postUrl} = await XKit.interface.react.post_props($this.attr('data-id'));
			/*
			// Unless enabled, don't hide anything in the sidebar
			if (!in_sidebar && $this.closest("#glass-container").length > 0) { return; }

			// Don't hide original posts
			if (!rebloggedFromUrl) { return; }

			// If enabled, don't hide reblogs with the same blog as root
			if (show_original_reblogs.value && rebloggedRootName == blogName) { return; }
			*/
			// Hide everything else
			$this.addClass('noreblogs-hidden');

			const note_text = 'this is a hidden reblog';

			const noreblogs_note = `
			<div class="noreblogs-note">
				<div class="noreblogs_note_text">
					${note_text}
					<div class="xkit-button noreblogs-button">
						Show it anyway
					</div>
				</div>
			</div>
		`;

			$this.prepend(noreblogs_note);

			//$this.on('click', '.noreblogs-button', this.unhide_post);
			$this.on('click', '.noreblogs-button', XKit.extensions.hidepostswithblacklist.unhide_post);


		});
	},

	unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.noreblogs-hidden');
		const $excuse = $button.parents('.noreblogs-note');

		if ($post.hasClass('xkit-shorten-posts-shortened')) {
			$post.find('.xkit-shorten-posts-embiggen').show();
			$post.css('height', $post.attr('data-xkit-blacklist-old-height'));
		}

		$post.removeClass('noreblogs-hidden');
		$excuse.remove();
	},



	destroy: function() {
		this.running = false;
	}

});
