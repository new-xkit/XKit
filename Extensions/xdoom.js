//* TITLE XDoom **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Can Tumblr run Doom? **//
//* DETAILS Yes. Yes it can. I promise we still work on bug fixes and other things sometimes! **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.xdoom = new Object({

	running: false,
	xdoomPost: `<li id="xdoom_post" class="post_container" data-pageable="post_xdoom">
			<div class="post post_full is_video not_mine" id="post_164195587730" data-type="video">
				<div class="post_avatar show_user_menu post-avatar--sticky ">
					<div class="post_avatar_wrapper">
						<a
							class="post_avatar_link"
							href="https://new-xkit-extension.tumblr.com/"
							target="_blank"
							data-peepr="{&quot;tumblelog&quot;:&quot;new-xkit-extension&quot;}" 
							title="XDoomguy"
							style="background-image: url(&quot;http://files.gamebanana.com/img/ico/sprays/530-90_54ef9af46280b.jpg&quot;);"
						></a>
					</div>
				</div>
				<div class="post_wrapper">
					<div class="post_content clearfix">
						<div class="post_content_inner clearfix">
							<div class="post_media" style="width: px; height: px;">
								<div id="xdoom_scrolldiv" style=" width: 640px; height: 425px; position: relative; overflow: hidden; transform: scale(.85); margin-left: -50px;">
									<iframe name="xdoom_iframe" id="xdoom_iframe" src="https://js-dos.com/games/doom.exe.html" scrolling="no" style="width: 1000px;height: 1000px;/* transform: scale(0.85); *//* margin-left: -50px; */margin-top: -6px;margin-left: -20px;" data-ss1502759293="1" data-ss1502763280="1"></iframe>
								</div>
							</div>
							<div class="reblog-list">
								<div class="reblog-list-item original-reblog-content">
									<div class="reblog-header">
										<a class="reblog-avatar post_sub_avatar" href="#" rel="noopener">
											<img class="reblog-avatar-image-thumb" src="http://files.gamebanana.com/img/ico/sprays/530-90_54ef9af46280b.jpg">
										</a>
										<a class="reblog-tumblelog-name post_info_link" href="https://new-xkit-extension.tumblr.com">Doomguy</a>
									</div>
									<div class="reblog-content">
										<p>Play some Doom!</p>
										<p>If the game doesn't capture your keyboard input, click on one of the black borders above or below the game</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="post-source-footer">
						<span class="post-source-name-prefix">Source:</span>
						<a id="xdoom-source-link" class="post-source-link post_info_link" target="_blank" title="XDoom" rel="noopener" style="cursor: pointer;">New XKit</a>
					</div>
					<div class="post_footer clearfix" data-subview="footer"></div>
				</div>
			</div>
		</li>`,

	run: function() {
		this.running = true;
		$(this.xdoomPost).insertAfter("#new_post_buttons");

		$("xdoom_iframe").load(function() {
			console.log("IFRAME IS LOADED");
			$("#xdoom_iframe")[0].window.scrollTo(38, 20);
		});

		$("#xdoom-source-link").click(function() {
			XKit.extensions.xkit_preferences.open();
			while (!('*[data-extension-id="xdoom"]')) {
				continue;
			}
			$('*[data-extension-id="xdoom"]').click();
		});
	},

	destroy: function() {
		this.running = false;
		$("#xdoom_post").remove();
	}

});
