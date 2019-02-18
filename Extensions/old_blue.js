//* TITLE Old Blue **//
//* VERSION 0.1.1 **//
//* DESCRIPTION No more dark blue background! **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_blue = new Object({

	running: false,

	run: function() {
		this.running = true;
		if (XKit.interface.is_tumblr_page()) {
			XKit.tools.init_css("old_blue");
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_blue");
	}

});
