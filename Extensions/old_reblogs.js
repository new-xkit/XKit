//* TITLE Restore Old Reblogs **//
//* VERSION 1.1.1 **//
//* DESCRIPTION	Restores the old reblogging style on the Dashboard **//
//* DEVELOPER eli <eli@csh.rit.edu> (forked from Editable Reblogs by dlmarquis) **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.old_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.post_listener.add("old_reblogs", XKit.extensions.old_reblogs.main);
		XKit.tools.add_css('.xkit-old-reblogs-done div.reblog-list { display: none }','xkit_old_reblogs_remove_reblog_list');
		XKit.tools.add_css('.xkit-old-reblogs-done div.contributed-content { display: none }','xkit_old_reblogs_remove_reblog_content');
		XKit.extensions.old_reblogs.main();
	},

	main: function() {
		var posts = XKit.interface.get_posts('xkit-old-reblogs-done', false);
		window.console.log(posts);
		if (posts.length <= 0) {
			// no posts
			return;
		}

		$(posts).each(function() {
			// get the reblog-list for the post
			var reblog_chain = $(this).find("div.reblog-list");
			// get the text that the user added to the post (might not exist but it's
			// sanity checked later)
			var reblog_text = $(this).find("div.contributed-content > div.reblog-content");

			// Guard against double evaluation by marking the tree as processed
			var processed_class = 'xkit-old-reblogs-done';
			if ($(this).hasClass(processed_class)) {
				return;
			}
			$(this).addClass(processed_class);

			var users_chain = reblog_chain.find('a.reblog-tumblelog-name');
			var content_chain = reblog_chain.find('div.reblog-content');

			// reconstitute the text post
			var reblog_content = '<div class="reblog-list-item xkit-old-reblogs-new"><div class="reblog-content">';

			$(users_chain.get().reverse()).each(function() {
				reblog_content += '<p><a class="tumblr_blog" href="' + $(this).attr('href') + '">' + $(this).html() + '</a>:<blockquote>';
			});
			content_chain.each(function() {
				reblog_content += $(this).html();
				reblog_content += '</blockquote></p>';
			});
			if (typeof(reblog_text.html()) !== "undefined") {
				// add the user's reblog text to the bottom
				reblog_content += '<p>';
				reblog_content += reblog_text.html();
				reblog_content += '</p>';
			}
			reblog_content += '</div></div>';

			// add the newly formatted text to the post body
			$(this).find('.post_content_inner').append(reblog_content);
		});
	},

	destroy: function() {
		$("div.xkit-old-reblogs-new").remove();
		$('.xkit-old-reblogs-done').each(function() {
			$(this).removeClass('xkit-old-reblogs-done');
		});

		this.running = false;
		XKit.tools.remove_css("xkit_old_reblogs_remove_reblog_list");
		XKit.tools.remove_css("xkit_old_reblogs_remove_reblog_content");
		XKit.interface.post_window_listener.remove("old_reblogs");
	}
});