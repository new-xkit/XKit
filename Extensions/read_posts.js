//* TITLE Read Posts **//
//* VERSION 0.2.4 **//
//* DESCRIPTION Dim old posts **//
//* DETAILS Dims the posts on the dashboard that you've already seen on previous page loads. **//
//* DEVELOPER jesskay **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.read_posts = new Object({

	running: false,

	preferences: {
		"dim_avatars_only": {
			text: "Dim only the avatars on read posts.",
			default: false,
			value: false
		}
	},

	undimmed_post: null,
	currently_undimming: false,

	post_selector: "[data-id]",

	run: function() {
		XKit.tools.init_css('read_posts');
		XKit.post_listener.add('read_posts_process', this.process_posts);
		this.process_posts();
		$(document).on("click", `${XKit.extensions.read_posts.post_selector} footer`, XKit.extensions.read_posts.undim);
		$(document).on("click", XKit.extensions.read_posts.redim);

		this.running = true;
	},

	redim: function(e) {
		// This is less broken and meh.
		if (!XKit.extensions.read_posts.undimmed_post || XKit.extensions.read_posts.currently_undimming) {
			//we don't currently have a post that needs redimming
			XKit.extensions.read_posts.currently_undimming = false;
			return;
		}
		var m_obj = $(XKit.extensions.read_posts.undimmed_post)[0];
		$(m_obj).addClass("read_posts_read");
		if (XKit.extensions.read_posts.preferences.dim_avatars_only.value === true) {
			$(m_obj).addClass('read_posts_avatar_only');
		}
		XKit.extensions.read_posts.undimmed_post = null;
		XKit.extensions.read_posts.currently_undimming = false;
	},

	undim: function(e) {
		XKit.extensions.read_posts.currently_undimming = true;
		var m_obj = $(e.target)[0];
		if (!m_obj.hasAttribute("data-id")) {
			m_obj = $(m_obj).parentsUntil(XKit.extensions.read_posts.post_selector).parent();
		}
		if (!m_obj.hasClass("read_posts_read")) {
			return;
		} else {
			XKit.extensions.read_posts.undimmed_post = m_obj;
			$(m_obj).removeClass("read_posts_read");
			$(m_obj).removeClass('read_posts_avatar_only');
		}
	},

	mark_post_read: function(post_id) {
		var read_posts = JSON.parse(XKit.storage.get('read_posts', 'read_posts', '[]'));

		if (XKit.storage.quota('read_posts') <= (post_id.length + 50)) {
			/* drop oldest ~33.3% of posts to make room for new */
			read_posts = read_posts.slice(Math.round(read_posts.length / 2));
		}

		read_posts.push(post_id);
		XKit.storage.set('read_posts', 'read_posts', JSON.stringify(read_posts));
	},

	post_is_read: function(post_id) {
		var read_posts = JSON.parse(XKit.storage.get('read_posts', 'read_posts', '[]'));
		if (read_posts.indexOf(post_id) > -1) {
			return true;
		} else {
			return false;
		}
	},

	process_posts: async function() {
		if (!XKit.interface.where().dashboard) {
			return;  /* don't run on non-dashboard, since that can be in the background of a new post page */
		}

		await XKit.css_map.getCssMap();
		var avatarSelector = XKit.css_map.keyToCss("avatar");

		$('#base-container [data-id]').not('.read_posts_done').not(".xkit_view_on_dash_post").each(function(index) {
			var post_id = $(this).data('id');

			if (XKit.extensions.read_posts.post_is_read(post_id)) {
				$(this).addClass('read_posts_read');
				if (XKit.extensions.read_posts.preferences.dim_avatars_only.value === true) {
					$(this).addClass('read_posts_avatar_only');

					$(this).find(avatarSelector).addClass("read_posts_post_avatar");
				}
			} else {
				XKit.extensions.read_posts.mark_post_read(post_id);
			}

			$(this).addClass('read_posts_done');
		});
	},

	remove_classes: function() {
		$(`${XKit.extensions.read_posts.post_selector}.read_posts_done`).removeClass('read_posts_done');
		$(`${XKit.extensions.read_posts.post_selector}.read_posts_read`).removeClass('read_posts_read');
		$(`${XKit.extensions.read_posts.post_selector}.read_posts_avatar_only`).removeClass('read_posts_avatar_only');
		$(`${XKit.extensions.read_posts.post_selector}.read_posts_post_avatars`).removeClass('read_posts_post_avatar');
	},

	destroy: function() {
		this.remove_classes();
		XKit.tools.remove_css('read_posts');
		XKit.post_listener.remove('read_posts_process');
		$("document").off("click", `${XKit.extensions.read_posts.post_selector} footer`, XKit.extensions.read_posts.undim);
		this.running = false;
	}

});
