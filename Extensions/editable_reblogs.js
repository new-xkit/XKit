//* TITLE Editable Reblogs **//
//* VERSION 2.0.2 **//
//* DESCRIPTION	Restores ability to edit previous reblogs of a post **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.editable_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.interface.post_window_listener.add("editable_reblogs", XKit.extensions.editable_reblogs.post_window);
		XKit.tools.add_css(".post-form--header .reblog-title {margin: 10px;} .", "editable_reblogs_remove_content_tree");
	},

	post_window: function() {
		var is_legacy = $(".reblog-tree").length > 0;
		if (is_legacy) {
			XKit.extensions.editable_reblogs.post_window_legacy();
			return;
		}
		var reblog_tree = $(".post-form .reblog-list");
		if (reblog_tree.length <= 0) {
			return;
		}

		var all_quotes = [];
		// Guard against double evaluation by marking the tree as processed
		var processed_class = 'xkit-editable-reblogs-done';
		if (reblog_tree.hasClass(processed_class)) {
			return;
		}
		reblog_tree.addClass(processed_class);

		var title = reblog_tree.find('.reblog-title');
		$('.post-form--header').append(title);
		reblog_tree.find( ".reblog-list-item" ).each(function( index ) {
			var reblog_data = {
				reblog_content: $(this).find('.reblog-content').html(),
				reblog_author: $(this).find('.reblog-tumblelog-name').text(),
				reblog_url: $(this).find('.reblog-tumblelog-name').attr('href')
			};
			all_quotes.push(reblog_data);
		});
		var all_quotes_text = "";
		all_quotes.forEach(function(data, index, all) {
			//don't wrap if the previous user didn't add a comment
			if (data.reblog_content.indexOf("</blockquote>", data.reblog_content.length - 13) !== -1) {
				all_quotes_text = data.reblog_content;
			} else {
				all_quotes_text = "<p><a class='tumblr_blog' href='" + data.reblog_url + "'>" + data.reblog_author + "</a>:</p><blockquote>" + all_quotes_text + data.reblog_content + "</blockquote>";
			}		
		});
		var old_content = XKit.interface.post_window.get_content_html();
		XKit.interface.post_window.set_content_html(all_quotes_text + old_content);

		$(".btn-remove-trail .icon").click();
		$(".control-reblog-trail").hide();
	},
	post_window_legacy: function() {
		var reblog_tree = $(".reblog-tree");
		if (reblog_tree.length <= 0) {
			return;
		}

		// Guard against double evaluation by marking the tree as processed
		var processed_class = 'xkit-editable-reblogs-done';
		if (reblog_tree.hasClass(processed_class)) {
			return;
		}
		reblog_tree.addClass(processed_class);

		// Convert all of the user links to have class tumblr_blog
		var top_quote_link = reblog_tree.find('p:first-child > a:first-child');
		var quote_links = reblog_tree.find('blockquote > p:first-child > a:first-child');

		if (top_quote_link.length > 0) {
			$(top_quote_link[0]).addClass('tumblr_blog');
		}
		quote_links.each(function() {
			$(this).addClass('tumblr_blog');
		});

		var reblog_content = reblog_tree.html();

		var old_content = XKit.interface.post_window.get_content_html();
		XKit.interface.post_window.set_content_html(reblog_content + old_content);

		$(".btn-remove-tree").click();
	},
	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("editable_reblogs_remove_content_tree");
		XKit.interface.post_window_listener.remove("editable_reblogs");
	}
});
