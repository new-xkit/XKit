//* TITLE Show Picture Size **//
//* VERSION 1.0.3 **//
//* DESCRIPTION Shows the resolution of media post pictures in the upper right corner of the picture **//
//* DEVELOPER TiMESPLiNTER **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.show_picture_size = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (XKit.interface.where().dashboard !== true) { return; }

		XKit.tools.init_css('show_picture_size');

		XKit.extensions.show_picture_size.post_listener();

		XKit.post_listener.add('show_picture_size', XKit.extensions.show_picture_size.post_listener);
	},

	destroy: function() {
		$('.post.xkit-show-picture-size .show-picture-size').remove();
		$('.post.xkit-show-picture-size').removeClass('xkit-show-picture-size');
		XKit.tools.remove_css('show_picture_size');
		XKit.post_listener.remove('show_picture_size');

		this.running = false;
	},

	post_listener: function() {
		var posts = XKit.interface.get_posts('xkit-show-picture-size');

		$(posts).each(function() {
			var post = XKit.interface.post($(this));

			if (post.type === 'photo') {
                // Photo
				$(this).find('.post_media .post_media_photo').each(function() {
					var photo = $(this);
					var photoLink = $(this).parent('.post_media_photo_anchor');
					var tmpImg = new Image();

					if (photoLink.length == 1 && !!photoLink.attr('data-big-photo')) {
						tmpImg.src = photoLink.attr('data-big-photo');
					} else {
						tmpImg.src = photo.attr('src');
					}

					$(tmpImg).one('load', function() {
						photo.closest('.post_media').append($('<div class="show-picture-size">' + tmpImg.width + 'x' + tmpImg.height + '</div>'));
					});
				});
			} else if (post.type === 'photoset') {
                // Photo set
				$(this).find('.photoset_photo').each(function() {
					var photoLink = $(this);

					var tmpImg = new Image();
					tmpImg.src = $(this).attr('href');
					$(tmpImg).one('load', function() {
						photoLink.append($('<div class="show-picture-size">' + tmpImg.width + 'x' + tmpImg.height + '</div>'));
					});
				});
			}

			$(this).addClass('xkit-show-picture-size');
		});
	}
});
