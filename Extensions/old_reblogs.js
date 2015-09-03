//* TITLE Restore Old Reblogs **//
//* VERSION 1.0.1 **//
//* DESCRIPTION	Restores the old reblogging style **//
//* DEVELOPER eli <eli@csh.rit.edu> (forked from Editable Reblogs by dlmarquis) **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.old_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.interface.post_window_listener.add("old_reblogs", XKit.extensions.old_reblogs.post_window);
		XKit.tools.add_css(".btn-toggle-reblog {display: none; }", "old_reblogs_remove_content_chain");
		XKit.tools.add_css(".xkit-old-reblogs-done {display: none; }", "old_reblogs_remove_content_chain");
	},

	post_window: function() {
		var reblog_chain = $(".reblog-list");
		if (reblog_chain.length <= 0) {
			return;
		}

		// Guard against double evaluation by marking the tree as processed
		var processed_class = 'xkit-old-reblogs-done';
		if (reblog_chain.hasClass(processed_class)) {
			return;
		}
		if (reblog_chain.attr('data-subview') === "reblogCollectionView") {
			reblog_chain.addClass(processed_class);
		}

		// re-enable display of the reblog chain when the form is closed
		$(".post-form--close").click(function({
			reblog_chain.delClass(processed_class);
		});

		// Convert all of the user links to have class tumblr_blog
		var users_chain = reblog_chain.find('div.reblog-tumblelog-name');
		var content_chain = reblog_chain.find('div.reblog-content');

		var reblog_content = "";

		if (top_quote_link.length > 0) {
			$(top_quote_link[0]).addClass('tumblr_blog');
		}
		
		$(users_chain.get().reverse()).each(function() {
			reblog_content += '<p><a class="tumblr_blog" href="' + $(this).attr('href') + '">' + $(this).html() + '</a><blockquote>';
		});
		content_chain.each(function() {
			reblog_content += $(this).html();
			reblog_content += '</blockquote></p>';
		});

		console.log(reblog_content);
		var old_content = XKit.interface.post_window.get_content_html();
		XKit.interface.post_window.set_content_html(reblog_content + old_content);

		$(".btn-remove-tree").click();
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_reblogs_remove_content_chain");
		XKit.interface.post_window_listener.remove("old_reblogs");
	}
});