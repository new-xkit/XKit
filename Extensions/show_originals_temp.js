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
		
		const mini_ui = `
				.xblacklist_blacklisted_post {
					opacity: 1 !important;
					padding: 0 !important;
					border: 1px dashed var(--transparent-white-40, rgba(255,255,255,.43)) !important;
					background: transparent !important;
				}
				.xblacklist_blacklisted_post .post_avatar,
				.xblacklist_blacklisted_post .post_permalink {
					display: none !important;
				}
				.xblacklist_excuse_container {
					background: transparent !important;
				}
				.xblacklist_blacklisted_post .xblacklist_excuse {
					height: 40px !important;
					line-height: 40px !important;
					color: var(--transparent-white-40, rgba(255,255,255,.43));
					padding: 0;
					margin: 0;
					padding-left: 15px;
				}
				.xblacklist_blacklisted_post .xblacklist_open_post,
				.xblacklist_blacklisted_post .post_tags {
					display: none;
				}
				.xblacklist_blacklisted_post:hover .xblacklist_open_post {
					display: inline-block;
					height: unset;
					line-height: initial;
					top: 50% !important;
					transform: translateY(-50%);
					margin: 0;
				}
				.xkit--react .xblacklist_open_post {
					color: rgba(var(--rgb-white-on-dark), 0.8);
					background: rgba(var(--rgb-white-on-dark), 0.05);
					border-color: rgba(var(--rgb-white-on-dark), 0.3);
				}
				.xkit--react .xblacklist_open_post:hover {
					color: var(--white-on-dark);
					background: rgba(var(--rgb-white-on-dark), 0.1);
					border-color: rgba(var(--rgb-white-on-dark), 0.5);
				}
				
				.xblacklist_excuse_container ~ * {
	                display: none;
                }
			`;

			XKit.tools.add_css(mini_ui, "blacklist");

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
			$this.addClass('xblacklist_blacklisted_post');
			
			const cause = 'hi';
			const post_type_div = '';
			
			const excuse = `
			<div class="xblacklist_excuse_container">
				<div class="xblacklist_excuse">
					${cause}
					${post_type_div}
					<div class="xkit-button xblacklist_open_post">
						Show it anyway
					</div>
				</div>
			</div>
		`;
			
			$this.prepend(excuse);
			
			//$this.on('click', '.xblacklist_open_post', this.unhide_post);
			$this.on('click', '.xblacklist_open_post', XKit.extensions.hidepostswithblacklist.unhide_post);
			
			if ($this.hasClass("xkit-shorten-posts-shortened")) {
			    $this.find('.xkit-shorten-posts-embiggen').hide();
			    $this.attr('data-xkit-blacklist-old-height', $post.css("height"));
			    $this.css('height', 'auto');
			}

		});
	},

    unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.xblacklist_blacklisted_post');
		const $excuse = $button.parents('.xblacklist_excuse_container');

		if ($post.hasClass('xkit-shorten-posts-shortened')) {
			$post.find('.xkit-shorten-posts-embiggen').show();
			$post.css('height', $post.attr('data-xkit-blacklist-old-height'));
		}

		$post.removeClass('xblacklist_blacklisted_post');
		$excuse.remove();
	},



	destroy: function() {
		this.running = false;
	}

});