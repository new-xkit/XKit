//* TITLE Don't stretch photosets **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Don't allow images in photosets to be stretched past their “natural” length. **//
//* DEVELOPER Rebecca Turner **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.dont_stretch_photosets = new Object({
	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("dont_stretch_photosets");
	},

	destroy: function() {
		XKit.tools.remove_css("dont_stretch_photosets");
		this.running = false;
	}
});
