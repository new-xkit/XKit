//* TITLE Auto Load Images **//
//* VERSION 0.1.3 **//
//* DESCRIPTION Load inline photos automatically **//
//* DETAILS This extension removes the &quot;gray box&quot; that appears on the photos attached to non-photo posts, allowing the photos to load automatically without you having to click on them. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.autoloadimages = new Object({

	running: false,

	run: function() {

		this.running = true;

		if ($(".posts .post").length === 0) {return; }

		XKit.post_listener.add("autoloadimages", XKit.extensions.autoloadimages.do);
		XKit.extensions.autoloadimages.do();

	},

	do: function() {

		var posts = XKit.interface.get_posts("xkit-autoloadimages-done");

		$(posts).each(function() {

			$(this).addClass("xkit-autoloadimages-done");

			if ($(this).find(".external-image-wrapper").length > 0) {

				$(this).find(".external-image-wrapper").each(function() {

					$(this).before("<p><img src='" + $(this).attr('data-src') + "' /></p>");
					$(this).remove();

				});

			}

		});

	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("autoloadimages");
	}

});
