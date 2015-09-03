//* TITLE Restore Old Reblogs **//
//* VERSION 1.0.1 **//
//* DESCRIPTION	Restores the old reblogging style on the Dashboard **//
//* DEVELOPER eli <eli@csh.rit.edu> (forked from Editable Reblogs by dlmarquis) **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.old_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.post_listener.add("old_reblogs", XKit.extensions.old_reblogs.main);
		XKit.extensions.old_reblogs.main();
	},

	main: function() {
		var post_list = $(".post_content_inner");
		if (post_list.length <= 0) {
			return;
		}

		post_list.each(function() {
			var reblog_chain = $(this).find("div.reblog-list");
			var reblog_text = $(this).find("div.contributed-content > div.reblog-content");

			// Guard against double evaluation by marking the tree as processed
			var processed_class = 'xkit-old-reblogs-done';
			if (reblog_chain.hasClass(processed_class)) {
				return;
			}
			reblog_chain.addClass(processed_class);

			var users_chain = reblog_chain.find('a.reblog-tumblelog-name');
			var content_chain = reblog_chain.find('div.reblog-content');
			var reblog_content = '<div class="reblog-list-item"><div class="reblog-content">';

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

			reblog_chain.html(reblog_content);
		});
	},

	destroy: function() {
		this.running = false;
		XKit.interface.post_window_listener.remove("old_reblogs");
	}
});