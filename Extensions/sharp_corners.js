//* TITLE sharplr **//
//* VERSION 1.0.1 **//
//* DESCRIPTION No rounded corners, anywhere. The opposite of bubblr. **//
//* DEVELOPER 9999years **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.sharp_corners = new Object({
	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("sharp_corners");
	},

	destroy: function() {
		XKit.tools.remove_css("sharp_corners");
		this.running = false;
	}
});
