//* TITLE Vanilla Videos **//
//* VERSION 0.0.2 **//
//* DESCRIPTION Make the video player unexciting **//
//* DETAILS Use the browser-default video player that won't follow you, loop, or autoplay. Only works on Tumblr's player. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA true **//
//* SLOW true **//

XKit.extensions.vanilla_video = {
	running: false,
	run: function() {
		this.running = true;
		XKit.post_listener.add('vanilla_video', XKit.extensions.vanilla_video.check);
		XKit.extensions.vanilla_video.check();
	},

	check: function() {
		var doneClass = 'xvanilla_video-done';
		$('.posts .post').not('.' + doneClass).each(function() {
			var post = $(this);
			post.addClass(doneClass);
			var videoEmbeds = post.find('.dockable_video_embed');
			videoEmbeds.each(function() {
				var videoEmbed = $(this);
				if (videoEmbed.attr('data-embed-service') !== 'tumblr_video') {
					return;
				}
				var sources = videoEmbed.find('video > source');
				var newVideo = document.createElement('video');
				sources.each(function() {
					var clonedSource = document.createElement('source');
					clonedSource.type = this.type;
					clonedSource.src = this.src;
					newVideo.appendChild(clonedSource);
				});
				newVideo.controls = true;
				newVideo.style.width = '100%';

				videoEmbed.replaceWith(newVideo);
			});
		});
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove('vanilla_video');
	}
};
